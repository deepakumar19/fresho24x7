import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account created successfully!");
        } catch (err) {
            const errorMap = {
                "auth/email-already-in-use": "This email is already registered.",
                "auth/invalid-email": "The email address is not valid.",
                "auth/weak-password": "Password should be at least 6 characters.",
            };
            toast.error(errorMap[err.code] || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-4 mx-auto mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div id="emailHelp" className="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default SignUp;
