import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-mark">⚡</span>
            Smart<span className="text-gradient">Pick</span>
          </Link>
          <p className="footer-tagline">
            AI-guided recommendations for laptops, mobiles, earphones, and custom PC
            builds — matched to what you actually need.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/laptops">Laptops</Link></li>
            <li><Link to="/mobiles">Mobiles</Link></li>
            <li><Link to="/earphones">Earphones</Link></li>
            <li><Link to="/pc-builder">PC Builder</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SmartPick</h4>
          <ul>
            <li><Link to="/recommendation">Get Recommendations</Link></li>
            <li><Link to="/compare">Compare Products</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Project</h4>
          <ul>
            <li><span>MCA Mini Project</span></li>
            <li><span>Frontend MVP — v1.0</span></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SmartPick. Built for demonstration purposes.</span>
        <span className="mono footer-status">
          <span className="status-dot status-compatible" /> System status: mock data mode
        </span>
      </div>
    </footer>
  );
}
