import { ScrollText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

const Terms = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <ScrollText className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing our website, you agree to be bound by these Terms and Conditions and all
              applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on Nike Store's
              website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2>Disclaimer</h2>
            <p>
              The materials on Nike Store's website are provided on an 'as is' basis. Nike Store makes
              no warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2>Limitations</h2>
            <p>
              In no event shall Nike Store or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use the materials on Nike Store's website.
            </p>
          </section>

          <section className="mb-8">
            <h2>Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of
              [Your Country] and you irrevocably submit to the exclusive jurisdiction of the courts
              in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2>Changes to Terms</h2>
            <p>
              Nike Store may revise these terms of service for its website at any time without
              notice. By using this website you are agreeing to be bound by the then current version
              of these terms of service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Terms;