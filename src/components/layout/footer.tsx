

import { Facebook, Twitter, Instagram, Linkedin, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
    { icon: Facebook, href: '#', 'aria-label': 'Facebook' },
    { icon: Twitter, href: '#', 'aria-label': 'Twitter' },
    { icon: Instagram, href: '#', 'aria-label': 'Instagram' },
    { icon: Linkedin, href: '#', 'aria-label': 'LinkedIn' },
]

const KamkunjiLogo = () => (
    <ShoppingCart className="h-8 w-8 text-primary" />
);

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12 text-sm">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-full mb-8 lg:col-span-2 lg:mb-0">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                    <KamkunjiLogo />
                    <span className="font-headline">Kamkunji</span>
                </Link>
                <p className="text-muted-foreground max-w-md">Your one-stop online marketplace for the best deals on electronics, fashion, home goods, and more.
                </p>
            </div>

            <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-3">
                    <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                    <li><Link href="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                    <li><Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">Best Deals</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-semibold mb-4">About Us</h4>
                <ul className="space-y-3">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                    <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                    <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                    <li><Link href="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
                    <li><Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin</Link></li>
                </ul>
            </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Kamkunji. All rights reserved.</p>
            <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                     <Link key={link['aria-label']} href={link.href} aria-label={link['aria-label']} className="text-muted-foreground hover:text-primary transition-colors">
                        <link.icon className="h-5 w-5" />
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
