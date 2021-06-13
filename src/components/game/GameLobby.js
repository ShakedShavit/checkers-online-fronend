import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../context/loginContext';
import socket from '../../server/socketio';
import Loader from '../main/Loader';
import QuitButton from './QuitButton';
import Modal from '../main/Modal';
import { updateRankAction } from '../../actions/loginActions';
import RankCircle from '../main/RankCircle';

const GameLobby = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const history = useHistory();

    const [playersOnline, setPlayerOnline] = useState([]);
    const [isWaitingForMatch, setIsWaitingForMatch] = useState(false);
    const [isInvitedForMatch, setIsInvitedForMatch] = useState(false);
    const [invitingPlayer, setInvitingPlayer] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasOpponentQuit, setHasOpponentQuit] = useState(false);

    useEffect(() => {
        socket.off('playerLeavingLobby');
        socket.off('playerJoiningLobby');

        // Player leaving lobby
        socket.on('playerLeavingLobby', (leavingPlayersId) => {
            setPlayerOnline(playersOnline.filter(player => !leavingPlayersId.includes(player.socketId)));
        });

        // Player entering lobby
        socket.on('playerJoiningLobby', (joiningPlayer) => {
            console.log(playersOnline, joiningPlayer);
            setPlayerOnline([ ...playersOnline, joiningPlayer ]);
        });
    }, [playersOnline]);

    useEffect(() => {
        socket.emit('enterGameLobby', ({
            username: userDataState.user.username,
            rank: userDataState.user.rank,
            id: userDataState.user._id
        }));

        socket.on('getRankedLobby', (players) => {
            setPlayerOnline([...players]);
        });
    
        // Invited to match
        socket.on('invitedForMatchClient', (invitingPlayer) => {
            setIsWaitingForMatch(true);
            setIsInvitedForMatch(true);
            setInvitingPlayer(invitingPlayer);
        });
    
        // Match invitation accepted, go to match
        socket.on('matchInvitationAccepted', ({ player1, player2 }) => {
            console.log(player1, player2);
            history.push({
                pathname: '/match',
                state: {
                    player1,
                    player2
                }
            });
        });
    
        // Opponent quit (during invitation)
        socket.on('opponentQuit', () => {
            setIsWaitingForMatch(false);
            setIsInvitedForMatch(false);
            setIsLoading(false);
            setInvitingPlayer({});
            setHasOpponentQuit(true);
        });

        // Get new rank
        socket.on('updateMyRank', (rank) => {
            if (rank === userDataState.rank) return;
            
            dispatchUserData(updateRankAction(rank));
        });

        // Player in lobby rank has changed
        socket.on('playerRankChanged', ({ userId, newRank }) => {
            let playersOnlineHolder = playersOnline.map(player => {
                if (player.userId !== userId) return player;
                return { ...player, rank: newRank };
            })
            setPlayerOnline(playersOnlineHolder);
        })
    
        return () => { socket.off('matchInvitationAccepted') }
    }, []);

    const invitePlayerForMatchOnClick = (invitedPlayerSocketId) => {
        setIsWaitingForMatch(true);
        setIsLoading(true);
        socket.emit('inviteForMatch', {
            invitedPlayerSocketId,
            invitingPlayer: {
                username: userDataState.user.username,
                rank: userDataState.user.rank
            }
        });
    }

    const acceptMatchInvite = () => {
        socket.emit('acceptMatchInvite');
    }

    const declineMatch = () => {
        socket.emit('declineMatch');
        setIsWaitingForMatch(false);
        setIsInvitedForMatch(false);
        setIsLoading(false);
        setInvitingPlayer({});
    }

    useEffect(() => {
        if (!hasOpponentQuit) return;

        let opponentQuitMsgTimeOut = setTimeout(() => {
            setHasOpponentQuit(false);
        }, 3000);

        return () => {
            clearTimeout(opponentQuitMsgTimeOut);
        }
    }, [hasOpponentQuit]);

    // player.isInMatch is not dynamic, remove it or add the socket events
    return (
        <div className="lobby-container">
            <div className="match-invite-loader-container">
                { isLoading && <Loader classList="match-invite-loader" /> }
                { hasOpponentQuit && <div>Opponent Quit</div> }
                { isWaitingForMatch && !isInvitedForMatch &&
                    <QuitButton
                        quitFunc={declineMatch}
                        hasGameStarted={false}
                    />
                }
            </div>
            
            { playersOnline.map(player => {
                if (player.userId === userDataState.user._id) return;
                return (
                    <div key={player.userId} className="lobby__player-info">
                        <span>{player.username}</span>
                        <RankCircle rank={player.rank} />
                        { player.isInMatch ?
                            <span disabled>In a Match</span> :
                            <button onClick={() => {invitePlayerForMatchOnClick(player.socketId)}} disabled={isWaitingForMatch}>Invite</button>
                        }
                    </div>
                )
            })}

            {
                playersOnline.every(player => player.userId === userDataState.user._id) &&
                <span>There are currently no players online</span>
            }

            { isInvitedForMatch && 
                <Modal
                    setIsModalOpen={setIsInvitedForMatch}
                    mainText={`Do you want to play against ${invitingPlayer.username}? ${invitingPlayer.username}'s rank is ${invitingPlayer.rank}`}
                    confirmFunc={acceptMatchInvite}
                    closeModalFunc={declineMatch}
                    confirmText={"Let's Duel"}
                    closeModalText={'Return to Lobby'}
                />
            }
        </div>
    )
};

// <span>Searching{searchDots}</span>
// <QuitButton hasGameStarted={false} isRankedMode={location.state.isRankedMode} />
// { isLoading && <Loader /> }

export default GameLobby;