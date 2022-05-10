import axios from "axios";
import React, { createContext, useState } from "react";

export const PermissionContext = createContext();

const PermissionContextProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("karigar_token"));

  const fetchPermission = () => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        // console.log(res.data.data.systemmodulesid, "PERMISSIONS");
        setPermissions(res.data.data.systemmodulesid);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const value = {
    fetchPermission,
    permissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionContextProvider;
