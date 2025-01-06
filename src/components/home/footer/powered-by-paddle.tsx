import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRight } from 'lucide-react';

export function EduCreateFooter() {
  return (
    <>
      <Separator className={'footer-border'} />
      <div
        className={
          'flex flex-col justify-center items-center gap-4 text-muted-foreground text-sm leading-[14px] py-[24px]'
        }
      >
        <div className={'flex justify-center items-center gap-3'}>
          <Image
            src={'/assets/icons/logo/educreate-logo.png'}
            alt={'eduCreate logo'}
            width={24}
            height={24}
            className="h-auto w-10"
            style={{
              filter: 'drop-shadow(0 0 5px #00adb5)',
            }}
          />
          <span className={'text-2xl font-bold'} style={{ color: '#fff', textShadow: '0 0 8px #00adb5' }}>
            eduCreate
          </span>
        </div>
        <div className={'flex justify-center items-center gap-6 flex-wrap md:flex-nowrap'}>
          <Link className={'text-sm leading-[14px] hover:text-[#00adb5] transition-colors'} href={'/terms'}>
            <span className={'flex items-center gap-1'}>
              Terms and Conditions
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px] hover:text-[#00adb5] transition-colors'} href={'/privacy'}>
            <span className={'flex items-center gap-1'}>
              Privacy Policy
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
          <Link className={'text-sm leading-[14px] hover:text-[#00adb5] transition-colors'} href={'/support'}>
            <span className={'flex items-center gap-1'}>
              Support
              <ArrowUpRight className={'h-4 w-4'} />
            </span>
          </Link>
        </div>
        <div className={'text-xs text-muted-foreground/60 mt-2'}>
          © {new Date().getFullYear()} eduCreate. All rights reserved.
        </div>
      </div>
    </>
  );
}
