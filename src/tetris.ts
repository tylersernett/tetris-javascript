import { drawCurTetrominoAndCheckGameOver, drawNextTetromino, redrawRows, animateFinishedRow } from './draws';
import { displayHighscores, getHighscores, submitScore, toggleHighscores } from './highscores';
import { updateMovement, moveTetrominoDown, rotateTetromino, handleDownPress, tetSpeeds } from './movement'
//webpack imports:\\\\\\\\\\\\
import '../src/style.css';
import '../src/assets/block-i.png';
import '../src/assets/block-j.png';
import '../src/assets/block-l.png';
import '../src/assets/block-s.png';
import '../src/assets/block-sq.png';
import '../src/assets/block-t.png';
import '../src/assets/block-z.png';
////////////////\\\\\\\\\\\\\\\
export let gridXDefault = 4;
export let gridYDefault = 0;
export let gBArrayHeight = 20;
export let gBArrayWidth = 10;
export let blockDimension = 21; let blockMargin = 1;
export let bgColor = '#f8f8f8'; let textColor = 'black';
let frameRate = 60;



//movementConstants: horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
//constants: gBArrayHeight, gBArrayWidth, blockDimension, bgColor, tetrominos
interface Constants {
    gBArrayHeight: number, 
    gBArrayWidth: number,
    blockDimension: number,
    blockMargin: number,
}
export interface Gamestate {
    tetrominos: Tetromino[],
    coordinateArray: (Coordinates)[][], //stores pixel coords 
    gameBoardArray: number[][], //stores currently controlled block & static blocks as filled (1) or empty (0)
    stoppedShapeArray: (number | CanvasImageSource)[][],
    nextTetrominoCoordinateArray: Coordinates[][],
    nextTetromino: Tetromino,
    curTetromino: Tetromino,
    gameOver: boolean,
    scoreData: { show: boolean, score: number, level: number, lines: number }
    ctx: CanvasRenderingContext2D,
    // //move these 3 to a movement/button specific interface?
    frameCount: number
    // tetSpeeds:  { hspeed: number, vspeed: number, rspeed: number }
    downPressAllowed: boolean,
    gameloop: number | null,//NodeJS.Timeout, 
    gravity: ReturnType<typeof setInterval> | undefined,
    gravityFrames: number,
}

//also do
//interface Elements {}
//with all the HTML elements
export interface DOMstate {
     canvasEl: HTMLCanvasElement,
      highscoreOuterEl: HTMLElement,
        highscoreDisplayEl: HTMLElement,
        highscorePromptEl: HTMLElement,
        scoreFormSubmitEl: HTMLButtonElement,
        gameOverEl: HTMLElement,
        nameSubmitEl: HTMLInputElement;
     highscoreButtonEl: HTMLButtonElement,
        restartButtonEl: HTMLButtonElement,
        scoreFormEl: HTMLFormElement,
        scoreEl: HTMLElement,
        linesEl: HTMLElement,
        levelEl: HTMLElement,
     mobileButtonRotCCWEl: HTMLButtonElement,
        mobileButtonRotCWEl: HTMLButtonElement,
        mobileButtonLeft: HTMLButtonElement,
        mobileButtonDown: HTMLButtonElement,
        mobileButtonRight: HTMLButtonElement,
     blockT: HTMLImageElement,
        blockI: HTMLImageElement,
        blockJ: HTMLImageElement,
        blockSQ: HTMLImageElement,
        blockL: HTMLImageElement,
        blockS: HTMLImageElement,
        blockZ: HTMLImageElement,
}

class Coordinates {
    constructor(public x: number, public y: number) { }
}
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
//-------------------\\
//  INITIALIZATION    \\
//---------------------\\
//wait for page to load, then run initializers ... also getHighscores to fire up the server (cheap host takes some seconds to spin up)
document.addEventListener('DOMContentLoaded', () => {
    
    initializeCanvas();

});

export function initializeCanvas(): void {
    let domstate: DOMstate = {
        canvasEl: document.querySelector<HTMLCanvasElement>('#my-canvas')!,
    gameOverEl: document.getElementById('game-over')!,
    highscoreOuterEl: document.getElementById('highscore-outer')!,
    highscoreDisplayEl: document.getElementById('highscore-display')!,
    highscorePromptEl: document.getElementById('highscore-prompt')!,
    highscoreButtonEl: document.querySelector<HTMLButtonElement>('#highscore-button')!,
    restartButtonEl: document.querySelector<HTMLButtonElement>('#restart-button')!,
    scoreFormEl: document.querySelector<HTMLFormElement>('#score-form')!,
    scoreFormSubmitEl: document.querySelector<HTMLButtonElement>('#score-form-submit')!,
    nameSubmitEl: document.querySelector<HTMLInputElement>('#name-submit')!,
    scoreEl: document.getElementById('score')!,
    linesEl: document.getElementById('lines')!,
    levelEl: document.getElementById('level')!,
    mobileButtonRotCCWEl: document.querySelector<HTMLButtonElement>('#rot-ccw')!,
    mobileButtonRotCWEl: document.querySelector<HTMLButtonElement>('#rot-cw')!,
    mobileButtonLeft: document.querySelector<HTMLButtonElement>('#move-left')!,
    mobileButtonDown: document.querySelector<HTMLButtonElement>('#move-down')!,
    mobileButtonRight: document.querySelector<HTMLButtonElement>('#move-right')!,

    blockT: document.querySelector<HTMLImageElement>('#block-t')!,
    blockI: document.querySelector<HTMLImageElement>('#block-i')!,
    blockJ: document.querySelector<HTMLImageElement>('#block-j')!,
    blockSQ: document.querySelector<HTMLImageElement>('#block-sq')!,
    blockL: document.querySelector<HTMLImageElement>('#block-l')!,
    blockS: document.querySelector<HTMLImageElement>('#block-s')!,
    blockZ: document.querySelector<HTMLImageElement>('#block-z')!,
    }
    let gamestate: Gamestate = {
        tetrominos: createTetrominos(domstate),
        coordinateArray: createCoordArrays(),
        nextTetrominoCoordinateArray: createNextTetrominoCoordArrays(),
        gameBoardArray: zeroOutArray(),
        stoppedShapeArray: zeroOutArray(),
        nextTetromino: null,
        curTetromino: null,
        gameOver: false,
        downPressAllowed: true,
        frameCount: 0,
        scoreData: { show: false, score: 0, level: 1, lines: 0 },
        gameloop: null,
        gravity: null,
        gravityFrames: 60,
        ctx: domstate.canvasEl.getContext('2d')!
    }

    function initializeGame(gamestate, domstate): Gamestate{
        let {gameloop, ctx} = gamestate
        let {scoreFormSubmitEl, gameOverEl, highscoreOuterEl, highscorePromptEl, canvasEl} = domstate
        scoreFormSubmitEl.disabled = false;
        
        
        updateScores(gamestate, domstate);
        let updatedGamestate = setGravity(gamestate);
        gameOverEl.style.visibility = "hidden";
        highscoreOuterEl.style.visibility = "hidden";
        highscorePromptEl.style.visibility = "hidden";
        
    
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    
        
        updatedGamestate = loadCurTetrominoFromNext(updatedGamestate);
        clearInterval(gameloop);
        
        return {...updatedGamestate, 
            scoreData: { show: false, score: 0, level: 1, lines: 0 },
            gameOver: false,
            downPressAllowed: true,
            nextTetromino: loadRandomTetrominoIntoNext(updatedGamestate),
            gameloop: setInterval(updateGame, 1000 / frameRate) 
        }
    }
    function defineButtons(gamestate, domstate) {
        let {scoreFormEl, highscoreButtonEl, restartButtonEl, 
            mobileButtonDown, mobileButtonRotCCWEl, mobileButtonRotCWEl, mobileButtonLeft, mobileButtonRight} = domstate

        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', keyUpHandler, false);
        scoreFormEl.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent page refresh
            submitScore(event);
        });
        highscoreButtonEl.onclick = toggleHighscores;
        restartButtonEl.onclick = initializeGame;
        mobileButtonRotCCWEl.onclick = () => rotateTetromino(gamestate, -1);
        mobileButtonRotCWEl.onclick = () => rotateTetromino(gamestate, 1);
        mobileButtonLeft.onpointerdown = () => tetSpeeds.hspeed = -1;
        mobileButtonLeft.onpointerup = () => tetSpeeds.hspeed = 0;
        mobileButtonLeft.onpointerleave = () => tetSpeeds.hspeed = 0;
        mobileButtonDown.onpointerdown = handleDownPress;
        mobileButtonDown.onpointerup = handleDownRelease.bind(null, gamestate);
        mobileButtonDown.onpointerleave = handleDownRelease.bind(null, gamestate);
        mobileButtonRight.onpointerdown = () => tetSpeeds.hspeed = 1;
        mobileButtonRight.onpointerup = () => tetSpeeds.hspeed = 0;
        mobileButtonRight.onpointerleave = () => tetSpeeds.hspeed = 0;
    }
    function handleKeyPress( keyEvent: KeyboardEvent): void {
        let {curTetromino, gameOver} = gamestate
        if (!curTetromino) return
        if (!gameOver) { // this check is a bit redundant, can clean up later
            if (keyEvent.key === 'ArrowLeft') {
                tetSpeeds.hspeed = -1;
            } else if (keyEvent.key === 'ArrowRight') {
                tetSpeeds.hspeed = 1;
            } else if (keyEvent.key === 'ArrowDown') {
                handleDownPress();
            } else if (keyEvent.key === 'x') {
                tetSpeeds.rspeed = 1;
                rotateTetromino(gamestate, 1);
            } else if (keyEvent.key === 'z') {
                tetSpeeds.rspeed = -1;
                rotateTetromino(gamestate, -1);
            }
            // else if (keyEvent.key === 'ArrowUp') {
            //     debugPosition();
            // }
        }
    }
    function keyUpHandler(keyEvent: KeyboardEvent): void {
        if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowRight') {
            tetSpeeds.hspeed = 0;
        } else if (keyEvent.key === 'ArrowDown') {
            handleDownRelease(gamestate);
        } else if (keyEvent.key === 'x' || keyEvent.key === 'z') {
            tetSpeeds.rspeed = 0;
        }
    }
    function handleDownRelease(gamestate: Gamestate): Gamestate {
        tetSpeeds.vspeed = 0;
        // setDownPressAllowed(true);
        return {...gamestate, downPressAllowed: true}
    }
    // assignElements();
    defineButtons(gamestate, domstate);
    defineCanvas(gamestate, domstate);
    // createCoordArrays();
    // createTetrominos();

    initializeGame(gamestate, domstate);
    getHighscores();




const gameConstants: Constants = {
    gBArrayHeight: 20,
    gBArrayWidth: 10,
    blockDimension: 21,
    blockMargin: 1,
}

// function assignElements() {
//     canvasEl = document.querySelector<HTMLCanvasElement>('#my-canvas')!;
//     gameOverEl = document.getElementById('game-over')!;
//     highscoreOuterEl = document.getElementById('highscore-outer')!;
//     highscoreDisplayEl = document.getElementById('highscore-display')!;
//     highscorePromptEl = document.getElementById('highscore-prompt')!;
//     highscoreButtonEl = document.querySelector<HTMLButtonElement>('#highscore-button')!;
//     restartButtonEl = document.querySelector<HTMLButtonElement>('#restart-button')!;
//     scoreFormEl = document.querySelector<HTMLFormElement>('#score-form')!;
//     scoreFormSubmitEl = document.querySelector<HTMLButtonElement>('#score-form-submit')!;
//     nameSubmitEl = document.querySelector<HTMLInputElement>('#name-submit')!;
//     scoreEl = document.getElementById('score')!;
//     linesEl = document.getElementById('lines')!;
//     levelEl = document.getElementById('level')!;
//     mobileButtonRotCCWEl = document.querySelector<HTMLButtonElement>('#rot-ccw')!;
//     mobileButtonRotCWEl = document.querySelector<HTMLButtonElement>('#rot-cw')!;
//     mobileButtonLeft = document.querySelector<HTMLButtonElement>('#move-left')!;
//     mobileButtonDown = document.querySelector<HTMLButtonElement>('#move-down')!;
//     mobileButtonRight = document.querySelector<HTMLButtonElement>('#move-right')!;

//     blockT = document.querySelector<HTMLImageElement>('#block-t')!;
//     blockI = document.querySelector<HTMLImageElement>('#block-i')!;
//     blockJ = document.querySelector<HTMLImageElement>('#block-j')!;
//     blockSQ = document.querySelector<HTMLImageElement>('#block-sq')!;
//     blockL = document.querySelector<HTMLImageElement>('#block-l')!;
//     blockS = document.querySelector<HTMLImageElement>('#block-s')!;
//     blockZ = document.querySelector<HTMLImageElement>('#block-z')!;
// }



let fieldWidth: number;
let fieldHeight: number;
function defineCanvas(gamestate, domstate) {
    // ctx = canvasEl.getContext('2d')!;
    fieldWidth = blockMargin * 4 + (gBArrayWidth * (blockDimension + blockMargin * 2));
    fieldHeight = blockMargin * 2 + (gBArrayHeight * (blockDimension + blockMargin * 2));
    let scale = 1;
    domstate.canvasEl.width = (fieldWidth + (blockDimension + blockMargin * 2) * 5) * scale;
    domstate.canvasEl.height = (5 + fieldHeight) * scale;
    gamestate.ctx.scale(scale, scale);
}

///////  ARRAYS  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


// export let coordinateArray: (Coordinates)[][];//stores pixel coords 
// export let stoppedShapeArray: (number | CanvasImageSource)[][];//stores 'placed' blocks

function zeroOutArray(): number[][] {
    return new Array(gBArrayHeight).fill(0).map(() => new Array(gBArrayWidth).fill(0));
}

// export const nextTetrominoCoordinateArray: Coordinates[][] = Array.from({ length: 3 }, () =>
//     Array.from({ length: 4 }, () => new Coordinates(0, 0))
// );
////////  |||||||  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



const blockSpacing = 1 + blockDimension + 1;
let yTop = 1, xLeft = 3;
function createCoordArrays(): Coordinates[][] {
    // Precompute blockSpacing

    // Reuse coordinateArray if it's already initialized and cleared
    const coordinateArray = Array.from({ length: gBArrayHeight }, (_, row) =>
            Array.from({ length: gBArrayWidth }, (_, col) => new Coordinates(xLeft + blockSpacing * col, yTop + blockSpacing * row))
        );
    
    return coordinateArray
}

function createNextTetrominoCoordArrays(): Coordinates[][] {

    // Precompute nextLeft and nextTop
    const nextLeft = xLeft + 247 - 6;
    const nextTop = yTop + 104;

    // Initialize nextTetrominoCoordinateArray directly with the desired Coordinates
    const nextTetrominoCoordinateArray = Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => new Coordinates(nextLeft + blockSpacing * col, nextTop + blockSpacing * row))
    );
    return nextTetrominoCoordinateArray
}




// let tetrominos: Tetromino[] = createTetrominos();

function createTetrominos(domstate): Tetromino[] {
    /*  T block: [ [[0, 1], [1, 1], [2, 1], [1, 2]], [[rotation2]], [[rotation3]], [[rotation4]] ]
  
                    0   1   2   3
                0 |   |   |   |   |
                1 |xxx|xxx|xxx|   |
                2 |   |xxx|   |   |
                3 |   |   |   |   |
    */
    // T block
    let arr = []
    const {blockT, blockI, blockJ, blockK, blockL, blockSQ, blockS, blockZ} = domstate
    arr.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 1), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockT, "T"));

    // I block
    arr.push(new Tetromino([
        [new Coordinates(0, 2), new Coordinates(1, 2), new Coordinates(2, 2), new Coordinates(3, 2)],
        [new Coordinates(2, 0), new Coordinates(2, 1), new Coordinates(2, 2), new Coordinates(2, 3)]
    ], blockI, "I"));

    // J block
    arr.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(2, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 2), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 0), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockJ, "J"));

    // Square block
    arr.push(new Tetromino([
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 2), new Coordinates(2, 2)]
    ], blockSQ, "sq"));

    // L block
    arr.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 2)],
        [new Coordinates(1, 0), new Coordinates(0, 0), new Coordinates(1, 1), new Coordinates(1, 2)],
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(2, 0)],
        [new Coordinates(1, 0), new Coordinates(2, 2), new Coordinates(1, 1), new Coordinates(1, 2)]
    ], blockL, "L"));

    // S block
    arr.push(new Tetromino([
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(0, 2), new Coordinates(1, 2)],
        [new Coordinates(1, 1), new Coordinates(2, 1), new Coordinates(1, 0), new Coordinates(2, 2)]
    ], blockS, "S"));

    // Z block
    arr.push(new Tetromino([
        [new Coordinates(0, 1), new Coordinates(1, 1), new Coordinates(1, 2), new Coordinates(2, 2)],
        [new Coordinates(2, 0), new Coordinates(1, 1), new Coordinates(1, 2), new Coordinates(2, 1)]
    ], blockZ, "Z"));

    return arr
}


//-------------\\
//  GAME LOGIC  \\
//---------------\\
function updateGame(gamestate, domstate) {
    let {gameOver, frameCount, ctx} = gamestate
    const {canvasEl} = domstate
    if (!gameOver) {
        //clear old canvas
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, fieldWidth, fieldHeight);
        //draw field border
        ctx.strokeStyle = textColor;
        ctx.strokeRect(0 + 0.5, 0 + 0.5, fieldWidth - 1, fieldHeight - 1); //offset by half pixel to prevent transparency issue

        updateMovement(gamestate);
        drawCurTetrominoAndCheckGameOver(gamestate);
        redrawRows(gamestate);
        drawNextTetromino();
        frameCount++;
    }
}





 function setDownPressAllowed(gamestate, bool: boolean): Gamestate {
    return {...gamestate, downPressAllowed: bool}
}



// export let nextTetromino: Tetromino;







}

export function checkForCompletedRows(gamestate): void {
    let {stoppedShapeArray, curTetromino, scoreData} = gamestate
    let rowsToDelete: number[] = [];
    for (let y = 0; y < gBArrayHeight; y++) {
        if (stoppedShapeArray[y].every((index) => index !== 0)) {
            rowsToDelete.push(y);
        }
    }

    const animationsCompleted: number[] = [];
    function handleAnimationComplete(gamestate, row: number): void {
        animationsCompleted.push(row);
        if (animationsCompleted.length === rowsToDelete.length) {
            // All animations are complete, perform subsequent actions
            scoreData.score += rowClearBonus(rowsToDelete.length) * scoreData.level;
            scoreData.lines += rowsToDelete.length;
            scoreData.level = Math.floor(scoreData.lines / 10) + 1;
            setGravity(gamestate);
            updateScores(gamestate, domstate);
            loadCurTetrominoFromNext(gamestate);
            redrawRows(gamestate);
        }
    }

    if (rowsToDelete.length > 0) {
        curTetromino = null
        setGravity(gamestate, -1)
        rowsToDelete.forEach((row) => {
            animateFinishedRow(gamestate, row, () => handleAnimationComplete(gamestate, row));
        });
    } else {
        //if no animation needs to happen, continue...
        loadCurTetrominoFromNext(gamestate);
        drawCurTetrominoAndCheckGameOver(gamestate);
    }
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

function setGravity(gamestate: Gamestate, levelOverride?: number): Gamestate {
    const {scoreData, gameOver, } = gamestate
    let {gravity, gravityFrames} = gamestate
    let newGravityFrames: number;
    const switchValue = levelOverride ? levelOverride : scoreData.level
    switch (switchValue) {
        case -1: newGravityFrames = 999999; break;
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
                moveTetrominoDown(gamestate);
            }
        }, gravitySpeed);
    }
    return {...gamestate, gravity: gravity, gravityFrames: gravityFrames }
}

function updateScores(gamestate, domstate): void {
    let {scoreEl, linesEl, levelEl} = domstate
    const {scoreData} = gamestate;
    scoreEl.innerHTML = scoreData.score.toString();
    linesEl.innerHTML = scoreData.lines.toString();
    levelEl.innerHTML = scoreData.level.toString();
}

function loadCurTetrominoFromNext(gamestate): Gamestate {
    const { nextTetromino} = gamestate
    const curTetromino = {...nextTetromino, gridX: gridXDefault, gridY: gridYDefault, rotationIndex: 0}
    drawNextTetromino();//ff this might be redundant ? I think this already gets called once per gameloop

    return {...gamestate, 
        curTetromino: curTetromino, 
        nextTetromino: loadRandomTetrominoIntoNext(gamestate),
        downPressAllowed: false, //kill downward momentum when new piece spawns
     }
}

function loadRandomTetrominoIntoNext(gamestate): Tetromino {
    const randomTetrominoIndex = Math.floor(Math.random() * gamestate.tetrominos.length);
    const nextTetromino = gamestate.tetrominos[randomTetrominoIndex];
    return nextTetromino
}

export function handleGameOver(gamestate, domstate): Gamestate {
    let {gameOverEl} = domstate
    gameOverEl.style.visibility = "visible";
    displayHighscores(true);
    clearInterval(gamestate.gameloop);
    return {...gamestate, gameOver: true, gameloop: null }
}