export const startGameAction = () => ({
    type: "START_GAME",
});

export const movePlayedAction = (squareObjectsBoard, isWin, isTie) => ({
    type: "MOVE_PLAYED",
    squareObjectsBoard,
    isWin,
    isTie,
});
