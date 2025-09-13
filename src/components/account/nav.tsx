
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/profile', label: 'My Profile', icon: User },
];

export function AccountNav() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: error.message || 'Could not log you out. Please try again.' });
    }
  };


  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
                'w-full justify-start gap-3',
                pathname === item.href && 'bg-accent text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
      </Button>
    </nav>
  );
}
