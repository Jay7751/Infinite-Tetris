console.log("TetraStack Loaded");
const gameboard = document.getElementById("game-board");
console.log(gameboard); 
//returns <div id="game-board"></div> if the element is found, otherwise returns null
const cols = 10;
const rows = 20;

const cells = new Array(rows*cols).fill(0);
//cells is a 2D array with 20 rows and 10 columns, filled with 0s
//test data


function createBoard() {
    gameboard.innerHTML = "";
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gameboard.appendChild(cell);
        }
    }
}

createBoard();

function renderBoard() {
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const cellValue = cells[row * cols + col]; // get the value of the cell
            const cell = gameboard.children[row * cols + col]; // get the corresponding cell element
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