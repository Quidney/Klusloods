import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface Barcode {
    id: number;
    status: string;
}

interface ToolPrice {
    dayprice?: string | number;
    day?: string | number;
    week?: string | number;
    deposit?: string | number;
}

interface Category {
    id: number;
    name: string;
}

interface Tool {
    id: number;
    name: string;
    description?: string;
    images?: string;
    category?: Category;
    price?: ToolPrice;
    detailed_price?: ToolPrice;
    barcode?: Barcode[];
    stockCount?: number;
}

interface Props {
    tool: Tool;
}

    function LabelValue({ label, value, valueClassName = "text-lg text-gray-950 font-bold" }: { label: string, value: string | number, valueClassName?: string }) {
        return (
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                <span className={valueClassName}>{value}</span>
            </div>
        );
    }

    interface CalendarProps {
        pickupDate: string;
        returnDate: string;
        activeField: 'pickup' | 'return' | null;
        setPickupDate: React.Dispatch<React.SetStateAction<string>>;
        setReturnDate: React.Dispatch<React.SetStateAction<string>>;
    }

    function Calendar({
        pickupDate,
        returnDate,
        activeField,
        setPickupDate,
        setReturnDate
    }: CalendarProps) {

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [currentDate, setCurrentDate] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
        'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleClick = (day: number) => {
        const selected = new Date(year, month, day);

        if (selected < tomorrow) return;

        const formatted = formatDate(selected);

        if (activeField === 'pickup') {
            setPickupDate(formatted);

            if (returnDate && new Date(returnDate) < selected) {
                setReturnDate('');
            }
        }

        if (activeField === 'return') {
            if (!pickupDate) return;
            if (selected < new Date(pickupDate)) return;

            setReturnDate(formatted);
        }
    };

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const formatted = formatDate(dateObj);

        const isPast = dateObj < tomorrow;
        const isPickup = pickupDate === formatted;
        const isReturn = returnDate === formatted;

        days.push(
            <div
                key={d}
                onClick={() => handleClick(d)}
                className={`h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition
                    ${isPast 
                        ? 'bg-red-100 text-red-400 cursor-not-allowed' 
                        : 'bg-green-50 text-green-800 cursor-pointer hover:bg-green-100'
                    }
                    ${isPickup ? 'bg-green-300 text-green-900 ring-2 ring-green-500' : ''}
                    ${isReturn ? 'bg-red-300 text-red-900 ring-2 ring-red-500' : ''}
                `}
            >
                {d}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 p-6 bg-white">
            <div className="flex items-center justify-between">
                <button onClick={prevMonth} className="text-gray-400 hover:text-orange-500">
                    ←
                </button>

                <span className="font-bold text-gray-900 text-xl">
                    {monthNames[month]} {year}
                </span>

                <button onClick={nextMonth} className="text-gray-400 hover:text-orange-500">
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-400">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {days}
            </div>
        </div>
    );
}

export default function Reservering({ tool }: Props) {
    const [pickupDate, setPickupDate] = useState<string>('');
    const [returnDate, setReturnDate] = useState<string>('');
    const [activeField, setActiveField] = useState<'pickup' | 'return' | null>(null);

    const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
    };

    const availableStock = tool?.stockCount ?? 
        (tool?.barcode?.filter(b => b.status?.toLowerCase().trim() === 'beschikbaar').length ?? 0);

    const formatPrice = (amount: string | number | undefined) => {
        if (amount === undefined || amount === null) return '€ --';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `€ ${num.toFixed(2).replace('.', ',')}`;
    };

    const datesSelected = pickupDate !== '' && returnDate !== '';
    const canReserve = datesSelected && availableStock > 0;

    const handleConfirmReservation = () => {
        if (!canReserve) return;

        router.post('/klant/reserveren', {
            tool_id: tool.id,
            pickupDate,
            returnDate,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title={`Reserveren - ${tool?.name || 'Product'}`} />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.visit('/klant/producten')}>
                        <span className="text-orange-500 text-3xl">🛠️</span>
                        <span className="text-3xl font-extrabold text-gray-950 tracking-tight">Klusloods</span>
                    </div>
                    <button 
                        onClick={() => window.history.back()}
                        className="text-gray-500 hover:text-orange-500 font-bold flex items-center gap-2 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7" /></svg>
                        Terug naar overzicht
                    </button>
                </div>
            </nav>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
                <div className="flex flex-col gap-10">
                    
                    {/* TOP CARD: Image & Basic Info */}
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-6">
                            {tool?.images ? (
                                <img 
                                    src={`${tool.images.replace('public/', '')}`} 
                                    alt={tool.name} 
                                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-gray-400 italic text-lg">Geen afbeelding</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-8">
                            <div>
                                <LabelValue label="Naam:" value={tool?.name || 'Onbekend'} valueClassName="text-3xl text-gray-950 font-black" />
                                <div className="mt-2 inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-sm font-bold border border-orange-100">
                                    {tool?.category?.name || 'Overig'}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Omschrijving:</span>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {tool?.description || 'Er is geen omschrijving beschikbaar voor dit gereedschap.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-8 mt-4">
                                <LabelValue label="Per dag" value={formatPrice(tool?.detailed_price?.day || tool?.price?.dayprice)} valueClassName="text-2xl font-bold text-orange-600" />
                                <LabelValue label="Per week" value={formatPrice(tool?.detailed_price?.week)} />
                                <LabelValue label="Borg" value={formatPrice(tool?.detailed_price?.deposit || 50)} />
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM CARD: Calendar & Selection */}
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                        <Calendar 
                            pickupDate={pickupDate}
                            returnDate={returnDate}
                            activeField={activeField}
                            setPickupDate={setPickupDate}
                            setReturnDate={setReturnDate}
                        />                        
                    </div>
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col gap-8">
                                <h3 className="text-2xl font-black text-gray-950">Reserveer nu</h3>
                                
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-600 uppercase">Ophaaldatum</label>
                                        <input 
                                            type="date" 
                                            value={pickupDate}
                                            min={formatDate(new Date(Date.now() + 86400000))}
                                            onFocus={() => setActiveField('pickup')}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            className="w-full px-6 py-4 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:ring-0 outline-none transition-all text-black font-medium shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-600 uppercase">Inleverdatum</label>
                                        <input 
                                            type="date" 
                                            value={returnDate}
                                            min={pickupDate}
                                            onFocus={() => setActiveField('return')}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            className="w-full px-6 py-4 border-2 border-orange-100 rounded-xl focus:border-orange-400 focus:ring-0 outline-none transition-all text-black font-medium shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className={`w-3 h-3 rounded-full ${availableStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-gray-700 font-bold">
                                        {availableStock} exemplaren direct beschikbaar
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirmReservation}
                                disabled={!canReserve}
                                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all transform active:scale-95 mt-10
                                    ${canReserve 
                                        ? 'bg-slate-900 text-white hover:bg-slate-950 hover:shadow-orange-200 cursor-pointer' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {availableStock > 0 
                                    ? (datesSelected ? 'Reservering Bevestigen' : 'Kies uw datums') 
                                    : 'Niet op voorraad'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-10 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Klusloods - Verhuur met een glimlach
            </footer>
        </div>
    );
}