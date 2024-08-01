import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import { SidebarData } from "./SidebarData";
import "./Styles/sidebar.css";
import { PaddingTwoTone } from "@mui/icons-material";
const APPI_URL=process.env.REACT_APP_APPI_URL
const logout = () => {
  axios
    .get(`${APPI_URL}/logout`, { withCredentials: true })
    .then((res) => {
      if (res.data === "success") {
        window.location.href = "/login";
      }
    });
};

const NavbarSection = ({ ctx, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const [anchorEl, setAnchorEl] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    setBreadcrumbs((prevBreadcrumbs) => {
      const newBreadcrumbs = [...prevBreadcrumbs];
      if (!newBreadcrumbs.find((breadcrumb) => breadcrumb.path === location.pathname)) {
        newBreadcrumbs.push({
          path: location.pathname.toUpperCase(),
          name: location.pathname.split('/').pop() || 'Home',
        });
      }
      return newBreadcrumbs;
    });
  }, [location]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      {ctx && (
        <nav className="mnb">
          <div className="navbar-header">
            <div
              className="left-icons-and-breadcrumb"
              style={{ display: "flex", flexDirection: "column", padding: "10px" }}
            >
              <div className="nav-icons-left">
                {!isDashboard && (
                  <ArrowBackIcon
                    onClick={() => navigate(-1)}
                    style={{ cursor: "pointer", marginRight: "10px", fontSize: "1.2rem" }}
                  />
                )}
                <span
                  style={{
                    fontWeight: "bolder",
                    // paddingRight: "10px",
                  }}
                >
                 @ DoingERP.com
                </span>
                
              </div>
              <div className="breadcrumb-container">
                <Breadcrumbs aria-label="breadcrumb">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <Link
                      key={breadcrumb.path}
                      color={index < breadcrumbs.length - 1 ? "inherit" : "textPrimary"}
                      onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                      style={{
                        cursor: index < breadcrumbs.length - 1 ? "pointer" : "default",
                        textDecoration: index < breadcrumbs.length - 1 ? "underline" : "none",
                        fontWeight: index < breadcrumbs.length - 1 ? "normal" : "bold",
                        marginRight: "5px",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      {breadcrumb.name[0].toUpperCase()+breadcrumb.name.slice(1)}
                    </Link>
                  ))}
                </Breadcrumbs>
              </div>
            </div>

            <div className="nav-icons-right" style={{ marginTop: "10px" }}>
              <div style={{ marginRight: "10px", marginTop: "10px" }}>
                <HomeIcon
                  fontSize="3%"
                  width="50px"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <Avatar
                onClick={handleAvatarClick}
                style={{ cursor: "pointer", backgroundColor: "#3f51b5", fontSize: "1.2rem", width: "50px", height: "50px" }}
              >
                {ctx.username[0].toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAvatarClose}
              >
                <MenuItem sx={{ fontSize: "1.2rem" }} onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

const SidebarSection = ({ ctx, sidebarClass, toggleSidebar }) => {
  let sidebarHeaderStyle = {
    backgroundColor: sidebarClass === "msb" ? "transparent" : "gray",
    // width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: "10px",
    position: "sticky",
    top: 0,
    zIndex: 1,
    height: sidebarClass === "msb" ? "": "78px",
    marginTop: sidebarClass === "msb" ?"10%": "0",
    

  };

  const lipadding={
    paddingBottom: sidebarClass === "msb" ? "15%" : "25px",
    paddingLeft: sidebarClass === "msb" ? "0%" : "20px"

  }
  return (
    <div>
      {ctx && (
        <div className={sidebarClass} id="msb">
          <nav role="navigation">
            <div className="sidebar-header" style={sidebarHeaderStyle}>
              {sidebarClass === "msb" ? (
                <div>
                  <CloseIcon
                  onClick={toggleSidebar}
                  style={{ cursor: "pointer", fontSize: "1.8rem", }}
                />
                <h3 className="brand" style={{fontWeight:"bolder"}}>@ DoingERP.com</h3>
                </div>

              ) : (
                <MenuIcon
                  onClick={toggleSidebar}
                  // style={{ cursor: "pointer", fontSize: "1.2rem", color: "white" }}
                  color="white"
                  className="sidebar-icon"
                />
              )}
            </div>
            <div className="side-menu-container">
              <ul className="nav navbar-nav" style={{padding:"0"}}>
                {SidebarData.map((val, key) => {
                  if (val?.role !== undefined && val?.role !== ctx?.role_id) {
                    return null;
                  }
                  return (
                    <li key={key} style={lipadding}>
                      <NavLink
                        to={val.link}
                        className={({ isActive }) =>
                          isActive ? "sidebar-active-link" : "sidebar-link"
                        }
                        onClick={toggleSidebar}
                      >
                        <i className={`fa ${val.icon.toLowerCase()}`} style={{ fontSize: "1.8rem" }}></i>
                        {sidebarClass === "msb" && val.title}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

function Sidebar() {
  const ctx = useContext(AuthLoginInfo);
  const [sidebarClass, setSidebarClass] = useState("msb");

  const toggleSidebar = () => {
    setSidebarClass(sidebarClass === "msb" ? "msb-x" : "msb");
  };

  return (
    <div className="SidebarWrapper">
      <SidebarSection
        ctx={ctx}
        sidebarClass={sidebarClass}
        toggleSidebar={toggleSidebar}
      />
      <NavbarSection ctx={ctx} toggleSidebar={toggleSidebar} />
      
    </div>
  );
}

export default Sidebar;
