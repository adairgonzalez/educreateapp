'use client';

import { createClient } from '@/utils/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';
import '../../styles/home-page.css';
import Header from '@/components/home/header/header';
import { LandingHero } from '@/components/home/landing-hero/landing-hero';
import { HomePageBackground } from '@/components/gradients/home-page-background';
import { Footer } from '@/components/home/footer/footer';

export function HomePage() {
  const supabase = createClient();
  const { user } = useUserInfo(supabase);

  return (
    <>
      <div>
        <HomePageBackground />
        <Header user={user} />
        <LandingHero />
        <Footer />
      </div>
    </>
  );
}
