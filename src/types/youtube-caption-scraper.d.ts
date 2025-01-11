declare module 'youtube-caption-scraper' {
  interface Caption {
    text: string;
    start: number;
    duration: number;
  }

  export function getSubtitles(options: { videoID: string; lang?: string }): Promise<Caption[]>;
}
