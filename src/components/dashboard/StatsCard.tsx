import { cn } from "@/src/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  variant?: "warning" | "primary" | "info";
  className?: string;
}

const variantStyles = {
  warning: "bg-gradient-to-br from-yellow-400 to-orange-500 text-white",
  primary: "bg-gradient-to-br from-blue-800 to-blue-900 text-white",
  info: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
};

export default function StatsCard({
  title,
  value,
  variant = "primary",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 lg:p-6 shadow-lg transition-transform duration-200 hover:scale-105",
        variantStyles[variant],
        className
      )}
    >
      <div className="text-center">
        <h3 className="text-xs lg:text-sm font-medium opacity-90 mb-2">
          {title}
        </h3>
        <p className="text-2xl lg:text-4xl font-bold">{value}</p>
      </div>
    </div>
  );
}
