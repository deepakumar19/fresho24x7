import React, { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import SearchBar from './SearchBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const CategoryDetail = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1); // Quantity state
    const navigate = useNavigate();
    const categoryId = useParams().id
    const isItemDetailPage = useLocation().pathname.includes("product");
    const user = useSelector(state => state.authentication.user); // Get user from Redux
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
        if (user) {
            const unsub = fetchProducts(); // Start fetching products
            return () => unsub(); // Cleanup the listener when component unmounts
        }
    }, [user, fetchProducts]);

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
    console.log('products', products);
    console.log(categories)

    const selectedCategory = categories.filter(category=>category.id === categoryId);
    // Fetch products of a particular category
    const itemsWithCategory = products?.filter((p) => {
        return p.category === categoryId;

    })
    const addToCartHandler = (product) => {
        if (!user) {
            navigate("/")
        }
        else
            dispatch(addToCart({ product, qty, user }))

    };
    console.log(itemsWithCategory)
    return (
        <>

            {!isItemDetailPage && (<>
                <div className='row mb-5'>
                    <h2 className='lead fw-bold text-secondary mt-3 mb-3'>{selectedCategory?.[0]?.name}</h2>
                    {itemsWithCategory?.length > 0 ? (itemsWithCategory?.map(item => (<div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <img src={item?.image} className="figure-img img-thumbnail rounded" alt={item?.name} />
                            <figcaption className="figure-caption fw-semibold">{`${item?.name} Rs.${item.price}`}</figcaption>
                            <button className='btn btn-success mt-2' onClick={() => addToCartHandler(item)}>Add To Cart</button>
                        </figure>

                    </div>))) : <div>Coming Soon!</div>}
                  
                </div></>)}
            <Outlet />
            <ToastContainer />
        </>

    )
}

export default CategoryDetail