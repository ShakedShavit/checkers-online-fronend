import { CheckersLogic } from '../game/checkersLogic2';

export const initialGameState = null;

const gameReducer = (gameState, action) => {
    switch (action.type) {
        case "START_GAME":
            const game = new CheckersLogic(true);
            game.creatingInitialBoardLogic();
            return game;
        case "MOVE_PLAYED":
            return new CheckersLogic(!gameState.isRedPlayersTurn, action.squareObjectsBoard, action.isWin, action.isBool);
        default:
            return { ...gameState };
    }
};

export default gameReducer;