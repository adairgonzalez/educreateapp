'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/utils/supabase/client';
import { LearningProfile } from '@/types/learning';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const styleDescriptions = {
  visual: 'You learn best through visual aids like diagrams, charts, and videos.',
  auditory: 'You learn best through listening and discussion.',
  reading: 'You learn best through reading and writing.',
  kinesthetic: 'You learn best through hands-on practice and physical activities.',
};

const styleIcons = {
  visual: '👁️',
  auditory: '👂',
  reading: '📚',
  kinesthetic: '🤸',
};

export function LearningInsights() {
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // First try to get existing profile
        const { data: existingProfile } = await supabase
          .from('learning_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // If profile exists, use it
        if (existingProfile) {
          setProfile(existingProfile);
          return;
        }

        // If no profile exists, create one with default values
        const { data: newProfile, error: createError } = await supabase
          .from('learning_profiles')
          .insert({
            id: user.id,
            learning_style: 'visual',
            preferred_subjects: [],
            difficulty_level: 'beginner',
            watch_history: [],
            quiz_results: [],
            study_patterns: {},
            content_interaction_patterns: {
              video_interactions: [],
              text_interactions: [],
              interactive_elements: [],
              navigation_patterns: [],
            },
            daily_learning_analysis: {
              date: null,
              interaction_count: 0,
              content_type_distribution: {},
              average_engagement_time: {},
              preferred_study_times: [],
            },
            weekly_learning_analysis: {
              week_start_date: null,
              aggregated_style_weights: {
                visual: 0.25,
                auditory: 0.25,
                reading: 0.25,
                kinesthetic: 0.25,
              },
              dominant_patterns: [],
              weekly_progress: {
                total_interactions: 0,
              },
            },
            interaction_metrics: {
              total_interactions: 0,
              last_analysis_timestamp: null,
              daily_interaction_threshold: 10,
              style_confidence_score: 0,
            },
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(newProfile);
      } catch (error) {
        console.error('Error in loadProfile:', error);
      }
    }

    loadProfile();
  }, []);

  if (!profile) {
    return <div>Loading insights...</div>;
  }

  const confidenceScore = profile.interaction_metrics.style_confidence_score;
  const dominantStyle = profile.learning_style;

  return (
    <div className="space-y-6">
      <Card className="relative bg-background/80 backdrop-blur-[6px] border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="featured-vertical-hard-blur-bg" />
          <div className="featured-soft-blur-bg" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 featured-price-title">
            Your Learning Style {styleIcons[dominantStyle]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-lg font-medium capitalize mb-2">{dominantStyle}</p>
              <p className="text-muted-foreground">{styleDescriptions[dominantStyle]}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Style Confidence</span>
                <span>{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-background/80 backdrop-blur-[6px] border-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="featured-vertical-hard-blur-bg opacity-20" />
          <div className="featured-soft-blur-bg opacity-30" />
        </div>
        <CardHeader>
          <CardTitle className="featured-price-title">Learning Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-[6px]">
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                Daily Insights
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Weekly Progress
              </TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              {profile.daily_learning_analysis.date ? (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Content Distribution</h4>
                    {Object.entries(profile.daily_learning_analysis.content_type_distribution).map(([type, count]) => (
                      <div key={type} className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{type}</span>
                          <span>{count} interactions</span>
                        </div>
                        <Progress
                          value={(count / profile.daily_learning_analysis.interaction_count) * 100}
                          className="h-1 bg-primary/10"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Preferred Study Times</h4>
                    <div className="flex gap-2">
                      {profile.daily_learning_analysis.preferred_study_times.map((time) => (
                        <span
                          key={time}
                          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm backdrop-blur-[6px]"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No daily analysis available yet. Keep learning!</p>
              )}
            </TabsContent>
            <TabsContent value="weekly" className="space-y-4">
              {profile.weekly_learning_analysis.week_start_date ? (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Style Distribution</h4>
                    {Object.entries(profile.weekly_learning_analysis.aggregated_style_weights).map(
                      ([style, weight]) => (
                        <div key={style} className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{style}</span>
                            <span>{Math.round(weight * 100)}%</span>
                          </div>
                          <Progress value={weight * 100} className="h-1 bg-primary/10" />
                        </div>
                      ),
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Learning Patterns</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.weekly_learning_analysis.dominant_patterns.map((pattern) => (
                        <span
                          key={pattern}
                          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm backdrop-blur-[6px]"
                        >
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No weekly analysis available yet. Check back after more learning!
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
