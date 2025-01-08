'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'student' | 'teacher';

export function CreateProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User error:', userError);
        toast({
          description: 'Session expired. Please login again.',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('customers')
        .upsert({
          customer_id: user.id,
          full_name: fullName,
          username: username,
          role: role,
        })
        .select();

      console.log('Profile upsert result:', { profile, profileError });

      if (profileError) throw profileError;

      toast({ description: 'Profile created successfully!' });
      if (role === 'student') {
        router.push('/dashboard');
      } else if (role === 'teacher') {
        router.push('/teacher-dashboard');
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      toast({
        description: 'Error creating profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center">
      <Image src={'/assets/icons/logo/educreate-logo.png'} alt={'EduCreate'} width={60} height={60} />
      <div className="text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center">Complete Your Profile</div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="John Doe"
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="johndoe"
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="role">I am a...</Label>
        <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" variant="secondary" className="w-full max-w-sm" disabled={isLoading}>
        {isLoading ? 'Creating Profile...' : 'Create Profile'}
      </Button>
    </form>
  );
}
