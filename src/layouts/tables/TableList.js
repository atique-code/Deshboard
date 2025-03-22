import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Firebase
import { ref, onValue, update } from "firebase/database";
import { database } from "../../../src/firebaseConfig";

function TableList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verificationInputs, setVerificationInputs] = useState({});

  useEffect(() => {
    const fetchUsers = () => {
      try {
        const usersRef = ref(database, "users");
        onValue(usersRef, (snapshot) => {
          const usersData = snapshot.val();
          const usersList = [];

          for (const uid in usersData) {
            const user = usersData[uid];
            usersList.push({
              uid,
              mobileNumber: user.mobileNumber,
              tid: user.tid?.tid || "N/A",
              tidStatus: user.tid?.status || "pending",
              verificationStatus: user.tid?.verified || false,
            });
          }

          setUsers(usersList);
          setLoading(false);
        });
      } catch (err) {
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleVerifyTID = async (uid, adminTID) => {
    try {
      const userRef = ref(database, `users/${uid}/tid`);
      await update(userRef, {
        adminTID,
        verified: adminTID === users.find((u) => u.uid === uid)?.tid,
        lastVerified: Date.now(),
      });
      setVerificationInputs((prev) => ({ ...prev, [uid]: "" }));
    } catch (err) {
      setError("Verification failed");
    }
  };

  const handleStatusChange = async (uid, newStatus) => {
    try {
      const userRef = ref(database, `users/${uid}/tid`);
      await update(userRef, { status: newStatus });
    } catch (err) {
      setError("Status update failed");
    }
  };

  const VerificationStatus = ({ verified }) => (
    verified ? (
      <MDBox display="flex" alignItems="center" gap={1}>
        <CheckCircleIcon color="success" fontSize="small" />
        <MDTypography variant="button" color="success">
          Verified
        </MDTypography>
      </MDBox>
    ) : (
      <MDBox display="flex" alignItems="center" gap={1}>
        <CancelIcon color="error" fontSize="small" />
        <MDTypography variant="button" color="error">
          Not Verified
        </MDTypography>
      </MDBox>
    )
  );

  VerificationStatus.propTypes = {
    verified: PropTypes.bool.isRequired,
  };

  const StatusChip = ({ status }) => {
    const statusColors = {
      approved: "success",
      rejected: "error",
      pending: "warning",
    };

    return (
      <MDTypography variant="caption" color={statusColors[status]} fontWeight="medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </MDTypography>
    );
  };

  StatusChip.propTypes = {
    status: PropTypes.string.isRequired,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  User Verification Dashboard
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2}>
                {loading && (
                  <MDBox display="flex" justifyContent="center" p={6}>
                    <CircularProgress color="info" />
                  </MDBox>
                )}

                {/* Display error message but keep the table visible */}
                {error && (
                  <MDAlert color="error">{error}</MDAlert>
                )}

                {/* The table is displayed even when there's an error */}
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>Mobile Number</TableCell>
                        <TableCell>TID</TableCell>
                        <TableCell>Verification</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow hover key={user.uid}>
                          <TableCell>
                            <MDTypography variant="caption" color="text">
                              #{user.uid.slice(0, 8)}
                            </MDTypography>
                          </TableCell>
                          <TableCell>{user.mobileNumber}</TableCell>
                          <TableCell>
                            <MDTypography variant="caption" fontWeight="medium">
                              {user.tid}
                            </MDTypography>
                          </TableCell>
                          <TableCell>
                            <VerificationStatus verified={user.verificationStatus} />
                          </TableCell>
                          <TableCell>
                            <StatusChip status={user.tidStatus} />
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" gap={1} alignItems="center">
                              <MDInput
                                placeholder="Verify TID"
                                value={verificationInputs[user.uid] || ""}
                                onChange={(e) => setVerificationInputs((prev) => ({
                                  ...prev,
                                  [user.uid]: e.target.value,
                                }))}
                                size="small"
                                fullWidth
                              />
                              <MDButton
                                variant="gradient"
                                color="info"
                                size="small"
                                onClick={() => handleVerifyTID(user.uid, verificationInputs[user.uid])}
                              >
                                Verify
                              </MDButton>
                              <Select
                                value={user.tidStatus}
                                onChange={(e) => handleStatusChange(user.uid, e.target.value)}
                                size="small"
                                sx={{ minWidth: 120 }}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                              </Select>
                            </MDBox>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MDBox>

              <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="caption" color="text">
                  Total Users: {users.length}
                </MDTypography>
                <MDTypography variant="caption" color="text">
                  Real-time Database Updates
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TableList;
