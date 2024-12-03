import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export const useFetchProducts = ()=>{
    const [products, setProducts] = useState([]);
    let fetchedProducts;
    const fn = useCallback(() => {
   
    try {
        const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
             fetchedProducts = snapshot.docs.map((doc) => ({
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
return {fn, fetchedProducts}
}