
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const AdminNav = () => {
  const location = useLocation();
  const isProductsPage = location.pathname === "/admin/products";

  return (
    <div className="bg-slate-100 py-4 px-6 mb-6 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/admin/products">
              <Button 
                variant={isProductsPage ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                <span>Product Management</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
