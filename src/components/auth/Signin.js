import React from 'react'
import { useState, useEffect} from "react"
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice'
import { selectUser, selectLoading, selectError } from '../../redux/authSlice';
import styles from "./Signin.module.css";

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state selectors
    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    
    
    // Redirect to products page if logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]); // Re-run effect when user changes

    const handleSignIn = async () => {
        // Dispatch login action
        dispatch(login({ email, password }));
    };

    return (
        <div className='row'>
            {msg && <p>{msg}</p>}
            {error && <p>{error}</p>}
            <div className='col-md-4 mt-5'>
                <form>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" value={email} onChange={e=> setEmail(e.target.value)} />
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1"  value={password} onChange={e=> setPassword(e.target.value)}/>
                    </div>
                    <button type="submit" class="btn btn-primary"onClick={handleSignIn} 
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Signing In...' : 'Sign In'}</button>
                </form>
                <div className='mt-3'><Link to="/sign-up" className={`link-success ${styles.link}`}>Don't have an account? Click here to sign up</Link></div>
            </div>
            <div  className='col-md-8 mt-0 justify-content-end'>
                <img src="https://thumbs.dreamstime.com/b/full-grocery-cart-shopping-isolated-white-background-35581745.jpg" className={`img-fluid ${styles.image}`} alt="sign-in"/>
            </div>
        </div>
    )
}

export default Signin