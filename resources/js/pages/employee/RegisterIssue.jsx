import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, Wrench, User, Menu } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function RegisterIssue({ reservations }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [condition, setCondition] = useState("");
  const [accessories, setAccessories] = useState("");
  const [message, setMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);


  const handleSearch = () => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults([]);
      setHasSearched(true);
      return;
    }

    const filtered = reservations.filter((r) => {
      const fullName = `${r.user?.firstname ?? ""} ${r.user?.lastname ?? ""}`.toLowerCase();

      return (
        r.id.toString().includes(q) ||
        fullName.includes(q) ||
        r.user?.email?.toLowerCase().includes(q)
      );
    });

    setResults(filtered);
    setHasSearched(true);
  };

  useEffect(() => {
    setSelectedItem(null);
  }, [query]);

  useEffect(() => {
    if (selectedReservation?.barcode) {
      setSelectedItem(selectedReservation.barcode);
    }
  }, [selectedReservation]);

  const handleIssue = async () => {
    if (!selectedReservation) return;

    if (selectedReservation.status === "geannuleerd") {
      toast.error("Deze reservering is geannuleerd.");
      return;
    }

    if (selectedReservation.status === "uitgegeven") {
      toast.error("Deze reservering is al uitgegeven.");
      return;
    }

    if (!selectedItem) {
      toast.warning("Selecteer een beschikbaar exemplaar.");
      return;
    }

    try {
      const res = await axios.patch(`/medewerker/reservations/${selectedReservation.id}`, {
        barcode_id: selectedItem.id,
        condition,
        accessories,
      });
      toast.success("Succesvol uitgegeven!");
      setSelectedReservation(res.data.reservation);
      setResults(results.map(result =>
        result.id === selectedReservation.id ? { ...result, status: 'uitgegeven' } : result
      ));
      setSelectedReservation({ ...selectedReservation, status: 'uitgegeven' });

      setQuery("");
      setResults([]);
      setSelectedReservation(null);
      setSelectedItem(null);
      setCondition("");
      setAccessories("");
      setHasSearched(false);

    } catch (error) {
      console.error(error);
      toast.error("Er is iets misgegaan bij het uitgeven.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

          <h1 className="text-2xl font-bold mb-6 p-2">Reservering Uitgeven</h1>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Zoek op reserveringsnummer of klantnaam"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSearch}
              className="bg-orange-500 px-4 rounded-lg"
            >
              <Search />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {hasSearched && results.length === 0 ? (
              <p className="text-slate-500">reservering niet gevonden</p>
            ) : (
              results.map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    if (selectedReservation?.id === res.id) {
                      setSelectedReservation(null);
                      setSelectedItem(null);
                    } else {
                      setSelectedReservation(res);
                      setSelectedItem(null);
                    }
                  }}
                  className={`p-4 border rounded-lg cursor-pointer ${selectedReservation?.id === res.id ? "border-orange-500" : ""
                    }`}
                >
                  <p className="font-bold">{res.id}</p>
                  <p className="text-sm text-slate-600">
                    {res.user?.firstname} {res.user?.lastname}
                  </p>
                  <p className="text-xs">{res.status}</p>
                </div>
              ))
            )}
          </div>

          {selectedReservation && results.length > 0 && (
            <>
              <h2 className="font-semibold mb-2">Selecteer exemplaar</h2>

              <div className="space-y-2 mb-6">
                {selectedReservation.barcode ? (
                  <div
                    onClick={() => setSelectedItem(selectedReservation.barcode)}
                    className={`p-3 border rounded cursor-pointer ${selectedItem?.id === selectedReservation.barcode.id
                      ? "border-orange-500"
                      : ""
                      }`}
                  >
                    {selectedReservation.barcode.tool?.name} (
                    {selectedReservation.barcode.barcode})
                  </div>
                ) : (
                  <p>Geen barcode gevonden</p>
                )}
              </div>

              <div className="mb-6 p-4 bg-slate-100 rounded-lg">
                <h3 className="font-semibold mb-2">Reserveringsperiode</h3>

                <p className="text-sm">
                  <span className="font-medium">Ophaaltijd:</span>{" "}
                  {new Date(selectedReservation.pickuptime).toLocaleString()}
                </p>

                <p className="text-sm">
                  <span className="font-medium">Retourtijd:</span>{" "}
                  {new Date(selectedReservation.returntime).toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Startconditie (optioneel)
                </label>
                <input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-1">
                  Accessoires (optioneel)
                </label>
                <input
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <button
                onClick={handleIssue}
                disabled={selectedReservation?.status === 'uitgegegeven'}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200
                ${selectedReservation?.status === "uitgegeven"
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-slate-900 hover:bg-orange-500 cursor-pointer text-white"
                  }`}
                >
                <CheckCircle className="h-5 w-5" />
                Uitgeven
              </button>
            </>
          )}


          {message && (
            <div className="mt-6 flex items-center gap-2 text-sm">
              {message.includes("Succes") ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <AlertTriangle className="text-red-500" />
              )}
              <span>{message}</span>
            </div>
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