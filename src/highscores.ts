import { highscoreDisplayEl, highscoreOuterEl, highscorePromptEl, scoreFormSubmitEl, scoreData, nameSubmitEl } from "./tetris";

export function toggleHighscores() {
    scoreData.show = !scoreData.show;
    if (scoreData.show) {
        displayHighscores(false);
    } else {
        highscoreOuterEl.style.visibility = 'hidden';
    }
}

export async function displayHighscores(checkNewScore: boolean) {
    scoreData.show = true;
    const scoresDB = await getHighscores();
    const scoreListItems = scoresDB
        .map((entry: { name: string; score: number; }) => `<li>${entry.name}: ${entry.score}</li>`)
        .join('');
    highscoreDisplayEl.innerHTML = `<ol>${scoreListItems}</ol>`;
    highscoreOuterEl.style.visibility = 'visible';
    if (checkNewScore && (scoresDB.length < 5 || scoreData.score > scoresDB[4]?.score)) {
        highscorePromptEl.style.visibility = 'visible';
    }
}

export async function getHighscores() {
    try {
        const response = await fetch(
            'https://tetris-javascript.onrender.com/highscores'
        );
        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error('Error getting scores:', error);
        return [];
    }
}

async function postHighscores(nameSubmitEl, scoreData) {
    await fetch('https://tetris-javascript.onrender.com/add-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nameSubmitEl.value,
            score: scoreData.score,
            lines: scoreData.lines,
            level: scoreData.level,
        }),
    });
}

export async function submitScore(event: Event) {
    event.preventDefault();
    scoreFormSubmitEl.disabled = true;
    try {
        postHighscores(nameSubmitEl, scoreData);
    } catch (error) {
        console.error('Error submitting score:', error);
    }
    highscorePromptEl.style.visibility = 'hidden';
    displayHighscores(false); //refresh the score display
}

export const exportedForTesting = {
    postHighscores
}

//TODO: profanity filter?
//TODO: right align highscores
//TODO: rate limit? https://github.com/tonikv/snake-highscore/blob/master/index.js