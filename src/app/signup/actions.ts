// src/app/signup/actions.ts
'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface SignUpData {
  email: string;
  password: string;
}

export async function signup({ email, password }: SignUpData) {
  try {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          password, // Store password for later use
        },
      },
    });

    if (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return { error: null, data };
  } catch (err) {
    return {
      error: {
        message: 'An unexpected error occurred',
        status: 500,
      },
    };
  }
}
