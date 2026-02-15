import { DashboardMainContainer } from "@/components/main/Dashboard";
import { Suspense } from "react";
import { PageLoader } from "@/components/common";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardMainContainer />
    </Suspense>
  );
};

export default Dashboard;
