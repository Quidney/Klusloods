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
    ],
};

export default function RoleToolbar({ role }: { role: 'klant' | 'medewerker' | 'beheerder' }) {
    const { url } = usePage();
    const links = roleLinks[role] ?? [];

    if (!links.length) {
        return null;
    }

    return (
        <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-3">
                <div className="flex gap-2 overflow-x-auto">
                    {links.map((link) => {
                        const isActive = url === link.href || url.startsWith(`${link.href}/`) || url.startsWith(`${link.href}?`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
