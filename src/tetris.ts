import { pieceCollision, } from './collisions';

import { updateMovement, handleKeyPress, keyUpHandler, moveTetrominoDown, rotateTetromino, handleDownPress, handleDownRelease, tetSpeeds } from './movement'

export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}
//-------------------\\
//  INITIALIZATION    \\
//---------------------\\
//wait for page to load, then run initializers ... also getHighscores to fire up the server (cheap host takes some seconds to spin up)
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeGame();
    getHighscores();
});

let canvasEl: HTMLCanvasElement,
    highscoreOuterEl: HTMLElement,
    highscoreDisplayEl: HTMLElement,
    highscorePromptEl: HTMLElement,
    highscoreButtonEl: HTMLButtonElement,
    restartButtonEl: HTMLButtonElement,
    scoreFormEl: HTMLFormElement,
    scoreFormSubmitEl: HTMLButtonElement,
    gameOverEl: HTMLElement,
    scoreEl: HTMLElement,
    linesEl: HTMLElement,
    levelEl: HTMLElement,
    nameSubmitEl: HTMLInputElement,
    mobileButtonRotCCWEl: HTMLButtonElement,
    mobileButtonRotCWEl: HTMLButtonElement,
    mobileButtonLeft: HTMLButtonElement,
    mobileButtonDown: HTMLButtonElement,
    mobileButtonRight: HTMLButtonElement;
let blockT: HTMLImageElement,
    blockI: HTMLImageElement,
    blockJ: HTMLImageElement,
    blockSQ: HTMLImageElement,
    blockL: HTMLImageElement,
    blockS: HTMLImageElement,
    blockZ: HTMLImageElement;
let tetrominoImages: HTMLImageElement[];

function assignElements() {
    canvasEl = document.querySelector<HTMLCanvasElement>('#my-canvas')!;
    gameOverEl = document.getElementById('game-over')!;
    highscoreOuterEl = document.getElementById('highscore-outer')!;
    highscoreDisplayEl = document.getElementById('highscore-display')!;
    highscorePromptEl = document.getElementById('highscore-prompt')!;
    highscoreButtonEl = document.querySelector<HTMLButtonElement>('#highscore-button')!;
    restartButtonEl = document.querySelector<HTMLButtonElement>('#restart-button')!;
    scoreFormEl = document.querySelector<HTMLFormElement>('#score-form')!;
    scoreFormSubmitEl = document.querySelector<HTMLButtonElement>('#score-form-submit')!;
    nameSubmitEl = document.querySelector<HTMLInputElement>('#name-submit')!;
    scoreEl = document.getElementById('score')!;
    linesEl = document.getElementById('lines')!;
    levelEl = document.getElementById('level')!;
    mobileButtonRotCCWEl = document.querySelector<HTMLButtonElement>('#rot-ccw')!;
    mobileButtonRotCWEl = document.querySelector<HTMLButtonElement>('#rot-cw')!;
    mobileButtonLeft = document.querySelector<HTMLButtonElement>('#move-left')!;
    mobileButtonDown = document.querySelector<HTMLButtonElement>('#move-down')!;
    mobileButtonRight = document.querySelector<HTMLButtonElement>('#move-right')!;

    blockT = document.querySelector<HTMLImageElement>('#block-t')!;
    blockI = document.querySelector<HTMLImageElement>('#block-i')!;
    blockJ = document.querySelector<HTMLImageElement>('#block-j')!;
    blockSQ = document.querySelector<HTMLImageElement>('#block-sq')!;
    blockL = document.querySelector<HTMLImageElement>('#block-l')!;
    blockS = document.querySelector<HTMLImageElement>('#block-s')!;
    blockZ = document.querySelector<HTMLImageElement>('#block-z')!;
    tetrominoImages = [blockT, blockI, blockJ, blockSQ, blockL, blockS, blockZ];
}


///////  ARRAYS  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
class Coordinates {
    constructor(public x: number, public y: number) { }
}
export let gBArrayHeight = 20;
export let gBArrayWidth = 10;
let coordinateArray: (Coordinates)[][];//stores pixel coords 
let gameBoardArray: number[][]; //stores currently controlled block & static blocks as filled (1) or empty (0)
export let stoppedShapeArray: (number | CanvasImageSource)[][];//stores 'placed' blocks

function zeroOutArray(arr: (CanvasImageSource | number | string)[][]): number[][] {
    return new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
}

const nextTetrominoCoordinateArray: Coordinates[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 4 }, () => new Coordinates(0, 0))
);
////////  |||||||  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let ctx: CanvasRenderingContext2D;
let fieldWidth: number;
let fieldHeight: number;

function initializeCanvas(): void {
    assignElements();

    ctx = canvasEl.getContext('2d')!;
    fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2));
    fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2));
    let scale = 1;
    canvasEl.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvasEl.height = (5 + fieldHeight) * scale;
    ctx.scale(scale, scale);

    createCoordArrays();
    createTetrominos();
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', keyUpHandler, false);
    scoreFormEl.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally
        submitScore(event);
    });
    highscoreButtonEl.onclick = toggleHighscores;
    restartButtonEl.onclick = initializeGame;
    mobileButtonRotCCWEl.onclick = () => rotateTetromino(-1);
    mobileButtonRotCWEl.onclick = () => rotateTetromino(1);
    mobileButtonLeft.onpointerdown = () => tetSpeeds.hspeed = -1;
    mobileButtonLeft.onpointerup = () => tetSpeeds.hspeed = 0;
    mobileButtonLeft.onpointerleave = () => tetSpeeds.hspeed = 0;
    mobileButtonDown.onpointerdown = handleDownPress;
    mobileButtonDown.onpointerup = handleDownRelease;
    mobileButtonDown.onpointerleave = handleDownRelease;
    mobileButtonRight.onpointerdown = () => tetSpeeds.hspeed = 1;
    mobileButtonRight.onpointerup = () => tetSpeeds.hspeed = 0;
    mobileButtonRight.onpointerleave = () => tetSpeeds.hspeed = 0;
}

let blockDimension = 21, blockMargin = 1;

function createCoordArrays(): void {
    //coordinateArray = zeroOutArray(coordinateArray);
    coordinateArray = Array.from({ length: gBArrayHeight }, () =>
        Array.from({ length: gBArrayWidth }, () => new Coordinates(0, 0))
    );
    let yTop = 1,
        xLeft = 3,
        blockSpacing = 1 + blockDimension + 1;
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            coordinateArray[row][col] = new Coordinates(xLeft + blockSpacing * col, yTop + blockSpacing * row);
        }
    }
    let nextLeft = xLeft + 247 - 6,
        nextTop = yTop + 104;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            nextTetrominoCoordinateArray[row][col] = new Coordinates(nextLeft + blockSpacing * col, nextTop + blockSpacing * row);
        }
    }
}

//TODO: refactor tetromino class...
//tetromino.rotation[rotationIndex][block#][0:x, 1:y]
//name "i, j, l, etc"
//img
class Tetromino {
    constructor(public rotations: number[][][]) { }

    get rotLength(): number {
        return this.rotations?.length || 0;
    }

    getSecondArrayLength(): number {
        return this.rotations[0]?.length || 0;
    }
}

let tetrominos: Tetromino[] = [];

function createTetrominos(): void {
    /*  T block: [ [[0, 1], [1, 1], [2, 1], [1, 2]], [[rotation2]], [[rotation3]], [[rotation4]] ]

                    0   1   2   3
                0 |   |   |   |   |
                1 |xxx|xxx|xxx|   |
                2 |   |xxx|   |   |
                3 |   |   |   |   |
    */
    // T block
    tetrominos.push(
        new Tetromino([
            [[0, 1], [1, 1], [2, 1], [1, 2]],
            [[1, 0], [0, 1], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [1, 0]],
            [[1, 0], [2, 1], [1, 1], [1, 2]],
        ])
    );

    // I block
    tetrominos.push(
        new Tetromino([
            [[0, 2], [1, 2], [2, 2], [3, 2]],
            [[2, 0], [2, 1], [2, 2], [2, 3]],
        ])
    );

    // J block
    tetrominos.push(
        new Tetromino([
            [[0, 1], [1, 1], [2, 1], [2, 2]],
            [[1, 0], [0, 2], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [0, 0]],
            [[1, 0], [2, 0], [1, 1], [1, 2]],
        ])
    );

    // Square block
    tetrominos.push(
        new Tetromino([
            [[1, 1], [2, 1], [1, 2], [2, 2]],
        ])
    );

    // L block
    tetrominos.push(
        new Tetromino([
            [[0, 1], [1, 1], [2, 1], [0, 2]],
            [[1, 0], [0, 0], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [2, 0]],
            [[1, 0], [2, 2], [1, 1], [1, 2]],
        ])
    );

    // S block
    tetrominos.push(
        new Tetromino([
            [[1, 1], [2, 1], [0, 2], [1, 2]],
            [[1, 1], [2, 1], [1, 0], [2, 2]],
        ])
    );

    // Z block
    tetrominos.push(
        new Tetromino([
            [[0, 1], [1, 1], [1, 2], [2, 2]],
            [[2, 0], [1, 1], [1, 2], [2, 1]],
        ])
    );
}

export let startXDefault = 4, startX = startXDefault;
export let startYDefault = 0, startY = startYDefault;
let score = 0, level = 1, lines = 0;
export let gameOver = false
let showHighscores = false;
let gameloop: NodeJS.Timeout, gravity: ReturnType<typeof setInterval> | undefined, framerate: number;
let bgColor = '#f8f8f8', textColor = 'black';
export let downPressAllowed: boolean;
export let rotationIndex = 0;

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
    startX = startXDefault;
    startY = startYDefault;
    gameOverEl.style.visibility = "hidden";
    highscoreOuterEl.style.visibility = "hidden";
    highscorePromptEl.style.visibility = "hidden";
    gameBoardArray = zeroOutArray(gameBoardArray);
    stoppedShapeArray = zeroOutArray(stoppedShapeArray);

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    loadRandomTetrominoIntoNext();
    createTetrominoFromNext();
    downPressAllowed = true;
    clearInterval(gameloop);
    gameloop = setInterval(updateGame, 1000 / framerate);
}

export let frameCount = 0;

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

function setGravity(): void {
    let newFrames: number;
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
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29: newFrames = 2; break;
        default: newFrames = 1; break;
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
//maybe cleaner if these were properties of an object instead of standalone vars mod'd by a function
//TODO: move draw functions to own file? need access to ctx, gameover, gameboardarray
export function changeStartX(val: number): void {
    startX += val;
}

export function incrementStartY(): void {
    startY++;
}

export function changeRotationIndex(val: number): void {
    rotationIndex += val;
    rotationIndex = mod(rotationIndex, curTetromino.rotLength); //keep inside Array bounds
}

export function setDownPressAllowed(bool: boolean): void {
    downPressAllowed = bool;
}

export function drawCurTetrominoAndCheckGameOver(): void {
    let gameOverCheck = false;
    for (let i = 0; i < curTetromino.rotations[rotationIndex].length; i++) {
        let x = curTetromino.rotations[rotationIndex][i][0] + startX;
        let y = curTetromino.rotations[rotationIndex][i][1] + startY;
        gameBoardArray[y][x] = 1; //tell gameboard that block is present at coordinates

        //transcribe xy info to coordinateArray pixels
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;
        //draw the square
        ctx.drawImage(curTetrominoImage, coorX, coorY)
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

function drawNextTetromino(): void {
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

export function deleteTetromino(): void {
    //white space needs a bit of a margin to handle non-integer ctx.scale drawing
    let marg = 0.5;
    for (let i = 0; i < curTetromino.rotations[rotationIndex].length; i++) {
        //clear gameBoardArray:
        let x = curTetromino.rotations[rotationIndex][i][0] + startX;
        let y = curTetromino.rotations[rotationIndex][i][1] + startY;
        gameBoardArray[y][x] = 0;
        //undraw:
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;

        ctx.fillStyle = bgColor;
        ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
    }
}

export let curTetromino: Tetromino;//number[][][] = [];
export let curTetrominoImage: CanvasImageSource;
//TODO:curTetrominoProps {startX: , startY: , rotationIndex: , image: ,}
export function createTetrominoFromNext(): void {
    downPressAllowed = false; //kill downward momentum when new piece spawns
    startX = startXDefault;
    startY = startYDefault;
    rotationIndex = 0;
    curTetromino = nextTetromino;
    curTetrominoImage = nextTetrominoImage;
    loadRandomTetrominoIntoNext();
    drawNextTetromino();
}

let nextTetromino: Tetromino;
let nextTetrominoImage: CanvasImageSource;
function loadRandomTetrominoIntoNext(): void {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    nextTetromino = tetrominos[randomTetromino];
    console.log("next", nextTetromino)
    nextTetrominoImage = tetrominoImages[randomTetromino];
}

export function checkForCompletedRows(): void {
    let rowsToDelete = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = false;
        if (stoppedShapeArray[y].every((index) => index !== 0)) {
            completed = true;
        }

        if (completed) {
            rowsToDelete++;
            //could add a check here for the greatest y value, then only redraw above that
            for (let i = 0; i < gBArrayWidth; i++) {
                // Update the arrays by zeroing out previously filled squares
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

function updateScores(): void {
    scoreEl.innerHTML = score.toString();
    linesEl.innerHTML = lines.toString();
    levelEl.innerHTML = level.toString();
}

function rowClearBonus(rows: number): number {
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

function redrawRows(): void {
    // go through all cells in GBArray. Fill in occupied ones w/ image
    for (let row = 0; row < gBArrayHeight; row++) {
        for (let col = 0; col < gBArrayWidth; col++) {
            let coorX = coordinateArray[row][col].x;
            let coorY = coordinateArray[row][col].y;
            let tetImgSource = stoppedShapeArray[row][col] !== 0 ? stoppedShapeArray[row][col] as CanvasImageSource : undefined;
            if (tetImgSource) {
                ctx.drawImage(tetImgSource, coorX, coorY);
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

async function displayHighscores(checkNewScore: boolean) {
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

async function submitScore(event: Event) {
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