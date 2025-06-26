export default function SkeletonSection({ rows = 3 }) {
  return (
    <section className="mb-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-white rounded shadow-sm">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
