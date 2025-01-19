import { useState, Suspense } from "react";
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
import ErrorBoundary from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-[60vh] w-full" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  </div>
);

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  console.log("Rendering Index page"); // Debug log

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col relative">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <main className="flex-grow relative z-0">
          <ErrorBoundary>
            <Hero />
          </ErrorBoundary>
          
          <div className="bg-white relative z-10">
            <Suspense fallback={<LoadingFallback />}>
              <ErrorBoundary>
                <LatestAndGreatest />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <ShopIcons />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <TrendingThisWeek />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <ExploreMore />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <ComfortSection />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <ProductGrid />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <RecentlyViewed />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <YouMayAlsoLike />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <StyleCommunity />
              </ErrorBoundary>
              
              <ErrorBoundary>
                <Newsletter />
              </ErrorBoundary>
            </Suspense>
          </div>
        </main>
        <Footer />
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    </ErrorBoundary>
  );
};

export default Index;