import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../context/loginContext';
import socket from '../../../server/socketio';
import Modal from '../../main/Modal';
import { updateRankAction } from '../../../actions/loginActions';
import PlayerBanner from './PlayerBanner';
import Notification from '../../main/Notification';

const GameLobby = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const history = useHistory();

    const [playersOnline, setPlayersOnline] = useState([]);
    const [isWaitingForMatch, setIsWaitingForMatch] = useState(false);
    const [isInvitedForMatch, setIsInvitedForMatch] = useState(false);
    const [invitingPlayer, setInvitingPlayer] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hasOpponentQuit, setHasOpponentQuit] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        socket.off('playerLeavingLobby');
        socket.off('playerJoiningLobby');
        socket.off('playerRankChanged');

        // Player leaving lobby
        socket.on('playerLeavingLobby', (leavingPlayersId) => {
            if (leavingPlayersId.includes(socket.id)) return;
            setPlayersOnline(playersOnline.filter(player => !leavingPlayersId.includes(player.socketId)));
        });

        // Player entering lobby
        socket.on('playerJoiningLobby', (joiningPlayers) => {
            if (joiningPlayers.some(player => player.socketId === socket.id)) return;
            setPlayersOnline([ ...playersOnline, ...joiningPlayers ]);
        });

         // Player in lobby rank has changed
         socket.on('playerRankChanged', ({ userId, newRank }) => {
            let playersOnlineHolder = playersOnline.map(player => {
                if (player.userId !== userId) return player;
                return { ...player, rank: newRank };
            })
            setPlayersOnline(playersOnlineHolder);
        });
    }, [playersOnline]);

    useEffect(() => {
        socket.emit('enterGameLobby', ({
            username: userDataState.user.username,
            rank: userDataState.user.rank,
            id: userDataState.user._id
        }));

        socket.on('getRankedLobby', (players) => {
            setPlayersOnline([...players]);
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

    // const declineMatch = () => {
    //     socket.emit('declineMatch');
    //     setIsWaitingForMatch(false);
    //     setIsInvitedForMatch(false);
    //     setIsLoading(false);
    //     setInvitingPlayer({});
    // }

    const quitOrDeclineInvite = () => {
        socket.emit('quitMatch');
        setIsWaitingForMatch(false);
        setIsInvitedForMatch(false);
        setIsLoading(false);
        setInvitingPlayer({});
    }

    useEffect(() => {
        if (!hasOpponentQuit) return;

        setIsNotificationOpen(true);

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
            { playersOnline.map(player => {
                if (player.userId === userDataState.user._id) return;
                return (
                    <PlayerBanner
                        key={player.socketId}
                        player={player}
                        invitePlayerForMatchOnClick={invitePlayerForMatchOnClick}
                        isWaitingForMatch={isWaitingForMatch}
                        isLoading={isLoading}
                        hasOpponentQuit={hasOpponentQuit}
                        isInvitedForMatch={isInvitedForMatch}
                        quitInvite={quitOrDeclineInvite}
                    />
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
                    closeModalFunc={quitOrDeclineInvite}
                    confirmText={"Let's Duel"}
                    closeModalText={'Return to Lobby'}
                />
            }

            { isNotificationOpen &&
                <Notification text={'Opponent Quit'} setIsNotificationOpen={setIsNotificationOpen} />
            }
        </div>
    )
};

// <span>Searching{searchDots}</span>
// <QuitButton hasGameStarted={false} isRankedMode={location.state.isRankedMode} />
// { isLoading && <Loader /> }

export default GameLobby;