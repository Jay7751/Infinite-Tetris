console.log("TetraStack Loaded");
const gameboard = document.getElementById("game-board");
console.log(gameboard); 
//returns <div id="game-board"></div> if the element is found, otherwise returns null
const cols = 10;
const rows = 20;

const board = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
//board is a 2D array with 20 rows and 10 columns, filled with 0s

const cells = [];//reference to the cells in the gameboard



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

const currentPiece = {
    row: 0,
    col: 4,
    shape: structuredClone(tetrominoes.I.shape), //deep copy of the shape array
    color: tetrominoes.I.color
};
const dropInterval = 300; //time in milliseconds for the piece to drop one row

function createBoard() {
    gameboard.innerHTML = "";
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gameboard.appendChild(cell);
            cells.push(cell);//saves the reference to the cell in the cells array
        }
    }
}

function renderBoard() {
    //for locked blocks
    for(let row = 0;row<rows;row++){
        for(let col = 0;col<cols;col++){
            const cellValue = board[row][col]; // get the value of the cell
            const index = row * cols + col; // calculate the index of the cell in the cells array
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
            // but grid is preferred as it works with multiple rows and columns

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
                const index = BoardRow * cols + BoardCol;
                if(BoardRow>=0 && BoardRow<rows && BoardCol>=0 && BoardCol<cols){
                    cells[index].classList.add(currentPiece.color);
                }
            }
        }
    }
}

//check if the current piece can move down, return true if it can, false otherwise
function canMoveDown(){
    for(let shapeRow = 0; shapeRow < currentPiece.shape.length; shapeRow++){
        for(let shapeCol=0;shapeCol<currentPiece.shape[shapeRow].length;shapeCol++){
            if(currentPiece.shape[shapeRow][shapeCol] === 0) continue;
            const nextRow = currentPiece.row + shapeRow + 1;
            const nextCol = currentPiece.col + shapeCol;
            if(nextRow >= rows || board[nextRow][nextCol] === 1){
                return false;
            }//if the next row is out of bounds or the cell is already filled, return false
        }
    }
    return true;
}

//game loop till the current piece reaches the bottom of the board
function gameloop(){
    if(canMoveDown()){
        currentPiece.row++;
    }
    else{
        lockPiece();
        spawnPiece();
    }
    renderBoard();
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
    currentPiece.col = Math.floor(cols/2)-1;
    currentPiece.shape = structuredClone(piece.shape);
    currentPiece.color = piece.color;
}

document.addEventListener("keydown",handleKeyPress);
function handleKeyPress(event){
    if(event.key === "ArrowLeft" || event.key === "a"){
        moveleft();
    }
    else if(event.key === "ArrowRight" || event.key === "d"){
        moveright();
    }
    else if(event.key === "ArrowDown" || event.key === "s"){
        softdrop();
    }
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
            if(nextCol >= cols || board[nextRow][nextCol] === 1){
                return false;
            }//if the next col is out of bounds or the cell is already filled, return false
        }
    }
    return true;
}

// move the current piece left by one column
function moveleft(){
    if(canMoveLeft()){
        currentPiece.col--;
        renderBoard();
    }
}
// move the current piece right by one column
function moveright(){
    if(canMoveRight()){
        currentPiece.col++;
        renderBoard();
    }
}
//move the current piece down by one row
function softdrop(){
    if(canMoveDown()){
        currentPiece.row++;
        renderBoard();
    }
}

createBoard();
renderBoard();

/*setInterval(()=>{
    console.log("gameloop");
},1000);*/
setInterval(gameloop,dropInterval);

console.log(board);
console.log(cells);