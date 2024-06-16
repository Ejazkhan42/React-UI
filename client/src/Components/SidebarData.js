import React from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
export const SidebarData = [
  {
    title: "Dashboard",
    icon: "fa-home",
    link: "/"
  },
  {
    title: "Job",
    icon: "fa-life-ring ",
    link: "/job"
  },
  {
    title: "Clients",
    icon: "fa-users",
    link: "/clients"
  },
  {
    title: "Calendar",
    icon: "fa-calendar",
    link: "/calendar"
  },
  {
    title: "Admin pannel",
    icon: "fa-user",
    link: "/adminPannel",
    role: 1
  }
];
