import { Link } from "react-router-dom";
import MatchRing from "./MatchRing";
import { useCompare } from "../context/CompareContext";
import "./ProductCard.css";

const specPriority = {
  Laptop: ["processor", "ram", "storage", "display"],
  Mobile: ["processor", "ram", "storage", "camera"],
  Earphones: ["type", "battery", "anc", "connectivity"],
};

export default function ProductCard({ product, showReason = false, badge }) {
  const { isComparing, toggleCompare, MAX_COMPARE, compareIds } = useCompare();
  const comparing = isComparing(product.id);
  const specKeys = specPriority[product.category] || Object.keys(product.specs).slice(0, 4);

  const disableAdd = !comparing && compareIds.length >= MAX_COMPARE;

  return (
    <article className="product-card">
      {badge && <div className={`product-card-badge product-card-badge-${badge.tone}`}>{badge.label}</div>}

      <div className="product-card-top">
        <div className="product-card-image">{product.image}</div>
        <MatchRing value={product.aiMatch} size={54} />
      </div>

      <div className="product-card-body">
        <span className="pill">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-meta">
          <span className="product-card-price mono">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="product-card-rating">★ {product.rating}</span>
        </div>

        <ul className="product-card-specs">
          {specKeys.map((key) => (
            <li key={key}>
              <span className="spec-label">{key}</span>
              <span className="spec-value mono">{product.specs[key]}</span>
            </li>
          ))}
        </ul>

        {showReason && product.reason && (
          <div className="product-card-reason">
            <span className="eyebrow" style={{ marginBottom: 6 }}>Why SmartPick picked this</span>
            <p>{product.reason}</p>
          </div>
        )}

        <div className="product-card-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary btn-block">
            View Details
          </Link>
          <button
            className={`btn btn-block ${comparing ? "btn-primary" : "btn-ghost"}`}
            onClick={() => toggleCompare(product.id)}
            disabled={disableAdd}
            title={disableAdd ? `You can compare up to ${MAX_COMPARE} products` : undefined}
          >
            {comparing ? "✓ Added to Compare" : "Add to Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}
