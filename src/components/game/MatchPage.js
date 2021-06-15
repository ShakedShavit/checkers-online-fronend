import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { GameContext } from '../../context/gameContext';
import { LoginContext } from '../../context/loginContext';
import socket from '../../server/socketio';
import GameBoard from './board/Board';
import PlayerBanner from './board/PlayerBanner';
import QuitButton from './QuitButton';
import GameStateBanner from './board/GameStateBanner';

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
    const [gameStateString, setGameStateString] = useState('');

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
        socket.emit('quitMatch');

        socket.on('quittingProcessDone', () => {
        console.log("🚀 ~ file: MatchPage.js ~ line 57 ~ socket.on ~ 'quittingProcessDone'", 'quittingProcessDone')
            history.push("/home");
        });
    }

    return (
        !!isSetupProcessDone &&
        <div className="match-page">
            <div className="player-banners-container">
                <PlayerBanner
                    username={player2.username}
                    rank={player2.rank}
                />
                <span>vs</span>
                <PlayerBanner
                    username={player1.username}
                    rank={player1.rank}
                />
            </div>

            <GameBoard
                isMyTurn={isMyTurn}
                setIsMyTurn={setIsMyTurn}
                isFirstPlayer={isFirstPlayer}
                isGameOver={isGameOver}
                setIsGameOver={setIsGameOver}
                gameStateString={gameStateString}
                setGameStateString={setGameStateString}
            />

            <div className="match-footer">
                <GameStateBanner gameState={gameStateString} isStartingPlayer={isMyTurn} />
                {
                    !!gameState && !gameState.isWinBool && !gameState.isTieBool &&
                    <QuitButton
                        hasGameStarted={true}
                        quitFunc={quitMatch}
                    />
                }
            </div>
        </div>
    )
};

export default MatchPage;