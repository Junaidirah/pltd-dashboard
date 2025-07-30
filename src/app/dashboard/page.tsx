import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import StatsCard from "@/src/components/dashboard/StatsCard";
import Chart from "@/src/components/dashboard/Chart";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <DashboardHeader title="PLTD KOTARAYA" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatsCard title="Total Beban" value="0" variant="warning" />
          <StatsCard title="DM" value="500" variant="primary" />
          <StatsCard title="Surplus" value="500" variant="info" />
        </div>

        {/* Chart Section */}
        <Chart className="mb-6 lg:mb-8" />
      </div>
    </DashboardLayout>
  );
}
