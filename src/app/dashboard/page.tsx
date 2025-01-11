'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningProgress } from '@/components/dashboard/education/progress/learning-progress';
import { LearningInsights } from '@/components/dashboard/education/learning-insights';
import { YouTubeService } from '@/services/youtube';
import { LearningStyleTracker } from '@/services/learning-style-tracker';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

const CATEGORIES = ['All', 'Programming', 'Mathematics', 'Science', 'Language Learning', 'Study Skills'];

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  async function loadVideos() {
    try {
      setIsLoading(true);
      setError(null);
      const youtubeService = new YouTubeService();
      const query = selectedCategory === 'All' ? 'educational content' : `${selectedCategory} tutorial`;
      const results = await youtubeService.searchEducationalVideos(query);
      setVideos(results);
    } catch (error) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVideoSelect(videoId: string) {
    try {
      setIsLoading(true);
      setError(null);

      const youtubeService = new YouTubeService();
      const videoDetails = await youtubeService.getVideoDetails(videoId);

      if (!videoDetails) {
        throw new Error('Failed to load video details');
      }

      setCurrentVideoId(videoId);

      // Track the video interaction
      const tracker = new LearningStyleTracker();
      await tracker.trackInteraction({
        type: 'video',
        duration: 0, // Will be updated as user watches
        metadata: {
          videoId,
          title: videoDetails.title,
          category: selectedCategory,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setError('Failed to load video. Please try again later.');
      console.error('Error selecting video:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="dashboard-background-base grain-background" />
      <div className="dashboard-shared-top-grainy-blur" />
      <div className="dashboard-shared-bottom-grainy-blur" />

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <LearningProgress />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!currentVideoId ? (
              <>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-1/2"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="md:w-1/3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isLoading ? (
                    <p>Loading videos...</p>
                  ) : filteredVideos.length === 0 ? (
                    <p>No videos found. Try a different search.</p>
                  ) : (
                    filteredVideos.map((video) => (
                      <Card
                        key={video.id}
                        className="relative cursor-pointer hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-[6px] border-border overflow-hidden"
                        onClick={() => handleVideoSelect(video.id)}
                      >
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                          <div className="featured-vertical-hard-blur-bg" />
                          <div className="featured-soft-blur-bg" />
                        </div>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full aspect-video object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2">{video.duration}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => setCurrentVideoId(null)}>
                  <ArrowLeft className="h-4 w-4" /> Back to videos
                </Button>
                <Card className="relative bg-background/80 backdrop-blur-[6px] border-border overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="featured-vertical-hard-blur-bg" />
                    <div className="featured-soft-blur-bg" />
                  </div>
                  <div className="aspect-video w-full p-2">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideoId}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Learning Insights Sidebar */}
          <div className="lg:col-span-1">
            <LearningInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
