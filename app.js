

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};

var Entity = function(){
    var self = {
        x:100,
        y:100,
        spdX:0,
        spdY:0,
        id:"",
    }
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){
        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function(pt){
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}

var Wall = function (id) {
    var self = {
        x:150,
        y:150,
        width:50,
        height:50
    }
    return self;
}

let walls = [
    {
        x: 200,
        y: 200
    },
    {
        x: 600,
        y: 200
    },
    {
        x: 200,
        y: 500
    },
    {
        x: 600,
        y: 500
    },
    {
        x: 400,
        y: 350
    }

];


var WALL_SIZE = 100;
var PLAYER_SIZE = 15;
var isCollisionRight = function(self){
    var isCollision = false;
    for(var i in walls) {
        var wall = walls[i];
        console.log(" Index =========== "+i);
        console.log(" wall x =========== "+wall.x);
        console.log(" wall y =========== "+wall.y);
        if((self.x > (wall.x - PLAYER_SIZE - 10)) &&
            self.y > (wall.y - PLAYER_SIZE) &&
            self.y < (wall.y + PLAYER_SIZE + WALL_SIZE) &&
            self.x < (wall.x + PLAYER_SIZE + WALL_SIZE)
        ){
            isCollision = true;
        }
    }
    console.log("X ",self.x)
    console.log("Y ",self.y)
    console.log("Right =========== "+isCollision);
    return isCollision;
}

var isCollisionLeft = function(self){
    var isCollision = false;
    for(var i in walls) {
        var wall = walls[i];
        console.log(" Index =========== "+i);
        console.log(" wall x =========== "+wall.x);
        console.log(" wall y =========== "+wall.y);
        if((self.x > (wall.x + PLAYER_SIZE + 10)) &&
            self.y > (wall.y - PLAYER_SIZE) &&
            self.y < (wall.y + PLAYER_SIZE + WALL_SIZE) &&
            self.x < (wall.x + PLAYER_SIZE + WALL_SIZE)
        ){
            isCollision = true;
        }
    }
    console.log("X ",self.x)
    console.log("Y ",self.y)
    console.log("Left =========== "+isCollision);
    return isCollision;
}

var isCollisionUp = function(self){
    var isCollision = false;
    for(var i in walls) {
        var wall = walls[i];
        if((self.y > (wall.y + PLAYER_SIZE + 10)) &&
            self.x > (wall.x - PLAYER_SIZE) &&
            self.x < (wall.x + PLAYER_SIZE + WALL_SIZE) &&
            self.y < (wall.y + PLAYER_SIZE + WALL_SIZE)
        ){
            isCollision = true;
        }
    }
    console.log("X ",self.x)
    console.log("Y ",self.y)
    console.log("Up =========== "+isCollision);
    return isCollision;
}

var isCollisionDown = function(self){
    var isCollision = false;
    for(var i in walls) {
        var wall = walls[i];
        if((self.y > (wall.y - PLAYER_SIZE - 10)) &&
            self.x > (wall.x - PLAYER_SIZE) &&
            self.x < (wall.x + PLAYER_SIZE + WALL_SIZE) &&
            (self.y < (wall.y - PLAYER_SIZE - 10) + WALL_SIZE)
        ){
            isCollision = true;
        }
    }
    console.log("X ",self.x)
    console.log("Y ",self.y)
    console.log("Down =========== "+isCollision);
    return isCollision;
}




/*
var isCollisionRight = function(p){
    var size = 100;
    var playerSize = 50;

    var isCollision = false;
    for(var wall in walls){
        if((p.x > (wall.x-(playerSize-10)) && p.y > wall.y && p.y < (wall.y + size))){

        }
    }

    return isCollision;
}*/

var Player = function(id){
    var self = Entity();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.hp = 10;
    self.hpMax = 10;
    self.score = 0;
    self.img = '/client/img/player.png';



    var super_update = self.update;
    self.update = function(){
        self.updateSpd();
        super_update();

        if(self.pressingAttack){
            self.shootBullet(self.mouseAngle);
        }
    }
    self.shootBullet = function(angle){
        var b = Bullet(self.id,angle);
        b.x = self.x;
        b.y = self.y;
    }

    self.updateSpd = function(){
        if(self.pressingRight){
            if(isCollisionRight(self)){
                self.spdX = 0;
                self.x -= 20;
            }else{
                self.spdX = self.maxSpd;
            }
        }
        else if(self.pressingLeft) {
            if (isCollisionLeft(self)) {
                self.spdX = 0;
                self.x += 20;
            }else{
                self.spdX = -self.maxSpd;
            }
        }
        else {
            self.spdX = 0;
        }

        if(self.pressingUp) {
            if (isCollisionUp(self)) {
                self.spdY = 0;
                self.y += 20;
            }else{
                self.spdY = -self.maxSpd;
            }

        }

        else if(self.pressingDown) {
            if (isCollisionDown(self)) {
                self.spdY = 0;
                self.y -= 20;
            }else{
                self.spdY = self.maxSpd;
            }
        }
        else {
            self.spdY = 0;
        }
    }

    self.getInitPack = function(){
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            number:self.number,
            hp:self.hp,
            hpMax:self.hpMax,
            score:self.score,
            img:self.img,
        };
    }
    self.getUpdatePack = function(){
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            hp:self.hp,
            score:self.score,
            img:self.img,
        }
    }

    Player.list[id] = self;

    initPack.player.push(self.getInitPack());
    return self;
}
Player.list = {};


Player.onConnect = function(socket){
    var player = Player(socket.id);
    socket.on('keyPress',function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
        else if(data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if(data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.emit('init',{
        player:Player.getAllInitPack(),
        bullet:Bullet.getAllInitPack(),
    })
}
Player.getAllInitPack = function(){
    var players = [];
    for(var i in Player.list)
        players.push(Player.list[i].getInitPack());
    return players;
}

Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}
Player.update = function(){
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push(player.getUpdatePack());
    }
    return pack;
}




var Bullet = function(parent,angle){
    var self = Entity();
    self.id = Math.random();
    self.spdX = Math.cos(angle/180*Math.PI) * 10;
    self.spdY = Math.sin(angle/180*Math.PI) * 10;
    self.parent = parent;
    self.timer = 10;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function(){
        if(self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for(var i in Player.list){
            var p = Player.list[i];
            if(self.getDistance(p) < 32 && self.parent !== p.id){
                p.hp -= 1;
                p.img = '/client/img/player_inj.png';

                for(var i in SOCKET_LIST){
                    SOCKET_LIST[i].emit('scoreUpdated',Player.list);
                }



                if(p.hp <= 0){
                    var shooter = Player.list[self.parent];
                    if(shooter) {
                        shooter.score += 1;
                    }
                }
                self.toRemove = true;
            }
        }
    }
    self.getInitPack = function(){
        return {
            id:self.id,
            x:self.x,
            y:self.y,
        };
    }
    self.getUpdatePack = function(){
        return {
            id:self.id,
            x:self.x,
            y:self.y,
        };
    }

    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());
    return self;
}
Bullet.list = {};

Bullet.update = function(){
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove){
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}

Bullet.getAllInitPack = function(){
    var bullets = [];
    for(var i in Bullet.list)
        bullets.push(Bullet.list[i].getInitPack());
    return bullets;
}

var DEBUG = true;

var USERS = {
    //username:password
    "Priyesh":"123",
    "Prakash":"456",
    "bob3":"ttt",
}

var isValidPassword = function(data,cb){
    setTimeout(function(){
        cb(USERS[data.username] === data.password);
    },10);
}


var isUsernameTaken = function(data,cb){
    setTimeout(function(){
        cb(USERS[data.username]);
    },10);
}
var addUser = function(data,cb){
    setTimeout(function(){
        USERS[data.username] = data.password;
        cb();
    },10);
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var wall = Wall(socket.id);

  //  Player.onConnect(socket);
    //socket.emit('signInResponse',{success:true});

    socket.on('signIn',function(data){
        isValidPassword(data,function(res){
            if(res){
                Player.onConnect(socket);
                socket.emit('signInResponse',{success:true});
            } else {
                socket.emit('signInResponse',{success:false});
            }
        });
    });
    socket.on('signUp',function(data){
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});
            } else {
                addUser(data,function(){
                    socket.emit('signUpResponse',{success:true});
                });
            }
        });
    });


    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    socket.on('sendMsgToServer',function(data){
        var playerName = ("" + socket.id).slice(2,7);
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
        }
    });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });



});

var initPack = {player:[],bullet:[]};
var removePack = {player:[],bullet:[]};


setInterval(function(){
    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init',initPack);
        socket.emit('update',pack);
        socket.emit('remove',removePack);
    }
    initPack.player = [];
    initPack.bullet = [];
    removePack.player = [];
    removePack.bullet = [];

},1000/25);






