import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { generateRecommendations } from "../utils/mockRecommend";
import { parsePrompt } from "../utils/parsePrompt";
import "./Recommendation.css";

const categories = ["Laptop", "Mobile", "Earphones", "PC"];
const usageOptions = ["Gaming", "Coding", "Office", "Editing", "Music"];
const priorityOptions = ["Performance", "Camera", "Battery", "Display", "Sound"];

const initialForm = { category: "Laptop", budget: "70000", usage: "Gaming", priority: "Performance" };

export default function Recommendation() {
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prefill the form when arriving from the home page's free-text prompt.
  useEffect(() => {
    const prompt = location.state?.prompt;
    if (prompt && prompt.trim()) {
      const parsed = parsePrompt(prompt);
      setForm((prev) => ({
        category: parsed.category || prev.category,
        budget: parsed.budget || prev.budget,
        usage: parsed.usage || prev.usage,
        priority: parsed.priority || prev.priority,
      }));
    }
  }, [location.state]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    // Simulated processing delay so the "AI" moment feels real for the demo.
    setTimeout(() => {
      const category = form.category === "PC" ? "Laptop" : form.category; // PC handled by its own builder
      const engineResults =
        form.category === "PC"
          ? null
          : generateRecommendations({ ...form, category });
      setResults(engineResults);
      setLoading(false);
    }, 850);
  };

  return (
    <div className="rec-page">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 40 }}>
          <span className="eyebrow">AI Recommendation Engine</span>
          <h1 className="section-title">Tell Us What You're Looking For</h1>
          <p className="section-sub">
            Fill in your requirements and SmartPick will rank the closest matches from
            the catalog, with reasoning for every pick.
          </p>
        </div>

        <div className="rec-layout">
          <form className="rec-form card" onSubmit={handleSubmit}>
            <div className="field">
              <label>Category</label>
              <div className="chip-group">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`chip ${form.category === c ? "active" : ""}`}
                    onClick={() => updateField("category", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="budget">Budget (₹)</label>
              <input
                id="budget"
                type="number"
                className="input"
                placeholder="e.g. 70000"
                min="0"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Primary Usage</label>
              <div className="chip-group">
                {usageOptions.map((u) => (
                  <button
                    type="button"
                    key={u}
                    className={`chip ${form.usage === u ? "active" : ""}`}
                    onClick={() => updateField("usage", u)}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Top Priority</label>
              <div className="chip-group">
                {priorityOptions.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`chip ${form.priority === p ? "active" : ""}`}
                    onClick={() => updateField("priority", p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block rec-submit" disabled={loading}>
              {loading ? "Analyzing requirements…" : "Generate SmartPick Recommendation"}
            </button>
          </form>

          <div className="rec-results">
            {!submitted && (
              <div className="rec-placeholder glass-panel">
                <span className="rec-placeholder-icon">🤖</span>
                <h3>Your matches will appear here</h3>
                <p>Fill in the form and generate a recommendation to see ranked results.</p>
              </div>
            )}

            {loading && (
              <div className="rec-placeholder glass-panel">
                <div className="rec-loader" />
                <h3>Matching your requirements…</h3>
                <p>Scoring catalog items against budget, usage, and priority.</p>
              </div>
            )}

            {!loading && results && (
              <>
                <h2 className="rec-results-title">Your Best Matches</h2>

                <div className="rec-category-block">
                  <div className="rec-category-label">
                    <span>🏆</span> Best Overall
                  </div>
                  <ProductCard
                    product={{ ...results.bestOverall, aiMatch: results.bestOverall.computedMatch }}
                    showReason
                    badge={{ label: "Best Overall", tone: "gold" }}
                  />
                </div>

                <div className="rec-grid-2">
                  <div className="rec-category-block">
                    <div className="rec-category-label">
                      <span>💰</span> Best Value
                    </div>
                    <ProductCard
                      product={{ ...results.bestValue, aiMatch: results.bestValue.computedMatch }}
                      showReason
                      badge={{ label: "Best Value", tone: "cyan" }}
                    />
                  </div>

                  <div className="rec-category-block">
                    <div className="rec-category-label">
                      <span>⚡</span> Best Performance
                    </div>
                    <ProductCard
                      product={{ ...results.bestPerformance, aiMatch: results.bestPerformance.computedMatch }}
                      showReason
                      badge={{ label: "Best Performance", tone: "purple" }}
                    />
                  </div>
                </div>
              </>
            )}

            {!loading && submitted && form.category === "PC" && (
              <div className="rec-placeholder glass-panel">
                <span className="rec-placeholder-icon">🖥️</span>
                <h3>Use the full PC Builder for custom builds</h3>
                <p>PC recommendations are handled by the dedicated builder with live compatibility checks.</p>
                <Link to="/pc-builder" className="btn btn-primary" style={{ marginTop: 16 }}>
                  Open PC Builder
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
