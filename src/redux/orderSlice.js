import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async ({ name, qty,price, user }, { getState, rejectWithValue }) => {
      try {
  
        
          // Add a new product to the cart
          const newDocRef = await addDoc(collection(db, 'orders'), {
            user:user.uid,
            
            date: new Date().toDateString(),
            itemName: name,
              itemQuantity: qty,
              itemPrice:price,
              total:qty*price
          });
          return {
            id: newDocRef.id,   // Include the Firestore document ID
            user:user.uid,
            date: new Date().toDateString(),
            itemName: name,
              itemQuantity: qty,
              itemPrice:price,
              total:qty*price
           
          }; // Return new product added
        
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );

  const initialState = {
    orders: [],
    loading: false,
    error: null,
  };
  const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(placeOrder.fulfilled, (state, action) => {
          state.orders.push(action.payload); // Add the new product or updated product to the cart
          state.loading = false;
        })
    }
  });

  export default orderSlice.reducer;

export const selectOrder = (state) => state.orders.orders
export const selectLoading = (state) => state.orders.loading;
export const selectError = (state) => state.orders.error;