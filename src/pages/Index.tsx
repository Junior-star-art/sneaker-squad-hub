
import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <AdminNav />
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold">Welcome to the Store</h1>
        <p className="mt-4">This is the home page of your e-commerce application.</p>
      </div>
    </div>
  );
};

export default Index;
