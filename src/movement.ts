import { Gamestate } from './tetris'
import { rotationCollision, horizontalCollision, verticalCollision, mod } from './collisions';
import { undrawTetromino, drawCurTetrominoAndCheckGameOver } from './draws';
//-------------\\
//  MOVEMENT    \\
//---------------\\
export let tetSpeeds = { hspeed: 0, vspeed: 0, rspeed: 0 }
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;

export function updateMovement(gamestate): void {
    const {curTetromino, frameCount, downPressAllowed} = gamestate
    if (!curTetromino) return
    //control how fast button "holds" are registered
    if (tetSpeeds.hspeed !== 0) {
        if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
            moveTetrominoHorizontal(gamestate, tetSpeeds.hspeed);
            lastFrameWithHorizontalMovement = frameCount;
        }
    }
    if (tetSpeeds.vspeed !== 0) {
        if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
            if (downPressAllowed) { //disable downpress from carrying over when last piece is placed and new piece spawns
                moveTetrominoDown(gamestate);
                lastFrameWithVerticalMovement = frameCount;
            }
        }
    }
}

export function handleDownPress(): void {
    tetSpeeds.vspeed = 1;
} 

export function rotateTetromino(gamestate, val: number): void {
    const {gameOver} = gamestate
    let {curTetromino} = gamestate
    if (!gameOver) {
        if (!rotationCollision(val)) {
            undrawTetromino(gamestate);
            curTetromino.rotationIndex += val;
            curTetromino.rotationIndex = mod(curTetromino.rotationIndex, curTetromino.rotLength); //keep inside Array bounds
            drawCurTetrominoAndCheckGameOver(gamestate);
        }
    }
}

export function moveTetrominoDown(gamestate): void {
    const {gameOver} = gamestate
    let {curTetromino} = gamestate
    if (!curTetromino) return
    if (!gameOver) {
        if (!verticalCollision(gamestate, 1)) {
            undrawTetromino(gamestate);
            curTetromino.gridY++
            drawCurTetrominoAndCheckGameOver(gamestate);
        }
    }
}

function moveTetrominoHorizontal(gamestate, val: number): void {
    let {curTetromino} = gamestate
    if (!horizontalCollision(val)) {
        undrawTetromino(gamestate);
        curTetromino.gridX += val;
        drawCurTetrominoAndCheckGameOver(gamestate);
    }
}

/*
function debugPosition() {
    for (let i = 0; i < curTetromino.rotations[rotationIndex].length; i++) {
        let square = curTetromino.rotations[rotationIndex][i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        console.log('x: ', x, 'y:', y);
    }
}
*/