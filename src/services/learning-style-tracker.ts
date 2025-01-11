import { createClient } from '@/utils/supabase/client';
import type { LearningStyle, LearningProfile, InteractionData, NavigationData } from '../types/learning';

export class LearningStyleTracker {
  private supabase = createClient();

  async trackInteraction(interaction: InteractionData) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await this.supabase
      .from('learning_profiles')
      .select('content_interaction_patterns, interaction_metrics, weekly_learning_analysis')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    const patterns = profile.content_interaction_patterns;
    const metrics = profile.interaction_metrics;

    // Add new interaction to appropriate array
    patterns[`${interaction.type}_interactions`].push({
      ...interaction,
      timestamp: new Date().toISOString(),
    });

    // Update metrics
    metrics.total_interactions += 1;
    metrics.last_analysis_timestamp = new Date().toISOString();

    // Check if we should perform daily analysis
    if (metrics.total_interactions % metrics.daily_interaction_threshold === 0) {
      await this.performDailyAnalysis(user.id);
    }

    // Update the profile
    await this.supabase
      .from('learning_profiles')
      .update({
        content_interaction_patterns: patterns,
        interaction_metrics: metrics,
      })
      .eq('id', user.id);
  }

  private async performDailyAnalysis(userId: string) {
    const { data: profile } = await this.supabase
      .from('learning_profiles')
      .select('content_interaction_patterns, daily_learning_analysis, weekly_learning_analysis')
      .eq('id', userId)
      .single();

    if (!profile) return;

    const patterns = profile.content_interaction_patterns;
    const today = new Date().toISOString().split('T')[0];

    // Calculate content type distribution
    const distribution = {
      video: patterns.video_interactions.length,
      text: patterns.text_interactions.length,
      interactive: patterns.interactive_elements.length,
    };

    // Calculate average engagement time per content type
    const engagementTime = {
      video: this.calculateAverageEngagement(patterns.video_interactions),
      text: this.calculateAverageEngagement(patterns.text_interactions),
      interactive: this.calculateAverageEngagement(patterns.interactive_elements),
    };

    // Update daily analysis
    const dailyAnalysis = {
      date: today,
      interaction_count: Object.values(distribution).reduce((a, b) => a + b, 0),
      content_type_distribution: distribution,
      average_engagement_time: engagementTime,
      preferred_study_times: this.calculatePreferredTimes(patterns),
    };

    await this.supabase
      .from('learning_profiles')
      .update({
        daily_learning_analysis: dailyAnalysis,
      })
      .eq('id', userId);

    // Check if we should perform weekly analysis
    const lastWeeklyUpdate = new Date(profile.weekly_learning_analysis?.week_start_date || 0);
    const daysSinceLastWeekly = Math.floor((Date.now() - lastWeeklyUpdate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastWeekly >= 7) {
      await this.performWeeklyAnalysis(userId);
    }
  }

  private async performWeeklyAnalysis(userId: string) {
    const { data: profile } = await this.supabase
      .from('learning_profiles')
      .select('daily_learning_analysis, content_interaction_patterns')
      .eq('id', userId)
      .single();

    if (!profile) return;

    // Calculate style weights based on interaction patterns
    const styleWeights = this.calculateStyleWeights(profile.content_interaction_patterns);

    const weeklyAnalysis = {
      week_start_date: new Date().toISOString(),
      aggregated_style_weights: styleWeights,
      dominant_patterns: this.identifyDominantPatterns(profile.content_interaction_patterns),
      weekly_progress: {
        total_interactions:
          profile.content_interaction_patterns.video_interactions.length +
          profile.content_interaction_patterns.text_interactions.length +
          profile.content_interaction_patterns.interactive_elements.length,
      },
    };

    await this.supabase
      .from('learning_profiles')
      .update({
        weekly_learning_analysis: weeklyAnalysis,
        learning_style: this.getDominantStyle(styleWeights),
      })
      .eq('id', userId);
  }

  private calculateAverageEngagement(interactions: InteractionData[]): number {
    if (interactions.length === 0) return 0;
    const totalDuration = interactions.reduce((sum, int) => sum + (int.duration || 0), 0);
    return totalDuration / interactions.length;
  }

  private calculatePreferredTimes(patterns: LearningProfile['content_interaction_patterns']): string[] {
    // Group interactions by hour and find most frequent
    const allInteractions = [
      ...patterns.video_interactions,
      ...patterns.text_interactions,
      ...patterns.interactive_elements,
    ];

    const hourCounts: Record<number, number> = {};
    allInteractions.forEach((interaction) => {
      const hour = new Date(interaction.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Return top 3 preferred hours
    return Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`);
  }

  private calculateStyleWeights(
    patterns: LearningProfile['content_interaction_patterns'],
  ): Record<LearningStyle, number> {
    const weights: Record<LearningStyle, number> = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0,
    };

    // Weight calculation based on interaction patterns
    patterns.video_interactions.forEach(() => {
      weights.visual += 1;
      weights.auditory += 0.5;
    });

    patterns.text_interactions.forEach(() => {
      weights.reading += 1;
    });

    patterns.interactive_elements.forEach(() => {
      weights.kinesthetic += 1;
    });

    // Normalize weights
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    if (total > 0) {
      (Object.keys(weights) as LearningStyle[]).forEach((key) => {
        weights[key] = weights[key] / total;
      });
    }

    return weights;
  }

  private identifyDominantPatterns(patterns: LearningProfile['content_interaction_patterns']): string[] {
    const dominantPatterns = [];

    // Analyze video watching patterns
    if (patterns.video_interactions.length > 0) {
      const avgDuration = this.calculateAverageEngagement(patterns.video_interactions);
      if (avgDuration > 10) dominantPatterns.push('Long video engagement');
      else dominantPatterns.push('Short video preference');
    }

    // Analyze navigation patterns
    if (patterns.navigation_patterns.length > 0) {
      const uniquePaths = new Set(patterns.navigation_patterns.map((p: NavigationData) => p.path)).size;
      if (uniquePaths > 5) dominantPatterns.push('Exploratory learning');
      else dominantPatterns.push('Focused learning');
    }

    return dominantPatterns;
  }

  private getDominantStyle(weights: Record<LearningStyle, number>): LearningStyle {
    return Object.entries(weights).sort(([, a], [, b]) => b - a)[0][0] as LearningStyle;
  }
}
