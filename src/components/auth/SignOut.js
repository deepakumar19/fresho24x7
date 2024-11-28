// src/components/SignOut.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
const SignOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    dispatch(logout());
    navigate('/sign-in');
  }, [dispatch, logout])
    
  return <></>
};

export default SignOut;
