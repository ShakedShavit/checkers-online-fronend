import React from 'react';
import { NavLink } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="page-not-found-wrapper">
            <h1>404</h1>
            <br></br><br></br>
            <h4>Page not found</h4>
            <br></br><br></br><br></br>
            <NavLink className="home-link" to="/home">Home</NavLink>
        </div>
    )
};

export default PageNotFound;