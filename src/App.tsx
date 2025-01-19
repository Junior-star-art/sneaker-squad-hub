import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import { ProfileManagement } from "@/components/profile/ProfileManagement";
import Index from "@/pages/Index";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Routes>
            <Toaster />
          </RecentlyViewedProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;