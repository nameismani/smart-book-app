import { HomeMainContainer } from "@/components/main/Home";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <Suspense>
      <HomeMainContainer />
    </Suspense>
  );
};

export default HomePage;
