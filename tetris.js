let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
//initialize 2D array with format [[{x:111, y:222}], [{x:, y:}], [{x:, y:}]...]...
let coordinateArray = [...Array(gBArrayHeight)].map(() => Array(gBArrayWidth)).fill(0);

/*  T block: [[1,0],[0,1],[1,1],[2,1]]
    0   1   2   3
0 |   |xxx|   |   |
1 |xxx|xxx|xxx|   |
2 |   |   |   |   |
*/
let curTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]]

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
    let yTop = 9, yBottom = 446, blockWidth = 23;
    let xLeft = 11, xRight = 264
    for (let y = yTop; y <= yBottom; y += blockWidth) {
        for (let x = xLeft; x <= xRight; x += blockWidth) {
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
}