import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginPage = () => {
    const [formErrMsg, setFormErrMsg] = useState('');
    const [isSignupForm, setIsSignupForm] = useState(false);

    const switchForm = () => {
        setFormErrMsg('');
        setIsSignupForm(!isSignupForm);
    }
    
    return (
        <div className="login-page">
            <div className="login-mode-buttons__container">
                <button disabled={!isSignupForm} onClick={switchForm}>Login</button>
                <button disabled={isSignupForm} onClick={switchForm}>Signup</button>
            </div>

            <h1>{isSignupForm ? 'Signup' : 'Login'}</h1>
            <LoginForm
                isSignupForm={isSignupForm}
                formErrMsg={formErrMsg}
                setFormErrMsg={setFormErrMsg}
                setIsSignupForm={setIsSignupForm}
            />

            <NavLink to="/home" className="home-link">Home</NavLink>
        </div>
    )
};

export default LoginPage;

// { isSignupForm ? <SignupForm /> : <LoginForm /> }