export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-50">
      <div className="relative">
        {/* Fast spinning outer ring */}
        <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>

        {/* Slow spinning inner ring */}
        <div 
          className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full" 
          style={{ animation: 'spin 3s linear infinite' }}
        ></div>
      </div>
    </div>
  );
}
