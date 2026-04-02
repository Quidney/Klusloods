import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface Reservering {
    id: number;
    productnaam: string;
    periode: string;
    totaalprijs: string;
    status: string;
    raw_pickup_date: string;
}

export default function Reserveringen({ reserveringen }: { reserveringen: Reservering[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReservering, setSelectedReservering] = useState<Reservering | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredReserveringen = reserveringen.filter(r => {
        const search = searchTerm.toLowerCase();
        return r.productnaam.toLowerCase().includes(search) || r.periode.toLowerCase().includes(search);
    });

    const magAnnulerenCheck = (status: string, pickupDateString: string) => {

        if (!pickupDateString || status.toLowerCase() !== 'gereserveerd') {
            return false;
        }

        const pickupDate = new Date(pickupDateString);
        
        if (isNaN(pickupDate.getTime())) {
            console.error("Ongeldige datum ontvangen:", pickupDateString);
            return false;
        }

        const morgen = new Date();
        morgen.setDate(morgen.getDate() + 1);
        morgen.setHours(0, 0, 0, 0);

        return pickupDate.getTime() >= morgen.getTime();
    };

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'afgerond' || s === 'geaccepteerd' || s === 'gereserveerd') 
            return 'bg-green-100 text-green-700 border border-green-200';
        if (s === 'in behandeling') 
            return 'bg-blue-100 text-blue-700 border border-blue-200';
        if (s === 'geannuleerd') 
            return 'bg-red-100 text-red-700 border border-red-200';
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    };

    const openCancelModal = (reservering: Reservering) => {
        setSelectedReservering(reservering);
        setIsModalOpen(true);
    };

    const confirmAnnulering = () => {
        if (!selectedReservering) return;

        router.patch(`/reserveringen/${selectedReservering.id}/cancel`, {}, {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedReservering(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 flex flex-col relative">
            <Head title="Mijn Reserveringen" />

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Reservering annuleren?</h3>
                        <p className="text-slate-500 mb-6">
                            Weet je zeker dat je de reservering voor <span className="font-semibold text-slate-800">"{selectedReservering?.productnaam}"</span> wilt annuleren?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Nee</button>
                            <button onClick={confirmAnnulering} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">Ja, annuleren</button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="bg-white border-b border-gray-100 py-4 px-8 flex items-center shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                    <span className="text-orange-500">🛠️</span>
                    <span>Klusloods</span>
                </div>
            </nav>

            <main className="flex-grow max-w-5xl mx-auto py-10 px-6 w-full">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Mijn Reserveringen</h1>

                <div className="relative mb-8">
                    <input 
                        type="text" 
                        placeholder="Zoek op productnaam of periode..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-sm w-1/3 text-slate-700 uppercase">Periode</th>
                                <th className="py-4 px-6 font-semibold text-sm text-slate-700 uppercase">Product & Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReserveringen.length > 0 ? (
                                filteredReserveringen.map((reservering) => {
                                    const kanNogAnnuleren = magAnnulerenCheck(reservering.status, reservering.raw_pickup_date);

                                    return (
                                        <tr key={reservering.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="py-5 px-6 text-slate-600 font-medium">{reservering.periode}</td>
                                            <td className="py-5 px-6">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-lg group-hover:text-orange-600 transition-colors">{reservering.productnaam}</div>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-sm font-bold text-slate-900">{reservering.totaalprijs}</span>
                                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(reservering.status)}`}>
                                                                {reservering.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {kanNogAnnuleren ? (
                                                        <button 
                                                            onClick={() => openCancelModal(reservering)} 
                                                            className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                                                            title="Reservering annuleren"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        reservering.status.toLowerCase() === 'gereserveerd' && (
                                                            <span className="text-[10px] text-gray-400 italic">Niet meer annuleerbaar</span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={2} className="py-12 text-center text-gray-400 italic">Geen reserveringen gevonden.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <footer className="py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Klusloods
            </footer>
        </div>
    );
}