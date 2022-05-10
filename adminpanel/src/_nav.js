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

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    id: "626fb4df8f7cc6c12b267297",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Services",
    to: "/services",
    id: "6273756155b4c75c3b3abc90",
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Offers",
    to: "/viewoffers",
    id: "6279f8e639ad89c7e11e1a28",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service history",
    to: "/servicehistory",
    id: "6279f92939ad89c7e11e1a2f",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "All Users",
    to: "/users",
    id: "627376c155b4c75c3b3abcd5",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Customer Support",
    to: "/viewcustomersupport",
    id: "6279f95b39ad89c7e11e1a3e",
    icon: <CIcon icon={cilSync} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Privacy Policy",
    to: "/privacypolicy",
    id: "6279f97339ad89c7e11e1a45",
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service Rating",
    to: "/viewservicerating",
    id: "6279f99339ad89c7e11e1a54",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "User role",
    to: "/viewuserrole",
    id: "6274ca16b9b11b68cba45777",
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "System Modules",
    to: "/viewsystemmodules",
    id: "6279f9b939ad89c7e11e1a69",
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
  },
];

export default _nav;
