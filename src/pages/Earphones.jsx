import ProductListing from "./ProductListing";
import { earphones } from "../data/products";

const brands = [...new Set(earphones.map((p) => p.brand))];

export default function Earphones() {
  return (
    <ProductListing
      icon="🎧"
      title="Earphones"
      description="ANC, bass-heavy, and studio-accurate sound profiles — filtered and AI-matched."
      products={earphones}
      brands={brands}
    />
  );
}
