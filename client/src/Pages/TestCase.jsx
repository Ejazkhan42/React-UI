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
  Checkbox,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  IconButton,
  TextField,
  TablePagination,
} from '@mui/material';
import { ArrowBack, ArrowForward, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { v4 as uuid } from 'uuid';

const APPI_URL=process.env.REACT_APP_APPI_URL

let JOBNAME

const uuidFromUuidV4 = () => {
  const newUuid = uuid();
  return newUuid;
};


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

const StyledPaper = styled(Paper)({
  padding: '16px',
  marginBottom: '16px',
  textAlign: 'left',
  color: '#333',
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const VisuallyHiddenImageInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TestCasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = location.state || {};
  const {JOB}=location.state||{};
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [gridMode, setGridMode] = useState('on');
  const [message, setMessage] = useState(null);
  const [testCaseList, setTestCaseList] = useState([]);
  const [changeList, setChangeList] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [selectEnv, setSelectEnv] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  if(JOBNAME==undefined){
    if(JOB!='' && JOB!=undefined){
      JOBNAME=JOB
    }
    else{
        JOBNAME='TestCase';
    }
    
  }

  useEffect(() => {
    axios.get(`${APPI_URL}/getenv`, { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setSelectEnv(res.data);
        }
      });
  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      const fetchTestCases = async () => {
        try {
          const response = await axios.get(`${APPI_URL}/testcase?id=${moduleId}`, { withCredentials: true });
          // console.log(response.data);
          if(response.data != null) {
            setTestCases(response.data);
          } 
        } catch (error) {
          console.error('Error fetching test cases:', error);
        }
      };
      fetchTestCases();
    }
  }, [moduleId]);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on new search
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.Test_Case.toLowerCase().includes(searchTerm.toLowerCase())
  );


  

  const paginatedData = filteredTestCases.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
  // console.log(paginatedData);

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setSelectedTestCases(prevSelectedTestCases =>
      isChecked
        ? [...prevSelectedTestCases, id]
        : prevSelectedTestCases.filter(id => id !== id)
    );
    
    
  };
  const handleRunClick = () => {
    const selectedTestCaseNames = paginatedData
      .filter((testCase) => selectedTestCases.includes(testCase.id))
      .map((testCase) => testCase.Test_Case)
      .join(', ');

    setTestCaseList(selectedTestCaseNames ? selectedTestCaseNames.split(', ').map(item => item.replace(/"/g, '')) : []);
    setOpenModal(true); // Open the modal
  };

  const handleFileChange = async (event) => {
    if (event.target.files !== undefined) {
      setSelectedFile(event.target.files[0]);
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = "Test_Data";
      console.log(workbook)
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(changeList);
      const filteredData = jsonData.filter(entry => 
        changeList.includes(entry["Test Data"])
    );
      setExcelData(filteredData);
    }
  };

  const handleImageFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedImageFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('jobName', JOBNAME);
    formData.append('testCase', testCaseList.join(','));
    formData.append('gridMode', gridMode);
    formData.append('browsers', selectedBrowser);

    if (localStorage.getItem('token') !== null) {
      formData.append('Token', localStorage.getItem('token'));
    } else {
      const id = uuidFromUuidV4();
      localStorage.setItem('token', id);
      formData.append('Token', id);
    }

    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    try {
      const response = await fetch(`${APPI_URL}/build`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Success');
        navigate('/progress', { state: { excelData } });
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTestCaseChange = (event) => {
    const { value } = event.target;
    //  console.log(value)
    if (value !== null) {
      setChangeList(value);
      console.log(changeList)
    }
  };

  const handleSelectEnvChange = (event) => {
    const { value } = event.target;
    if (value != null) {
      setSelectedEnv(value);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 4, marginLeft: '12%', marginRight: '4%' }}>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
        <Box>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            variant="outlined"
            size="large"
          />
          <Button
            onClick={() => handleRunClick()}
            sx={{ ml: 2, fontSize: "1.2rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
          >
            Run
          </Button>
        </Box>
      </Box>
      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell align="left" sx={{ fontSize: "1.2rem" }}>Test Case</TableCell>
                <TableCell align="left" sx={{ fontSize: "1.2rem" }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((testCase) => (
                <TableRow key={testCase.id}>
                  <TableCell padding="checkbox" sx={{ fontSize: "1.2rem" }}>
                    <Checkbox 
                      onChange={(event) => handleCheckboxChange(event, testCase.id)}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem" }}>{testCase.Test_Case}</TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem" }}>{testCase.Description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTestCases.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(event, newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          sx={{ fontSize: "1.2rem" }}
        />
      </StyledPaper>
    
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 1 
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>Run Your Test</h1>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label" sx={{ fontSize: "1.2rem" }}>Test Cases</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={changeList}
                        // onChange={handleTestCaseChange}
                        input={<OutlinedInput label="Test Cases" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        // sx={{ fontSize: "1.2rem" }}
                      >
                        {testCaseList.map((testCase) => (
                          <MenuItem key={testCase} value={testCase} sx={{ fontSize: "1.2rem" }}>
                            <ListItemText primary={testCase} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label" sx={{ fontSize: "1.2rem" }}>Select Env</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selectedEnv}
                        onChange={handleSelectEnvChange}
                        input={<OutlinedInput label="Test Cases" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        sx={{ fontSize: "1.2rem" }}
                      >
                        {selectEnv.map((env) => (
                          <MenuItem key={env.id} value={env.envName}>
                            <ListItemText primary={env.envName} sx={{ fontSize: "1.2rem" }}/>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="browser-select-label">Browser</InputLabel>
                      <Select
                        labelId="browser-select-label"
                        id="browser-select"
                        value={selectedBrowser}
                        onChange={(event) => setSelectedBrowser(event.target.value)}
                        input={<OutlinedInput label="Browser" />}
                        MenuProps={MenuProps}
                        sx={{ fontSize: "1.2rem" }}
                      >
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="chrome">Chrome</MenuItem>
                        <MenuItem  sx={{ fontSize: "1.2rem" }} value="firefox">Firefox</MenuItem>
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="edge">Edge</MenuItem>
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="safari">Safari</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="grid-mode-select-label">Grid Mode</InputLabel>
                      <Select
                        labelId="grid-mode-select-label"
                        id="grid-mode-select"
                        value={gridMode}
                        onChange={(event) => setGridMode(event.target.value)}
                        input={<OutlinedInput label="Grid Mode" />}
                        MenuProps={MenuProps}
                      >
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="on">On</MenuItem>
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="off">Off</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      role={undefined}
                      // variant="contained"
                      sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
                      tabIndex={-1}
                      style={{ marginLeft: '30px' }}
                      startIcon={<CloudUploadIcon />}
                      // sx={{ fontSize: "1.2rem" }}
                    >
                      Upload file
                      <VisuallyHiddenInput type="file" name='file' onChange={handleFileChange} />
                    </Button>
                    
                    <Button
                      component="label"
                      role={undefined}
                      // variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      style={{ marginLeft: '10px' }}
                      sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}

                    >
                      Upload image
                      <VisuallyHiddenImageInput type="file" name='image' onChange={handleImageFileChange} />
                    </Button>
                  
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth 
                    sx={{ ml: 2, fontSize: ".5rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
                    
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <div>{message}</div>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default TestCasePage;
