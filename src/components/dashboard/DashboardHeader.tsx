"use client";

export interface DashboardHeaderProps {
  title: string;
  className?: string;
  stations?: string[];
  selectedStation?: string;
  onStationChange?: (station: string) => void;
}

export default function DashboardHeader({
  title,
  className,
  stations = [],
  selectedStation = "all",
  onStationChange,
}: DashboardHeaderProps) {
  return (
    <div
      className={`mb-6 lg:mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${className}`}
    >
      <h1
        className="text-2xl lg:text-4xl font-bold text-sky-500 tracking-wide drop-shadow-md"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
      >
        {title}
      </h1>
      <select
        className="text-sm border rounded px-2 py-1 shadow-sm"
        value={selectedStation}
        onChange={(e) => onStationChange?.(e.target.value)}
      >
        <option value="all">Semua Stasiun</option>
        {stations.map((station) => (
          <option key={station} value={station}>
            {station}
          </option>
        ))}
      </select>
    </div>
  );
}
