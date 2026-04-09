import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Bath, Car, Sofa, Search, AlertCircle, Layers } from 'lucide-react';
import { fetchCities, predictRent } from '../utils/api';

// Lazy-load Leaflet only in browser
let MapContainer, TileLayer, Marker, useMapEvents, L;
const loadLeaflet = async () => {
  if (typeof window !== 'undefined') {
    const leaflet = await import('leaflet');
    const rl = await import('react-leaflet');
    L = leaflet.default;
    MapContainer = rl.MapContainer;
    TileLayer = rl.TileLayer;
    Marker = rl.Marker;
    useMapEvents = rl.useMapEvents;

    // Fix marker icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    return true;
  }
  return false;
};

// City coords
const CITY_COORDS = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873],
  Surat: [21.1702, 72.8311],
};

function MapClickHandler({ onMapClick }) {
  useMapEvents && useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [furnishingTypes, setFurnishingTypes] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [markerPos, setMarkerPos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMap, setUseMap] = useState(false);

  const [form, setForm] = useState({
    city: '',
    locality: '',
    bhk: 2,
    size: 900,
    bathrooms: 2,
    furnishing: 'Semi-Furnished',
    parking: 1,
    floor_num: 3,
    total_floors: 10,
    actual_rent: '',
  });

  useEffect(() => {
    fetchCities().then(d => {
      setCities(d.cities || []);
      setFurnishingTypes(d.furnishing_types || ['Furnished', 'Semi-Furnished', 'Unfurnished']);
      if (d.cities?.length) setForm(f => ({ ...f, city: d.cities[0] }));
    }).catch(() => {
      setCities(['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata']);
      setFurnishingTypes(['Furnished', 'Semi-Furnished', 'Unfurnished']);
      setForm(f => ({ ...f, city: 'Bangalore' }));
    });

    loadLeaflet().then(ok => setMapReady(ok));
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleCityChange = (city) => {
    set('city', city);
    const coords = CITY_COORDS[city];
    if (coords) setMapCenter(coords);
  };

  const handleMapClick = (latlng) => {
    setMarkerPos([latlng.lat, latlng.lng]);
    // Reverse geocode city from coords (approximate)
    const nearest = Object.entries(CITY_COORDS).reduce((best, [city, [lat, lng]]) => {
      const d = Math.abs(lat - latlng.lat) + Math.abs(lng - latlng.lng);
      return d < best.d ? { city, d } : best;
    }, { city: form.city, d: Infinity });
    set('city', nearest.city);
  };

  const handleSubmit = async () => {
    if (!form.city) { setError('Please select a city.'); return; }
    if (!form.bhk || !form.size || !form.bathrooms) { setError('Please fill all required fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        bhk: parseInt(form.bhk),
        size: parseInt(form.size),
        bathrooms: parseInt(form.bathrooms),
        parking: parseInt(form.parking),
        floor_num: parseInt(form.floor_num),
        total_floors: parseInt(form.total_floors),
        actual_rent: form.actual_rent ? parseInt(form.actual_rent) : null,
      };
      const result = await predictRent(payload);
      navigate('/results', { state: { result, inputs: payload } });
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to connect to backend. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(99,179,237,0.12)',
    borderRadius: '0.75rem',
    color: '#f0f4ff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.95rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    width: '100%',
    transition: 'all 0.25s',
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', paddingTop: '5rem' }}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* Header */}
        <div className="anim-fadeup" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.9rem', borderRadius: 999, marginBottom: '1rem',
            background: 'rgba(79,172,254,0.08)', border: '1px solid rgba(79,172,254,0.2)',
            fontSize: '0.78rem', color: '#4facfe', fontFamily: 'Syne, sans-serif', fontWeight: 600,
          }}>
            <Search size={12} /> Rent Fairness Analysis
          </div>
          <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f0f4ff', marginBottom: '0.5rem' }}>
            Tell us about the property
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.95rem' }}>Fill in the details and get your instant rent fairness report</p>
        </div>

        <div className="glass anim-fadeup delay-100" style={{ padding: '2rem' }}>

          {/* Map Toggle */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { key: false, label: 'Manual Input', icon: Home },
              { key: true, label: 'Select on Map', icon: MapPin },
            ].map(({ key, label, icon: Icon }) => (
              <button key={String(key)} onClick={() => setUseMap(key)} style={{
                flex: 1, padding: '0.7rem', borderRadius: '0.75rem',
                border: useMap === key ? '1px solid rgba(79,172,254,0.4)' : '1px solid rgba(99,179,237,0.1)',
                background: useMap === key ? 'rgba(79,172,254,0.08)' : 'transparent',
                color: useMap === key ? '#4facfe' : '#8899bb',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                fontSize: '0.88rem', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Map */}
          {useMap && mapReady && MapContainer && (
            <div style={{ marginBottom: '1.5rem', height: 300, borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(99,179,237,0.12)' }}>
              <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }} key={mapCenter.join(',')}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
            </div>
          )}

          {/* Form Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

            {/* City */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                City *
              </label>
              <select
                value={form.city}
                onChange={e => handleCityChange(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4facfe'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Locality */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Locality / Area
              </label>
              <input
                type="text" placeholder="e.g. Whitefield, Koramangala"
                value={form.locality} onChange={e => set('locality', e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4facfe'}
                onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}
              />
            </div>

            {/* BHK */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Home size={11} style={{ display: 'inline', marginRight: 4 }} />BHK *
              </label>
              <select value={form.bhk} onChange={e => set('bhk', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>

            {/* Size */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Size (sq ft) *
              </label>
              <input type="number" placeholder="e.g. 1100" value={form.size} onChange={e => set('size', e.target.value)}
                min={100} max={10000} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'} />
            </div>

            {/* Bathrooms */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Bath size={11} style={{ display: 'inline', marginRight: 4 }} />Bathrooms *
              </label>
              <select value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Sofa size={11} style={{ display: 'inline', marginRight: 4 }} />Furnishing
              </label>
              <select value={form.furnishing} onChange={e => set('furnishing', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}>
                {furnishingTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Parking */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Car size={11} style={{ display: 'inline', marginRight: 4 }} />Parking Spots
              </label>
              <select value={form.parking} onChange={e => set('parking', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'}>
                {[0,1,2,3].map(n => <option key={n} value={n}>{n === 0 ? 'None' : n}</option>)}
              </select>
            </div>

            {/* Floor */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Layers size={11} style={{ display: 'inline', marginRight: 4 }} />Floor / Total Floors
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Floor" value={form.floor_num} onChange={e => set('floor_num', e.target.value)}
                  min={0} max={60} style={{ ...inputStyle, width: '45%' }}
                  onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'} />
                <input type="number" placeholder="Total" value={form.total_floors} onChange={e => set('total_floors', e.target.value)}
                  min={1} max={60} style={{ ...inputStyle, width: '55%' }}
                  onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'} />
              </div>
            </div>
          </div>

          {/* Actual rent */}
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#8899bb', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Actual Listed Rent (₹) — optional, for comparison
            </label>
            <input type="number" placeholder="e.g. 28000 — leave blank if unknown"
              value={form.actual_rent} onChange={e => set('actual_rent', e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4facfe'} onBlur={e => e.target.style.borderColor = 'rgba(99,179,237,0.12)'} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
              color: '#f43f5e', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '1rem', borderRadius: '0.8rem',
              fontSize: '1rem', marginTop: '1.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18, height: 18, border: '2px solid rgba(5,8,16,0.3)',
                  borderTop: '2px solid #050810', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
                }} />
                Analyzing...
              </>
            ) : (
              <><Search size={18} /> Analyze Rent Fairness</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:disabled { pointer-events: none; }
      `}</style>
    </div>
  );
}
