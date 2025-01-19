import { CreditCard, Lock, ShieldCheck } from "lucide-react";

export const PaymentMethodIcons = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-4">
          <Lock className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-medium">Secure Checkout</h4>
            <p className="text-sm text-gray-500">Your payment is protected</p>
          </div>
        </div>
        <ShieldCheck className="w-6 h-6 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Accepted Payment Methods</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2 p-2 border rounded">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Credit Card</span>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded">
            <img src="/visa.png" alt="Visa" className="w-4 h-4" />
            <span className="text-sm">Visa</span>
          </div>
          <div className="flex items-center space-x-2 p-2 border rounded">
            <img src="/mastercard.png" alt="Mastercard" className="w-4 h-4" />
            <span className="text-sm">Mastercard</span>
          </div>
        </div>
      </div>
    </div>
  );
};