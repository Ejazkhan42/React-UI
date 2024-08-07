import React, { useEffect, useState ,useContext} from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  TextField,
  TablePagination,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { v4 as uuid } from 'uuid';
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
const APPI_URL = process.env.REACT_APP_APPI_URL

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
  const ctx = useContext(AuthLoginInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = location.state || {};
  const { JOB } = location.state || {};
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
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
  const [buttondisableFile, setbuttondisableFile] = useState(false)
  const [buttondisableImage, setbuttondisableImage] = useState(false)
  const [data, setData] = useState([]);
  const [error, seterror] = useState('')
  useEffect(() => {
    let env = JSON.parse(localStorage.getItem('env'))

    if (env == undefined || env == '') {
      const fetchClients = async () => {
        try {
          const response = await axios.get(`${APPI_URL}/getbycustomer?user_id=${ctx.id}`, { withCredentials: true });
          // Assuming the response contains multiple clients with client names as keys
          const clientsData = [];
          Object.keys(response.data).forEach(clientName => {
            // Add client name to each client object
            response.data[clientName].forEach(client => {
              clientsData.push({ ...client, clientName });
            });
          });
          setData(clientsData);
          localStorage.setItem("env", JSON.stringify(clientsData))
        } catch (error) {
          console.error("Error fetching clients:", error);
          setData([]);
        }
      };
      fetchClients();
    }
    else {
      setSelectEnv(env);
    }


  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      const fetchTestCases = async () => {
        try {
          const response = await axios.get(`${APPI_URL}/testcase?id=${moduleId}`, { withCredentials: true });
          // console.log(response.data);
          if (response.data != null) {
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
    setCurrentPage(0);
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.Test_Case.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const paginatedData = filteredTestCases.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

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
    setbuttondisableFile(false)
    setbuttondisableImage(false)
    setOpenModal(true);
  };

  const handleFileChange = async (event) => {
    if (event.target.files !== undefined) {
      setSelectedFile(event.target.files[0]);
      setbuttondisableFile(true)
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = "Test_Data";
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const filteredData = jsonData.filter(entry =>
        testCaseList.includes(entry["Test Data"])
      );
    
      setExcelData(filteredData);
    }
  };

  const handleImageFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedImageFile(event.target.files[0]);
      setbuttondisableImage(true)
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (selectEnv.map((env) => env.Jenkins_Path)) {
      try{
      const JOB = selectEnv.map((env) => env.Jenkins_Path)
      JOBNAME=JOB[0]
      }catch{
        JOBNAME = selectEnv.map((env) => env.Jenkins_Path)
      }
      
    }


    const formData = new FormData();
    formData.append('JobName', JOBNAME);
    formData.append('TestCase', testCaseList.join(','));
    formData.append('GridMode', gridMode);
    formData.append('Browsers', selectedBrowser);

    if (localStorage.getItem('Token') !== null) {
      formData.append('Token', localStorage.getItem('Token'));
    } else {
      const id = uuidFromUuidV4();
      localStorage.setItem('Token', id);
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
        navigate('/Progress', { state: { excelData } });
      } else {
        console.error('Error:', response.statusText);
        setMessage("Error Job Name Or Jenkins Details Invalid Login Error")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSelectEnvChange = (event) => {
    const { value } = event.target;
    if (value != null) {
      setSelectedEnv(value);
    }
  };

  const handleCloseModal = () => {
    setbuttondisableFile(false)
    setbuttondisableImage(false)
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
              <h1 style={{ textAlign: "center" }}>Run Your Test</h1>
            </Grid>
            {message && (
              <Box mb={2} textAlign="center">
                <Typography color="error" variant="body2">
                  {message}
                </Typography>
              </Box>
            )}
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
                        input={<OutlinedInput label="Test Cases" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                     
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
                          <MenuItem key={env.envName} value={env.envName}>
                            <ListItemText primary={env.envName} sx={{ fontSize: "1.2rem" }} />
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
                        <MenuItem sx={{ fontSize: "1.2rem" }} value="firefox">Firefox</MenuItem>
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
                      disabled={buttondisableFile == true}
                      sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
                      tabIndex={-1}
                      style={{ marginLeft: '15%' }}
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
                      disabled={buttondisableImage == true}
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}

                    >
                      Upload image
                      <VisuallyHiddenImageInput type="file" name='image' onChange={handleImageFileChange} />
                    </Button>

                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth
                      sx={{ ml: 2, fontSize: "1rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}

                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>

            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default TestCasePage;
