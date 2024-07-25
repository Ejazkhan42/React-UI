import React, { useState } from "react";
import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import UsersSetting from "../Components/AdminPanelComponents/UsersSetting";
import "./Styles/adminPanel.css";
const APPI_URL=process.env.REACT_APP_APPI_URL

function AdminPanel() {
  const [selectedTab, setSelectedTab] = useState(0);

  const adminNavData = [
    {
      id: 0,
      title: "Users",
      component: <UsersSetting />,
    },
    // Add more tabs as needed
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" gutterBottom>
        Admin Pannel
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="admin panel tabs"
        >
          {adminNavData.map((navItem) => (
            <Tab key={navItem.id} label={navItem.title} />
          ))}
        </Tabs>
      </AppBar>
      <Box mt={3}>
        {adminNavData.map((navItem) => (
          <TabPanel key={navItem.id} value={selectedTab} index={navItem.id}>
            {navItem.component}
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default AdminPanel;
