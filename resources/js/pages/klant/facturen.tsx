import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface Factuur {
    id: number;
    datum: string;
    omschrijving: string;
    bedrag: string;
    status: string;
}

interface Props {
    facturen: Factuur[];
}

export default function Facturen({ facturen }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logica voor de zoekbalk
    const filteredFacturen = facturen.filter(f => 
        f.omschrijving.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.datum.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900">
            <Head title="Facturen bekijken" />

            {/* Navbar - Navolging van Klusloods Header */}
            <nav className="bg-white border-b border-gray-100 py-4 px-8 flex items-center shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-orange-500">🛠️</span>
                    <span>Klusloods</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-10 px-6">
                {/* Header Sectie */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Facturen bekijken</h1>
                    </div>
                </div>

                <hr className="border-orange-100 mb-8" />

                {/* Search & Filter Bar */}
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Zoek op datum of product..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 border border-orange-200 rounded-xl bg-white hover:bg-orange-50 transition-colors font-medium text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                </div>

                {/* Tabel met Wireframe Layout */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-4 px-6 font-semibold text-sm border-r border-gray-200 w-1/3">Datum</th>
                                <th className="text-left py-4 px-6 font-semibold text-sm">Factuur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFacturen.map((factuur) => (
                                <tr key={factuur.id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                                    <td className="py-5 px-6 text-slate-600 border-r border-gray-100">
                                        {factuur.datum}
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-slate-800">{factuur.omschrijving}</div>
                                                <div className="text-sm text-gray-500">{factuur.bedrag}</div>
                                            </div>
                                            <button className="bg-[#FF6B00] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#e65a00] transition-colors shadow-sm shadow-orange-200">
                                                Bekijk details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredFacturen.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-10 text-center text-gray-400">Geen facturen gevonden...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
                Footer - &copy; {new Date().getFullYear()} Klusloods
            </footer>
        </div>
    );
}