# tetris-javascript

## issues

### pieces clipping when rotating

solution: copy vertical/horizontal collision check idea
 - create copy of tetromino
 - rotate it into potential new position
 - check if it actually fits
 - if so, tell original piece to rotate
 - else, do not allow rotation

 ### original line clear algo only checked consecutive lines
 #### but you could have a gap!

 solution:
 - check lines individually
 - if line needs clear, zero out array, then unshift it up to top of gameboard
 - then redraw gameboard


 ### Key 'hold' not registered

 solution: 
 - use game loop

 issue: keys are rapid-firing
 solution: frameCount

 ### Highscore Database
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