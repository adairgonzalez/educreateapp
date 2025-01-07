'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type === 'signup') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (!error) {
          // Successful verification
          router.push('/dashboard'); // or wherever you want to redirect
        } else {
          // Handle error
          router.push('/login?error=verification-failed');
        }
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams, supabase.auth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Verifying your email...</h1>
        <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
      </div>
    </div>
  );
}
