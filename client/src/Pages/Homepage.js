import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TableCell, TableContainer, Table, TableHead, TableBody, TableRow, Paper, Typography, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Styles/homepage.css";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

function Homepage() {
  const ctx = useContext(AuthLoginInfo);
  const isAuthenticated = !Array.isArray(ctx);
  const [dashboardData, setDashboardData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5000/getlogs", { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setDashboardData(res.data);
          processChartData(res.data);
        }
      });
  }, []);

  const processChartData = (data) => {
    const pieCounts = { Pass: 0, Fail: 0, Running: 0 };
    const lineCounts = {};

    data.forEach((item) => {
      pieCounts[item.test_status] += 1;
      const testMonth = new Date(item.start_time).toLocaleString("default", { month: "short" });
      if (!lineCounts[testMonth]) {
        lineCounts[testMonth] = { month: testMonth };
      }
      if (!lineCounts[testMonth][item.test_name]) {
        lineCounts[testMonth][item.test_name] = 0;
      }
      lineCounts[testMonth][item.test_name] += 1;
    });

    setPieData([
      { name: "Pass", value: pieCounts.Pass },
      { name: "Fail", value: pieCounts.Fail },
      { name: "Running", value: pieCounts.Running }
    ]);

    const lineDataArray = Object.values(lineCounts);
    setLineData(lineDataArray);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const getStatusColor = (status) => {
    switch (status) {
      case "Fail":
        return { color: "red", borderColor: "darkred" };
      case "Pass":
        return { color: "green", borderColor: "darkgreen" };
      case "Running":
        return { color: "orange", borderColor: "darkorange" };
      default:
        return { color: "black", borderColor: "transparent" };
    }
  };

  const TopPanel = () => {
    return (
      <div className="top-panel">
        <div className="card">
          <div className="card-content">
            <h3>Total Test Passed</h3>
            <div className="card-icon">
              <PaymentsRoundedIcon />
            </div>
            <h1>{pieData.find(d => d.name === "Pass")?.value || 0}</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <TrendingUpRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Total Failed Test Case</h3>
            <h1>{pieData.find(d => d.name === "Fail")?.value || 0}</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <SupervisorAccountRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Total Test Case</h3>
            <h1>{dashboardData.length}</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <EventNoteRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Running</h3>
            <h1>{(pieData.find(d => d.name === "Running")?.value || 0) / dashboardData.length * 100}%</h1>
          </div>
        </div>
      </div>
    );
  };

  const ChartComponent = () => {
    const specifiedNames = [
      "Recruiting Campaigns",
      "Offer Management",
      "Requisition Management",
      "Candidate Management",
      "Onboarding",
      "Selection",
      "Candidate Management",
      "Agency Management",
      "Candidate Application",
      "Hiring",
      "Configuration"
    ];

    const uniqueNames = [...new Set(lineData.flatMap(data => Object.keys(data)).filter(name => name !== 'month'))];

    return (
      <div className="chart-container">
        <div className="line-chart">
          <h3>Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData.slice(-3)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend payload={specifiedNames.map((name, index) => ({ id: name, value: name, type: 'line', color: `#${Math.floor(Math.random()*16777215).toString(16)}` }))} />
              {uniqueNames.map(name => (
                <Line key={name} type="monotone" dataKey={name} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="pie-chart">
          <h3>Test Status Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`}>
                <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(dashboardData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const slicedData = dashboardData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const TableComponent = () => {
    return (
      <div className="table-container">
        <h3>Recent Run Test Case</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Job Run</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{ fontSize: "1.2rem" }}>{row.test_name}</TableCell>
                  <TableCell style={{ fontSize: "1.2rem" }}>{new Date(row.start_time).toLocaleString()}</TableCell>
                  <TableCell>
                    <span style={{ padding: "6px 12px", borderRadius: "4px", ...getStatusColor(row.test_status) }}>
                      {row.test_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="pagination">
          <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
            <NavigateBeforeIcon />
          </IconButton>
          <Typography variant="body1">{currentPage}</Typography>
          <IconButton onClick={handleNextPage} disabled={currentPage === Math.ceil(dashboardData.length / itemsPerPage)}>
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <TopPanel />
      <ChartComponent />
      <TableComponent />
    </div>
  );
}

export default Homepage;
// Total cases in library, total cases run, , total cases in progress, total, failed, total passed