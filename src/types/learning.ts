export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface NavigationData {
  path: string;
  timestamp: string;
  duration?: number;
}

export interface InteractionData {
  type: 'video' | 'text' | 'interactive' | 'navigation';
  duration?: number;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ContentInteractionPatterns {
  video_interactions: InteractionData[];
  text_interactions: InteractionData[];
  interactive_elements: InteractionData[];
  navigation_patterns: NavigationData[];
}

export interface DailyAnalysis {
  date: string | null;
  interaction_count: number;
  content_type_distribution: Record<string, number>;
  average_engagement_time: Record<string, number>;
  preferred_study_times: string[];
}

export interface WeeklyAnalysis {
  week_start_date: string | null;
  aggregated_style_weights: Record<LearningStyle, number>;
  dominant_patterns: string[];
  weekly_progress: {
    total_interactions: number;
  };
}

export interface InteractionMetrics {
  total_interactions: number;
  last_analysis_timestamp: string | null;
  daily_interaction_threshold: number;
  style_confidence_score: number;
}

export interface LearningProfile {
  id: string;
  learning_style: LearningStyle;
  preferred_subjects: string[];
  difficulty_level: DifficultyLevel;
  watch_history: any[]; // JSONB array in database
  quiz_results: any[]; // JSONB array in database
  study_patterns: Record<string, any>; // JSONB in database
  content_interaction_patterns: ContentInteractionPatterns;
  daily_learning_analysis: DailyAnalysis;
  weekly_learning_analysis: WeeklyAnalysis;
  interaction_metrics: InteractionMetrics;
  created_at: string;
  updated_at: string;
}
