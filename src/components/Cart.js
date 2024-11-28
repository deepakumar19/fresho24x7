import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { fetchCartFromFirestore, removeFromCart, selectCart, updateCartItemQuantity } from '../redux/cartSlice'
import Spinner from 'react-spinner-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { selectError, selectLoading } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const user = useSelector(state => state.authentication.user); // Get user from Redux
    const loading = useSelector(selectLoading); // Loading state from Redux
    const cart = useSelector(selectCart); // Get cart from Redux store
    const error = useSelector(selectError); // Error state from Redux

    const handleCheckout = () => {
        navigate("/checkout")
    }
    // If no user, navigate to home page
    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            dispatch(fetchCartFromFirestore()); // Fetch cart data for the logged-in user
        }
    }, [dispatch, user, navigate]);

    // Fetch products from Firestore
    const fetchProducts = useCallback(() => {
        try {
            const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
                const fetchedProducts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
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
        if (user) {
            const unsub = fetchProducts(); // Start fetching products
            return () => unsub(); // Cleanup the listener when component unmounts
        }
    }, [user, fetchProducts]);

    // Combine cart and products into a single list of items
    const itemsWithQuantity = cart.map((cartItem) => {
        const product = products.find((product) => product.id === cartItem.productId);
        return product ? { ...product, quantity: cartItem.quantity } : null;
    }).filter(item => item !== null);

    // Handle remove from cart
    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    // Handle quantity update (increment or decrement)
    const handleUpdateQuantity = (id, action) => {
        dispatch(updateCartItemQuantity({ id, action }));
    };


    return (
        <>

            <div className='row mb-5'>
                <div className='col-md-12 justify-content-end'>
                    <p>Total Amount: Rs. 100</p>
                    <button className='btn btn-warning mt-2' onClick={handleCheckout}>Checkout</button>
                </div>
                {itemsWithQuantity.length > 0 && (
                    itemsWithQuantity.map((product) => (<div className='col-md-8 mx-auto mt-5'>

                        <figure className="figure">
                            <a href="/category/1"><img src={product.image} className="figure-img img-fluid rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">{`${product?.name} ${product?.qty} Rs.${product.price}`}</figcaption>
                            <div className='mt-2 '>
                                <button className='btn btn-success m-2' onClick={() => handleUpdateQuantity(product.id, 'decrement')}>-</button>
                                {product.qty}
                                <button className='btn btn-success m-2' onClick={() => handleUpdateQuantity(product.id, 'increment')}>+</button>
                            </div>
                            <button className='btn btn-success mt-2 mx-auto justify-content-center' onClick={() => handleRemoveFromCart(product.id)}>Remove From Cart</button>
                        </figure>
                    </div>)))}
                {/* <div className='col-md-8 mx-auto mt-5'>

                    <figure className="figure">
                        <a href="/category/1"><img src="https://tse1.mm.bing.net/th?id=OIP.KghvU4nz3oHe8LNfKEi0PwHaFS&pid=Api&P=0&h=220" className="figure-img img-fluid rounded" alt="..." /></a>
                        <figcaption className="figure-caption fw-semibold">Fresh Watermelon 500 gms</figcaption>
                        <div className='mt-2 '>
                            <button className='btn btn-success m-2'>-</button>
                            1
                            <button className='btn btn-success m-2'>+</button>
                        </div>
                        <button className='btn btn-success mt-2 mx-auto justify-content-center'>Remove From Cart</button>
                    </figure>
                </div> */}


            </div>



        </>
    )
}

export default Cart