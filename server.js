const app = require('express')();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`server running on port ${PORT}`)
);

app.get('/highscores', (req, res)=>{
    res.status(200).send({
        name: 'mename',
        score: 1000,
    });
})

//GET
//connect to db
//if high score button clicked, return top 10 scores in order

//POST
//on gameover
//compare score to #10 highscore
//if greater, prompt user for name
//on submit, insert name into DB
//then display all high scores 
//(and delete old record?)