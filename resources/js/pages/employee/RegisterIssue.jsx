import { useState } from "react";
import { Search, CheckCircle, AlertTriangle } from "lucide-react";

const mockReservations = [
  {
    id: "RES-001",
    customer: "Jan Jansen",
    status: "Gereserveerd",
    items: ["Boormachine"],
  },
  {
    id: "RES-002",
    customer: "Piet Pieters",
    status: "Geannuleerd",
    items: ["Graafmachine"],
  },
];

const mockInventory = [
  { id: "EQ-100", name: "Boormachine #1", available: true },
  { id: "EQ-101", name: "Boormachine #2", available: true },
  { id: "EQ-200", name: "Graafmachine #1", available: false },
];


export default function RegisterIssue() {
    const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [condition, setCondition] = useState("");
  const [accessories, setAccessories] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = () => {
    const filtered = mockReservations.filter(
      (r) =>
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.customer.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const handleIssue = () => {
    if (!selectedReservation) return;

    if (selectedReservation.status === "Geannuleerd") {
      setMessage("Deze reservering is geannuleerd.");
      return;
    }

    if (!selectedItem) {
      setMessage("Selecteer een beschikbaar exemplaar.");
      return;
    }

    setMessage("Succesvol uitgegeven!");
    // hier zou je API call doen
  };

    return(
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
              onClick={() => setSelectedReservation(res)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedReservation?.id === res.id
                  ? "border-orange-500"
                  : ""
              }`}
            >
              <p className="font-bold">{res.id}</p>
              <p className="text-sm text-slate-600">{res.customer}</p>
              <p className="text-xs">{res.status}</p>
            </div>
          ))}
        </div>

        {/* INVENTORY SELECT */}
        {selectedReservation && (
          <>
            <h2 className="font-semibold mb-2">Selecteer exemplaar</h2>
            <div className="space-y-2 mb-6">
              {mockInventory
                .filter((i) => i.available)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedItem?.id === item.id
                        ? "border-orange-500"
                        : ""
                    }`}
                  >
                    {item.name}
                  </div>
                ))}
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
      </div>
    </div>
    )
}