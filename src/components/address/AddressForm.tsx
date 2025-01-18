import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema, type AddressFormValues } from "@/lib/validations/address"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface AddressFormProps {
  onSuccess?: () => void
  defaultValues?: Partial<AddressFormValues>
  addressId?: string
}

export function AddressForm({ onSuccess, defaultValues, addressId }: AddressFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
      ...defaultValues,
    },
  })

  async function onSubmit(data: AddressFormValues) {
    try {
      if (!user) throw new Error("User not authenticated")

      if (addressId) {
        const { error } = await supabase
          .from("user_addresses")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", addressId)

        if (error) throw error
        
        toast({
          title: "Address updated",
          description: "Your address has been successfully updated.",
        })
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert({
            ...data,
            user_id: user.id,
          })

        if (error) throw error

        toast({
          title: "Address added",
          description: "Your new address has been successfully added.",
        })
      }

      if (data.is_default) {
        // Update other addresses to not be default
        const { error } = await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .neq("id", addressId || "")
          .eq("user_id", user.id)

        if (error) throw error
      }

      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address_line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set as default address</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {addressId ? "Update Address" : "Add Address"}
        </Button>
      </form>
    </Form>
  )
}