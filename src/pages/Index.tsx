import { useState } from "react";
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

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main>
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
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;