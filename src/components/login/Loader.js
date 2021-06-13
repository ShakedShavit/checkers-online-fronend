import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);

    useEffect(() => {
        return () => { setIsComponentMounted(false); }
    }, []);

    setTimeout(() => {
        if (isComponentMounted) setShowLoadingAnimation(true);
    }, 1500);

    return (
        <>
            { showLoadingAnimation && <div className="lds-dual-ring"></div> }
        </>
    )
};

export default Loader;