import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingForm() {
  return (
    <div className="container">
      <Skeleton className="max-w-xl mx-auto" />
    </div>
  );
}
