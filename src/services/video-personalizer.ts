import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@/utils/supabase/client';

interface StudentProfile {
  learningStyle: string[];
  comprehensionLevel: number;
  preferredSubjects: string[];
  difficultyLevel: string;
}

interface PersonalizedContent {
  content: string;
  sections: {
    title: string;
    content: string;
    visualAids: string[];
    exercises: string[];
    examples: string[];
  }[];
  assessments: {
    type: 'quiz' | 'practice' | 'reflection';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export class VideoContentPersonalizer {
  private claude: Anthropic;
  private supabase;

  constructor() {
    this.claude = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '',
      dangerouslyAllowBrowser: true,
    });
    this.supabase = createClient();
  }

  async personalizeVideo(videoId: string, studentProfile: StudentProfile): Promise<PersonalizedContent> {
    try {
      // 1. Get video content from database or YouTube
      const { data: video } = await this.supabase.from('videos').select('*').eq('youtube_id', videoId).single();

      // 2. Analyze video content
      const analysis = await this.analyzeContent(video.transcript);

      // 3. Generate personalized content
      const personalizedContent = await this.generatePersonalizedContent(video, analysis, studentProfile);

      return personalizedContent;
    } catch (error) {
      console.error('Error in content personalization:', error);
      throw error;
    }
  }

  private async analyzeContent(transcript: string) {
    const response = await this.claude.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'assistant',
          content:
            'You are an expert educational content analyzer. Extract key concepts, learning objectives, and potential areas of difficulty from this transcript.',
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  private async generatePersonalizedContent(
    video: any,
    analysis: string,
    studentProfile: StudentProfile,
  ): Promise<PersonalizedContent> {
    const response = await this.claude.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'assistant',
          content: `You are an expert educational content adapter. Create personalized learning content based on the student's profile and learning style. 
            Format your response as JSON with the following structure:
            {
              "content": "Brief overview",
              "sections": [{
                "title": "Section title",
                "content": "Adapted content",
                "visualAids": ["visual elements"],
                "exercises": ["interactive exercises"],
                "examples": ["real-world examples"]
              }],
              "assessments": [{
                "type": "quiz|practice|reflection",
                "question": "Question text",
                "options": ["options if quiz"],
                "correctAnswer": "correct answer",
                "explanation": "explanation"
              }]
            }`,
        },
        {
          role: 'user',
          content: `
            Video Title: ${video.title}
            Transcript: ${video.transcript}
            Analysis: ${analysis}
            
            Student Profile:
            - Learning Style: ${studentProfile.learningStyle.join(', ')}
            - Comprehension Level: ${studentProfile.comprehensionLevel}/10
            - Preferred Subjects: ${studentProfile.preferredSubjects.join(', ')}
            - Difficulty Level: ${studentProfile.difficultyLevel}
            
            Create personalized learning content that:
            1. Matches the student's learning style
            2. Adapts to their comprehension level
            3. Includes relevant examples and exercises
            4. Provides appropriate assessments
            5. Maintains engagement throughout`,
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
    return JSON.parse(content);
  }
}
