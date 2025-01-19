import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailHistory } from "@/components/notifications/EmailHistory";
import { ContactForm } from "@/components/support/ContactForm";

export const SupportHub = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Support & Notifications</h2>
      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="notifications">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Customer Support</h3>
            <ContactForm />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <EmailHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};