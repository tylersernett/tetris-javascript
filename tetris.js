let canvas;
let ctx;
let gBArrayHeight = 20, gBArrayWidth = 12;
let startXDefault = 4, startX = startXDefault;
let startYDefault = 0, startY = startYDefault;
let blockDimension = 21;
let rotation = 0;
let score = 0, level = 1;
let winOrLose = "Playing";

//stores pixel coords w/ format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores currently controlled block & static blocks as filled (1) or empty (0)
let gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores 'placed' block colors as strings
let stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));

let curTetromino = [];
let tetrominos = [];
let tetrominoColors = ['fuchsia', 'turquoise', 'royalblue', 'gold', 'darkorange', 'lime', 'crimson'];
let curTetrominoColor;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//-------------------\\
//  INITIALIZATION    \\
//---------------------\\

//wait for page to load, then run SetupCanvas
document.addEventListener('DOMContentLoaded', SetupCanvas);

//populate coordArray
function CreateCoordArray() {
    let yTop = 9, yBottom = 446, blockSpacing = 1 + blockDimension + 1;
    let xLeft = 11, xRight = 264;
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            coordinateArray[row][col] = new Coordinates(xLeft + blockSpacing * col, yTop + blockSpacing * row);
        }
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(1.5, 1.5); //zoom in

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

/*  T block: [[1,0],[0,1],[1,1],[2,1]]
    0   1   2   3
0 |   |xxx|   |   |
1 |xxx|xxx|xxx|   |
2 |   |   |   |   |
*/
function CreateTetrominos() {
    // T 
    tetrominos.push([[[0, 1], [1, 1], [2, 1], [1, 2]], [[1, 0], [0, 1], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [1, 0]], [[1, 0], [2, 1], [1, 1], [1, 2]]]);
    // I
    tetrominos.push([[[0, 2], [1, 2], [2, 2], [3, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]]]);
    // J
    tetrominos.push([[[0, 1], [1, 1], [2, 1], [2, 2]], [[1, 0], [0, 2], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [0, 0]], [[1, 0], [2, 0], [1, 1], [1, 2]]]);
    // Square
    tetrominos.push([[[1, 1], [2, 1], [1, 2], [2, 2]]]);
    // L
    tetrominos.push([[[0, 1], [1, 1], [2, 1], [0, 2]], [[1, 0], [0, 0], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [2, 0]], [[1, 0], [2, 2], [1, 1], [1, 2]]]);
    // S
    tetrominos.push([[[1, 1], [2, 1], [0, 2], [1, 2]], [[1, 1], [2, 1], [1, 0], [2, 2]]]);
    // Z
    tetrominos.push([[[0, 1], [1, 1], [1, 2], [2, 2]], [[2, 0], [1, 1], [1, 2], [2, 1]]]);
}

//-------------\\
//  MOVEMENT    \\
//---------------\\
function HandleKeyPress(key) {
    if (winOrLose != "Game Over") {
        if (key.keyCode === 37) { //<-- 
            if (!HorizontalCollision(-1)) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        } else if (key.keyCode === 39) { // -->
            if (!HorizontalCollision(1)) {
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (key.keyCode === 40) { // down arrow
            MoveTetrominoDown();
        } else if (key.keyCode === 88) { //x
            RotateTetromino(1);
        } else if (key.keyCode === 90) { //z
            RotateTetromino(-1);
        } else if (key.keyCode === 38) { // up arrow
            DebugPosition();
        }
    }
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function RotateTetromino(val) {
    if (!RotationCollision(val)) {
        DeleteTetromino();
        rotation += val;
        rotation = mod(rotation, curTetromino.length); //keep inside Array bounds
        DrawTetromino();
    }
}

function MoveTetrominoDown() {
    if (!VerticalCollision(1)) {
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

//auto-move piece down once per second
window.setInterval(function () {
    if (winOrLose != "Game Over") {
        MoveTetrominoDown();
    }
}, 1000);

//-------------\\
//  COLLISIONS  \\
//---------------\\
function FloorCollision(y) {
    return (y >= gBArrayHeight);
}
function WallCollision(x) {
    return (x > gBArrayWidth - 1 || x < 0);
}
function PieceCollision(x, y) {
    //stoppedShapeArray will hold color string if occupied
    return (typeof stoppedShapeArray[y][x] === 'string')
}

//creates a rotated copy and checks if it fits
function RotationCollision(val) {
    //mod function: keep index within bounds of array
    let tetrominoCopy = curTetromino[mod((rotation + val), curTetromino.length)];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (WallCollision(x)) {
            collision = true;
            console.log('rot col wall')
            break;
        }
        if (FloorCollision(y)) {
            collision = true;
            console.log('rot col floor')
            break;
        }
        if (PieceCollision(x, y)) {
            collision = true;
            console.log('rot col piece')
            break;
        }
    }
    return collision;
}

function DebugPosition() {
    for (let i = 0; i < curTetromino[rotation].length; i++) {
        let square = curTetromino[rotation][i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        console.log('x: ', x, 'y:', y);
    }
}

//create a tetromino copy and see if it fits vertically
function VerticalCollision(val) {
    let tetrominoCopy = curTetromino[rotation];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        // moving down: increment y to check for a collison
        y += val

        //FloorCollision(x, y+1) for immediate stop...leave off +1 for some "sliding"
        if (FloorCollision(y) || PieceCollision(x, y)) { //always check FloorCollision first, or you may hit array bounds error
            collision = true;
            console.log('floor locked')
            break;
        }
    }

    if (collision) {
        // Check for game over and if so set game over text
        if (startY <= 0) {
            winOrLose = "Game Over";
            //draw white rectangle over previous string
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            //draw white game over text
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
            // Add stopped Tetromino color to stopped shape array
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[y][x] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            DrawTetromino();
        }
        return true;
    }
}

//create a tetromino copy and see if it fits horizontally
function HorizontalCollision(val) {
    if (val === 0) { return false; }
    let tetrominoCopy = curTetromino[rotation];
    let collision = false;
    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        x += val;

        if (WallCollision(x)) {
            collision = true;
            break;
        }
        if (PieceCollision(x, y)) {
            collision = true;
            break;
        }
    }
    return collision;
}

//-------------\\
//  GAME LOGIC  \\
//---------------\\
function DrawTetromino() {
    //queue block coords to draw, then draw them all
    for (let i = 0; i < curTetromino[rotation].length; i++) {
        let x = curTetromino[rotation][i][0] + startX;
        let y = curTetromino[rotation][i][1] + startY;
        gameBoardArray[y][x] = 1; //tell gameboard that block is present at coordinates

        //transcribe xy info to coordinateArray pixels
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;
        //draw the square
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
    }
}

function DeleteTetromino() {
    //white space needs a bit of a margin to handle non-integer ctx.scale drawing
    let marg = 0.5;
    for (let i = 0; i < curTetromino[rotation].length; i++) {
        //clear gameBoardArray:
        let x = curTetromino[rotation][i][0] + startX;
        let y = curTetromino[rotation][i][1] + startY;
        gameBoardArray[y][x] = 0;
        //undraw:
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;
        ctx.fillStyle = 'white';      
        ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
    }
}

function CreateTetromino() {
    startX = startXDefault;
    startY = startYDefault;
    rotation = 0;
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = false;
        if (stoppedShapeArray[y].every(index => typeof index === 'string')) {
            completed = true;
        }

        if (completed) {
            rowsToDelete++;
            //could add a check here for the greatest y value, then only redraw above that
            for (let i = 0; i < gBArrayWidth; i++) {
                // Update the arrays by zero'ing out previously filled squares
                stoppedShapeArray[y][i] = 0;
                gameBoardArray[y][i] = 0;
            }
            //grab the row, clear it out, and add it to the TOP of the array
            let removedRowColors = stoppedShapeArray.splice(y, 1);
            stoppedShapeArray.unshift(...removedRowColors);
            let removedRowGBA = gameBoardArray.splice(y, 1);
            gameBoardArray.unshift(...removedRowGBA);
        }
    }
    if (rowsToDelete > 0) {
        score += RowClearBonus(rowsToDelete) * level;
        //clear old score
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        //draw new score
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        RedrawRows();
    }
    console.log('check completion', stoppedShapeArray)
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

function RedrawRows() {
    // go through all cells in GBArray. Fill in occupied ones w/ color, fill in empty ones w/ white.
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            let coorX = coordinateArray[row][col].x;
            let coorY = coordinateArray[row][col].y;
            if (typeof stoppedShapeArray[row][col] === 'string') {
                ctx.fillStyle = stoppedShapeArray[row][col];
                ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
            } else {
                ctx.fillStyle = 'white'
                //white space needs a bit of a margin to handle non-integer ctx.scale drawing
                let marg = 0.5
                ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
            }
        }
    }
}

//bug: when near gameover, a new block may spawn on top of existing block, and gameplay continues, until the next 'tick down'
//but this causes old block to be overwritten w white color, although it still exists

//TODO: track line clearances
//TODO: increase level as more lines are cleared
//TODO: create algorithm that makes faster drops as level increases
//TODO: show nextblock
//TODO: make responsive