import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// Services
const Services = React.lazy(() => import("./views/services/Services"));
const Addservices = React.lazy(() => import("./views/services/add_services"));

// Sub Services
const Subservices = React.lazy(() => import("./views/subservices/Subservices"));
const Addsubservices = React.lazy(() => import("./views/subservices/add_subservices"));

// All user
const AllUser = React.lazy(() => import("./views/users/all_users"));
const Addusers = React.lazy(() => import("./views/users/add_users"));
const Serviceprovider = React.lazy(() => import("./views/users/view_service_provider"));
const Viewcustomer = React.lazy(() => import("./views/users/view_customer"));
const Changepassword = React.lazy(() => import("./views/users/change_password"));

// Service offers.
const Viewoffers = React.lazy(() => import("./views/offers/view_all_offers"));
const Addoffers = React.lazy(() => import("./views/offers/add_offers"));

// Userrole.
const Viewuserrole = React.lazy(() => import("./views/userrole/view_userrole"));
const Adduserrole = React.lazy(() => import("./views/userrole/add_userrole"));

// Service history.
const Viewservicehistory = React.lazy(() => import("./views/servicehistory/view_all_service_history"));

const routes = [
  // { path: "/", exact: true, name: "Home" },

  // Dashboard url
  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  // Services url
  { path: "/services", name: "Services", element: Services },
  { path: "/addservices", name: "Addservices", element: Addservices },


  // Sub Services url
  { path: "/subservices", name: "Subservices", element: Subservices },
  { path: "/addsubservices", name: "Addsubservices", element: Addsubservices },

  // Users url
  { path: "/users", name: "AllUser", element: AllUser },
  { path: "/addusers", name: "Addusers", element: Addusers },
  { path: "/serviceprovider", name: "Serviceprovider", element: Serviceprovider },
  { path: "/viewcustomer", name: "Viewcustomer", element: Viewcustomer },

  // Service offers.
  { path: "/viewoffers", name: "Viewoffers", element: Viewoffers },
  { path: "/addoffers", name: "Addoffers", element: Addoffers },

  // Userrole.
  { path: "/viewuserrole", name: "Viewuserrole", element: Viewuserrole },
  { path: "/adduserrole", name: "Adduserrole", element: Adduserrole },
  { path: "/changepassword", name: "Changepassword", element: Changepassword },

  // Userrole.
  { path: "/servicehistory", name: "Viewservicehistory", element: Viewservicehistory },
];

export default routes;
