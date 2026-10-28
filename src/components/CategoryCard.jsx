import { Link } from "react-router-dom";
import "./CategoryCard.css";

export default function CategoryCard({ icon, title, description, to, count }) {
  return (
    <Link to={to} className="category-card">
      <div className="category-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="category-card-foot">
        <span className="mono">{count}</span>
        <span className="category-card-arrow">→</span>
      </div>
    </Link>
  );
}
