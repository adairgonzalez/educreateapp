import { CreateProfileForm } from '../../components/authentication/create-profile-form';
import { AuthPageBackground } from '@/components/gradients/auth-page-background';

export default function CreateProfilePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AuthPageBackground />
      <div className="relative z-10">
        <CreateProfileForm />
      </div>
    </div>
  );
}
