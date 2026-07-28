import {
  DashboardAttentionList,
  DashboardOverview,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
      <DashboardOverview />
      <DashboardAttentionList />
    </div>
  );
}
