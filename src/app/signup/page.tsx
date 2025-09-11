import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                 <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl mb-2">
                    <Store className="h-7 w-7 text-primary" />
                    <span className="font-headline">E-Market Hub</span>
                </Link>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join us to start shopping for the best deals.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Create Account</Button>
                    <Button variant="outline" className="w-full">Sign Up with Google</Button>
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
