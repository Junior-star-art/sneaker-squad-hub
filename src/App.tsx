import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import { ProfileManagement } from "@/components/profile/ProfileManagement";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ComfortSection from "@/components/ComfortSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import StyleCommunity from "@/components/community/StyleCommunity";
import LatestAndGreatest from "@/components/sections/LatestAndGreatest";
import ShopIcons from "@/components/sections/ShopIcons";
import TrendingThisWeek from "@/components/sections/TrendingThisWeek";
import ExploreMore from "@/components/sections/ExploreMore";
import { RecentlyViewed } from "@/components/recommendations/RecentlyViewed";
import { YouMayAlsoLike } from "@/components/recommendations/YouMayAlsoLike";
import { useState } from "react";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <Hero />
      <LatestAndGreatest />
      <ShopIcons />
      <TrendingThisWeek />
      <ExploreMore />
      <ComfortSection />
      <ProductGrid />
      <RecentlyViewed />
      <YouMayAlsoLike />
      <StyleCommunity />
      <Newsletter />
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default App;
