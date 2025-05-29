"use strict";
const easy = 1000;
const medium = 1500;
const hard = 2000;
const totalQuestions = 10;
function eloScoreSinglePlayer(level, userWins, userLosses) {
    const perfRating = (level + (400 * userWins - userLosses)) / totalQuestions;
    console.log(perfRating);
}
eloScoreSinglePlayer(easy, 10, 0);
