import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle, AlertTriangle, Wrench, User, Menu, Calendar, Clock, RefreshCw } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatCurrency from '/resources/js/hooks/formatCurrency.tsx';


export default function ExtensionRequest({ reservations }) {
    const [searchId, setSearchId] = useState("");
    const [reservation, setReservation] = useState(null);
    const [localReservations, setLocalReservations] = useState(reservations);
    const [newEndDate, setNewEndDate] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    console.log("reservations", reservations);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        const found = localReservations.find(r => r.id.toString() === searchId);

        if (!found) {
            toast.error("Reservering niet gevonden");
            return;
        }

        setReservation(found);
        setNewEndDate(found.returntime);
    };

    const handleExtend = async () => {
        setIsChecking(true);

        try {
            const response = await axios.patch(`/medewerker/reservations/${reservation.id}/extend`, {
                new_returntime: newEndDate
            });
            const updatedReservation = response.data.reservation;
            toast.success(response.data.message);
            setLocalReservations(prev =>
                prev.map(r => r.id === updatedReservation.id ? updatedReservation : r)
            );
            setReservation(updatedReservation);
            console.log(response);
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Er is een fout opgetreden bij het verlengen.");
            }
        } finally {
            setIsChecking(false);
        }
    };

    const extensionDetails = useMemo(() => {
    if (!reservation || !newEndDate || !reservation.barcode?.tool?.price) return null;

    const start = new Date(reservation.returntime);
    const end = new Date(newEndDate);

    // Zet beide tijden op 00:00:00 om puur het verschil in dagen te berekenen
    const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const diffTime = endDateOnly - startDateOnly;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Alleen kosten berekenen als de nieuwe datum echt later is dan de oude
    if (diffDays <= 0) return null;

    const dayPrice = reservation.barcode.tool.price[0]?.dayprice || 0;
    const extraCost = diffDays * dayPrice;

    return { diffDays, extraCost };
}, [reservation, newEndDate]); // <--- Luister naar deze variabelen




    return (
        <div className="flex flex-col min-h-screen">
            {/* --- NAVIGATION --- */}
            <nav className="sticky top-0 z-50 bg-slate-900">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-orange-500 p-2">
                            <Wrench className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Build<span className="text-orange-500">Rent</span>
                        </span>
                        <span className="ml-4 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-bold text-orange-400">
                            BEHEERDER
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
            <main className="flex-grow bg-slate-50 py-12">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Huur Verlengen</h1>
                        <p className="text-slate-600">Pas de retourdatum aan voor een lopende reservering.</p>
                    </div>

                    <section className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Zoek op Reservering ID (bijv. 1)..."
                                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Zoeken
                            </button>
                        </form>
                    </section>

                    {reservation && (
                        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                                <div className="mb-6 grid grid-cols-2 gap-4 border-b border-slate-100 pb-6">
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Klant</p>
                                        <p className="text-lg font-semibold">
                                            {reservation.user.firstname} {reservation.user.lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Object</p>
                                        <p className="text-lg font-semibold">  {reservation.barcode.tool.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Huidige Retourdatum</p>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(reservation.returntime).toLocaleDateString('nl-NL')}</span>
                                            <Clock className="h-4 w-4 ml-2" />
                                            <span>{new Date(reservation.returntime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-700">Nieuwe Retourdatum & Tijd</label>
                                    <input
                                        type="datetime-local"
                                        step="60"
                                        className="w-full rounded-lg border border-slate-300 p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                        value={newEndDate}
                                        onChange={(e) => setNewEndDate(e.target.value)}
                                        min={reservation.returntime}
                                    />


                                </div>
                                <div className="mt-6 rounded-xl bg-slate-50 p-5 border border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Prijsoverzicht</h3>

                                    {reservation?.barcode?.tool?.price?.length ? (
                                        reservation.barcode.tool.price.map((p) => (
                                            <div key={p.id} className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Standaard dagtarief:</span>
                                                    <span className="font-semibold text-slate-900">{formatCurrency({ price: p.dayprice })}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Waarborg (reeds voldaan):</span>
                                                    <span className="font-semibold text-slate-900">{formatCurrency({ price: p.deposit })}</span>
                                                </div>

                                                {extensionDetails && (
                                                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-orange-600 flex items-center gap-1">
                                                                <Clock className="h-4 w-4" /> Verlenging: {extensionDetails.diffDays} dag(en)
                                                            </span>
                                                            <span className="text-lg font-bold text-orange-600">
                                                                + {formatCurrency({ price: extensionDetails.extraCost })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 italic">
                                                            * De extra kosten worden berekend op basis van het aantal extra dagen maal de dagprijs.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Geen prijsinformatie beschikbaar</p>
                                    )}
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={handleExtend}
                                        disabled={isChecking || !newEndDate}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50"
                                    >
                                        {isChecking ? <RefreshCw className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                                        Verlenging Bevestigen
                                    </button>
                                    <button
                                        onClick={() => setReservation(null)}
                                        className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Annuleren
                                    </button>
                                </div>
                            </div>

                        </section>
                    )}
                </div>
            </main>
            {/* FOOTER*/}
            <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-slate-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-6 flex items-center gap-2">
                                <div className="rounded-lg bg-orange-500 p-1.5">
                                    <Wrench className="h-5 w-5 " />
                                </div>
                                <span className="text-xl font-bold tracking-tight ">
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
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:">
                                    <span className="font-bold">fb</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:">
                                    <span className="font-bold">ig</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:">
                                    <span className="font-bold">x</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider  uppercase">
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
                            <h4 className="mb-6 text-sm font-bold tracking-wider  uppercase">
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
                            <h4 className="mb-6 text-sm font-bold tracking-wider  uppercase">
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
                                className="transition-colors hover:"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="transition-colors hover:"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}