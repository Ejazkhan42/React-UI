import React, { useEffect, useState, useContext } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import './Styles/order.css';

const iconMap = {
  // 'Payments': <PaymentsRoundedIcon style={{ fontSize: 40 }} />,
  'Recruitment': <TrendingUpIcon style={{ fontSize: 40 }} />,
  'Absence': <SupervisorAccountRoundedIcon style={{ fontSize: 40 }} />,
  'Core Hr': <EventNoteRoundedIcon style={{ fontSize: 40 }} />,
  // 'Work': <WorkIcon style={{ fontSize: 40 }} />
};

function Orders() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const ctx = useContext(AuthLoginInfo);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/module?user_id=${ctx.id}`, { withCredentials: true });
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, [ctx.id]);

  const handleCardClick = (moduleId, moduleName) => {
    navigate('/testcase', { state: { moduleId, moduleName } });
  };

  return (
    <Box p={3} className="order-container">
      <Typography variant="h4" gutterBottom align="center" style={{ fontSize: '3rem', color: 'white' }}>
        Modules
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={module.Id}>
            <Card 
              className="module-card" 
              onClick={() => handleCardClick(module.Id, module.name)}
            >
              <CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  {iconMap[module.name] || <PaymentsRoundedIcon style={{ fontSize: 40 }} />}
                </Box>
                <Typography variant="h6" component="div" align="center" style={{ fontSize: '1.5rem' }}>
                  {module.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Orders;
