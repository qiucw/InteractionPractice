var AM = new AssetManager();
var socket = io.connect("http://76.28.150.193:8888");
var pointA = 0;
var pointB = 0;
var panel1;
var panel2;
var ball;
var point;
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    this.x = 0;
    this.y = 0;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(0, 0, 1280, 720);
    this.ctx.clearRect(635, 0, 10, 50);
    this.ctx.clearRect(635, 60, 10, 50);
    this.ctx.clearRect(635, 120, 10, 50);
    this.ctx.clearRect(635, 180, 10, 50);
    this.ctx.clearRect(635, 240, 10, 50);
    this.ctx.clearRect(635, 300, 10, 50);
    this.ctx.clearRect(635, 360, 10, 50);
    this.ctx.clearRect(635, 420, 10, 50);
    this.ctx.clearRect(635, 480, 10, 50);
    this.ctx.clearRect(635, 540, 10, 50);
    this.ctx.clearRect(635, 600, 10, 50);
    this.ctx.clearRect(635, 660, 10, 50);
};

Background.prototype.update = function () {

};

function computerPanel(game, x) {
    this.x = x;
    this.y = 50;
    this.ctx = game.ctx;
    this.speed = 8;
};

computerPanel.prototype.draw = function () {
    this.ctx.clearRect(this.x, this.y, 30, 150);
};

computerPanel.prototype.update = function () {
};



function Ball(game, playerPanel, computerPanel) {
    this.x = 500;
    this.y = 500;
    this.ctx = game.ctx;
    this.speedX = 10;
    this.speedY = 10;
    this.left = playerPanel;
    this.right = computerPanel;
};

Ball.prototype.draw = function () {
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.arc(this.x,this.y,20,0,2*Math.PI);
    this.ctx.fill();
};

Ball.prototype.update = function () {
    if (pointA == 3){
        alert("Left AI wins as " + pointA + " : " + pointB);
        pointB = 0;
        pointA = 0;
    }
    if (pointB == 3){
        alert("Right AI wins as " + pointB + " : " + pointA);
        pointB = 0;
        pointA = 0;
    }
    if (this.y >= 0 && this.y <= 700 ){
        this.y += this.speedY;
    }
    if (this.y >= 700 || this.y <= 0){
        this.speedY = -this.speedY;
    }

    if (this.x > 0 && this.x < 1260){
        this.x += this.speedX;
    } else{
        if (Math.random() < 0.5){
            this.speedX = -this.speedX;
        }
        if (this.x <= 0){
            pointB++;
        }
        if (this.x >= 1260){
            pointA++;
        }
        this.x = 630;
        this.y = 200;
        this.left.y = 200;
        this.right.y = 200;

    }
    if (this.right.x - this.x < 25  && this.right.x - this.x > 15) {
        if (this.y - this.right.y < 164 && this.y - this.right.y > -14){
            this.speedX = -this.speedX;
        }
    }
    if (this.x - this.left.x < 55  && this.x - this.left.x > 45) {
        if (this.y - this.left.y < 164 && this.y - this.left.y > -14){
            this.speedX = -this.speedX;
        }
    }

    if (this.right.y + 75 > this.y){
        this.right.y -= this.right.speed;
    } else {
        this.right.y += this.right.speed;
    }

    if (this.left.y + 75 > this.y){
        this.left.y -= this.left.speed;
    } else {
        this.left.y += this.left.speed;
    }
};

function Point(game) {
    this.x = 500;
    this.y = 500;
    this.ctx = game.ctx;
};

Point.prototype.draw = function () {
    this.ctx.fillStyle = "red";
    this.ctx.font = "40px Arial";
    this.ctx.fillText(pointA + " : " + pointB,600,50);
};

Point.prototype.update = function () {

};

AM.queueDownload();
socket.on("load", function (data) {
    panel1.y = data["panel1y"];
    panel2.y = data["panel2y"];
    ball.x = data["ballx"];
    ball.y = data["bally"];
    pointA = data["pointA"];
    pointB = data["pointB"];
    ball.speedX = data["speedX"];
    ball.speedY = data["speedY"];
});

AM.downloadAll(function () {
    document.getElementById("saveButton").addEventListener("click", function () {
        console.log(panel1.x);
        socket.emit("save", { studentname: "qiucw", statename: "aState",
            panel1y:panel1.y, panel2y:panel2.y,
            ballx: ball.x, bally: ball.y,
            pointA: pointA, pointB: pointB,
            speedX: ball.speedX, speedY: ball.speedY
        });
        }
    )
    document.getElementById("loadButton").addEventListener("click", function () {
        socket.emit("load", { studentname: "qiucw", statename: "aState"});
        }
    )
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine));
    panel1 = new computerPanel(gameEngine, 50);
    panel2 = new computerPanel(gameEngine, 1180);
    ball = new Ball(gameEngine, panel1, panel2);
    point = new Point(gameEngine);
    gameEngine.addEntity(panel1);
    gameEngine.addEntity(panel2);
    gameEngine.addEntity(ball);
    gameEngine.addEntity(point);
    console.log("All Done!");
});

