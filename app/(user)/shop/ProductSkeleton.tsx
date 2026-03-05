import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProductSkeleton() {
  const skeletons = Array.from({ length: 6 });
  return (
    <div className="max-container grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletons.map((_, index) => (
        <Card
          key={index}
          className="max-w-sm w-full bg-gray-300 dark:bg-black/5"
        >
          <CardHeader className="flex flex-row items-center justify-between space-x-4 space-y-0">
            <Skeleton className="aspect-square w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
