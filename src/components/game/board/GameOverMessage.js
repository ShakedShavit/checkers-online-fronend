import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../context/loginContext';

function GameOverMessage(props) {
    const { userDataState } = useContext(LoginContext);

    const history = useHistory();

    const classList = props.isFirstPlayer ? "game-over__message" : "game-over__message second-player__message"

    const returnToLobbyOnClick = () => {
        history.push("/home");
    }

    return (
        <div className={classList}>
            <span>{props.message}</span>
            <span>Your new rank is {userDataState.user.rank}</span>
            <button onClick={returnToLobbyOnClick}>Return to Lobby</button>
        </div>
    );
}

export default GameOverMessage;