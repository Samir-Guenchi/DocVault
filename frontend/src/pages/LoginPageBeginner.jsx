import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, LogIn, Globe, AlertCircle, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
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
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-left">
        <Link to="/" className="login-logo">
          <span className="logo-text">DocVault</span>
          <span className="logo-subtitle">DMS</span>
        </Link>
        <div className="login-branding">
          <h1>Enterprise Document Management</h1>
          <p>Secure, scalable, and compliant document management for modern organizations.</p>
          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon">
                <Lock size={20} />
              </div>
              <div>
                <div className="feature-title">Bank-Grade Security</div>
                <div className="feature-desc">256-bit encryption</div>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-icon">
                <Building2 size={20} />
              </div>
              <div>
                <div className="feature-title">Enterprise Ready</div>
                <div className="feature-desc">99.9% uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-header">
          <div className="login-lang">
            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
              <Globe size={16} />
              <span>{curLang}</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    className={`lang-item ${(i18n.language || 'en') === l.code ? 'active' : ''}`}
                    onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Access your document management workspace</p>
          </div>

          {apiError && (
            <div className="alert alert-warning">
              <AlertCircle size={18} />
              <div>
                <strong>Connection Issue</strong>
                <p>{apiError}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <div>
                <strong>Login Failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={doLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or use demo account</span>
          </div>

          <div className="demo-accounts">
            <button
              className="demo-btn"
              onClick={() => quickLogin('user@dms.com', '123')}
              disabled={loading}
            >
              <div className="demo-info">
                <span className="demo-role">User Account</span>
                <span className="demo-email">user@dms.com</span>
              </div>
              <ArrowRight size={18} />
            </button>
            <button
              className="demo-btn"
              onClick={() => quickLogin('admin@dms.com', '123')}
              disabled={loading}
            >
              <div className="demo-info">
                <span className="demo-role">Admin Account</span>
                <span className="demo-email">admin@dms.com</span>
              </div>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="login-footer">
            <Link to="/" className="back-link">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Left Side - Branding */
        .login-left {
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          color: white;
        }

        .login-logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 80px;
        }

        .login-logo .logo-text {
          font-size: 28px;
          color: white;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .login-logo .logo-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .login-branding {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 480px;
        }

        .login-branding h1 {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .login-branding > p {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 48px;
        }

        .login-features {
          display: grid;
          gap: 24px;
        }

        .login-feature {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Right Side - Form */
        .login-right {
          background: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .login-header {
          padding: 24px 48px;
          display: flex;
          justify-content: flex-end;
          border-bottom: 1px solid #e5e7eb;
        }

        .login-lang {
          position: relative;
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .lang-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .lang-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 140px;
          overflow: hidden;
          z-index: 100;
        }

        .lang-item {
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: #4b5563;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.15s;
        }

        .lang-item:hover {
          background: #f9fafb;
        }

        .lang-item.active {
          color: #0066cc;
          font-weight: 600;
          background: #eff6ff;
        }

        .login-form-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
        }

        .login-form-header {
          margin-bottom: 32px;
        }

        .login-form-header h2 {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .login-form-header p {
          font-size: 16px;
          color: #6b7280;
        }

        /* Alerts */
        .alert {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-size: 14px;
          line-height: 1.5;
        }

        .alert svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert strong {
          display: block;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .alert p {
          margin: 0;
        }

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        .alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        /* Form */
        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-group input::placeholder {
          color: #9ca3af;
        }

        .form-group input:hover {
          border-color: #d1d5db;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0066cc;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #4b5563;
        }

        .btn-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #0066cc;
          color: white;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          background: #0052a3;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .login-divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
        }

        .login-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .login-divider span {
          position: relative;
          background: white;
          padding: 0 16px;
          font-size: 13px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Demo Accounts */
        .demo-accounts {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .demo-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-align: left;
        }

        .demo-btn:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .demo-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .demo-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .demo-role {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .demo-email {
          font-size: 12px;
          color: #6b7280;
          font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
        }

        .demo-btn svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* Footer */
        .login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .back-link {
          font-size: 14px;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #0066cc;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-page {
            grid-template-columns: 1fr;
          }

          .login-left {
            display: none;
          }

          .login-right {
            min-height: 100vh;
          }
        }

        @media (max-width: 640px) {
          .login-header {
            padding: 20px 24px;
          }

          .login-form-container {
            padding: 32px 24px;
          }

          .login-form-header h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
