import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LaybyPlanFormProps {
  total: number;
  onSuccess: (planId: string) => void;
  onCancel: () => void;
}

export function LaybyPlanForm({ total, onSuccess, onCancel }: LaybyPlanFormProps) {
  const [frequency, setFrequency] = useState<string>("weekly");
  const [deposit, setDeposit] = useState<string>((total * 0.2).toFixed(2)); // 20% default deposit
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateInstallments = () => {
    const depositAmount = parseFloat(deposit);
    const remaining = total - depositAmount;
    const weeks = frequency === "weekly" ? 8 : frequency === "fortnightly" ? 4 : 2;
    return (remaining / weeks).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const depositAmount = parseFloat(deposit);
      const installmentAmount = parseFloat(calculateInstallments());

      const { data: plan, error } = await supabase
        .from('layby_plans')
        .insert({
          total_amount: total,
          deposit_amount: depositAmount,
          remaining_amount: total - depositAmount,
          installment_frequency: frequency,
          installment_amount: installmentAmount,
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial deposit payment
      const { error: paymentError } = await supabase
        .from('layby_payments')
        .insert({
          layby_plan_id: plan.id,
          amount: depositAmount,
          status: 'pending',
          payment_method: 'card',
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Layby Plan Created",
        description: "Your layby plan has been set up successfully.",
      });

      onSuccess(plan.id);
    } catch (error) {
      console.error('Error creating layby plan:', error);
      toast({
        title: "Error",
        description: "Failed to create layby plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Create Layby Plan</h3>
        
        <div className="space-y-2">
          <Label>Payment Frequency</Label>
          <RadioGroup
            value={frequency}
            onValueChange={setFrequency}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="weekly" id="weekly" className="peer sr-only" />
              <Label
                htmlFor="weekly"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Weekly
              </Label>
            </div>
            <div>
              <RadioGroupItem value="fortnightly" id="fortnightly" className="peer sr-only" />
              <Label
                htmlFor="fortnightly"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Fortnightly
              </Label>
            </div>
            <div>
              <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
              <Label
                htmlFor="monthly"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Monthly
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit">Initial Deposit (min 20%)</Label>
          <Input
            id="deposit"
            type="number"
            value={deposit}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= total * 0.2) {
                setDeposit(e.target.value);
              }
            }}
            min={total * 0.2}
            max={total * 0.8}
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Summary</Label>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Initial Deposit:</span>
              <span>${deposit}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Amount:</span>
              <span>${(total - parseFloat(deposit)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{frequency} Payments:</span>
              <span>${calculateInstallments()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Creating Plan..." : "Create Layby Plan"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}