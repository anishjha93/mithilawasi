
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-primary-red/5 rounded-2xl ${className}`}></div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-card-bg p-8 rounded-3xl shadow-sm border border-primary-red/5 animate-pulse">
      <div className="h-12 w-12 bg-primary-red/10 rounded-xl mb-6"></div>
      <div className="h-6 w-3/4 bg-primary-red/10 rounded mb-4"></div>
      <div className="h-4 w-full bg-primary-red/5 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-primary-red/5 rounded"></div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-40 bg-primary-red/5 rounded-[40px] animate-pulse"></div>
  );
}
