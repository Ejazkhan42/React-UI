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
  Cell
} from "recharts";
import "./Styles/homepage.css";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

function Homepage() {
  const ctx = useContext(AuthLoginInfo);
  const isAuthenticated = !Array.isArray(ctx);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard_data", { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setDashboardData(res.data);
        }
      });
  }, []);

  const dummyLineData = [
    { month: "Jan", Requisition: 40, Offer: 24, Candidates: 24, Onboarding: 35 },
    { month: "Feb", Requisition: 30, Offer: 13, Candidates: 22, Onboarding: 28 },
    { month: "Mar", Requisition: 20, Offer: 98, Candidates: 32, Onboarding: 15 },
    { month: "Apr", Requisition: 27, Offer: 39, Candidates: 20, Onboarding: 25 },
    { month: "May", Requisition: 18, Offer: 48, Candidates: 30, Onboarding: 20 }
  ];

  const dummyPieData = [
    { name: "Requisition", value: 400 },
    { name: "Offer", value: 300 },
    { name: "Candidates", value: 300 },
    { name: "Onboarding", value: 200 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const dummyTableData = [
    { id: 1, name: "Requisition Management", jobRun: "19 May, 2021 : 10:10 AM", status: "Passed" },
    { id: 2, name: "Offer Management", jobRun: "18 May, 2021 : 3:12 PM", status: "Failed" },
    { id: 3, name: "Candidates Management", jobRun: "17 May, 2021 : 2:15 PM", status: "Pass" },
    { id: 4, name: "Onboarding Management", jobRun: "23 Apr, 2021 : 1:15 PM", status: "Running" }
  ];

  const TopPanel = () => {
    return (
      <div className="top-panel">
        <div className="card">
          
          <div className="card-content">
            <h3>Total Test Passed</h3>
            <div className="card-icon">
            <PaymentsRoundedIcon />
          </div>
            <h1>1000</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <TrendingUpRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Total Failed Test Case</h3>
            <h1>200</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <SupervisorAccountRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Total Test Case</h3>
            <h1>1200</h1>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">
            <EventNoteRoundedIcon />
          </div>
          <div className="card-content">
            <h3>Running</h3>
            <h1>12.8%</h1>
            <span>-1.22%</span>
          </div>
        </div>
      </div>
    );
  };

  const ChartComponent = () => {
    return (
      <div className="chart-container">
        <div className="line-chart">
          <h3>Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dummyLineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Requisition" stroke="#8884d8" />
              <Line type="monotone" dataKey="Offer" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Candidates" stroke="#ffc658" />
              <Line type="monotone" dataKey="Onboarding" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="pie-chart">
          <h3>Popular Categories</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dummyPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dummyPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            <div>
              <span className="legend-color" style={{ backgroundColor: COLORS[0] }}></span>
              Requisition
            </div>
            <div>
              <span className="legend-color" style={{ backgroundColor: COLORS[1] }}></span>
              Offer
            </div>
            <div>
              <span className="legend-color" style={{ backgroundColor: COLORS[2] }}></span>
              Candidates
            </div>
            <div>
              <span className="legend-color" style={{ backgroundColor: COLORS[3] }}></span>
              Onboarding
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TableComponent = () => {
    return (
      <div className="table-container">
        <h3>Recent Run Test Case</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Run</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyTableData.map((order) => (
              <tr key={order.id}>
                <td>{order.name}</td>
                <td>{order.jobRun}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <span>...</span>
          <button>20</button>
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
