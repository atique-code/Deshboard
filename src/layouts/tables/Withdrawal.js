import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { ref, onValue } from "firebase/database";
import { database } from "../../../src/firebaseConfig";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function WithdrawalList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = () => {
      const withdrawalRef = ref(database, "withdrawals");

      onValue(withdrawalRef, (snapshot) => {
        const data = snapshot.val();
        const list = [];

        if (data) {
          Object.entries(data).forEach(([id, item]) => {
            list.push({
              id,
              payeeName: item.payeeName || "N/A",
              bankAccount: item.bankAccount || "N/A",
              bankName: item.bankName || "N/A",
            });
          });
        }

        setWithdrawals(list);
        setLoading(false);
      });
    };

    fetchWithdrawals();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" mb={2}>
              Withdrawal Requests
            </Typography>

            {loading ? (
              <Grid container justifyContent="center" mt={4}>
                <CircularProgress color="info" />
              </Grid>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Payee Name</TableCell>
                      <TableCell>Bank Account</TableCell>
                      <TableCell>Bank Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawals.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.payeeName}</TableCell>
                        <TableCell>{item.bankAccount}</TableCell>
                        <TableCell>{item.bankName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Typography variant="caption" mt={2} display="block">
              Total Records: {withdrawals.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default WithdrawalList;
