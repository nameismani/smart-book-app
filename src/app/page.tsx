import { PageLoader } from "@/components/common";
import { HomeMainContainer } from "@/components/main/Home";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeMainContainer />
    </Suspense>
  );
};

export default HomePage;
