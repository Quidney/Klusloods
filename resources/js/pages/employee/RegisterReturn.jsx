import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, Wrench, User, Menu } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleToolbar from '@/components/role-toolbar';

export default function RegisterReturn({ reservations }) {
    const [reservationList, setReservationList] = useState(reservations);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [returnStatus, setReturnStatus] = useState("");
    const [description, setDescription] = useState("");
    const [damageCost, setDamageCost] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [showReservation, setShowReservation] = useState(false);

    const today = new Date().toISOString().slice(0, 16);

    const handleReturn = async () => {
        if (!selectedReservation) return;

        try {
            const res = await axios.patch(`/medewerker/retour/${selectedReservation.id}`, {
                return_date: returnDate,
                status: returnStatus,
                description,
                damage_cost: damageCost,
            });
            toast.success("Retour succesvol verwerkt!");
            
            setReservationList(prev =>
                prev.filter(r => r.id !== selectedReservation.id)
            );

            setSelectedReservation(null);
            setReturnStatus("");
            setDescription("");
            setDamageCost("");
            setReturnDate("");

        } catch (error) {
            toast.error("Fout bij retour registreren");
        }
    };
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

            <RoleToolbar role="medewerker" />

            <main className="flex-grow">
                <div className="max-w-xl mx-auto space-y-3 mb-6 mt-5">
                    {reservationList.filter(res => res.status === "uitgegeven").length > 0 ? (
                        reservationList
                            .filter(res => res.status === "uitgegeven")
                            .map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => {
                                        if (selectedReservation?.id === res.id) {
                                            setSelectedReservation(null);
                                            setShowReservation(false);
                                        } else {
                                            setSelectedReservation(res);
                                            setShowReservation(true);
                                        }
                                    }}
                                    className={`p-4 border rounded-lg cursor-pointer ${selectedReservation?.id === res.id ? "border-orange-500" : ""
                                        }`}
                                >
                                    <p className="font-bold">Reservering #{res.id}</p>
                                    <p className="text-sm text-slate-600">
                                        Klant: {res.user?.firstname} {res.user?.lastname}
                                    </p>
                                    <p className="text-xs">Status: {res.status}</p>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">
                            Er zijn geen reservations die uitgegeven zijn.
                        </p>
                    )}
                </div>
                {selectedReservation && showReservation && (
                    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto">

                        <h2 className="text-xl font-bold mb-4">Retour registreren</h2>

                        {/* Datum */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Retourdatum</label>
                            <input
                                type="datetime-local"
                                value={returnDate}
                                min={today}
                                onChange={(e) => setReturnDate(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        {/* Status */}
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Status</label>
                            <select
                                value={returnStatus}
                                onChange={(e) => setReturnStatus(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option disabled value="">Kies status</option>
                                <option value="in orde">in orde</option>
                                <option value="schoonmaak nodig">Schoonmaak nodig</option>
                                <option value="schade">Schade</option>
                                <option value="defect">Defect</option>
                            </select>
                        </div>

                        {(returnStatus === "schade" || returnStatus === "defect") && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm mb-1">Beschrijving</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm mb-1">Schadebedrag (€)</label>
                                    <input
                                        type="number"
                                        value={damageCost}
                                        min={0}
                                        onChange={(e) => setDamageCost(e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            </>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleReturn}
                            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition cursor-pointer"
                        >
                            Retour registreren
                        </button>
                    </div>
                )}

            </main>


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