import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user after session exchange
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Add a small delay to ensure the session is properly set
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return NextResponse.redirect(new URL('/create-profile', requestUrl.origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}
