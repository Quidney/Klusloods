import { Link, usePage } from '@inertiajs/react';

const roleLinks: Record<string, { label: string; href: string }[]> = {
    klant: [
        { label: 'Producten', href: '/klant/producten' },
        { label: 'Reserveringen', href: '/klant/reserveringen' },
        { label: 'Facturen', href: '/klant/facturen' },
    ],
    medewerker: [
        { label: 'Uitgifte registreren', href: '/medewerker/uitgifte-registreren' },
        { label: 'Verlenging aanvragen', href: '/medewerker/verlenging-aanvragen' },
        { label: 'Retour registreren', href: '/medewerker/retour-registreren' },
        { label: 'Onderhoud registreren', href: '/medewerker/onderhoud-registreren' },
    ],
    beheerder: [
        { label: 'Categorieën', href: '/admin/category' },
        { label: 'Tools', href: '/admin/tools' },
        { label: 'Gebruikers', href: '/admin/users' },
        { label: 'Statistieken', href: '/admin/stats' },
        { label: 'Facturen', href: '/admin/facturen' },
        { label: 'Openingstijden', href: '/admin/openingstijden' },
    ],
};

export default function RoleToolbar({ role }: { role: 'klant' | 'medewerker' | 'beheerder' }) {
    const { url } = usePage();
    const links = roleLinks[role] ?? [];
    const roleLabel = role === 'beheerder' ? 'ADMIN' : role === 'medewerker' ? 'MEDEWERKER' : 'KLANT';

    if (!links.length) {
        return null;
    }

    return (
        <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-white">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
                <Link href="/" className="mr-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-slate-800">
                    <span className="rounded-lg bg-orange-500 px-2 py-1 text-sm">🛠️</span>
                    <span className="text-xl font-bold tracking-tight">Klusloods</span>
                </Link>

                <span className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-bold text-orange-400">
                    {roleLabel}
                </span>

                <div className="ml-auto flex gap-2 overflow-x-auto">
                    {links.map((link) => {
                        const isActive = url === link.href || url.startsWith(`${link.href}/`) || url.startsWith(`${link.href}?`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
