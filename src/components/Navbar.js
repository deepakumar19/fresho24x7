import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const user = useSelector(selectUser);

    return (
        <>
            <nav class="navbar navbar-light" style={{ backgroundColor: '#285943' }}>
                <div class="container-fluid">
                    <Link class="navbar-brand text-light fw-bold" to="/">Fresho24x7</Link>
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <Link to="/" className="text-light nav-link">Home</Link>
                        </li>
                        {user && (
                            <>
                                <li class="nav-item">
                                    <Link to="/cart" className="text-light nav-link">Cart</Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/orders" className="text-light nav-link">Orders</Link>
                                </li> </>)}
                        <li class="nav-item">
                            <Link to="/sign-out" className="text-light nav-link">{user ? 'Sign Out' : 'Sign In'}</Link>
                        </li>
                    </ul>
                </div>

            </nav>

            <Outlet />
        </>
    )
}

export default Navbar