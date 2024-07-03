import React from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import './Styles/progress.css';

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

const DataSetTable = () => {
  const rows = [
    { id: 1, type: 'Standard', use: 'Position', bu: 'US1', jobName: 'Admin', positionName: 'Admin', title: 'Admin 1', location: 'US' },
    { id: 2, type: 'Pipeline', use: 'Job', bu: 'US2', jobName: 'Admin', positionName: 'Admin', title: 'Admin 2', location: 'AU' },
    { id: 3, type: 'Standard', use: 'Job', bu: 'US3', jobName: 'Accountant', positionName: 'Accountant', title: 'Accountant 1', location: 'US' },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell fontSize="1.2rem">S.No</TableCell>
            <TableCell>Requisition Type</TableCell>
            <TableCell>Use</TableCell>
            <TableCell>BU</TableCell>
            <TableCell>Job Name</TableCell>
            <TableCell>Position Name</TableCell>
            <TableCell>Requisition Title</TableCell>
            <TableCell>Locations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.use}</TableCell>
              <TableCell>{row.bu}</TableCell>
              <TableCell>{row.jobName}</TableCell>
              <TableCell>{row.positionName}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ResponsivePage = () => {
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom fontSize={'1.5rem'}>
            Running
          </Typography>
          <Typography variant="body2" fontSize={'1.2rem'}>
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
            <iframe
              title="ui-browser"
              src="https://ui-browser.vercel.app/free-style/gaming-guest"
              style={{ border: '0' }}
              width={'100%'}
              height={'100%'}              
            ></iframe>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Data Set
          </Typography>
          <DataSetTable />
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default ResponsivePage;
