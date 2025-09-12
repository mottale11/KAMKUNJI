
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function ShippingReturnsPage() {
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
                <BreadcrumbPage>Shipping & Returns</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container pb-16 lg:pb-24">
          <h1 className="text-4xl font-bold font-headline mb-8">Shipping & Returns</h1>
          <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-primary">
            
            <h2>Shipping Policy</h2>
            <p>We are committed to delivering your order accurately, in good condition, and always on time. Please note our shipping policy as follows:</p>
            <ul>
                <li>We currently offer shipping to locations within the United States.</li>
                <li>Orders are shipped on business days only. Business days are Monday-Friday, excluding federal holidays within the United States.</li>
                <li>Your order will be shipped within 2-3 business days after it has been placed.</li>
                <li>Shipping charges are determined by the weight of your order and the shipping method selected. You can view the shipping costs at checkout before finalizing your order.</li>
                <li>We offer free standard shipping on all orders over $50.</li>
            </ul>

            <h2>Returns, Refunds, and Exchanges Policy</h2>
            <p>We want you to be completely satisfied with your purchase. If you are not, you can return the product to us and we will either repair/replace it or credit your account, subject to the terms below.</p>
            <h3>1. Unsatisfied with your purchase?</h3>
            <p>You can return an unwanted product to us, provided:</p>
            <ul>
                <li>It is undamaged and unused, with the original labels and stickers still attached.</li>
                <li>It is in the original packaging, which must be undamaged and in its original condition.</li>
                <li>You log a return on the Website within 30 days of delivery to you.</li>
            </ul>
            <p>Once we have inspected the product and validated your return, we will credit your account with the purchase price of the product within 10 days of the return.</p>

            <h3>2. Products damaged on delivery</h3>
            <p>Should a product be damaged at the time of delivery, please notify us within 7 days of such delivery by contacting our support team. We will arrange to collect the product from you at no charge. Once we have inspected the product and validated your return, we will, at your choice, repair / replace the product as soon as possible or credit your account with the purchase price of the product.</p>

            <h3>3. Exchanges</h3>
            <p>We are happy to exchange a product for a different size or color, provided that such variation is available. In such a case, we will collect the product from you and deliver the requested product to you at your own cost.</p>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
