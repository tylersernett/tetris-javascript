require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
let PORT = process.env.PORT || 3232;
let uri = process.env.MONGO_URI;

//MIDDLEWARE
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:
        ["https://tylersernett.github.io", "https://tylersernett.github.io/tetris-javascript"]
}));

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

connect();

const Schema = mongoose.Schema;
const scoreSchema = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
    lines: { type: Number, required: true },
    level: { type: Number, required: true },
}, { timestamps: true });
const Highscore = mongoose.model('Highscore', scoreSchema);

//https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
app.get('/highscores', (req, res) => {
    console.log('getting...');
    Highscore.find().sort({ score: -1 }).limit(5) //sort by score in descending order - return top 5
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.error(err);
        })
})

app.post('/add-score', (req, res) => {
    const { name, score, lines, level } = req.body;

    if (!name || !score || !lines || !level) {
        // Invalid request body, send an error response
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    if (typeof name !== 'string' || typeof score !== 'number' || typeof lines !== 'number' || typeof level !== 'number') {
        // Invalid data types, send an error response
        res.status(400).json({ error: 'Invalid data types in request body' });
        return;
    }

    // Valid request body, proceed with saving the high score
    const scoreDoc = new Highscore({
        name: name,
        score: score,
        lines: lines,
        level: level
    });

    scoreDoc.save()
        .then((result) => {
            console.log({ status: 'saved', doc: result });
            res.status(200).json(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});