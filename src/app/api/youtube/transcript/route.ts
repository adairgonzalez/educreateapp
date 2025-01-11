import { YoutubeTranscript } from 'youtube-transcript';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return new Response('Video ID is required', { status: 400 });
  }

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptItems.map((item) => item.text).join(' ');

    return Response.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    // Return empty transcript rather than error to allow content generation to continue
    return Response.json({ transcript: '' });
  }
}
