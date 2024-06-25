import React, { useState, useContext } from "react";
import "./Styles/sidebar.css";
import axios from "axios";
import { SidebarData } from "./SidebarData";
import { NavLink } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import $ from "jquery"

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

  return (
    <div>
      {ctx && (
        <nav className="mnb navbar navbar-default navbar-fixed-top">

          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="true"
                aria-controls="navbar"
              // onClick={toggleSidebar}
              >
                <span className="sr-only">Toggle navigation</span>
                <i className="ic fa fa-bars"></i>
              </button>
              <div style={{padding:'15px 0'}}>
                <a href="#" id="msbo" onClick={toggleSidebar}>
                  <i className="ic fa fa-bars"></i>
                </a>
              </div>
            </div>
            
            {/* <a class="navbar-brand m-l-auto" href="#">
              <image src="https://doingerp.com/wp-content/uploads/2023/11/New-Project-1-1.png" width="30" height="30" class="d-inline-block align-top" alt=""></image>
            
            </a> */}
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                  <a><i className="fa fa-user"></i> Logged as: {ctx.username}</a>
                </li>
                <li className="nav-item" onClick={logout}>
                  <a><i className="fa fa-logout"></i>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

const SidebarSection = ({ ctx, sidebarClass }) => {
  return (
    <div>
      
    {ctx && (
    <div className={sidebarClass} id="msb">
      <nav className="navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <div className="brand-name-wrapper">
            <a class="navbar-brand" href="#">
              Doing ERP
            </a>
          </div>
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
    </div>)}
    </div>
  );
};

function Sidebar() {
  const ctx = useContext(AuthLoginInfo);
  const [sidebarClass, setSidebarClass] = useState("msb");

  const toggleSidebar = () => {
    (function () {
      $('#msbo').on('click', function () {
        $('body').toggleClass('msb-x');
      });
    }());
  };

  return (
    <div className="SidebarWrapper">
      <NavbarSection ctx={ctx} toggleSidebar={toggleSidebar} />
      <SidebarSection ctx={ctx} sidebarClass={sidebarClass} />
    </div>
  );
}

export default Sidebar;

