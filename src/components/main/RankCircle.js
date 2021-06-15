import React from 'react';
import rankImg from '../../images/crown.png';

function RankCircle({ rank }) {
    return (
        <div className="rank-circle tag">
            <img src={rankImg} alt="rank-icon" className="rank-icon"></img>
            <span>{rank}</span>
        </div>
    );
}

export default RankCircle;