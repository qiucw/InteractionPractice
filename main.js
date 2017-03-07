var AM = new AssetManager();

var pointA = 0;
var pointB = 0;
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
    this.game = game;
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
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 8.6;
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
    if (this.y >= 0 && this.y <= 700 ){
        this.y += this.speedY;
    }
    if (this.y >= 700 || this.y <= 0){
        this.speedY = -this.speedY;
    }

    if (this.x > 0 && this.x < 1260){
        this.x += this.speedX;
    } else{
        if (this.x <= 0){
            pointB++;
        }
        if (this.x >= 1260){
            pointA++;
        }
        this.x = 630;
        this.y = 200;
        if (Math.random() < 0.5){
            this.speedX = -this.speedX;
        }
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
    }
    if (this.right.x - this.x < 30  && this.right.x - this.x > 0) {
        if (this.y - this.right.y < 150 && this.y - this.right.y > 0){
            this.speedX = -this.speedX;
        }
    }
    if (this.x - this.left.x < 50  && this.x - this.left.x > 0) {
        if (this.y - this.left.y < 150 && this.y - this.left.y > 0){
            this.speedX = -this.speedX;
        }
    }

    if (this.right.y+75 > this.y){
        this.right.y -= this.right.speed;
    } else {
        this.right.y += this.right.speed;
    }

    if (this.left.y+75 > this.y){
        this.left.y -= this.left.speed;
    } else {
        this.left.y += this.left.speed;
    }
};

function Point(game) {
    this.x = 500;
    this.y = 500;
    this.game = game;
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


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine));
    var p = new computerPanel(gameEngine, 50);
    var c = new computerPanel(gameEngine, 1180);
    gameEngine.addEntity(p);
    gameEngine.addEntity(c);
    gameEngine.addEntity(new Ball(gameEngine, p, c));
    gameEngine.addEntity(new Point(gameEngine));
    console.log("All Done!");
});