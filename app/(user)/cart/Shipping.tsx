import { useForm } from "react-hook-form";
import type { ShippingFormSchemaInputs } from "@/zod-schemas/shippingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema } from "@/zod-schemas/shippingSchema";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputWithLabel from "@/components/inputs/InputWithLabel";

export default function Shipping({
  setShippingData,
}: {
  setShippingData: (data: ShippingFormSchemaInputs) => void;
}) {
  const router = useRouter();

  // const {
  //   register,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm<ShippingFormSchemaInputs>({
  //   resolver: zodResolver(shippingFormSchema),
  // });

  const form = useForm<ShippingFormSchemaInputs>({
    resolver: zodResolver(shippingFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
    },
  });

  const handleShippingFormSubmit = (data: ShippingFormSchemaInputs) => {
    // if (data) {
    //   setShippingData(data);
    //   router.push("/cart?step=3");
    // }
    setShippingData(data);
    router.push("/cart?step=3", { scroll: false });
  };
  return (
    // <form
    //   className="flex flex-col gap-4"
    //   onSubmit={handleSubmit(handleShippingFormSubmit)}
    // >
    //   <div className="flex flex-col gap-1">
    //     <label htmlFor="name" className="text-xs text-gray-500 font-medium">
    //       Name
    //     </label>
    //     <input
    //       type="text"
    //       id="name"
    //       placeholder="John Doe"
    //       className="border-b border-gray-200 outline-none text-sm"
    //       {...register("name")}
    //     />
    //     {errors.name && (
    //       <p className="text-xs text-red-500">{errors.name.message}</p>
    //     )}
    //   </div>
    //   <div className="flex flex-col gap-1">
    //     <label htmlFor="phone" className="text-xs text-gray-500 font-medium">
    //       Phone
    //     </label>
    //     <input
    //       type="text"
    //       id="phone"
    //       className="border-b border-gray-200 outline-none text-sm"
    //       placeholder="01234567890"
    //       {...register("phone")}
    //     />
    //     {errors.phone && (
    //       <p className="text-xs text-red-500">{errors.phone.message}</p>
    //     )}
    //   </div>
    //   <div className="flex flex-col gap-1">
    //     <label htmlFor="address" className="text-xs text-gray-500 font-medium">
    //       Address
    //     </label>
    //     <input
    //       type="text"
    //       id="address"
    //       className="border-b border-gray-200 outline-none text-sm"
    //       placeholder="123 Main Street"
    //       {...register("address")}
    //     />
    //     {errors.address && (
    //       <p className="text-xs text-red-500">{errors.address.message}</p>
    //     )}
    //   </div>
    //   <div className="flex flex-col gap-1">
    //     <label htmlFor="city" className="text-xs text-gray-500 font-medium">
    //       City
    //     </label>
    //     <input
    //       type="text"
    //       id="city"
    //       className="border-b border-gray-200 outline-none text-sm"
    //       placeholder="New York"
    //       {...register("city")}
    //     />
    //     {errors.city && (
    //       <p className="text-xs text-red-500">{errors.city.message}</p>
    //     )}
    //   </div>
    //   <Button
    //     type="submit"
    //     onClick={() => router.push("/cart?step=3", { scroll: false })}
    //   >
    //     Continue
    //   </Button>
    // </form>
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4 md:gap-8 "
        onSubmit={form.handleSubmit(handleShippingFormSubmit)}
      >
        <div className="flex flex-col gap-4 w-full">
          <InputWithLabel name="name" label="Name" placeholder="John Doe" />
          <InputWithLabel
            name="phone"
            label="Phone"
            placeholder="01234567890"
          />
          <InputWithLabel
            name="address"
            label="Address"
            placeholder="123 Main Street"
          />
          <InputWithLabel name="city" label="City" placeholder="New York" />
        </div>
        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
}
