import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilStar,
  cilPuzzle,
  cilAppsSettings,
  cilSpeedometer,
  cilUser,
  cilTask,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

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
    id: "6260ffd01c78176ea1c01eab",
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Offers",
    to: "/viewoffers",
    id: "626fb5108f7cc6c12b2672ab",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service history",
    to: "/servicehistory",
    id: "626fb5108f7cc6c12b2672ab",
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
    name: "User role",
    to: "/viewuserrole",
    id: "6274ca16b9b11b68cba45777",
    icon: <CIcon icon={cilAppsSettings} customClassName="nav-icon" />,
  },
];

export default _nav;
