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
  cilPuzzle,
  cilAppsSettings,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilTask,
  cilUserPlus,
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
    name: "All Users",
    to: "/users",
    id: "6260ffe81c78176ea1c01eb1",

    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: "Service Provider",
  //   to: "/serviceprovider",
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: "Customer",
  //   to: "/Viewcustomer",
  //   icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavGroup,
  //   name: "Icons",
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Free",
  //       to: "/icons/coreui-icons",
  //       badge: {
  //         color: "success",
  //         text: "NEW",
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Flags",
  //       to: "/icons/flags",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "CoreUI Brands",
  //       to: "/icons/brands",
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: "Pages",
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Login",
  //       to: "/login",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Register",
  //       to: "/register",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 404",
  //       to: "/404",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Error 500",
  //       to: "/500",
  //     },
  //   ],
  // },
];

export default _nav;
