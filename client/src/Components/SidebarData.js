import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";


function useMenuData() {
  const ctx = useContext(AuthLoginInfo);
  const [data, setData] = useState([]);

  useEffect(() => {
    const MenuwithRole = async () => {
      try {
        const response = await axios.get(`${APPI_URL}/menulevel`, { withCredentials: true });
        const fetchedData = response.data;
        setData(fetchedData);
        
        // Save data to localStorage
        localStorage.setItem('menuData', JSON.stringify(fetchedData));
      } catch (error) {
        console.error('Error fetching menu data', error);
      }
    };
    MenuwithRole();
  },);

  return data;
}

export default useMenuData;
export const SidebarData =
 [
  {
    title: "Dashboard",
    icon: "fa-home",
    link: "/"
  },
  {
    title: "Instances",
    icon: "fa-database",
    link: "/Instances"
  },
  {
    title: "Modules",
    icon: "fa-life-ring ",
    link: "/Modules"
  },
  {
    title: "Customers",
    icon: "fa-address-book-o",
    link: "/Customers"
  }, 
  {
    title: "Scenario Manager",
    icon: "fa-code-fork",
    link: "/business/scenario",
    role: 1
  },
  {
    title: "Components List",
    icon: "fa-building",
    link: "/business/components",
    role: 1
  },
  {
    title: "Components Flow",
    icon: "fa-server",
    link: "/business/components/flow",
    role: 1
  },
  {
    title: "Command",
    icon: "fa-wrench",
    link: "/business/command",
    role: 1
  },
  {
    title: "Flow List",
    icon: "fa-eercast",
    link: "/business/manager",
    role: 1
  },
  {
    title: "Modules Details",
    icon: "fa-linode",
    link: "/business/module",
    role: 1
  },
  {
    title: "Test Case",
    icon: "fa-bolt",
    link: "/business/testcase",
    role: 1
  },
  {
    title: "Module Access",
    icon: "fa-cubes",
    link: "/business/maccess",
    role: 1
  },
  {
    title: "Objects Repo",
    icon: "fa-diamond",
    link: "/business/objects",
    role: 1
  },

  {
    title: "Types",
    icon: "fa-magnet",
    link: "/business/types",
    role: 1
  },
  {
    title: "Client Access",
    icon: "fa-random",
    link: "/business/clientaccess",
    role: 1
  },

  {
    title: "Admin Panel",
    icon: "fa-user",
    link: "/AdminPanel",
    role: 1
  },
];
