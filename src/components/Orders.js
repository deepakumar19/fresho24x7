import { collection, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { db } from '../firebase';
import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';
import "../../src/styles.css";

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

  return (
    <div className="lead mx-auto mt-5">
      {orders?.length === 0 && <p className="text-center text-muted">No orders found.</p>}
      <>
        {loading && <div className={'spinnerContainer'}>
          <Spinner radius={120} color={"#003972"} stroke={2} visible={true} />
        </div>}
        {!loading && <><h1 className="text-center text-secondary">Orders</h1>
        <div className='d-none d-md-block'>
          <div className="table-responsive ">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
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
                    <td>{order?.itemPrice}</td>
                    <td>{order?.itemQuantity}</td>
                    <td>{order?.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible table for smaller screens */}
        <div className="d-md-none">
          {orders?.map((order, i) => (
            <div key={order?.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Order #{i + 1}</h5>
                <p className="card-text">
                  <strong>Order Date:</strong> {order?.date}
                </p>
                <p className="card-text">
                  <strong>Item Name:</strong> {order?.itemName}
                </p>
                <p className="card-text">
                  <strong>Item Price:</strong> ${order?.itemPrice}
                </p>
                <p className="card-text">
                  <strong>Quantity:</strong> {order?.itemQuantity}
                </p>
                <p className="card-text">
                  <strong>Total:</strong> ${order?.total}
                </p>
              </div>
            </div>
          ))}
        </div>
          </>}
      </>
    </div>

  )
}

export default Orders