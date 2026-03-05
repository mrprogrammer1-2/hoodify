import Link from "next/link";
import DesignCard from "./DesignCard";
import { Button } from "./ui/button";

export default function LatestDesign() {
  return (
    <section className="h-dvh w-full">
      <h1 className="text-center text-5xl my-7 font-semibold">
        Our Latest Designs
      </h1>
      <div className="flex gap-3 items-center justify-center">
        {[1, 2, 3, 4].map((e) => (
          <DesignCard key={e} />
        ))}
      </div>
      <div className="text-center mt-5">
        <Button asChild className="uppercase px-9 py-4 cursor-pointer">
          <Link href="/shop">see more</Link>
        </Button>
      </div>
    </section>
  );
}
