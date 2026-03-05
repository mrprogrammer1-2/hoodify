import DesignCard from "./DesignCard";

export default function MostRequested() {
  return (
    <section className="h-dvh w-full">
      <h1 className="text-center text-5xl my-7 font-semibold">
        Our Most
        <br />
        Requested Designs
      </h1>
      <div className="flex gap-3 items-center justify-center">
        {[1, 2, 3, 4].map((e) => (
          <DesignCard key={e} />
        ))}
      </div>
    </section>
  );
}
