import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ReturnPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Return Policy</h2>
      
      <div className="prose prose-slate">
        <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a simple returns process:</p>
        
        <h3 className="text-lg font-semibold mt-4">Return Window</h3>
        <p>You have 30 days from the date of delivery to return your items.</p>
        
        <h3 className="text-lg font-semibold mt-4">Conditions</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items must be unworn and in original condition</li>
          <li>All original tags must be attached</li>
          <li>Original packaging must be included</li>
          <li>Items must be free from wear, tear, or damage</li>
        </ul>
        
        <h3 className="text-lg font-semibold mt-4">How to Return</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Log into your account</li>
          <li>Go to your orders</li>
          <li>Select the item(s) you wish to return</li>
          <li>Follow the return instructions</li>
        </ol>
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button onClick={() => navigate("/support")}>Contact Support</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
};

export default ReturnPolicy;