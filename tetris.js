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

//wait for page to load, then run SetupCanvas ... also send getHighscores to fire up the server (cheap host takes some seconds to spin up)
document.addEventListener('DOMContentLoaded', () => { assignElements(); createTetrominos(); setupCanvas(); getHighscores(); });

//populate coordArrays
function createCoordArrays() {
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

let blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ;
let canvasEl, highscoreOuterEl, highscoreDisplayEl, highscorePromptEl, scoreFormSubmitEl, gameOverEl, scoreEl, linesEl, levelEl, nameSubmitEl;
function assignElements() {
    canvasEl = document.getElementById('my-canvas');
    gameOverEl = document.getElementById('game-over');
    highscoreOuterEl = document.getElementById('highscore-outer');
    highscoreDisplayEl = document.getElementById('highscore-display');
    highscorePromptEl = document.getElementById('highscore-prompt');
    scoreFormSubmitEl = document.getElementById('score-form-submit');
    nameSubmitEl = document.getElementById('name-submit')
    scoreEl = document.getElementById('score');
    linesEl = document.getElementById('lines');
    levelEl = document.getElementById('level');
    blockT = document.getElementById('block-t');
    blockI = document.getElementById('block-i');
    blockJ = document.getElementById('block-j');
    blockSQ = document.getElementById('block-sq');
    blockL = document.getElementById('block-l');
    blockS = document.getElementById('block-s');
    blockZ = document.getElementById('block-z');
}

let fieldWidth, fieldHeight;
function setupCanvas() {
    tetrominoColors = [blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ];

    showHighscores = false;
    scoreFormSubmitEl.disabled = false;
    score = 0, level = 1, lines = 0;
    gameOver = false;
    updateScores();
    frames = 60;
    setGravity();
    startX = startXDefault;
    startY = startYDefault;
    gameOverEl.style.visibility = "hidden";
    highscoreOuterEl.style.visibility = "hidden";
    highscorePromptEl.style.visibility = "hidden";
    gameBoardArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    stoppedShapeArray = new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
    ctx = canvasEl.getContext('2d');
    fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2))
    fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2))
    let scale = 1;
    canvasEl.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvasEl.height = (5 + fieldHeight) * scale;

    ctx.scale(scale, scale); //zoom in

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', keyUpHandler, false);
    createCoordArrays();
    loadRandomTetrominoIntoNext();
    createTetrominoFromNext();
    downPressAllowed = true;
    clearInterval(gameloop);
    gameloop = setInterval(updateGame, 1000 / frames);
}

let hspeed = 0, vspeed = 0, rspeed = 0; frameCount = 0;
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;
let lastFrameWithRotationMovement = -rotationMovementLimit
function updateGame() {
    if (!gameOver) {
        //clear old canvas
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, fieldWidth, fieldHeight)
        //draw field border
        ctx.strokeStyle = textColor;
        ctx.strokeRect(0 + 0.5, 0 + 0.5, fieldWidth - 1, fieldHeight - 1); //offset by half pixel to prevent transparency issue

        updateMovement();
        drawCurTetrominoAndCheckGameOver();
        redrawRows();
        drawNextTetromino();
        frameCount++;
    }
}

function createTetrominos() {
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
    //control how fast button "holds" are registered
    if (hspeed != 0) {
        if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
            moveTetrominoHoriztonal(hspeed);
            lastFrameWithHorizontalMovement = frameCount;
        }
    }
    if (vspeed != 0) {
        if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
            if (downPressAllowed) { //disable downpress from carrying over when last piece is placed and new piece spawns
                moveTetrominoDown();
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
}

function handleKeyPress(key) {
    if (!gameOver) { //!!! this check is a bit redundant, can clean up later
        if (key.keyCode === 37) { // left arrow
            hspeed = -1;
        } else if (key.keyCode === 39) { // right arrow
            hspeed = 1;
        } else if (key.keyCode === 40) { // down arrow
            HandleDownPress();
        } else if (key.keyCode === 88) { //x
            rspeed = 1;
            rotateTetromino(1);
        } else if (key.keyCode === 90) { //z
            rspeed = -1;
            rotateTetromino(-1);
        } else if (key.keyCode === 38) { // up arrow
            debugPosition();
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

function rotateTetromino(val) {
    if (!gameOver) {
        if (!rotationCollision(val)) {
            deleteTetromino();
            rotation += val;
            rotation = mod(rotation, curTetromino.length); //keep inside Array bounds
            drawCurTetrominoAndCheckGameOver();
        }
    }
}

function moveTetrominoDown() {
    if (!gameOver) {
        if (!verticalCollision(1)) {
            deleteTetromino();
            startY++;
            drawCurTetrominoAndCheckGameOver();
        }
    }
}

function moveTetrominoHoriztonal(val) {
    if (!horizontalCollision(val)) {
        deleteTetromino();
        startX += val;
        drawCurTetrominoAndCheckGameOver();
    }
}

function setGravity() {
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
                moveTetrominoDown();
            }
        }, gravitySpeed);
    }
}

//-------------\\
//  COLLISIONS  \\
//---------------\\
function floorCollision(y) {
    return (y >= gBArrayHeight);
}
function wallCollision(x) {
    return (x > gBArrayWidth - 1 || x < 0);
}
function pieceCollision(x, y) {
    //stoppedShapeArray will hold 0 if unoccupied
    return (stoppedShapeArray[y][x] !== 0)
}

//creates a rotated copy and checks if it fits
function rotationCollision(val) {
    //mod function: keep index within bounds of array
    let newRotation = rotation + val;
    let tetrominoCopy = curTetromino[mod(newRotation, curTetromino.length)];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (wallCollision(x)) {
            collision = true;
            break;
        }
        if (floorCollision(y)) {
            collision = true;
            break;
        }
        if (pieceCollision(x, y)) {
            collision = true;
            break;
        }
    }
    return collision;
}

function debugPosition() {
    for (let i = 0; i < curTetromino[rotation].length; i++) {
        let square = curTetromino[rotation][i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        console.log('x: ', x, 'y:', y);
    }
}

//create a tetromino copy and see if it fits vertically
function verticalCollision(val) {
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
        if (floorCollision(y) || pieceCollision(x, y)) { //always check FloorCollision first, or you may hit array bounds error
            collision = true;
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
        checkForCompletedRows();
        createTetrominoFromNext();
        drawCurTetrominoAndCheckGameOver();
        return true;
    }
}

//create a tetromino copy and see if it fits horizontally
function horizontalCollision(val) {
    if (val === 0) { return false; }
    let tetrominoCopy = curTetromino[rotation];
    let collision = false;
    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        x += val;

        if (wallCollision(x)) {
            collision = true;
            break;
        }
        if (pieceCollision(x, y)) {
            collision = true;
            break;
        }
    }
    return collision;
}

//-------------\\
//  GAME LOGIC  \\
//---------------\\

function drawCurTetrominoAndCheckGameOver() {
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
        if (pieceCollision(x, y)) {
            gameOverCheck = true;
        }
    }

    if (gameOverCheck) {
        gameOver = true;
        gameOverEl.style.visibility = "visible";
        displayHighscores(true);
        clearInterval(gameloop);
    }
}

function drawNextTetromino() {
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

function deleteTetromino() {
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

function createTetrominoFromNext() {
    downPressAllowed = false; //kill downward momentum when new piece spawns
    startX = startXDefault;
    startY = startYDefault;
    rotation = 0;
    curTetromino = nextTetromino;
    curTetrominoColor = nextTetrominoColor;
    loadRandomTetrominoIntoNext();
    drawNextTetromino();
}

function loadRandomTetrominoIntoNext() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    nextTetromino = tetrominos[randomTetromino];
    nextTetrominoColor = tetrominoColors[randomTetromino];
}

function checkForCompletedRows() {
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
        score += rowClearBonus(rowsToDelete) * level;
        lines += rowsToDelete;
        level = Math.floor(lines / 10) + 1;
        setGravity();
        updateScores();
        redrawRows();
    }
}

function updateScores() {
    scoreEl.innerHTML = score;
    linesEl = lines;
    levelEl = level;
}

function rowClearBonus(rows) {
    switch (rows) {
        case 1: return 40; break;
        case 2: return 100; break;
        case 3: return 300; break;
        case 4: return 1200; break;
        default: return 0;
    }
}

function redrawRows() {
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

function toggleHighscores() {
    showHighscores = !showHighscores;
    if (showHighscores) {
        displayHighscores(false);
    } else {
        highscoreOuterEl.style.visibility = 'hidden';
    }
}

async function displayHighscores(checkNewScore) {
    showHighscores = true;
    const scores = await getHighscores();
    const scoreListItems = scores
        .map((score) => `<li>${score.name}: ${score.score}</li>`)
        .join('');
    highscoreDisplayEl.innerHTML = `<ol>${scoreListItems}</ol>`;
    highscoreOuterEl.style.visibility = 'visible';
    if (checkNewScore && (scores.length < 5 || score > scores[4]?.score)) {
        highscorePromptEl.style.visibility = 'visible';
    }
}

async function getHighscores() {
    try {
        const response = await fetch(
            'https://tetris-javascript.onrender.com/highscores'
        );
        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error('Error getting scores:', error);
        return [];
    }
}

async function submitScore(event) {
    event.preventDefault();
    scoreFormSubmitEl.disabled = true;
    try {
        await fetch('https://tetris-javascript.onrender.com/add-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameSubmitEl.value,
                score,
                lines,
                level,
            }),
        });
        highscorePromptEl.style.visibility = 'hidden';
        displayHighscores(false);
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

//TODO: profanity filter?
//TODO: right align highscores
//TODO: rate limit? https://github.com/tonikv/snake-highscore/blob/master/index.js