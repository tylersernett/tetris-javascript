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

function CheckForCompletedRows() {

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