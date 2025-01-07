import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/create-profile';

  if (!code) {
    console.log('No code found in request');
    return NextResponse.redirect(new URL('/login?error=no-code-provided', requestUrl));
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    console.log('Code:', code);
    console.log('Cookies:', cookies().getAll());

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Exchange error:', error);
      return NextResponse.redirect(new URL('/login?error=auth-failed', requestUrl));
    }

    console.log('Exchange successful:', data);

    return NextResponse.redirect(new URL(next, requestUrl));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/login?error=server-error', requestUrl));
  }
}
