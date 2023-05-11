let canvas;
let ctx;
let gBArrayHeight = 20, gBArrayWidth = 10;
let startXDefault = 4, startX = startXDefault;
let startYDefault = 0, startY = startYDefault;
let blockDimension = 21, blockMargin = 1;
let rotation = 0;
let score = 0, level = 1, lines = 0;
let gameOver = false;
let showHighscores = false;
let gravity, frames = 60;
let gameloop;
let downPressAllowed;

let bgColor = '#f8f8f8';
let textColor = 'black';

//stores pixel coords w/ format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores currently controlled block & static blocks as filled (1) or empty (0)
let gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
//stores 'placed' block colors as strings
let stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));

let nextTetrominoCoordinateArray = new Array(3).fill(0).map(() => new Array(4).fill(0));

let tetrominos = [];
//                          T           I           J         [_]        L          s         z
//let tetrominoColors = ['fuchsia', 'turquoise', 'royalblue', 'gold', 'darkorange', 'lime', 'crimson'];
let tetrominoColors;
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

//wait for page to load, then run SetupCanvas ... also send a Get to fire up the server
document.addEventListener('DOMContentLoaded', () => { GetHighscores(); CreateTetrominos(); SetupCanvas() });

//populate coordArrays
function CreateCoordArrays() {
    let yTop = 1, xLeft = 3, blockSpacing = (1 + blockDimension + 1);
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            coordinateArray[row][col] = new Coordinates(xLeft + blockSpacing * col, yTop + blockSpacing * row);
        }
    }
    let nextLeft = xLeft + 247 - 6, nextTop = yTop + 104;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            nextTetrominoCoordinateArray[row][col] = new Coordinates(nextLeft + blockSpacing * col, nextTop + blockSpacing * row);
        }
    }
}

let fieldWidth, fieldHeight;
let blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ;
function SetupCanvas() {
    blockT = document.getElementById('block-t');
    blockI = document.getElementById('block-i');
    blockJ = document.getElementById('block-j');
    blockSQ = document.getElementById('block-sq');
    blockL = document.getElementById('block-l');
    blockS = document.getElementById('block-s');
    blockZ = document.getElementById('block-z');
    tetrominoColors = [blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ];

    showHighscores = false;
    document.getElementById('score-form-submit').disabled = false;
    score = 0, level = 1, lines = 0;
    gameOver = false;
    UpdateScores();
    frames = 60;
    SetGravity();
    startX = startXDefault;
    startY = startYDefault;
    document.getElementById('game-over').style.visibility = "hidden";
    document.getElementById('highscore-outer').style.visibility = "hidden";
    document.getElementById('highscore-prompt').style.visibility = "hidden";
    gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2))
    fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2))
    let scale = 1;
    canvas.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvas.height = (5 + fieldHeight) * scale;

    ctx.scale(scale, scale); //zoom in

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', HandleKeyPress);
    document.addEventListener('keyup', keyUpHandler, false);
    CreateCoordArrays();
    LoadRandomTetrominoIntoNext();
    CreateTetrominoFromNext();
    downPressAllowed = true;
    clearInterval(gameloop);
    gameloop = setInterval(UpdateGame, 1000 / frames);
}

let hspeed = 0, vspeed = 0, rspeed = 0; frameCount = 0;
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;
let lastFrameWithRotationMovement = -rotationMovementLimit
function UpdateGame() {
    if (!gameOver) {
        //clear old canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, fieldWidth, fieldHeight)
        //draw field border
        ctx.strokeStyle = textColor;
        ctx.strokeRect(0 + 0.5, 0 + 0.5, fieldWidth - 1, fieldHeight - 1); //offset by half pixel to prevent transparency issue

        //control how fast button "holds" are registered
        if (hspeed != 0) {
            if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
                MoveTetrominoHoriztonal(hspeed);
                lastFrameWithHorizontalMovement = frameCount;
            }
        }
        if (vspeed != 0) {
            if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
                if (downPressAllowed) { //assist behavior where down is accidentally not released (if you press, then slide without releasing over it)
                    MoveTetrominoDown();
                    lastFrameWithVerticalMovement = frameCount;
                }
            }
        }
        //the following allows one to 'hold' rotations. disabled because it feels too 'helicoptery'
        // if (rspeed != 0) {
        //     if (frameCount - lastFrameWithRotationMovement >= rotationMovementLimit) {
        //     RotateTetromino(rspeed);
        //     lastFrameWithRotationMovement = frameCount;
        //     }
        // }
        DrawCurTetrominoAndCheckGameOver();
        RedrawRows();
        DrawNextTetromino();
        frameCount++;
    }
}

function CreateTetrominos() {
    /*  T block: [ [[0, 1], [1, 1], [2, 1], [1, 2]], [[rotation2]], [[rotation3]], [[rotation4]] ]

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
function updateMovement() {

}

function HandleKeyPress(key) {
    if (!gameOver) { //!!! this check is a bit redundant, can clean up later
        if (key.keyCode === 37) { // left arrow
            hspeed = -1;
            // MoveTetrominoHoriztonal(-1);
        } else if (key.keyCode === 39) { // right arrow
            hspeed = 1;
            // MoveTetrominoHoriztonal(1);
        } else if (key.keyCode === 40) { // down arrow
            HandleDownPress();
        } else if (key.keyCode === 88) { //x
            rspeed = 1;
            RotateTetromino(1);
        } else if (key.keyCode === 90) { //z
            rspeed = -1;
            RotateTetromino(-1);
        } else if (key.keyCode === 38) { // up arrow
            DebugPosition();
        }
    }
}

function keyUpHandler(key) {
    if (key.keyCode === 37 || key.keyCode === 39) { //left or right arrow
        hspeed = 0;
    } else if (key.keyCode === 40) { //down arrow
        HandleDownRelease();
    } else if ((key.keyCode === 88) || key.keyCode === 90) { //x or z
        rspeed = 0;
    }
}

function HandleDownPress() {
    vspeed = 1;
}

function HandleDownRelease() {
    vspeed = 0;
    downPressAllowed = true;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function RotateTetromino(val) {
    if (!gameOver) {
        if (!RotationCollision(val)) {
            DeleteTetromino();
            rotation += val;
            rotation = mod(rotation, curTetromino.length); //keep inside Array bounds
            //DrawTetromino();
            DrawCurTetrominoAndCheckGameOver();
        }
    }
}

function MoveTetrominoDown() {
    if (!gameOver) {
        if (!VerticalCollision(1)) {
            DeleteTetromino();
            startY++;
            DrawCurTetrominoAndCheckGameOver();
        }
    }
}

function MoveTetrominoHoriztonal(val) {
    if (!HorizontalCollision(val)) {
        DeleteTetromino();
        startX += val;
        DrawCurTetrominoAndCheckGameOver();
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
            if (!gameOver) {
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
    return (stoppedShapeArray[y][x] !== 0)
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
        //move this loop up?
        for (let i = 0; i < tetrominoCopy.length; i++) {
            let square = tetrominoCopy[i];
            let x = square[0] + startX;
            let y = square[1] + startY;
            stoppedShapeArray[y][x] = curTetrominoColor;
        }
        CheckForCompletedRows();
        CreateTetrominoFromNext();
        DrawCurTetrominoAndCheckGameOver();
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

function DrawCurTetrominoAndCheckGameOver() {
    let gameOverCheck = false;
    for (let i = 0; i < curTetromino[rotation].length; i++) {
        let x = curTetromino[rotation][i][0] + startX;
        let y = curTetromino[rotation][i][1] + startY;
        gameBoardArray[y][x] = 1; //tell gameboard that block is present at coordinates

        //transcribe xy info to coordinateArray pixels
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;
        //draw the square
        ctx.drawImage(curTetrominoColor, coorX, coorY)
        //Check for Game Over -- when two pieces overlap eachother
        if (PieceCollision(x, y)) {
            gameOverCheck = true;
            console.log('dead collision')
        }
    }

    if (gameOverCheck) {
        gameOver = true;
        document.getElementById('game-over').style.visibility = "visible";
        DisplayHighscores(true);
        clearInterval(gameloop);
    }
}

function DrawNextTetromino() {
    //draw white rectangle over old piece
    let bgX = nextTetrominoCoordinateArray[0][0].x
    let bgY = nextTetrominoCoordinateArray[0][0].y
    ctx.fillStyle = "white";
    ctx.fillRect(bgX, bgY, (1 + blockDimension + 1) * 4, (1 + blockDimension + 1) * 3);


    for (let i = 0; i < nextTetromino[0].length; i++) {
        //use [0][ ][ ] for defaultRotation - no need to draw any other kind of rotation for the Next-block view.
        let x = nextTetromino[0][i][0];
        let y = nextTetromino[0][i][1];
        let coorX = nextTetrominoCoordinateArray[y][x].x;
        let coorY = nextTetrominoCoordinateArray[y][x].y;
        //draw the square
        ctx.drawImage(nextTetrominoColor, coorX, coorY)
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
    downPressAllowed = false; //kill downward momentum when new piece spawns
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
        if (stoppedShapeArray[y].every(index => index !== 0)) {
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
    // go through all cells in GBArray. Fill in occupied ones w/ image
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            let coorX = coordinateArray[row][col].x;
            let coorY = coordinateArray[row][col].y;
            if (stoppedShapeArray[row][col] !== 0) {
                let tetColor = stoppedShapeArray[row][col];
                ctx.drawImage(tetColor, coorX, coorY);
            }
        }
    }
}

//-------------\\
//  HIGHSCORES  \\
//---------------\\

function ToggleHighscores() {
    showHighscores = !showHighscores
    console.log(showHighscores)
    if (showHighscores) {
        DisplayHighscores(false);
    } else {
        document.getElementById('highscore-outer').style.visibility = "hidden";
    }
}

async function DisplayHighscores(checkNewScore) {
    showHighscores = true;
    const scores = await GetHighscores();
    console.log(scores)
    document.getElementById('highscore-display').innerHTML =
        "<ol>" +
        scores.map(score => "<li>" + score.name + ": " + score.score + "</li>").join(' ') //use join-- otherwise you get unwanted commas after array is stringified
        + "</ol>";
    document.getElementById('highscore-outer').style.visibility = "visible"; //await here? to avoid springing...
    if (checkNewScore) {
        // if (score >= 0) { //for testing
        if (scores.length < 5 || score > scores[4].score) { //if highscore achieved...
            document.getElementById('highscore-prompt').style.visibility = "visible";
        }
    }
}

async function GetHighscores() {
    console.log('get sent')
    const response = await fetch("https://tetris-javascript.onrender.com/highscores"); //GET request to server
    const scores = await response.json();
    return scores;
}

async function SubmitScore(event) {
    event.preventDefault(); //prevent page refresh
    document.getElementById('score-form-submit').disabled = true;
    console.log('send sent')
    fetch("https://tetris-javascript.onrender.com/add-score", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById("name-submit").value,
            score: score,
            lines: lines,
            level: level,
        }),
    }).then((response) => response.json())
        .then((result) => {
            console.log("Successful Submission:", result);
            document.getElementById('highscore-prompt').style.visibility = "hidden";
            DisplayHighscores(false); //refresh highscores
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

//TODO: profanity filter?
//TODO: right align highscores
//TODO: rate limit? https://github.com/tonikv/snake-highscore/blob/master/index.js