var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onload = function() {
	//setGameStartCounterText = function(counter) {
			drawGameBoard();
		//}
};

let drawGameBoard = function() {
	var snowImage = new Image();
  snowImage.onload = function() {
       context.drawImage(snowImage, SNOW_IMAGE_X, SNOW_IMAGE_Y, SNOW_IMAGE_WIDTH, SNOW_IMAGE_HEIGHT);
       //context.font = "40pt Calibri";
			//context.fillStyle = "red";
			//context.fillText(getGameStartText(counter), 460, 100);
			drawWalls();

			let team1 = new Team1();
			let team2 = new Team2();

   };
   snowImage.src = "/static/images/snow.jpg";
}

let drawWalls = function() {
		drawVerticalWall(350, 90);
		drawBoxWall(500, 150);
		drawBoxWall(800, 150);
		drawBoxWall(650, 275);
		drawBoxWall(500, 400);
		drawBoxWall(800, 400);
		drawVerticalWall(1000, 90);
}

let drawBoxWall = function(wallX, wallY) {
	var wallImageObj = new Image();
	wallImageObj.onload = function() {
       context.drawImage(wallImageObj, wallX, wallY, WALL_SIZE, WALL_SIZE);

   };
   wallImageObj.src = "/static/images/wall.png";
}

let drawVerticalWall = function(wallX, wallY) {
	var wallImageObj = new Image();
	wallImageObj.onload = function() {
       context.drawImage(wallImageObj, wallX, wallY, VERTICAL_WALL_WIDTH, VERTICAL_WALL_HEIGHT);

   };
   wallImageObj.src = "/static/images/wall.png";
}

function getGameStartText(counter) {
	//context.fillText('', 460, 100);
	var text = "GAME STARTING IN " + counter;
	if (counter == 0) {
		clearInterval(interval);
		text = '';
	}
	return text;
}



function Team1() {
	let p1 = new Player(300, 250, 2, 5, 20, 1, 1);
	p1.update();
	let p2 = new Player(300, 300, 2, 5, 20, 1, 2);
	p2.update();
	let p3 = new Player(300, 350, 2, 5, 20, 1, 3);
	p3.update();

}

function Team2() {
	let p1 = new Player(1050, 250, 2, 5, 20, 2, 1);
	p1.update();
	let p2 = new Player(1050, 300, 2, 5, 20, 2, 2);
	p2.update();
	let p3 = new Player(1050, 350, 2, 5, 20, 2, 3);
	p3.update();

}

function Player(x, y, dx, dy, radius, imagePath, teamId, playerId) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.teamId = teamId;
	this.playerId = playerId;

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.strokeStyle = 'red';
		//context.fill();
		context.stroke();

		drawPlayer(this.x, this.y, teamId, playerId, false);

	}

var innerWidth = 1200;
var innerHeight = 600;
	this.update = function() {
		if (this.x + this.radius > innerWidth ||
			this.x - this.radius < 0) {
				this.dx = -this.dx;
			}

			if (this.y + this.radius > innerHeight ||
				this.y - this.radius < 0) {
				this.dy = -this.dy;
			}

			this.x += this.dx;
			this.y += this.dy;

			this.draw();
		}
}

function drawPlayer(x, y, teamId, playerId, isInjured) {
	this.x = x;
	this.y = y;
	this.teamId = teamId;
	this.playerId = playerId;

		var playerImageObj = new Image();
		playerImageObj.onload = function() {
			context.drawImage(playerImageObj, this.x, this.y, WALL_SIZE, WALL_SIZE);
	 	};
	 if (teamId == 1 && !isInjured) {
		 playerImageObj.src = "/static/images/team1HealthyPlayer.png";
	 }
	 if (teamId == 1 && isInjured) {
		 playerImageObj.src = "/static/images/team1InjuredPlayer.png";
	 }
	 if (teamId == 2 && !isInjured) {
		 playerImageObj.src = "/static/images/team2HealthyPlayer.png";
	 }
	 if (teamId == 2 && isInjured) {
		 playerImageObj.src = "/static/images/team2InjuredPlayer.png";
	 }
}


// Socket programming

var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
    console.log("movement "+movement.right);
   // socket.emit('movement', movement);
    console.log("MOVE PLAYER");

    var player = players[socket.id] || {};
    if (movement.left) {
        player.x -= 5;
    }
    if (movement.up) {
        player.y -= 5;
    }
    if (movement.right) {
        console.log("movement right");
        player.x += 5;
    }
    if (movement.down) {
        player.y += 5;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

var players = {};
socket.on('new player', function() {
	console.log("NEW PLAYER");
    players[socket.id] = {
        x: 0,
        y: 300
    };
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
});


socket.on('movement', function(data) {

});


setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

//context.clearRect(0, 0, 800, 600);

socket.on('state', function(players) {
	//context.clearRect(0, 0, 1200, 600);
    //drawGameBoard();


});


setInterval(function() {
    socket.emit('state', players);
}, 1000 / 60);