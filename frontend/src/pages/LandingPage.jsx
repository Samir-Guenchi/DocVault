import { Link } from 'react-router-dom';
import { Shield, Users, Cloud, BarChart3, Search, Download, ArrowRight, Menu, X, Zap, Lock, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: Shield, title: 'Enterprise Security', desc: 'AES-256 encryption, RBAC, and full audit trails for regulatory compliance.', accent: '#06b6d4' },
  { icon: Search, title: 'Intelligent Search', desc: 'Find any document in milliseconds across categories, departments, and metadata.', accent: '#8b5cf6' },
  { icon: Users, title: 'Team Collaboration', desc: 'Real-time comments, version history, and multi-user workflows.', accent: '#10b981' },
  { icon: Cloud, title: 'K8s Infrastructure', desc: 'Kubernetes-native with auto-scaling, 99.9% uptime, and zero-downtime deploys.', accent: '#f59e0b' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time metrics on document usage, user activity, and storage.', accent: '#ec4899' },
  { icon: Download, title: 'Export Engine', desc: 'One-click export to CSV and Excel with full metadata preservation.', accent: '#6366f1' },
];

const STATS = [
  { value: '10K+', label: 'Documents Managed' },
  { value: '500+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Operations' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="lp">
      {/* ── Navigation ── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          <Link to="/" className="lp-brand">
            <img src="/logo_dms.png" alt="DMS ERP" className="lp-brand__logo" />
          </Link>
          <nav className="lp-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/login">Sign in</Link>
            <Link to="/login" className="lp-cta-sm">Get Started <ArrowRight size={14} /></Link>
          </nav>
          <button className="lp-burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="lp-mobile">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/login" className="lp-cta-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero__mesh" />
        <div className="lp-hero__inner">
          <div className="lp-hero__content">
            <div className="lp-hero__badge">
              <span className="lp-dot" />
              Enterprise ERP · Operational 24/7
            </div>
            <h1>
              Document<br />Management<br />
              <span className="lp-grad">System.</span>
            </h1>
            <p>
              Enterprise Resource Planning with bank-grade document management.
              Organize, search, collaborate, and export — built for organizations
              that demand reliability at scale.
            </p>
            <div className="lp-hero__actions">
              <Link to="/login" className="lp-btn-primary">
                <Zap size={18} /> Start Free Trial <ArrowRight size={16} />
              </Link>
              <a href="#features" className="lp-btn-glass">Explore Platform</a>
            </div>
          </div>
          <div className="lp-hero__visual">
            <div className="lp-hero__glow" />
            <div className="lp-hero__logo-card">
              <img src="/logo_dms.png" alt="DMS ERP System" />
            </div>
            <div className="lp-float lp-float--1"><Lock size={20} /><span>Encrypted</span></div>
            <div className="lp-float lp-float--2"><Globe size={20} /><span>Multi-lang</span></div>
            <div className="lp-float lp-float--3"><Zap size={20} /><span>Real-time</span></div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="lp-stats">
          {STATS.map((s,i) => (
            <div key={i} className="lp-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section id="features" className="lp-features">
        <div className="lp-section">
          <div className="lp-section__head">
            <span className="lp-tag">Platform Capabilities</span>
            <h2>Everything your organization needs</h2>
            <p>Enterprise-grade tools designed for modern document workflows and team collaboration.</p>
          </div>
          <div className="lp-bento">
            {FEATURES.map((f,i) => (
              <div key={i} className={`lp-bento__card ${i === 0 ? 'lp-bento--wide' : ''}`}>
                <div className="lp-bento__icon" style={{ background: `${f.accent}18`, color: f.accent }}>
                  <f.icon size={22} strokeWidth={1.8} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="lp-about">
        <div className="lp-about__inner">
          <div className="lp-about__visual">
            <div className="lp-about__card">
              <img src="/logo_dms.png" alt="DMS ERP" />
            </div>
          </div>
          <div className="lp-about__content">
            <span className="lp-tag">About the Platform</span>
            <h2>Built for enterprise operations</h2>
            <p>A full-stack ERP document management solution designed for organizations that demand reliability, security, and compliance — from 5 users to 5,000+.</p>
            <ul className="lp-checks">
              {['Role-based access control (RBAC)', 'Multi-language: English, French, Arabic', 'Kubernetes-native deployment', 'Real-time collaboration & versioning', 'Compliance-ready audit trails', 'CSV & Excel export engine'].map((t,i) => (
                <li key={i}><Shield size={16} /><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta__inner">
          <img src="/logo_dms.png" alt="DMS" className="lp-cta__logo" />
          <h2>Ready to transform your document workflow?</h2>
          <p>Join hundreds of organizations using our ERP document management platform.</p>
          <Link to="/login" className="lp-btn-primary">Get Started Free <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <img src="/logo_dms.png" alt="DMS" />
            <p>Enterprise ERP Document Management System for the modern workplace.</p>
          </div>
          <div className="lp-footer__links">
            <div><h4>Product</h4><a href="#features">Features</a><Link to="/login">Demo</Link></div>
            <div><h4>Company</h4><a href="#about">About</a><a href="#">Contact</a></div>
            <div><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a></div>
          </div>
        </div>
        <div className="lp-footer__copy">© 2026 DMS — Enterprise Resource Planning · Document Management System</div>
      </footer>

      <style>{`
.lp{--navy:#0c1929;--navy2:#132338;--cyan:#06b6d4;--cyan2:#0891b2;font-family:'Inter',system-ui,sans-serif;background:#fff;color:#0f172a}

/* NAV */
.lp-nav{position:sticky;top:0;z-index:100;transition:all .3s ease}
.lp-nav--scrolled{background:rgba(12,25,41,.92);backdrop-filter:blur(20px) saturate(1.4);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.lp-nav__inner{max-width:1280px;margin:0 auto;padding:0 32px;height:68px;display:flex;align-items:center;justify-content:space-between}
.lp-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.lp-brand__logo{height:42px;width:auto;filter:drop-shadow(0 2px 8px rgba(6,182,212,.3))}
.lp-links{display:flex;align-items:center;gap:4px}
.lp-links a{padding:8px 16px;font-size:14px;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none;border-radius:8px;transition:all .15s}
.lp-links a:hover{color:#fff;background:rgba(255,255,255,.08)}
.lp-cta-sm{background:var(--cyan)!important;color:#fff!important;padding:9px 20px!important;border-radius:10px!important;font-weight:600!important;display:inline-flex!important;align-items:center;gap:6px;box-shadow:0 0 20px rgba(6,182,212,.3);transition:all .2s!important}
.lp-cta-sm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(6,182,212,.45)!important}
.lp-burger{display:none;background:none;border:none;color:#fff;cursor:pointer;padding:6px}
.lp-mobile{display:none;flex-direction:column;padding:16px 32px 24px;background:rgba(12,25,41,.96);border-top:1px solid rgba(255,255,255,.06)}
.lp-mobile a{display:block;padding:12px 16px;color:rgba(255,255,255,.8);font-size:15px;font-weight:500;text-decoration:none;border-radius:8px}

/* HERO */
.lp-hero{position:relative;background:var(--navy);overflow:hidden;padding:0 32px 0}
.lp-hero__mesh{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 70% 20%,rgba(6,182,212,.12) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 20% 80%,rgba(99,102,241,.08) 0%,transparent 50%),radial-gradient(ellipse 40% 40% at 50% 50%,rgba(139,92,246,.06) 0%,transparent 50%)}
.lp-hero__inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding:80px 0 60px;position:relative;z-index:1}
.lp-hero__badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:100px;font-size:12px;font-weight:600;color:rgba(255,255,255,.7);margin-bottom:28px;backdrop-filter:blur(8px)}
.lp-dot{width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.lp-hero__content h1{font-size:clamp(36px,5vw,64px);font-weight:800;line-height:1.05;color:#fff;margin-bottom:24px;letter-spacing:-.04em}
.lp-grad{background:linear-gradient(135deg,#06b6d4,#8b5cf6,#06b6d4);background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradShift 4s ease infinite}
@keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.lp-hero__content p{font-size:17px;line-height:1.7;color:rgba(255,255,255,.55);margin-bottom:36px;max-width:480px}
.lp-hero__actions{display:flex;gap:14px;flex-wrap:wrap}
.lp-btn-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,var(--cyan),var(--cyan2));color:#fff;font-size:15px;font-weight:600;border-radius:12px;text-decoration:none;box-shadow:0 0 24px rgba(6,182,212,.3),inset 0 1px 0 rgba(255,255,255,.15);transition:all .25s}
.lp-btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(6,182,212,.45);color:#fff}
.lp-btn-glass{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.85);font-size:15px;font-weight:600;border-radius:12px;text-decoration:none;border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(8px);transition:all .25s}
.lp-btn-glass:hover{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.2)}

/* Hero Visual */
.lp-hero__visual{position:relative;display:flex;align-items:center;justify-content:center;min-height:420px}
.lp-hero__glow{position:absolute;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,.2) 0%,transparent 70%);filter:blur(40px);animation:glowPulse 4s ease-in-out infinite}
@keyframes glowPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
.lp-hero__logo-card{position:relative;width:280px;height:280px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:32px;display:flex;align-items:center;justify-content:center;padding:40px;backdrop-filter:blur(16px);box-shadow:0 24px 64px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.08);animation:floatY 6s ease-in-out infinite}
.lp-hero__logo-card img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 20px rgba(6,182,212,.3))}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.lp-float{position:absolute;display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;font-size:12px;font-weight:600;color:rgba(255,255,255,.8);backdrop-filter:blur(12px);white-space:nowrap}
.lp-float--1{top:8%;right:0;color:#06b6d4;animation:floatY 5s ease-in-out infinite .5s}
.lp-float--2{bottom:20%;left:0;color:#8b5cf6;animation:floatY 5s ease-in-out infinite 1s}
.lp-float--3{bottom:5%;right:10%;color:#10b981;animation:floatY 5s ease-in-out infinite 1.5s}

/* Stats */
.lp-stats{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.06);border-radius:16px;overflow:hidden;position:relative;z-index:1;margin-bottom:-40px;transform:translateY(-40px)}
.lp-stat{padding:28px 24px;background:rgba(12,25,41,.8);backdrop-filter:blur(12px);text-align:center}
.lp-stat strong{display:block;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.02em;margin-bottom:4px}
.lp-stat span{font-size:13px;color:rgba(255,255,255,.5);font-weight:500}

/* FEATURES BENTO */
.lp-features{padding:120px 32px 80px;background:#f8fafc}
.lp-section{max-width:1200px;margin:0 auto}
.lp-section__head{text-align:center;max-width:600px;margin:0 auto 56px}
.lp-tag{display:inline-block;padding:5px 14px;background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.15);border-radius:100px;font-size:11px;font-weight:700;color:#0891b2;letter-spacing:.8px;text-transform:uppercase;margin-bottom:16px}
.lp-section__head h2{font-size:clamp(28px,3.5vw,40px);font-weight:700;color:#0c1929;margin-bottom:14px;letter-spacing:-.02em}
.lp-section__head p{font-size:16px;color:#64748b;line-height:1.7}
.lp-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-bento--wide{grid-column:span 2}
.lp-bento__card{padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;transition:all .3s ease;position:relative;overflow:hidden}
.lp-bento__card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--cyan),#8b5cf6);opacity:0;transition:opacity .3s}
.lp-bento__card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.06);border-color:#cbd5e1}
.lp-bento__card:hover::after{opacity:1}
.lp-bento__icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px}
.lp-bento__card h3{font-size:17px;font-weight:600;color:#0c1929;margin-bottom:10px}
.lp-bento__card p{font-size:14px;color:#64748b;line-height:1.7}

/* ABOUT */
.lp-about{padding:100px 32px;background:#fff}
.lp-about__inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1.2fr;gap:64px;align-items:center}
.lp-about__card{background:linear-gradient(135deg,#0c1929,#132338);border-radius:24px;padding:64px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(6,182,212,.15)}
.lp-about__card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 70%,rgba(6,182,212,.15),transparent 60%)}
.lp-about__card img{width:220px;height:220px;position:relative;filter:drop-shadow(0 8px 24px rgba(6,182,212,.3));animation:floatY 6s ease-in-out infinite}
.lp-about__content h2{font-size:clamp(26px,3vw,36px);font-weight:700;color:#0c1929;margin-bottom:18px;letter-spacing:-.02em}
.lp-about__content p{font-size:16px;color:#64748b;line-height:1.75;margin-bottom:20px}
.lp-checks{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}
.lp-checks li{display:flex;align-items:center;gap:10px;font-size:14px;color:#334155;font-weight:500}
.lp-checks li svg{color:var(--cyan);flex-shrink:0}

/* CTA */
.lp-cta{padding:80px 32px;background:linear-gradient(135deg,#0c1929,#132338);position:relative;overflow:hidden}
.lp-cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(6,182,212,.1),transparent)}
.lp-cta__inner{max-width:700px;margin:0 auto;text-align:center;position:relative;z-index:1}
.lp-cta__logo{width:80px;height:80px;margin:0 auto 24px;filter:drop-shadow(0 4px 16px rgba(6,182,212,.3))}
.lp-cta h2{font-size:clamp(24px,3vw,36px);font-weight:700;color:#fff;margin-bottom:14px}
.lp-cta p{font-size:17px;color:rgba(255,255,255,.55);margin-bottom:28px}

/* FOOTER */
.lp-footer{background:#080e19;padding:56px 32px 24px}
.lp-footer__inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;gap:40px;margin-bottom:40px;flex-wrap:wrap}
.lp-footer__brand{max-width:280px}
.lp-footer__brand img{height:48px;margin-bottom:12px;filter:drop-shadow(0 2px 8px rgba(6,182,212,.2))}
.lp-footer__brand p{font-size:13px;color:#64748b;line-height:1.6}
.lp-footer__links{display:flex;gap:56px}
.lp-footer__links h4{font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px}
.lp-footer__links a{display:block;font-size:13px;color:#64748b;text-decoration:none;margin-bottom:10px;transition:color .15s}
.lp-footer__links a:hover{color:#fff}
.lp-footer__copy{max-width:1200px;margin:0 auto;padding-top:24px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-size:12px;color:#475569}

/* RESPONSIVE */
@media(max-width:1024px){
  .lp-hero__inner,.lp-about__inner{grid-template-columns:1fr}
  .lp-hero__visual{max-width:360px;margin:0 auto;min-height:340px}
  .lp-about__card{max-width:360px;margin:0 auto}
  .lp-bento{grid-template-columns:1fr 1fr}
  .lp-bento--wide{grid-column:span 2}
}
@media(max-width:768px){
  .lp-links{display:none!important}
  .lp-burger{display:block!important}
  .lp-mobile{display:flex}
  .lp-hero__inner{padding:48px 0 40px}
  .lp-stats{grid-template-columns:repeat(2,1fr)}
  .lp-bento{grid-template-columns:1fr}
  .lp-bento--wide{grid-column:span 1}
  .lp-checks{grid-template-columns:1fr}
  .lp-footer__inner{flex-direction:column}
  .lp-footer__links{gap:32px}
}
@media(max-width:480px){
  .lp-stats{grid-template-columns:1fr 1fr}
  .lp-stat{padding:20px 16px}
  .lp-stat strong{font-size:22px}
}
      `}</style>
    </div>
  );
}
