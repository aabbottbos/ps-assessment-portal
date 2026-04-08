export function ProductSchoolLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* PS Mark */}
      <div className="h-10 w-10 bg-ps-blue rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-lg">PS</span>
      </div>
      {/* Product School Text */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-tight text-gray-900">
          Product
        </span>
        <span className="text-sm font-semibold leading-tight text-gray-900">
          School
        </span>
      </div>
    </div>
  );
}

export function ProductSchoolIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-ps-blue rounded-lg flex items-center justify-center ${className}`}>
      <span className="text-white font-bold text-lg">PS</span>
    </div>
  );
}
