import React from 'react';
import NameTag from '../../main/NameTag';
import RankCircle from '../../main/RankCircle';

const PlayerBanner = ({ username, rank }) => {
    return (
        <div className="match__player-banner">
            <NameTag username={username} />
            <RankCircle rank={rank} />
        </div>
    )
};

export default PlayerBanner;