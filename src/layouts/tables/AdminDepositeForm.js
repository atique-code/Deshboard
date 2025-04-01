// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Grid,
//   Alert,
// } from "@mui/material";
// import { database } from "../../../src/firebaseConfig";
// import { ref, onValue, update, push } from "firebase/database";

// const AdminDepositForm = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [currentBalance, setCurrentBalance] = useState(0);

//   useEffect(() => {
//     const usersRef = ref(database, "users");
//     onValue(usersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const usersList = Object.keys(data).map((uid) => ({
//           id: uid,
//           ...data[uid],
//         }));
//         setUsers(usersList);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     if (selectedUserId) {
//       const selectedUser = users.find((user) => user.id === selectedUserId);
//       setCurrentBalance(selectedUser?.balance || 0);
//     } else {
//       setCurrentBalance(0);
//     }
//   }, [selectedUserId, users]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedUserId || !amount) {
//       alert("Please select a user and enter deposit amount.");
//       return;
//     }

//     const depositAmount = parseFloat(amount);
//     if (depositAmount > currentBalance) {
//       alert("Deposit amount cannot exceed current balance.");
//       return;
//     }

//     try {
//       // 1. Save deposit transaction in 'deposits' node
//       const depositRef = ref(database, "deposits");
//       const depositData = {
//         userId: selectedUserId,
//         depositAmount,
//         timestamp: new Date().toISOString(),
//         previousBalance: currentBalance,
//       };
//       await push(depositRef, depositData);

//       // 2. Set user's balance to 0
//       const userRef = ref(database, `users/${selectedUserId}`);
//       await update(userRef, { balance: 0 });

//       setSuccessMessage("Deposit submitted successfully!");
//       setSelectedUserId("");
//       setAmount("");
//       setCurrentBalance(0);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Error processing deposit. Try again.");
//     }

//     setTimeout(() => setSuccessMessage(""), 3000);
//   };

//   return (
//     <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Admin Deposit Form
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Select User"
//                 value={selectedUserId}
//                 onChange={(e) => setSelectedUserId(e.target.value)}
//               >
//                 <MenuItem value="">-- Select User --</MenuItem>
//                 {users.map((user) => (
//                   <MenuItem key={user.id} value={user.id}>
//                     {user.mobileNumber} {user.referralCode && `(${user.referralCode})`}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>

//             {selectedUserId && (
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Current Balance"
//                   value={currentBalance}
//                   InputProps={{ readOnly: true }}
//                 />
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Deposit Amount"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" color="primary" fullWidth>
//                 Submit
//               </Button>
//             </Grid>

//             {successMessage && (
//               <Grid item xs={12}>
//                 <Alert severity="success">{successMessage}</Alert>
//               </Grid>
//             )}
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminDepositForm;



// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Grid,
//   Alert,
//   InputAdornment,
// } from "@mui/material";
// import { database } from "../../../src/firebaseConfig";
// import { ref, onValue, update, push } from "firebase/database";

// const AdminDepositForm = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [currentBalance, setCurrentBalance] = useState(0);
//   const [totalEarnings, setTotalEarnings] = useState(0);

//   useEffect(() => {
//     const usersRef = ref(database, "users");
//     onValue(usersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const usersList = Object.keys(data).map((uid) => ({
//           id: uid,
//           mobileNumber: data[uid]?.mobileNumber || "No Number",
//           referralCode: data[uid]?.referralCode || "",
//           balance: data[uid]?.balance?.current || 0,
//           earnings: calculateTotalEarnings(data[uid]?.investments || {})
//         }));
//         setUsers(usersList);
//       }
//     });
//   }, []);

//   const calculateTotalEarnings = (investments) => {
//     if (!investments) return 0;
    
//     let total = 0;
//     Object.values(investments).forEach(investment => {
//       if (investment.status === "approved") {
//         total += investment.earnings || 0;
//       }
//     });
//     return total;
//   };

//   useEffect(() => {
//     if (selectedUserId) {
//       const selectedUser = users.find((user) => user.id === selectedUserId);
//       if (selectedUser) {
//         setCurrentBalance(selectedUser.balance || 0);
//         setTotalEarnings(selectedUser.earnings || 0);
//         // Auto-fill deposit amount with total earnings
//         setAmount(selectedUser.earnings.toString());
//       }
//     } else {
//       setCurrentBalance(0);
//       setTotalEarnings(0);
//       setAmount("");
//     }
//   }, [selectedUserId, users]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedUserId || !amount) {
//       alert("Please select a user and enter deposit amount.");
//       return;
//     }

//     const depositAmount = parseFloat(amount);
//     if (depositAmount <= 0) {
//       alert("Deposit amount must be greater than 0.");
//       return;
//     }

//     try {
//       // 1. Save deposit transaction in 'deposits' node
//       const depositRef = ref(database, "deposits");
//       const depositData = {
//         userId: selectedUserId,
//         depositAmount,
//         timestamp: new Date().toISOString(),
//         previousBalance: currentBalance,
//         previousEarnings: totalEarnings,
//       };
//       await push(depositRef, depositData);

//       // 2. Update user's balance (subtract deposit amount)
//       const userRef = ref(database, `users/${selectedUserId}`);
//       await update(userRef, { 
//         balance: currentBalance - depositAmount,
//         // Reset earnings after deposit
//         investments: null
//       });

//       setSuccessMessage(`Deposit of Rs ${depositAmount} submitted successfully!`);
//       setSelectedUserId("");
//       setAmount("");
//       setCurrentBalance(0);
//       setTotalEarnings(0);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Error processing deposit. Try again.");
//     }

//     setTimeout(() => setSuccessMessage(""), 5000);
//   };

//   return (
//     <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Admin Deposit Form
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Select User"
//                 value={selectedUserId}
//                 onChange={(e) => setSelectedUserId(e.target.value)}
//                 variant="outlined"
//                 size="small"
//               >
//                 <MenuItem value="">-- Select User --</MenuItem>
//                 {users
//                   .filter(user => user.mobileNumber !== "No Number")
//                   .sort((a, b) => a.mobileNumber.localeCompare(b.mobileNumber))
//                   .map((user) => (
//                     <MenuItem key={user.id} value={user.id}>
//                       {user.mobileNumber} 
//                       {user.referralCode && ` (${user.referralCode})`}
//                       {` - Rs ${user.earnings.toFixed(2)}`}
//                     </MenuItem>
//                   ))}
//               </TextField>
//             </Grid>

//             {selectedUserId && (
//               <>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Current Balance"
//                     value={currentBalance.toFixed(2)}
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Total Earnings"
//                     value={totalEarnings.toFixed(2)}
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//               </>
//             )}

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Deposit Amount"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 InputProps={{
//                   startAdornment: <InputAdornment position="start">RS</InputAdornment>,
//                 }}
//                 helperText="Amount will be auto-filled with user's total earnings"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button 
//                 type="submit" 
//                 variant="contained" 
//                 color="primary" 
//                 fullWidth
//                 size="large"
//                 disabled={!selectedUserId || !amount || parseFloat(amount) <= 0}
//               >
//                 Process Deposit
//               </Button>
//             </Grid>

//             {successMessage && (
//               <Grid item xs={12}>
//                 <Alert severity="success" onClose={() => setSuccessMessage("")}>
//                   {successMessage}
//                 </Alert>
//               </Grid>
//             )}
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminDepositForm;


import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  InputAdornment,
} from "@mui/material";
import { database } from "../../../src/firebaseConfig";
import { ref, onValue, update, push } from "firebase/database";

const AdminDepositForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((uid) => ({
          id: uid,
          mobileNumber: data[uid]?.mobileNumber || "No Number",
          referralCode: data[uid]?.referralCode || "",
          balance: data[uid]?.balance?.current || 0,
          earnings: calculateTotalEarnings(data[uid]?.investments || {})
        }));
        setUsers(usersList);
      }
    });
  }, []);

  const calculateTotalEarnings = (investments) => {
    if (!investments) return 0;
    
    let total = 0;
    Object.values(investments).forEach(investment => {
      if (investment.status === "approved") {
        total += investment.earnings || 0;
      }
    });
    return total;
  };

  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find((user) => user.id === selectedUserId);
      if (selectedUser) {
        setCurrentBalance(selectedUser.balance || 0);
        setTotalEarnings(selectedUser.earnings || 0);
        // Auto-fill deposit amount with total earnings
        setAmount(selectedUser.earnings.toString());
      }
    } else {
      setCurrentBalance(0);
      setTotalEarnings(0);
      setAmount("");
    }
  }, [selectedUserId, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !amount) {
      alert("Please select a user and enter deposit amount.");
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      alert("Deposit amount must be greater than 0.");
      return;
    }

    try {
      // 1. Save deposit transaction in 'deposits' node
      const depositRef = ref(database, "deposits");
      const depositData = {
        userId: selectedUserId,
        depositAmount,
        timestamp: new Date().toISOString(),
        previousBalance: currentBalance,
        previousEarnings: totalEarnings,
      };
      await push(depositRef, depositData);

      // 2. Update user's balance and reset earnings
      const userRef = ref(database, `users/${selectedUserId}`);
      await update(userRef, { 
        'balance/current': currentBalance - depositAmount,
        investments: null  // This resets all investments
      });

      setSuccessMessage(`Deposit of Rs${depositAmount.toFixed(2)} processed successfully!`);
      setSelectedUserId("");
      setAmount("");
      setCurrentBalance(0);
      setTotalEarnings(0);
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing deposit. Try again.");
    }

    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Admin Deposit Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select User"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="">-- Select User --</MenuItem>
                {users
                  .filter(user => user.mobileNumber !== "No Number")
                  .sort((a, b) => a.mobileNumber.localeCompare(b.mobileNumber))
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.mobileNumber} 
                      {user.referralCode && ` (${user.referralCode})`}
                      {` - Rs${user.earnings.toFixed(2)}`}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            {selectedUserId && (
              <>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Balance"
                    value={currentBalance.toFixed(2)}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                    }}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Earnings"
                    value={totalEarnings.toFixed(2)}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deposit Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
                helperText="Amount will be auto-filled with user's total earnings"
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                disabled={!selectedUserId || !amount || parseFloat(amount) <= 0}
                sx={{ color: 'white' }} // White text color
              >
                Process Deposit
              </Button>
            </Grid>

            {successMessage && (
              <Grid item xs={12}>
                <Alert severity="success" onClose={() => setSuccessMessage("")}>
                  {successMessage}
                </Alert>
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminDepositForm;