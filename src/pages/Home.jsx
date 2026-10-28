import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import AIRecommendationCard from "../components/AIRecommendationCard";
import { laptops, mobiles, earphones } from "../data/products";
import "./Home.css";

const categories = [
  {
    icon: "🖥️",
    title: "PC Builder",
    description: "Assemble a custom PC with real-time compatibility checks.",
    to: "/pc-builder",
    count: "7 component types",
  },
  {
    icon: "💻",
    title: "Laptops",
    description: "From everyday browsing to 4K editing rigs.",
    to: "/laptops",
    count: `${laptops.length} models`,
  },
  {
    icon: "📱",
    title: "Mobiles",
    description: "Flagship performance to budget-friendly daily drivers.",
    to: "/mobiles",
    count: `${mobiles.length} models`,
  },
  {
    icon: "🎧",
    title: "Earphones",
    description: "ANC, bass-heavy, or studio-accurate sound profiles.",
    to: "/earphones",
    count: `${earphones.length} models`,
  },
];

const whySmartPick = [
  {
    icon: "🤖",
    title: "AI-Powered Matching",
    text: "Describe your needs in plain language and get ranked, explainable recommendations — not just a filtered list.",
  },
  {
    icon: "⚖️",
    title: "Side-by-Side Comparison",
    text: "Line up specs, pricing, and AI match scores across products to see exactly where each one wins.",
  },
  {
    icon: "🔧",
    title: "PC Compatibility Engine",
    text: "Build a custom PC with live socket, RAM, and PSU wattage checks so nothing you pick conflicts.",
  },
  {
    icon: "🎯",
    title: "Budget-Aware Suggestions",
    text: "Every recommendation respects the ceiling you set, so you never see something out of reach.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-inner">
          <span className="eyebrow">AI-powered · Gadget &amp; PC recommendation platform</span>
          <h1 className="hero-title">
            Find the Tech That's <span className="text-gradient">Right for You</span>
          </h1>
          <p className="hero-sub">
            SmartPick reads your budget, use case, and priorities, then matches you with
            the best laptops, mobiles, earphones, and PC builds — backed by transparent,
            explainable AI reasoning instead of guesswork.
          </p>
          <div className="hero-actions">
            <Link to="/recommendation" className="btn btn-primary">
              Get Recommendations
            </Link>
            <Link to="/pc-builder" className="btn btn-secondary">
              Build Your PC
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <span className="mono hero-stat-value">18+</span>
              <span className="hero-stat-label">Catalog products</span>
            </div>
            <div>
              <span className="mono hero-stat-value">4</span>
              <span className="hero-stat-label">Device categories</span>
            </div>
            <div>
              <span className="mono hero-stat-value">7</span>
              <span className="hero-stat-label">PC components tracked</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Start here</span>
            <h2 className="section-title">Pick a Category</h2>
            <p className="section-sub">Jump straight into the catalog, or let the AI narrow it down for you.</p>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <CategoryCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <AIRecommendationCard />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why SmartPick</span>
            <h2 className="section-title">Built to Cut Through Spec-Sheet Noise</h2>
            <p className="section-sub">
              Every feature exists to answer one question faster: "which product is
              actually right for me?"
            </p>
          </div>
          <div className="why-grid">
            {whySmartPick.map((f) => (
              <div className="why-card card" key={f.title}>
                <div className="why-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt cta-section">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow">Ready when you are</span>
            <h2 className="section-title">Let SmartPick Find Your Next Upgrade</h2>
            <p className="section-sub">Answer a few quick questions and get ranked matches in seconds.</p>
          </div>
          <Link to="/recommendation" className="btn btn-primary">
            Get Recommendations
          </Link>
        </div>
      </section>
    </>
  );
}
