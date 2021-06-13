import React from 'react';

const PlayerBanner = (props) => {
    return (
        <div>
            <span>{props.username}</span>
            <span>{props.rank}</span>
        </div>
    )
};

export default PlayerBanner;