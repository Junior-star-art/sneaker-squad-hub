import { Button } from "@/components/ui/button";

type CheckoutFormProps = {
  onBack: () => void;
};

const CheckoutForm = ({ onBack }: CheckoutFormProps) => (
  <form className="space-y-4">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        id="email"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      />
    </div>
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
        Shipping Address
      </label>
      <textarea
        id="address"
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      />
    </div>
    <Button className="w-full" onClick={() => alert("Checkout functionality coming soon!")}>
      Place Order
    </Button>
    <Button variant="outline" className="w-full" onClick={onBack}>
      Back to Cart
    </Button>
  </form>
);

export default CheckoutForm;