import React, { useContext } from 'react';
import { LoginContext } from '../../context/loginContext';
import GameLobby from '../game/lobby/GameLobby';
import Header from '../main/Header';

const HomePage = () => {
    const { userDataState } = useContext(LoginContext);
    
    // const searchGameByRankOnClick = () => {
    //     history.push({
    //         pathname: '/lobby',
    //         state: { isRankedMode: true }
    //     });
    // }

    // const searchQuickPlayOnClick = () => {
    //     history.push({
    //         pathname: '/lobby',
    //         state: { isRankedMode: false }
    //     });
    // }

    return (
        <div>
            <Header />
            {
                !!userDataState.user &&
                <GameLobby />
            }
        </div>
    )
};

// {
//     !!userDataState.user &&
//     <button onClick={searchGameByRankOnClick}>Search for game</button>
// }
// <button onClick={searchQuickPlayOnClick}>Quick play</button>

export default HomePage;