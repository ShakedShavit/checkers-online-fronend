import React, { useEffect, useState } from 'react';
import Square from './Square';

const BoardRow = (props) => {
    const [squaresRow, setSquaresRow] = useState([]);

    useEffect(() => {
        let squaresArr = [];
        for (let i = 0; i < 8; i++) {
            squaresArr.push(i);
        }
        setSquaresRow(squaresArr);
    }, []);

    return (
        <div className="board-row">
            {
                squaresRow.map((square, index) =>
                    <Square
                        key={index}
                        rowIndex={props.rowIndex}
                        columnIndex={index}
                        renderBoard={props.renderBoard}
                        renderSquare={props.renderSquare}
                        getSquareClassList={props.getSquareClassList}
                        boardColumnLength={props.boardColumnLength}
                        squaresClassListsArray={props.squaresClassListsArray}
                        isMyTurn={props.isMyTurn}
                        setIsMyTurn={props.setIsMyTurn}
                    />
                )
            }
        </div>
    )
};

export default BoardRow;