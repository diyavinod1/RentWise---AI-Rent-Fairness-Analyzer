import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Info } from 'lucide-react';

export default function Navbar() {
  const loc = useLocation();
  const active = (path) => loc.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(5,8,16,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99,179,237,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: '#050810',
            fontFamily: 'Syne, sans-serif',
          }}>R</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0f4ff' }}>
            Rent<span style={{ color: '#4facfe' }}>Wise</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {[
            { to: '/', icon: Home, label: 'Home' },
            { to: '/analyze', icon: BarChart2, label: 'Analyze' },
            { to: '/about', icon: Info, label: 'About' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.9rem', borderRadius: '0.6rem',
              textDecoration: 'none', fontSize: '0.88rem',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              transition: 'all 0.2s',
              background: active(to) ? 'rgba(79,172,254,0.1)' : 'transparent',
              border: active(to) ? '1px solid rgba(79,172,254,0.2)' : '1px solid transparent',
              color: active(to) ? '#4facfe' : '#8899bb',
            }}>
              <Icon size={14} />
              {label}
            </Link>
          ))}

          <Link to="/analyze" style={{
            marginLeft: '0.5rem',
            padding: '0.45rem 1.1rem', borderRadius: '0.6rem',
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            color: '#050810', fontWeight: 700, fontSize: '0.85rem',
            fontFamily: 'Syne, sans-serif', textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            Check Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
