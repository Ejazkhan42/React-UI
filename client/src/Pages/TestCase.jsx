import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  ListItemText,
  IconButton,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { v4 as uuid } from 'uuid';

const APPI_URL = process.env.REACT_APP_APPI_URL;
let JOBNAME;

const uuidFromUuidV4 = () => uuid();

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
  const { moduleId, JOB } = location.state || {};
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
  const [buttonDisableFile, setButtonDisableFile] = useState(false);
  const [buttonDisableImage, setButtonDisableImage] = useState(false);
  const [filePopUp, setFilePopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setSearchQuery(event.target.value);
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on new search
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.Test_Case.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredTestCases.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setSelectedTestCases((prevSelectedTestCases) =>
      isChecked ? [...prevSelectedTestCases, id] : prevSelectedTestCases.filter((testCaseId) => testCaseId !== id)
    );
  };

  const handleRunClick = () => {
    const selectedTestCaseNames = paginatedData
      .filter((testCase) => selectedTestCases.includes(testCase.id))
      .map((testCase) => testCase.Test_Case)
      .join(', ');

    setTestCaseList(selectedTestCaseNames ? selectedTestCaseNames.split(', ').map((item) => item.replace(/"/g, '')) : []);
    setButtonDisableFile(false);
    setButtonDisableImage(false);
    setOpenModal(true);
  };

  const handleFileChange = async (event) => {
    if (event.target.files !== undefined) {
      setSelectedFile(event.target.files[0]);
      setButtonDisableFile(true);
      setFilePopUp(true);
      setTimeout(() => {
        setFilePopUp(false);
      }, 3000);
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = 'Test_Data';
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const filteredData = jsonData.filter((entry) => changeList.includes(entry['Test Data']));
      setExcelData(filteredData);
    }
  };

  const handleImageFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedImageFile(event.target.files[0]);
      setButtonDisableImage(true);
      setFilePopUp(true);
    }

    setTimeout(() => {
      setFilePopUp(false);
    }, 3000);
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
    setIsLoading(true);
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
        navigate('/Progress', { state: { excelData } });
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCaseChange = (event) => {
    const { value } = event.target;
    if (value !== null) {
      setChangeList(value);
    }
  };

  const handleSelectEnvChange = (event) => {
    const { value } = event.target;
    if (value != null) {
      setSelectedEnv(value);
    }
  };

  const handleCloseModal = () => {
    setButtonDisableFile(false);
    setButtonDisableImage(false);
    setOpenModal(false);
  };

  const Filepopup = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: '#393E46', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px', 
      animation: 'fadeInOut 6s ease-in-out' 
    }}>
      <span>File Selected Successfully</span>
    </div>
  );

  return (
    <Container>
      <StyledPaper>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h5" component="h2" gutterBottom>
              Test Cases
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', }}>
          <Button
              variant="contained"
              color="primary"
              onClick={handleRunClick}
              disabled={selectedTestCases.length === 0}
              sx={{ backgroundColor: 'gray', '&:hover': { backgroundColor: 'gray' }, marginRight: '10px' }}
            >
              Run
            </Button>

            <TextField
              label="Search Test Cases"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedTestCases.length > 0 &&
                          selectedTestCases.length < testCases.length
                        }
                        checked={testCases.length > 0 && selectedTestCases.length === testCases.length}
                        onChange={(event) =>
                          setSelectedTestCases(
                            event.target.checked ? testCases.map((testCase) => testCase.id) : []
                          )
                        }
                        inputProps={{ 'aria-label': 'select all test cases' }}
                      />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Test Case</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((testCase) => (
                    <TableRow key={testCase.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedTestCases.includes(testCase.id)}
                          onChange={(event) => handleCheckboxChange(event, testCase.id)}
                          inputProps={{ 'aria-label': `select test case ${testCase.id}` }}
                        />
                      </TableCell>
                      <TableCell>{testCase.id}</TableCell>
                      <TableCell>{testCase.Test_Case}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredTestCases.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={(_, newPage) => setCurrentPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(0);
              }}
            />
          </Grid>
          
        </Grid>
      </StyledPaper>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          component="form"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
          onSubmit={handleSubmit}
        >

          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            {filePopUp && <Filepopup />}
              <Typography variant="h6" component="h2" gutterBottom>
                Run Configuration
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Test Case"
                value={testCaseList.join(',')}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Browser</InputLabel>
                <Select value={selectedBrowser} onChange={(e) => setSelectedBrowser(e.target.value)}>
                  <MenuItem value="chrome">Chrome</MenuItem>
                  <MenuItem value="firefox">Firefox</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel sx={{ paddingBottom: '5%' }}>Grid Mode</InputLabel>
                <Select value={gridMode} onChange={(e) => setGridMode(e.target.value)}>
                  <MenuItem value="on">On</MenuItem>
                  <MenuItem value="off">Off</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ backgroundColor: 'gray', '&:hover': { backgroundColor: 'gray' } }}
              >
                Upload Test Data
                <VisuallyHiddenInput type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              </Button>
              {selectedFile && <Typography variant="caption">{selectedFile.name}</Typography>}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ backgroundColor: 'gray', '&:hover': { backgroundColor: 'gray' } }}
              >
                Upload Image
                <VisuallyHiddenImageInput type="file" accept="image/*" onChange={handleImageFileChange} />
              </Button>
              {selectedImageFile && <Typography variant="caption">{selectedImageFile.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ backgroundColor: 'gray', '&:hover': { backgroundColor: 'gray' } }}
              >
                Submit
              </Button>
            </Grid>
            {isLoading && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <CircularProgress />
              </Grid>
            )}
            {message && (
              <Grid item xs={12}>
                <Typography variant="body2" color="success.main">
                  {message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>
    </Container>
  );
};

export default TestCasePage;
