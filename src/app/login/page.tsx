import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function LoginPage() {
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
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                     <Button variant="outline" className="w-full">Sign In with Google</Button>
                </form>
                 <div className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
