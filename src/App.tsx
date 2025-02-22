
import React, { useEffect } from "react";
import { initializeAnalytics } from "./utils/analytics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import { ProfileManagement } from "@/components/profile/ProfileManagement";
import { SupportHub } from "@/components/support/SupportHub";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import OrderDetails from "@/pages/OrderDetails";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import ProductManagement from "@/pages/ProductManagement";
import ErrorBoundary from "@/components/ErrorBoundary";

const App: React.FC = () => {
  useEffect(() => {
    initializeAnalytics('G-XXXXXXXXXX');
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfileManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/product-management"
                      element={
                        <ProtectedRoute>
                          <ProductManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route
                      path="/orders/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/support"
                      element={
                        <ProtectedRoute>
                          <SupportHub />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <BackToTop />
                  <CookieConsent />
                  <Toaster />
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
