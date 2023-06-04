import {frameCount, downPressAllowed, gameOver, drawCurTetrominoAndCheckGameOver, deleteTetromino, changeStartX, incrementStartY, changeRotationIndex, setDownPressAllowed} from './tetris'
import { rotationCollision, horizontalCollision, verticalCollision } from './collisions';
//-------------\\
//  MOVEMENT    \\
//---------------\\
let hspeed = 0, vspeed = 0, rspeed = 0
let horizontalMovementLimit = 6, verticalMovementLimit = 2, rotationMovementLimit = 6;
let lastFrameWithHorizontalMovement = -horizontalMovementLimit;
let lastFrameWithVerticalMovement = -verticalMovementLimit;

export function updateMovement(): void {
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

export function handleKeyPress(key: KeyboardEvent): void {
    if (!gameOver) { // this check is a bit redundant, can clean up later
        if (key.keyCode === 37) { // left arrow
            hspeed = -1;
        } else if (key.keyCode === 39) { // right arrow
            hspeed = 1;
        } else if (key.keyCode === 40) { // down arrow
            handleDownPress();
        } else if (key.keyCode === 88) { //x
            rspeed = 1;
            rotateTetromino(1);
        } else if (key.keyCode === 90) { //z
            rspeed = -1;
            rotateTetromino(-1);
        }
        // else if (key.keyCode === 38) { // up arrow
        //     debugPosition();
        // }
    }
}

export function keyUpHandler(key: KeyboardEvent): void {
    if (key.keyCode === 37 || key.keyCode === 39) { //left or right arrow
        hspeed = 0;
    } else if (key.keyCode === 40) { //down arrow
        handleDownRelease();
    } else if (key.keyCode === 88 || key.keyCode === 90) { //x or z
        rspeed = 0;
    }
}

function handleDownPress(): void {
    vspeed = 1;
}

function handleDownRelease(): void {
    vspeed = 0;
    setDownPressAllowed(true);
}

function rotateTetromino(val: number): void {
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
            // startY++;
            incrementStartY();
            drawCurTetrominoAndCheckGameOver();
        }
    }
}

function moveTetrominoHorizontal(val: number): void {
    if (!horizontalCollision(val)) {
        deleteTetromino();
        changeStartX(val);
        // startX += val;
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

