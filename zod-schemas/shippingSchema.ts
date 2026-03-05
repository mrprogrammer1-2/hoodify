import { z } from "zod";
export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(
      /^01\d{9}$/,
      "Invalid phone number format. Must be 11 digits starting with 01",
    ),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export type ShippingFormSchemaInputs = z.infer<typeof shippingFormSchema>;
