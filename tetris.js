let canvas;
let ctx;
let gBArrayHeight = 20, gBArrayWidth = 12;
let startXDefault = 4, startX = startXDefault;
let startYDefault = 0, startY = startYDefault;
let blockDimension = 21;
let score = 0, level = 1;
let winOrLose = "Playing";
//stores pixel coords w/ format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth).fill(0));
//stores currently controlled block
let gameBoardArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth)).fill(0);
//stores static blocks
let stoppedShapeArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth).fill(0));

/*  T block: [[1,0],[0,1],[1,1],[2,1]]
    0   1   2   3
0 |   |xxx|   |   |
1 |xxx|xxx|xxx|   |
2 |   |   |   |   |
*/
let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]]

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;


let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//wait for page to load, then run SetupCanvas
document.addEventListener('DOMContentLoaded', SetupCanvas);

//populate coordArray
function CreateCoordArray() {
    let i = 0, j = 0;
    let yTop = 9, yBottom = 446, blockSpacing = 1 + blockDimension + 1;
    let xLeft = 11, xRight = 264;
    for (let y = yTop; y <= yBottom; y += blockSpacing) {
        for (let x = xLeft; x <= xRight; x += blockSpacing) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2); //zoom in

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    ctx.fillStyle = 'black';
    ctx.font = '21ps Arial';
    ctx.fillText("SCORE", 300, 98);

    ctx.strokeRect(300, 107, 161, 24)
    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);

    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate Right", 310, 463);

    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();

    CreateCoordArray();
    DrawTetromino();
}

function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1; //tell gameboard that black is present at coordinates

        //transcribe xy info to coordinateArray pixels
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        //draw the square
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
    }
}

function HandleKeyPress(key) {
    if (winOrLose != "Game Over") {
        if (key.keyCode === 65) { //A
            direction = DIRECTION.LEFT;
            if (!HittingTheWall() && !HorizontalCollision()) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if (key.keyCode === 68) { //D
            direction = DIRECTION.RIGHT;
            if (!HittingTheWall() && !HorizontalCollision()) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (key.keyCode === 83) { //S
            MoveTetrominoDown();
        } else if (key.keyCode === 69) { //E
            RotateTetromino();
        }
    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!VerticalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

function VerticalCollision() {
    // copy tetromino and move "fake" version down
    let tetrominoCopy = curTetromino;
    let collision = false;

    // Cycle through all Tetromino squares
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        // If moving down, increment y to check for a collison
        if (direction === DIRECTION.DOWN) {
            y++;
        }

        // Check for collision w/ previously set piece 1 square below
        //(stoppedShapeArray will hold color string if occupied)
        if (typeof stoppedShapeArray[x][y + 1] === 'string') {
            DeleteTetromino();
            // Increment to put into place, then draw self
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }

        if (y >= gBArrayHeight) { //if touching floor...
            collision = true;
            break;
        }
    }

    if (collision) {
        // Check for game over and if so set game over text
        if (startY <= 2) {
            winOrLose = "Game Over";
            //draw white rectangle over previous string
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);

            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
            // Add stopped Tetromino to stopped shape array
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }

            CheckForCompletedRows();
            // Create the next Tetromino, draw it, and reset direction
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = startXDefault;
            startY = startYDefault;
            DrawTetromino();
        }

    }
}

function HorizontalCollision() {
    // copy tetromino and move "fake" version down
    let tetrominoCopy = curTetromino;
    let collision = false;
    // Cycle through all Tetromino squares
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++;
        }

        //stoppedShapeArray will hold color string if occupied
        if (typeof stoppedShapeArray[x][y] === 'string') {
            collision = true;
            break;
        }
    }
    return collision;
}

function HittingTheWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= gBArrayWidth - 1 && direction === DIRECTION.RIGHT) {
            return true;
        }
    }
    return false;
}

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
    }
}

function CreateTetrominos() {
    // T 
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]]);
    // I
    tetrominos.push([[0, 0], [1, 0], [2, 0], [3, 0]]);
    // J
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]]);
    // Square
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]]);
    // L
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]]);
    // S
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]]);
    // Z
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]]);
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = true;
        for (let x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y]
            //if anything *not* a string shows up, it's not completed
            if (square === 0 || typeof square === 'undefined') {
                completed = false;
                break;
            }
        }

        if (completed) {
            //shift down the rows
            if (startOfDeletion === 0) { startOfDeletion = y; }
            rowsToDelete++;

            for (let i = 0; i < gBArrayWidth; i++) {
                // Update the arrays by zero'ing out previous squares
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the square as white
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
            }
        }
    }
    if (rowsToDelete > 0) {
        score += RowClearBonus(rowsToDelete) * level;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function RowClearBonus(rows) {
    switch (rows) {
        case 1: return 40; break;
        case 2: return 100; break;
        case 3: return 300; break;
        case 4: return 1200; break;
        default: return 0;
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (let i = startOfDeletion - 1; i >= 0; i--) {
        for (let x = 0; x < gBArrayWidth; x++) {
            let y2 = i + rowsToDelete;
            let squareColor = stoppedShapeArray[x][i];
            let nextSquareColor = stoppedShapeArray[x][y2];

            if (typeof squareColor === 'string') {
                nextSquareColor = squareColor;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = squareColor; // Draw color into stopped

                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquareColor;
                ctx.fillRect(coorX, coorY, blockDimension, blockDimension);

                squareColor = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
            }
        }
    }
}

function RotateTetromino() {
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBackup;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        // clone (avoid reference error)
        curTetrominoBackup = [...curTetromino];

        //orient new rotation based on x value of last square
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetRightmostSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation
    try {
        curTetromino = newRotation;
        DrawTetromino();
    }
    // If outside bounds error, draw backup instead
    catch (error) {
        if (error instanceof TypeError) {
            curTetromino = curTetrominoBackup;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

//get the right-most x-coordinate
function GetRightmostSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}