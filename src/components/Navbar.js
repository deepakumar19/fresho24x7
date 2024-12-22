import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';

const Navbar = () => {
    const user = useSelector(selectUser);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#285943' }}>
                <div className="container-fluid">
                    <Link className="navbar-brand text-light fw-bold" to="/">Fresho24x7</Link>
                    
                    {/* Toggler for collapsing the navbar */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible content */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/" className="text-light nav-link">Home</Link>
                            </li>
                            {user && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/cart" className="text-light nav-link">Cart</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/orders" className="text-light nav-link">Orders</Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <Link to="/sign-out" className="text-light nav-link">
                                    {user ? 'Sign Out' : 'Sign In'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Outlet />
        </>
    );
};

export default Navbar;
