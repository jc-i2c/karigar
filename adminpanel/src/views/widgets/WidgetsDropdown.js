import React, { useEffect, useState } from "react";
import axios from "axios";
import { CRow, CCol, CWidgetStatsB } from "@coreui/react";
import { useNavigate } from "react-router-dom";

const WidgetsDropdown = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");
  const [customers, setCustomers] = useState("");
  const [users, setUsers] = useState("");
  const [servicesprovider, setServicesProvider] = useState("");
  const [services, setServices] = useState("");
  const [offers, setOffers] = useState("");

  const [roleName, setRoleName] = useState("");

  // Identify user type.
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (roleName === "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/admindashboard/widgetdata`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.widgetsdata) {
            setUsers(data.data.widgetsdata[0]["users"]);
            setServicesProvider(data.data.widgetsdata[0]["servicesprovider"]);
            setServices(data.data.widgetsdata[0]["services"]);
            setOffers(data.data.widgetsdata[0]["offers"]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [roleName]);

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="primary"
          inverse
          title="Users"
          value={users ? users : 0}
          onClick={() => {
            navigate("/users");
          }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="info"
          inverse
          title="SERVICES"
          value={services ? services : 0}
          onClick={() => {
            navigate("/services");
          }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="warning"
          inverse
          title="SERVICES PROVIDER"
          value={servicesprovider ? servicesprovider : 0}
          onClick={() => {
            navigate("/serviceprovider");
          }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="danger"
          inverse
          title="OFFERS"
          value={offers ? offers : 0}
          onClick={() => {
            navigate("/offers");
          }}
        />
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
