import Form from "next/form";
import { Input } from "@/components/ui/input";
import SearchBtn from "./SearchBtn";
import { Search } from "lucide-react";

export default function SearchBar({
  action,
  userId,
  defaultSearch,
}: {
  action: string;
  userId?: string;
  defaultSearch?: string;
}) {
  return (
    <Form action={action} className="flex gap-3 items-center max-w-2xl">
      {userId && <input type="hidden" name="userId" value={userId} />}

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="search"
          type="text"
          defaultValue={defaultSearch ?? ""}
          placeholder="Search..."
          className="pl-10 h-11 bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-ring transition-all"
        />
      </div>

      <SearchBtn />
    </Form>
  );
}
