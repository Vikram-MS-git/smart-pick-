import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIRecommendationCard.css";

const suggestions = [
  "I need a laptop under ₹70,000 for gaming and coding.",
  "Suggest a phone with a great camera under ₹40,000.",
  "Best earphones for music with ANC under ₹5,000.",
];

export default function AIRecommendationCard() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    // No real AI yet — routes straight to the mock recommendation engine.
    navigate("/recommendation", { state: { prompt } });
  };

  return (
    <div className="ai-card glass-panel">
      <div className="ai-card-glow" aria-hidden="true" />
      <div className="ai-card-head">
        <span className="eyebrow">AI Recommendation Engine</span>
        <h2 className="section-title">Tell SmartPick What You Need</h2>
        <p className="section-sub">
          Describe your budget, use case, and priorities in plain language — SmartPick
          matches you with the best-fit products.
        </p>
      </div>

      <textarea
        className="textarea ai-card-textarea"
        placeholder="I need a laptop under ₹70,000 for gaming and coding."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="ai-card-suggestions">
        {suggestions.map((s) => (
          <button key={s} className="chip" onClick={() => setPrompt(s)} type="button">
            {s}
          </button>
        ))}
      </div>

      <button className="btn btn-primary ai-card-submit" onClick={handleSubmit}>
        Find My Match <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
