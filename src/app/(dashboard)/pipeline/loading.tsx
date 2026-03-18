import { Skeleton } from "@/components/ui/skeleton";

export default function PipelineLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex flex-1 gap-4 overflow-x-auto p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/50 p-3">
            <Skeleton className="mb-3 h-5 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-20 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
