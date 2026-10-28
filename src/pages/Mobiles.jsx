import ProductListing from "./ProductListing";
import { mobiles } from "../data/products";

const brands = [...new Set(mobiles.map((p) => p.brand))];

export default function Mobiles() {
  return (
    <ProductListing
      icon="📱"
      title="Mobiles"
      description="Flagship performance to reliable budget daily drivers — filtered and AI-matched."
      products={mobiles}
      brands={brands}
    />
  );
}
