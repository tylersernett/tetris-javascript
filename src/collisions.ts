import { gBArrayHeight, gBArrayWidth, stoppedShapeArray, curTetromino, rotationIndex, 
    mod,
    checkForCompletedRows,
    createTetrominoFromNext,
    drawCurTetrominoAndCheckGameOver, } from './tetris'

//-------------\\
//  COLLISIONS  \\
//---------------\\
function floorCollision(y: number): boolean {
    return y >= gBArrayHeight;
}

function wallCollision(x: number): boolean {
    return x > gBArrayWidth - 1 || x < 0;
}

export function pieceCollision(x: number, y: number): boolean {
    // stoppedShapeArray will hold 0 if unoccupied
    return stoppedShapeArray[y][x] !== 0;
}

// creates a rotated copy and checks if it fits
export function rotationCollision(val: number): boolean {
    // mod: keep index within bounds of array
    let newRotation = rotationIndex + val;
    let tetrominoCopy = curTetromino.rotations[mod(newRotation, curTetromino.rotLength)];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square.x + curTetromino.gridX;
        let y = square.y + curTetromino.gridY;
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

// create a tetromino copy and see if it fits vertically
export function verticalCollision(val: number): boolean {
    let tetrominoCopy = curTetromino.rotations[rotationIndex];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square.x + curTetromino.gridX;
        let y = square.y + curTetromino.gridY;

        // moving down: increment y to check for a collison
        y += val;

        // FloorCollision(x, y+1) for immediate stop...leave off +1 for some "sliding"
        if (floorCollision(y) || pieceCollision(x, y)) {
            // always check FloorCollision first, or you may hit array bounds error
            collision = true;
            break;
        }
    }

    if (collision) {
        // place tetromino
        for (let i = 0; i < tetrominoCopy.length; i++) {
            let square = tetrominoCopy[i];
            let x = square.x + curTetromino.gridX;
            let y = square.y + curTetromino.gridY;
            stoppedShapeArray[y][x] = curTetromino.image;
        }
        checkForCompletedRows();
        createTetrominoFromNext();
        drawCurTetrominoAndCheckGameOver();
        return true;
    }

    return false;
}

//create a tetromino copy and see if it fits horizontally
export function horizontalCollision(val: number): boolean {
    if (val === 0) { return false; }
    let tetrominoCopy = curTetromino.rotations[rotationIndex];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square.x + curTetromino.gridX;
        let y = square.y + curTetromino.gridY;
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