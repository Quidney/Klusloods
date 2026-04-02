import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { BarChart3, LayoutGrid, Package, Receipt, RotateCcw, ShieldCheck, Users, Wrench } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, User } from '@/types';

const dashboardNavItem: NavItem = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

const roleNavItems: Record<string, NavItem[]> = {
    klant: [
        {
            title: 'Producten',
            href: '/klant/producten',
            icon: Package,
        },
        {
            title: 'Reserveringen',
            href: '/klant/reserveringen',
            icon: RotateCcw,
        },
        {
            title: 'Facturen',
            href: '/klant/facturen',
            icon: Receipt,
        },
    ],
    medewerker: [
        {
            title: 'Uitgifte registreren',
            href: '/medewerker/uitgifte-registreren',
            icon: Package,
        },
        {
            title: 'Verlenging aanvragen',
            href: '/medewerker/verlenging-aanvragen',
            icon: RotateCcw,
        },
        {
            title: 'Retour registreren',
            href: '/medewerker/retour-registreren',
            icon: Receipt,
        },
        {
            title: 'Onderhoud registreren',
            href: '/medewerker/onderhoud-registreren',
            icon: Wrench,
        },
    ],
    beheerder: [
        {
            title: 'Categorieën',
            href: '/admin/category',
            icon: Package,
        },
        {
            title: 'Tools',
            href: '/admin/tools',
            icon: Wrench,
        },
        {
            title: 'Gebruikers',
            href: '/admin/users',
            icon: Users,
        },
        {
            title: 'Statistieken',
            href: '/admin/stats',
            icon: BarChart3,
        },
    ],
};

const fallbackNavItems: NavItem[] = [
    {
        title: 'Geen menu beschikbaar',
        href: dashboard(),
        icon: ShieldCheck,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const currentRole = auth?.user?.role;

    const mainNavItems = [
        dashboardNavItem,
        ...(currentRole ? (roleNavItems[currentRole] ?? fallbackNavItems) : fallbackNavItems),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
