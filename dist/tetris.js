"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForCompletedRows = exports.createTetrominoFromNext = exports.curTetrominoImage = exports.curTetromino = exports.drawCurTetrominoAndCheckGameOver = exports.mod = exports.rotationIndex = exports.startY = exports.startYDefault = exports.startX = exports.startXDefault = exports.stoppedShapeArray = exports.gBArrayWidth = exports.gBArrayHeight = void 0;
const collisions_1 = require("./collisions");
//-------------------\\
//  INITIALIZATION    \\
//---------------------\\
//wait for page to load, then run initializers ... also send getHighscores to fire up the server (cheap host takes some seconds to spin up)
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeGame();
    getHighscores();
});
let canvasEl, highscoreOuterEl, highscoreDisplayEl, highscorePromptEl, scoreFormSubmitEl, gameOverEl, scoreEl, linesEl, levelEl, nameSubmitEl;
let blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ;
let tetrominoImages;
function assignElements() {
    canvasEl = document.querySelector('#my-canvas');
    gameOverEl = document.getElementById('game-over');
    highscoreOuterEl = document.getElementById('highscore-outer');
    highscoreDisplayEl = document.getElementById('highscore-display');
    highscorePromptEl = document.getElementById('highscore-prompt');
    scoreFormSubmitEl = document.querySelector('#score-form-submit');
    nameSubmitEl = document.querySelector('#name-submit');
    scoreEl = document.getElementById('score');
    linesEl = document.getElementById('lines');
    levelEl = document.getElementById('level');
    blockT = document.querySelector('#block-t');
    blockI = document.querySelector('#block-i');
    blockJ = document.querySelector('#block-j');
    blockSQ = document.querySelector('#block-sq');
    blockL = document.querySelector('#block-l');
    blockS = document.querySelector('#block-s');
    blockZ = document.querySelector('#block-z');
    tetrominoImages = [blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ];
}
///////ARRAYS\\\\\\\\
class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.gBArrayHeight = 20;
exports.gBArrayWidth = 10;
let coordinateArray; //stores pixel coords 
let gameBoardArray; //stores currently controlled block & static blocks as filled (1) or empty (0)
function zeroOutArray(arr) {
    return new Array(exports.gBArrayHeight).fill(0).map(() => new Array(exports.gBArrayWidth).fill(0));
}
const nextTetrominoCoordinateArray = Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => new Coordinates(0, 0)));
///////////\\\\\\\\\\\
let ctx;
let fieldWidth;
let fieldHeight;
function initializeCanvas() {
    assignElements();
    ctx = canvasEl.getContext('2d');
    fieldWidth = blockMargin * 4 + (exports.gBArrayWidth * (blockDimension + blockMargin * 2));
    fieldHeight = blockMargin * 2 + (exports.gBArrayHeight * (blockDimension + blockMargin * 2));
    let scale = 1;
    canvasEl.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvasEl.height = (5 + fieldHeight) * scale;
    ctx.scale(scale, scale);
    createCoordArrays();
    createTetrominos();
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', keyUpHandler, false);
}
let blockDimension = 21, blockMargin = 1;
function createCoordArrays() {
    //coordinateArray = zeroOutArray(coordinateArray);
    coordinateArray = Array.from({ length: exports.gBArrayHeight }, () => Array.from({ length: exports.gBArrayWidth }, () => new Coordinates(0, 0)));
    let yTop = 1, xLeft = 3, blockSpacing = 1 + blockDimension + 1;
    for (let row = 0; row < exports.gBArrayHeight; row++) {
        for (let col = 0; col < exports.gBArrayWidth; col++) {
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
class Tetromino {
    constructor(rotations) {
        this.rotations = rotations;
    }
    get length() {
        return this.rotations?.length || 0;
    }
    getSecondArrayLength() {
        return this.rotations[0]?.length || 0;
    }
}
let tetrominos = [];
function createTetrominos() {
    /*  T block: [ [[0, 1], [1, 1], [2, 1], [1, 2]], [[rotation2]], [[rotation3]], [[rotation4]] ]

                    0   1   2   3
                0 |   |   |   |   |
                1 |xxx|xxx|xxx|   |
                2 |   |xxx|   |   |
                3 |   |   |   |   |
    */
    // T block
    tetrominos.push(new Tetromino([
        [[0, 1], [1, 1], [2, 1], [1, 2]],
        [[1, 0], [0, 1], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [1, 0]],
        [[1, 0], [2, 1], [1, 1], [1, 2]],
    ]));
    // I block
    tetrominos.push(new Tetromino([
        [[0, 2], [1, 2], [2, 2], [3, 2]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
    ]));
    // J block
    tetrominos.push(new Tetromino([
        [[0, 1], [1, 1], [2, 1], [2, 2]],
        [[1, 0], [0, 2], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [0, 0]],
        [[1, 0], [2, 0], [1, 1], [1, 2]],
    ]));
    // Square block
    tetrominos.push(new Tetromino([
        [[1, 1], [2, 1], [1, 2], [2, 2]],
    ]));
    // L block
    tetrominos.push(new Tetromino([
        [[0, 1], [1, 1], [2, 1], [0, 2]],
        [[1, 0], [0, 0], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [2, 0]],
        [[1, 0], [2, 2], [1, 1], [1, 2]],
    ]));
    // S block
    tetrominos.push(new Tetromino([
        [[1, 1], [2, 1], [0, 2], [1, 2]],
        [[1, 1], [2, 1], [1, 0], [2, 2]],
    ]));
    // Z block
    tetrominos.push(new Tetromino([
        [[0, 1], [1, 1], [1, 2], [2, 2]],
        [[2, 0], [1, 1], [1, 2], [2, 1]],
    ]));
}
exports.startXDefault = 4, exports.startX = exports.startXDefault;
exports.startYDefault = 0, exports.startY = exports.startYDefault;
let score = 0, level = 1, lines = 0;
let gameOver = false, showHighscores = false;
let gameloop, gravity, framerate;
let bgColor = '#f8f8f8', textColor = 'black';
let downPressAllowed;
exports.rotationIndex = 0;
function initializeGame() {
    showHighscores = false;
    scoreFormSubmitEl.disabled = false;
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    updateScores();
    framerate = 60;
    setGravity();
    exports.startX = exports.startXDefault;
    exports.startY = exports.startYDefault;
    gameOverEl.style.visibility = "hidden";
    highscoreOuterEl.style.visibility = "hidden";
    highscorePromptEl.style.visibility = "hidden";
    gameBoardArray = zeroOutArray(gameBoardArray);
    exports.stoppedShapeArray = zeroOutArray(exports.stoppedShapeArray);
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    loadRandomTetrominoIntoNext();
    createTetrominoFromNext();
    downPressAllowed = true;
    clearInterval(gameloop);
    gameloop = setInterval(updateGame, 1000 / framerate);
}
let hspeed = 0, vspeed = 0, rspeed = 0, frameCount = 0;
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;
let lastFrameWithRotationMovement = -rotationMovementLimit;
function updateGame() {
    if (!gameOver) {
        //clear old canvas
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, fieldWidth, fieldHeight);
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
//-------------\\
//  MOVEMENT    \\
//---------------\\
function updateMovement() {
    //control how fast button "holds" are registered
    if (hspeed !== 0) {
        if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
            moveTetrominoHorizontal(hspeed);
            lastFrameWithHorizontalMovement = frameCount;
        }
    }
    if (vspeed !== 0) {
        if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
            if (downPressAllowed) { //disable downpress from carrying over when last piece is placed and new piece spawns
                moveTetrominoDown();
                lastFrameWithVerticalMovement = frameCount;
            }
        }
    }
}
function handleKeyPress(key) {
    if (!gameOver) { // this check is a bit redundant, can clean up later
        if (key.keyCode === 37) { // left arrow
            hspeed = -1;
        }
        else if (key.keyCode === 39) { // right arrow
            hspeed = 1;
        }
        else if (key.keyCode === 40) { // down arrow
            handleDownPress();
        }
        else if (key.keyCode === 88) { //x
            rspeed = 1;
            rotateTetromino(1);
        }
        else if (key.keyCode === 90) { //z
            rspeed = -1;
            rotateTetromino(-1);
        }
        // else if (key.keyCode === 38) { // up arrow
        //     debugPosition();
        // }
    }
}
function keyUpHandler(key) {
    if (key.keyCode === 37 || key.keyCode === 39) { //left or right arrow
        hspeed = 0;
    }
    else if (key.keyCode === 40) { //down arrow
        handleDownRelease();
    }
    else if (key.keyCode === 88 || key.keyCode === 90) { //x or z
        rspeed = 0;
    }
}
function handleDownPress() {
    vspeed = 1;
}
function handleDownRelease() {
    vspeed = 0;
    downPressAllowed = true;
}
function mod(n, m) {
    return ((n % m) + m) % m;
}
exports.mod = mod;
function rotateTetromino(val) {
    if (!gameOver) {
        if (!(0, collisions_1.rotationCollision)(val)) {
            deleteTetromino();
            exports.rotationIndex += val;
            exports.rotationIndex = mod(exports.rotationIndex, exports.curTetromino.length); //keep inside Array bounds
            drawCurTetrominoAndCheckGameOver();
        }
    }
}
function moveTetrominoDown() {
    if (!gameOver) {
        if (!(0, collisions_1.verticalCollision)(1)) {
            deleteTetromino();
            exports.startY++;
            drawCurTetrominoAndCheckGameOver();
        }
    }
}
function moveTetrominoHorizontal(val) {
    if (!(0, collisions_1.horizontalCollision)(val)) {
        deleteTetromino();
        exports.startX += val;
        drawCurTetrominoAndCheckGameOver();
    }
}
// function debugPosition() {
//     for (let i = 0; i < curTetromino.rotations[rotationIndex].length; i++) {
//         let square = curTetromino.rotations[rotationIndex][i];
//         let x = square[0] + startX;
//         let y = square[1] + startY;
//         console.log('x: ', x, 'y:', y);
//     }
// }
function setGravity() {
    let newFrames;
    switch (level) {
        case 1:
            newFrames = 48;
            break;
        case 2:
            newFrames = 43;
            break;
        case 3:
            newFrames = 38;
            break;
        case 4:
            newFrames = 33;
            break;
        case 5:
            newFrames = 28;
            break;
        case 6:
            newFrames = 23;
            break;
        case 7:
            newFrames = 18;
            break;
        case 8:
            newFrames = 13;
            break;
        case 9:
            newFrames = 8;
            break;
        case 10:
            newFrames = 6;
            break;
        case 11:
        case 12:
        case 13:
            newFrames = 5;
            break;
        case 14:
        case 15:
        case 16:
            newFrames = 4;
            break;
        case 17:
        case 18:
        case 19:
            newFrames = 3;
            break;
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29:
            newFrames = 2;
            break;
        default:
            newFrames = 1;
            break;
    }
    //only update the interval when there's a new speed
    if (framerate !== newFrames) { //Refactor: "frames"
        framerate = newFrames;
        let gravitySpeed = (newFrames / 60) * 1000;
        clearInterval(gravity);
        gravity = setInterval(() => {
            if (!gameOver) {
                moveTetrominoDown();
            }
        }, gravitySpeed);
    }
}
//-------------\\
//  GAME LOGIC  \\
//---------------\\
function drawCurTetrominoAndCheckGameOver() {
    let gameOverCheck = false;
    for (let i = 0; i < exports.curTetromino.rotations[exports.rotationIndex].length; i++) {
        let x = exports.curTetromino.rotations[exports.rotationIndex][i][0] + exports.startX;
        let y = exports.curTetromino.rotations[exports.rotationIndex][i][1] + exports.startY;
        gameBoardArray[y][x] = 1; //tell gameboard that block is present at coordinates
        //transcribe xy info to coordinateArray pixels
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;
        //draw the square
        ctx.drawImage(exports.curTetrominoImage, coorX, coorY);
        //Check for Game Over -- when two pieces overlap eachother
        if ((0, collisions_1.pieceCollision)(x, y)) {
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
exports.drawCurTetrominoAndCheckGameOver = drawCurTetrominoAndCheckGameOver;
function drawNextTetromino() {
    //draw white rectangle over old piece
    let bgX = nextTetrominoCoordinateArray[0][0].x;
    let bgY = nextTetrominoCoordinateArray[0][0].y;
    ctx.fillStyle = "white";
    ctx.fillRect(bgX, bgY, (1 + blockDimension + 1) * 4, (1 + blockDimension + 1) * 3);
    for (let i = 0; i < nextTetromino.rotations[0].length; i++) {
        //use [0][ ][ ] for defaultRotation - no need to draw any other kind of rotation for the Next-block view.
        let x = nextTetromino.rotations[0][i][0];
        let y = nextTetromino.rotations[0][i][1];
        let coorX = nextTetrominoCoordinateArray[y][x].x;
        let coorY = nextTetrominoCoordinateArray[y][x].y;
        //draw the square
        ctx.drawImage(nextTetrominoImage, coorX, coorY);
    }
}
function deleteTetromino() {
    //white space needs a bit of a margin to handle non-integer ctx.scale drawing
    let marg = 0.5;
    for (let i = 0; i < exports.curTetromino.rotations[exports.rotationIndex].length; i++) {
        //clear gameBoardArray:
        let x = exports.curTetromino.rotations[exports.rotationIndex][i][0] + exports.startX;
        let y = exports.curTetromino.rotations[exports.rotationIndex][i][1] + exports.startY;
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
    exports.startX = exports.startXDefault;
    exports.startY = exports.startYDefault;
    exports.rotationIndex = 0;
    exports.curTetromino = nextTetromino;
    exports.curTetrominoImage = nextTetrominoImage;
    loadRandomTetrominoIntoNext();
    drawNextTetromino();
}
exports.createTetrominoFromNext = createTetrominoFromNext;
let nextTetromino;
let nextTetrominoImage;
function loadRandomTetrominoIntoNext() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    nextTetromino = tetrominos[randomTetromino];
    console.log(nextTetromino);
    nextTetrominoImage = tetrominoImages[randomTetromino];
}
function checkForCompletedRows() {
    let rowsToDelete = 0;
    for (let y = 0; y < exports.gBArrayHeight; y++) {
        let completed = false;
        if (exports.stoppedShapeArray[y].every((index) => index !== 0)) {
            completed = true;
        }
        if (completed) {
            rowsToDelete++;
            //could add a check here for the greatest y value, then only redraw above that
            for (let i = 0; i < exports.gBArrayWidth; i++) {
                // Update the arrays by zeroing out previously filled squares
                exports.stoppedShapeArray[y][i] = 0;
                gameBoardArray[y][i] = 0;
            }
            //grab the row, clear it out, and add it to the TOP of the array
            let removedRowColors = exports.stoppedShapeArray.splice(y, 1);
            exports.stoppedShapeArray.unshift(...removedRowColors);
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
exports.checkForCompletedRows = checkForCompletedRows;
function updateScores() {
    scoreEl.innerHTML = score.toString();
    linesEl.innerHTML = lines.toString();
    levelEl.innerHTML = level.toString();
}
function rowClearBonus(rows) {
    switch (rows) {
        case 1:
            return 40;
        case 2:
            return 100;
        case 3:
            return 300;
        case 4:
            return 1200;
        default:
            return 0;
    }
}
function redrawRows() {
    // go through all cells in GBArray. Fill in occupied ones w/ image
    for (let row = 0; row < exports.gBArrayHeight; row++) {
        for (let col = 0; col < exports.gBArrayWidth; col++) {
            let coorX = coordinateArray[row][col].x;
            let coorY = coordinateArray[row][col].y;
            let tetColor = exports.stoppedShapeArray[row][col] !== 0 ? exports.stoppedShapeArray[row][col] : undefined;
            if (tetColor) {
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
    }
    else {
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
        const response = await fetch('https://tetris-javascript.onrender.com/highscores');
        const scores = await response.json();
        return scores;
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Error submitting score:', error);
    }
}
//TODO: profanity filter?
//TODO: right align highscores
//TODO: rate limit? https://github.com/tonikv/snake-highscore/blob/master/index.js
//# sourceMappingURL=tetris.js.map