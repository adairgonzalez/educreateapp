'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { LearningStyleTracker } from '@/services/learning-style-tracker';
import { LearningStyle } from '@/types/learning';
import { Progress } from '@/components/ui/progress';

const assessmentQuestions = [
  {
    id: 1,
    question: 'How do you prefer to learn new concepts?',
    options: [
      { value: 'visual', label: 'Through diagrams and videos' },
      { value: 'auditory', label: 'By listening to explanations' },
      { value: 'reading', label: 'By reading text materials' },
      { value: 'kinesthetic', label: 'Through hands-on practice' },
    ],
  },
  {
    id: 2,
    question: 'When trying to remember information, what works best for you?',
    options: [
      { value: 'visual', label: 'Visualizing images or diagrams' },
      { value: 'auditory', label: 'Repeating it out loud' },
      { value: 'reading', label: 'Reading notes or text' },
      { value: 'kinesthetic', label: 'Writing it down or practicing it' },
    ],
  },
  {
    id: 3,
    question: 'What type of study materials do you find most helpful?',
    options: [
      { value: 'visual', label: 'Charts, graphs, and visual aids' },
      { value: 'auditory', label: 'Recorded lectures and discussions' },
      { value: 'reading', label: 'Textbooks and written materials' },
      { value: 'kinesthetic', label: 'Interactive exercises and practice problems' },
    ],
  },
];

interface LearningStyleAssessmentProps {
  onComplete: () => void;
}

export function LearningStyleAssessment({ onComplete }: LearningStyleAssessmentProps) {
  const [answers, setAnswers] = useState<Record<number, LearningStyle>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Calculate dominant learning style from answers
      const learningStyle = calculateLearningStyle(answers);

      // Initialize the learning style tracker
      const tracker = new LearningStyleTracker();

      // Track this assessment as an interaction
      await tracker.trackInteraction({
        type: 'interactive',
        duration: 0,
        metadata: {
          assessmentAnswers: answers,
          calculatedStyle: learningStyle,
        },
        timestamp: new Date().toISOString(),
      });

      // Update learning profile in database
      const { error } = await supabase.from('learning_profiles').upsert({
        id: user.id,
        learning_style: learningStyle,
        interaction_metrics: {
          total_interactions: Object.keys(answers).length,
          last_analysis_timestamp: new Date().toISOString(),
          daily_interaction_threshold: 10,
          style_confidence_score: calculateConfidenceScore(answers),
        },
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Call onComplete to switch back to recommendations
      onComplete();
    } catch (error) {
      console.error('Error saving learning style:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function calculateLearningStyle(answers: Record<number, LearningStyle>): LearningStyle {
    // Count occurrences of each learning style
    const counts = Object.values(answers).reduce(
      (acc, style) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Return the most frequent style
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0] as LearningStyle;
  }

  function calculateConfidenceScore(answers: Record<number, LearningStyle>): number {
    const totalQuestions = assessmentQuestions.length;
    const answeredQuestions = Object.keys(answers).length;
    const dominantStyle = calculateLearningStyle(answers);
    const dominantCount = Object.values(answers).filter((style) => style === dominantStyle).length;

    // Calculate confidence based on completion and consistency
    const completionScore = (answeredQuestions / totalQuestions) * 50;
    const consistencyScore = (dominantCount / answeredQuestions) * 50;

    return Math.round(completionScore + consistencyScore);
  }

  const progress = (Object.keys(answers).length / assessmentQuestions.length) * 100;

  return (
    <Card className="bg-background/50 backdrop-blur-[24px] border-border p-6">
      <CardHeader className="p-0 space-y-2">
        <CardTitle>Learning Style Assessment</CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="pt-6">
        {assessmentQuestions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="mb-4 font-medium">{q.question}</p>
            <RadioGroup
              onValueChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value as LearningStyle }))}
              value={answers[q.id]}
            >
              {q.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                  <Label htmlFor={`${q.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < assessmentQuestions.length || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Analyzing...' : 'Submit Assessment'}
        </Button>
      </CardContent>
    </Card>
  );
}
