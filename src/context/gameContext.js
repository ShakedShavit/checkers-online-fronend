import React, { createContext, useReducer } from "react";
import gameReducer, { initialGameState } from "../reducers/gameReducer";

export const GameContext = createContext();

const GameContextProvider = (props) => {
    const [gameState, dispatchGameState] = useReducer(gameReducer, initialGameState);

    return (
        <GameContext.Provider value={ { gameState, dispatchGameState } }>
            { props.children }
        </GameContext.Provider>
    );
};

export default GameContextProvider;