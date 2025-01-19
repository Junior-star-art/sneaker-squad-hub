import { Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

const Sustainability = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Our Commitment to Sustainability</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Moving to Zero</h2>
              <p className="text-gray-600 mb-4">
                Nike's journey toward zero carbon and zero waste...
              </p>
              <img 
                src="https://images.unsplash.com/photo-1504893524553-b855bce32c67" 
                alt="Sustainability initiative" 
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Sustainable Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151" 
                    alt="Sustainable materials" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-medium mb-2">Recycled Materials</h3>
                  <p className="text-gray-600">Our products incorporate recycled materials...</p>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1426604966848-d7adac402bff" 
                    alt="Eco-friendly packaging" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-medium mb-2">Eco-friendly Packaging</h3>
                  <p className="text-gray-600">Reducing waste through innovative packaging...</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Impact by Numbers</h3>
              <ul className="space-y-4">
                <li>
                  <span className="block text-2xl font-bold">75%</span>
                  <span className="text-gray-600">Recycled materials in our products</span>
                </li>
                <li>
                  <span className="block text-2xl font-bold">100%</span>
                  <span className="text-gray-600">Renewable energy in facilities</span>
                </li>
                <li>
                  <span className="block text-2xl font-bold">50M</span>
                  <span className="text-gray-600">Plastic bottles recycled yearly</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Join the Movement</h3>
              <p className="mb-4">Learn how you can contribute to a sustainable future.</p>
              <button className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100">
                Learn More
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Sustainability;