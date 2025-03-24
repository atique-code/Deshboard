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
} from "@mui/material";
import { database } from "../../../src/firebaseConfig";
import { ref, onValue, update, push } from "firebase/database";

const AdminDepositForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map((uid) => ({
          id: uid,
          ...data[uid],
        }));
        setUsers(usersList);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find((user) => user.id === selectedUserId);
      setCurrentBalance(selectedUser?.balance || 0);
    } else {
      setCurrentBalance(0);
    }
  }, [selectedUserId, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !amount) {
      alert("Please select a user and enter deposit amount.");
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount > currentBalance) {
      alert("Deposit amount cannot exceed current balance.");
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
      };
      await push(depositRef, depositData);

      // 2. Set user's balance to 0
      const userRef = ref(database, `users/${selectedUserId}`);
      await update(userRef, { balance: 0 });

      setSuccessMessage("Deposit submitted successfully!");
      setSelectedUserId("");
      setAmount("");
      setCurrentBalance(0);
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing deposit. Try again.");
    }

    setTimeout(() => setSuccessMessage(""), 3000);
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
              >
                <MenuItem value="">-- Select User --</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.mobileNumber} {user.referralCode && `(${user.referralCode})`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {selectedUserId && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Balance"
                  value={currentBalance}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deposit Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>

            {successMessage && (
              <Grid item xs={12}>
                <Alert severity="success">{successMessage}</Alert>
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminDepositForm;
