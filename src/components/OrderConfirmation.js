import React from 'react'
import { Link } from 'react-router-dom'

export const OrderConfirmation = () => {
    return (
        <div className='row'>
            <div className='col-md-6 mx-auto mt-5 bg-success rounded p-5'>
                <p className='text-center text-white lead'>Congratulations! Your order has been placed successfully!</p>
                <div className='col-md-6 mx-auto'><Link to="/" className='nav-link'>Click here to go to home page</Link></div>
            </div>
        </div>
    )
}
