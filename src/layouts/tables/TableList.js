
// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Grid,
//   TextField,
// } from "@mui/material";
// import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import MDAlert from "components/MDAlert";

// // Layout components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

// // Firebase
// import { ref, onValue, update, get, increment } from "firebase/database";
// import { database } from "../../../src/firebaseConfig";

// function TableList() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [verificationInputs, setVerificationInputs] = useState({});

//   useEffect(() => {
//     const fetchUsers = () => {
//       try {
//         const usersRef = ref(database, "users");
//         onValue(usersRef, (snapshot) => {
//           const usersData = snapshot.val();
//           const usersList = [];

//           for (const uid in usersData) {
//             const user = usersData[uid];
//             usersList.push({
//               uid,
//               mobileNumber: user.mobileNumber,
//               tid: user.tid?.tid || "N/A",
//               tidStatus: user.tid?.status || "pending",
//               verificationStatus: user.tid?.verified || false,
//             });
//           }

//           setUsers(usersList);
//           setLoading(false);
//         });
//       } catch (err) {
//         setError("Failed to load users");
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleVerifyTID = async (uid, adminTID) => {
//     try {
//       const userRef = ref(database, `users/${uid}/tid`);
//       await update(userRef, {
//         adminTID,
//         verified: adminTID === users.find((u) => u.uid === uid)?.tid,
//         lastVerified: Date.now(),
//       });
//       setVerificationInputs((prev) => ({ ...prev, [uid]: "" }));
//     } catch (err) {
//       setError("Verification failed");
//     }
//   };

//   // const handleStatusChange = async (uid, newStatus) => {
//   //   try {
//   //     const userRef = ref(database, `users/${uid}/tid`);
//   //     await update(userRef, { status: newStatus });
//   //   } catch (err) {
//   //     setError("Status update failed");
//   //   }
//   // };

//   const handleStatusChange = async (uid, newStatus) => {
//     try {
//       const db = database;
//       const userRef = ref(db, `users/${uid}`);

//       if (newStatus === 'approved') {
//         const investmentsRef = ref(db, `users/${uid}/investments`);
//         const snapshot = await get(investmentsRef);

//         const updates = {};
//         let totalBonus = 0;

//         if (snapshot.exists()) {
//           const investments = snapshot.val();

//           // Process all pending investments
//           Object.entries(investments).forEach(([key, investment]) => {
//             if (investment.status === 'pending') {
//               const bonus = investment.amount * 0.1;
//               totalBonus += bonus;

//               // Mark as approved with timestamps
//               updates[`users/${uid}/investments/${key}/status`] = 'approved';
//               updates[`users/${uid}/investments/${key}/approvedAt`] = Date.now();
//               updates[`users/${uid}/investments/${key}/lastPayout`] = Date.now();

//               // Add product type and income details
//               const product = carProducts.find(p => p.id === investment.id);
//               updates[`users/${uid}/investments/${key}/type`] = product.type;
//               updates[`users/${uid}/investments/${key}/dailyIncome`] = product.dailyIncome;
//             }
//           });
//         }

//         // Update balance and TID status
//         updates[`users/${uid}/balance`] = increment(totalBonus);
//         updates[`users/${uid}/tid/status`] = newStatus;

//         // Referral bonus
//         const userSnapshot = await get(userRef);
//         const userData = userSnapshot.val();
//         if (userData.referredBy) {
//           updates[`users/${userData.referredBy}/balance`] = increment(totalBonus);
//         }

//         await update(ref(db), updates);
//       } else {
//         await update(userRef, { 'tid/status': newStatus });
//       }
//     } catch (err) {
//       setError("Status update failed: " + err.message);
//     }
//   };
//   const VerificationStatus = ({ verified }) => (
//     verified ? (
//       <MDBox display="flex" alignItems="center" gap={1}>
//         <CheckCircleIcon color="success" fontSize="small" />
//         <MDTypography variant="button" color="success">
//           Verified
//         </MDTypography>
//       </MDBox>
//     ) : (
//       <MDBox display="flex" alignItems="center" gap={1}>
//         <CancelIcon color="error" fontSize="small" />
//         <MDTypography variant="button" color="error">
//           Not Verified
//         </MDTypography>
//       </MDBox>
//     )
//   );

//   VerificationStatus.propTypes = {
//     verified: PropTypes.bool.isRequired,
//   };

//   const StatusChip = ({ status }) => {
//     const statusColors = {
//       approved: "success",
//       rejected: "error",
//       pending: "warning",
//     };

//     return (
//       <MDTypography variant="caption" color={statusColors[status]} fontWeight="medium">
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </MDTypography>
//     );
//   };

//   StatusChip.propTypes = {
//     status: PropTypes.string.isRequired,
//   };

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   User Verification Dashboard
//                 </MDTypography>
//               </MDBox>

//               <MDBox pt={3} px={2}>
//                 {loading && (
//                   <MDBox display="flex" justifyContent="center" p={6}>
//                     <CircularProgress color="info" />
//                   </MDBox>
//                 )}

//                 {/* Display error message but keep the table visible */}
//                 {error && (
//                   <MDAlert color="error">{error}</MDAlert>
//                 )}

//                 {/* The table is displayed even when there's an error */}
//                 <TableContainer sx={{ overflowX: "auto" }}>
//                   <Table sx={{ tableLayout: "fixed", width: "100%" }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell style={{ width: "5%" }}>User ID</TableCell>
//                         <TableCell style={{ width: "10%" }}>Mobile Number</TableCell>
//                         <TableCell style={{ width: "10%" }}>TID</TableCell>
//                         <TableCell style={{ width: "20%" }}>Verification</TableCell>
//                         <TableCell style={{ width: "15%" }}>Status</TableCell>
//                         <TableCell style={{ width: "30%" }}>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {users.map((user) => (
//                         <TableRow hover key={user.uid}>
//                           <TableCell>
//                             <MDTypography variant="caption" color="text">
//                               #{user.uid.slice(0, 8)}
//                             </MDTypography>
//                           </TableCell>
//                           <TableCell>{user.mobileNumber}</TableCell>
//                           <TableCell>
//                             <MDTypography variant="caption" fontWeight="medium">
//                               {user.tid}
//                             </MDTypography>
//                           </TableCell>
//                           <TableCell>
//                             <VerificationStatus verified={user.verificationStatus} />
//                           </TableCell>
//                           <TableCell>
//                             <StatusChip status={user.tidStatus} />
//                           </TableCell>
                          // <TableCell>
                          //   <MDBox display="flex" gap={2} alignItems="center" width="100%">
                          //     {/* Input field for TID verification */}
                          //     <TextField
                          //       variant="outlined"
                          //       size="small"
                          //       value={verificationInputs[user.uid] || ""}
                          //       onChange={(e) => setVerificationInputs((prev) => ({
                          //         ...prev,
                          //         [user.uid]: e.target.value,
                          //       }))}
                          //       fullWidth
                          //       label="Verify TID"
                          //       sx={{
                          //         flex: 1,
                          //         minWidth: "300px",
                          //         "& .MuiInputBase-root": {
                          //           height: "40px"
                          //         }
                          //       }}
                          //     />
                          //     <MDButton
                          //       variant="gradient"
                          //       color="info"
                          //       size="small"
                          //       onClick={() => handleVerifyTID(user.uid, verificationInputs[user.uid])}
                          //     >
                          //       Verify
                          //     </MDButton>
                          //     <Select
                          //       value={user.tidStatus}
                          //       onChange={(e) => handleStatusChange(user.uid, e.target.value)}
                          //       size="small"
                          //       sx={{ minWidth: 120 }}
                          //     >
                          //       <MenuItem value="pending">Pending</MenuItem>
                          //       <MenuItem value="approved">Approved</MenuItem>
                          //       <MenuItem value="rejected">Rejected</MenuItem>
                          //     </Select>
                          //   </MDBox>
                            
                          // </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </MDBox>

//               <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
//                 <MDTypography variant="caption" color="text">
//                   Total Users: {users.length}
//                 </MDTypography>
//                 <MDTypography variant="caption" color="text">
//                   Real-time Database Updates
//                 </MDTypography>
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default TableList;



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
  TextField,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { ref, onValue, update, get, increment } from "firebase/database";
import { database } from "../../../src/firebaseConfig";

// Car products data
const carProducts = [
  {
    id: 1,
    name: 'Maruti Swift LXI',
    days: "24 Hours",
    dailyIncome: 80,
    price: 1000,
    image: "",
    quota: '0 / 99',
    type: "Daily Income"
  },
  {
    id: 2,
    name: 'Hyundai i20 Sportz',
    days: "24 Hours",
    dailyIncome: 150,
    price: 2000,
    image: "Maruti",
    quota: '0 / 99',
    type: "Daily Income"
  },
  {
    id: 3,
    name: 'Honda City ZX',
    days: "24 Hours",
    dailyIncome: 400,
    price: 4000,
    image: "Honda",
    quota: '0 / 99',
    type: "Daily Income"
  },
  {
    id: 4,
    name: 'Skoda Octavia',
    days: "48 Hours",
    dailyIncome: 600,
    price: 6000,
    image: "Skoda",
    quota: '0 / 99',
    type: "2 Days Income"
  },
  {
    id: 5,
    name: 'Skoda Octavia',
    days: "48 Hours",
    dailyIncome: 1000,
    price: 10000,
    image: "Skoda",
    quota: '0 / 99',
    type: "2 Days Income"
  },
  {
    id: 6,
    name: 'Skoda Octavia',
    days: "48 Hours",
    dailyIncome: 1500,
    price: 15000,
    image: "Skoda",
    quota: '0 / 99',
    type: "2 Days Income"
  },
  {
    id: 7,
    name: 'Skoda Octavia',
    days: "3 Days",
    dailyIncome: 3000,
    price: 20000,
    image: "Skoda",
    quota: '0 / 99',
    type: "3 Days Income"
  },
  {
    id: 8,
    name: 'Skoda Octavia',
    days: "3 Days",
    dailyIncome: 4000,
    price: 25000,
    image: "Skoda",
    quota: '0 / 99',
    type: "3 Days Income"
  },
  {
    id: 9,
    name: 'Skoda Octavia',
    days: "3 Days",
    dailyIncome: 5000,
    price: 30000,
    image: "Skoda",
    quota: '0 / 99',
    type: "3 Days Income"
  },
  {
    id: 10,
    name: 'Skoda Octavia',
    days: "Weekly",
    dailyIncome: 7000,
    price: 35000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  },
  {
    id: 11,
    name: 'Skoda Octavia',
    days: "Weekly",
    dailyIncome: 8500,
    price: 40000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  },
  {
    id: 12,
    name: 'Skoda Octavia',
    days: "Weekly",
    dailyIncome: 9000,
    price: 45000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  },
  {
    id: 13,
    name: 'Skoda Octavia',
    days: "Weekly",
    dailyIncome: 10000,
    price: 50000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  },
  {
    id: 14,
    name: 'Skoda Octavia',
    days: "Weekly",
    dailyIncome: 15000,
    price: 750000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  },
  {
    id: 15,
    name: 'Skoda Octavia',
    days: "Weekly",
    price: 100000,
    dailyIncome: 20000,
    image: "Skoda",
    quota: '0 / 99',
    type: "Weekly Income"
  }
];

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
              investments: user.investments || {}
            });
          }

          setUsers(usersList);
          setLoading(false);
        });
      } catch (err) {
        setError("Failed to load users: " + err.message);
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
        lastVerified: Date.now()
      });
      setVerificationInputs((prev) => ({ ...prev, [uid]: "" }));
    } catch (err) {
      setError("Verification failed: " + err.message);
    }
  };

  const handleStatusChange = async (uid, newStatus) => {
    try {
      const db = database;
      const userRef = ref(db, `users/${uid}`);
      const user = users.find(u => u.uid === uid);

      if (newStatus === 'approved') {
        const investmentsRef = ref(db, `users/${uid}/investments`);
        const snapshot = await get(investmentsRef);

        const updates = {};
        let totalBonus = 0;

        if (snapshot.exists()) {
          const investments = snapshot.val();

          Object.entries(investments).forEach(([key, investment]) => {
            if (investment.status === 'pending') {
              const product = carProducts.find(p => p.id === investment.id);
              if (!product) return;

              // Calculate 10% instant bonus
              const bonus = investment.amount * 0.1;
              totalBonus += bonus;

              // Update investment details
              updates[`users/${uid}/investments/${key}/status`] = 'approved';
              updates[`users/${uid}/investments/${key}/approvedAt`] = Date.now();
              updates[`users/${uid}/investments/${key}/lastPayout`] = Date.now();
              updates[`users/${uid}/investments/${key}/type`] = product.type;
              updates[`users/${uid}/investments/${key}/dailyIncome`] = product.dailyIncome;
            }
          });
        }

        // Update user balance
        updates[`users/${uid}/balance`] = increment(totalBonus);
        updates[`users/${uid}/tid/status`] = newStatus;

        // Handle referral bonus
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        if (userData.referredBy) {
          updates[`users/${userData.referredBy}/balance`] = increment(totalBonus);
          updates[`users/${userData.referredBy}/pendingBonus`] = increment(totalBonus);
        }

        await update(ref(db), updates);
      } else {
        await update(ref(db, `users/${uid}/tid`), { status: newStatus });
      }
    } catch (err) {
      setError("Status update failed: " + err.message);
    }
  };

  const VerificationStatus = ({ verified }) => (
    verified ? (
      <MDBox display="flex" alignItems="center" gap={1}>
        <CheckCircleIcon color="success" fontSize="small" />
        <MDTypography variant="button" color="success">Verified</MDTypography>
      </MDBox>
    ) : (
      <MDBox display="flex" alignItems="center" gap={1}>
        <CancelIcon color="error" fontSize="small" />
        <MDTypography variant="button" color="error">Not Verified</MDTypography>
      </MDBox>
    )
  );

  const StatusChip = ({ status }) => {
    const statusColors = { approved: "success", rejected: "error", pending: "warning" };
    return (
      <MDTypography variant="caption" color={statusColors[status]} fontWeight="medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </MDTypography>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">User Verification Dashboard</MDTypography>
              </MDBox>

              <MDBox pt={3} px={2}>
                {loading && (
                  <MDBox display="flex" justifyContent="center" p={6}>
                    <CircularProgress color="info" />
                  </MDBox>
                )}

                {error && <MDAlert color="error">{error}</MDAlert>}

                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "5%" }}>User ID</TableCell>
                        <TableCell style={{ width: "10%" }}>Mobile</TableCell>
                        <TableCell style={{ width: "10%" }}>TID</TableCell>
                        <TableCell style={{ width: "20%" }}>Verification</TableCell>
                        <TableCell style={{ width: "15%" }}>Status</TableCell>
                        <TableCell style={{ width: "30%" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow hover key={user.uid}>
                          <TableCell>#{user.uid.slice(0, 8)}</TableCell>
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
                            <MDBox display="flex" gap={2} alignItems="center" width="100%">
                              {/* Input field for TID verification */}
                              <TextField
                                variant="outlined"
                                size="small"
                                value={verificationInputs[user.uid] || ""}
                                onChange={(e) => setVerificationInputs((prev) => ({
                                  ...prev,
                                  [user.uid]: e.target.value,
                                }))}
                                fullWidth
                                label="Verify TID"
                                sx={{
                                  flex: 1,
                                  minWidth: "300px",
                                  "& .MuiInputBase-root": {
                                    height: "40px"
                                  }
                                }}
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

                <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="caption" color="text">
                    Total Users: {users.length}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Real-time Updates
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

TableList.propTypes = {
  verified: PropTypes.bool,
  status: PropTypes.string
};

export default TableList;
