require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
let PORT = process.env.PORT;
let uri = process.env.MONGO_URI;

//var MongoClient = require('mongodb').MongoClient;
// app.listen(
//     PORT,
//     () => console.log(`server listening on port ${PORT}`)
// );

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
    //res.render('tetris');
})

app.get('/highscores', (req, res) => {
    Highscore.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.error(err);
        })
})

app.get('/add-score', (req, res) => {
    const scoreDoc = new Highscore({ name: "testris1", score: 5000, lines: 6, level: 1 });
    scoreDoc.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.error(err)
        })
})

//GET from route
//connect to db
//if high score button clicked, return top 10 scores in order

//POST
//on gameover
//compare score to #10 highscore
//if greater, prompt user for name, then POST to route
//on submit, insert name into DB
//then display all high scores 
//(and delete old record?)