import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../context/gameContext';

const Square = (props) => {
    const { gameState, dispatchGameState } = useContext(GameContext);

    const rowIndex = props.rowIndex;
    const columnIndex = props.columnIndex;

    const squareClassList = props.getSquareClassList(rowIndex, columnIndex);

    const doesSquareContainPiece = squareClassList.includes('piece');
    const isSquareAMovingOption = squareClassList.includes('green');

    const squareOnClick = () => {
        if (!props.isMyTurn) return;

        let currentTurn = gameState.isRedPlayersTurn; // Was a move made

        gameState.squareOnClick(rowIndex, columnIndex);

        if (doesSquareContainPiece) {
            gameState.pieceOnClick([rowIndex, columnIndex]);
        }

        // Change turn
        if (gameState.isRedPlayersTurn !== currentTurn) props.setIsMyTurn(!props.isMyTurn);
    
        //if isRedPlayersTurn has changed than send event with the new board
        props.renderBoard();
    }

    return (
        (doesSquareContainPiece || isSquareAMovingOption) ?
        <div className='board-square black-square' onClick={squareOnClick}>
            <div className={squareClassList}></div>
        </div> :
        <div className={squareClassList} onClick={squareOnClick}></div>
    )
};

export default Square;