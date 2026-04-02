import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, Wrench, User, Menu } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleToolbar from '@/components/role-toolbar';

export default function RegisterMaintenance({ initialBarcodes, initialMaintenances }) {
    const [barcodes, setBarcodes] = useState(initialBarcodes || []);
    const [maintenances, setMaintenances] = useState(initialMaintenances || []);
    const [barcodeId, setBarcodeId] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [barcodeFilter, setBarcodeFilter] = useState("");
    const [status, setStatus] = useState("open");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!barcodeId || !date || !description) {
            toast.error("Vul alle verplichte velden in");
            return;
        }
        try {
            if (isSubmitting) return;

            setIsSubmitting(true);
            const response = await axios.post("/medewerker/onderhoud", {
                barcode_id: barcodeId,
                maintenance_date: date,
                description,
                cost: cost || null,
                status,
            });
            console.log(response);
            toast.success("Onderhoud aangemaakt");
            setMaintenances([...maintenances, response.data.maintenance]);

            setBarcodeId("");
            setDate("");
            setDescription("");
            setCost("");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Er is een fout opgetreden");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            const response = await axios.patch(`/medewerker/onderhoud/${id}/complete`);


            const updatedMaintenance = response.data.maintenance || response.data;

            setMaintenances(prevMaintenances =>
                prevMaintenances.map(m => m.id === id ? { ...m, ...updatedMaintenance, status: 'afgerond' } : m)
            );

            toast.success("Onderhoud afgerond");
        } catch (error) {
            console.error("Fout bij afronden:", error);
            toast.error(error.response?.data?.message || "Kon onderhoud niet afronden");
        }
    };

    const filtered = maintenances.filter(m =>
        (statusFilter ? m.status === statusFilter : true) &&
        (barcodeFilter ? m.barcode_id.toString() === barcodeFilter : true)
    );


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

            <main className="flex-grow p-5 ">
                <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Wrench className="h-5 w-5 text-orange-500" /> Nieuw Onderhoud
                    </h3>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700">Exemplaar</label>
                        <select
                            className="mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                            value={barcodeId}
                            onChange={e => setBarcodeId(e.target.value)}
                        >
                            <option value="">Selecteer een exemplaar</option>
                            {barcodes.map(b => (
                                <option key={b.id} value={b.id}>{b.barcode}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700">Datum</label>
                        <input
                            type="date"
                            className="mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700">Omschrijving</label>
                        <textarea
                            className="mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700">Kosten (optioneel)</label>
                        <input
                            type="number"
                            className="mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            min={0}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <select
                            className="mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="open">Open</option>
                            <option value="afgerond">Afgerond</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`font-bold px-4 py-2 rounded-lg transition-colors ${isSubmitting
                            ? "bg-slate-300 cursor-not-allowed text-slate-500"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                    >
                        {isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
                    </button>
                </form>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Onderhoudsoverzicht</h3>

                    <div className="flex gap-4 mb-4">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        >
                            <option value="">Alles</option>
                            <option value="open">Open</option>
                            <option value="afgerond">Afgerond</option>
                        </select>

                        <select
                            value={barcodeFilter}
                            onChange={e => setBarcodeFilter(e.target.value)}
                            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        >
                            <option value="">Alle exemplaren</option>
                            {barcodes.map(b => (
                                <option key={b.id} value={b.id}>{b.barcode}</option>
                            ))}
                        </select>
                    </div>

                    {filtered.map(m => {
                        if (!m) return null;

                        const barcode = m.barcode || barcodes.find(b => b.id === m.barcode_id);

                        return (
                            <div key={m.id} className="flex justify-between items-center border-b border-slate-200 py-2">
                                <div>
                                    <p className="text-sm font-medium">{barcode?.barcode || "Onbekend"}</p>
                                    <p className="text-xs text-slate-500">{m.description}</p>
                                    <p className="text-xs text-slate-400">{m.date} | Kosten: {m.cost || "n.v.t"}</p>
                                </div>
                                {m.status === "open" ? (
                                    <button
                                        className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 text-sm"
                                        onClick={() => handleComplete(m.id)}
                                    >
                                        Afronden
                                    </button>
                                ) : (
                                    <span className="text-green-600 font-semibold text-sm">Afgerond</span>
                                )}
                            </div>
                        );
                    })}
                </div>

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