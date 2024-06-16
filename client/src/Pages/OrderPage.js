import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Styles/orderPage.css";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
function OrderPage() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/jobInfo?jobName=${orderId}`, {
      })
      .then((res) => {
        if (res.data != null) {
          setOrderData(res.data);
        }
      });
  });

  const Param = orderData?.property?.[1]?.parameterDefinitions ? "Yes" : "No";
  const OrderPageHeaderSection = () => {
    return (
      <div className="orderPageHeader">
        <h1>
          Order
          <font className="maincolor">#{orderId}</font>
        </h1>
      </div>
    );
  };

  const OrderPageContentSection = ({ props }) => {
    return <div className="orderPageSection">{props.children}</div>;
  };

  const ProductsSummaryTable = () => {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Job</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>parametersized</TableCell>
              <TableCell>Last Successful Build</TableCell>
              <TableCell>Last Stable Build</TableCell>
              <TableCell>Last Unstable Build</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                <TableRow hover role="checkbox" tabIndex={-1} key={orderData.name}>
                  <TableCell align="center">{orderData.name}</TableCell>
                  <TableCell>{orderData.fullDisplayName}</TableCell>
                  <TableCell>{Param}</TableCell>
                  <TableCell> {orderData.lastSuccessfulBuild ? orderData.lastSuccessfulBuild.number : ""}</TableCell>
                  <TableCell>{orderData.lastStableBuild ? orderData.lastStableBuild.number : ""}</TableCell>
                  <TableCell>{orderData.lastUnstableBuild ? orderData.lastUnstableBuild.number : ""}</TableCell>
                </TableRow>
          </TableBody>
        </Table>
        <div style={{ padding: '16px', textAlign: 'right' }}>
        <strong>Total Builds:{orderData.builds ? orderData.builds.length : ""}</strong>
      </div>
      </Paper>
    );
  };


  return (
    <div className="mcw">
      <div className="orderPageContentWrap">
        <OrderPageHeaderSection />
        <div className="orderPageSection">
          <div className="orderPageLeftSide">
            <ProductsSummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderPage;
