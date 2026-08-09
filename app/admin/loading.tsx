export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border gap-4">
        <div className="space-y-2">
          <div className="h-3 bg-surface-secondary rounded w-36" />
          <div className="h-8 bg-surface-secondary rounded w-64" />
        </div>
        <div className="h-9 bg-surface-secondary rounded w-32" />
      </div>

      {/* Grid Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 border border-border bg-surface rounded-[var(--radius-sm)] space-y-3">
            <div className="h-3 bg-surface-secondary rounded w-24" />
            <div className="h-7 bg-surface-secondary rounded w-16" />
          </div>
        ))}
      </div>

      {/* Content Panel Skeleton */}
      <div className="p-6 border border-border bg-surface rounded-[var(--radius-sm)] space-y-4">
        <div className="h-5 bg-surface-secondary rounded w-48" />
        <div className="space-y-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-secondary rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
