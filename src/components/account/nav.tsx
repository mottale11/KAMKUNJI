
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package, User, Heart, Settings, LogOut } from 'lucide-react';

const navItems = [
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/profile', label: 'My Profile', icon: User },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

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
      <Link href="/login">
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
        </Button>
      </Link>
    </nav>
  );
}
