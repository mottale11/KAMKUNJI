'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const KamkunjiLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <circle cx="16" cy="16" r="16" fill="#1E90FF" />
      <path
        d="M10 10V22H13.2571L22 10.4375V10H10Z"
        fill="white"
      />
      <path
        d="M13.2571 22L22 13.75V22H13.2571Z"
        fill="white"
      />
    </svg>
);

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      toast({
        title: "Account Created!",
        description: "You have successfully signed up.",
      });
      router.push('/account');
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                 <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl mb-2">
                    <KamkunjiLogo />
                    <span className="font-headline">Kamkunji</span>
                </Link>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join us to start shopping for the best deals.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <Button variant="outline" className="w-full" disabled={loading}>Sign Up with Google</Button>
                </form>
                 <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
