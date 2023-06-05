import { frameCount, downPressAllowed, gameOver, drawCurTetrominoAndCheckGameOver, deleteTetromino, changeRotationIndex, setDownPressAllowed, curTetromino } from './tetris'
import { rotationCollision, horizontalCollision, verticalCollision } from './collisions';
//-------------\\
//  MOVEMENT    \\
//---------------\\
export let tetSpeeds = { hspeed: 0, vspeed: 0, rspeed: 0 }
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;

export function updateMovement(): void {
    //control how fast button "holds" are registered
    if (tetSpeeds.hspeed !== 0) {
        if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
            moveTetrominoHorizontal(tetSpeeds.hspeed);
            lastFrameWithHorizontalMovement = frameCount;
        }
    }
    if (tetSpeeds.vspeed !== 0) {
        if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
            if (downPressAllowed) { //disable downpress from carrying over when last piece is placed and new piece spawns
                moveTetrominoDown();
                lastFrameWithVerticalMovement = frameCount;
            }
        }
    }
}

export function handleKeyPress(keyEvent: KeyboardEvent): void {
    if (!gameOver) { // this check is a bit redundant, can clean up later
        if (keyEvent.key === 'ArrowLeft') {
            tetSpeeds.hspeed = -1;
        } else if (keyEvent.key === 'ArrowRight') {
            tetSpeeds.hspeed = 1;
        } else if (keyEvent.key === 'ArrowDown') {
            handleDownPress();
        } else if (keyEvent.key === 'x') {
            tetSpeeds.rspeed = 1;
            rotateTetromino(1);
        } else if (keyEvent.key === 'z') {
            tetSpeeds.rspeed = -1;
            rotateTetromino(-1);
        }
        // else if (keyEvent.key === 'ArrowUp') {
        //     debugPosition();
        // }
    }
}

export function keyUpHandler(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'ArrowLeft' || keyEvent.key === 'ArrowRight') {
        tetSpeeds.hspeed = 0;
    } else if (keyEvent.key === 'ArrowDown') {
        handleDownRelease();
    } else if (keyEvent.key === 'x' || keyEvent.key === 'z') {
        tetSpeeds.rspeed = 0;
    }
}

export function handleDownPress(): void {
    tetSpeeds.vspeed = 1;
}

export function handleDownRelease(): void {
    tetSpeeds.vspeed = 0;
    setDownPressAllowed(true);
}

export function rotateTetromino(val: number): void {
    if (!gameOver) {
        if (!rotationCollision(val)) {
            deleteTetromino();
            changeRotationIndex(val);
            // rotationIndex += val;
            // rotationIndex = mod(rotationIndex, curTetromino.length); //keep inside Array bounds
            drawCurTetrominoAndCheckGameOver();
        }
    }
}

export function moveTetrominoDown(): void {
    if (!gameOver) {
        if (!verticalCollision(1)) {
            deleteTetromino();
            curTetromino.gridY++
            drawCurTetrominoAndCheckGameOver();
        }
    }
}

function moveTetrominoHorizontal(val: number): void {
    if (!horizontalCollision(val)) {
        deleteTetromino();
        curTetromino.gridX += val;
        drawCurTetrominoAndCheckGameOver();
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