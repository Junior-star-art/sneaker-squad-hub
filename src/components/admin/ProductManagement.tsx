
import { useEffect } from "react";
import { ProductList } from "./product/ProductList";
import { ProductActions } from "./product/ProductActions";

export function ProductManagement() {
  console.log("ProductManagement component rendering");
  
  useEffect(() => {
    console.log("ProductManagement component mounted");
    return () => console.log("ProductManagement component unmounted");
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <ProductActions />
      </div>
      
      <ProductList />
    </div>
  );
}
