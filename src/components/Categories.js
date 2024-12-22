import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import Spinner from "react-spinner-material";
import SearchBar from './SearchBar';
import Pagination from '../utils/Pagination';
import "../../src/styles.css";


const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

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
                setLoading(false);
            });
            return unsub;
        } catch (err) {
            toast.error('Something went wrong!');
            console.error('Firestore error:', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsub = fetchCategories();
        return () => unsub(); // Clean up the listener
    }, [fetchCategories]);

    useEffect(() => {
        let filtered = categories;
        if (searchTerm !== '') {
            filtered = categories.filter((category) =>
                category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCategories(filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    }, [categories, searchTerm, currentPage]);

    useEffect(() => {
        setCurrentPage(1); // Reset to the first page when searchTerm changes
    }, [searchTerm]);

    const totalFilteredItems = searchTerm ? filteredCategories.length : categories.length;
    const noOfPages = Math.ceil(totalFilteredItems / pageSize);
    const pages = Array.from({ length: noOfPages }, (_, i) => i + 1);

    return (
        <>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
            <h2 className='lead fw-bold text-primary'>Choose a category</h2>
            {!loading ? (
                <div className='row mb-5'>
                    {filteredCategories.map((category) => (
                        <div className='col-md-3 mx-auto mt-2' key={category?.id}>
                            <figure className="figure">
                                <Link to={`/category/${category?.id}`}>
                                    <img src={category?.image} className="figure-img img-thumbnail rounded" alt={category?.name} />
                                </Link>
                                <figcaption className="figure-caption fw-semibold">{category?.name}</figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={'spinnerContainer'}>
                    <Spinner radius={120} color={"#003972"} stroke={2} visible={true} />
                </div>
            )}
            {filteredCategories.length === 0 && !loading && (
                <div className='d-flex justify-content-center'>
                    <p>No Items found</p>
                </div>
            )}
            {filteredCategories.length > 0 && (
                <div className='d-flex justify-content-center'>
                    <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            )}
        </>
    );
};

export default Categories;
