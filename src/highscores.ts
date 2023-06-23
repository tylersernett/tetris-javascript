import { highscoreDisplayEl, highscoreOuterEl, highscorePromptEl, scoreFormSubmitEl, scoreData, nameSubmitEl } from "./tetris";
import { config } from "./constants";

const apiURL = config.url.API_URL;

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
    populateScoreEntries(scoresDB);
    if (checkNewScore && (scoresDB.length < 5 || scoreData.score > scoresDB[4]?.score)) {
        highscorePromptEl.style.visibility = 'visible';
    }
}

function populateScoreEntries(scoresDB) {
    const scoreListItems = scoresDB
        .map((entry: { name: string; score: number; }) => `<li>${entry.name}: ${entry.score}</li>`)
        .join('');
    highscoreDisplayEl.innerHTML = `<ol>${scoreListItems}</ol>`;
    highscoreOuterEl.style.visibility = 'visible';
}

export async function getHighscores() {
    try {
        const response = await fetch(
            `${apiURL}/highscores`
        );
        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error('Error getting scores:', error);
        return [];
    }
}

async function postHighscores(nameSubmitEl, scoreData) {
    const response = await fetch(`${apiURL}/add-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: nameSubmitEl.value,
            score: scoreData.score,
            lines: scoreData.lines,
            level: scoreData.level,
        }),
    });
    const scores = await response.json();
    return scores;
}

export async function submitScore(event: Event) {
    event.preventDefault();
    scoreFormSubmitEl.disabled = true;
    try {
        const scoresDB = await postHighscores(nameSubmitEl, scoreData);
        populateScoreEntries(scoresDB);
        highscorePromptEl.style.visibility = 'hidden';
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

export const exportedForTesting = {
    postHighscores
}

//TODO: profanity filter?
//TODO: right align highscores
//TODO: rate limit? https://github.com/tonikv/snake-highscore/blob/master/index.js