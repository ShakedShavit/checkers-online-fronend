import React from 'react';

const GameStateBanner = (props) => {
    return (
        <div className="game-state-banner">
            {props.gameState}
        </div>
    )
};

export default GameStateBanner;