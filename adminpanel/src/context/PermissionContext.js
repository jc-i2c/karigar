import axios from "axios";
import React, { createContext, useState } from "react";

export const PermissionContext = createContext();

const PermissionContextProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  const fetchPermission = (token) => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        const records = [];
        if (res.data.data.systemmodulesid) {
          res.data.data.systemmodulesid.map((item) => {
            records.push(item._id);
          });
          setPermissions(records);
          // console.log(records, "records");
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const value = {
    setPermissions,
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
