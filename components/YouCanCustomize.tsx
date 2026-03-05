import React from "react";
import { Button } from "./ui/button";

export default function YouCanCustomize() {
  return (
    <section className="h-[50vh] w-full bg-amber-200 px-16 py-12">
      <div>
        <div className="ml-auto max-w-[30rem] text-left">
          <h1 className="text-5xl mb-5">you can customize you own hoodie</h1>
          <p className="text-xl">
            choose you size , color ans add the design you want.
          </p>
        </div>
        <div className=" max-w-[30rem] ml-auto grid place-content-center text-right mt-7">
          <Button className="uppercase px-9 py-4 cursor-pointer">
            customize
          </Button>
        </div>
      </div>
    </section>
  );
}
