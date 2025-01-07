'use client';

import { AuthPageBackground } from '@/components/gradients/auth-page-background';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/ui/use-toast';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleResend = async () => {
    const email = localStorage.getItem('signUpEmail');
    if (!email) {
      toast({
        variant: 'destructive',
        description: 'Email not found. Please try signing up again.',
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        description: 'Verification link sent. Please check your inbox.',
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to send verification link. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuthPageBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <Image src={'/assets/icons/logo/educreate-logo.png'} alt={'EduCreate'} width={60} height={60} />
        <h1 className="mt-8 text-2xl font-semibold">Check your email</h1>
        <p className="mt-2 text-muted-foreground text-center">
          We sent you a verification link. Please check your email to continue.
        </p>
        <Button variant="ghost" onClick={handleResend} disabled={isResending} className="mt-6">
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
      </div>
    </div>
  );
}
