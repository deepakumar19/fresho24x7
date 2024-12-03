import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { db } from '../firebase';
import { useForm } from '../hooks/useForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, selectCart } from '../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';
import { placeOrder } from '../redux/orderSlice';

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useForm({ name: '', address: '', phone: '' })
  const [products, setProducts] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  const cart = useSelector(selectCart); // Get cart from Redux store
  const fetchProducts = useCallback(() => {
    try {
      const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(fetchProducts)
        setProducts(fetchedProducts);
      });
      return unsub;
    } catch (err) {
      toast.error('Something went wrong while fetching products!');
      console.error('Firestore error:', err);
    }
  }, []);

  // Set up products fetching on component mount
  useEffect(() => {

    const unsub = fetchProducts(); // Start fetching products
    return () => unsub(); // Cleanup the listener when component unmounts

  }, [fetchProducts]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    setLoading(true)
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "checkout"), {
      name: formData.name,
      address: formData.address,
      phone: formData.phone
    });
    if (docRef.id) {
      const itemsWithQuantity = cart.map((cartItem) => {
        const product = products.find((product) => product.id === cartItem.productId);
        return product ? { ...product, qty: cartItem.qty } : null;
      }).filter(item => item !== null);
      console.log(itemsWithQuantity);
      itemsWithQuantity.map(item => {
        dispatch(placeOrder({ name: item.name, qty: item.qty, price: item.price, user }))
      })
      cart.map(c => {
        if (c.user === user.uid) {
          console.log(c)

          dispatch(removeFromCart(c.productId));


        }
      });

      setLoading(false)
      navigate("/order-confirmation")
    }


  }
  return (
    <div className='row'>
      <h2 className='lead text-secondary text-center mt-3'>Please enter delivery details:</h2>
      <div className='col-md-6 mx-auto mt-5'>
        <form onSubmit={handleSubmit}>
          <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" value={formData.name} onChange={setFormData} required />
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Delivery Address:</label>
            <input type="text" class="form-control" id="address" value={formData.address} onChange={setFormData} required />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input type="text" class="form-control" id="phone" value={formData.phone} onChange={setFormData} required />
          </div>
          <button type="submit" class="btn btn-primary" disabled={loading}
          >
            Place Order</button>

        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Checkout