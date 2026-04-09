import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Cell, Legend,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain, MapPin, Home, Sparkles, RefreshCw } from 'lucide-react';
import { explainRent } from '../utils/api';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const pct = (n) => `${n > 0 ? '+' : ''}${n}%`;

function ScoreRing({ score, label }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = label === 'Overpriced' ? '#f43f5e' : label === 'Underpriced' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={radius} fill="none" stroke="rgba(99,179,237,0.08)" strokeWidth={10} />
        <circle cx={65} cy={65} r={radius} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
        <text x={65} y={60} textAnchor="middle" fill={color} fontSize={26} fontWeight={800} fontFamily="Syne, sans-serif">{score}</text>
        <text x={65} y={78} textAnchor="middle" fill="#8899bb" fontSize={11} fontFamily="DM Sans, sans-serif">/100</text>
      </svg>
      <div style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: '0.25rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Fairness Score
      </div>
    </div>
  );
}

function FairnessBadge({ label }) {
  const styles = {
    Overpriced: { bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.3)', color: '#f43f5e', icon: TrendingUp },
    Fair: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#10b981', icon: Minus },
    Underpriced: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', icon: TrendingDown },
    Unknown: { bg: 'rgba(99,179,237,0.08)', border: 'rgba(99,179,237,0.15)', color: '#4facfe', icon: Minus },
  };
  const s = styles[label] || styles.Unknown;
  const Icon = s.icon;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
    }}>
      <Icon size={16} /> {label}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0c1220', border: '1px solid rgba(99,179,237,0.15)',
      borderRadius: '0.6rem', padding: '0.6rem 0.9rem', fontSize: '0.82rem',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ color: '#8899bb', marginBottom: '0.25rem' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmt(Math.round(p.value))}
        </div>
      ))}
    </div>
  );
};

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [explanation, setExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const result = state?.result;
  const inputs = state?.inputs;

  useEffect(() => {
    if (!result) return;
    fetchExplanation();
  }, []);

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#8899bb' }}>No results found.</p>
        <Link to="/analyze"><button className="btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '0.7rem' }}>Start Analysis</button></Link>
      </div>
    );
  }

  const { predicted_rent, actual_rent, fairness, city_range, distribution, model, model_r2 } = result;
  const label = fairness?.label || 'Unknown';
  const score = fairness?.score ?? 50;
  const diffPct = fairness?.percent_diff ?? 0;

  const fetchExplanation = async () => {
    setLoadingAI(true);
    setAiError('');
    try {
      const res = await explainRent({
        city: inputs.city,
        locality: inputs.locality,
        bhk: inputs.bhk,
        size: inputs.size,
        furnishing: inputs.furnishing,
        actual_rent: actual_rent,
        predicted_rent,
        fairness_label: label,
        percent_diff: diffPct,
      });
      setExplanation(res.explanation);
    } catch {
      setAiError('Could not load AI explanation. Check if the backend is running.');
    } finally {
      setLoadingAI(false);
    }
  };

  // Chart data
  const barData = [
    { name: 'Fair Rent', value: predicted_rent, fill: '#4facfe' },
    ...(actual_rent ? [{ name: 'Listed Rent', value: actual_rent, fill: label === 'Overpriced' ? '#f43f5e' : label === 'Underpriced' ? '#f59e0b' : '#10b981' }] : []),
    { name: 'City Low', value: city_range?.low, fill: '#10b981' },
    { name: 'City Median', value: city_range?.median, fill: '#8899bb' },
    { name: 'City High', value: city_range?.high, fill: '#f59e0b' },
  ];

  // Distribution curve
  const distData = (distribution || []).map(d => ({ rent: d.rent, density: d.density }));

  const accentColor = label === 'Overpriced' ? '#f43f5e' : label === 'Underpriced' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', paddingTop: '5rem' }}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* Back */}
        <button onClick={() => navigate('/analyze')} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'transparent', border: '1px solid rgba(99,179,237,0.12)',
          borderRadius: '0.6rem', padding: '0.5rem 0.9rem', color: '#8899bb',
          cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif',
          marginBottom: '1.75rem', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#4facfe'; e.currentTarget.style.borderColor = 'rgba(79,172,254,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#8899bb'; e.currentTarget.style.borderColor = 'rgba(99,179,237,0.12)'; }}
        >
          <ArrowLeft size={14} /> Back to Analyzer
        </button>

        {/* Property summary */}
        <div style={{
          padding: '0.6rem 1rem', borderRadius: '0.6rem', marginBottom: '1.75rem',
          background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(99,179,237,0.08)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
          color: '#8899bb', fontSize: '0.85rem',
        }}>
          <MapPin size={13} style={{ color: '#4facfe' }} />
          <span style={{ color: '#f0f4ff', fontWeight: 500 }}>{inputs?.bhk}BHK</span>
          {inputs?.locality && <><span>·</span><span>{inputs.locality},</span></>}
          <span>{inputs?.city}</span>
          <span>·</span>
          <span>{inputs?.size} sqft</span>
          <span>·</span>
          <span>{inputs?.furnishing}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4facfe' }}>
            Model: {model} · R² {model_r2}
          </span>
        </div>

        {/* Main result card */}
        <div className="glass anim-fadeup" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#8899bb', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Predicted Fair Rent
              </div>
              <div className="font-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#f0f4ff', lineHeight: 1, marginBottom: '1rem' }}>
                {fmt(predicted_rent)}
                <span style={{ fontSize: '1rem', color: '#8899bb', fontWeight: 400, marginLeft: '0.5rem', fontFamily: 'DM Sans, sans-serif' }}>/mo</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <FairnessBadge label={label} />
                {actual_rent && (
                  <div style={{ fontSize: '0.9rem', color: '#8899bb' }}>
                    Listed: <span style={{ color: '#f0f4ff', fontWeight: 600 }}>{fmt(actual_rent)}</span>
                    {' '}
                    <span style={{ color: accentColor, fontWeight: 700 }}>({pct(diffPct)})</span>
                  </div>
                )}
              </div>

              {fairness?.description && (
                <p style={{ marginTop: '1rem', color: '#8899bb', fontSize: '0.9rem', lineHeight: 1.65, maxWidth: 500 }}>
                  {fairness.description}
                </p>
              )}
            </div>
            <ScoreRing score={score} label={label} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'City Low', value: fmt(city_range?.low), color: '#10b981' },
            { label: 'City Median', value: fmt(city_range?.median), color: '#4facfe' },
            { label: 'City High', value: fmt(city_range?.high), color: '#f59e0b' },
          ].map(({ label: l, value, color }) => (
            <div key={l} className="glass-sm" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#8899bb', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{l}</div>
              <div className="font-display" style={{ fontSize: '1.35rem', fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>

          {/* Bar chart */}
          <div className="glass-sm" style={{ padding: '1.5rem' }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1.25rem' }}>
              Price Comparison
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#8899bb', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899bb', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution */}
          <div className="glass-sm" style={{ padding: '1.5rem' }}>
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1.25rem' }}>
              Rent Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={distData}>
                <defs>
                  <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4facfe" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4facfe" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.06)" />
                <XAxis dataKey="rent" tick={{ fill: '#8899bb', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis hide />
                <Tooltip formatter={(v) => [v.toFixed(3), 'Density']} labelFormatter={v => `₹${Number(v).toLocaleString('en-IN')}`} contentStyle={{ background: '#0c1220', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '0.5rem', fontFamily: 'DM Sans' }} />
                <ReferenceLine x={predicted_rent} stroke="#4facfe" strokeWidth={2} strokeDasharray="4 4" label={{ value: 'Fair', fill: '#4facfe', fontSize: 10 }} />
                {actual_rent && <ReferenceLine x={actual_rent} stroke={accentColor} strokeWidth={2} strokeDasharray="4 4" label={{ value: 'Listed', fill: accentColor, fontSize: 10 }} />}
                <Area type="monotone" dataKey="density" stroke="#4facfe" strokeWidth={2} fill="url(#distGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="glass anim-fadeup delay-300" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '0.6rem',
              background: 'rgba(79,172,254,0.1)', border: '1px solid rgba(79,172,254,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={18} color="#4facfe" />
            </div>
            <div>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', margin: 0 }}>AI Explanation</h3>
              <div style={{ fontSize: '0.75rem', color: '#8899bb' }}>Powered by SambaNova LLM</div>
            </div>
            <button onClick={fetchExplanation} disabled={loadingAI} style={{
              marginLeft: 'auto', background: 'transparent',
              border: '1px solid rgba(99,179,237,0.12)', borderRadius: '0.5rem',
              padding: '0.4rem 0.7rem', color: '#8899bb', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}>
              <RefreshCw size={12} style={{ animation: loadingAI ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>

          {loadingAI ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', color: '#8899bb', fontSize: '0.9rem' }}>
              <div style={{
                width: 20, height: 20, border: '2px solid rgba(79,172,254,0.2)',
                borderTop: '2px solid #4facfe', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Generating AI analysis...
            </div>
          ) : aiError ? (
            <p style={{ color: '#f43f5e', fontSize: '0.88rem', lineHeight: 1.6 }}>{aiError}</p>
          ) : explanation ? (
            <p style={{ color: '#c8d8f0', fontSize: '0.95rem', lineHeight: 1.75, margin: 0 }}>{explanation}</p>
          ) : (
            <p style={{ color: '#8899bb', fontSize: '0.9rem' }}>Loading explanation...</p>
          )}

          {/* Tips */}
          {label !== 'Unknown' && (
            <div style={{
              marginTop: '1.25rem', padding: '1rem',
              background: `${accentColor}0a`, border: `1px solid ${accentColor}22`,
              borderRadius: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: accentColor, fontWeight: 600, fontSize: '0.85rem' }}>
                <Sparkles size={13} />
                {label === 'Overpriced' ? 'Negotiation Tips' : label === 'Underpriced' ? 'Why This Is a Deal' : 'Fair Price Confirmed'}
              </div>
              <p style={{ color: '#c8d8f0', fontSize: '0.87rem', lineHeight: 1.65, margin: 0 }}>
                {label === 'Overpriced'
                  ? `This listing is ${Math.abs(diffPct)}% above fair market value. Counter-offer at ₹${Math.round(predicted_rent / 1000) * 1000 - 1000}–${Math.round(predicted_rent / 1000) * 1000}. Reference similar listings in the area. Check for extra maintenance charges that inflate the effective rent.`
                  : label === 'Underpriced'
                  ? `Listed ${Math.abs(diffPct)}% below fair value — this is a strong deal. Verify the property is not in poor condition and that all amenities are functional. Secure a longer lease to lock in this rate.`
                  : `This property is priced within 15% of the fair market rate. Still negotiate maintenance charges and parking separately. Request a 6–11 month lease instead of 12 to reduce lock-in risk.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Re-analyze CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/analyze">
            <button className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '0.75rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={16} /> Analyze Another Property
            </button>
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
