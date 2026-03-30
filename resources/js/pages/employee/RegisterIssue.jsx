import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle } from "lucide-react";
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

  const handleSearch = () => {
    const filtered = reservations.filter(
      (r) =>
        r.id.toString().includes(query) ||
        r.user?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  useEffect(() => {
    setSelectedItem(null);
  }, [query]);

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

    if (selectedReservation.status === "uitgegeven") {
      setMessage("Deze reservering is al uitgegeven.");
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
      setSelectedReservation(res.reservation);
      setResults(results.map(r =>
        r.id === selectedReservation.id ? { ...r, status: 'uitgegeven' } : r
      ));
      setSelectedReservation({ ...selectedReservation, status: 'uitgegeven' });

      setSelectedItem(null);

    } catch (error) {
      console.error(error);
      toast.error("Er is iets misgegaan bij het uitgeven.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">Reservering Uitgeven</h1>

        {/* SEARCH */}
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
            className="bg-orange-500 text-white px-4 rounded-lg"
          >
            <Search />
          </button>
        </div>

        {/* RESULTS */}
        <div className="space-y-3 mb-6">
          {results.map((res) => (
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
              className={`p-4 border rounded-lg cursor-pointer ${selectedReservation?.id === res.id
                ? "border-orange-500"
                : ""
                }`}
            >
              <p className="font-bold">{res.id}</p>
              <p className="text-sm text-slate-600">{res.user?.name}</p>
              <p className="text-xs">{res.status}</p>
            </div>
          ))}
        </div>

        {/* INVENTORY SELECT */}
        {selectedReservation && (
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

            {/* DATES */}
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

            {/* OPTIONAL FIELDS */}
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

            {/* ACTION */}
            <button
              onClick={handleIssue}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg"
            >
              Uitgeven
            </button>
          </>
        )}
        

        {/* MESSAGE */}
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
    </div>
    
  )
}