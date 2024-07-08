import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

function Instances() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    environmentUrl: "",
    devNumber: "",
    username: "",
    password: "",
    envName: "",
    user_id: "",
    module_id: "",
    instance_url: "",
    instance_username: "",
    instance_password: "",
  });

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getenv", { withCredentials: true });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    }
    fetchEnv();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/newenv", formData, { withCredentials: true });
      setData([...data, formData]);
      setFormData({
        username: "",
        password: "",
        environmentUrl: "",
        devNumber: "",
        envName: "",
        user_id: "",
        module_id: "",
        instance_url: "",
        instance_username: "",
        instance_password: "",
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (rowIndex) => {
    try {
      const idToDelete = data[rowIndex]._id; // Assuming your instance data has an _id field
      await axios.delete(`http://localhost:5000/deletenv/${idToDelete}`, { withCredentials: true });
      const updatedData = [...data];
      updatedData.splice(rowIndex, 1);
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  };

  const handleUpdate = async (rowIndex) => {
    try {
      const idToUpdate = data[rowIndex]._id; // Assuming your instance data has an _id field
      await axios.put(`http://localhost:5000/updateenv/${idToUpdate}`, formData, { withCredentials: true });
      const updatedData = [...data];
      updatedData[rowIndex] = formData;
      setData(updatedData);
      handleClose();
    } catch (error) {
      console.error('Error updating instance:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Instances</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '1.2rem' }}>Username</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Password</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Environment URL</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Dev Number</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Env Name</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>User ID</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Module ID</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Instance URL</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Instance Username</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Instance Password</TableCell>
              <TableCell sx={{ fontSize: '1.2rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.username}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.password}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.environmentUrl}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.devNumber}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.envName}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.user_id}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.module_id}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.instance_url}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.instance_username}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{row.instance_password}</TableCell>
                <TableCell>
                  <Button color="primary" startIcon={<EditIcon />} onClick={() => handleUpdate(index)}>
                    Update
                  </Button>
                  <Button color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Instance</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="environmentUrl"
            label="Environment URL"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.environmentUrl}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="devNumber"
            label="Dev Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.devNumber}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="envName"
            label="Env Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.envName}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="user_id"
            label="User ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.user_id}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="module_id"
            label="Module ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.module_id}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="instance_url"
            label="Instance URL"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.instance_url}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="instance_username"
            label="Instance Username"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.instance_username}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
          <TextField
            margin="dense"
            name="instance_password"
            label="Instance Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.instance_password}
            onChange={handleChange}
            sx={{ fontSize: '1.2rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Instances;
