import React from 'react';
import { Layout } from './components/Layout';
import { EligibilityVerifier } from './components/EligibilityVerifier';
import { useMidnight } from './hooks/useMidnight';

/* ─────────────────────────────────────────────────────────────────────────────
   NightProof Landing Page
   Pure Vesper.ai design language — all content is NightProof / ZK / Midnight
   The app (Layout + EligibilityVerifier) renders below with zero changes
───────────────────────────────────────────────────────────────────────────── */

export function App() {
  const midnight = useMidnight();
  const [activeTab, setActiveTab] = React.useState<'citizen' | 'verifier' | 'vault'>('citizen');

  /* ── Menu toggle (mobile only) ─────────────────────────────────────── */
  const openMenu = () => {
    document.body.classList.add('menu-open');
    const b = document.getElementById('burger-btn');
    if (b) { b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-label', 'Close menu'); }
  };
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    const b = document.getElementById('burger-btn');
    if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Open menu'); }
  };
  const toggleMenu = () =>
    document.body.classList.contains('menu-open') ? closeMenu() : openMenu();

  const handlePortalClick = (tab: 'citizen' | 'verifier' | 'vault') => {
    setActiveTab(tab);
    closeMenu();
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          LANDING PAGE — Vesper dark design, single viewport
      ════════════════════════════════════════════════════════════════════ */}
      <div id="top" style={{ position: 'relative', background: '#000' }}>

        {/* Grain overlay */}
        <div className="grain" />

        {/* Radial hero background glow */}
        <div className="hero-photo" />

        {/* Page grid: header / hero / stats */}
        <div className="page">

          {/* Mobile menu backdrop */}
          <div className="menu-backdrop" onClick={closeMenu} />

          {/* ── Header ──────────────────────────────────────────────── */}
          <header className="header">

            {/* Left — Logo */}
            <a
              href="#top"
              className="logo appear appear--scale"
              style={{ '--d': '0.08s' } as React.CSSProperties}
              aria-label="NightProof"
            >
              {/* NightProof dual-pill mark */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <g transform="rotate(-30 12 12)">
                  <circle cx="7.3" cy="3.2" r="1.45" />
                  <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                  <circle cx="16.7" cy="20.8" r="1.45" />
                </g>
              </svg>
              <span>NightProof<span className="logo-suffix">.zk</span></span>
            </a>

            {/* Center — Nav Pill Tab Capsule (exact screenshot design) */}
            <nav id="site-nav" aria-label="Primary">
              <div
                className="portal-nav-capsule appear appear--scale"
                style={{ '--d': '0.22s' } as React.CSSProperties}
              >
                {/* Button 1: Citizen Portal */}
                <button
                  type="button"
                  onClick={() => handlePortalClick('citizen')}
                  className={`portal-nav-btn ${activeTab === 'citizen' ? 'active' : ''}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Citizen Portal</span>
                </button>

                {/* Button 2: Institutional Verifier */}
                <button
                  type="button"
                  onClick={() => handlePortalClick('verifier')}
                  className={`portal-nav-btn ${activeTab === 'verifier' ? 'active' : ''}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Institutional Verifier</span>
                </button>

                {/* Button 3: Credential Vault */}
                <button
                  type="button"
                  onClick={() => handlePortalClick('vault')}
                  className={`portal-nav-btn ${activeTab === 'vault' ? 'active' : ''}`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                  <span>Credential Vault</span>
                </button>
              </div>
            </nav>

            {/* Right — CTA + Burger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifySelf: 'end' }}>
              <button
                type="button"
                onClick={() => handlePortalClick('citizen')}
                className="btn btn-solid header-cta appear appear--scale"
                style={{ '--d': '0.34s' } as React.CSSProperties}
              >
                Launch App
              </button>
              <button
                id="burger-btn"
                onClick={toggleMenu}
                className="burger appear appear--scale"
                style={{ '--d': '0.34s' } as React.CSSProperties}
                aria-controls="site-nav"
                aria-expanded="false"
                aria-label="Open menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </header>

          {/* ── Hero ────────────────────────────────────────────────── */}
          <main className="hero">
            <div className="hero-copy">

              {/* Badge */}
              <div
                className="badge appear appear--pop"
                style={{ '--d': '0.22s' } as React.CSSProperties}
              >
                {/* Sparkle star */}
                <svg
                  className="badge-star"
                  width="18" height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
                </svg>
                Zero-Knowledge Public Services Infrastructure
              </div>

              {/* H1 — two masked headline lines */}
              <h1>
                <span
                  className="headline-line appear appear--mask"
                  style={{ '--d': '0.42s' } as React.CSSProperties}
                >
                  Prove eligibility. Protect
                </span>
                <span
                  className="headline-line appear appear--mask"
                  style={{ '--d': '0.62s' } as React.CSSProperties}
                >
                  your data with <em>ZK proofs.</em>
                </span>
              </h1>

              {/* Lede */}
              <p
                className="lede appear appear--soft"
                style={
                  {
                    '--d': '0.82s',
                    animationDuration: '1.25s',
                  } as React.CSSProperties
                }
              >
                NightProof lets citizens prove income, age, and academic eligibility for scholarships, subsidies, and welfare programs on Midnight Network — without ever disclosing a single personal document.
              </p>

              {/* CTAs */}
              <div className="hero-actions">
                <button
                  type="button"
                  onClick={() => handlePortalClick('citizen')}
                  className="btn btn-solid btn-hero-solid appear appear--btn"
                  style={{ '--d': '0.96s' } as React.CSSProperties}
                >
                  Generate ZK Proof
                </button>
                <button
                  type="button"
                  onClick={() => handlePortalClick('verifier')}
                  className="btn btn-ghost btn-hero-ghost appear appear--side"
                  style={{ '--d': '1.10s' } as React.CSSProperties}
                >
                  Explore Institutional Portal
                </button>
              </div>
            </div>
          </main>

          {/* ── Stats Footer ─────────────────────────────────────────── */}
          <footer className="stats">

            {/* Stat 1 — Dual-pill icon */}
            <div
              className="stat appear appear--stat"
              style={{ '--d': '1.12s' } as React.CSSProperties}
            >
              <svg className="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="gL" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#3a3a3a" stopOpacity="0.62" />
                  </linearGradient>
                  <linearGradient id="gR" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"   stopColor="#3a3a3a" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0.62" />
                  </linearGradient>
                </defs>
                <rect x="3.4"  y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#gL)" />
                <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#gR)" />
                <rect x="9.2"  y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
              </svg>
              <span>142+ ZK proofs verified on-chain</span>
            </div>

            {/* Stat 2 — Zero docs exposed */}
            <div
              className="stat appear appear--stat"
              style={{ '--d': '1.28s', cursor: 'pointer' } as React.CSSProperties}
              onClick={() => handlePortalClick('citizen')}
            >
              <svg className="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
                <path d="M12 7.1v7.4M8.15 12.35L12 16.2l3.85-3.85"
                  stroke="#111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>Zero personal documents ever exposed</span>
            </div>

            {/* Stat 3 — Three avatars */}
            <div
              className="stat appear appear--stat"
              style={{ '--d': '1.44s' } as React.CSSProperties}
            >
              <svg className="stat-icon-wide" viewBox="0 0 40 22" aria-hidden="true">
                {/* Avatar 1 — dark */}
                <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
                <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
                <polygon points="8.2,5.5 10.2,7.5 12.2,5.5" fill="#2b2b2b" />
                <circle cx="9.2"  cy="11" r="0.7" fill="#1a1a1a" />
                <circle cx="11.2" cy="11" r="0.7" fill="#1a1a1a" />
                {/* Avatar 2 — white */}
                <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
                <circle cx="18"   cy="10" r="1.7" fill="#111" />
                <circle cx="22.4" cy="10" r="1.7" fill="#111" />
                <ellipse cx="20.2" cy="12.5" rx="1.5" ry="1" fill="#111" />
                <path d="M18 14.5 Q20.2 16.5 22.4 14.5" stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                {/* Avatar 3 — Midnight orange */}
                <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
                <text x="30.2" y="15.1" fill="#fff" fontSize="12.5" fontWeight="700" textAnchor="middle" fontFamily="Inter,sans-serif">e</text>
              </svg>
              <span>3 government scheme categories</span>
            </div>
          </footer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FULL APPLICATION — original Layout + EligibilityVerifier (unchanged)
      ════════════════════════════════════════════════════════════════════ */}
      <div id="app">
        <Layout
          wallet={midnight.wallet}
          metrics={midnight.metrics}
          onConnectWallet={midnight.connectWallet}
          onDisconnectWallet={midnight.disconnectWallet}
        >
          {/* Hero tagline */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 shadow-md">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
              </svg>
              <span>Zero-Knowledge Public Services Verification on Midnight Network</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Prove Eligibility.{' '}
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Protect Your Data.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Authorize with your Midnight Lace Wallet, then prove income, age, and academic qualifications
              for scholarships and welfare programs via real ZK proofs — without disclosing any sensitive documents.
            </p>
          </div>

          <EligibilityVerifier
            midnight={midnight}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Layout>
      </div>
    </>
  );
}

export default App;
