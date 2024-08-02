import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DeleteForeverRounded as DeleteForeverRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
  AddCircleOutlineRounded as AddCircleOutlineRoundedIcon,
} from "@mui/icons-material";
import "./../Styles/usersSetting.css";
const APPI_URL=process.env.REACT_APP_APPI_URL
function formatIsoDate(date) {
  return date.split("T")[0];
}

function UsersSetting() {
  const [usersData, setUsersData] = useState([]);
  const [usersUpdated, setUsersUpdated] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newUserDetails, setNewUserDetails] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [newUserPopup, setNewUserPopup] = useState(false);
  const [role, setRole] = useState([]);
  const [selectRole, setSelectRole] = useState('');
  useEffect(() => {
    axios
      .get(`${APPI_URL}/role`, { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setRole(res.data);
        }
      });
  },[]);
  useEffect(() => {
    axios
      .get(`${APPI_URL}/getusers`, { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          setUsersUpdated(false);
          setUsersData(res.data);
        }
      });
  }, [usersUpdated]);

  const handleDelete = (id) => {
    setDeleteUserId(id);
  };

  const handleDeleteConfirm = () => {
    axios
      .post(
        `${APPI_URL}/deleteuser`,
        {
          userId: deleteUserId,
        },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data === "success") {
          setUsersUpdated(true);
          setDeleteUserId(null);
        }
      });
  };

  const handleAddNewUser = () => {
    axios
      .post(
        `${APPI_URL}/newuser`,
        {
          userDetails: newUserDetails,
        },
        { withCredentials: true },
      )
      .then((res) => {
        if (res.data === "success") {
          setNewUserDetails({
            username: "",
            password: "",
            role: "",
          });
          setUsersUpdated(true);
          setNewUserPopup(false);
        }
      });
  };

  const selectRoleInputChange = (event) => {
    setSelectRole(event.target.value);
    setNewUserDetails({
      ...newUserDetails,
      role: selectRole,
    });
  };

  const AdminUsers = () => {
    const filteredUsers = usersData.filter((user) => user.role_id === 1);

    return (
      <div className="usersColumn">
        <div className="usersInfo">
          <Typography variant="h5" className="usersInfoHeader" align="center">
            Admin users
          </Typography>
          <Typography
            variant="body1"
            className="usersInfoText"
            align="center"
            style={{ fontSize: "0.9rem",textAlign:"justify" }}
          >
            Admins have access to all of the content, including all
            functionality of app, they also can create new users and remove or
            edit existing ones.
          </Typography>
        </div>
        <div className="adminUsersTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Data created</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 !== 0 ? "darkerTableBg" : ""}
                  >
                    <TableCell align="center">
                      <AccountCircleRoundedIcon className="maincolor" />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell align="center">
                      {formatIsoDate(user.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        className="clickable"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  const NormalUsers = () => {
    const filteredUsers = usersData.filter((user) => user.role_id !== 1);

    return (
      <div className="usersColumn">
        <div className="usersInfo">
          <Typography variant="h5" className="usersInfoHeader" align="center">
            Normal users
          </Typography>
          <Typography
            variant="body1"
            className="usersInfoText"
            align="center"
            style={{ fontSize: "0.9rem",textAlign:"justify" }}
          >
            Normal users have access to pages and subpages of: Instance, Customer, Modules, Jobs, Progress and Dashboard. They can add, edit and remove Customer and
            Instance.
          </Typography>
        </div>
        <div className="normalUsersTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Data created</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 !== 0 ? "darkerTableBg" : ""}
                  >
                    <TableCell align="center">
                      <AccountCircleRoundedIcon className="maincolor" />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell align="center">
                      {formatIsoDate(user.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        className="clickable"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteForeverRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  const AddNewUserSection = () => {
    return (
      <div className="addNewUserWrap">
        <Typography variant="h6" className="addNewUserText">
          Add new User
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2, fontSize: "1.2rem", backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' } }}
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={() => setNewUserPopup(true)}
        >
          Add
        </Button>
      </div>
    );
  };

  return (
    <div className="usersSettingWrap">
      <AddNewUserSection />

      <AdminUsers />
      <NormalUsers />

      <Dialog
        open={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={newUserPopup}
        onClose={() => setNewUserPopup(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            value={newUserDetails.username}
            onChange={(e) =>
              setNewUserDetails({
                ...newUserDetails,
                username: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            value={newUserDetails.password}
            onChange={(e) =>
              setNewUserDetails({
                ...newUserDetails,
                password: e.target.value,
              })
            }
          />

          <Select
            value={selectRole}
            onChange={selectRoleInputChange}
            style={{ width: "100%" }}
          >
            {role.map((name) => (
              <MenuItem value={name.id}>{name.role_name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserPopup(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UsersSetting;
