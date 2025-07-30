import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DataTable from "@/src/components/hasil-input/DataTable";

export default function HasilInputPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <DashboardHeader title="HASIL INPUT" />
        <DataTable />
      </div>
    </DashboardLayout>
  );
}
