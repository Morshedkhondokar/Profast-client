// src/components/Map/BangladeshMap.jsx
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ---------- Fix Leaflet marker icon issue ----------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ---------- Helper: fly the map to a position when `position` changes ----------
const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    map.flyTo(position, 10, { duration: 1.2 });
  }, [position, map]);
  return null;
};

const BangladeshMap = () => {
  const [districts, setDistricts] = useState([]); // loaded from public JSON
  const [query, setQuery] = useState(""); // controlled input
  const [selected, setSelected] = useState(null); // selected district object
  const [message, setMessage] = useState(""); // show not-found or info

  // load districts.json from public folder
  useEffect(() => {
    fetch("/districts.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch districts.json");
        return r.json();
      })
      .then((data) => setDistricts(data))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load district data. Check console.");
      });
  }, []);

  // handle form submit (search)
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // reset
    const text = (query || "").trim();

    if (!text) {
      setSelected(null);
      setMessage("Please type a district name.");
      return;
    }

    const lower = text.toLowerCase();
    const found = districts.find((d) =>
      d.district.toLowerCase().includes(lower)
    );

    if (found) {
      setSelected(found);
      setMessage("");
    } else {
      setSelected(null);
      setMessage(`No district found for “${text}”`);
    }
  };

  return (
    <div className="space-y-4">
      {/* ---------- Search form ---------- */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto flex gap-2 items-center"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Type your district name"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* optional message */}
      {message && (
        <div className="max-w-md mx-auto text-center text-sm text-red-600">
          {message}
        </div>
      )}

      {/* ---------- Map ---------- */}
      <div className="w-full h-[520px] rounded-xl border shadow">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Fly when selected changes */}
          {selected && (
            <FlyTo position={[selected.latitude, selected.longitude]} />
          )}

          {/* Render markers for all districts */}
          {districts.map((d, i) => (
            <Marker key={i} position={[d.latitude, d.longitude]}>
              <Popup>
                <div className="font-bold">{d.district}</div>
                <div className="text-sm">{d.city}</div>
              </Popup>
            </Marker>
          ))}

          {/* Programmatic popup at selected location */}
          {selected && (
            <Popup
              position={[selected.latitude, selected.longitude]}
              // close popup -> clear selected
              onClose={() => setSelected(null)}
            >
              <div className="font-bold">{selected.district}</div>
              <div className="text-sm">{selected.city}</div>

              {Array.isArray(selected.covered_area) && (
                <>
                  <div className="mt-2 font-semibold">Covered areas:</div>
                  <ul className="list-disc ml-4">
                    {selected.covered_area.map((a, idx) => (
                      <li key={idx} className="text-sm">
                        {a}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {selected.flowchart && (
                <div className="mt-2">
                  <a
                    href={selected.flowchart}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Flowchart
                  </a>
                </div>
              )}
            </Popup>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
