var easy = 1000;
var medium = 1500;
var hard = 2000;
var totalQuestions = 10;
function eloScoreSinglePlayer(level, userWins, userLosses) {
    var perfRating = (level + (400 * userWins - userLosses)) / totalQuestions;
    console.log(perfRating);
}
eloScoreSinglePlayer(easy, 10, 0);
