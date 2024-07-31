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
import {
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import "./Styles/homepage.css";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import { useNavigate } from 'react-router-dom';

const APPI_URL=process.env.REACT_APP_APPI_URL

function Homepage() {
  const ctx = useContext(AuthLoginInfo);
  const isAuthenticated = !Array.isArray(ctx);
  const [dashboardData, setDashboardData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${APPI_URL}/getlogs`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          setDashboardData(res.data);
          processChartData(res.data);
        }
      });
  }, []);

  const processChartData = (data) => {
    // Aggregate pie chart data
    const pieCounts = { pass: 0, fail: 0, running: 0 };
    data.forEach((item) => {
      pieCounts[item.test_status] += 1;
    });
    setPieData([
      { name: "Pass", value: pieCounts.pass },
      { name: "Fail", value: pieCounts.fail },
      { name: "Running", value: pieCounts.running },
    ]);

    // Aggregate line chart data
    const lineCounts = {};
    data.forEach((item) => {
      const date = new Date(item.start_time).toLocaleDateString("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!lineCounts[date]) {
        lineCounts[date] = { date };
      }
      if (!lineCounts[date][item.test_name]) {
        lineCounts[date][item.test_name] = 0;
      }
      lineCounts[date][item.test_name] += 1;
    });
    setLineData(Object.values(lineCounts));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const getStatusColor = (status) => {
    switch (status) {
      case "fail":
        return { color: "red", borderColor: "darkred" };
      case "pass":
        return { color: "green", borderColor: "darkgreen" };
      case "running":
        return { color: "orange", borderColor: "darkorange" };
      default:
        return { color: "black", borderColor: "transparent" };
    }
  };

  const scrollToTable = () => {
    const tableElement = document.getElementById("table-component");
    tableElement.scrollIntoView({ behavior: "smooth" });
  };

  function ButtonComponent() {
    const [isClicked, setIsClicked] = useState(false);
  
    const handleClick = () => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 1000); // Reset click state after animation
      navigate('/customers');

    };
  
    return (
      <a
        className={`btn ${isClicked ? 'is-clicked' : ''}`}
        onClick={handleClick}
      >
        Add TestCase
      </a>
    );
  }
  

  const TopPanel = () => {
    return (
      <div className="top-panel">
        <div className="card" onClick={scrollToTable}>
          <div className="card-content">
            <h3>Total Cases in Library</h3>
            <div className="card-icon">
              <LibraryBooksRoundedIcon />
            </div>
            <h1>{dashboardData.length}</h1>
          </div>
        </div>
        <div className="card" onClick={scrollToTable}>
          <div className="card-content">
            <h3>Total Cases Run</h3>
            <div className="card-icon">
              <PlayArrowRoundedIcon />
            </div>
            <h1>{pieData.reduce((acc, d) => acc + d.value, 0)}</h1>
          </div>
        </div>
        <div className="card" onClick={scrollToTable}>
          <div className="card-content">
            <h3>Total Cases in Progress</h3>
            <div className="card-icon">
              <EventNoteRoundedIcon />
            </div>
            <h1>{pieData.find((d) => d.name === "Running")?.value || 0}</h1>
          </div>
        </div>
        <div className="card" onClick={scrollToTable}>
          <div className="card-content">
            <h3>Total Failed</h3>
            <div className="card-icon">
              <TrendingUpRoundedIcon />
            </div>
            <h1>{pieData.find((d) => d.name === "Fail")?.value || 0}</h1>
          </div>
        </div>
        <div className="card" onClick={scrollToTable}>
          <div className="card-content">
            <h3>Total Passed</h3>
            <div className="card-icon">
              <PaymentsRoundedIcon />
            </div>
            <h1>{pieData.find((d) => d.name === "Pass")?.value || 0}</h1>
          </div>
        </div>
      </div>
    );
  };

  const ChartComponent = () => {
    const customNames = [
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
      "Configuration",
    ];

    return (
      <div className="chart-container">
        <div className="line-chart">
          <h3>Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend
                payload={customNames.map((name, index) => ({
                  id: name,
                  type: "line",
                  value: name,
                  color: "#8884d8",
                }))}
              />
              {customNames.map((name) => (
                <Line key={name} type="monotone" dataKey={name} stroke="#8884d8" />
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
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedData = dashboardData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const TableComponent = () => {
    return (
      <div className="table-container" id="table-component">
        <h3>Recent Run Test Case</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "2rem" }}>Name</TableCell>
                <TableCell style={{ fontSize: "2rem" }}>Job Run</TableCell>
                <TableCell style={{ fontSize: "2rem" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slicedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell style={{ fontSize: "2rem" }}>
                    {row.test_name}
                  </TableCell>
                  <TableCell style={{ fontSize: "2rem" }}>
                    {new Date(row.start_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        ...getStatusColor(row.test_status),
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: `1px solid ${
                          getStatusColor(row.test_status).borderColor
                        }`,
                      }}
                    >
                      {row.test_status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={dashboardData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            fontSize="2rem"
            style={{ fontSize: "2rem" }}
          />
        </TableContainer>
      </div>
    );
  };

  return (
    <div style={{ marginLeft: "20%", marginRight: "13%" }}>
      <ButtonComponent />
      <TopPanel />
      <ChartComponent />
      <TableComponent />
    </div>
  );
}

export default Homepage;
