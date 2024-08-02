import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLoginInfo } from "../AuthComponents/AuthLogin";

const APPI_URL=process.env.REACT_APP_APPI_URL

const CustomersPage = () => {
    const [customers, setCustomers] = useState({});
    const navigate = useNavigate();
    const ctx = useContext(AuthLoginInfo);
    
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${APPI_URL}/getbycustomer?user_id=${ctx.id}`, { withCredentials: true });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleClick = (key) => {
        const customer=customers[key]
        localStorage.setItem("env",JSON.stringify(customer))
        navigate('/env', { state: { variables: customers[key] } });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
            <TableContainer component={Paper} style={{ width: '100%', maxWidth: '800px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '60px' }}>
                                <Typography variant="h6" style={{ fontSize: '1.2rem' }}>Icon</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="h6" style={{ fontSize: '1.2rem' }}>Customer</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(customers).map((key) => (
                            <TableRow key={key} hover>
                                <TableCell onClick={() => handleClick(key)} style={{ width: '60px', textAlign: 'center', cursor: 'pointer' }}>
                                    <IconButton onClick={() => handleClick(key)} style={{ fontSize: '1.2rem' }}>
                                        <FolderIcon color="primary" fontSize='2rem'/>
                                    </IconButton>
                                </TableCell>
                                <TableCell onClick={() => handleClick(key)} style={{ cursor: 'pointer' }}>
                                    <Typography onClick={() => handleClick(key)} variant="body1" style={{ fontSize: '1.2rem' }}>
                                        {key}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default CustomersPage;
