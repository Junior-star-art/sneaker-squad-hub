import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactForm } from "@/components/support/ContactForm";
import FAQSection from "@/components/support/FAQSection";
import ReturnPolicy from "@/components/support/ReturnPolicy";
import LiveChat from "@/components/support/LiveChat";

export const SupportHub = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Support & Help Center</h2>
      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Customer Support</h3>
            <ContactForm />
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <FAQSection />
        </TabsContent>

        <TabsContent value="returns">
          <ReturnPolicy />
        </TabsContent>
      </Tabs>

      <LiveChat />
    </div>
  );
};