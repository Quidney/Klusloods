import { useForm, router } from '@inertiajs/react';
import {
    Wrench,
    Menu,
    User,
    Search,
    MoreHorizontal,
    Save,
    Trash2,
    Mail,
    Shield,
    CheckCircle,
    Clock,
} from 'lucide-react';
import { Transition } from '@headlessui/react';
import { useState, useEffect, useRef } from 'react';

const USERROLE = ['klant', 'medewerker', 'beheerder'];

const USERSTATUS = ['actief', 'geblokeerd', 'beëindigd'];
const Users = ({ users }) => {
    const urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search),
    );
    const [searchTerm, setSearchTerm] = useState(urlParams.search);
    const tortheling = useRef();
    const searchInput = useRef();

    useEffect(() => {
        if (urlParams.search) searchInput.current.focus();
    }, []);

    useEffect(() => {
        tortheling.current = setTimeout(() => {
            if (urlParams.search !== searchTerm) {
                router.visit('?search=' + searchTerm);
            }
        }, 1000);
        return () => {
            if (tortheling.current) clearTimeout(tortheling.current);
        };
    }, [searchTerm]);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <nav className="sticky top-0 z-50 bg-slate-900 text-white">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-orange-500 p-2">
                            <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Build<span className="text-orange-500">Rent</span>
                        </span>
                        <span className="ml-4 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-bold text-orange-400">
                            ADMIN
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="transition-colors hover:text-orange-500">
                            <User className="h-5 w-5" />
                        </button>
                        <button className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Gebruikersbeheer
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Beheer accounts, rollen en toegangsrechten van
                            BuildRent gebruikers.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Zoek op naam of email..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-4 pl-12 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                            value={searchTerm}
                            ref={searchInput}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-900 text-sm font-bold tracking-wider text-white uppercase">
                                    <th className="px-6 py-4">Voornaam</th>
                                    <th className="px-6 py-4">Achternaam</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actie</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <UserRow user={user} key={user.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-500">
                        <span>Totaal {users.length} gebruikers</span>
                        <div className="flex gap-2">
                            <button
                                className="rounded border border-slate-200 bg-white px-3 py-1 disabled:opacity-50"
                                disabled
                            >
                                Vorige
                            </button>
                            <button className="rounded border border-slate-200 bg-white px-3 py-1">
                                Volgende
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-slate-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-6 flex items-center gap-2">
                                <div className="rounded-lg bg-orange-500 p-1.5">
                                    <Wrench className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">
                                    Build
                                    <span className="text-orange-500">
                                        Rent
                                    </span>
                                </span>
                            </div>
                            <p className="mb-6 leading-relaxed text-slate-400">
                                Your trusted partner for professional-grade
                                building tools and materials. Quality equipment,
                                exactly when you need it.
                            </p>
                            <div className="flex space-x-4">
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">fb</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">ig</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">x</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Equipment
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Power Tools
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Heavy Machinery
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Scaffolding & Ladders
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Landscaping
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Raw Materials
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Company
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Pro Accounts
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Locations
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Support
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Rental Policies
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Report an Issue
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
                        <p>
                            © {new Date().getFullYear()} BuildRent Services. All
                            rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="transition-colors hover:text-white"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="transition-colors hover:text-white"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

function UserRow({ user }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        id: user.id,
        status: user.status,
        role: user.role,
    });

    function submit() {
        put('');
    }
    return (
        <tr className="group transition-colors hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-slate-700">
                {user.firstname}
            </td>
            <td className="px-6 py-4 font-semibold text-slate-700">
                {user.lastname}
            </td>
            <td className="px-6 py-4 text-slate-500">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-300" />
                    {user.email}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    {errors.role && (
                        <>
                            <span className="text-red-500">{errors.role}</span>
                            <br />
                        </>
                    )}
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    >
                        {USERROLE.map((role) => (
                            <option value={role} key={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </span>
            </td>
            <td className="px-6 py-4">
                {errors.status && (
                    <>
                        <span className="text-red-500">{errors.status}</span>
                        <br />
                    </>
                )}
                <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                >
                    {USERSTATUS.map((status) => (
                        <option
                            value={status}
                            key={status}
                            className={`${
                                status === 'actief'
                                    ? 'bg-green-100 text-green-700'
                                    : status === 'beëindigd'
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-amber-100 text-amber-700'
                            }`}
                        >
                            {status}
                        </option>
                    ))}
                </select>
            </td>

            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        className="rounded-lg p-2 text-green-400 transition-all hover:bg-green-50 hover:text-green-500"
                        title="Bewerken"
                        onClick={() => submit()}
                    >
                        {!recentlySuccessful && (
                            <>
                                <Save />
                            </>
                        )}
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="flex gap-3">
                                <Save /> Opgeslagen
                            </p>
                        </Transition>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default Users;
