"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.horizontalCollision = exports.verticalCollision = exports.rotationCollision = exports.pieceCollision = void 0;
const tetris_1 = require("./tetris");
//-------------\\
//  COLLISIONS  \\
//---------------\\
function floorCollision(y) {
    return y >= tetris_1.gBArrayHeight;
}
function wallCollision(x) {
    return x > tetris_1.gBArrayWidth - 1 || x < 0;
}
function pieceCollision(x, y) {
    // stoppedShapeArray will hold 0 if unoccupied
    return tetris_1.stoppedShapeArray[y][x] !== 0;
}
exports.pieceCollision = pieceCollision;
// creates a rotated copy and checks if it fits
function rotationCollision(val) {
    // mod: keep index within bounds of array
    let newRotation = tetris_1.rotationIndex + val;
    let tetrominoCopy = tetris_1.curTetromino.rotations[(0, tetris_1.mod)(newRotation, tetris_1.curTetromino.length)];
    let collision = false;
    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + tetris_1.startX;
        let y = square[1] + tetris_1.startY;
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
exports.rotationCollision = rotationCollision;
// create a tetromino copy and see if it fits vertically
function verticalCollision(val) {
    let tetrominoCopy = tetris_1.curTetromino.rotations[tetris_1.rotationIndex];
    let collision = false;
    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + tetris_1.startX;
        let y = square[1] + tetris_1.startY;
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
            let x = square[0] + tetris_1.startX;
            let y = square[1] + tetris_1.startY;
            tetris_1.stoppedShapeArray[y][x] = tetris_1.curTetrominoImage;
        }
        (0, tetris_1.checkForCompletedRows)();
        (0, tetris_1.createTetrominoFromNext)();
        (0, tetris_1.drawCurTetrominoAndCheckGameOver)();
        return true;
    }
    return false;
}
exports.verticalCollision = verticalCollision;
//create a tetromino copy and see if it fits horizontally
function horizontalCollision(val) {
    if (val === 0) {
        return false;
    }
    let tetrominoCopy = tetris_1.curTetromino.rotations[tetris_1.rotationIndex];
    let collision = false;
    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + tetris_1.startX;
        let y = square[1] + tetris_1.startY;
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
exports.horizontalCollision = horizontalCollision;
//# sourceMappingURL=collisions.js.map