import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
    toast({
      title: "Preferences saved",
      description: "Your cookie preferences have been saved.",
    });
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowConsent(false);
    toast({
      title: "Preferences saved",
      description: "You have chosen to decline cookies. Some features may be limited.",
    });
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p>
              We use cookies to enhance your experience. By continuing to visit this site you agree to
              our use of cookies.{" "}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button onClick={handleAccept}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;