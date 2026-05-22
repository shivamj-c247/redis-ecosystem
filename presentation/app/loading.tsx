export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-redis-ink">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-redis-red/20" />
        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-redis-red" />
      </div>
    </div>
  );
}
