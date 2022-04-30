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
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Services",
    to: "/services",
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "All Users",
    to: "/users",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Service Provider",
    to: "/serviceprovider",
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
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

  {
    component: CNavGroup,
    name: "Icons",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "CoreUI Free",
        to: "/icons/coreui-icons",
        badge: {
          color: "success",
          text: "NEW",
        },
      },
      {
        component: CNavItem,
        name: "CoreUI Flags",
        to: "/icons/flags",
      },
      {
        component: CNavItem,
        name: "CoreUI Brands",
        to: "/icons/brands",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Pages",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Login",
        to: "/login",
      },
      {
        component: CNavItem,
        name: "Register",
        to: "/register",
      },
      {
        component: CNavItem,
        name: "Error 404",
        to: "/404",
      },
      {
        component: CNavItem,
        name: "Error 500",
        to: "/500",
      },
    ],
  },
];

export default _nav;
