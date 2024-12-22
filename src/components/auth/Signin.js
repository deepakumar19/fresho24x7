import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';
import { selectUser, selectLoading, selectError } from '../../redux/authSlice';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg] = useState('');
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state selectors
    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    // Redirect to products page if logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    // Validation logic
    const validate = () => {
        const validationErrors = {};
        if (!email) {
            validationErrors.email = 'Email is required';
            //eslint-disable-next-line no-useless-escape
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            validationErrors.email = 'Enter a valid email address';
        }
        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters long';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (validate()) {
            // Dispatch login action
            dispatch(login({ email, password }));
        }
    };

    return (
        <div className="container">
            <div className="row align-items-center">
                {/* Display messages */}
                {msg && <p className="text-success">{msg}</p>}
                {error && <p className="text-danger">{error}</p>}

                {/* Form Section */}
                <div className="col-lg-6 col-md-8 col-sm-12 mt-5">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                Email address
                            </label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="exampleInputEmail1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="exampleInputPassword1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={handleSignIn}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-3">
                        <Link to="/sign-up" className="text-success text-decoration-none">
                            Don't have an account? Click here to sign up
                        </Link>
                    </div>
                </div>

                {/* Image Section */}
                <div className="col-lg-6 col-md-4 col-sm-12 mt-5 text-center">
                    <img
                        src="https://thumbs.dreamstime.com/b/full-grocery-cart-shopping-isolated-white-background-35581745.jpg"
                        className="img-fluid"
                        alt="sign-in"
                        style={{ maxHeight: '300px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Signin;
