import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import "./ProductListing.css";

const sortOptions = [
  { id: "match", label: "AI Match" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Rating" },
];

// Internal helper component (not a route) shared by the three category
// pages so filtering/search/sort logic isn't duplicated three times.
export default function ProductListing({ icon, title, description, products, brands }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [priceCap, setPriceCap] = useState(null); // null = nothing chosen yet, show everything
  const [sort, setSort] = useState("match");

  // Slider bounds follow this category's real price range. (A fixed ₹5,000
  // minimum made the filter useless for earphones, which start near ₹1,300.)
  const allPrices = products.map((p) => p.price);
  const lowest = allPrices.length ? Math.min(...allPrices) : 0;
  const highest = allPrices.length ? Math.max(...allPrices) : 0;
  const step = highest >= 50000 ? 5000 : 500;
  const sliderMin = Math.floor(lowest / step) * step;
  const sliderMax = Math.ceil(highest / step) * step;
  const maxPrice = priceCap ?? sliderMax;

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (brand !== "All") list = list.filter((p) => p.brand === brand);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort((a, b) => b.aiMatch - a.aiMatch);
    }
  }, [products, query, brand, maxPrice, sort]);

  return (
    <div className="listing-page">
      <div className="container">
        <div className="listing-head">
          <div className="listing-head-icon">{icon}</div>
          <div>
            <h1 className="section-title">{title}</h1>
            <p className="section-sub">{description}</p>
          </div>
        </div>

        <div className="listing-toolbar card">
          <SearchBar value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}...`} />

          <div className="listing-filters">
            <div className="field">
              <label>Brand</label>
              <select className="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                <option>All</option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Max Price: <span className="mono">₹{maxPrice.toLocaleString("en-IN")}</span></label>
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={step}
                value={maxPrice}
                onChange={(e) => setPriceCap(Number(e.target.value))}
                className="builder-slider"
              />
            </div>

            <div className="field">
              <label>Sort By</label>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="listing-result-count mono">
          {filtered.length} of {products.length} products
        </div>

        {filtered.length > 0 ? (
          <div className="listing-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="listing-empty glass-panel">
            <span className="rec-placeholder-icon">🔍</span>
            <h3>No products match your filters</h3>
            <p>Try widening the price range or clearing the search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
