import React, { useState, useContext } from "react";
import "./Styles/sidebar.css";
import axios from "axios";
import { SidebarData } from "./SidebarData";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";

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

  return (
    <div>
      {ctx && (
        <nav className="mnb navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            
            <div className="navbar-header">
              
              <div className="nav-icons">
              <div>
              Doings ERP

              </div>

                <MenuIcon className="menu" onClick={toggleSidebar} />
                <HomeIcon onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                {!isDashboard && <ArrowBackIcon onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />}
              </div>
            </div>
            <div id="navbar" className="navbar-collapse collapse nav-extras">
          
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
            <div className="sidebar-header">
              <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                  <span><i className="fa fa-user"></i> Logged as: {ctx.username}</span>
                </li>
                <li className="nav-item logout" onClick={logout}>
                  <span><i className="fa fa-logout"></i>Logout</span>
                </li>
              </ul>
            </div>
            <div className="side-menu-container">
              <ul className="nav navbar-nav">
                {SidebarData.map((val, key) => {
                  if (val?.role !== undefined && val?.role !== ctx?.Role_Id) {
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
    document.body.classList.toggle('msb-x');
  };

  const closeSidebar = () => {
    setSidebarClass("msb msb-x");
    document.body.classList.add('msb-x');
  };

  return (
    <div className="SidebarWrapper">
      <NavbarSection ctx={ctx} toggleSidebar={toggleSidebar} />
      <SidebarSection ctx={ctx} sidebarClass={sidebarClass} closeSidebar={closeSidebar} />
    </div>
  );
}

export default Sidebar;
