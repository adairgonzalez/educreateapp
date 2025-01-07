'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { login, loginAnonymously } from '@/app/login/actions';
import { useState, useEffect } from 'react';
import { AuthenticationForm } from '@/components/authentication/authentication-form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  function handleLogin() {
    login({ email, password }).then((data) => {
      if (data?.error) {
        toast({ description: 'Invalid email or password', variant: 'destructive' });
      } else {
        router.push('/dashboard');
      }
    });
  }

  function handleAnonymousLogin() {
    loginAnonymously().then((data) => {
      if (data?.error) {
        toast({ description: 'Something went wrong. Please try again', variant: 'destructive' });
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <form action={'#'} className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <Image src={'/assets/icons/logo/educreate-logo.png'} alt={'EduCreate'} width={60} height={60} />
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>
        Log in to your account
      </div>
      <Button onClick={() => handleAnonymousLogin()} type={'button'} variant={'secondary'} className={'w-full mt-6'}>
        Log in as Guest
      </Button>
      <div className={'flex w-full items-center justify-center'}>
        <Separator className={'w-5/12 bg-border'} />
        <div className={'text-border text-xs font-medium px-4'}>or</div>
        <Separator className={'w-5/12 bg-border'} />
      </div>
      <AuthenticationForm
        email={email}
        onEmailChange={(email) => setEmail(email)}
        password={password}
        onPasswordChange={(password) => setPassword(password)}
      />
      <Button formAction={() => handleLogin()} type={'submit'} variant={'secondary'} className={'w-full'}>
        Log in
      </Button>
    </form>
  );
}
