import React, { useEffect, useState } from 'react';
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
  Typography,
  IconButton,
  Modal,
  Select,
  MenuItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack, ArrowForward, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import './Styles/testcasepage.css';
import { v4 as uuid } from 'uuid'

const uuidFromUuidV4 = () => {
  const newUuid = uuid()
  return newUuid
}

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
  const { moduleId, moduleName } = location.state || {};
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false); // State for modal visibility

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [gridMode, setGridMode] = useState('on');
  const [message, setMessage] = useState(null);
  const [testCaseList, setTestCaseList] = useState([]);
  const [changeList, setChangeList] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const entriesPerPage = 5;

  useEffect(() => {
    if (moduleId !== null) {
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
    setCurrentPage(1); // Reset to the first page on new search
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.Test_Case.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestCases.length / entriesPerPage);
  const currentEntries = filteredTestCases.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleRunClick = () => {
    const selectedTestCaseNames = currentEntries
      .filter((testCase) => selectedTestCases.includes(testCase.Id))
      .map((testCase) => testCase.Test_Case)
      .join(', ');

    setTestCaseList(selectedTestCaseNames ? selectedTestCaseNames.split(', ').map(item => item.replace(/"/g, '')) : []);
    setOpenModal(true); // Open the modal
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImageFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedImageFile(event.target.files[0]);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = uuidFromUuidV4();
    console.log(id)
    const formData = new FormData();
    formData.append('jobName', 'TestCase');
    formData.append('testCase', testCaseList.join(','));
    formData.append('gridMode', gridMode);
    formData.append('browsers', selectedBrowser);
    formData.append('Token', id);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    try {
      const response = await fetch('http://103.91.186.135:5000/build', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Success");
        navigate('/progress');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTestCaseChange = (event) => {
    const { value } = event.target;
    // setTestCaseList(value.length > 0 ? value : []);
   if (value.length > 0) {
    setChangeList(value);
   }

  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box p={3} className="table-container">
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
              style={{ fontSize: '1.5rem' }} // Increased font size for input
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
          </TableRow>
        </TableHead>
        <TableBody>
          {currentEntries.map((testCase) => (
            <TableRow key={testCase.Id} sx={{ backgroundColor: '#f9f9f9', '&:hover': { backgroundColor: '#f1f1f1' } }}>
              <TableCell style={{ fontSize: '1.5rem' }}>
                {testCase.Id}
                <Checkbox
                  checked={selectedTestCases.includes(testCase.Id)}
                  onChange={(event) => handleCheckboxChange(event, testCase.Id)}
                />
              </TableCell>
              <TableCell style={{ fontSize: '1.5rem' }}>{testCase.Test_Case}</TableCell>
              <TableCell style={{ fontSize: '1.5rem' }}>{testCase.Description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
        <Grid item>
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>

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
              <h1>Run Tests</h1>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">Test Cases</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={changeList}
                        onChange={handleTestCaseChange}
                        input={<OutlinedInput label="Test Cases" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {testCaseList.map((testCase) => (
                          <MenuItem key={testCase} value={testCase}>
                            <ListItemText primary={testCase} />
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
                      >
                        <MenuItem value="chrome">Chrome</MenuItem>
                        <MenuItem value="firefox">Firefox</MenuItem>
                        <MenuItem value="edge">Edge</MenuItem>
                        <MenuItem value="safari">Safari</MenuItem>
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
                        <MenuItem value="on">On</MenuItem>
                        <MenuItem value="off">Off</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload file
                      <VisuallyHiddenInput type="file" name='file' onChange={handleFileChange} />
                    </Button>
                    
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      style={{ marginLeft: '10px' }}
                    >
                      Upload image
                      <VisuallyHiddenImageInput type="file" name='image' onChange={handleImageFileChange} />
                    </Button>
                  
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
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
