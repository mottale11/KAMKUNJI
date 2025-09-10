import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function Newsletter() {
    return (
        <section className="py-16 lg:py-24 bg-primary/10">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-headline font-bold">Stay in the Loop</h2>
                    <p className="mt-4 text-muted-foreground">
                        Subscribe to our newsletter to get the latest updates on new products, special offers, and exclusive deals.
                    </p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 bg-background"
                            aria-label="Email for newsletter"
                        />
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Subscribe
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
