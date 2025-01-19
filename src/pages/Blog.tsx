import { BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

const Blog = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Nike News & Stories</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="col-span-full lg:col-span-2 relative">
            <img 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
              alt="Featured article" 
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
              <span className="text-sm font-medium bg-nike-red px-2 py-1 rounded">Featured</span>
              <h2 className="text-2xl font-bold mt-2">The Future of Sustainable Athletics</h2>
              <p className="mt-2">Discover how Nike is revolutionizing sustainable sportswear...</p>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="space-y-8">
            <article className="space-y-3">
              <img 
                src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21" 
                alt="Article thumbnail" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="font-bold">New Collection Launch: Summer 2024</h3>
              <p className="text-gray-600">Get ready for summer with our latest collection...</p>
            </article>
            <article className="space-y-3">
              <img 
                src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed" 
                alt="Article thumbnail" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="font-bold">Athletes Share Their Success Stories</h3>
              <p className="text-gray-600">Inspiring stories from athletes around the world...</p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Blog;