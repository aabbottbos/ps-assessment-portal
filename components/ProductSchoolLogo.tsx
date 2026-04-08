import Image from "next/image";

export function ProductSchoolLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/ps-logo.svg"
      alt="Product School"
      className={`h-7 w-auto ${className}`}
      style={{
        filter: 'brightness(0) saturate(100%) invert(14%) sepia(60%) saturate(900%) hue-rotate(205deg) brightness(80%) contrast(115%)'
      }}
    />
  );
}

export function ProductSchoolIcon({ className = "" }: { className?: string }) {
  return (
    <img
      src="/ps-logo.svg"
      alt="Product School"
      className={className}
      style={{
        filter: 'brightness(0) saturate(100%) invert(14%) sepia(60%) saturate(900%) hue-rotate(205deg) brightness(80%) contrast(115%)'
      }}
    />
  );
}
