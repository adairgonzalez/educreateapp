import { CreateProfileForm } from '@/components/authentication/create-profile-form';
import { AuthPageBackground } from '@/components/gradients/auth-page-background';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CreateProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <AuthPageBackground />
      <CreateProfileForm />
    </div>
  );
}
