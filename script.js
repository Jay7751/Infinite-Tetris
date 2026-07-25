console.log("TetraStack Loaded");
const gameboard = document.getElementById("game-board");
console.log(gameboard); 
//returns <div id="game-board"></div> if the element is found, otherwise returns null
const cols = 10;
const rows = 20;

const board = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
//board is a 2D array with 20 rows and 10 columns, filled with 0s
//test data
board[0][0] = 1;
board[0][1] = 1;
board[0][2] = 1;

function renderBoard() {
    //clears the gameboard div before rendering the new board
    gameboard.innerHTML = "";
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const cellValue = board[row][col]; // get the value of the cell
            const cell = document.createElement("div");
            cell.classList.add("cell");
            // now the new div element cell has the class "cell"
            if(cellValue === 1){
                cell.classList.add("filled");
                // now the new div element cell has the class "cell filled"
            }
            gameboard.appendChild(cell);
            // new cell div will be added to the gameboard div as a child element
            //flexbox is not prefered as it works with only one row or column, 
            // but grid is preferred as it works with multiple rows and columns

        }
    }
}

renderBoard();
console.log(board);