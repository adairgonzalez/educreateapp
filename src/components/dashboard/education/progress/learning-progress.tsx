'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function LearningProgress() {
  const [progress, setProgress] = useState({
    overallMastery: 0,
    topicProgress: {} as Record<string, number>,
    recentActivities: [] as any[],
    achievements: [] as string[],
  });

  async function loadProgress() {
    // TODO: Implement actual progress loading from database
    setProgress({
      overallMastery: 60,
      topicProgress: {
        Mathematics: 75,
        Science: 65,
        'Study Skills': 80,
      },
      recentActivities: [],
      achievements: ['First Video Completed', 'Perfect Quiz Score'],
    });
  }

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
        <Progress value={progress.overallMastery} className="mb-4" />
        <div className="space-y-2">
          {Object.entries(progress.topicProgress).map(([topic, value]) => (
            <div key={topic}>
              <div className="flex justify-between text-sm mb-1">
                <span>{topic}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
        <div className="space-y-2">
          {progress.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>{achievement}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
