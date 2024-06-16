// import React, { useState, useContext } from "react";
// import "./Styles/sidebar.css";
// import axios from "axios";
// import { SidebarData } from "./SidebarData";
// import { NavLink } from "react-router-dom";
// import logo from "../Assets/Images/logo.png";
// import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
// import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
// import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

// const logout = () => {
//   axios
//     .get("http://localhost:5000/logout", {
//       withCredentials: true,
//     })
//     .then((res) => {
//       if (res.data === "success") {
//         window.location.href = "/login";
//       }
//     });
// };




// const NavbarSection = ({ ctx, sidebarCollapse, handleOnClick }) => {
//   const HamburgerMenu = ({ handleOnClick }) => {
//     return (
//       <button
//       className={`hamburgerMenu`}
//       onClick={() => handleOnClick()}
//     > Menu
//         <div />
//         <div />
//         <div />
//       </button>
//     );
//   };
//   return (
//     <div className="navbar">
//       <div className="navbarWrap">
//         <div className="navbarRow">
//           <HamburgerMenu handleOnClick={handleOnClick} />
//         </div>
//         <div className="navbarRow">
//           {
//             //if user is logged in
//             ctx && (
//               <div className="userNavbar ">
//                 <div className="userLogo">
//                   <AccountCircleRoundedIcon />
//                 </div>
//                 <div className="userLogged">Logged as: {ctx.username}</div>
//                 <div
//                   className="navbarFlex"
//                   onClick={() => {
//                     logout();
//                   }}
//                 >
//                   <div className="userLogo">
//                     <LogoutRoundedIcon className="maincolor clickable" />
//                   </div>
//                   <div className="logout clickable">Logout</div>
//                 </div>
//               </div>
//             )
//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// const SidebarSection = ({ ctx, sidebarCollapse }) => {
//   return (
//     <nav id="sidebarMenu" className={`Sidebar ${sidebarCollapse ? "SidebarOpen" : "SidebarClosed"}`}>
//       <div className="SidebarLogoWrap">
//         <div className="SidebarLogo">
//           <img src={logo} className="logo" alt="" />
//         </div>
//       </div>

//       <ul className="SidebarList">
//         {SidebarData.map((val, key) => {
//           if (val?.role !== undefined && val?.role !== ctx?.Role_Id) {
//             return null;
//           }
//           return (
//             <NavLink
//               to={val.link}
//               key={key}
//               className={({ isActive }) =>
//                 isActive ? "sidebar-active-link" : "sidebar-link"
//               }
//             >
//               <li className="SidebarRow">
//                 <div className="RowIcon">{val.icon}</div>
//                 <div className="RowTitle">{val.title}</div>
//               </li>
//             </NavLink>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// function Sidebar() {
//   const ctx = useContext(AuthLoginInfo);
//   const [sidebarCollapse, setSidebarCollapse] = useState(false);

//   const handleSidebarCollapse = () => {
//     setSidebarCollapse(!sidebarCollapse);
//   };

//   return (
//     <div className="SidebarWrapper">
//       <NavbarSection
//         ctx={ctx}
//         handleOnClick={handleSidebarCollapse}
//         sidebarCollapse={sidebarCollapse}
//       />
//       <SidebarSection ctx={ctx} sidebarCollapse={sidebarCollapse} />
//     </div>
//   );
// }

// export default Sidebar;


// // const NavbarSection = ({ ctx, sidebarCollapse, handleOnClick }) => {
// //   const HamburgerMenu = ({ handleOnClick }) => {
// //     return (
// //       <button
// //         className={`hamburgerMenu ${
// //           sidebarCollapse ? "hamburgerMenuOpen" : "hamburgerMenuClosed"
// //         }`}
// //         onClick={() => handleOnClick()}
// //       > Menu
// //         <div />
// //         <div />
// //         <div />
// //       </button>
// //     );
// //   };
// //   return (
// //     <div className="navbar">
// //       <div className="navbarWrap">
// //         <div className="navbarRow">
// //           <HamburgerMenu handleOnClick={handleOnClick} />
// //         </div>
// //         <div className="navbarRow">
// //           {
// //             //if user is logged in
// //             ctx && (
// //               <div className="userNavbar ">
// //                 <div className="userLogo">
// //                   <AccountCircleRoundedIcon />
// //                 </div>
// //                 <div className="userLogged">Logged as: {ctx.username}</div>
// //                 <div
// //                   className="navbarFlex"
// //                   onClick={() => {
// //                     logout();
// //                   }}
// //                 >
// //                   <div className="userLogo">
// //                     <LogoutRoundedIcon className="maincolor clickable" />
// //                   </div>
// //                   <div className="logout clickable">Logout</div>
// //                 </div>
// //               </div>
// //             )
// //           }
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const SidebarSection = ({ ctx, sidebarCollapse }) => {
// //   return (
// //     <nav id="sidebarMenu"
// //       className={`Sidebar ${sidebarCollapse ? "SidebarOpen" : "SidebarClosed"} collapse d-lg-block sidebar collapse bg-white `}
// //     >
// //       <div className="SidebarLogoWrap">
// //         <div className="SidebarLogo">
// //           <img src={logo} className="logo" alt="" />
// //         </div>
// //       </div>

// //       <ul className="SidebarList">
// //         {SidebarData.map((val, key) => {
// //           if (val?.role !== undefined && val?.role !== ctx?.Role_Id) {
// //             return null;
// //           }
// //           return (
// //             <NavLink
// //               to={val.link}
// //               key={key}
// //               className={({ isActive }) =>
// //                 isActive ? "sidebar-active-link" : "sidebar-link"
// //               }
// //             >
// //               <li className="SidebarRow">
// //                 <div className="RowIcon">{val.icon}</div>
// //                 <div className="RowTitle">{val.title}</div>
// //               </li>
// //             </NavLink>
// //           );
// //         })}
// //       </ul>
// //     </nav>
// //   );
// // };

// // function Sidebar() {
// //   const ctx = useContext(AuthLoginInfo);
// //   const [sidebarCollapse, setSidebarCollapse] = useState(false);
// //   const handleSidebarCollapse = () => {
// //     sidebarCollapse ? setSidebarCollapse(false) : setSidebarCollapse(true);
// //   };

// //   return (
// //     <div className="SidebarWrapper">
// //       <NavbarSection
// //         ctx={ctx}
// //         handleOnClick={handleSidebarCollapse}
// //         sidebarCollapse={sidebarCollapse}
// //       />
// //       <SidebarSection ctx={ctx} sidebarCollapse={sidebarCollapse} />
// //     </div>
// //   );
// // }

// // export default Sidebar;




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
              <div className="Toges">
                <a href="#" id="msbo" onClick={toggleSidebar}>
                  <i className="ic fa fa-bars"></i>
                </a>
              </div>
            </div>
            
            <a class="navbar-brand m-l-auto" href="#">
              <image src="https://doingerp.com/wp-content/uploads/2023/11/New-Project-1-1.png" width="30" height="30" class="d-inline-block align-top" alt=""></image>
              Doing ERP
            </a>
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

