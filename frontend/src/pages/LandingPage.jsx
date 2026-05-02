import { Link } from 'react-router-dom';
import { Shield, Users, FileText, BarChart3, Search, Download, ArrowRight, Menu, X, Lock, Globe, CheckCircle2, Building2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">DocVault</span>
            <span className="logo-subtitle">DMS</span>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="nav-signin">Sign In</Link>
            <Link to="/login" className="nav-cta">Get Started</Link>
          </div>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="nav-mobile">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/login" className="nav-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Building2 size={16} />
              <span>Enterprise Document Management</span>
            </div>
            <h1 className="hero-title">
              Secure Document Management<br />
              for Modern Enterprises
            </h1>
            <p className="hero-description">
              Streamline your document workflows with enterprise-grade security, 
              intelligent search, and seamless collaboration. Built for organizations 
              that demand reliability and compliance.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn-primary">
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary">
                View Features
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-value">10,000+</div>
                <div className="stat-label">Documents</div>
              </div>
              <div className="stat">
                <div className="stat-value">500+</div>
                <div className="stat-label">Users</div>
              </div>
              <div className="stat">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-header">
                <div className="visual-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="visual-title">Document Management System</div>
              </div>
              <div className="visual-content">
                <div className="visual-item">
                  <FileText size={20} />
                  <div className="visual-item-text">
                    <div className="visual-item-title">Financial Report Q4.pdf</div>
                    <div className="visual-item-meta">2.4 MB • Updated 2 hours ago</div>
                  </div>
                  <CheckCircle2 size={18} className="visual-check" />
                </div>
                <div className="visual-item">
                  <FileText size={20} />
                  <div className="visual-item-text">
                    <div className="visual-item-title">Project Proposal.docx</div>
                    <div className="visual-item-meta">1.8 MB • Updated 5 hours ago</div>
                  </div>
                  <CheckCircle2 size={18} className="visual-check" />
                </div>
                <div className="visual-item">
                  <FileText size={20} />
                  <div className="visual-item-text">
                    <div className="visual-item-title">Contract Agreement.pdf</div>
                    <div className="visual-item-meta">3.2 MB • Updated yesterday</div>
                  </div>
                  <CheckCircle2 size={18} className="visual-check" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise-Grade Features</h2>
            <p>Everything you need to manage documents securely and efficiently</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Advanced Security</h3>
              <p>Bank-level encryption, role-based access control, and comprehensive audit trails ensure your documents are always protected.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={24} />
              </div>
              <h3>Intelligent Search</h3>
              <p>Find any document instantly with powerful search across content, metadata, categories, and custom fields.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={24} />
              </div>
              <h3>Team Collaboration</h3>
              <p>Real-time comments, version control, and approval workflows keep your team aligned and productive.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Globe size={24} />
              </div>
              <h3>Multi-Language Support</h3>
              <p>Full support for English, French, and Arabic with automatic translation capabilities powered by AI.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={24} />
              </div>
              <h3>Analytics & Reporting</h3>
              <p>Gain insights with real-time dashboards, usage analytics, and customizable reports for better decision-making.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Download size={24} />
              </div>
              <h3>Flexible Export</h3>
              <p>Export your data to CSV, Excel, or PDF formats with full metadata preservation and custom formatting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2>Built for Enterprise Operations</h2>
              <p className="about-lead">
                DocVault is a comprehensive document management solution designed for 
                organizations that require security, compliance, and scalability.
              </p>
              <ul className="about-list">
                <li>
                  <CheckCircle2 size={20} />
                  <span>Role-based access control (RBAC)</span>
                </li>
                <li>
                  <CheckCircle2 size={20} />
                  <span>Kubernetes-native deployment</span>
                </li>
                <li>
                  <CheckCircle2 size={20} />
                  <span>Real-time collaboration tools</span>
                </li>
                <li>
                  <CheckCircle2 size={20} />
                  <span>Compliance-ready audit trails</span>
                </li>
                <li>
                  <CheckCircle2 size={20} />
                  <span>S3-compatible storage</span>
                </li>
                <li>
                  <CheckCircle2 size={20} />
                  <span>Event-driven architecture</span>
                </li>
              </ul>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <div className="about-card-header">
                  <Lock size={24} />
                  <span>Security First</span>
                </div>
                <div className="about-card-content">
                  <div className="about-metric">
                    <div className="about-metric-value">256-bit</div>
                    <div className="about-metric-label">AES Encryption</div>
                  </div>
                  <div className="about-metric">
                    <div className="about-metric-value">99.9%</div>
                    <div className="about-metric-label">Uptime SLA</div>
                  </div>
                  <div className="about-metric">
                    <div className="about-metric-value">24/7</div>
                    <div className="about-metric-label">Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join organizations worldwide using DocVault for secure document management</p>
            <Link to="/login" className="btn-primary btn-large">
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-text">DocVault</span>
                <span className="logo-subtitle">DMS</span>
              </div>
              <p>Enterprise Document Management System</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <Link to="/login">Demo</Link>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#contact">Support</a>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <a href="#contact">Privacy Policy</a>
              <a href="#contact">Terms of Service</a>
              <a href="#contact">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 DocVault. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .landing {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          line-height: 1.6;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .nav-scrolled {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
        }

        .logo-text {
          font-size: 24px;
          color: #0066cc;
          letter-spacing: -0.5px;
        }

        .logo-subtitle {
          font-size: 14px;
          color: #666;
          font-weight: 600;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-links a {
          text-decoration: none;
          color: #4b5563;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #0066cc;
        }

        .nav-signin {
          color: #0066cc !important;
        }

        .nav-cta {
          background: #0066cc;
          color: white !important;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .nav-cta:hover {
          background: #0052a3;
          transform: translateY(-1px);
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          color: #1a1a1a;
          cursor: pointer;
          padding: 8px;
        }

        .nav-mobile {
          display: none;
        }

        /* Hero Section */
        .hero {
          padding: 140px 24px 80px;
          background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 100px;
          color: #1e40af;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: 52px;
          font-weight: 800;
          line-height: 1.1;
          color: #1a1a1a;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero-description {
          font-size: 19px;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 32px;
          max-width: 540px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #0052a3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 17px;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: white;
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          border-color: #0066cc;
          color: #0066cc;
        }

        .hero-stats {
          display: flex;
          gap: 48px;
        }

        .stat {
          text-align: left;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .hero-visual {
          position: relative;
        }

        .visual-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .visual-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .visual-dots {
          display: flex;
          gap: 6px;
        }

        .visual-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e5e7eb;
        }

        .visual-dots span:nth-child(1) { background: #ef4444; }
        .visual-dots span:nth-child(2) { background: #f59e0b; }
        .visual-dots span:nth-child(3) { background: #10b981; }

        .visual-title {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .visual-content {
          padding: 20px;
        }

        .visual-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }

        .visual-item:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .visual-item:last-child {
          margin-bottom: 0;
        }

        .visual-item svg {
          color: #0066cc;
          flex-shrink: 0;
        }

        .visual-item-text {
          flex: 1;
        }

        .visual-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
        }

        .visual-item-meta {
          font-size: 12px;
          color: #6b7280;
        }

        .visual-check {
          color: #10b981;
          flex-shrink: 0;
        }

        /* Features Section */
        .features {
          padding: 80px 24px;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 40px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .section-header p {
          font-size: 18px;
          color: #6b7280;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          padding: 32px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          border-color: #bfdbfe;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0066cc;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 15px;
          line-height: 1.7;
          color: #6b7280;
        }

        /* About Section */
        .about {
          padding: 80px 24px;
          background: #f9fafb;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .about-content h2 {
          font-size: 40px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }

        .about-lead {
          font-size: 18px;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .about-list {
          list-style: none;
          display: grid;
          gap: 16px;
        }

        .about-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          color: #4b5563;
          font-weight: 500;
        }

        .about-list svg {
          color: #10b981;
          flex-shrink: 0;
        }

        .about-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .about-card-header {
          padding: 24px;
          background: #0066cc;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
        }

        .about-card-content {
          padding: 32px 24px;
          display: grid;
          gap: 24px;
        }

        .about-metric {
          text-align: center;
        }

        .about-metric-value {
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .about-metric-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        /* CTA Section */
        .cta {
          padding: 80px 24px;
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        }

        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta h2 {
          font-size: 40px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }

        .cta p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
        }

        .cta .btn-primary {
          background: white;
          color: #0066cc;
        }

        .cta .btn-primary:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        .footer {
          padding: 60px 24px 24px;
          background: #1a1a1a;
          color: #9ca3af;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand p {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .footer-logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }

        .footer-logo .logo-text {
          color: white;
        }

        .footer-logo .logo-subtitle {
          color: #9ca3af;
        }

        .footer-links h4 {
          color: white;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-links a {
          display: block;
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 12px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: white;
        }

        .footer-bottom {
          padding-top: 24px;
          border-top: 1px solid #374151;
          text-align: center;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-container,
          .about-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .hero-visual {
            max-width: 500px;
            margin: 0 auto;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .nav-toggle {
            display: block;
          }

          .nav-mobile {
            display: flex;
            flex-direction: column;
            padding: 20px 24px;
            background: white;
            border-top: 1px solid #e5e7eb;
          }

          .nav-mobile a {
            padding: 12px 0;
            color: #4b5563;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid #f3f4f6;
          }

          .nav-mobile .nav-cta {
            margin-top: 12px;
            text-align: center;
            border: none;
          }

          .hero {
            padding: 100px 24px 60px;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-description {
            font-size: 17px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            gap: 32px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 32px;
          }

          .about-content h2 {
            font-size: 32px;
          }

          .cta h2 {
            font-size: 32px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}
