"use strict";
const ratingAdjustment = 32;
const totalQuestions = 10;
let currentRating = 0;
let currentRatingOfPlayer = 711;
// Logic for single player points - can compete daily
function getPoints(scorePercentage, difficulty, currentRating) {
    const pointsBracket = [
        [1.00, 800], [0.99, 677], [0.90, 366], [0.80, 240], [0.70, 149],
        [0.60, 72], [0.50, 0], [0.40, -72], [0.30, -149], [0.20, -240],
        [0.10, -366], [0.01, -677], [0.00, -800]
    ];
    const difficultyScale = {
        easy: 0.50,
        medium: 0.75,
        hard: 1.0,
    };
    const scale = difficultyScale[difficulty];
    for (const [threshold, points] of pointsBracket) {
        if (scorePercentage >= threshold) {
            const finaleScore = Math.round(points * scale);
            console.log(finaleScore + currentRating);
            return finaleScore;
        }
    }
    return 0;
}
;
getPoints(1, 'easy', 311);
// Logic for multiplayer games in which
// if it is a draw then you make the wins equal to zero
function multiplayerRating(currentRatingOfPlayer, difficulty, wins) {
    const difficultyScale = {
        easy: 0.50,
        medium: 0.75,
        hard: 1.0,
    };
    const scale = difficultyScale[difficulty];
    const newRating = currentRatingOfPlayer + ((400 * scale) * (wins - (totalQuestions - wins))) / totalQuestions;
    console.log(`this is your performance rating: ${newRating}`);
    return newRating;
}
multiplayerRating(711, 'easy', 9);
// Logic for who should play who - you only play people within your group? 
function checkUserBracket(rating) {
    const rankingSystem = [
        ['Senior Master', 2400], ['National Master', 2200], ['Expert Master', 2000], ['Class A', 1800], ['Class B', 1600], ['Class C', 1400], ['Class D', 1200], ['Class E', 1000], ['Class F', 800], ['Class G', 600], ['Class H', 400], ['Class I', 200], ['Class J', 100]
    ];
    for (const [title, minRating] of rankingSystem) {
        if (rating >= minRating) {
            console.log(title);
            return title;
        }
    }
    ;
    return "Unrated";
}
checkUserBracket(871);
