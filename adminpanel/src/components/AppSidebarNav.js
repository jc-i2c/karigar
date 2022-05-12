import React, { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { CBadge } from "@coreui/react";
import { PermissionContext } from "src/context/PermissionContext";

export const AppSidebarNav = ({ items }) => {
  const { permissions, fetchPermission } = useContext(PermissionContext);

  useEffect(() => {
    if (permissions.length === 0) {
      fetchPermission();
    }
  }, []);

  const location = useLocation();
  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
          component: NavLink,
        })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    );
  };
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => {
          console.log(item, "item");
          return item.items ? navGroup(item, index) : navItem(item, index);
        })}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

// return (
//   <React.Fragment>
//     {items &&
//       items.map((item, index) => {
//         permissions.map((list) => {
//           if (list.systemmodulesid._id == item.id) {
//             console.log(item.id, "item");
//             console.log(list.systemmodulesid._id, "list");
//             return item.items ? navGroup(item, index) : navItem(item, index);
//           } else {
//             return item.items ? navGroup(item, index) : navItem(item, index);
//           }
//         });
//       })}
//   </React.Fragment>
// );
