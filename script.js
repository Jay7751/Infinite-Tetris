console.log("TetraStack Loaded");
const gameboard = document.getElementById("game-board");
console.log(gameboard); 
//returns <div id="game-board"></div> if the element is found, otherwise returns null
const cols = 10;
const rows = 20;

const board = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
//board is a 2D array with 20 rows and 10 columns, filled with 0s

const cells = [];//reference to the cells in the gameboard

const currentPiece = {
    row: 0,
    col: 4,
    shape: [
        [1],
        [1],
        [1],
        [1]
    ],
    color: "filled"
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
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const cellValue = board[row][col]; // get the value of the cell
            const index = row * cols + col; // calculate the index of the cell in the cells array
            const cell = cells[index]; // get the corresponding cell element
            if(cellValue === 1){
                cell.classList.add("filled");
                // now the new div element cell has the class "cell filled"
            }
            else{
                cell.classList.remove("filled");
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
    currentPiece.row = 0;
    currentPiece.col = 4;
}

createBoard();
renderBoard();

/*setInterval(()=>{
    console.log("gameloop");
},1000);*/
setInterval(gameloop,dropInterval);

console.log(board);
console.log(cells);