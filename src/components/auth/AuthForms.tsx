import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function AuthForms() {
  const { toast } = useToast();
  const { loading, error } = useAuth();

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 p-6">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
          alt="Nike"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg"
          alt="Jordan"
          className="h-6"
        />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">
        Join Nike Member Profile
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#000000',
                brandAccent: '#666666',
              },
            },
          },
          className: {
            button: 'rounded-full w-full',
            container: 'space-y-4',
            label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          },
        }}
        providers={['google', 'github']}
        redirectTo={window.location.origin}
        onlyThirdPartyProviders={false}
      />

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          By logging in, you agree to Nike's Privacy Policy and Terms of Use.
        </p>
      </div>
    </div>
  );
}