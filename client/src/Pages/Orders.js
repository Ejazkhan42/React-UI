import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState, useContext } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Button, Checkbox } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import "./Styles/order.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, selectedName, theme) => {
  return {
    fontWeight: selectedName === name ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
  };
};

function Orders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [modules, setModules] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]); // State to hold selected test cases
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

  useEffect(() => {
    if (selectedModuleId) {
      const fetchTestCases = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/testcase?id=${selectedModuleId}`, { withCredentials: true });
          setTestCases(response.data);
        } catch (error) {
          console.error('Error fetching test cases:', error);
        }
      };
      fetchTestCases();
    }
  }, [selectedModuleId]);

  const handleModuleChange = (event) => {
    setSelectedModuleId(event.target.value);
  };

  const handleCheckboxChange = (event, testCaseId) => {
    setSelectedTestCases((prev) => {
      if (event.target.checked) {
        return [...prev, testCaseId];
      } else {
        return prev.filter((id) => id !== testCaseId);
      }
    });
  };

  const handleRunClick = () => {
    const selectedTestCaseNames = testCases
      .filter((testCase) => selectedTestCases.includes(testCase.Id))
      .map((testCase) => testCase.Test_Case)
      .join(', ');

    navigate('/run', { state: { testCaseString: selectedTestCaseNames } });
  };

  return (
    <div className="mcw">
      <div className="">
        <div className="">
          <h1>Test Scripts</h1>
          <div>
            <FormControl sx={{ m: 1, width: 300 }} className="w-72">
              <InputLabel id="demo-single-module-label">Modules</InputLabel>
              <Select
                labelId="demo-single-module-label"
                id="demo-single-module"
                value={selectedModuleId}
                onChange={handleModuleChange}
                input={<OutlinedInput label="Modules" />}
                MenuProps={MenuProps}
              >
                {modules.map((module) => (
                  <MenuItem
                    key={module.Id}
                    value={module.Id}
                    style={getStyles(module.Id, selectedModuleId, theme)}
                  >
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="orderWrap">
            <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Test Case Name</TableCell>
                  <TableCell>Descriptions</TableCell>
                  <TableCell>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testCases.map((testCase) => (
                  <TableRow key={testCase.Id}>
                    <TableCell>{testCase.Id}</TableCell>
                    <TableCell>{testCase.Test_Case}</TableCell>
                    <TableCell>{testCase.Description}</TableCell>
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
            <Button variant="contained" color="primary" onClick={handleRunClick}>
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
