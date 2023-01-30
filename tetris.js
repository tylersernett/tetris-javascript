let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let blockDimension = 21;
//initialize 2D array with format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth)).fill(0);

/*  T block: [[1,0],[0,1],[1,1],[2,1]]
    0   1   2   3
0 |   |xxx|   |   |
1 |xxx|xxx|xxx|   |
2 |   |   |   |   |
*/
let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]]

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth)).fill(0);

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
};
let direction;

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//wait for page to load, then run SetupCanvas
document.addEventListener('DOMContentLoaded', SetupCanvas);

//populate coordArray
function CreateCoordArray() {
    let i = 0, j = 0;
    let yTop = 9, yBottom = 446, blockSpacing = 1+blockDimension+1;
    let xLeft = 11, xRight = 264
    for (let y = yTop; y <= yBottom; y += blockSpacing) {
        for (let x = xLeft; x <= xRight; x += blockSpacing) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas () {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvash.height = 956;

    ctx.scale(2,2); //zoom in

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    CreateCoordArray();
    DrawTetromino();
}

function DrawTetromino() {
    for(let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1; //tell gameboard that black is present at coordinates
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, blockDimension, blockDimension);
    }
}