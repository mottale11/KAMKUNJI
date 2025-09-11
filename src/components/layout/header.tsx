import { Menu, Search, ShoppingCart, Store, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { href: '/categories', label: 'Categories' },
  { href: '/deals', label: 'Deals' },
  { href: '/new-arrivals', label: 'New Arrivals' },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-headline">E-Market Hub</span>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-headline">E-Market Hub</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-1 text-lg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between gap-2">
            <nav className="hidden md:flex items-center gap-6 text-sm">
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground/60 transition-colors hover:text-foreground/80"
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-4">
                <div className="relative w-full max-w-sm hidden sm:block">
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        className="h-9 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                    </Button>
                    <Link href="/cart" className="relative">
                        <Button variant="ghost" size="icon">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                        </Button>
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">3</Badge>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}
