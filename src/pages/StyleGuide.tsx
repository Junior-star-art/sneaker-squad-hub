import { Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import SizeGuide from "@/components/SizeGuide";

const StyleGuide = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Palette className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Style Guide</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">How to Style Your Nike</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1527576539890-dfa815648363" 
                  alt="Style example" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-xl font-medium">Casual Wear</h3>
                <p className="text-gray-600">Mix and match your Nike sneakers with everyday outfits...</p>
              </div>
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                  alt="Style example" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-xl font-medium">Athletic Style</h3>
                <p className="text-gray-600">Perfect your workout look with these style tips...</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Size & Fit Guide</h2>
            <div className="space-y-6">
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-black rounded-md hover:bg-gray-800"
              >
                View Size Chart
              </button>
              <div className="prose max-w-none">
                <h3>How to Measure</h3>
                <p>For the best fit, measure your feet at the end of the day...</p>
                <h3>Finding Your Perfect Fit</h3>
                <p>Your running shoes might fit differently than your casual shoes...</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <SizeGuide open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
};

export default StyleGuide;