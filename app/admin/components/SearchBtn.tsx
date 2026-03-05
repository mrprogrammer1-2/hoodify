"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle, Search } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SearchBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 px-6 shadow-sm">
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Search className="h-4 w-4 mr-2" />
          Search
        </>
      )}
    </Button>
  );
}
