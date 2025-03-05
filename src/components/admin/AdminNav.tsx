
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const AdminNav = () => {
  return (
    <div className="bg-slate-100 py-2 px-4 text-center">
      <Link to="/admin/products">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>Product Management</span>
        </Button>
      </Link>
    </div>
  );
};
