import React, { useContext } from "react";

import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";

import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";

import { cilMenu } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";

import { PermissionContext } from "./../../../src/context/PermissionContext";

// import avatar8 from "./../../assets/images/avatars/8.jpg";

const AppHeaderDropdown = () => {
  const { setPermissions } = useContext(PermissionContext);

  const navigate = useNavigate();

  function SignOut() {
    setPermissions([]);
    localStorage.removeItem("karigar_token");
    navigate("/login");
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/* <CAvatar src={avatar8} size="md" /> */}
        <CIcon icon={cilMenu} size="lg" />
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Settings
        </CDropdownHeader>

        <CDropdownItem href="profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="changepassword">
          <CIcon icon={cilSettings} className="me-2" />
          Change Password
        </CDropdownItem>
        <CDropdownDivider />

        <CDropdownItem onClick={SignOut}>
          <CIcon icon={cilLockLocked} className="me-2" />
          SIGN OUT
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
