import { Shield, Lock, CreditCard, CheckCircle2, BadgeCheck, ShieldCheck } from "lucide-react";

export const SecurityInfo = () => {
  return (
    <div className="space-y-6 mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-600" />
          <h3 className="font-medium text-lg">Secure Payment & Protection</h3>
        </div>
        <BadgeCheck className="w-6 h-6 text-green-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">256-bit SSL Encryption</h4>
              <p className="text-sm text-gray-600">Your data is protected with bank-level security encryption</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600">Verified & Secure</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Secure Payment Processing</h4>
              <p className="text-sm text-gray-600">Payments are securely processed by PayFast</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                  PCI DSS Level 1 Compliant
                </li>
                <li className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                  3D Secure Authentication
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Buyer Protection</h4>
              <p className="text-sm text-gray-600">Shop with confidence with our comprehensive protection</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                  Secure Transaction Guarantee
                </li>
                <li className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                  Fraud Prevention Systems
                </li>
                <li className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-3 h-3 text-green-600 mr-1" />
                  24/7 Transaction Monitoring
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Trusted & Verified Merchant</span>
            </div>
            <p className="text-xs text-green-600 mt-1">All transactions are protected by our secure payment system</p>
          </div>
        </div>
      </div>
    </div>
  );
};