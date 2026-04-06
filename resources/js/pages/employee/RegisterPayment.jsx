import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle, AlertTriangle, Wrench, Calendar, Clock, RefreshCw } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatCurrency from '/resources/js/hooks/formatCurrency.tsx';
import RoleToolbar from '@/components/role-toolbar';

export default function RegisterPayment({ allInvoices  }) {
        const [selectedInvoice, setSelectedInvoice] = useState(null);

   const getStatusColor = (status) => {
        switch (status) {
            case 'betaald':
                return 'bg-green-500 text-white';
            case 'deels betaald':
                return 'bg-yellow-400 text-black';
            default:
                return 'bg-red-500 text-white';
        }
    };
    const [form, setForm] = useState({
        date: "",
        amount: "",
        method: "pin",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/payments", {
                ...form,
                invoice_id: selectedInvoice.id,
            });

            toast.success("Betaling opgeslagen");

            setForm({
                date: "",
                amount: "",
                method: "pin",
            });

        } catch (error) {
            console.error(error);
            toast.error("Er ging iets mis");
        }
    };
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <RoleToolbar role="medewerker" />

                   <main className="mx-auto max-w-4xl p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Betaling registreren
                </h1>

                {/* SELECT */}
                <select
                    className="w-full border p-2 rounded mb-6"
                    onChange={(e) => {
                        const inv = allInvoices.find(
                            (i) => i.id === Number(e.target.value)
                        );
                        setSelectedInvoice(inv);
                    }}
                >
                    <option value="">-- Selecteer factuur --</option>
                    {allInvoices.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                            {inv.invoice_number}
                        </option>
                    ))}
                </select>

                {selectedInvoice && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded shadow">
                        
                        <input
                            type="datetime-local"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                            className="border p-2 rounded"
                        />

                        <input
                            type="number"
                            placeholder="Bedrag"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                            className="border p-2 rounded"
                        />

                        <select
                            value={form.method}
                            onChange={(e) =>
                                setForm({ ...form, method: e.target.value })
                            }
                            className="border p-2 rounded"
                        >
                            <option value="pin">Pin</option>
                            <option value="contant">Contant</option>
                            <option value="overboeking">Overboeking</option>
                        </select>

                        <button className="bg-orange-500 text-white py-2 rounded">
                            Opslaan
                        </button>
                    </form>
                )}
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
                            © {new Date().getFullYear()} Klusloods. Alle
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