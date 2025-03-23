import React, { useEffect, useState } from 'react';
import { database } from '../../firebaseConfig';
import { onValue, ref, update } from 'firebase/database';

const RechargeApproval = () => {
  const [rechargeRequests, setRechargeRequests] = useState([]);

  useEffect(() => {
    const rechargeRef = ref(database, 'rechargeRequests');
    const unsubscribe = onValue(rechargeRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, req]) => ({ id, ...req }));
      setRechargeRequests(list);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = (request) => {
    // Step 1: Update recharge request status to "approved"
    const requestRef = ref(database, `rechargeRequests/${request.id}`);
    update(requestRef, {
      status: 'approved',
      approvedAt: Date.now()
    });

    // Step 2: Update user balance
    const balanceRef = ref(database, `users/${request.userId}/balance`);
    update(balanceRef, {
      // 👇 This will add recharge amount to existing balance
      '.sv': { increment: request.amount }
    });
  };

  return (
    <div className="container">
      <h3>Recharge Requests</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Amount</th>
            <th>Payment Type</th>
            <th>Status</th>
            <th>TID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rechargeRequests.map((req) => (
            <tr key={req.id}>
              <td>{req.userId}</td>
              <td>{req.amount}</td>
              <td>{req.paymentType}</td>
              <td>{req.status}</td>
              <td>{req.tid || 'N/A'}</td>
              <td>
                {req.status === 'pending' ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(req)}
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-success">Approved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RechargeApproval;
