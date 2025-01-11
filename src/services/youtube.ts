import { YoutubeTranscript } from 'youtube-transcript';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export class YouTubeService {
  private apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  async searchEducationalVideos(query: string): Promise<Video[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&q=${encodeURIComponent(query)}` +
          `&type=video&maxResults=9&videoDuration=medium` +
          `&videoEmbeddable=true` +
          `&key=${this.apiKey}`,
      );

      const data = await response.json();

      // Get video details including duration
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
          `part=contentDetails,snippet` +
          `&id=${videoIds}` +
          `&key=${this.apiKey}`,
      );

      const detailsData = await detailsResponse.json();

      return data.items.map((item: any, index: number) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: this.formatDuration(detailsData.items[index].contentDetails.duration),
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }

  private formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '00:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let result = '';
    if (hours) result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
    result += seconds.padStart(2, '0');

    return result;
  }

  async getVideoDetails(videoId: string) {
    try {
      if (!this.apiKey) {
        throw new Error('YouTube API key is not configured');
      }

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?` +
          `part=snippet,contentDetails` +
          `&id=${videoId}` +
          `&key=${this.apiKey}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if we have valid data
      if (!data?.items?.length) {
        return null;
      }

      const video = data.items[0];
      let transcript = '';

      try {
        transcript = await this.getVideoTranscript(videoId);
      } catch (transcriptError) {
        console.warn('Could not load transcript:', transcriptError);
        transcript = 'No transcript available for this video.';
      }

      return {
        title: video.snippet.title,
        description: video.snippet.description,
        transcript,
        duration: this.formatDuration(video.contentDetails.duration),
        tags: video.snippet.tags || [],
        category: video.snippet.categoryId,
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  private async getVideoTranscript(videoId: string): Promise<string> {
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

      // Combine all transcript items into a single text
      const transcript = transcriptItems.map((item) => item.text).join(' ');

      return transcript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return 'No transcript available for this video.';
    }
  }
}
