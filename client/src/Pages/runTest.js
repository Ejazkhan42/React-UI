import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Styles/run.css";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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
  const [testCaseString, setTestCaseString] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [gridMode, setGridMode] = useState('on');
  const[message,setMessages]=useState(null)

  // Initialize testCaseString with selected test cases from location state
  useEffect(() => {
    const { testCaseString: initialSelected } = location.state || { testCaseString: '' };
    if (initialSelected) {
      // Parse the string and split by comma and remove surrounding double quotes
      const parsedTestCaseString = initialSelected.split('","').map((item) => item.replace(/"/g, ''));
      setTestCaseString(parsedTestCaseString);
    }
  }, [location.state]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]); // Debugging: Check the selected file
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('jobName', 'TestCase');
    formData.append('testCase', testCaseString.join(','));
    formData.append('gridMode', gridMode);
    formData.append('browsers', selectedBrowser);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      
      const response = await fetch('http://localhost:5000/build', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessages("Success")
        // console.log('Success:', result);
        // Handle success response
      } else {
        console.error('Error:', response.statusText);
        // Handle error response
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <div className='mcw'>
      <div className=''>
        <div className=''>
          <h1>Run Tests</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Test Cases</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={testCaseString}
                  onChange={(event) => setTestCaseString(event.target.value)}
                  input={<OutlinedInput label="Test Cases" />}
                  MenuProps={MenuProps}
                >
                  {testCaseString.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className='mb-3'>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel  id="browser-select-label">Browser</InputLabel>
                <Select
                  className='form-control'
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
            </div>
            <div className='mb-3'>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="grid-mode-select-label">Grid Mode</InputLabel>
                <Select className='form-control'
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
            </div>
            <div className='mb-3'>
              <input
                type="file"
                className='form-control'
                onChange={handleFileChange}
                sx={{ m: 1, width: 300 }}
                style={{ display: 'block', margin: '1em 0' }}
              />
            </div>
            <div>
              <Button
                type="submit"
                className='btn btn-primary'
                variant="contained"
                sx={{ m: 1, width: 300 }}
              >
                Submit
              </Button>
            </div>
          </form>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}

export default Run;
