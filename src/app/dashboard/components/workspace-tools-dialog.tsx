'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const aiTools = [
  {
    title: 'AI Flashcards',
    description: 'Create and study flashcards enhanced by AI for better retention',
    icon: '📚',
  },
  {
    title: 'Smart Quiz Generator',
    description: 'Generate personalized quizzes based on your study material',
    icon: '📝',
  },
  {
    title: 'Memory Games',
    description: 'Interactive games designed to improve memory and recall',
    icon: '🎮',
  },
  {
    title: 'Study Buddy AI Chat',
    description: 'Chat with an AI tutor to help you understand complex topics',
    icon: '🤖',
  },
  {
    title: 'Mind Map Creator',
    description: 'Visualize concepts and their relationships with AI assistance',
    icon: '🗺️',
  },
  {
    title: 'Practice Problems',
    description: 'AI-generated practice problems tailored to your level',
    icon: '✏️',
  },
];

export function WorkspaceToolsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Space
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border-none">
        <DialogHeader>
          <DialogTitle>Create New Learning Space</DialogTitle>
          <DialogDescription>Choose an AI-powered tool to enhance your learning experience</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {aiTools.map((tool) => (
            <Card
              key={tool.title}
              className="p-4 bg-background/20 backdrop-blur-sm border-0 hover:bg-background/40 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <div className="text-2xl">{tool.icon}</div>
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
