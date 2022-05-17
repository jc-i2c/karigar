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
const Offers = React.lazy(() => import("./views/offers/view_all_offers"));
const Addoffers = React.lazy(() => import("./views/offers/add_offers"));

// User role.
const Userrole = React.lazy(() => import("./views/userrole/view_userrole"));
const Adduserrole = React.lazy(() => import("./views/userrole/add_userrole"));

// Service history.
const Servicehistory = React.lazy(() => import("./views/servicehistory/view_all_service_history"));

// Service history.
const Addbanner = React.lazy(() => import("./views/home_banner/Add_home_banner"));

// Privacy policy
const Privacypolicy = React.lazy(() => import("./views/privacypolicy/privacypolicy"));

// Customer Support
const Customersupport = React.lazy(() => import("./views/customersupport/View_customer_support"));
const Addtitle = React.lazy(() => import("./views/customersupport/add_title"));

// Customer Support Sub Title
const Subtitle = React.lazy(() => import("./views/customersupportsubtitle/viewsubtitle"));
const Addsubtitle = React.lazy(() => import("./views/customersupportsubtitle/add_sub_title"));

// Service Rating
const Servicerating = React.lazy(() => import("./views/servicerating/view_service_rating"));

// System Modules
const Systemmodules = React.lazy(() => import("./views/systemmodules/viewsystemmodules"));
const Addsystemmodules = React.lazy(() => import("./views/systemmodules/add_systemmodules"));

// Service Provider
const Providerlist = React.lazy(() => import("./views/serviceprovider/viewserviceprovider"));
const Addserviceprovider = React.lazy(() => import("./views/serviceprovider/addserviceprovider"));

// Chat
const Customerchat = React.lazy(() => import("./views/chats/view_customers"));

let routes = [];
routes = [
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
  { path: "/offers", name: "Offers", element: Offers },
  { path: "/addoffers", name: "Addoffers", element: Addoffers },

  // User role.
  { path: "/userrole", name: "Userrole", element: Userrole },
  { path: "/adduserrole", name: "Adduserrole", element: Adduserrole },
  { path: "/changepassword", name: "Changepassword", element: Changepassword },

  // Service history.
  { path: "/servicehistory", name: "Servicehistory", element: Servicehistory },

  // Home Banner
  { path: "/addbanner", name: "Addbanner", element: Addbanner },

  // Privacy policy
  { path: "/privacypolicy", name: "Privacypolicy", element: Privacypolicy },

  // Customer Support
  { path: "/customersupport", name: "Customersupport", element: Customersupport },
  { path: "/addtitle", name: "Addtitle", element: Addtitle },

  // Customer Support Sub Title
  { path: "/viewsubtitle", name: "Subtitle", element: Subtitle },
  { path: "/addsubtitle", name: "Addsubtitle", element: Addsubtitle },

  // Service Rating
  { path: "/servicerating", name: "Servicerating", element: Servicerating },

  // System Modules
  { path: "/systemmodules", name: "Systemmodules", element: Systemmodules },
  { path: "/addsystemmodules", name: "Addsystemmodules", element: Addsystemmodules },

  // Service Provider
  { path: "/providerlist", name: "Provider List", element: Providerlist },
  { path: "/addserviceprovider", name: "Addserviceprovider", element: Addserviceprovider },

  // Chats
  { path: "/customerchat", name: "Customer Chat", element: Customerchat },
];

export default routes;
