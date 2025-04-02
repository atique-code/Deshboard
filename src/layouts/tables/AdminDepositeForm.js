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

//       // 2. Update user's balance and reset earnings
//       const userRef = ref(database, `users/${selectedUserId}`);
//       await update(userRef, { 
//         'balance/current': currentBalance - depositAmount,
//         investments: null  // This resets all investments
//       });

//       setSuccessMessage(`Deposit of Rs${depositAmount.toFixed(2)} processed successfully!`);
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
//                       {` - Rs${user.earnings.toFixed(2)}`}
//                     </MenuItem>
//                   ))}
//               </TextField>
//             </Grid>

//             {selectedUserId && (
//               <>
//                 {/* <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Current Balance"
//                     value={currentBalance.toFixed(2)}
//                     InputProps={{
//                       readOnly: true,
//                       startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
//                     }}
//                   />
//                 </Grid> */}
//                 <Grid item xs={12}>
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
//                   startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
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
//                 sx={{ color: 'white' }} // White text color
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
  const [error, setError] = useState("");

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
    setError("");

    if (!selectedUserId || !amount) {
      setError("Please select a user and enter deposit amount.");
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      setError("Deposit amount must be greater than 0.");
      return;
    }

    if (depositAmount > totalEarnings) {
      setError(`Cannot deposit more than available earnings (Rs${totalEarnings.toFixed(2)}).`);
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

      // 2. Update user's earnings by subtracting the deposited amount
      const userRef = ref(database, `users/${selectedUserId}`);
      
      // Get all investments to update them
      const userSnapshot = await onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData?.investments) {
          const updatedInvestments = {};
          let remainingAmount = depositAmount;
          
          // Process investments to deduct the deposit amount
          Object.entries(userData.investments).forEach(([key, investment]) => {
            if (investment.status === "approved" && remainingAmount > 0) {
              const investmentEarnings = investment.earnings || 0;
              const deduction = Math.min(investmentEarnings, remainingAmount);
              
              updatedInvestments[key] = {
                ...investment,
                earnings: investmentEarnings - deduction
              };
              
              remainingAmount -= deduction;
            } else {
              updatedInvestments[key] = investment;
            }
          });
          
          // Update user data with new investments and balance
          update(userRef, { 
            investments: updatedInvestments,
            'balance/current': currentBalance + depositAmount // Add to balance
          });
        }
      }, { onlyOnce: true });

      setSuccessMessage(`Deposit of Rs${depositAmount.toFixed(2)} processed successfully!`);
      setSelectedUserId("");
      setAmount("");
      setCurrentBalance(0);
      setTotalEarnings(0);
    } catch (error) {
      console.error("Error:", error);
      setError("Error processing deposit. Try again.");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 5000);
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total Available Earnings"
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= totalEarnings)) {
                    setAmount(value);
                  }
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
                helperText="Amount will be auto-filled with user's total earnings"
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                disabled={!selectedUserId || !amount || parseFloat(amount) <= 0}
                sx={{ color: 'white' }}
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