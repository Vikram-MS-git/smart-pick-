import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="search-bar">
      <span className="search-bar-icon">🔍</span>
      <input
        type="text"
        className="search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-bar-clear" onClick={() => onChange("")} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
