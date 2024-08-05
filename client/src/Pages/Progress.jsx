import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Button,
  TablePagination,
  InputLabel,
  colors,
} from "@mui/material";
import VncScreen from "./Browser";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useLocation } from "react-router-dom";

const APPI_URL=process.env.REACT_APP_APPI_URL

const StyledPaper = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
  textAlign: "left",
  color: "#333",
});

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        p: 1,
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}
// Item.propTypes = {
//   /**
//    * The system prop that allows defining system overrides as well as additional CSS styles.
//    */
//   sx: PropTypes.oneOfType([
//     PropTypes.arrayOf(
//       PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
//     ),
//     PropTypes.func,
//     PropTypes.object,
//   ]),
// };


const styles = theme => ({
  disabledButton: {
    backgroundColor: '#173B45',
    color:"#FF8225"
  }
});
const SystemLog = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
});

const LogItem = styled("div")(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  "&:before": {
    content: '""',
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: active
      ? theme.palette.primary.main
      : theme.palette.grey[400],
  },
}));

const DataSetTable = ({ excelData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = excelData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper>
      <Typography variant="h4" align="center" gutterBottom>
        Excel Data
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {excelData.length > 0 &&
                Object.keys(excelData[0]).map((key) => (
                  <TableCell key={key} sx={{ fontSize: "1.2rem" }}>
                    {key}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex} sx={{ fontSize: "1.2rem" }}>
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={excelData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: "16px", fontSize: "1.2rem" }}
      />
    </Paper>
  );
};

const ResponsivePage = () => {
  const location = useLocation();
  const { excelData } = location.state || { excelData: [] };
  const [getSession,setSesssion]=useState(false)
  const [sessionIds, setSessionIds] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [vncConnectionStatus, setVncConnectionStatus] =
  useState("disconnected");

  useEffect(() => {
    axios
      .get(`${APPI_URL}/getbrowser-id`)
      .then((res) => {
        if (res.data.browserId) {
          setSessionIds([res.data]);
        } else {
          console.error("Invalid response format:", res.data);
        
        }
      })
      .catch((error) => {
        console.error("Error fetching session IDs:", error);
      });
      setSesssion(false)
  },[getSession]);

  const handleConnect = () => {
    if (selectedSession) {
      setVncConnectionStatus("connecting");
    }
  };

  const handleDisconnect = () => {
    setSelectedSession(null);
    setVncConnectionStatus("disconnected");
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value)
    setSesssion(true);
  };

  const getMarginBottom = () => {
    switch (vncConnectionStatus) {
      case "disconnected":
        return "50%";
      case "connecting":
        return "50%";
      case "connected":
          return "4%";  
      default:
        return "50%";
    }
  };

  return (
    <Container style={{marginLeft:"12%"}}>
     <Box sx={{
    display: 'grid',
    columnGap: 1,
    rowGap: 1,
    gridTemplateColumns: 'repeat(1, 1fr)',
  }}>
    <Item>
    <InputLabel id="demo-multiple-checkbox-label" sx={{fontSize: "1.2rem"}}>
        Select Session
      </InputLabel>
      <Select
        value={selectedSession}
        onChange={handleSessionChange}
        displayEmpty
        fullWidth
        variant="outlined"
        disabled={
          vncConnectionStatus === "connecting" ||
          vncConnectionStatus === "connected"
        }
      >
        <MenuItem value="" disabled>
          Select Session ID
        </MenuItem>
        {sessionIds.map((session) => (
          <MenuItem key={session.browserId} value={session.browserId}>
            {session.testcase}
          </MenuItem>
        ))}
      </Select>
    </Item>
    <Item>
    <Button
          sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
          onClick={handleConnect}
          disabled={
            vncConnectionStatus === "connecting" ||
            vncConnectionStatus === "connected"
          }
        >
          LIVE VIEW
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          variant="outlined"
          sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
          onClick={handleDisconnect}
          disabled={vncConnectionStatus === "disconnected"}
        >
          Disconnect
        </Button>
    </Item>
    {/* I want change marginButton on vncConnectionStatus==connecting margin 50% ==connected margin 4%  */}
    <Item sx={{height:"100%",maxHeight:"638px",marginBottom:getMarginBottom()}}>
    {selectedSession && (
        <VncScreen
          session={selectedSession}
          onUpdateState={setVncConnectionStatus}
        />
      )}
    </Item>
    <Item>
    <StyledPaper>
    <Typography variant="h6" gutterBottom>
      Data Set
    </Typography>
    <DataSetTable excelData={excelData} />
  </StyledPaper>
    </Item>

     </Box>
    </Container>
  );
};

export default ResponsivePage;

{/* <Container style={{marginLeft:"12%"}}>
<Grid container spacing={3}>
  <Grid item xs={12} md={9} sx={{justifyContent: "space-between"}}>
    <Box sx={{ height: "100%", width: "100%", minHeight: "0px",display:"grid" }}>
      <InputLabel id="demo-multiple-checkbox-label" sx={{fontSize: "1.2rem"}}>
        Select Session
      </InputLabel>

      <Select
        value={selectedSession}
        onChange={handleSessionChange}
        displayEmpty
        fullWidth
        variant="outlined"
        disabled={
          vncConnectionStatus === "connecting" ||
          vncConnectionStatus === "connected"
        }
      >
        <MenuItem value="" disabled>
          Select Session ID
        </MenuItem>
        {sessionIds.map((session) => (
          <MenuItem key={session.browserId} value={session.browserId}>
            {session.testcase}
          </MenuItem>
        ))}
      </Select>
      <Box style={{ marginTop: "10px",marginBottom:"10px" }}>
        <Button
          sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
          onClick={handleConnect}
          disabled={
            vncConnectionStatus === "connecting" ||
            vncConnectionStatus === "connected"
          }
        >
          LIVE VIEW
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          variant="outlined"
          sx={{ ml: 2, fontSize: '1rem', backgroundColor: '#393E46', color: 'white', '&:hover': { backgroundColor: '#00ADB5' },'&:disabled':{backgroundColor:"#FF8225"}}}
          onClick={handleDisconnect}
          disabled={vncConnectionStatus === "disconnected"}
        >
          Disconnect
        </Button>
      </Box>
      {selectedSession && (
        <VncScreen
          session={selectedSession}
          onUpdateState={setVncConnectionStatus}
        />
      )}
    </Box>
  </Grid>
</Grid>
<Box sx={{ mt: 10 }}>
  <StyledPaper>
    <Typography variant="h6" gutterBottom>
      Data Set
    </Typography>
    <DataSetTable excelData={excelData} />
  </StyledPaper>
</Box>
</Container> */}