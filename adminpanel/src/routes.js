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

];

export default routes;
