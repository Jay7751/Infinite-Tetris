console.log("TetraStack Loaded");
const gameboard = document.getElementById("game-board");
console.log(gameboard); 
//returns <div id="game-board"></div> if the element is found, otherwise returns null

// CONSTANTS

const ROWS = 20;
const COLS = 10;
const DROP_INTERVAL = 300; //time in milliseconds for the piece to drop one row

// TETROMINO DEFINITIONS

const tetrominoes = {
    I: {
        shape: [
            [1],
            [1],
            [1],
            [1]
        ],
        color: "cyan"
    },
    O:{
        shape: [
            [1,1],
            [1,1]
        ],
        color: "yellow"
    },
    T:{
        shape: [
            [0,1,0],
            [1,1,1]
        ],
        color: "purple"
    },
    S:{
        shape: [
            [0,1,1],
            [1,1,0]
        ],
        color: "green"
    },
    Z:{
        shape: [
            [1,1,0],
            [0,1,1]
        ],
        color: "red"
    },
    J:{
        shape: [
            [1,0,0],
            [1,1,1]
        ],
        color: "blue"
    },
    L:{
        shape: [
            [0,0,1],
            [1,1,1]
        ],
        color: "orange"
    }
};

// GAME STATE

const board = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));
//board is a 2D array with 20 ROWS and 10 columns, filled with 0s

const cells = [];//reference to the cells in the gameboard

let gameOver = false;

const currentPiece = {
    row: 0,
    col: 4,
    shape: structuredClone(tetrominoes.I.shape), //deep copy of the shape array
    color: tetrominoes.I.color,
    rotation: 0
};

// INITIALIZATION

function createBoard() {
    gameboard.innerHTML = "";
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gameboard.appendChild(cell);
            cells.push(cell);//saves the reference to the cell in the cells array
        }
    }
}

// RENDERER

function renderBoard() {
    //for locked blocks
    for(let row = 0;row<ROWS;row++){
        for(let col = 0;col<COLS;col++){
            const cellValue = board[row][col]; // get the value of the cell
            const index = row * COLS + col; // calculate the index of the cell in the cells array
            const cell = cells[index]; // get the corresponding cell element
            if(cellValue === 1){
                cell.classList.add("filled");
                // now the new div element cell has the class "cell filled"
            }
            else{
                cell.classList.remove(
                    "cyan",
                    "yellow",
                    "purple",
                    "green",
                    "red",
                    "blue",
                    "orange"
                );
                // now the new div element cell has the class "cell"
            }
            // new cell div will be added to the gameboard div as a child element
            //flexbox is not prefered as it works with only one row or column, 
            // but grid is preferred as it works with multiple ROWS and columns

        }
    }
    //for current piece
    //loop through the shape of the current piece and add the class of the color to
    //the corresponding cell in the gameboard
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 1){
                const BoardRow = currentPiece.row + shapeRow;
                const BoardCol = currentPiece.col + shapeCol;
                const index = BoardRow * COLS + BoardCol;
                if(BoardRow>=0 && BoardRow<ROWS && BoardCol>=0 && BoardCol<COLS){
                    cells[index].classList.add(currentPiece.color);
                }
            }
        }
    }
}

// COLLISION DETECTION

//check if the current piece can move down, return true if it can, false otherwise
function canMoveDown(){
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 0) continue;
            const nextRow = currentPiece.row + shapeRow + 1;
            const nextCol = currentPiece.col + shapeCol;
            if(nextRow >= ROWS || board[nextRow][nextCol] === 1){
                return false;
            }//if the next row is out of bounds or the cell is already filled, return false
        }
    }
    return true;
}

//check if the current piece can move left, return true if it can, false otherwise
function canMoveLeft(){
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 0) continue;
            const nextRow = currentPiece.row + shapeRow;
            const nextCol = currentPiece.col + shapeCol - 1;
            if(nextCol < 0 || board[nextRow][nextCol] === 1){
                return false;
            }//if the next col is out of bounds or the cell is already filled, return false
        }
    }
    return true;
}

//check if the current piece can move right, return true if it can, false otherwise
function canMoveRight(){
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 0) continue;
            const nextRow = currentPiece.row + shapeRow;
            const nextCol = currentPiece.col + shapeCol + 1;
            if(nextCol >= COLS || board[nextRow][nextCol] === 1){
                return false;
            }//if the next col is out of bounds or the cell is already filled, return false
        }
    }
    return true;
}

// MOVEMENT

// move the current piece left by one column
function moveLeft(){
    if(canMoveLeft()){
        currentPiece.col--;
        renderBoard();
    }
}

// move the current piece right by one column
function moveRight(){
    if(canMoveRight()){
        currentPiece.col++;
        renderBoard();
    }
}

//move the current piece down by one row
function hardDrop(){
    while(canMoveDown()){
        currentPiece.row++;
    }
    lockPiece();
    spawnPiece();
    renderBoard();
}

// ROTATION

//checks if the current piece can rotate as it can't rotate clockwise 
//when it's at right corner and similarly it can't rotate counter clockwise
// when it's at left corner
function canRotate(tempMatrix){
    for(let shapeRow = 0; shapeRow<tempMatrix.length;shapeRow++){
        for(let shapeCol = 0; shapeCol<tempMatrix[shapeRow].length;shapeCol++){
            if(tempMatrix[shapeRow][shapeCol]==0){
                continue;
            }
            const boardRow = currentPiece.row+shapeRow;
            const boardCol = currentPiece.col+shapeCol;
            //if the next row is out of bounds or the cell is already filled, return false
            if(boardRow<0 || boardRow>=ROWS || boardCol<0 || boardCol>=COLS || board[boardRow][boardCol] === 1){
                return false;
            }
        }
    }
    return true;
}

//rotates the current piece 90 degrees
function rotateMatrix(matrix){
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];
    for(let col=0; col<cols;col++){
        rotated[col] = [];
        for(let row=rows-1;row>=0;row--){
            rotated[col].push(matrix[row][col]);
        }
    }
    return rotated;

}

//rotates the current piece 270 degrees
function rotateMatrixCounterClockwise(matrix){
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];
    for(let col = cols-1; col>=0;col--){
        rotated[col] = [];
        for(let row=0;row<rows;row++){
            rotated[col].push(matrix[row][col]);
        }
    }
    return rotated;
}

function rotatePiece(){
    const tempMatrix = rotateMatrix(currentPiece.shape);
    if(!canRotate(tempMatrix)) return;
    currentPiece.shape = rotateMatrix(currentPiece.shape);
    currentPiece.rotation = (currentPiece.rotation+1)%4;
    renderBoard();
}

function rotatePieceCounterClockwise(matrix){
    const tempMatrix = rotateMatrixCounterClockwise(currentPiece.shape);
    if(!canRotate(tempMatrix)) return;
    currentPiece.shape = rotateMatrixCounterClockwise(currentPiece.shape);
    currentPiece.rotation = (currentPiece.rotation+3)%4;
    renderBoard();
}

// GAME LOGIC

//clears filled rows
function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(new Array(COLS).fill(0));
            row++;
        }
    }
}

//lock the current piece in the board array and create a new piece
function lockPiece(){
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 1){
                const BoardRow = currentPiece.row + shapeRow;
                const BoardCol = currentPiece.col + shapeCol;
                board[BoardRow][BoardCol] = 1;
            }
        }
    }
}

//spawn a new piece at the top of the board
function spawnPiece(){  
    const pieces = Object.keys(tetrominoes);
    const randomKey = pieces[Math.floor(Math.random() * pieces.length)];
    const piece = tetrominoes[randomKey];
    currentPiece.row = 0;
    currentPiece.col = Math.floor(COLS/2)-1;
    currentPiece.shape = structuredClone(piece.shape);
    currentPiece.color = piece.color;
}

//game loop till the current piece reaches the bottom of the board
function gameLoop(){
    if(gameOver) return;
    if(canMoveDown()){
        currentPiece.row++;
    }
    else{
        lockPiece();
        clearLines();
        spawnPiece();
    }
    renderBoard();
}

// INPUT

//handles keyboard events
function handleKeyPress(event){
    if(event.key === "ArrowLeft" || event.key === "a"){
        moveLeft();
    }
    else if(event.key === "ArrowRight" || event.key === "d"){
        moveRight();
    }
    else if(event.key === "ArrowDown" || event.key === "s"){
        rotatePieceCounterClockwise();
    }
    else if(event.key === "ArrowUp" || event.key === "w"){
        rotatePiece();
    }
    else if(event.code === "Space"){
        hardDrop();
    }
}

document.addEventListener("keydown",handleKeyPress);

// START GAME

createBoard();

spawnPiece();

renderBoard();  

setInterval(gameLoop,DROP_INTERVAL);