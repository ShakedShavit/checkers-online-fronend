import React, { useContext, useEffect, useState } from "react";
import BoardRow from "./BoardRow";
import socket from "../../../server/socketio/socketio";
import { GameContext } from "../../../context/gameContext";
import { movePlayedAction, startGameAction } from "../../../actions/gameActions";
import { updateRankAction } from "../../../actions/loginActions";
import { LoginContext } from "../../../context/loginContext";
import GameOverMessage from "./GameOverMessage";

const GameBoard = (props) => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);
    const { gameState, dispatchGameState } = useContext(GameContext);

    const [rowsBoard, setRowsBoard] = useState([]);
    const [squaresClassListsArray, setSquareClassListsArray] = useState([]);
    const [didInitialRenderOccur, setDidInitialRenderOccur] = useState(false);
    const [boardClassList, setBoardClassList] = useState("");
    const [isFirstTurnOfMatch, setIsFirstTurnOfMatch] = useState(true);
    const [hasOpponentQuit, setHasOpponentQuit] = useState(false);

    // Game over
    useEffect(() => {
        if (isFirstTurnOfMatch) return;

        console.log(userDataState.user.rank);

        props.setIsGameOver(true);
    }, [userDataState.user]);

    useEffect(() => {
        dispatchGameState(startGameAction());

        let rowsArr = [];
        let squareClassesArr = [];
        for (let i = 0; i < 8; i++) {
            rowsArr.push(i);

            // Setting initial squares classes lists
            for (let j = 0; j < 8; j++) {
                squareClassesArr.push("");
            }
        }
        setRowsBoard(rowsArr);
        setSquareClassListsArray(squareClassesArr);

        socket.on("getNewBoard", ({ squareObjectsBoard: newSquareObjectsBoard, isWin, isTie }) => {
            dispatchGameState(movePlayedAction(newSquareObjectsBoard, isWin, isTie));

            if (isWin) {
                props.setGameStateString("Opponent Won!");
                return;
            }
            if (isTie) {
                props.setGameStateString("Its a Tie");
                return;
            }
            props.setIsMyTurn(true);
        });

        // Opponent quit (during match)
        socket.on("opponentQuitDuringMatch", () => {
            setHasOpponentQuit(true);
        });
    }, []);

    useEffect(() => {
        if (!gameState) return;
        renderBoard();

        socket.off("updateMyRank");
        // Get new rank
        socket.on("updateMyRank", (rank) => {
            // if (!gameState.isWinBool && !gameState.isTieBool) return;
            dispatchUserData(updateRankAction(rank));
        });
    }, [gameState]);

    // Should it flip the board (based on how is playing first)
    useEffect(() => {
        if (props.isFirstPlayer) {
            setBoardClassList("game-board");
        } else {
            setBoardClassList("game-board second-player__board");
        }
    }, [props.isFirstPlayer]);

    let squaresClassLists = [];

    useEffect(() => {
        if (squaresClassListsArray.length !== 0 && !didInitialRenderOccur) {
            setDidInitialRenderOccur(true);
            renderBoard();
        }
    }, [squaresClassListsArray]);

    useEffect(() => {
        props.isMyTurn
            ? props.setGameStateString("My turn")
            : props.setGameStateString("Opponent's turn");

        if (isFirstTurnOfMatch) {
            setIsFirstTurnOfMatch(false);
            return;
        }

        if (props.isMyTurn) {
            if (gameState.isWinBool) props.setGameStateString("Opponent Won!");
            if (gameState.isTieBool) props.setGameStateString("Its a Tie");
            return;
        }

        if (gameState.isWinBool) props.setGameStateString("Victory!");

        // Send move to opponent
        socket.emit("movePlayed", {
            squareObjectsBoard: gameState.squareObjectsBoard,
            isWin: gameState.isWinBool,
            isTie: gameState.isTieBool,
        });
    }, [props.isMyTurn]);

    const settingSquareClassList = (rowIndex, columnIndex, className) => {
        if (squaresClassListsArray.length === 0) return;

        if (gameState.isWinBool || gameState.isTieBool) className += " game-over__square";
        squaresClassLists = squaresClassLists.map((squareClassList, index) => {
            if (index === rowIndex * 8 + columnIndex) return className;
            return squareClassList;
        });
    };
    const getSquareClassList = (squareRow, squareColumn) => {
        return squaresClassListsArray[squareRow * 8 + squareColumn];
    };

    function renderBoard() {
        squaresClassLists = [...squaresClassListsArray];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                renderSquare(i, j);
            }
        }

        setSquareClassListsArray(squaresClassLists);
    }

    function renderSquare(squareRow, squareColumn) {
        let square = gameState.squareObjectsBoard[squareRow][squareColumn];

        square.isSquareBlack
            ? settingSquareClassList(squareRow, squareColumn, "board-square black-square")
            : settingSquareClassList(squareRow, squareColumn, "board-square white-square");

        // Hover class to pieces if it's their pieces on their turn
        let gamePieceClassName;
        if (gameState.isRedPlayersTurn) {
            gamePieceClassName = props.isFirstPlayer ? "game-piece piece-hover" : "game-piece";
        } else {
            gamePieceClassName = !props.isFirstPlayer ? "game-piece piece-hover" : "game-piece";
        }

        if (square.isMoveOption)
            settingSquareClassList(squareRow, squareColumn, `green-option ${gamePieceClassName}`);

        if (!!square.piece) {
            let classNameList = square.piece.isKing ? "king-piece " : "";
            if (square.piece.isBlack) {
                classNameList += "black-piece ";
                classNameList += props.isFirstPlayer ? "game-piece" : gamePieceClassName;

                settingSquareClassList(squareRow, squareColumn, classNameList);
            } else {
                classNameList += "red-piece ";
                classNameList += props.isFirstPlayer ? gamePieceClassName : "game-piece";

                settingSquareClassList(squareRow, squareColumn, classNameList);
            }
        }
    }

    return (
        <div>
            <div className="resize__board-container">
                <div className={boardClassList}>
                    {rowsBoard.map((row, index) => (
                        <BoardRow
                            key={index}
                            renderBoard={renderBoard}
                            renderSquare={renderSquare}
                            getSquareClassList={getSquareClassList}
                            rowIndex={index}
                            squaresClassListsArray={squaresClassListsArray}
                            isMyTurn={props.isMyTurn}
                            setIsMyTurn={props.setIsMyTurn}
                        />
                    ))}

                    {props.isGameOver && (
                        <GameOverMessage
                            message={props.gameStateString}
                            isFirstPlayer={props.isFirstPlayer}
                        />
                    )}
                    {hasOpponentQuit && (
                        <GameOverMessage
                            message={"Opponent quit, you win"}
                            isFirstPlayer={props.isFirstPlayer}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
