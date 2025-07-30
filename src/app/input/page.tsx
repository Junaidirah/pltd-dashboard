import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import InputForm from "@/src/components/input/InputForm";

export default function InputPage() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <DashboardHeader title="INPUT DATA" />
        <InputForm />
      </div>
    </DashboardLayout>
  );
}
