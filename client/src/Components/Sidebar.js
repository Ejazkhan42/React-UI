import React, { useState, useEffect, useContext } from "react";
import "./Styles/sidebar.css";
import axios from "axios";
import { SidebarData } from "./SidebarData";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Menu, MenuItem } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const logout = () => {
  axios
    .get("http://localhost:5000/logout", {
      withCredentials: true,
    })
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
          path: location.pathname,
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
        <nav className="mnb navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
             
              <div className="left-icons-and-breadcrumb" style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
              <div className="nav-icons-left">
                {!isDashboard && (
                  <ArrowBackIcon
                    onClick={() => navigate(-1)}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                )}
                <span
                  style={{
                    fontWeight: "bolder",
                    paddingRight: "10px",
                    fontSize: "1.5rem",
                  }}
                >
                  Doing ERP
                </span>
                <MenuIcon
                  className="menu"
                  onClick={toggleSidebar}
                  style={{ cursor: "pointer" }}
                />
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
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        hover: { textDecoration: "none" },
                      }}
                    >
                      {breadcrumb.name}
                    </Link>
                  ))}
                </Breadcrumbs>
              </div>
             
              </div>

               <div className="nav-icons-right" style={{ marginTop: "10px" }}>
                <div style={{ marginRight: "10px", marginTop: "10px" }}>
                  <HomeIcon
                    fontSize="large"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <Avatar
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer", backgroundColor: "#3f51b5" }}
                >
                  {ctx.username[0].toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAvatarClose}
                >
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

const SidebarSection = ({ ctx, sidebarClass, closeSidebar }) => {
  return (
    <div>
      {ctx && (
        <div className={sidebarClass} id="msb">
          <nav className="navbar navbar-default" role="navigation">
            <div className="sidebar-header"></div>
            <div className="side-menu-container">
              <ul className="nav navbar-nav">
                {SidebarData.map((val, key) => {
                  if (val?.role !== undefined && val?.role !== ctx?.role_id) {
                    return null;
                  }
                  return (
                    <li key={key}>
                      <NavLink
                        to={val.link}
                        className={({ isActive }) =>
                          isActive ? "sidebar-active-link" : "sidebar-link"
                        }
                        onClick={closeSidebar}
                      >
                        <i className={`fa ${val.icon.toLowerCase()}`}></i>
                        {val.title}
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
    setSidebarClass(sidebarClass === "msb" ? "msb msb-x" : "msb");
    document.body.classList.toggle("msb-x");
  };

  const closeSidebar = () => {
    setSidebarClass("msb msb-x");
    document.body.classList.add("msb-x");
  };

  return (
    <div className="SidebarWrapper">
      <NavbarSection ctx={ctx} toggleSidebar={toggleSidebar} />
      <SidebarSection
        ctx={ctx}
        sidebarClass={sidebarClass}
        closeSidebar={closeSidebar}
      />
    </div>
  );
}

export default Sidebar;
