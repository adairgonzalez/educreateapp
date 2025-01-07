'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'student' | 'teacher';

export function CreateProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log('Current user:', user);

      if (!user) {
        router.push('/login');
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: password,
      });
      console.log('Password update result:', passwordError);

      if (passwordError) throw passwordError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          username: username,
          role: role,
          updated_at: new Date().toISOString(),
        })
        .select();

      console.log('Profile upsert result:', { profile, profileError });

      if (profileError) throw profileError;

      toast({ description: 'Profile created successfully!' });
      router.push('/dashboard');
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
        <Label htmlFor="password">Create Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
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
