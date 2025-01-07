'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SignOutButton } from '@/components/authentication/sign-out-button';
import { useEffect, useState } from 'react';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();
  }, [supabase.auth]);

  return (
    <nav>
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center gap-3" href={'/'}>
            <Image
              src={'/assets/icons/logo/educreate-logo.png'}
              alt={'eduCreate logo'}
              width={24}
              height={24}
              className="h-auto w-10"
            />
            <span className={'text-2xl font-bold'}>eduCreate</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant={'ghost'} asChild={true}>
            <Link href={'/'}>Home</Link>
          </Button>
          <Link href={'/pricing'}>
            <Button variant={'ghost'}>Pricing</Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Button variant={'secondary'} asChild={true}>
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant={'ghost'} asChild={true}>
                <Link href={'/login'}>Sign in</Link>
              </Button>
              <Button variant={'secondary'} asChild={true}>
                <Link href={'/signup'}>Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
