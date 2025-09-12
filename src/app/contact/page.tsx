
'use client';

import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch('https://formspree.io/f/mrbadegg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We will get back to you shortly.',
        });
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold font-headline mb-4">Get in Touch</h1>
            <p className="text-muted-foreground">We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, feel free to reach out.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div className="space-y-8">
                <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Email</h3>
                            <p className="text-muted-foreground">Our support team will get back to you within 24 hours.</p>
                            <a href="mailto:support@kamkunji.com" className="text-primary font-medium mt-1 inline-block">support@kamkunji.com</a>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                         <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Phone</h3>
                            <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                            <a href="tel:+1234567890" className="text-primary font-medium mt-1 inline-block">+1 (234) 567-890</a>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                         <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Office</h3>
                            <p className="text-muted-foreground">123 E-Market Street, Commerce City, 12345</p>
                            <a href="#" className="text-primary font-medium mt-1 inline-block">Get Directions</a>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="Question about an order" {...register('subject', { required: 'Subject is required' })} />
                            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="message">Your message</Label>
                            <Textarea id="message" rows={6} {...register('message', { required: 'Message is required' })} />
                            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
