import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { db } from '../firebase';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchOrders = useCallback(() => {
    try {
      setLoading(true);
      const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      });
      return unsub;
    } catch (err) {
      toast.error('Something went wrong!');
      console.error('Firestore error:', err);
      setLoading(false);
    }
  }, [setOrders]);

  useEffect(() => {
    const unsub = fetchOrders();
    return () => unsub();  // Clean up the listener
  }, [fetchOrders]);
  // function groupBy(array, field) {
  //   return array.reduce((acc, item) => {
  //     const key = item[field];
  //     if (!acc[key]) {
  //       acc[key] = [];
  //     }
  //     acc[key].push(item);
  //     return acc;
  //   }, {});
  // }
  // const grouped = groupBy(orders, 'date');
  // const keys = Object.keys(grouped)

  return (
    <div className='lead mx-auto mt-5'>
      <h1 className='text-center text-secondary'>Orders</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Order Date</th>
            <th scope="col">Item Name</th>
            <th scope="col">Item Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
          </tr>
        </thead>

        <tbody>
          {orders?.map((order, i) => (
            <tr key={order?.id}>
              <th scope="row">{i + 1}</th>
              <td>{order?.date}</td>
              <td>{order?.itemName}</td>
              <td>{order?.itemQuantity}</td>
              <td>{order?.itemPrice}</td>
              <td>{order?.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders