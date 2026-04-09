import { Link } from 'react-router-dom';
import { ArrowRight, TrendingDown, Shield, Zap, BarChart2, MapPin, Brain } from 'lucide-react';

const stats = [
  { value: '10+', label: 'Indian Cities' },
  { value: '93%', label: 'Model Accuracy' },
  { value: '8K+', label: 'Data Points' },
  { value: 'Free', label: 'Forever' },
];

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'XGBoost ML model trained on real Indian rent data with 93% accuracy.' },
  { icon: MapPin, title: 'Location-Aware', desc: 'Interactive map + 10+ major Indian cities including Mumbai, Delhi, Bangalore.' },
  { icon: BarChart2, title: 'Visual Reports', desc: 'Price distribution charts, fairness scores, and comparison graphs.' },
  { icon: Shield, title: 'Negotiation Tips', desc: 'LLM-powered suggestions to help you negotiate rent effectively.' },
  { icon: TrendingDown, title: 'Fair Price Detection', desc: 'Instantly know if a listing is Overpriced, Fair, or Underpriced.' },
  { icon: Zap, title: 'Instant Results', desc: 'Get your rent fairness report in seconds, no sign-up needed.' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '7rem', paddingBottom: '5rem', textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>

        {/* Badge */}
        <div className="anim-fadeup" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 999, marginBottom: '2rem',
          background: 'rgba(79,172,254,0.08)', border: '1px solid rgba(79,172,254,0.2)',
          fontSize: '0.8rem', color: '#4facfe', fontFamily: 'Syne, sans-serif', fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4facfe', display: 'inline-block', animation: 'float 2s ease-in-out infinite' }} />
          AI-Powered Rent Intelligence for India
        </div>

        {/* Headline */}
        <h1 className="anim-fadeup delay-100 font-display" style={{
          fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', fontWeight: 800,
          lineHeight: 1.08, marginBottom: '0.4rem', letterSpacing: '-0.02em',
          color: '#f0f4ff',
        }}>
          Stop Overpaying
        </h1>
        <h1 className="anim-fadeup delay-200 font-display gradient-text" style={{
          fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', fontWeight: 800,
          lineHeight: 1.08, marginBottom: '1.5rem', letterSpacing: '-0.02em',
        }}>
          Rent.
        </h1>

        <p className="anim-fadeup delay-300" style={{
          fontSize: '1.15rem', color: '#8899bb', lineHeight: 1.7,
          maxWidth: 560, margin: '0 auto 2.5rem', fontWeight: 400,
        }}>
          Know exactly what you should pay. Our ML model analyzes{' '}
          <span style={{ color: '#f0f4ff' }}>location, size, furnishing</span> and more
          to predict the fair rent for any property in India.
        </p>

        {/* CTA */}
        <div className="anim-fadeup delay-400" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/analyze">
            <button className="btn-primary" style={{
              padding: '0.9rem 2rem', borderRadius: '0.8rem',
              fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              Check Rent Fairness <ArrowRight size={18} />
            </button>
          </Link>
          <Link to="/about">
            <button style={{
              padding: '0.9rem 1.8rem', borderRadius: '0.8rem', fontSize: '1rem',
              background: 'transparent', border: '1px solid rgba(99,179,237,0.2)',
              color: '#8899bb', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.target.style.color = '#4facfe'; e.target.style.borderColor = 'rgba(79,172,254,0.4)'; }}
            onMouseLeave={e => { e.target.style.color = '#8899bb'; e.target.style.borderColor = 'rgba(99,179,237,0.2)'; }}
            >
              How it works
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="anim-fadeup delay-500" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
          marginTop: '4rem', padding: '1.5rem',
          background: 'rgba(12,18,32,0.5)', border: '1px solid rgba(99,179,237,0.08)',
          borderRadius: '1rem', backdropFilter: 'blur(10px)',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: '#4facfe', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: '0.3rem', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color: '#f0f4ff' }}>
            Everything you need to rent <span className="gradient-text">smart</span>
          </h2>
          <p style={{ color: '#8899bb', marginTop: '0.75rem' }}>Data-driven tools to protect your wallet</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass-sm anim-fadeup" style={{
              padding: '1.5rem', animationDelay: `${i * 0.08}s`, opacity: 0,
              transition: 'transform 0.25s, border-color 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(79,172,254,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,179,237,0.08)'; }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, marginBottom: '1rem',
                background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(79,172,254,0.15)',
              }}>
                <Icon size={20} color="#4facfe" />
              </div>
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.87rem', color: '#8899bb', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', marginTop: '4rem', padding: '3rem 2rem',
          background: 'linear-gradient(135deg, rgba(79,172,254,0.06), rgba(0,242,254,0.03))',
          border: '1px solid rgba(79,172,254,0.12)', borderRadius: '1.25rem',
        }}>
          <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.75rem' }}>
            Ready to find your fair rent?
          </h3>
          <p style={{ color: '#8899bb', marginBottom: '2rem', fontSize: '1rem' }}>
            Takes less than 60 seconds. No registration required.
          </p>
          <Link to="/analyze">
            <button className="btn-primary" style={{
              padding: '0.9rem 2.5rem', borderRadius: '0.8rem', fontSize: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            }}>
              Start Analysis <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
