'use client';
import {
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Package,
    Users,
    LineChart,
    Settings,
    ChevronDown,
    ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

const KamkunjiLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <circle cx="16" cy="16" r="16" fill="#1E90FF" />
      <path
        d="M10 10V22H13.2571L22 10.4375V10H10Z"
        fill="white"
      />
      <path
        d="M13.2571 22L22 13.75V22H13.2571Z"
        fill="white"
      />
    </svg>
);


const menuItems = [
    {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutGrid,
    },
    {
        href: '/admin/orders',
        label: 'Orders',
        icon: ShoppingCart,
    },
    {
        href: '/admin/products',
        label: 'Products',
        icon: Package,
    },
    {
        href: '/admin/customers',
        label: 'Customers',
        icon: Users,
    },
    {
        href: '/admin/analytics',
        label: 'Analytics',
        icon: LineChart,
    },
];


export function AdminNav() {
    const pathname = usePathname();

    return (
        <>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <KamkunjiLogo />
                    <span className="font-headline">Kamkunji</span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                     <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings />
                            <span>Settings</span>
                            <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <Link href="/admin/settings/profile">Profile</Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <Link href="/admin/settings/billing">Billing</Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
            </SidebarFooter>
        </>
    );
}
