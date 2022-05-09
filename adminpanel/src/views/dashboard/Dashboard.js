import React from "react";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import HomeBanner from "../home_banner/View_home_banner";
import ViewCustomer from "../users/view_customer";

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown />
      <HomeBanner />
      <ViewCustomer />
    </>
  );
};

export default Dashboard;
