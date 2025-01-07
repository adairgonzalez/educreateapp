'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export function VerifyEmail() {
  const { toast } = useToast();

  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    toast({ description: 'Verification email has been resent', variant: 'default' });
  };

  return (
    <div className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <Image src={'/assets/icons/logo/educreate-logo.png'} alt={'EduCreate'} width={60} height={60} />

      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center'}>Verify your email</div>

      <p className={'text-muted-foreground text-center max-w-sm'}>
        We sent you an email with a verification link. Please check your inbox and click the link to verify your
        account.
      </p>

      <Button onClick={handleResendEmail} variant={'secondary'} className={'w-full max-w-sm mt-4'}>
        Resend verification email
      </Button>

      <p className={'text-sm text-muted-foreground text-center'}>
        Didn&apos;t receive the email? Check your spam folder or try resending.
      </p>
    </div>
  );
}

export default VerifyEmail;
