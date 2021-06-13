import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { GameContext } from '../../context/gameContext';
import { LoginContext } from '../../context/loginContext';
import socket from '../../server/socketio';
import GameBoard from './board/Board';
import PlayerBanner from './board/PlayerBanner';
import QuitButton from './QuitButton';

const MatchPage = () => {
    const { userDataState } = useContext(LoginContext);
    const { gameState } = useContext(GameContext);

    const history = useHistory();
    const location = useLocation();

    const [player1, setPlayer1] = useState({});
    const [player2, setPlayer2] = useState({});
    const [isFirstPlayer, setIsFirstPlayer] = useState(false);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [isSetupProcessDone, setIsSetupProcessDone] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        return () => {
            // Emit event for leaving match (maybe it's because im not saving user_data_state on cookies for testing)
            // if (!isGameOver) return;
            // The quitting func (instead of sending quitFunc to the quit button)
            
            // socket.emit('quitMatch');
        }
    }, []); // Where's the array mate?

    useEffect(() => {
        // Verifies user
        if (!userDataState.user) return history.push("/home");

        setPlayer1(location.state.player1);
        setPlayer2(location.state.player2);

        console.log(userDataState.user);
    }, [userDataState.user, history]);

    useEffect(() => {
        if (!player1.username) return;

        let isFirstPlayerHolder = player1.userId === userDataState.user._id;
        setIsFirstPlayer(isFirstPlayerHolder);
        setIsMyTurn(isFirstPlayerHolder);

        setIsSetupProcessDone(true);
    }, [player1]);

    const quitMatch = () => {
        console.log('sdas');
        socket.emit('quitMatch');

        socket.on('quittingProcessDone', () => {
        console.log("🚀 ~ file: MatchPage.js ~ line 57 ~ socket.on ~ 'quittingProcessDone'", 'quittingProcessDone')
            history.push("/home");
        });
    }

    // const player1 = location.state.player1;
    // const player2 = location.state.player2;
    // const isFirstPlayer = player1.userId === userDataState.user._id;

    return (
        !!isSetupProcessDone &&
        <div>
            <PlayerBanner
                username={player2.username}
                rank={player2.rank}
            />

            <GameBoard
                isMyTurn={isMyTurn}
                setIsMyTurn={setIsMyTurn}
                isFirstPlayer={isFirstPlayer}
                isGameOver={isGameOver}
                setIsGameOver={setIsGameOver}
            />

            <PlayerBanner
                username={player1.username}
                rank={player1.rank}
            />

            {
                !!gameState && !gameState.isWinBool && !gameState.isTieBool &&
                <QuitButton
                    hasGameStarted={true}
                    quitFunc={quitMatch}
                />
            }
        </div>
    )
};

export default MatchPage;