import React, { useContext } from "react";
import { LoginContext } from "../../context/loginContext";
import GameLobby from "../game/lobby/GameLobby";
import Header from "../main/Header";
import checkersVideo from "../../videos/checkers-game.mp4";
import checkersImg from "../../images/mobile-match.png";

const HomePage = () => {
    const { userDataState } = useContext(LoginContext);

    return (
        <div className="home-page">
            <Header />
            {!!userDataState.user ? (
                <GameLobby />
            ) : (
                <div className="video-container">
                    <video className="home-page-video" controls autoplay="true" muted loop="true">
                        <source src={checkersVideo} type="video/mp4" />
                    </video>
                    <div className="image-container">
                        <h1>PLAY CHECKERS WITH YOUR FRIENDS</h1>
                        <img src={checkersImg} alt="mobile-checkers-match"></img>
                    </div>
                </div>
            )}
        </div>
    );
};

// {
//     !!userDataState.user &&
//     <button onClick={searchGameByRankOnClick}>Search for game</button>
// }
// <button onClick={searchQuickPlayOnClick}>Quick play</button>

export default HomePage;
