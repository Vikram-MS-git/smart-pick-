import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCompare } from "../context/CompareContext";
import MatchRing from "../components/MatchRing";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = getProductById(id);
  const { isComparing, toggleCompare } = useCompare();

  // location.key is "default" when this page was opened directly (shared link,
  // new tab), where there is no in-app history to go back to.
  const goBack = () => (location.key === "default" ? navigate("/") : navigate(-1));

  if (!product) {
    return (
      <div className="container detail-notfound">
        <h2>Product not found</h2>
        <p>It may have been removed from the mock catalog.</p>
        <Link to="/" className="btn btn-primary">Back Home</Link>
      </div>
    );
  }

  const comparing = isComparing(product.id);

  return (
    <div className="detail-page">
      <div className="container">
        <button onClick={goBack} className="detail-back">
          ← Back
        </button>

        <div className="detail-layout card">
          <div className="detail-visual">
            <div className="detail-image">{product.image}</div>
            <MatchRing value={product.aiMatch} size={80} />
          </div>

          <div className="detail-info">
            <span className="pill">{product.brand} · {product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-meta">
              <span className="mono detail-price">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="detail-rating">★ {product.rating} rating</span>
            </div>

            <div className="detail-tags">
              {product.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <div className="detail-reason glass-panel">
              <span className="eyebrow" style={{ marginBottom: 6 }}>Why SmartPick recommends it</span>
              <p>{product.reason}</p>
            </div>

            <h3 className="detail-specs-title">Specifications</h3>
            <ul className="detail-specs">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}>
                  <span className="spec-label">{key}</span>
                  <span className="mono">{value}</span>
                </li>
              ))}
            </ul>

            <div className="detail-actions">
              <button
                className={`btn ${comparing ? "btn-primary" : "btn-secondary"}`}
                onClick={() => toggleCompare(product.id)}
              >
                {comparing ? "✓ Added to Compare" : "Add to Compare"}
              </button>
              <Link to="/compare" className="btn btn-ghost">Go to Compare</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
