
import React from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import LatestAndGreatest from "@/components/sections/LatestAndGreatest";
import { AdminNav } from "@/components/admin/AdminNav";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Admin Navigation - only show for authenticated users */}
      {user && (
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <AdminNav />
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <Hero />
      
      {/* Latest Products Section */}
      <LatestAndGreatest />
      
      {/* Main Product Grid */}
      <ProductGrid />
    </div>
  );
};

export default Index;
