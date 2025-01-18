import * as z from "zod"

export const addressSchema = z.object({
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code format"),
  country: z.string().min(1, "Country is required"),
  is_default: z.boolean().default(false),
})

export type AddressFormValues = z.infer<typeof addressSchema>