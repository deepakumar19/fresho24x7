import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thunk to fetch cart data from Firestore
export const fetchCartFromFirestore = createAsyncThunk(
  'cart/fetchCartFromFirestore',
  async (userId, { rejectWithValue }) => {
    try {
      const cartRef = collection(db, 'cart');
      const cartQuery = await getDocs(cartRef);
      const cartItems = cartQuery.docs
        .filter(doc => doc.data().userId === userId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      return cartItems;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to add a product to the cart

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, qty, user }, { getState, rejectWithValue }) => {
    console.log(user)
    try {

      const cart = getState().cart.cart;
      const existingProduct = cart.find((item) => item.productId === product.id);

      if (existingProduct) {
        // Update the quantity of the existing product in the cart
        const docRef = doc(db, 'cart', existingProduct.id);
        await updateDoc(docRef, {
          qty: existingProduct.qty + qty
        });
        toast.success('Product quantity updated!');
        return { ...existingProduct, qty: existingProduct.qty + qty };  // Return updated product
      } else {
        // Add a new product to the cart
        const newDocRef = await addDoc(collection(db, 'cart'), {
          user:user.uid,
          productId: product.id,
          qty: qty
        });
        toast.success('Product added to cart!');
        return {
          id: newDocRef.id,   // Include the Firestore document ID
          productId: product.id,
          qty: qty,
          user:user.uid
        }; // Return new product added
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunks for removing an item from the cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState, rejectWithValue }) => {
    try {
      const cart = getState().cart.cart;
      const cartItem = cart.find(item => item.productId === id);
      if (cartItem) {
        await deleteDoc(doc(db, 'cart', cartItem.id)); // Remove from Firestore
        toast.success('Product removed from cart!');
        return cartItem.id; // Return the id to remove it from the local state
      }
    } catch (err) {
      toast.error('Failed to remove product from cart.');
      console.error('Error removing from cart:', err);
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to update item quantity in Firestore cart
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ id, action }, { getState, dispatch, rejectWithValue }) => {
    try {
      const cart = getState().cart.cart;
      const cartItem = cart.find(item => item.productId === id);

      if (cartItem) {
        const newQuantity = action === 'increment' ? cartItem.qty + 1 : cartItem.qty - 1;

        if (newQuantity > 0) {
          await updateDoc(doc(db, 'cart', cartItem.id), {
            qty: newQuantity
          });
          toast.success('Quantity updated!');
          return { id: cartItem.id, qty: newQuantity }; // Return updated quantity
        } else {
          // If quantity reaches 0, remove the item from the cart
          await dispatch(removeFromCart(id)); // Dispatch removeFromCart to handle deletion
        }
      }
    } catch (err) {
      toast.error('Failed to update quantity.');
      console.error('Error updating quantity:', err);
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching cart data
      .addCase(fetchCartFromFirestore.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartFromFirestore.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartFromFirestore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle add to cart action
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart.push(action.payload); // Add the new product or updated product to the cart
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = state.cart.filter(item => item?.id !== action.payload); // Remove item from local state
      })
      // Handle updating cart item quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const updatedCart = state.cart?.map((item) =>
          item?.id === action.payload?.id ? { ...item, qty: action.payload.qty } : item
        );
        state.cart = updatedCart; // Update the item quantity in the local state
      })
  },
});

export default cartSlice.reducer;

// Selectors
export const selectCart = (state) => state.cart.cart;
export const selectLoading = (state) => state.cart.loading;
export const selectError = (state) => state.cart.error;
