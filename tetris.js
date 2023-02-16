let canvas;
let ctx;
let gBArrayHeight = 20, gBArrayWidth = 10;
let startXDefault = 4, startX = startXDefault;
let startYDefault = 0, startY = startYDefault;
let blockDimension = 21, blockMargin = 1;
let rotation = 0;
let score = 0, level = 1, lines = 0;
let winOrLose = "Playing";
let gravity, frames = 60;

let bgColor = 'white';
let textColor = 'black';

//stores pixel coords w/ format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores currently controlled block & static blocks as filled (1) or empty (0)
let gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores 'placed' block colors as strings
let stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));

let nextTetrominoCoordinateArray = new Array(3).fill(0).map(() => new Array(4).fill(0));

let tetrominos = [];
let tetrominoColors = ['fuchsia', 'turquoise', 'royalblue', 'gold', 'darkorange', 'lime', 'crimson'];
let curTetromino = [];
let curTetrominoColor;
let nextTetromino = [];
let nextTetrominoColor = undefined;

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
document.addEventListener('DOMContentLoaded', () => { CreateTetrominos(); SetupCanvas() });

//populate coordArrays
function CreateCoordArrays() {
    let yTop = 9, xLeft = 11, blockSpacing = (1 + blockDimension + 1);
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            coordinateArray[row][col] = new Coordinates(xLeft + blockSpacing * col, yTop + blockSpacing * row);
        }
    }
    let nextLeft = 258, nextTop = 113;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            nextTetrominoCoordinateArray[row][col] = new Coordinates(nextLeft + blockSpacing * col, nextTop + blockSpacing * row);
        }
    }
}

function SetupCanvas() {
    score = 0, level = 1, lines = 0;
    winOrLose = "Playing";
    UpdateScores();
    frames = 60;
    SetGravity();
    startX = startXDefault;
    startY = startYDefault;
    document.getElementById('restart-container').innerHTML = "";

    gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    let fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2))
    let fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2))
    let scale = 1;
    canvas.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvas.height = (14 + fieldHeight) * scale;

    ctx.scale(scale, scale); //zoom in

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw field border
    ctx.strokeStyle = textColor;
    ctx.strokeRect(8, 8, fieldWidth, fieldHeight);

    document.addEventListener('keydown', HandleKeyPress);
    CreateCoordArrays();
    LoadRandomTetrominoIntoNext();
    CreateTetrominoFromNext();
    DrawTetromino();
}

function CreateTetrominos() {
    /*  T block: [[0, 1], [1, 1], [2, 1], [1, 2]]

                    0   1   2   3
                0 |   |   |   |   |
                1 |xxx|xxx|xxx|   |
                2 |   |xxx|   |   |
                3 |   |   |   |   |
    */
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
        if (key.keyCode === 37) { // left arrow
            MoveTetrominoHoriztonal(-1);
        } else if (key.keyCode === 39) { // right arrow
            MoveTetrominoHoriztonal(1);
        } else if (key.keyCode === 40) { // down arrow
            MoveTetrominoDown();
        } else if (key.keyCode === 88) { //x
            RotateTetromino(1);
        } else if (key.keyCode === 90) { //z
            RotateTetromino(-1);
        } else if (key.keyCode === 38) { // up arrow
            DebugPosition();
        }
    } else {
        if (key.keyCode === 82) { // r -- Restart
            SetupCanvas();
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

function MoveTetrominoHoriztonal(val) {
    if (!HorizontalCollision(val)) {
        DeleteTetromino();
        startX += val;
        DrawTetromino();
    }
}

function SetGravity() {
    let newFrames;
    switch (level) {
        case 1: newFrames = 48; break;
        case 2: newFrames = 43; break;
        case 3: newFrames = 38; break;
        case 4: newFrames = 33; break;
        case 5: newFrames = 28; break;
        case 6: newFrames = 23; break;
        case 7: newFrames = 18; break;
        case 8: newFrames = 13; break;
        case 9: newFrames = 8; break;
        case 10: newFrames = 6; break;
        case 11:
        case 12:
        case 13: newFrames = 5; break;
        case 14:
        case 15:
        case 16: newFrames = 4; break;
        case 17:
        case 18:
        case 19: newFrames = 3; break;
        case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 27: case 28:
        case 29: newFrames = 2; break;
        default: newFrames = 1; break;
    }

    //only update the interval when there's a new speed
    if (frames != newFrames) {
        frames = newFrames;
        gravitySpeed = newFrames / 60 * 1000;
        clearInterval(gravity);
        gravity = setInterval(function () {
            if (winOrLose != "Game Over") {
                MoveTetrominoDown();
            }
        }, gravitySpeed);
    }
}

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
    let newRotation = rotation + val;
    let tetrominoCopy = curTetromino[mod(newRotation, curTetromino.length)];
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
            console.log('collision locked')
            break;
        }
    }

    if (collision) {
        // Check for game over and if so set game over text
        if (startY <= 0) {
            winOrLose = "Game Over";
            document.getElementById('restart-container').innerHTML = "<button onclick='SetupCanvas()' class='restart-button'>Restart</button>";
            ctx.fillStyle = 'red';
            ctx.font = '21px Silkscreen';
            ctx.fillText(winOrLose, 24, 26);
            ctx.fillStyle = textColor;
            ctx.fillText("Press R", 24, 50);
            ctx.fillText("to Restart", 24, 74);
        } else {
            // Add stopped Tetromino color to stopped shape array
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[y][x] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetrominoFromNext();
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
function DrawNextTetromino() {
    let bgX = nextTetrominoCoordinateArray[0][0].x
    let bgY = nextTetrominoCoordinateArray[0][0].y
    ctx.fillStyle = bgColor;
    ctx.fillRect(bgX, bgY, (1 + blockDimension + 1) * 4, (1 + blockDimension + 1) * 3);

    for (let i = 0; i < nextTetromino[rotation].length; i++) {
        let x = nextTetromino[rotation][i][0];
        let y = nextTetromino[rotation][i][1];
        let coorX = nextTetrominoCoordinateArray[y][x].x;
        let coorY = nextTetrominoCoordinateArray[y][x].y;
        //draw the square
        ctx.fillStyle = nextTetrominoColor;
        ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
    }
}

function DrawTetromino() {
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
        ctx.fillStyle = bgColor;
        ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
    }
}

function CreateTetrominoFromNext() {
    startX = startXDefault;
    startY = startYDefault;
    rotation = 0;
    curTetromino = nextTetromino;
    curTetrominoColor = nextTetrominoColor;
    LoadRandomTetrominoIntoNext();
    DrawNextTetromino();
}

function LoadRandomTetrominoIntoNext() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    nextTetromino = tetrominos[randomTetromino];
    nextTetrominoColor = tetrominoColors[randomTetromino];
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
        lines += rowsToDelete;
        level = Math.floor(lines / 10) + 1;
        SetGravity();
        UpdateScores();
        RedrawRows();
    }
    console.log('check completion', stoppedShapeArray)
}

function UpdateScores() {
    document.getElementById('score').innerHTML = score;
    document.getElementById('lines').innerHTML = lines;
    document.getElementById('level').innerHTML = level;
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
                ctx.fillStyle = bgColor;
                //white space needs a bit of a margin to handle non-integer ctx.scale drawing
                let marg = 0.5
                ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
            }
        }
    }
}

//bug: when near gameover, a new block may spawn on top of existing block, and gameplay continues, until the next 'tick down'
//but this causes old block to be overwritten w white color, although it still exists

//TODO: make responsive
//TODO: game over check should iterate through each square, not just check startY
//TODO: mobile button hold