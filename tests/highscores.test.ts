import { exportedForTesting, getHighscores, submitScore } from '../src/highscores';
const { postHighscores } = exportedForTesting;
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

it("GETs correctly", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: 'blah', score: '1500', level: '1', lines: '7' }))

    const response = await getHighscores()
    expect(response).toEqual({ name: 'blah', score: '1500', level: '1', lines: '7' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
        `https://tetris-javascript.onrender.com/highscores`
    );
});


it("POSTs correctly", async () => {
    const nameSubmitEl = { value: 'John' };
    const scoreData = {
        score: 100,
        lines: 2,
        level: 1,
    };

    await postHighscores(nameSubmitEl, scoreData);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://tetris-javascript.onrender.com/add-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'John',
            score: 100,
            lines: 2,
            level: 1,
        }),
    });
});

// it('should disable the submit button', async () => {
//     const event = new Event('submit');
//     let scoreFormSubmitEl = document.createElement('button');
//     scoreFormSubmitEl.disabled = false;
//     const nameSubmitEl = { value: 'John' };
//     const scoreData = { score: 100, lines: 10, level: 5 };

//     //global.fetch = jest.fn().mockResolvedValueOnce(scoreData);

//     await submitScore(event, scoreFormSubmitEl, nameSubmitEl, scoreData);
//     // await submitScore(event);

//     expect(scoreFormSubmitEl.disabled).toBe(true);
//   });