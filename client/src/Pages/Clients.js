import React, { useState, useEffect, useContext } from "react";
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
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";

function Clients() {
  const ctx = useContext(AuthLoginInfo);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    clientName: "",
    envName: "",
    username: ctx.username,
    instance_url: "",
    instance_username: "",
    instance_password: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customer?user_id=1", { withCredentials: true });
        // Assuming the response contains multiple clients with client names as keys
        const clientsData = [];
        Object.keys(response.data).forEach(clientName => {
          // Add client name to each client object
          response.data[clientName].forEach(client => {
            clientsData.push({ ...client, clientName });
          });
        });
        setData(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setData([]);
      }
    };
    fetchClients();
  }, []);
  
console.log(data)
  const handleClickOpen = (clientIndex = null) => {
    if (clientIndex !== null) {
      setIsEdit(true);
      setCurrentClient(clientIndex);
      setFormData(data[clientIndex]);
    } else {
      setIsEdit(false);
      setFormData({
        clientName:"",
        envName: "",
        username: ctx.username,
        instance_url: "",
        instance_username: "",
        instance_password: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      clientName:"",
      envName: "",
      username: ctx.username,
      instance_url: "",
      instance_username: "",
      instance_password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/customerupdate/${data[currentClient]._id}`, formData, { withCredentials: true });
        const updatedData = [...data];
        updatedData[currentClient] = formData;
        setData(updatedData);
      } else {
        const response = await axios.post("http://localhost:5000/addcustomer", formData, { withCredentials: true });
        setData([...data, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (clientIndex) => {
    try {
      const idToDelete = data[clientIndex]._id;
      await axios.delete(`http://localhost:5000/deletecustomer/${idToDelete}`, { withCredentials: true });
      const updatedData = data.filter((_, index) => index !== clientIndex);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
          Clients
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleClickOpen()}>
          Add Client
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "1.2rem" }}>Customer</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Env Name</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Instance URL</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Instance Username</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Instance Password</TableCell>
              <TableCell sx={{ fontSize: "1.2rem" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((client, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "1.2rem" }}>{client.clientName}</TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}>{client.envName}</TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}>{client.instance_url}</TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}>{client.instance_username}</TableCell>
                <TableCell sx={{ fontSize: "1.2rem" }}>{client.instance_password}</TableCell>
                <TableCell>
                  <Button startIcon={<EditIcon />} onClick={() => handleClickOpen(index)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(index)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Client" : "Add Client"}</DialogTitle>
        <DialogContent>
        <TextField
            margin="dense"
            label="Customer Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Env Name"
            name="envName"
            value={formData.envName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance URL"
            name="instance_url"
            value={formData.instance_url}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance Username"
            name="instance_username"
            value={formData.instance_username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Instance Password"
            name="instance_password"
            value={formData.instance_password}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Clients;
