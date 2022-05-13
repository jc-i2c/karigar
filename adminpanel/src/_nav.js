import React from "react";
import CIcon from "@coreui/icons-react";

import {
  cilNotes,
  cilPuzzle,
  cilAppsSettings,
  cilSpeedometer,
  cilUser,
  cilTask,
  cilLockLocked,
  cilSync,
  cilStar,
  cilApps,
} from "@coreui/icons";

import { CNavItem } from "@coreui/react";

let _nav = [];
_nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    id: "627dfc332761e71d53436235",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Services",
    to: "/services",
    id: "627a26b29fab5c7699e3fd5d",
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Offers",
    to: "/offers",
    id: "627a26d89fab5c7699e3fd7b",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service history",
    to: "/servicehistory",
    id: "627a26e69fab5c7699e3fd80",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "All Users",
    to: "/users",
    id: "627a26ee9fab5c7699e3fd85",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Customer Support",
    to: "/customersupport",
    id: "627a270a9fab5c7699e3fd8f",
    icon: <CIcon icon={cilSync} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Privacy Policy",
    to: "/privacypolicy",
    id: "627a271b9fab5c7699e3fd92",
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service Rating",
    to: "/servicerating",
    id: "627a27259fab5c7699e3fd95",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "User role",
    to: "/userrole",
    id: "627a272c9fab5c7699e3fd98",
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "System Modules",
    to: "/systemmodules",
    id: "627a273b9fab5c7699e3fd9b",
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service Provider",
    to: "/providerlist",
    id: "627b567c2edb1ae3b9be98e9",
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
  },
];

export default _nav;
