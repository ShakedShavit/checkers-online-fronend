class CheckersPiece {
    constructor (isBlack, isKing) {
        this.isBlack = isBlack;
        this.isKing = isKing;
    }
}
class Square {
    constructor (isSquareBlack, isMoveOption, row, column, piece) {
        this.isSquareBlack = isSquareBlack;
        this.isMoveOption = isMoveOption;
        this.row = row;
        this.column = column;
        this.piece = piece;
    }
}

class CheckersLogic {
    constructor (isRedPlayersTurn) {
        this.isRedPlayersTurn = isRedPlayersTurn; //dark (black pieces) player players first
    }

    hasBoardChanged = false;
    isWinBool = false;
    isTieBool = false;
    lastPieceThatAtePositionForMultipleEating = '';
    lastPieceChosenPosition = [];

    squareObjectsBoard = [
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ]
        ]; //holds all the square objects
    
    //creating initial board
    creatingInitialBoardLogic() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((j + i) % 2) this.squareObjectsBoard[i][j] = new Square(true, false, i, j, null);
                else this.squareObjectsBoard[i][j] = new Square(false, false, i, j, null);
        
                if ((i < 3) && ((j + i) % 2 == 1)) this.squareObjectsBoard[i][j].piece = new CheckersPiece(true, false);
                else if ((i > 4) && ((j + i) % 2 == 1)) this.squareObjectsBoard[i][j].piece = new CheckersPiece(false, false);
            }
        }
    }
    
    squareOnClick(squareRow, squareColumn) {
        let squareObj = this.squareObjectsBoard[squareRow][squareColumn];
        if (squareObj.isMoveOption) {
            let movingPieceRowDifference = squareRow - this.lastPieceChosenPosition[0]; //for eating check and deleting eaten piece
            let movingSquareObj = this.squareObjectsBoard[this.lastPieceChosenPosition[0]][this.lastPieceChosenPosition[1]];
            //if the move creates a king
            let kingWasMadeThisMove = false//to stop multiple jumping after making king
            if (this.checkingIfKingWasMadeInMoveAndChangingThePiece(squareRow, movingSquareObj.piece)) kingWasMadeThisMove = true;    
            //regular move
            if (Math.abs(movingPieceRowDifference) == 1) {
                squareObj.piece = new CheckersPiece(movingSquareObj.piece.isBlack, movingSquareObj.piece.isKing);
                movingSquareObj.piece = null;
                this.deletingPreviousMovingOptions();
                this.isRedPlayersTurn = !(this.isRedPlayersTurn);
            }
            //eating move
            else {
                let movingPieceColumnDifference = (squareColumn - this.lastPieceChosenPosition[1]) / 2; //for deleting eaten piece
                movingPieceRowDifference /= 2;
                let eatenSquareObj = this.squareObjectsBoard[this.lastPieceChosenPosition[0] + movingPieceRowDifference][this.lastPieceChosenPosition[1] + movingPieceColumnDifference];
                squareObj.piece = new CheckersPiece(movingSquareObj.piece.isBlack, movingSquareObj.piece.isKing);
                eatenSquareObj.piece = null;
                movingSquareObj.piece = null;
                this.deletingPreviousMovingOptions();
                if (kingWasMadeThisMove || !(this.isThereAPossibleEatingMoveThisTurnForASpecificPiece(squareRow, squareColumn))) {
                    this.isRedPlayersTurn = !(this.isRedPlayersTurn);
                    this.lastPieceThatAtePositionForMultipleEating = '';
                }
                else this.lastPieceThatAtePositionForMultipleEating = '' + squareRow + squareColumn;
            }
            if (this.isWin()) this.isWinBool = true;
            else if (this.isTie()) this.isTieBool = true;
        }
    }
    pieceOnClick(piecePosition) {
        let squareRow = piecePosition[0];
        let squareColumn = piecePosition[1];
        this.deletingPreviousMovingOptions();
        this.callAddingMovingOptionsToSquaresForRegularMoveIfNotOutOfBorders(this.squareObjectsBoard[squareRow][squareColumn], false);//adding moving options for regular move for every possible square
        this.callAddMoveOptionFunctionForEveryEatingOption(this.squareObjectsBoard[squareRow][squareColumn], false);//adding eating options for regular move for every possible square
        this.lastPieceChosenPosition = piecePosition;
    }
    
    deletingPreviousMovingOptions() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let squareObj = this.squareObjectsBoard[i][j];
                if (squareObj.isMoveOption) {
                    squareObj.isMoveOption = false;
                }
            }
        }
    }
    
    addMovingOptionClassToSquare(targetSquarePositionRow, targetSquarePositionColumn, checkingMovingPossibilitiesForTieCheck) {
        let moveOptionSquareObj = this.squareObjectsBoard[targetSquarePositionRow][targetSquarePositionColumn];
        if (moveOptionSquareObj.piece === null) {
            if (checkingMovingPossibilitiesForTieCheck) return true;
            if (!(this.iteratingOverAllSquaresAndCheckingEatingPossibility())) {
                moveOptionSquareObj.isMoveOption = true;
            }
        }
        if (checkingMovingPossibilitiesForTieCheck) return false;
    }
    addMovingOptionClassToSquareForEatingMove(moveOptionSquareObj, squareEatenObj, squareEatingObj) {
        if (this.isEatingPossible(moveOptionSquareObj, squareEatenObj, squareEatingObj)) {
            if (this.lastPieceThatAtePositionForMultipleEating !== '') {
                if (this.lastPieceThatAtePositionForMultipleEating === '' + squareEatingObj.row + squareEatingObj.column) moveOptionSquareObj.isMoveOption = true;
            }
            else moveOptionSquareObj.isMoveOption = true;
        }
    }
    
    //checks the pieces in the given squares that are not out of border, second eating check (colours and etc)
    isEatingPossible(moveOptionSquareObj, squareEatenObj, squareEatingObj) {
        if (moveOptionSquareObj.piece === null) {
            let pieceEatenObj = squareEatenObj.piece;
            if (pieceEatenObj !== null) {
                let pieceEatingObj = squareEatingObj.piece;
                if (pieceEatenObj.isBlack ? !(pieceEatingObj.isBlack) : pieceEatingObj.isBlack) {
                    return true;
                }
            }
        }
        return false;
    }
    
    
    //return array of all the squares that can be eaten by a specific square based, on borders (calls the two funcs bellow)
    getIdOfSquaresForEatingIfNotOutOfBorders(eatingSquareObj) {
        let eatingPieceObj = eatingSquareObj.piece;
        let positionRow = eatingSquareObj.row;
        let positionColumn = eatingSquareObj.column;
        let resultReturn = [];
        if (!(this.isRedPlayersTurn) && eatingPieceObj.isBlack) {
            resultReturn = this.eatingMoveForBlackPiece(positionRow, positionColumn, resultReturn);
            if (eatingPieceObj.isKing) resultReturn = this.eatingMoveForRedPiece(positionRow, positionColumn, resultReturn);
        }
        else if (this.isRedPlayersTurn && !(eatingPieceObj.isBlack)) {
            resultReturn = this.eatingMoveForRedPiece(positionRow, positionColumn, resultReturn);
            if (eatingPieceObj.isKing) resultReturn = this.eatingMoveForBlackPiece(positionRow, positionColumn, resultReturn);
        }
        return resultReturn; //holds the squares objects of the jump to square and eaten square
    }
    eatingMoveForBlackPiece(positionRow, positionColumn, resultReturn) {
        if ((positionRow + 2 < 8) && (positionColumn + 2 < 8)) {
            resultReturn.push(this.squareObjectsBoard[positionRow + 2][positionColumn + 2]);
            resultReturn.push(this.squareObjectsBoard[positionRow + 1][positionColumn + 1]);
        }
        if ((positionRow + 2 < 8) && (positionColumn - 2 >= 0)) {
            resultReturn.push(this.squareObjectsBoard[positionRow + 2][positionColumn - 2]);
            resultReturn.push(this.squareObjectsBoard[positionRow + 1][positionColumn - 1]);
        }
        return resultReturn;
    }
    eatingMoveForRedPiece(positionRow, positionColumn, resultReturn) {
        if ((positionRow - 2 >= 0) && (positionColumn - 2 >= 0)) {
            resultReturn.push(this.squareObjectsBoard[positionRow - 2][positionColumn - 2]);
            resultReturn.push(this.squareObjectsBoard[positionRow - 1][positionColumn - 1]);
        }
        if ((positionRow - 2 >= 0) && (positionColumn + 2 < 8)) {
            resultReturn.push(this.squareObjectsBoard[positionRow - 2][positionColumn + 2]);
            resultReturn.push(this.squareObjectsBoard[positionRow - 1][positionColumn + 1]);
        }
        return resultReturn;
    }
    //calling a func (or in addition returning a bool that indicated if the move is possible) that marks regular move possibilities of all the squares that a specific square can move to, based on borders (calls the two funcs bellow)
    callAddingMovingOptionsToSquaresForRegularMoveIfNotOutOfBorders(movingSquareObj, checkingMovingPossibilitiesForTieCheck) {//this guy
        let movingPieceObj = movingSquareObj.piece;
        let squareRow = movingSquareObj.row;
        let squareColumn = movingSquareObj.column;
        if ((!(this.isRedPlayersTurn) && movingPieceObj.isBlack)) {
            if (checkingMovingPossibilitiesForTieCheck && !(movingPieceObj.isKing)) return this.regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
            else if (checkingMovingPossibilitiesForTieCheck && movingPieceObj.isKing) {
                if (this.regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck)) return true;
                return this.regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
            }
            this.regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);        
            if (movingPieceObj.isKing) this.regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
        }
        if ((this.isRedPlayersTurn && !(movingPieceObj.isBlack))) {
            if (checkingMovingPossibilitiesForTieCheck && !(movingPieceObj.isKing)) return this.regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
            else if (checkingMovingPossibilitiesForTieCheck && movingPieceObj.isKing) {
                if (this.regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck)) return true;
                return this.regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
            }
            this.regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
            if (movingPieceObj.isKing) this.regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck);
        }
    }
    regularMovingForBlackPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck) {
        if ((squareRow + 1 < 8) && (squareColumn + 1 < 8)) {
            if (checkingMovingPossibilitiesForTieCheck && this.addMovingOptionClassToSquare(squareRow + 1, squareColumn + 1, checkingMovingPossibilitiesForTieCheck) === true) return true;
            this.addMovingOptionClassToSquare(squareRow + 1, squareColumn + 1, checkingMovingPossibilitiesForTieCheck);
        }
        if ((squareRow + 1 < 8) && (squareColumn - 1 >= 0)) {
            if (checkingMovingPossibilitiesForTieCheck && this.addMovingOptionClassToSquare(squareRow + 1, squareColumn - 1, checkingMovingPossibilitiesForTieCheck) === true) return true;
            this.addMovingOptionClassToSquare(squareRow + 1, squareColumn - 1, checkingMovingPossibilitiesForTieCheck);
        }
        if (checkingMovingPossibilitiesForTieCheck) return false;
    }
    regularMovingForRedPiece(squareRow, squareColumn, checkingMovingPossibilitiesForTieCheck) {
        if ((squareRow - 1 >= 0) && (squareColumn - 1 >= 0)) {
            if (checkingMovingPossibilitiesForTieCheck && this.addMovingOptionClassToSquare(squareRow - 1, squareColumn - 1, checkingMovingPossibilitiesForTieCheck) === true) return true;
            this.addMovingOptionClassToSquare(squareRow - 1, squareColumn - 1, checkingMovingPossibilitiesForTieCheck);
        }
        if ((squareRow - 1 >= 0) && (squareColumn + 1 < 8)) {
            if (checkingMovingPossibilitiesForTieCheck && this.addMovingOptionClassToSquare(squareRow - 1, squareColumn + 1, checkingMovingPossibilitiesForTieCheck) === true) return true;
            this.addMovingOptionClassToSquare(squareRow - 1, squareColumn + 1, checkingMovingPossibilitiesForTieCheck);
        }
        if (checkingMovingPossibilitiesForTieCheck) return false;
    }//////////////////////////
    
    
    
    iteratingOverAllSquaresAndCheckingEatingPossibility() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isThereAPossibleEatingMoveThisTurnForASpecificPiece(i, j) === true) return true;
            }
        }
        return false;
    }
    iteratingOverAllSquaresAndCheckingRegularMovingPossibility() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isThereAPossibleRegulargMoveThisTurnForASpecificPiece(i, j) === true) return true;
            }
        }
        return false;
    }
    
    //transition functions (the first one that is called for any move possiblity check)
    isThereAPossibleEatingMoveThisTurnForASpecificPiece(checkingSquareRow, checkingSquareColumn) {
        let checkingSquareObj = this.squareObjectsBoard[checkingSquareRow][checkingSquareColumn];
        let checkingSquarePieceObj = checkingSquareObj.piece;
        if (checkingSquarePieceObj !== null) {
            if ((!(this.isRedPlayersTurn) && checkingSquarePieceObj.isBlack) || (this.isRedPlayersTurn && !(checkingSquarePieceObj.isBlack))) {
                return this.callAddMoveOptionFunctionForEveryEatingOption(checkingSquareObj, true);
            }
            return false;
        }
    }
    isThereAPossibleRegulargMoveThisTurnForASpecificPiece(checkingSquareRow, checkingSquareColumn) {
        let checkingSquareObj = this.squareObjectsBoard[checkingSquareRow][checkingSquareColumn];
        let checkingPieceObj = checkingSquareObj.piece;
        if (checkingPieceObj !== null) {
            if ((!(this.isRedPlayersTurn) && checkingPieceObj.isBlack) || (this.isRedPlayersTurn && !(checkingPieceObj.isBlack))) {
                return this.callAddingMovingOptionsToSquaresForRegularMoveIfNotOutOfBorders(checkingSquareObj, true);
            }
            return false;
        }
    }
    
    //transition function, iterating over the returned array of eatin possibilities for square that are not out of border
    callAddMoveOptionFunctionForEveryEatingOption(checkingSquareObj, didMoveForSpecificPieceFuncCalled) {
        let eatingMoveSquares = this.getIdOfSquaresForEatingIfNotOutOfBorders(checkingSquareObj);
        if (eatingMoveSquares.length > 0) {
            let moveOptionSquareObj = eatingMoveSquares[0];
            let squareEatenObj = eatingMoveSquares[1];
            if (this.isEatingPossible(moveOptionSquareObj, squareEatenObj, checkingSquareObj)) {
                if (didMoveForSpecificPieceFuncCalled) return true;
                else this.addMovingOptionClassToSquareForEatingMove(moveOptionSquareObj, squareEatenObj, checkingSquareObj);//marking squares function calling
            }
            if (eatingMoveSquares.length > 2) {
                moveOptionSquareObj = eatingMoveSquares[2];
                squareEatenObj = eatingMoveSquares[3];
                if (this.isEatingPossible(moveOptionSquareObj, squareEatenObj, checkingSquareObj)) {
                    if (didMoveForSpecificPieceFuncCalled) return true;
                    else this.addMovingOptionClassToSquareForEatingMove(moveOptionSquareObj, squareEatenObj, checkingSquareObj);//marking squares function calling
                }
            }
            //for kings
            if (eatingMoveSquares.length > 4) {
                moveOptionSquareObj = eatingMoveSquares[4];
                squareEatenObj = eatingMoveSquares[5];
                if (this.isEatingPossible(moveOptionSquareObj, squareEatenObj, checkingSquareObj)) {
                    if (didMoveForSpecificPieceFuncCalled) return true;
                    else this.addMovingOptionClassToSquareForEatingMove(moveOptionSquareObj, squareEatenObj, checkingSquareObj);//marking squares function calling
                }
            }
            if (eatingMoveSquares.length > 6) {
                moveOptionSquareObj = eatingMoveSquares[6];
                squareEatenObj = eatingMoveSquares[7];
                if (this.isEatingPossible(moveOptionSquareObj, squareEatenObj, checkingSquareObj)) {
                    if (didMoveForSpecificPieceFuncCalled) return true;
                     else this.addMovingOptionClassToSquareForEatingMove(moveOptionSquareObj, squareEatenObj, checkingSquareObj);//marking squares function calling
                }
            }
        }
        return false;
    }
    
    
    checkingIfKingWasMadeInMoveAndChangingThePiece(moveOptionSquarePositionRow, movingPieceObj) {
        if ((moveOptionSquarePositionRow === 0 || moveOptionSquarePositionRow === 7) && !(movingPieceObj.isKing)) { ///////check king moves BACK to the first\last row
            movingPieceObj.isKing = true;
            return true;
        }
        return false;
    }
    
    isWin() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.squareObjectsBoard[i][j].piece !== null) {
                    if (this.squareObjectsBoard[i][j].piece.isBlack === !(this.isRedPlayersTurn)) return false;
                }
            }
        }
        return true;
    }
    isTie() {
        if (this.iteratingOverAllSquaresAndCheckingRegularMovingPossibility()) return false;
        if (this.iteratingOverAllSquaresAndCheckingEatingPossibility()) return false;
        return true;
    }
}





class CheckersUI {
    checkersLogic = new CheckersLogic();

    checkersGames = document.getElementById('checkers-games');
    checkersGame = document.createElement('div');
    turnDisplay = document.createElement('div');

    squareDivsBoard = [
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ],
        [, , , , , , , ]
        ]; //holds all the square divs

    initiateNewEmptyCheckersBoard() {
        this.turnDisplay.className = 'turn-and-win-display';
        this.checkersGames.appendChild(this.turnDisplay);
        this.checkersGame.className = 'checkers-board';
        this.checkersGames.appendChild(this.checkersGame);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let squareDiv = document.createElement('div');
                this.checkersGame.appendChild(squareDiv);
                this.squareDivsBoard[i][j] = squareDiv;
            }
        }
        this.checkersLogic.creatingInitialBoardLogic();
        this.addEventListenersToSquares();
        this.renderCheckersBoard();
        this.changeTurnDisplay();
    }
    //adding event listeners to the moving option squares, and making the move
    addEventListenersToSquares() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let squareDiv = this.squareDivsBoard[i][j];
                squareDiv.addEventListener('click',  () => {
                    this.checkersLogic.squareOnClick(i, j)
                    this.renderCheckersBoard();
                    this.changeTurnDisplay();
                });
            }
        }
    }

    //add event listeners to pieces
    addEventListenersToPiece(pieceDiv, pieceObj) {
        //mouse over and mouse leave events
        pieceDiv.addEventListener('mouseover', this.pieceMouseOver = () => {
            if (!(this.checkersLogic.isRedPlayersTurn) && pieceObj.isBlack) pieceDiv.classList.add('mouse-over-black');
            else if (this.checkersLogic.isRedPlayersTurn && !(pieceObj.isBlack)) pieceDiv.classList.add('mouse-over-red');
        });
        pieceDiv.addEventListener('mouseleave', this.pieceMouseLeave = () => {
            if (!(this.checkersLogic.isRedPlayersTurn) && pieceObj.isBlack) pieceDiv.classList.remove('mouse-over-black');
            else if (this.checkersLogic.isRedPlayersTurn && !(pieceObj.isBlack)) pieceDiv.classList.remove('mouse-over-red');
        });
        //click on piece event
        pieceDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            this.checkersLogic.pieceOnClick(this.getIndexOfSquareDiv(pieceDiv.parentNode))
            this.renderCheckersBoard();
        });
    }

    //adds the css classes to all squares and pieces divs
    renderCheckersBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let squareDiv = this.squareDivsBoard[i][j];
                let squareObj =  this.checkersLogic.squareObjectsBoard[i][j];
                let pieceObj = squareObj.piece;
                if (squareObj.isSquareBlack) {
                    squareDiv.classList.add('black');
            
                    //moving option
                    if (squareObj.isMoveOption) squareDiv.classList.add('moving-option');
                    else if (squareDiv.classList.contains('moving-option')) squareDiv.classList.remove('moving-option');
            
                    //piece inside square
                    if (pieceObj !== null && !squareDiv.hasChildNodes()) {
                        let pieceDiv = document.createElement('div');
                        squareDiv.appendChild(pieceDiv);
        
                        this.addEventListenersToPiece(pieceDiv, pieceObj);
                    }
                    else if (pieceObj === null && squareDiv.hasChildNodes()) {
                        squareDiv.removeChild(squareDiv.children[0]);
                        break;
                    }
                    let pieceDiv = squareDiv.children[0];
                    if (pieceObj !== null) {
                        //piece colour/type
                        if (pieceObj.isBlack && !(pieceObj.isKing)) {
                            pieceDiv.className = 'black-piece';
                        }
                        else if (!(pieceObj.isBlack) && !(pieceObj.isKing)) {
                            pieceDiv.className = 'red-piece';
                        }
                        //king
                        if (pieceObj.isKing && pieceObj.isBlack) {
                            pieceDiv.className = 'black-king';
                        }
                        else if (pieceObj.isKing && !(pieceObj.isBlack)) {
                            pieceDiv.className = 'red-king';
        
                        }
                    }
                }
                else squareDiv.classList.add('white');
            }
        }
    }

    changeTurnDisplay() {
        if (this.checkersLogic.isWinBool) !(this.checkersLogic.isRedPlayersTurn) ? this.turnDisplay.innerHTML = 'Red Player Won' : this.turnDisplay.innerHTML = 'Black Player Won';
        else if (this.checkersLogic.isTieBool) this.turnDisplay.innerHTML = 'Tie!';
        else !(this.checkersLogic.isRedPlayersTurn) ? this.turnDisplay.innerHTML = 'Black Players Turn' : this.turnDisplay.innerHTML = 'Red Players Turn';
    }

    getIndexOfSquareDiv(squareDiv) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.squareDivsBoard[i][j] === squareDiv) return [i, j];
            }
        }
    }
}


module.exports = { CheckersLogic };