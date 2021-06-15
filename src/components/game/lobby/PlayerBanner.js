import React, { useEffect, useState } from 'react';
import Loader from '../../main/Loader';
import RankCircle from '../../main/RankCircle';
import QuitButton from '../QuitButton';

function PlayerBanner(props) {
    const [isInvitingPlayer, setIsInvitingPlayer] = useState(false);

    useEffect(() => {
        if (!props.isLoading) setIsInvitingPlayer(false);
    }, [props.isLoading]);

    const inviteOnClick = () => {
        setIsInvitingPlayer(true);
        props.invitePlayerForMatchOnClick(props.player.socketId)
    }

    return (
        <div className="lobby__player-info">
            <span>{props.player.username}</span>
            <RankCircle rank={props.player.rank} />
            { props.player.isInMatch ?
                <span disabled>In a Match</span> :
                <button onClick={inviteOnClick} disabled={props.isWaitingForMatch}>Invite</button>
            }

            <div className="match-invite-loader-container">
                { props.isLoading && isInvitingPlayer && <Loader /> }
                { props.isWaitingForMatch && !props.isInvitedForMatch && isInvitingPlayer &&
                    <QuitButton
                        quitFunc={props.quitInvite}
                        hasGameStarted={false}
                    />
                }
            </div>
        </div>
    );
}

export default PlayerBanner;