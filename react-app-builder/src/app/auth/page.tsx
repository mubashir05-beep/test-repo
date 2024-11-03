'use client'
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';


export default function SignIn() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
    </div>
  );
}
