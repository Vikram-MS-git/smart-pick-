import ProductListing from "./ProductListing";
import { laptops } from "../data/products";

const brands = [...new Set(laptops.map((p) => p.brand))];

export default function Laptops() {
  return (
    <ProductListing
      icon="💻"
      title="Laptops"
      description="From everyday browsing rigs to 4K creator powerhouses — filtered and AI-matched."
      products={laptops}
      brands={brands}
    />
  );
}
