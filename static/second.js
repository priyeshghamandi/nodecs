var secondCanvas = document.getElementById('secondCanvas');
var secondCanvasContext = secondCanvas.getContext('2d');

secondCanvas.width = window.innerWidth;
secondCanvas.height = 600;

window.onload = function() {
    drawSecondPage();
};

var drawSecondPage = function() {
    var gameStartImage = new Image();
    gameStartImage.onload = function() {
        secondCanvasContext.drawImage(gameStartImage, 400, 80, 500, 500);

        secondCanvasContext.font = "30px Verdana";
        var gradient = secondCanvasContext.createLinearGradient(0, 0, 100, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        secondCanvasContext.strokeStyle = gradient;
        secondCanvasContext.strokeText("P R O   S T R I K E", 550, 150);
    };
    gameStartImage.src = "/static/images/gamestart.png";
    drawJoinRoom();
    //drawCreateRoom();
}

var drawJoinRoom = function() {

    secondCanvasContext.rect(200, 20, 150, 100);
    secondCanvasContext.stroke();

    /*secondCanvasContext.fillStyle = "#F0E68C";
    secondCanvasContext.fillRect(100, 300, 400, 100);
    secondCanvasContext.font = "50pt Calibri";
    secondCanvasContext.fillStyle = "white";
    secondCanvasContext.fillText("Join Room", 300, 380);*/

}

var drawCreateRoom = function() {
    secondCanvasContext.fillStyle = "rgba(255, 0, 0, 0.5)";
    secondCanvasContext.fillRect(100, 100, 100, 100);
    secondCanvasContext.font = "50pt Calibri";
    secondCanvasContext.fillStyle = "white";
    secondCanvasContext.fillText("Create Room", 550, 380);
}