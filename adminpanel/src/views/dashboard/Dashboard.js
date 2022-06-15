import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import HomeBanner from "../home_banner/View_home_banner";
import ViewCustomer from "../users/view_customer";

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [roleName, setRoleName] = useState("");

  // Identify user type.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        setRoleName(data.data.data.roletag);
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;

    if (roleName == "ADMIN") {
      navigate("/dashboard");
    }

    if (roleName == "SERVICEPROVIDER") {
      navigate("/services");
    }

    return () => {
      unmounted = true;
    };
  }, [roleName]);

  return (
    <>
      <WidgetsDropdown />
      <HomeBanner />
      <ViewCustomer />
    </>
  );
};

export default Dashboard;
