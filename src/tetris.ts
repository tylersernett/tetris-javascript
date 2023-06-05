import { drawCurTetrominoAndCheckGameOver, drawNextTetromino, redrawRows } from './draws';
import { displayHighscores, getHighscores, submitScore, toggleHighscores } from './highscores';
import { updateMovement, handleKeyPress, keyUpHandler, moveTetrominoDown, rotateTetromino, handleDownPress, handleDownRelease, tetSpeeds } from './movement'

//-------------------\\
//  INITIALIZATION    \\
//---------------------\\
//wait for page to load, then run initializers ... also getHighscores to fire up the server (cheap host takes some seconds to spin up)
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeGame();
    getHighscores();
});

let canvasEl: HTMLCanvasElement;
export let highscoreOuterEl: HTMLElement,
    highscoreDisplayEl: HTMLElement,
    highscorePromptEl: HTMLElement,
    scoreFormSubmitEl: HTMLButtonElement,
    gameOverEl: HTMLElement,
    nameSubmitEl: HTMLInputElement;
let highscoreButtonEl: HTMLButtonElement,
    restartButtonEl: HTMLButtonElement,
    scoreFormEl: HTMLFormElement,
    scoreEl: HTMLElement,
    linesEl: HTMLElement,
    levelEl: HTMLElement;
let mobileButtonRotCCWEl: HTMLButtonElement,
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
}

function defineButtons() {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', keyUpHandler, false);
    scoreFormEl.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page refresh
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

export let ctx: CanvasRenderingContext2D;
let fieldWidth: number;
let fieldHeight: number;
export let blockDimension = 21; let blockMargin = 1;
function defineCanvas() {
    ctx = canvasEl.getContext('2d')!;
    fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2));
    fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2));
    let scale = 1;
    canvasEl.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    canvasEl.height = (5 + fieldHeight) * scale;
    ctx.scale(scale, scale);
}

///////  ARRAYS  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
class Coordinates {
    constructor(public x: number, public y: number) { }
}
export let gBArrayHeight = 20;
export let gBArrayWidth = 10;
export let coordinateArray: (Coordinates)[][];//stores pixel coords 
export let gameBoardArray: number[][]; //stores currently controlled block & static blocks as filled (1) or empty (0)
export let stoppedShapeArray: (number | CanvasImageSource)[][];//stores 'placed' blocks

function zeroOutArray(arr: (CanvasImageSource | number | string)[][]): number[][] {
    return new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
}

export const nextTetrominoCoordinateArray: Coordinates[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 4 }, () => new Coordinates(0, 0))
);
////////  |||||||  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function initializeCanvas(): void {
    assignElements();
    defineButtons();
    defineCanvas();
    createCoordArrays();
    createTetrominos();
}

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

export let gridXDefault = 4;
export let gridYDefault = 0;
class Tetromino {
    constructor(public rotations: Coordinates[][],
        public image: CanvasImageSource,
        public name: String,
        public rotationIndex: number = 0,
        public gridX: number = gridXDefault,
        public gridY: number = gridYDefault) { }

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
    tetrominos.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 1), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockT, "T"));

    // I block
    tetrominos.push(new Tetromino([
        [new Coordinates(0, 2), new Coordinates(1, 2), new Coordinates(2, 2), new Coordinates(3, 2)],
        [new Coordinates(2, 0), new Coordinates(2, 1), new Coordinates(2, 2), new Coordinates(2, 3)]
    ], blockI, "I"));

    // J block
    tetrominos.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(2, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 2), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 0), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockJ, "J"));

    // Square block
    tetrominos.push(new Tetromino([
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 2), new Coordinates(2, 2)]
    ], blockSQ, "sq"));

    // L block
    tetrominos.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 0), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(2, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 2), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockL, "L"));

    // S block
    tetrominos.push(new Tetromino([
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 2), new Coordinates(1, 2)],
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 0), new Coordinates(2, 2)]
    ], blockS, "S"));

    // Z block
    tetrominos.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(1, 2), new Coordinates(2, 2)],
        [new Coordinates(2, 0), new Coordinates(1, 1), new Coordinates(1, 2), new Coordinates(2, 1)]
    ], blockZ, "Z"));
}

export let scoreData = { show: false, score: 0, level: 1, lines: 0 }
export let gameOver = false
let gameloop: NodeJS.Timeout, gravity: ReturnType<typeof setInterval> | undefined, gravityFrames: number;
let frameRate = 60;
export let bgColor = '#f8f8f8'; let textColor = 'black';
export let downPressAllowed: boolean;

function initializeGame() {
    scoreFormSubmitEl.disabled = false;
    scoreData = { show: false, score: 0, level: 1, lines: 0 }
    gameOver = false;
    updateScores();
    gravityFrames = 60;
    setGravity();
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
    gameloop = setInterval(updateGame, 1000 / frameRate);
}

//-------------\\
//  GAME LOGIC  \\
//---------------\\
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
    let newGravityFrames: number;
    switch (scoreData.level) {
        case 1: newGravityFrames = 48; break;
        case 2: newGravityFrames = 43; break;
        case 3: newGravityFrames = 38; break;
        case 4: newGravityFrames = 33; break;
        case 5: newGravityFrames = 28; break;
        case 6: newGravityFrames = 23; break;
        case 7: newGravityFrames = 18; break;
        case 8: newGravityFrames = 13; break;
        case 9: newGravityFrames = 8; break;
        case 10: newGravityFrames = 6; break;
        case 11:
        case 12:
        case 13: newGravityFrames = 5; break;
        case 14:
        case 15:
        case 16: newGravityFrames = 4; break;
        case 17:
        case 18:
        case 19: newGravityFrames = 3; break;
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29: newGravityFrames = 2; break;
        default: newGravityFrames = 2; break;
    }

    //only update the interval when there's a new speed
    if (gravityFrames !== newGravityFrames) {
        gravityFrames = newGravityFrames;
        let gravitySpeed = (newGravityFrames / frameRate) * 1000;
        clearInterval(gravity);
        gravity = setInterval(() => {
            if (!gameOver) {
                moveTetrominoDown();
            }
        }, gravitySpeed);
    }
}

export function handleGameOver(): void {
    gameOver = true;
    gameOverEl.style.visibility = "visible";
    displayHighscores(true);
    clearInterval(gameloop);
}

export function setDownPressAllowed(bool: boolean): void {
    downPressAllowed = bool;
}

export let curTetromino: Tetromino;//number[][][] = [];
export function createTetrominoFromNext(): void {
    downPressAllowed = false; //kill downward momentum when new piece spawns
    curTetromino = nextTetromino;
    curTetromino.gridX = gridXDefault;
    curTetromino.gridY = gridYDefault;
    curTetromino.rotationIndex = 0;
    loadRandomTetrominoIntoNext();
    drawNextTetromino();
}

export let nextTetromino: Tetromino;
function loadRandomTetrominoIntoNext(): void {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    nextTetromino = tetrominos[randomTetromino];
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
            for (let x = 0; x < gBArrayWidth; x++) {
                // Update the arrays by zeroing out previously filled squares
                stoppedShapeArray[y][x] = 0;
                gameBoardArray[y][x] = 0;
            }
            //grab the row, clear it out, and add it to the TOP of the array
            let removedRowImages = stoppedShapeArray.splice(y, 1);
            stoppedShapeArray.unshift(...removedRowImages);
            let removedRowGBA = gameBoardArray.splice(y, 1);
            gameBoardArray.unshift(...removedRowGBA);
        }
    }
    if (rowsToDelete > 0) {
        scoreData.score += rowClearBonus(rowsToDelete) * scoreData.level;
        scoreData.lines += rowsToDelete;
        scoreData.level = Math.floor(scoreData.lines / 10) + 1;
        setGravity();
        updateScores();
        redrawRows();
    }
}

function updateScores(): void {
    scoreEl.innerHTML = scoreData.score.toString();
    linesEl.innerHTML = scoreData.lines.toString();
    levelEl.innerHTML = scoreData.level.toString();
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