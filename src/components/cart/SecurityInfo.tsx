import { Shield, Lock, CreditCard } from "lucide-react";

export const SecurityInfo = () => {
  return (
    <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-lg flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Payment Security
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium">SSL Encryption</h4>
            <p className="text-sm text-gray-600">Your data is protected with 256-bit SSL encryption</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium">Secure Payments</h4>
            <p className="text-sm text-gray-600">Your payment is processed securely by PayFast</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium">Buyer Protection</h4>
            <p className="text-sm text-gray-600">Your transaction is protected by our security measures</p>
          </div>
        </div>
      </div>
    </div>
  );
};