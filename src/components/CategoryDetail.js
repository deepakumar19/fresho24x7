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
    // Fetch products of a particular category
    const itemsWithCategory = products?.filter((p) => {
        return p.category === categoryId;

    })
    const addToCartHandler = (product) => {
        if (!user) {
            navigate("/")
        }
        else
            dispatch(addToCart({ product, qty }))

    };
    console.log(itemsWithCategory)
    return (
        <>

            {!isItemDetailPage && (<>
                <div className='row mb-5'>
                    {itemsWithCategory?.length > 0 ? (itemsWithCategory?.map(item => (<div className='col-md-3 mx-auto mt-2'>

                        <Link to={`product/${item.id}`}> <figure className="figure">
                            <img src={item?.image} className="figure-img img-thumbnail rounded" alt={item?.name} />
                            <figcaption className="figure-caption fw-semibold">{`${item?.name} ${item?.qty} Rs.${item.price}`}</figcaption>
                            <button className='btn btn-success mt-2' onClick={() => addToCartHandler(item)}>Add To Cart</button>
                        </figure></Link>

                    </div>))) : <div>Coming Soon!</div>}
                    {/* <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse3.mm.bing.net/th?id=OIP.MG0OStp9KcuBRHOg0mCQuQHaFj&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Capsicum 1kg</figcaption>
                            <button className='btn btn-success mt-2'>Add To Cart</button>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse3.mm.bing.net/th?id=OIP.wBmTEgRXlaKlVY-gTi2GiQHaFj&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Green Peas 500 gms</figcaption>
                            <button className='btn btn-success mt-2'>Add To Cart</button>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse2.mm.bing.net/th?id=OIP.QwnWcdqv2shQ_mFPf-OO_AHaFj&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Cabbage 500 gms</figcaption>
                            <button className='btn btn-success mt-2'>Add To Cart</button>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse3.mm.bing.net/th?id=OIP.jthREOGzayRmofdRfMaYYQHaFM&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Bananas 6-8 pcs</figcaption>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse4.mm.bing.net/th?id=OIP.Y46w_AQLE_Q-faeaDagghgHaFZ&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Oranges 500 gms</figcaption>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse1.mm.bing.net/th?id=OIP.41RFBSEaeEVWhBXy_etZDQHaFj&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Apples 500 gms</figcaption>
                        </figure>
                    </div>
                    <div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <a href="/category/1"><img src="https://tse1.mm.bing.net/th?id=OIP.KghvU4nz3oHe8LNfKEi0PwHaFS&pid=Api&P=0&h=220" className="figure-img img-thumbnail rounded" alt="..." /></a>
                            <figcaption className="figure-caption fw-semibold">Fresh Watermelon 500 gms</figcaption>
                        </figure>
                    </div> */}
                </div></>)}
            <Outlet />
        </>

    )
}

export default CategoryDetail