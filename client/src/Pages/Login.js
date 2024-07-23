import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Link, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import './Styles/login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English');

  const login = () => {
    axios.post("http://localhost:5000/login", {
      username,
      password
    }, { withCredentials: true }).then(res => {
      if (res.data === 'success') {
        window.location.href = '/customers';
      }
    }).catch(error => {
      console.error('Login error:', error);
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <Typography variant="h4" className="login-title">
          Sign In
        </Typography>
        <Typography variant="h2" className="login-subtitle">
          Doings ERP
        </Typography>
      </div>
      <Container className="login-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} className="login-paper">
          <Box px={3} pt={2}>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <AccountCircleIcon fontSize="large" />
              <TextField
                label="User ID"
                variant="standard"
                fullWidth
                margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10 }}
              />
            </Box>
            <Box display="flex" alignItems="flex-end" mb={2}>
              <LockOutlinedIcon fontSize="large" />
              <TextField
                label="Password"
                variant="standard"
                fullWidth
                margin="dense"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: 10, fontSize:"1.5rem" }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  )
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Link href="#" underline="none" className="forgot-password">
                Forgot Password
              </Link>
            </Box>
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                // color="primary"
                onClick={login}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    login();
                  }
                }}
                className="sign-in-button"
                style={{ background: "#333", fontSize:"1.5rem" }}
              >
                Sign In
              </Button>
            </Box>
            <Box mt={3}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="language-select-label"><LanguageIcon style={{ marginRight: '10px' }} /> Select Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
