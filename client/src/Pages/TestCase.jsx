import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Checkbox,
  Grid,
  Box,
  Typography
} from '@mui/material';
import axios from 'axios';
import './Styles/testcasepage.css';

const TestCasePage = () => {
  const location = useLocation();
  const { moduleId, moduleName } = location.state;
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (moduleId) {
      const fetchTestCases = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/testcase?id=${moduleId}`, { withCredentials: true });
          setTestCases(response.data);
        } catch (error) {
          console.error('Error fetching test cases:', error);
        }
      };
      fetchTestCases();
    }
  }, [moduleId]);

  const handleCheckboxChange = (event, testCaseId) => {
    setSelectedTestCases((prev) => {
      if (event.target.checked) {
        return [...prev, testCaseId];
      } else {
        return prev.filter((id) => id !== testCaseId);
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.Test_Case.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunClick = () => {
    const selectedTestCaseNames = filteredTestCases
      .filter((testCase) => selectedTestCases.includes(testCase.Id))
      .map((testCase) => testCase.Test_Case)
      .join(', ');

    console.log("Selected Test Cases:", selectedTestCaseNames);
    // Add logic to handle selected test cases (e.g., navigation or API call)
  };

  return (
    <Box p={3}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Typography variant="h4">{moduleName}</Typography>
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="space-between">
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="search">Search</InputLabel>
            <OutlinedInput
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              label="Search"
              style={{ fontSize: '1.5rem' }} /* Increased font size for input */
            />
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleRunClick} sx={{ ml: 2 }} style={{ fontSize: '1.5rem' }}>
            Run
          </Button>
        </Grid>
      </Grid>
      <Table sx={{ mt: 3, borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <TableHead className="table-head">
          <TableRow>
            <TableCell style={{ fontSize: '1.5rem' }}>ID</TableCell>
            <TableCell style={{ fontSize: '1.5rem' }}>Test Case Name</TableCell>
            <TableCell style={{ fontSize: '1.5rem' }}>Description</TableCell>
            <TableCell style={{ fontSize: '1.5rem' }}>Select</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTestCases.map((testCase) => (
            <TableRow key={testCase.Id} sx={{ backgroundColor: '#f9f9f9', '&:hover': { backgroundColor: '#f1f1f1' } }}>
              <TableCell style={{ fontSize: '1.5rem' }}>{testCase.Id}</TableCell>
              <TableCell style={{ fontSize: '1.5rem' }}>{testCase.Test_Case}</TableCell>
              <TableCell style={{ fontSize: '1.5rem' }}>{testCase.Description}</TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedTestCases.includes(testCase.Id)}
                  onChange={(event) => handleCheckboxChange(event, testCase.Id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TestCasePage;
