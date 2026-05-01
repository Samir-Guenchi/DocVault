import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, LogIn, Globe, AlertCircle, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

export default function LoginPageBeginner() {
  const navigate = useNavigate();
  const { login, apiError } = useAppContext();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async (e, demoEmail, demoPw) => {
    if (e) e.preventDefault();
    const em = demoEmail || email;
    const pw = demoPw || password;
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));

    if (!em.trim() || !pw.trim()) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const result = await login({ email: em, password: pw });
    if (!result.ok) { setError(result.message); setLoading(false); return; }
    navigate(result.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
  };

  const quickLogin = (em, pw) => {
    setEmail(em);
    setPassword(pw);
    doLogin(null, em, pw);
  };

  const curLang = LANGS.find(l => l.code === (i18n.language || 'en'))?.label || 'English';

  return (
    <div className="lp-login">
      {/* Mesh Background */}
      <div className="lp-login__bg" />

      {/* Header */}
      <header className="lp-login__header">
        <Link to="/" className="lp-login__brand">
          <img src="/logo_dms.png" alt="DMS ERP" />
        </Link>
        <div style={{ position: 'relative' }}>
          <button className="lp-login__lang-btn" onClick={() => setLangOpen(!langOpen)}>
            <Globe size={15} /> {curLang}
          </button>
          {langOpen && (
            <div className="lp-login__lang-dd">
              {LANGS.map(l => (
                <button key={l.code} className={`lp-login__lang-item ${(i18n.language || 'en') === l.code ? 'active' : ''}`}
                  onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="lp-login__main">
        <div className="lp-login__card">
          {/* Logo */}
          <div className="lp-login__logo-wrap">
            <img src="/logo_dms.png" alt="DMS ERP" />
          </div>

          <h1>{t('login.title') || 'Welcome back'}</h1>
          <p className="lp-login__sub">Sign in to your ERP Document Management workspace</p>

          {apiError && (
            <div className="lp-login__alert lp-login__alert--warn">
              <AlertCircle size={16} />
              <div><strong>Connection Issue</strong><br/>{apiError}</div>
            </div>
          )}

          {error && (
            <div className="lp-login__alert lp-login__alert--err">
              <AlertCircle size={16} />
              <div><strong>Login Failed</strong><br/>{error}</div>
            </div>
          )}

          <form onSubmit={doLogin}>
            <div className="lp-login__field">
              <label><Mail size={14} /> {t('login.email') || 'Email'}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" autoComplete="email" required />
            </div>
            <div className="lp-login__field">
              <label><Lock size={14} /> {t('login.password') || 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  autoComplete="current-password" required style={{ paddingRight: 42 }} />
                <button type="button" className="lp-login__eye" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="lp-login__submit" disabled={loading}>
              {loading ? (
                <><span className="lp-login__spinner" /> Signing in…</>
              ) : (
                <><LogIn size={17} /> {t('login.signIn') || 'Sign In'}</>
              )}
            </button>
          </form>

          <div className="lp-login__back">
            <Link to="/">← Back to home</Link>
          </div>

          {/* Demo */}
          <div className="lp-login__demo">
            <div className="lp-login__demo-head">
              <Zap size={14} /> Quick Demo Access
            </div>
            <div className="lp-login__demo-grid">
              <button onClick={() => quickLogin('user@dms.com', '123')} disabled={loading}>
                <span className="lp-login__demo-role">User</span>
                <span className="lp-login__demo-email">user@dms.com</span>
                <ArrowRight size={14} />
              </button>
              <button onClick={() => quickLogin('admin@dms.com', '123')} disabled={loading}>
                <span className="lp-login__demo-role">Admin</span>
                <span className="lp-login__demo-email">admin@dms.com</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="lp-login__footer">
        © 2026 DMS — Enterprise Resource Planning · Document Management System
      </footer>

      <style>{`
.lp-login{min-height:100vh;display:flex;flex-direction:column;position:relative;background:#0c1929;font-family:'Inter',system-ui,sans-serif;overflow:hidden}
.lp-login__bg{position:fixed;inset:0;background:
  radial-gradient(ellipse 70% 50% at 60% 30%,rgba(6,182,212,.1) 0%,transparent 60%),
  radial-gradient(ellipse 50% 40% at 20% 70%,rgba(99,102,241,.07) 0%,transparent 50%),
  radial-gradient(ellipse 30% 30% at 80% 80%,rgba(139,92,246,.06) 0%,transparent 40%);
  pointer-events:none}

/* Header */
.lp-login__header{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;position:relative;z-index:10}
.lp-login__brand{display:flex;align-items:center;text-decoration:none}
.lp-login__brand img{height:40px;filter:drop-shadow(0 2px 8px rgba(6,182,212,.3))}
.lp-login__lang-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:rgba(255,255,255,.7);font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s}
.lp-login__lang-btn:hover{background:rgba(255,255,255,.1);color:#fff}
.lp-login__lang-dd{position:absolute;top:calc(100% + 6px);right:0;background:rgba(19,35,56,.96);border:1px solid rgba(255,255,255,.1);border-radius:10px;overflow:hidden;min-width:140px;z-index:100;backdrop-filter:blur(16px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.lp-login__lang-item{width:100%;padding:10px 16px;border:none;background:transparent;color:rgba(255,255,255,.7);font-size:13px;cursor:pointer;text-align:left;font-family:inherit;transition:background .15s}
.lp-login__lang-item:hover{background:rgba(255,255,255,.06)}
.lp-login__lang-item.active{color:#06b6d4;font-weight:600;background:rgba(6,182,212,.08)}

/* Main */
.lp-login__main{flex:1;display:flex;align-items:center;justify-content:center;padding:16px 24px;position:relative;z-index:1}
.lp-login__card{width:100%;max-width:420px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:36px 32px;backdrop-filter:blur(20px);box-shadow:0 24px 64px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.06)}

.lp-login__logo-wrap{width:72px;height:72px;margin:0 auto 20px;filter:drop-shadow(0 4px 16px rgba(6,182,212,.3))}
.lp-login__logo-wrap img{width:100%;height:100%;object-fit:contain}

.lp-login__card h1{text-align:center;font-size:24px;font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:-.02em}
.lp-login__sub{text-align:center;font-size:13px;color:rgba(255,255,255,.45);margin-bottom:28px}

/* Alerts */
.lp-login__alert{display:flex;gap:10px;padding:12px 14px;border-radius:10px;font-size:12px;margin-bottom:16px;line-height:1.5}
.lp-login__alert strong{display:block;font-weight:600;margin-bottom:2px}
.lp-login__alert--warn{background:rgba(217,119,6,.1);border:1px solid rgba(217,119,6,.2);color:#fbbf24}
.lp-login__alert--err{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.2);color:#fca5a5}

/* Form */
.lp-login__field{margin-bottom:18px}
.lp-login__field label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:rgba(255,255,255,.6);margin-bottom:6px;text-transform:uppercase;letter-spacing:.3px}
.lp-login__field input{width:100%;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:14px;font-family:inherit;transition:all .2s;outline:none}
.lp-login__field input::placeholder{color:rgba(255,255,255,.25)}
.lp-login__field input:hover{border-color:rgba(255,255,255,.18)}
.lp-login__field input:focus{border-color:rgba(6,182,212,.5);box-shadow:0 0 0 3px rgba(6,182,212,.1);background:rgba(255,255,255,.07)}
.lp-login__eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;padding:4px;display:flex}
.lp-login__eye:hover{color:rgba(255,255,255,.6)}

.lp-login__submit{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:linear-gradient(135deg,#06b6d4,#0891b2);color:#fff;font-size:14px;font-weight:600;border:none;border-radius:10px;cursor:pointer;font-family:inherit;transition:all .25s;box-shadow:0 0 20px rgba(6,182,212,.2),inset 0 1px 0 rgba(255,255,255,.15);margin-top:4px}
.lp-login__submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 32px rgba(6,182,212,.35)}
.lp-login__submit:disabled{opacity:.6;cursor:not-allowed}

.lp-login__spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.lp-login__back{text-align:center;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06)}
.lp-login__back a{font-size:13px;color:rgba(255,255,255,.4);text-decoration:none;transition:color .15s}
.lp-login__back a:hover{color:rgba(255,255,255,.7)}

/* Demo */
.lp-login__demo{margin-top:20px;padding:16px;background:rgba(6,182,212,.04);border:1px solid rgba(6,182,212,.1);border-radius:12px}
.lp-login__demo-head{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#06b6d4;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.lp-login__demo-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lp-login__demo-grid button{display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;cursor:pointer;font-family:inherit;transition:all .2s;text-align:left;color:#06b6d4}
.lp-login__demo-grid button:hover{background:rgba(255,255,255,.08);border-color:rgba(6,182,212,.3)}
.lp-login__demo-role{font-size:13px;font-weight:600;color:rgba(255,255,255,.85);display:block}
.lp-login__demo-email{font-size:10px;color:rgba(255,255,255,.35);font-family:monospace;display:block;margin-top:2px}

/* Footer */
.lp-login__footer{text-align:center;padding:14px;font-size:11px;color:rgba(255,255,255,.2);position:relative;z-index:1;border-top:1px solid rgba(255,255,255,.04)}

@media(max-width:520px){
  .lp-login__card{padding:28px 20px}
  .lp-login__demo-grid{grid-template-columns:1fr}
}
      `}</style>
    </div>
  );
}
