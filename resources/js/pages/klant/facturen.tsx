import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import RoleToolbar from '@/components/role-toolbar';

interface Factuur {
    id: number;
    datum: string;
    omschrijving: string;
    bedrag: string;
    status: string;
    pdf_path: string | null;
}

interface Props {
    facturen: Factuur[];
}

export default function Facturen({ facturen = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFacturen = facturen.filter(f => 
        f.omschrijving.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.datum.includes(searchTerm) ||
        f.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'betaald') return 'bg-green-100 text-green-700 border border-green-200';
        if (s === 'openstaand' || s === 'concept') return 'bg-blue-100 text-blue-700 border border-blue-200';
        if (s === 'te laat') return 'bg-red-100 text-red-700 border border-red-200';
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    const openPdf = (path: string | null) => {
        if (!path) {
            alert("Er is geen PDF-bestand gekoppeld aan deze factuur.");
            return;
        }

        const fullUrl = `/storage/${path}`;
        window.open(fullUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 flex flex-col">
            <Head title="Facturen bekijken" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 py-4 px-8 flex items-center shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                    <span className="text-orange-500">🛠️</span>
                    <span>Klusloods</span>
                </div>
            </nav>

            <RoleToolbar role="klant" />

            <main className="flex-grow max-w-5xl mx-auto py-10 px-6 w-full">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mijn Facturen</h1>
                    </div>
                    <div className="text-sm text-gray-500 italic bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                        Zoek op product, datum of status
                    </div>
                </div>

                <hr className="border-orange-100 mb-8" />

                <div className="flex gap-4 mb-8">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Zoek factuur..." 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-4 px-6 font-semibold text-sm border-r border-gray-200 w-1/4 text-slate-700 uppercase tracking-wider">Datum</th>
                                <th className="py-4 px-6 font-semibold text-sm text-slate-700 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFacturen.map((factuur) => (
                                <tr key={factuur.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="py-5 px-6 text-slate-600 border-r border-gray-100 font-medium">
                                        {factuur.datum}
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div>
                                                <div className="font-bold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">
                                                    {factuur.omschrijving}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm font-bold text-slate-900">{factuur.bedrag}</span>
                                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm ${getStatusStyle(factuur.status)}`}>
                                                        {factuur.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => openPdf(factuur.pdf_path)}
                                                className="inline-flex items-center justify-center bg-[#FF6B00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e65a00] transition-all shadow-md shadow-orange-100 active:scale-95 w-fit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Bekijk PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredFacturen.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-24 text-center text-gray-400 italic">
                                        Geen facturen gevonden voor "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <footer className="py-10 border-t border-gray-100 text-center text-gray-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Klusloods - Professioneel Gereedschapbeheer
            </footer>
        </div>
    );
}