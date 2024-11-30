import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../firebase';
import { useForm } from '../hooks/useForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { clearCart, removeFromCart } from '../redux/cartSlice';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useForm({name:'', address:'', phone:''})
  const navigate = useNavigate();
  const user = useSelector(selectUser)
  const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(formData)
    setLoading(true)
  // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "checkout"), {
      name: formData.name,
      address: formData.address,
      phone: formData.phone
    });
    if(docRef.id) {
      setLoading(false)
      navigate("/order-confirmation")
    }
    clearCart(user)
    
  }
  return (
    <div className='row'>
      <h2 className='lead text-secondary text-center mt-3'>Please enter delivery details:</h2>
      <div className='col-md-6 mx-auto mt-5'>
        <form onSubmit={handleSubmit}>
          <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" value={formData.name} onChange={setFormData} required/>
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Delivery Address:</label>
            <input type="text" class="form-control" id="address" value={formData.address} onChange={setFormData} required/>
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input type="text" class="form-control" id="phone" value={formData.phone} onChange={setFormData} required/>
          </div>
          <button type="submit" class="btn btn-primary" disabled={loading}
          >
            Place Order</button>

        </form>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Checkout