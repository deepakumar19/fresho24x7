import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import styles from './Categories.module.css'
import { Link } from 'react-router-dom'
import { db } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from "react-spinner-material"

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch categories from Firestore and listen to updates
    const fetchCategories = useCallback(() => {
        try {
            setLoading(true);
            const categoriesRef = collection(db, 'categories');
            const q = query(categoriesRef, orderBy('createdAt', 'asc'));
            const unsub = onSnapshot(q, (snapshot) => {
                const fetchedCategories = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(fetchedCategories);
                setFilteredCategories(fetchedCategories);
                setLoading(false);
            });
            return unsub;
        } catch (err) {
            toast.error('Something went wrong!');
            console.error('Firestore error:', err);
            setLoading(false);
        }
    }, [setCategories, setFilteredCategories]);

    useEffect(() => {
        const unsub = fetchCategories();
        return () => unsub();  // Clean up the listener
    }, [fetchCategories]);
    return (
        <>

            <h2 className='lead fw-bold text-primary'>Choose a category</h2>
            {!loading ? <div className='row mb-5'>
                {categories?.map((category) => (<div className='col-md-3 mx-auto mt-2' key={category?.id}>

                    <figure class="figure">
                        <Link to={`/category/${category?.id}`}><img src={category?.image} className="figure-img img-thumbnail rounded" alt={category?.name} /></Link>
                        <figcaption class="figure-caption fw-semibold">{category?.name}</figcaption>
                    </figure>
                </div>))}
                {/* <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                    <a href="/category/2"><img src="https://tse3.mm.bing.net/th?id=OIP.Zh_sTOWi0kS-dAHyuuehvAAAAA&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                        <figcaption class="figure-caption fw-semibold">Oil & Ghee</figcaption>
                    </figure>

                </div>

                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse3.mm.bing.net/th?id=OIP.TqdQUhBYLLBJARrpJvOsfAAAAA&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." />
                        <figcaption class="figure-caption fw-semibold">Tea & Coffee</figcaption>
                    </figure>

                </div>

                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse4.mm.bing.net/th?id=OIP.F8y5hi7_KpbCthjwfuO7lQHaFj&pid=Api&P=0&h=220" className="figure-img img-fluid rounded" alt="..." />
                        <figcaption class="figure-caption fw-semibold">Biscuits & Snacks</figcaption>
                    </figure>

                </div>

                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse2.mm.bing.net/th?id=OIP.RvWZYxevx-s677lbe7qWlAHaEW&pid=Api&P=0&h=220" className='figure-img img-thumbnail rounded' alt="..." />
                        <figcaption class="figure-caption fw-semibold">Chips & Namkeen</figcaption>
                    </figure>

                </div>
                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse1.mm.bing.net/th?id=OIP.yUBtzbShgZELKgmqkIgEkAHaEK&pid=Api&P=0&h=220" className='figure-img img-thumbnail rounded' alt="..." />
                        <figcaption class="figure-caption fw-semibold">Rice, Atta & Dals</figcaption>
                    </figure>

                </div>
                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse4.mm.bing.net/th?id=OIP.EaUZFtSRaPwb2IH_4EYkTgHaDt&pid=Api&P=0&h=220" className='figure-img img-thumbnail rounded' alt="..." />
                        <figcaption class="figure-caption fw-semibold">Drinks & Juices</figcaption>
                    </figure>

                </div>
                <div className='col-md-3 mx-auto mt-2'>

                    <figure class="figure">
                        <img src="https://tse4.mm.bing.net/th?id=OIP.Lp1G2EoIm-uki0fRXae5KgHaEH&pid=Api&P=0&h=220" className='figure-img img-thumbnail rounded' alt="..." />
                        <figcaption class="figure-caption fw-semibold">Dairy & Bread</figcaption>
                    </figure>

                </div> */}

             
            </div>:(
                    <div className={styles.spinnerContainer}>
                        <Spinner radius={120} color={"#003972"} stroke={2} visible={true} />
                    </div>
                )}
        </>
    )
}

export default Categories