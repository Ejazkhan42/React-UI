import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Styles/clients.css";
import { AuthLoginInfo } from "./../AuthComponents/AuthLogin";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ReadMoreRoundedIcon from "@mui/icons-material/ReadMoreRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import SearchBar from "../Components/SearchBar";
import Pagination from "../Components/Pagination";

function Clients() {
  const ctx = useContext(AuthLoginInfo);
  const [newOrderSubmitted, setNewOrderSubmitted] = useState(false);
  const [clientsData, setClientsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterId, setFilterId] = useState("");

  const handleSearchChange = (newFilteredData) => {
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    setNewOrderSubmitted(false);
    axios
      .get("http://localhost:5000/clients", { withCredentials: true })
      .then((res) => {
        if (res.data != null) {
          const clientsCombined = res.data[0].map((t1) => ({
            ...t1,
            ...res.data[1].find((t2) => t2.client_id === t1.client_id),
          }));
          setClientsData(clientsCombined);
          setFilteredData(clientsCombined);
        }
      });
  }, [newOrderSubmitted]);

  const ClientsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;
    const totalClients = filteredData.length;
    const computedClients = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      (currentPage - 1) * itemsPerPage + itemsPerPage
    );

    return (
      <>
        <div className="tableResultsWrap">
          <div className="resultsSpan">
            Showing
            <span className="resultsBold"> {computedClients.length} </span>
            of
            <span className="resultsBold"> {totalClients} </span>
            results
          </div>
          <Pagination
            total={totalClients}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        <table style={{ width: "247%", marginBottom: "0", marginLeft: "-71%" }}>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Orders count</th>
            </tr>
          </thead>
          <tbody>
            {computedClients.map((client, i) => (
              <tr key={i}>
                <td>
                  <span className="maincolor">#</span>
                  {client.client_id}
                </td>
                <td>{client.client}</td>
                <td>{client.phone}</td>
                <td>{client.city}</td>
                <td>{client.ordersCount ? client.ordersCount : "0"}</td>
                <td className="maincolor">
                  <Link to={`/clients/${client.client_id}`}>
                    <ReadMoreRoundedIcon />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const AddClients = () => {
    const [clientDetails, setClientDetails] = useState({
      clientName: "",
      clientDetails: "",
      phone: "",
      country: "Polska",
      street: "",
      city: "",
      postalCode: "",
      workerName: ctx.username,
    });

    const addNewOrder = () => {
      axios
        .post(
          "http://localhost:5000/newclient",
          {
            clientDetails,
          },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data === "success") {
            setClientDetails({
              clientName: "",
              clientDetails: "",
              phone: "",
              country: "Polska",
              street: "",
              city: "",
              postalCode: "",
              workerName: ctx.username,
            });
            setNewOrderSubmitted(true);
            setButtonPopup(false);
          }
        });
    };

    return (
      <Dialog open={buttonPopup} onClose={() => setButtonPopup(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Client Name"
            type="text"
            fullWidth
            value={clientDetails.clientName}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                clientName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            value={clientDetails.phone}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                phone: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Client Details"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={clientDetails.clientDetails}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                clientDetails: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Country"
            type="text"
            fullWidth
            value={clientDetails.country}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                country: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Street, Home/Apartment Number"
            type="text"
            fullWidth
            value={clientDetails.street}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                street: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="City"
            type="text"
            fullWidth
            value={clientDetails.city}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                city: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Postal Code"
            type="text"
            fullWidth
            value={clientDetails.postalCode}
            onChange={(e) =>
              setClientDetails({
                ...clientDetails,
                postalCode: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setButtonPopup(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addNewOrder} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="mcw">
      <div className="contentOrderWrap clientsTableWrap">
        <div className="leftSide">
          <h1>Clients</h1>
          <div className="orderNavWrap">
            <div className="addOrderWrap">
              <SearchBar
                data={clientsData}
                handleSearchChange={handleSearchChange}
                dataType="clients"
              />
              <IconButton color="primary" onClick={() => setButtonPopup(true)}>
                <AddCircleOutlineRoundedIcon />
              </IconButton>
            </div>
          </div>
          <div className="orderWrap">
            <ClientsTable />
          </div>
        </div>
      </div>
      <AddClients />
    </div>
  );
}

export default Clients;
