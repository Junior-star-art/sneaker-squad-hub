import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { initiatePayFastPayment } from "@/utils/payfast";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type CheckoutFormProps = {
  onBack: () => void;
};

const CheckoutForm = ({ onBack }: CheckoutFormProps) => {
  const { items, total } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!import.meta.env.VITE_PAYFAST_MERCHANT_ID || !import.meta.env.VITE_PAYFAST_MERCHANT_KEY) {
      toast({
        title: "Configuration Error",
        description: "Payment system is not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total amount from cart items
    const totalAmount = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return sum + (price * item.quantity);
    }, 0);

    // Create item name from cart items
    const itemName = items.length === 1 
      ? items[0].name 
      : `${items[0].name} and ${items.length - 1} other items`;

    try {
      initiatePayFastPayment({
        amount: totalAmount,
        customerName: name,
        customerEmail: email,
        itemName: itemName,
      });
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "There was an error initiating the payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total to Pay:</span>
          <span className="font-medium">{total}</span>
        </div>
        <Button type="submit" className="w-full">
          Pay with PayFast
        </Button>
        <Button variant="outline" className="w-full mt-2" onClick={onBack}>
          Back to Cart
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;