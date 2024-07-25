// EnvPage.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DeviceHubIcon from '@mui/icons-material/DeviceHub'; // Example icon

const APPI_URL=process.env.REACT_APP_APPI_URL
let env

const EnvPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
    const { variables } = location.state || {};
    if(env === undefined){
        env = variables
    }



  const handleRowClick = (variable) => {
    navigate('/job', { state: { variable } });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
      <Paper style={{ width: '100%', maxWidth: '800px', padding: '16px' }}>
        <Typography variant="h4" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Environment Variables</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '1.2rem' }}>Icon</TableCell>
                <TableCell style={{ fontSize: '1.2rem' }}>Environment Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {env && env.map((env, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(env.instance_url)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell style={{ fontSize: '1.2rem', width: '60px', textAlign: 'center' }}>
                    <IconButton>
                      {/* Display a unique icon based on environment */}
                      <DeviceHubIcon color="primary" style={{ fontSize: '2rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ fontSize: '1.2rem' }}>{env.envName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default EnvPage;
