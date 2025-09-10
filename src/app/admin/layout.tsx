import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminNav } from '@/components/admin/nav';
import { DashboardHeader } from '@/components/admin/dashboard-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader>
            <SidebarTrigger />
        </DashboardHeader>
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
