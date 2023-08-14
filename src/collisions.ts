import { gBArrayHeight, gBArrayWidth, checkForCompletedRows } from './tetris'
import { initializeCanvas } from './tetris';

//-------------\\
//  COLLISIONS  \\
//---------------\\
export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

function floorCollision(y: number): boolean {
    return y >= gBArrayHeight;
}

function wallCollision(x: number): boolean {
    return x > gBArrayWidth - 1 || x < 0;
}

export function pieceCollision(gamestate, x: number, y: number): boolean {
    // stoppedShapeArray will hold 0 if unoccupied
    return gamestate.stoppedShapeArray[y][x] !== 0;
}

// creates a rotated copy and checks if it fits
export function rotationCollision(gamestate, val: number): boolean {
    const {curTetromino} = gamestate
    let newRotation = curTetromino.rotationIndex + val;
    let tetrominoCopy = curTetromino.rotations[mod(newRotation, curTetromino.rotLength)];
  
    return tetrominoCopy.some(square => {
      let x = square.x + curTetromino.gridX;
      let y = square.y + curTetromino.gridY;
      return wallCollision(x) || floorCollision(y) || pieceCollision(gamestate, x, y);
    });
  }

// create a tetromino copy and see if it fits vertically
export function verticalCollision(gamestate, val: number): boolean {
    const {curTetromino} = gamestate
    const tetrominoCopy = curTetromino.rotations[curTetromino.rotationIndex];

    const collision = tetrominoCopy.some((square) => {
        const x = square.x + curTetromino.gridX;
        const y = square.y + curTetromino.gridY + val;
        return floorCollision(y) || pieceCollision(gamestate, x, y);
    });

    if (collision) {
        tetrominoCopy.forEach((square) => {
            const x = square.x + curTetromino.gridX;
            const y = square.y + curTetromino.gridY;
            gamestate.stoppedShapeArray[y][x] = curTetromino.image;
        });
        checkForCompletedRows(gamestate);
        return true;
    }

    return false;
}

//create a tetromino copy and see if it fits horizontally
export function horizontalCollision(gamestate, val: number): boolean {
    const {curTetromino} = gamestate
    if (val === 0) { return false; }
    let tetrominoCopy = curTetromino.rotations[curTetromino.rotationIndex];

    // Cycle through all Tetromino square blocks
    return tetrominoCopy.some((square) => {
        const x = square.x + curTetromino.gridX + val;
        const y = square.y + curTetromino.gridY;
        return wallCollision(x) || pieceCollision(gamestate, x, y);
    })
}