import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
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
          {user?.id ? (
            <Button variant={'secondary'} asChild={true}>
              <Link href={'/dashboard'}>Dashboard</Link>
            </Button>
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
