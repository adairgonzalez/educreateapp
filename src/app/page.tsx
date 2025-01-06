import { HomePage } from '@/components/home/home-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eduCreate - Interactive Learning Platform',
  description: 'Transform teaching and learning with AI-powered educational tools',
};

export default function Home() {
  return <HomePage />;
}
