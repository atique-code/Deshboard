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

function AdminPaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = () => {
      const paymentRef = ref(database, "payments"); // ✅ correct node

      onValue(paymentRef, (snapshot) => {
        const data = snapshot.val();
        const list = [];

        if (data) {
          Object.entries(data).forEach(([id, item]) => {
            list.push({
              id,
              payeeName: item.accountTitle || "N/A",
              bankAccount: item.accountNumber || "N/A",
              bankName: item.bankName || "N/A",
              imageUrl: item.imageUrl || null,
              timestamp: item.timestamp || null,
            });
          });
        }

        setPayments(list);
        setLoading(false);
      });
    };

    fetchPayments();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" mb={2}>
              Payment Records
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
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Image</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.payeeName}</TableCell>
                        <TableCell>{item.bankAccount}</TableCell>
                        <TableCell>{item.bankName}</TableCell>
                        <TableCell>
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt="payment"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Typography variant="caption" mt={2} display="block">
              Total Records: {payments.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminPaymentList;
