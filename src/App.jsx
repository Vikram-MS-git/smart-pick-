import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CompareProvider } from "./context/CompareContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Recommendation from "./pages/Recommendation";
import PCBuilder from "./pages/PCBuilder";
import Laptops from "./pages/Laptops";
import Mobiles from "./pages/Mobiles";
import Earphones from "./pages/Earphones";
import Compare from "./pages/Compare";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

// Scrolls to top on every route change so navigating between pages
// doesn't leave the viewport mid-scroll from the previous page.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <CompareProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/pc-builder" element={<PCBuilder />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/earphones" element={<Earphones />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </CompareProvider>
  );
}
