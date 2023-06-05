# TypeScript Tetris
A color-blind accessible port of the NES classic built with vanilla TypeScript and minimalist design.
## Notes: Collision Checking

Problem: pieces will often clip through walls, floors, or other pieces when rotated
Solution:
 - create copy of tetromino
 - rotate the copy into potential new position
 - check if it actually fits
 - if so, tell original piece to rotate
 - else, do not allow rotation

```js
//creates a rotated copy and checks if it fits
function rotationCollision(val) {
    //mod function: keep index within bounds of array
    let newRotation = rotation + val;
    let tetrominoCopy = curTetromino[mod(newRotation, curTetromino.length)];
    let collision = false;

    // Cycle through all Tetromino square blocks
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (wallCollision(x)) {
            collision = true;
            console.log('rot col wall')
            break;
        }
        if (floorCollision(y)) {
            collision = true;
            console.log('rot col floor')
            break;
        }
        if (pieceCollision(x, y)) {
            collision = true;
            console.log('rot col piece')
            break;
        }
    }
    return collision;
}
```
### Return Value
- `collision` (boolean): `true` if a collision occurs, `false` otherwise.

### Function Flow
1. Calculate the new rotation by adding `val` to the current rotation (this determines its place in the rotation array).
2. Use the `mod` function to ensure that the new rotation angle stays within the bounds of the `curTetromino` array.
3. Create a copy of the tetromino shape at the new rotation angle (`tetrominoCopy`).
4. Initialize a variable `collision` to `false`.
5. Iterate through each square block of the tetromino shape (`tetrominoCopy`).
6. Calculate the coordinates (`x` and `y`) of the current square block by adding the block's position to the `startX` and `startY` values.
7. Check for collisions in the following order:
   - Check if a wall collision occurs by calling the `wallCollision(x)` function.
   - Check if a floor collision occurs by calling the `floorCollision(y)` function.
   - Check if a collision with other pieces occurs by calling the `pieceCollision(x, y)` function.
8. If any collision occurs, set `collision` to `true`, log the type of collision, and break out of the loop. Otherwise, the rotation is valid and `collision` will remain `false`.
9. Return the value of `collision`.

 ## Notes: Line clear algorithm
Original line clear algo only checked consecutive lines...but you could have a gap! (i.e. the top and bottom line in a four row chunk may be complete, but the two middle lines are not)

 solution:
 - check lines individually
 - if line needs clear, zero out array, then unshift it up to top of gameboard
 - then redraw gameboard

```js
function checkForCompletedRows() {
    let rowsToDelete = 0;
    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = false;
        if (stoppedShapeArray[y].every(index => index !== 0)) {
            completed = true;
        }

        if (completed) {
            rowsToDelete++;
            //could add a check here for the greatest y value, then only redraw above that
            for (let i = 0; i < gBArrayWidth; i++) {
                // Update the arrays by zero'ing out previously filled squares
                stoppedShapeArray[y][i] = 0;
                gameBoardArray[y][i] = 0;
            }
            //grab the row, clear it out, and add it to the TOP of the array
            let removedRowColors = stoppedShapeArray.splice(y, 1);
            stoppedShapeArray.unshift(...removedRowColors);
            let removedRowGBA = gameBoardArray.splice(y, 1);
            gameBoardArray.unshift(...removedRowGBA);
        }
    }
    if (rowsToDelete > 0) {
        score += rowClearBonus(rowsToDelete) * level;
        lines += rowsToDelete;
        level = Math.floor(lines / 10) + 1;
        setGravity();
        updateScores();
        redrawRows();
    }
    console.log('check completion', stoppedShapeArray)
}
```

This function checks if there are any completed rows in the game board array and performs necessary actions for row completion.

### Function Flow
1. Initialize a variable `rowsToDelete` to keep track of the number of rows to be deleted.
2. Iterate through each row (`y`) of the game board array.
3. Set a flag `completed` to `false` initially.
4. Check if the current row (`stoppedShapeArray[y]`) is completed by using the `every` method to ensure that every element of the row is not equal to `0`.
5. If the row is completed, set `completed` to `true`.
6. If the row is completed:
   - Increment `rowsToDelete` by 1.
   - Zero out the previously filled squares in both `stoppedShapeArray` and `gameBoardArray` for the current row (`y`).
   - Splice the completed row from `stoppedShapeArray` and add it to the top of the array using `unshift`.
   - Splice the corresponding row from `gameBoardArray` and add it to the top of the array using `unshift`.
7. If `rowsToDelete` is greater than 0:
   - Update the score by adding the points earned from clearing the rows (`rowClearBonus(rowsToDelete) * level`).
   - Update the total lines cleared (`lines`) by adding `rowsToDelete`.
   - Calculate the current level based on the total lines cleared (`Math.floor(lines / 10) + 1`).
   - Adjust the gravity based on the current level using the `setGravity()` function.
   - Update the scores displayed on the UI using the `updateScores()` function.
   - Redraw the rows on the game board using the `redrawRows()` function.

 ## Notes: Key 'hold' not registered
Problem: holding down a key is clunky, there is an initial delay, and the game won't handle multiple presses.
Solution: use a game loop to move away from default browser keypress behavior.

```js
gameloop = setInterval(UpdateGame, 1000 / frames);
```

```js
function updateGame() {
    if (!gameOver) {
        //clear old canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, fieldWidth, fieldHeight)
        //draw field border
        ctx.strokeStyle = textColor;
        ctx.strokeRect(0 + 0.5, 0 + 0.5, fieldWidth - 1, fieldHeight - 1); //offset by half pixel to prevent transparency issue

        updateMovement();
        drawCurTetrominoAndCheckGameOver();
        redrawRows();
        drawNextTetromino();
        frameCount++;
    }
}
```
## Notes: Key presses
 issue: keys are rapid-firing and registering way too fast
 solution: introduce frameCount variable to control how often keypresses are registered
```js
//control how fast button "holds" are registered
if (hspeed != 0) {
    if (frameCount - lastFrameWithHorizontalMovement >= horizontalMovementLimit) {
        moveTetrominoHoriztonal(hspeed);
        lastFrameWithHorizontalMovement = frameCount;
    }
}
if (vspeed != 0) {
    if (frameCount - lastFrameWithVerticalMovement >= verticalMovementLimit) {
        if (downPressAllowed) { //disable downpress from carrying over when last piece is placed and new piece spawns
            moveTetrominoDown();
            lastFrameWithVerticalMovement = frameCount;
        }
    }
}
```


 ## Notes: Highscore Database
 - install node, mongodb, mongoose, dotenv
 - require the above at the top of server.js
 - connect to DB
 - create Mongoose Schema

connect:
```javascript
 async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB")
        app.listen(
            PORT,
            () => console.log(`server listening on port ${PORT}`)
        );
    } catch (err) {
        console.error(err)
    }
}
```

Schema:
```javascript
const Schema = mongoose.Schema;
const scoreSchema = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    lines: { type: Number, required: true },
    level: { type: Number, required: true },
}, { timestamps: true });
const Highscore = mongoose.model('Highscore', scoreSchema);
```

Middleware:
```javascript
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
```

POST:
```javascript
fetch("http://localhost:8080/add-score", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({msg: "help"}),
})
```
In the above, make sure to include headers and use stringify!

## Notes: Webpack

npx webpack --config webpack.config.js

change tsconfig output:
"outDir": "./dist",

change HTML script:
```html
    <!-- <link rel="stylesheet" type="text/css" href="style.css"> -->
    <!-- <script src="./dist/bundle.js"></script> -->
```
Webpack will handle injecting the CSS and bundle, so don't reference them in the index.HTML