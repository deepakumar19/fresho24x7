import React, { useState } from 'react'
import {createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../../firebase';
const SignUp = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState('')
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        await sendEmailVerification(user)
        setMsg("Account created successfully!")
        }catch(err){
            setError(err.message)
        }
    }
    return (
        <div className='row'>
            {msg && <p>{msg}</p>}
            {error && <p>{error}</p>}
            <div className='col-md-6 mx-auto mt-5'>
                <form onSubmit={handleSubmit}>
                <div class="mb-3">
                        <label for="exampleInputName" class="form-label">Name</label>
                        <input type="text" class="form-control" id="exampleInputName" value={name} onChange={(e)=>setName(e.target.value)}/>
        
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e)=>setPassword(e.target.value)}  />
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp