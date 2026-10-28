import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="container notfound-page">
      <span className="eyebrow">404</span>
      <h1 className="section-title">This page isn't in the catalog</h1>
      <p className="section-sub">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 18 }}>
        Back to Home
      </Link>
    </div>
  );
}
