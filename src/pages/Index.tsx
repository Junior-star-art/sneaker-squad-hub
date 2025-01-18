import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ComfortSection from "@/components/ComfortSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import StyleCommunity from "@/components/community/StyleCommunity";
import LatestAndGreatest from "@/components/sections/LatestAndGreatest";
import ShopIcons from "@/components/sections/ShopIcons";
import TrendingThisWeek from "@/components/sections/TrendingThisWeek";
import ExploreMore from "@/components/sections/ExploreMore";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <LatestAndGreatest />
      <ShopIcons />
      <TrendingThisWeek />
      <ExploreMore />
      <ComfortSection />
      <ProductGrid />
      <StyleCommunity />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;