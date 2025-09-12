'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function Newsletter() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast({
                variant: 'destructive',
                title: 'Email Required',
                description: 'Please enter your email address to subscribe.',
            });
            return;
        }

        setLoading(true);

        // Simulate network request
        setTimeout(() => {
            setLoading(false);
            setEmail('');
            toast({
                title: 'Subscribed!',
                description: "Thank you for subscribing to our newsletter.",
            });
        }, 1000);
    };


    return (
        <section className="py-16 lg:py-24 bg-primary/10">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-headline font-bold">Stay in the Loop</h2>
                    <p className="mt-4 text-muted-foreground">
                        Subscribe to our newsletter to get the latest updates on new products, special offers, and exclusive deals.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 bg-background"
                            aria-label="Email for newsletter"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
