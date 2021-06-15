import React from 'react';

const Loader = ({ classList = '' }) => {
    return (
        <div className={classList + " lds-grid"}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
};

export default Loader;