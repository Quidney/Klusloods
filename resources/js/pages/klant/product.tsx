import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import RoleToolbar from '@/components/role-toolbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Interfaces ---
interface Barcode {
    id: number;
    status: string;
}

interface Reservation {
    id: number;
    tool_id: number;
    barcode_id: number;
    pickup_date: string;
    return_date: string;
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
    existingReservations: Reservation[];
    editReservation?: { id: number; pickup_date: string; return_date: string } | null;
}

// --- Helper Components ---
function LabelValue({ label, value, valueClassName = "text-lg text-gray-950 font-bold" }: { label: string, value: string | number, valueClassName?: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
            <span className={valueClassName}>{value}</span>
        </div>
    );
}

// --- Calendar Component ---
interface CalendarProps {
    pickupDate: string;
    returnDate: string;
    activeField: 'pickup' | 'return' | null;
    setPickupDate: React.Dispatch<React.SetStateAction<string>>;
    setReturnDate: React.Dispatch<React.SetStateAction<string>>;
    existingReservations: Reservation[];
    totalStock: number;
}

function Calendar({
    pickupDate,
    returnDate,
    activeField,
    setPickupDate,
    setReturnDate,
    existingReservations,
    totalStock
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
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Maandag als eerste dag

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getAvailableForRange = (startStr: string, endStr: string) => {
        if (totalStock === 0) return 0;
        const busyBarcodes = new Set();
        existingReservations.forEach(res => {
            if (res.pickup_date <= endStr && res.return_date >= startStr) {
                busyBarcodes.add(res.barcode_id);
            }
        });
        const count = totalStock - busyBarcodes.size;
        return count < 0 ? 0 : count;
    };

    const handleClick = (formatted: string, isSelectable: boolean) => {
        if (!isSelectable) return;
        if (activeField === 'pickup' || (!pickupDate && !activeField)) {
            setPickupDate(formatted);
            if (returnDate && (new Date(returnDate) < new Date(formatted) || getAvailableForRange(formatted, returnDate) <= 0)) {
                setReturnDate('');
            }
        } else if (activeField === 'return' || (pickupDate && !activeField)) {
            if (!pickupDate || new Date(formatted) < new Date(pickupDate)) return;
            setReturnDate(formatted);
        }
    };

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} />);
    }

    const maxReservationDate = new Date();
    maxReservationDate.setDate(maxReservationDate.getDate() + 30);

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const formatted = formatDate(dateObj);
        const isPast = dateObj < tomorrow;
        const isTooFar = dateObj > maxReservationDate; 
        const dailyAvailable = getAvailableForRange(formatted, formatted);
        const isPickup = pickupDate === formatted;
        const isReturn = returnDate === formatted;

        let isSelectable = false;
        if (!isPast && !isTooFar) {
            if (activeField === 'pickup' || !pickupDate) {
                isSelectable = dailyAvailable > 0;
            } else if ((activeField === 'return' || pickupDate) && formatted >= pickupDate) {
                isSelectable = getAvailableForRange(pickupDate, formatted) > 0;
            }
        }

        days.push(
            <div
                key={d}
                onClick={() => handleClick(formatted, isSelectable)}
                className={`h-12 flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition
                    ${(isPast || isTooFar)
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : (!isSelectable 
                            ? 'bg-red-50 text-red-300 cursor-not-allowed' 
                            : 'bg-green-50 text-green-800 cursor-pointer hover:bg-green-100'
                        )
                    }
                    ${isPickup ? '!bg-green-400 !text-green-950 ring-2 ring-green-600' : ''}
                    ${isReturn ? '!bg-red-400 !text-red-950 ring-2 ring-red-600' : ''}
                `}
            >
                <span>{d}</span>
                {!isPast && !isTooFar && (
                    <span className="text-[9px] font-normal leading-tight opacity-80">
                        {dailyAvailable} vrij
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 p-6 bg-white">
            <div className="flex items-center justify-between">
                <button onClick={prevMonth} className="text-gray-400 hover:text-orange-500 font-bold p-2">←</button>
                <span className="font-bold text-gray-900 text-xl">{monthNames[month]} {year}</span>
                <button onClick={nextMonth} className="text-gray-400 hover:text-orange-500 font-bold p-2">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-400">
                {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">{days}</div>
        </div>
    );
}

// --- Main Component ---
export default function Reservering({ tool, existingReservations = [], editReservation = null }: Props) {
    const [pickupDate, setPickupDate] = useState<string>(editReservation?.pickup_date || '');
    const [returnDate, setReturnDate] = useState<string>(editReservation?.return_date || '');
    const [activeField, setActiveField] = useState<'pickup' | 'return' | null>(editReservation ? 'return' : 'pickup');

    // Filter huidige reservering uit lijst bij wijzigen
    const filteredReservations = useMemo(() => {
        if (!editReservation) return existingReservations;
        return existingReservations.filter(res => res.id !== editReservation.id);
    }, [existingReservations, editReservation]);

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const todayStr = formatDate(new Date());
    const maxReservationDate = new Date();
    maxReservationDate.setDate(maxReservationDate.getDate() + 30);
    const maxDateStr = formatDate(maxReservationDate);

    const formatPrice = (amount: string | number | undefined) => {
        if (amount === undefined || amount === null) return '€ --';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `€ ${num.toFixed(2).replace('.', ',')}`;
    };

    const totalStock = tool?.barcode?.length || tool?.stockCount || 0;

    const isAvailableInRange = useMemo(() => {
        if (!pickupDate || !returnDate || totalStock === 0) return true;
        const overlappingCount = new Set(
            filteredReservations
                .filter(r => r.pickup_date <= returnDate && r.return_date >= pickupDate)
                .map(r => r.barcode_id)
        ).size;
        return (totalStock - overlappingCount) > 0;
    }, [pickupDate, returnDate, filteredReservations, totalStock]);

    const stockForSelectedRange = useMemo(() => {
        if (!pickupDate || !returnDate || totalStock === 0) return 0;
        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        let minAvailable = totalStock;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const currentDayStr = formatDate(d);
            const busyCount = new Set(
                filteredReservations
                    .filter(r => r.pickup_date <= currentDayStr && r.return_date >= currentDayStr)
                    .map(r => r.barcode_id)
            ).size;
            const available = totalStock - busyCount;
            if (available < minAvailable) minAvailable = available;
        }
        return minAvailable < 0 ? 0 : minAvailable;
    }, [pickupDate, returnDate, filteredReservations, totalStock]);

    const currentlyAvailable = totalStock - new Set(
        filteredReservations
            .filter(r => {
                const now = formatDate(new Date());
                return r.pickup_date <= now && r.return_date >= now;
            })
            .map(r => r.barcode_id)
    ).size;

    const priceDetails = useMemo(() => {
        if (!pickupDate || !returnDate) return { days: 0, weeks: 0, extraDays: 0, total: 0 };
        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays <= 0) return { days: 0, weeks: 0, extraDays: 0, total: 0 };

        const dayPrice = Number(tool?.detailed_price?.day) || Number(tool?.price?.dayprice) || 0;
        const weekPrice = Number(tool?.detailed_price?.week) || (dayPrice * 7);

        const weeks = Math.floor(totalDays / 7);
        const extraDays = totalDays % 7;
        const totalCost = (weeks * weekPrice) + (extraDays * dayPrice);

        return { days: totalDays, weeks, extraDays, total: totalCost };
    }, [pickupDate, returnDate, tool]);

    const datesSelected = pickupDate !== '' && returnDate !== '' && priceDetails.days > 0;
    const canReserve = datesSelected && isAvailableInRange;

    const handleConfirmReservation = () => {
        if (!canReserve) return;
        if (editReservation) {
        router.patch(`/klant/reserveringen/${editReservation.id}`, { 
            pickupDate, 
            returnDate 
        }, 
        {       onSuccess: () => toast.success('✅ Reservering succesvol gewijzigd!'),
                onError: (err) => toast.error('Oeps! ' + Object.values(err).join(', '))
            });
        } else {
            router.post('/klant/reserveren', { tool_id: tool.id, pickupDate, returnDate }, {
                onSuccess: () => {
                    setPickupDate('');
                    setReturnDate('');
                    setActiveField('pickup');
                    toast.success('🎉 Reservering succesvol geplaatst!');
                },
                onError: (err) => toast.error('Oeps! ' + Object.values(err).join(', '))
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title={`${editReservation ? 'Wijzigen' : 'Reserveren'} - ${tool?.name || 'Product'}`} />
            <ToastContainer />

            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.visit('/klant/producten')}>
                        <span className="text-orange-500 text-3xl">🛠️</span>
                        <span className="text-3xl font-extrabold text-gray-950 tracking-tight">Klusloods</span>
                    </div>
                    <button onClick={() => window.history.back()} className="text-gray-500 hover:text-orange-500 font-bold flex items-center gap-2 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7" /></svg>
                        Terug
                    </button>
                </div>
            </nav>

            <RoleToolbar role="klant" />

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
                {editReservation && (
                    <div className="mb-6 p-4 bg-blue-600 text-white rounded-2xl shadow-lg flex justify-between items-center">
                        <div>
                            <p className="font-black text-lg">Je bent een reservering aan het wijzigen</p>
                            <p className="text-sm opacity-90">Kies je nieuwe gewenste datums in de kalender.</p>
                        </div>
                        <button onClick={() => router.visit('/klant/reserveringen')} className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-50">
                            Annuleren
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-10">
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-6">
                            {tool?.images ? (
                                <img src={`${tool.images.replace('public/', '')}`} alt={tool.name} className="max-w-full max-h-full object-contain" />
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
                                <p className="text-lg text-gray-700 leading-relaxed">{tool?.description || 'Geen omschrijving beschikbaar.'}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-8 mt-4">
                                <LabelValue label="Per dag" value={formatPrice(tool?.detailed_price?.day || tool?.price?.dayprice)} valueClassName="text-2xl font-bold text-orange-600" />
                                <LabelValue label="Per week" value={formatPrice(tool?.detailed_price?.week)} />
                                <LabelValue label="Borg" value={formatPrice(tool?.detailed_price?.deposit || 50)} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                            <Calendar 
                                pickupDate={pickupDate} returnDate={returnDate} activeField={activeField}
                                setPickupDate={setPickupDate} setReturnDate={setReturnDate}
                                existingReservations={filteredReservations} totalStock={totalStock}
                            />                        
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col gap-8">
                                <h3 className="text-2xl font-black text-gray-950">
                                    {editReservation ? 'Nieuwe periode kiezen' : 'Wanneer heb je het nodig?'}
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-600 uppercase">Ophaaldatum</label>
                                        <input 
                                            type="date" value={pickupDate} min={todayStr} max={maxDateStr}
                                            onFocus={() => setActiveField('pickup')}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            className="w-full px-6 py-4 border-2 border-orange-100 rounded-xl focus:border-orange-400 outline-none text-black font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-600 uppercase">Inleverdatum</label>
                                        <input 
                                            type="date" value={returnDate} min={pickupDate || todayStr} max={maxDateStr}
                                            onFocus={() => setActiveField('return')}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            className="w-full px-6 py-4 border-2 border-orange-100 rounded-xl focus:border-orange-400 outline-none text-black font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className={`w-3 h-3 rounded-full ${(datesSelected ? stockForSelectedRange : currentlyAvailable) > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-gray-700 font-bold text-sm">
                                        {datesSelected ? `${stockForSelectedRange} beschikbaar voor deze periode` : `${currentlyAvailable} op voorraad`}
                                    </span>
                                </div>
                                {!isAvailableInRange && pickupDate && returnDate && (
                                    <div className="p-4 bg-red-100 border border-red-200 text-red-600 font-bold rounded-xl text-center text-sm">
                                        Geen aaneengesloten exemplaar beschikbaar voor deze periode.
                                    </div>
                                )}
                            </div>

                            <div className="mt-10">
                                {datesSelected && isAvailableInRange && (
                                    <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Totaal dagen:</span> <span className="font-bold">{priceDetails.days}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 py-2 border-y border-orange-100 my-2">
                                                {priceDetails.weeks > 0 && (
                                                    <div className="flex justify-between text-gray-700 text-sm">
                                                        <span>{priceDetails.weeks}x Weekprijs</span>
                                                        <span className="font-semibold">{formatPrice(priceDetails.weeks * (Number(tool?.detailed_price?.week) || 0))}</span>
                                                    </div>
                                                )}
                                                {priceDetails.extraDays > 0 && (
                                                    <div className="flex justify-between text-gray-700 text-sm">
                                                        <span>{priceDetails.extraDays}x Dagprijs</span>
                                                        <span className="font-semibold">{formatPrice(priceDetails.extraDays * (Number(tool?.detailed_price?.day) || 0))}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-bold text-lg">Totaalprijs:</span>
                                                <span className="text-3xl font-black text-orange-600">{formatPrice(priceDetails.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button 
                                    onClick={handleConfirmReservation}
                                    disabled={!canReserve}
                                    className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all transform active:scale-95
                                        ${canReserve ? 'bg-slate-900 text-white hover:bg-slate-950 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {totalStock > 0 ? (datesSelected ? (isAvailableInRange ? (editReservation ? 'Wijziging Opslaan' : 'Reservering Bevestigen') : 'Kies andere datums') : 'Kies je datums') : 'Niet op voorraad'}
                                </button>
                            </div>
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