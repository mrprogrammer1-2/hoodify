"use client";

import { useEffect, useState } from "react";
import CartClient from "./CartClientPage";
import { CartSummary } from "./CartSummary";
import { useRouter, useSearchParams } from "next/navigation";
import Shipping from "./Shipping";
import CheckOut from "./CheckOut";

const steps = [
  {
    id: 1,
    step: "Shopping Cart",
  },
  {
    id: 2,
    step: "Shipping Address",
  },
  {
    id: 3,
    step: "Payment Details",
  },
];

type ShippingData = {
  name: string;
  phone: string;
  address: string;
  city: string;
};

function Cart() {
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

  useEffect(() => {
    if (shippingData) {
      console.log("Shipping Data:", shippingData);
    }
  }, [shippingData]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const activeStep = parseInt(searchParams.get("step") || "1");

  return (
    <div className="min-h-dvh w-screen">
      <div className="max-container mt-8">
        <div className="flex my-4 justify-center flex-col md:flex-row gap-4 lg:gap-16">
          {steps.map((item) => (
            <button
              className={`flex justify-betweenitems-center gap-3 max-w-2xs pb-5 border-b-2 ${activeStep === item.id ? "border-black dark:border-white" : "border-gray-600"}`}
              key={item.id}
            >
              <span
                className={`${activeStep === item.id ? "bg-black dark:bg-white dark:text-black" : "bg-gray-200 dark:bg-gray-400"} size-5 text-xs text-white flex justify-center items-center rounded-full`}
              >
                {item.id}
              </span>
              <span
                className={`${activeStep === item.id ? "text-black dark:text-white font-medium" : "text-gray-500"}`}
              >
                {item.step}
              </span>
            </button>
          ))}
        </div>
        {/* content */}
        <div className="flex flex-col md:flex-row gap-12 px-10">
          <div className="flex-2 flex justify-center items-center">
            {activeStep === 1 && <CartClient />}
            {activeStep === 2 && <Shipping setShippingData={setShippingData} />}
            {activeStep === 3 && <CheckOut />}
          </div>
          <div className="flex-1">
            <div className="sticky top-4">
              <CartSummary currentStep={activeStep} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
