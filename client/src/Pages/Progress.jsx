import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
<<<<<<< HEAD
  Button,
  TablePagination,
} from '@mui/material';
import VncScreen from './Browser';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
=======
  Button
} from '@mui/material';
import VncScreen from './Browser';
import { styled } from '@mui/material/styles';
import './Styles/progress.css';
import axios from 'axios';
>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2

const StyledPaper = styled(Paper)({
  padding: '16px',
  marginBottom: '16px',
  textAlign: 'left',
  color: '#333',
});

const SystemLog = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
});

const LogItem = styled('div')(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  '&:before': {
    content: '""',
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[400],
  },
}));

const DataSetTable = ({ excelData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = excelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        Excel Data
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {excelData.length > 0 &&
                Object.keys(excelData[0]).map((key) => (
                  <TableCell key={key} sx={{ fontSize: '1.2rem' }}>{key}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex} sx={{ fontSize: '1.2rem' }}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={excelData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const ResponsivePage = () => {
<<<<<<< HEAD
  const location = useLocation();
  const { excelData } = location.state || { excelData: [] };

  const [sessionIds, setSessionIds] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [vncConnectionStatus, setVncConnectionStatus] = useState('disconnected');

  useEffect(() => {
    axios.get('http://jenkins.doingerp.com:5000/getbrowser-id').then((res) => {
      if (res.data.browserId) {
        setSessionIds([res.data]);
      } else {
        console.error('Invalid response format:', res.data);
      }
    }).catch((error) => {
      console.error('Error fetching session IDs:', error);
=======
  const [sessionIds, setSessionIds] = useState([{}]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [vncConnectionStatus, setVncConnectionStatus] = useState("disconnected");

  useEffect(() => {
    axios.get("http://jenkins.doingerp.com:5000/getbrowser-id").then((res) => {
      // console.log(res.data.browserId)
      if (res.data.browserId) {

        console.log(res.data)        
        setSessionIds(res.data);
        console.log(sessionIds)
      } else {
        console.error("Invalid response format:", res.data);
      }
    }).catch((error) => {
      console.error("Error fetching session IDs:", error);
>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2
    });
  }, []);

  const handleConnect = () => {
    if (selectedSession) {
<<<<<<< HEAD
      setVncConnectionStatus('connecting');
=======
      setVncConnectionStatus("connecting");
>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2
    }
  };

  const handleDisconnect = () => {
    setSelectedSession(null);
<<<<<<< HEAD
    setVncConnectionStatus('disconnected');
=======
    setVncConnectionStatus("disconnected");
>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom fontSize={'1.5rem'}>
            Running
          </Typography>
          <Typography variant="body2" fontSize={'1.1.2rem'}>
            Requisition Management &gt; Create Job Requisition
          </Typography>
        </StyledPaper>
      </Box>
      <Typography variant="h6">System Log</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StyledPaper>
            <SystemLog>
              <LogItem>Login</LogItem>
              <LogItem>Home</LogItem>
              <LogItem>Requisition Page</LogItem>
              <LogItem active>Adding Requisition</LogItem>
              <LogItem>Click On Submit</LogItem>
              <LogItem>view all</LogItem>
            </SystemLog>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ height: '100%', width: '100%', minHeight: '500px' }}>
            <Select
              value={selectedSession}
              onChange={handleSessionChange}
              displayEmpty
              fullWidth
              variant="outlined"
<<<<<<< HEAD
              disabled={vncConnectionStatus === 'connecting' || vncConnectionStatus === 'connected'}
=======
              disabled={vncConnectionStatus === "connecting" || vncConnectionStatus === "connected"}
>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2
            >
              <MenuItem value="" disabled>
                Select Session ID
              </MenuItem>
<<<<<<< HEAD
              {sessionIds.map((session) => (
                <MenuItem key={session.browserId} value={session.browserId}>
                  {session.testcase}
                </MenuItem>
              ))}
            </Select>
            <Box style={{ marginTop: '10px' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleConnect}
                disabled={vncConnectionStatus === 'connecting' || vncConnectionStatus === 'connected'}
              >
                LIVE VIEW
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                variant="outlined"
                onClick={handleDisconnect}
                disabled={vncConnectionStatus === 'disconnected'}
              >
                Disconnect
              </Button>
            </Box>
=======
              
                <MenuItem key={sessionIds.browserId} value={sessionIds.browserId}>
                  {sessionIds.testcase}
                </MenuItem>
              
            </Select>
          <Box style={{marginTop: '10px'}}>
              <Button variant="contained" color='secondary' onClick={handleConnect} disabled={vncConnectionStatus === "connecting" || vncConnectionStatus === "connected"}>
                  LIVE VIEW
                </Button>
                <Button style={{marginLeft: '10px'}} variant="outlined" onClick={handleDisconnect} disabled={vncConnectionStatus === "disconnected"}>
                  Disconnect
              </Button>
          </Box>

>>>>>>> a9bd9cf355893b94cbad90974d11a005bd34d4f2
            {selectedSession && (
              <VncScreen session={selectedSession} onUpdateState={setVncConnectionStatus} />
            )}
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Data Set
          </Typography>
          <DataSetTable excelData={excelData} />
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default ResponsivePage;
