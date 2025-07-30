import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <DashboardHeader title="HISTORY" />
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          <p className="text-gray-600 text-center text-sm lg:text-base">
            Halaman History sedang dalam pengembangan
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
