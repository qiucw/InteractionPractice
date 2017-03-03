var AM = new AssetManager();
var playerOne, playerTwo;
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

// no inheritance
function Background(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    // this.ctx.drawImage(this.spritesheet,
    //     this.x, this.y, this.spritesheet.width, this.spritesheet.height);
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

function playerPanel(game) {
    this.x = 50;
    this.y = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 10;
};

playerPanel.prototype.draw = function () {
    this.ctx.clearRect(this.x, this.y, 30, 150);
};

playerPanel.prototype.update = function () {
    if (this.game.y > 0 && this.game.y < 720 - 150 ){
        this.y = this.game.y;
    }

};

function computerPanel(game) {
    this.x = 1200;
    this.y = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.speed = 9;
};

computerPanel.prototype.draw = function () {
    this.ctx.clearRect(this.x, this.y, 30, 150);
};

computerPanel.prototype.update = function () {

};

function Ball(game, playerPanel, computerPanel) {
    this.x = 500;
    this.y = 500;
    this.game = game;
    this.ctx = game.ctx;
    this.speedX = 10;
    this.speedY = 10;
    this.player = playerPanel;
    this.comp = computerPanel;
};

Ball.prototype.draw = function () {
    this.ctx.clearRect(this.x, this.y, 20, 20);
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
        alert("gameover");
        this.x = 630;
        this.y = 350;
    }
    if (this.comp.x - this.x < 30  && this.comp.x - this.x > 0) {
        if (this.y - this.comp.y < 150 && this.y - this.comp.y > 0){
            this.speedX = -this.speedX;
        }
    }
    if (this.x - this.player.x < 30  && this.x - this.player.x > 0) {
        if (this.y - this.player.y < 150 && this.y - this.player.y > 0){
            this.speedX = -this.speedX;
        }
    }

    if (this.comp.y+75 > this.y){
        this.comp.y -= this.comp.speed;
    } else {

        this.comp.y += this.comp.speed;
    }
};




AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine));
    var p = new playerPanel(gameEngine);
    var c = new computerPanel(gameEngine);
    gameEngine.addEntity(p);
    gameEngine.addEntity(c);
    gameEngine.addEntity(new Ball(gameEngine, p, c));

    console.log("All Done!");
});