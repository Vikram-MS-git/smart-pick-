import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allProducts, getProductById } from "../data/products";
import { useCompare } from "../context/CompareContext";
import MatchRing from "../components/MatchRing";
import "./Compare.css";

const rows = [
  { key: "price", label: "Price", format: (p) => `₹${p.price.toLocaleString("en-IN")}`, higherIsBetter: false },
  { key: "processor", label: "Processor", format: (p) => p.specs.processor || "—" },
  { key: "ram", label: "RAM", format: (p) => p.specs.ram || "—" },
  { key: "storage", label: "Storage", format: (p) => p.specs.storage || p.specs.capacity || "—" },
  { key: "battery", label: "Battery", format: (p) => p.specs.battery || "—" },
  { key: "rating", label: "Rating", format: (p) => `★ ${p.rating}`, higherIsBetter: true, numeric: (p) => p.rating },
  { key: "aiMatch", label: "AI Match", format: (p) => `${p.aiMatch}%`, higherIsBetter: true, numeric: (p) => p.aiMatch },
];

export default function Compare() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [slots, setSlots] = useState([null, null, null]);

  useEffect(() => {
    // Always mirror the shared selection, including when it becomes empty
    // (otherwise "Clear selections" leaves stale products on screen).
    const fromContext = compareIds.map((id) => getProductById(id)).filter(Boolean);
    setSlots([fromContext[0] || null, fromContext[1] || null, fromContext[2] || null]);
  }, [compareIds]);

  const setSlot = (index, id) => {
    const product = getProductById(id) || null;
    setSlots((prev) => {
      const next = [...prev];
      next[index] = product;
      return next;
    });
  };

  const activeProducts = slots.filter(Boolean);

  const winner = (() => {
    if (activeProducts.length < 2) return null;
    return [...activeProducts].sort((a, b) => {
      const scoreA = a.aiMatch + a.rating * 5;
      const scoreB = b.aiMatch + b.rating * 5;
      return scoreB - scoreA;
    })[0];
  })();

  const bestForRow = (row) => {
    if (!row.numeric || activeProducts.length < 2) return null;
    return [...activeProducts].sort((a, b) => row.numeric(b) - row.numeric(a))[0].id;
  };

  return (
    <div className="compare-page">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <span className="eyebrow">Product Comparison</span>
          <h1 className="section-title">Compare Side by Side</h1>
          <p className="section-sub">
            Pick up to three products to see specs, pricing, and AI match scores lined up.
          </p>
        </div>

        <div className="compare-slots">
          {slots.map((product, i) => (
            <div className="field compare-slot" key={i}>
              <label>Product {i + 1}</label>
              <select
                className="select"
                value={product?.id || ""}
                onChange={(e) => setSlot(i, e.target.value)}
              >
                <option value="">Select a product…</option>
                {allProducts.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={slots.some((s, j) => j !== i && s?.id === p.id)}
                  >
                    {p.category} · {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {compareIds.length > 0 && (
          <button className="btn btn-ghost" onClick={clearCompare} style={{ marginBottom: 24 }}>
            Clear selections
          </button>
        )}

        {activeProducts.length < 2 ? (
          <div className="listing-empty glass-panel">
            <span className="rec-placeholder-icon">⚖️</span>
            <h3>Select at least two products</h3>
            <p>
              Choose products above, or head to the{" "}
              <Link to="/laptops" className="compare-link">catalog</Link> and use "Add to Compare".
            </p>
          </div>
        ) : (
          <div className="compare-table-wrap card">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Spec</th>
                  {activeProducts.map((p) => (
                    <th key={p.id}>
                      <div className="compare-th-product">
                        <span className="compare-th-emoji">{p.image}</span>
                        <span>{p.name}</span>
                        {winner?.id === p.id && <span className="tag compare-winner-tag">🏆 Winner</span>}
                        {compareIds.includes(p.id) && (
                          <button
                            className="btn-ghost compare-remove"
                            onClick={() => toggleCompare(p.id)}
                            aria-label={`Remove ${p.name} from compare`}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="compare-row-label">{row.label}</td>
                    {activeProducts.map((p) => {
                      const isBest = bestForRow(row) === p.id;
                      return (
                        <td key={p.id} className={isBest ? "compare-cell-best" : ""}>
                          {row.key === "aiMatch" ? (
                            <div className="compare-match-cell">
                              <MatchRing value={p.aiMatch} size={40} />
                            </div>
                          ) : (
                            <span className="mono">{row.format(p)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {winner && (
          <div className="winner-banner glass-panel">
            <div className="winner-banner-icon">🏆</div>
            <div>
              <span className="eyebrow" style={{ marginBottom: 4 }}>SmartPick Winner</span>
              <h3>{winner.name}</h3>
              <p>
                Best balance of AI match score and user rating among your selected products at{" "}
                <span className="mono">₹{winner.price.toLocaleString("en-IN")}</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
