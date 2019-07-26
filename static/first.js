var gameStartCanvas = document.getElementById('gameStartCanvas');
var gameStartContext = gameStartCanvas.getContext('2d');

gameStartCanvas.width = window.innerWidth;
gameStartCanvas.height = 600;

window.onload = function() {
    drawGameStartPage();
};

var drawGameStartPage = function() {
    var gameStartImage = new Image();
    gameStartImage.onload = function() {
        gameStartContext.drawImage(gameStartImage, 600, 80, SIZE_200, SIZE_200);
        gameStartContext.font = "50pt Calibri";
        gameStartContext.fillStyle = "white";
        gameStartContext.fillText("PRO STRIKE", 550, 380);

    };
    gameStartImage.src = "/static/images/gamestart.png";

    drawQuestionProLog();
}

var drawQuestionProLog = function() {
    var questionproImage = new Image();
    questionproImage.onload = function() {
        gameStartContext.drawImage(questionproImage, 630, 520, 150, 40);
    };
    questionproImage.src = "/static/images/questionprologo.png";
}