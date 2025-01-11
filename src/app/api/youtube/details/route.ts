import { YouTubeService } from '@/services/youtube';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response('Video ID is required', { status: 400 });
  }

  try {
    const youtubeService = new YouTubeService();
    const details = await youtubeService.getVideoDetails(videoId);
    console.log(details);
    return Response.json(details);
  } catch (error) {
    console.error('Error fetching video details:', error);
    // Return minimal details rather than error
    return Response.json({
      title: 'Educational Video',
      description: 'Video content for learning',
      transcript: '',
    });
  }
}
