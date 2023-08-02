import { pieceCollision } from "./collisions";
import { bgColor, blockDimension, coordinateArray, ctx, curTetromino, gBArrayHeight, gBArrayWidth, gameBoardArray, handleGameOver, nextTetromino, nextTetrominoCoordinateArray, stoppedShapeArray } from "./tetris";

export function drawCurTetrominoAndCheckGameOver(): void {
    if (!curTetromino) return
    const { rotations, rotationIndex, gridX, gridY, image } = curTetromino;
    const currentRotation = rotations[rotationIndex];
    let gameOverCheck = false;

    currentRotation.forEach((square) => {
        const x = square.x + gridX;
        const y = square.y + gridY;
        gameBoardArray[y][x] = 1; // Tell gameboard that block is present at coordinates

        // Draw the square
        const { x: coorX, y: coorY } = coordinateArray[y][x];
        ctx.drawImage(image, coorX, coorY);

        // Check for Game Over -- when two pieces overlap each other
        if (pieceCollision(x, y)) {
            gameOverCheck = true;
        }
    });

    if (gameOverCheck) {
        handleGameOver();
    }
}

export function drawNextTetromino(): void {
    //draw white rectangle over old piece
    let upperLeftX = nextTetrominoCoordinateArray[0][0].x;
    let upperLeftY = nextTetrominoCoordinateArray[0][0].y;
    ctx.fillStyle = "white";
    ctx.fillRect(upperLeftX, upperLeftY, (1 + blockDimension + 1) * 4, (1 + blockDimension + 1) * 3);

    nextTetromino.rotations[0].forEach((square) => {
        const _x = square.x;
        const _y = square.y
        const { x: coorX, y: coorY } = nextTetrominoCoordinateArray[_y][_x];
        ctx.drawImage(nextTetromino.image, coorX, coorY);
    });    
}

export function deleteTetromino(): void {
    //white space needs a bit of a margin to handle non-integer ctx.scale drawing
    let marg = 0.5;
    const currentRotation = curTetromino.rotations[curTetromino.rotationIndex];
    currentRotation.forEach((square) => {
        //clear gameBoardArray:
        let x = square.x + curTetromino.gridX;
        let y = square.y + curTetromino.gridY;
        gameBoardArray[y][x] = 0;
        //undraw:
        let coorX = coordinateArray[y][x].x;
        let coorY = coordinateArray[y][x].y;

        ctx.fillStyle = bgColor;
        ctx.fillRect(coorX - marg, coorY - marg, blockDimension + marg + 2, blockDimension + marg + 2);
    })
}

export function redrawRows(): void {
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

export function animateFinishedRow(row: number, callback: () => void): void {
    const startTime = performance.now();

    function animationLoop(currentTime: number) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / 300, 1); // Progress will be 0 to 1 over 200ms

        // Draw a box from left to right with the given color
        for (let col = 0; col < gBArrayWidth; col++) {
            const coord = coordinateArray[row][col];
            if (coord && gameBoardArray[row][col] === 1) {
                const x = coord.x;
                const y = coord.y;
                const width = blockDimension * progress;
                const height = blockDimension;
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, y, width, height);
            }
        }

        if (progress < 1) {
            requestAnimationFrame(animationLoop);
        } else {
            // Animation complete, reset the row values to 0
            for (let col = 0; col < gBArrayWidth; col++) {
                if (gameBoardArray[row][col] === 1) {
                    gameBoardArray[row][col] = 0;
                    stoppedShapeArray[row][col] = 0;
                }
            }
            //grab the row, clear it out, and add it to the TOP of the array
            let removedRowImages = stoppedShapeArray.splice(row, 1);
            stoppedShapeArray.unshift(...removedRowImages);
            let removedRowGBA = gameBoardArray.splice(row, 1);
            gameBoardArray.unshift(...removedRowGBA);
            callback();
        }
    }
    requestAnimationFrame(animationLoop);
}