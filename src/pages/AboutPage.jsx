import { Link } from 'react-router-dom';
import { ArrowRight, Database, Cpu, BarChart2, Brain, GitBranch, Shield } from 'lucide-react';

const steps = [
  { icon: Database, title: '1. Data Collection', desc: 'Trained on 8,000+ real Indian rental listings across 10 major cities including Mumbai, Delhi, Bangalore, Hyderabad, and more.' },
  { icon: Cpu, title: '2. ML Pipeline', desc: 'Features like BHK, size, furnishing, parking, and floor are processed through Linear Regression, Random Forest, Gradient Boosting, and XGBoost — best model wins.' },
  { icon: BarChart2, title: '3. Fair Price Prediction', desc: 'The winning model (XGBoost, R²=0.93) predicts what a property should rent for, based purely on its attributes.' },
  { icon: Brain, title: '4. AI Explanation', desc: 'SambaNova\'s LLM generates a human-readable explanation of why the rent is fair, overpriced, or underpriced, with negotiation advice.' },
  { icon: GitBranch, title: '5. Fairness Score', desc: 'A 0–100 score shows how close the actual rent is to predicted fair value. Below 50 = overpriced. Above 75 = great deal.' },
  { icon: Shield, title: '6. Your Decision', desc: 'Armed with data, you negotiate smarter. Every feature is built to save you money and time.' },
];

const models = [
  { name: 'Linear Regression', r2: '0.20', mae: '₹9,495', badge: 'Baseline' },
  { name: 'Random Forest', r2: '0.92', mae: '₹2,892', badge: 'Strong' },
  { name: 'Gradient Boosting', r2: '0.93', mae: '₹2,861', badge: 'Strong' },
  { name: 'XGBoost', r2: '0.93', mae: '₹2,858', badge: 'Best ✓', best: true },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', paddingTop: '5rem' }}>
      <div className="mesh-bg" />
      <div className="grid-overlay" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>

        <div className="anim-fadeup" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 0.9rem', borderRadius: 999, marginBottom: '1rem',
            background: 'rgba(79,172,254,0.08)', border: '1px solid rgba(79,172,254,0.2)',
            fontSize: '0.78rem', color: '#4facfe', fontFamily: 'Syne, sans-serif', fontWeight: 600,
          }}>
            How It Works
          </div>
          <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f0f4ff', marginBottom: '0.75rem' }}>
            The science behind <span className="gradient-text">RentWise</span>
          </h1>
          <p style={{ color: '#8899bb', fontSize: '1rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Combining machine learning and large language models to give you data-driven rent intelligence in seconds.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass-sm anim-fadeup" style={{ padding: '1.5rem', animationDelay: `${i * 0.07}s`, opacity: 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, marginBottom: '0.9rem',
                background: 'rgba(79,172,254,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(79,172,254,0.15)',
              }}>
                <Icon size={18} color="#4facfe" />
              </div>
              <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#8899bb', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Model comparison table */}
        <div className="glass anim-fadeup delay-300" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1.25rem' }}>
            Model Performance Comparison
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr>
                  {['Model', 'R² Score', 'MAE', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#8899bb', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(99,179,237,0.08)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {models.map(({ name, r2, mae, badge, best }) => (
                  <tr key={name} style={{ background: best ? 'rgba(79,172,254,0.05)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem', color: best ? '#f0f4ff' : '#8899bb', fontWeight: best ? 600 : 400, borderBottom: '1px solid rgba(99,179,237,0.05)', fontFamily: 'DM Sans, sans-serif' }}>{name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: best ? '#4facfe' : '#8899bb', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(99,179,237,0.05)' }}>{r2}</td>
                    <td style={{ padding: '0.75rem 1rem', color: best ? '#4facfe' : '#8899bb', fontFamily: 'DM Sans, sans-serif', borderBottom: '1px solid rgba(99,179,237,0.05)' }}>{mae}</td>
                    <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(99,179,237,0.05)' }}>
                      <span style={{
                        padding: '0.25rem 0.65rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600,
                        background: best ? 'rgba(79,172,254,0.12)' : 'rgba(99,179,237,0.06)',
                        border: best ? '1px solid rgba(79,172,254,0.25)' : '1px solid rgba(99,179,237,0.1)',
                        color: best ? '#4facfe' : '#8899bb',
                      }}>{badge}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tech stack */}
        <div className="glass-sm anim-fadeup delay-400" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1rem' }}>Tech Stack</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {['FastAPI', 'XGBoost', 'scikit-learn', 'pandas', 'React', 'Vite', 'Tailwind CSS', 'Recharts', 'Leaflet', 'SambaNova LLM', 'Python 3.11'].map(t => (
              <span key={t} style={{
                padding: '0.3rem 0.75rem', borderRadius: '0.4rem', fontSize: '0.8rem',
                background: 'rgba(79,172,254,0.07)', border: '1px solid rgba(79,172,254,0.15)',
                color: '#4facfe', fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/analyze">
            <button className="btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '0.75rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Try It Now <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
