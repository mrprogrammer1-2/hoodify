import Hero from "@/components/Hero";
import LatestDesign from "@/components/LatestDesign";
import MostRequested from "@/components/MostRequested";
import YouCanCustomize from "@/components/YouCanCustomize";

export default function UserPage() {
  return (
    <main className="w-screen min-h-screen">
      <Hero />
      <LatestDesign />
      <MostRequested />
      <YouCanCustomize />
    </main>
  );
}
