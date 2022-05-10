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
const Profile = React.lazy(() => import("./views/users/profile"));

// Service offers.
const Viewoffers = React.lazy(() => import("./views/offers/view_all_offers"));
const Addoffers = React.lazy(() => import("./views/offers/add_offers"));

// Userrole.
const Viewuserrole = React.lazy(() => import("./views/userrole/view_userrole"));
const Adduserrole = React.lazy(() => import("./views/userrole/add_userrole"));

// Service history.
const Viewservicehistory = React.lazy(() => import("./views/servicehistory/view_all_service_history"));

// Service history.
const Addbanner = React.lazy(() => import("./views/home_banner/Add_home_banner"));

// Privacy policy
const Privacypolicy = React.lazy(() => import("./views/privacypolicy/privacypolicy"));

// Customer Support
const Viewcustomersupport = React.lazy(() => import("./views/customersupport/View_customer_support"));
const Addtitle = React.lazy(() => import("./views/customersupport/add_title"));

// Customer Support Sub Title
const Viewsubtitle = React.lazy(() => import("./views/customersupportsubtitle/viewsubtitle"));
const Addsubtitle = React.lazy(() => import("./views/customersupportsubtitle/add_sub_title"));

// Service Rating
const Viewservicerating = React.lazy(() => import("./views/servicerating/view_service_rating"));

// System Modules
const Viewsystemmodules = React.lazy(() => import("./views/systemmodules/viewsystemmodules"));
const Addsystemmodules = React.lazy(() => import("./views/systemmodules/add_systemmodules"));

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
  { path: "/profile", name: "Profile", element: Profile },

  // Service offers.
  { path: "/viewoffers", name: "Viewoffers", element: Viewoffers },
  { path: "/addoffers", name: "Addoffers", element: Addoffers },

  // Userrole.
  { path: "/viewuserrole", name: "Viewuserrole", element: Viewuserrole },
  { path: "/adduserrole", name: "Adduserrole", element: Adduserrole },
  { path: "/changepassword", name: "Changepassword", element: Changepassword },

  // Service history.
  { path: "/servicehistory", name: "Viewservicehistory", element: Viewservicehistory },

  // Home Banner
  { path: "/addbanner", name: "Addbanner", element: Addbanner },

  // Privacy policy
  { path: "/privacypolicy", name: "Privacypolicy", element: Privacypolicy },

  // Customer Support
  { path: "/viewcustomersupport", name: "Viewcustomersupport", element: Viewcustomersupport },
  { path: "/addtitle", name: "Addtitle", element: Addtitle },

  // Customer Support Sub Title
  { path: "/viewsubtitle", name: "Viewsubtitle", element: Viewsubtitle },
  { path: "/addsubtitle", name: "Addsubtitle", element: Addsubtitle },

  // Service Rating
  { path: "/viewservicerating", name: "Viewservicerating", element: Viewservicerating },

  // System Modules
  { path: "/viewsystemmodules", name: "Viewsystemmodules", element: Viewsystemmodules },
  { path: "/addsystemmodules", name: "Addsystemmodules", element: Addsystemmodules },
];

export default routes;
