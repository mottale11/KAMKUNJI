
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also track your order from your account page."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for most items. The item must be in its original condition and packaging. Please visit our Shipping & Returns page for more details."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. Please proceed to checkout to see the available options for your country."
    },
    {
        question: "How do I cancel or change my order?",
        answer: "If you need to cancel or modify your order, please contact our customer support team as soon as possible. We can't guarantee changes once the order has been processed, but we'll do our best to help."
    },
    {
        question: "Are my personal details secure?",
        answer: "Absolutely. We use industry-standard SSL encryption to protect your details. Your personal information is kept secure and is never shared with third parties."
    }
];


export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4">
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
                <BreadcrumbPage>FAQ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold font-headline mb-4">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">Find answers to common questions about our products, shipping, returns, and more.</p>
            </div>
          
            <div className="max-w-3xl mx-auto mt-12">
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
