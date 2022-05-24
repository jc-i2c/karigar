import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";

const DefaultLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const url = location.pathname;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (url === "/") {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;
