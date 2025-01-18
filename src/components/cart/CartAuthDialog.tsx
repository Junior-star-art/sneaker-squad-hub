import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: () => void;
}

export function CartAuthDialog({ open, onOpenChange, onAuthSuccess }: CartAuthDialogProps) {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You've successfully signed in. Proceeding with checkout...",
        });
        onAuthSuccess();
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to continue checkout</DialogTitle>
        </DialogHeader>
        <div className="px-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}