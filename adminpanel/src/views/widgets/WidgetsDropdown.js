import React, { useEffect, useState } from "react";
import axios from "axios";
import { CRow, CCol, CWidgetStatsB } from "@coreui/react";

const WidgetsDropdown = () => {
  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [customers, setCustomers] = useState("");
  const [servicesprovider, setServicesProvider] = useState("");
  const [services, setServices] = useState("");
  const [offers, setOffers] = useState("");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/admindashboard/widgetdata`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        // console.log(data.data.widgetsdata, "data");
        setCustomers(data.data.widgetsdata[0]["customers"]);
        setServicesProvider(data.data.widgetsdata[0]["servicesprovider"]);
        setServices(data.data.widgetsdata[0]["services"]);
        setOffers(data.data.widgetsdata[0]["offers"]);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="primary"
          inverse
          title="CUSTOMERS"
          value={customers ? customers : 0}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="info"
          inverse
          title="SERVICES PROVIDER"
          value={servicesprovider ? servicesprovider : 0}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="warning"
          inverse
          title="SERVICES"
          value={services ? services : 0}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsB
          className="mb-3"
          color="danger"
          inverse
          title="OFFERS"
          value={offers ? offers : 0}
        />
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
