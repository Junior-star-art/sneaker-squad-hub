import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import { Index } from "@/pages";
import { ProductDetail } from "@/pages/products/[slug]";
import { Wishlist as WishlistPage } from "@/pages/wishlist";
import { Blog } from "@/pages/blog";
import { Terms } from "@/pages/terms";
import { PrivacyPolicy } from "@/pages/privacy";
import { Sustainability } from "@/pages/sustainability";
import { OrderHistory } from "@/pages/orders";
import { OrderDetails } from "@/pages/orders/[id]";
import { ProductManagement } from "@/pages/admin/products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BackToTop } from "@/components/BackToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import OrderSuccess from "./pages/OrderSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="theme-mode">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <ErrorBoundary>
                  <Router>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/products/:slug" element={<ProductDetail />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
