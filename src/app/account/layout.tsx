
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AccountNav } from '@/components/account/nav';
import { Separator } from '@/components/ui/separator';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
            <h1 className="text-3xl font-bold font-headline mb-2">My Account</h1>
            <p className="text-muted-foreground mb-8">Manage your account, view your orders, and more.</p>
            <Separator />
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 py-8">
                <aside className="md:w-1/4 lg:w-1/5">
                    <AccountNav />
                </aside>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
