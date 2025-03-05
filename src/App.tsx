
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import BackToTop from "./components/BackToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import ErrorBoundary from "./components/ErrorBoundary";

import OrderSuccess from "./pages/OrderSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import { ProductManagement } from "./components/admin/ProductManagement";
import Index from "./pages/Index";

// Placeholder components for missing imports
const ProductDetail = () => <div>Product Detail Page</div>;
const Wishlist = () => <div>Wishlist Page</div>;
const Blog = () => <div>Blog Page</div>;
const Terms = () => <div>Terms Page</div>;
const PrivacyPolicy = () => <div>Privacy Policy Page</div>;
const Sustainability = () => <div>Sustainability Page</div>;
const OrderHistory = () => <div>Order History Page</div>;
const OrderDetails = () => <div>Order Details Page</div>;

function App() {
  const queryClient = new QueryClient();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <ErrorBoundary>
                <Router>
                  <div className="min-h-screen flex flex-col">
                    <Navbar onCartClick={handleCartClick} />
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/products/:slug" element={<ProductDetail />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/sustainability" element={<Sustainability />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                        <Route path="/admin/products" element={<ProductManagement />} />
                      </Routes>
                    </div>
                    <Footer />
                    <CookieConsent />
                    <Toaster />
                    <BackToTop />
                  </div>
                </Router>
              </ErrorBoundary>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
