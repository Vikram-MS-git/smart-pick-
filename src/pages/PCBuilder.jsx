import { useState, useMemo } from "react";
import { componentCatalog, componentLabels, componentOrder, checkCompatibility } from "../data/pcComponents";
import "./PCBuilder.css";

const purposes = ["Gaming", "Coding", "Editing", "Office"];
const emptyBuild = { cpu: null, gpu: null, motherboard: null, ram: null, storage: null, psu: null, cabinet: null };

const statusCopy = {
  empty: { label: "Start Building", icon: "⚪", tone: "status-empty" },
  compatible: { label: "Compatible", icon: "🟢", tone: "status-compatible" },
  warning: { label: "Warning", icon: "🟡", tone: "status-warning" },
  incompatible: { label: "Incompatible", icon: "🔴", tone: "status-incompatible" },
};

export default function PCBuilder() {
  const [purpose, setPurpose] = useState("Gaming");
  const [budget, setBudget] = useState(90000);
  const [build, setBuild] = useState(emptyBuild);
  const [generated, setGenerated] = useState(false);

  const totalPrice = useMemo(
    () => Object.values(build).reduce((sum, part) => sum + (part ? part.price : 0), 0),
    [build]
  );
  const remaining = budget - totalPrice;
  const compatibility = useMemo(() => checkCompatibility(build), [build]);
  const status = statusCopy[compatibility.status];

  const selectPart = (type, part) => {
    setBuild((prev) => ({ ...prev, [type]: prev[type]?.id === part.id ? null : part }));
  };

  const relevantParts = (type) =>
    [...componentCatalog[type]].sort((a, b) => {
      const aFit = a.purpose?.includes(purpose) ? 0 : 1;
      const bFit = b.purpose?.includes(purpose) ? 0 : 1;
      return aFit - bFit;
    });

  const handleReset = () => {
    setBuild(emptyBuild);
    setGenerated(false);
  };

  const handleGenerate = () => {
    // Auto-fills any empty slot with the best-fit part for the chosen
    // purpose while respecting the remaining budget where possible.
    setBuild((prev) => {
      const next = { ...prev };
      componentOrder.forEach((type) => {
        if (next[type]) return;
        const candidates = relevantParts(type).filter((p) => p.purpose?.includes(purpose));
        const pick = candidates.find((p) => {
          const spentSoFar = Object.values(next).reduce((s, x) => s + (x ? x.price : 0), 0);
          return spentSoFar + p.price <= budget;
        }) || candidates[0] || componentCatalog[type][0];
        next[type] = pick;
      });
      return next;
    });
    setGenerated(true);
  };

  return (
    <div className="builder-page">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 36 }}>
          <span className="eyebrow">PC Builder</span>
          <h1 className="section-title">Assemble Your Perfect Build</h1>
          <p className="section-sub">
            Choose your purpose and budget, pick components, and SmartPick checks
            compatibility in real time.
          </p>
        </div>

        <div className="builder-controls card">
          <div className="field">
            <label>Purpose</label>
            <div className="chip-group">
              {purposes.map((p) => (
                <button
                  key={p}
                  className={`chip ${purpose === p ? "active" : ""}`}
                  onClick={() => setPurpose(p)}
                  type="button"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="field builder-budget-field">
            <label htmlFor="budget-slider">
              Budget <span className="mono builder-budget-value">₹{budget.toLocaleString("en-IN")}</span>
            </label>
            <input
              id="budget-slider"
              type="range"
              min="30000"
              max="250000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="builder-slider"
            />
            <div className="builder-slider-scale">
              <span>₹30k</span>
              <span>₹250k</span>
            </div>
          </div>
        </div>

        <div className="builder-layout">
          <div className="builder-components">
            {componentOrder.map((type) => (
              <div className="component-block card" key={type}>
                <div className="component-block-head">
                  <h3>{componentLabels[type]}</h3>
                  {build[type] && <span className="tag">{build[type].name}</span>}
                </div>
                <div className="component-options">
                  {relevantParts(type).map((part) => {
                    const selected = build[type]?.id === part.id;
                    const fits = part.purpose?.includes(purpose);
                    return (
                      <button
                        key={part.id}
                        type="button"
                        className={`component-option ${selected ? "component-option-selected" : ""}`}
                        onClick={() => selectPart(type, part)}
                      >
                        <div className="component-option-main">
                          <span className="component-option-name">{part.name}</span>
                          {fits && <span className="component-option-fit">Fits {purpose}</span>}
                        </div>
                        <span className="mono component-option-price">
                          {part.price === 0 ? "Included" : `₹${part.price.toLocaleString("en-IN")}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <aside className="builder-summary">
            <div className="card summary-card">
              <h3 className="summary-title">Build Summary</h3>

              <ul className="summary-list">
                {componentOrder.map((type) => (
                  <li key={type}>
                    <span className="summary-label">{componentLabels[type]}</span>
                    <span className={`summary-value ${build[type] ? "" : "summary-value-empty"}`}>
                      {build[type] ? build[type].name : "Not selected"}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="summary-divider" />

              <div className="summary-row">
                <span>Total Price</span>
                <span className="mono summary-total">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Remaining Budget</span>
                <span className={`mono ${remaining < 0 ? "summary-negative" : "summary-positive"}`}>
                  {remaining < 0 ? "-" : ""}₹{Math.abs(remaining).toLocaleString("en-IN")}
                </span>
              </div>

              <div className={`compat-banner ${status.tone}-bg`}>
                <span className={`status-dot ${status.tone}`} />
                <div>
                  <strong>{status.label}</strong>
                  {compatibility.issues.length > 0 && (
                    <ul className="compat-list">
                      {compatibility.issues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  {compatibility.warnings.length > 0 && (
                    <ul className="compat-list compat-list-warning">
                      {compatibility.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="summary-actions">
                <button className="btn btn-primary btn-block" onClick={handleGenerate}>
                  Generate Build
                </button>
                <button className="btn btn-secondary btn-block" onClick={handleReset}>
                  Reset
                </button>
              </div>

              {generated && compatibility.status !== "incompatible" && (
                <p className="summary-note">✓ Build generated for {purpose} within your budget guidance.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
