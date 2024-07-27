import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
const APPI_URL=process.env.REACT_APP_APPI_URL

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

function Run() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTestCaseNames } = location.state || {};
  const initialTestCaseString = selectedTestCaseNames ? selectedTestCaseNames.split(', ').map(item => item.replace(/"/g, '')) : [];
  const [testCaseString, setTestCaseString] = useState(initialTestCaseString);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [gridMode, setGridMode] = useState('on');
  const [message, setMessage] = useState(null);
  const [testCaseList, setTestCaseList] = useState([]);

  const handleFileChange = (event) => {
    if (event.target.files !== undefined) {
      setSelectedFile(event.target.files[0]);
      // //console.log(selectedFile)

    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('jobName', 'TestCase');
    formData.append('testCase', testCaseList.join(','));
    formData.append('gridMode', gridMode);
    formData.append('browsers', selectedBrowser);
    if (selectedFile) {
      console.log(selectedFile)
      formData.append('file', selectedFile);
    }
    //console.log(formData)
    try {
      const response = await fetch(`${appi_url}/build`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Success");
        // navigate('/testcase', { state: { jobName: 'TestCase', testCase: testCaseString.join(','), gridMode, browsers: selectedBrowser, file: selectedFile } });
        navigate('/progress');

      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // navigate('/progress');

  };

  const handleTestCaseChange = (event) => {
    const { value } = event.target;
    // setTestCaseString(value);
    if(value.length > 0){
      setTestCaseList(value);      
    }

    //console.log(testCaseList);
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

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} className={'Base'}>
      <Grid container spacing={2} sx={{ maxWidth: 600 }}>
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
                    value={testCaseList}
                    onChange={handleTestCaseChange}
                    input={<OutlinedInput label="Test Cases" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {testCaseString.map((testCase) => (
                      <MenuItem key={testCase} value={testCase}>
                        {/* <Checkbox checked={testCaseString.indexOf(testCase) > -1} /> */}
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
                // onClick={handleFileChange}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
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
  );
}

export default Run;
