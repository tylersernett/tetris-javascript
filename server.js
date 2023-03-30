require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
let PORT = process.env.PORT;
let uri = process.env.MONGO_URI;

//MIDDLEWARE
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()) //add url here later???

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

app.get('/', (req, res) => {
})

//https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
//tetris.js fetch()
//.then(response => response.json())
//.then(json => {
app.get('/highscores', (req, res) => {
    console.log('getting...');
    Highscore.find().sort({score: -1}).limit(5) //sort by score in descending order - return top 5
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.error(err);
        })
})

app.post('/add-score', (req, res) => {
    console.log(req.body)
    const scoreDoc = new Highscore({ name: req.body.name, score: req.body.score, lines: req.body.lines, level: req.body.level });
    scoreDoc.save()
        .then((result) => {
            console.log({status: 'saved', doc: result})
            res.status(200);
            res.send(result)
        })
        .catch((err) => {
            console.error(err)
        })
})

//TODO: refresh scores after POST