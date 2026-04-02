import React from 'react';
import { Head } from '@inertiajs/react';
import RoleToolbar from '@/components/role-toolbar';

interface InvoiceRow {
    id: number;
    factuurnummer: string;
    datum: string;
    klant: string;
    email: string;
    product: string;
    periode: string;
    bedrag: string;
    status: string;
    print_url: string;
}

export default function AdminFacturen({ invoices }: { invoices: InvoiceRow[] }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Factuuroverzicht" />
            <RoleToolbar role="beheerder" />

            <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Factuuroverzicht</h1>
                    <p className="text-slate-500">Overzicht van alle gegenereerde facturen.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-100 text-sm uppercase tracking-wider text-slate-700">
                                    <th className="px-4 py-3">Nummer</th>
                                    <th className="px-4 py-3">Datum</th>
                                    <th className="px-4 py-3">Klant</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Bedrag</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actie</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold">{invoice.factuurnummer}</td>
                                        <td className="px-4 py-3">{invoice.datum}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-800">{invoice.klant}</div>
                                            <div className="text-xs text-slate-500">{invoice.email}</div>
                                        </td>
                                        <td className="px-4 py-3">{invoice.periode}</td>
                                        <td className="px-4 py-3">{invoice.product}</td>
                                        <td className="px-4 py-3 font-semibold">€ {invoice.bedrag}</td>
                                        <td className="px-4 py-3">{invoice.status}</td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={invoice.print_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                                            >
                                                Printen
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                            Nog geen facturen beschikbaar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
