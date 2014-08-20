
var isMobile = false;

function is_touch_device() {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

if (is_touch_device()) {
    isMobile = true;
}


var canvasTouchHUD = document.getElementById("canvasTouchHUD");
var ctxTouchHUD = canvasTouchHUD.getContext('2d');
var canvasControlsHUD = document.getElementById("canvasControlsHUD");
var ctxControlsHUD = canvasControlsHUD.getContext('2d');


var canvasHUD = document.getElementById("canvasHUD");
var ctxHUD = canvasHUD.getContext('2d');
var canvasExplosion = document.getElementById("canvasExplosion");
var ctxExplosion = canvasExplosion.getContext('2d');
var canvasEnemy = document.getElementById("canvasEnemy");
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasBg = document.getElementById("canvasBg");
var ctxBg = canvasBg.getContext('2d');
var canvasJet = document.getElementById("canvasJet");
var ctxJet = canvasJet.getContext('2d');
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;

var returnFigure = function(){
    ctxHUD.clearRect(45,15,65,35);
    ctxHUD.fillStyle = "rgba(0,0,0,.5)";
    ctxHUD.strokeStyle = 'rgba(0,0,0,.5)';
    ctxHUD.lineWidth   = 1;
    ctxHUD.beginPath();
    ctxHUD.moveTo(45,15);
    ctxHUD.lineTo(65,25);
    ctxHUD.lineTo(45,35);
    ctxHUD.lineTo(45,15);
    ctxHUD.stroke();
    ctxHUD.fill();
    ctxHUD.closePath();
};
var menuGameOver = function(){
    if(mainPlayer.gameOver) {
        ctxHUD.fillStyle = "rgba(96,96,96,.6)";
        ctxHUD.fillRect(100, 100, 600, 300);
        ctxHUD.fillStyle = "rgba(0,0,0,.7)";
        ctxHUD.font = 'bold 50px Arial';
        if(mainPlayer.gameOver) {
            ctxHUD.fillText('GAME OVER!', 245, 165);
        }
        else {
            ctxHUD.fillText('GAME PAUSED!', 245, 165);

        }
        ctxHUD.fillRect(140, 200, 510, 4);
        ctxHUD.font = 'bold 20px Arial';
        if(mainPlayer.score>=100){
            ctxHUD.fillText('YOU SCORED ', 135, 250);
        }
        else{
            ctxHUD.fillText('YOU SCORED ', 138, 250);
        }
        ctxHUD.fillText(mainPlayer.score + ' POINTS', 275, 250);
        ctxHUD.fillText('&   YOU KILLED', 392, 250);
        ctxHUD.fillText(mainPlayer.kills + ' ENEMIES', 550, 250);
        ctxHUD.fillRect(155, 310, 200, 55);
        ctxHUD.fillRect(445, 310, 200, 55);
        ctxHUD.fillStyle = "rgba(255,255,255,.8)";
        ctxHUD.font = "bold 25px Arial";
        ctxHUD.fillText('MAIN MENU', 183, 346);
        ctxHUD.fillText('RESTART', 487, 346);
    }
};
var restartGame = function(){
    clearEnemy();
    clearExlosion();
    clearHUD();
    clearJet();
    mainPlayer.drawX = 200;
    mainPlayer.drawY = 220;
    mainPlayer.score = 0;
    mainPlayer.kills = 0;
    for(var i = 0; i < enemies.length; i++) {
        enemies[i].drawX = Math.floor(Math.random() * 1000) + gameWidth;
        enemies[i].drawY = Math.floor(Math.random() * 360);
    }
    playGame();
};

var btnPlay = new Button(265, 535, 220, 335);
var btnStop = new ButtonStop(45, 60, 15, 35);
var mouseX = 0;
var mouseY = 0;
var mainPlayer = new Jet();
function clearJet(){ctxJet.clearRect(0,0,gameWidth,gameHeight)}

var spawnAmount = 5;
function clearEnemy(){ctxEnemy.clearRect(0,0,gameWidth,gameHeight)}
function clearExlosion(){ctxExplosion.clearRect(0,0,gameWidth,gameHeight)}
function clearHUD (){ctxHUD.clearRect(0,0,gameWidth,gameHeight)}
var enemies = [];

var isPlaying = false;
var requestAnimFrame =  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var imgSprite = new Image();
imgSprite.src = "img/sprite.png";
var gamePad = new Image();
gamePad.src = "img/gamepad.png";
window.addEventListener("load",init,false);





// MAIN FUNCTIONS

function init() {
    CreatingEnemies(spawnAmount);
    drawMenu();
    window.addEventListener('click',mouseClicked,false);
    window.addEventListener('touchstart',touchmouseClicked,false);

}

function playGame(){
    if(!mainPlayer.gameOver) {
        window.removeEventListener('click', mouseClicked, false);
        window.removeEventListener('touchstart', touchmouseClicked, false);
        window.addEventListener('click', mousePause, false);
        window.addEventListener('touchstart', touchmousePause, false);
        drawBg();
        startLoop();
        window.addEventListener('keydown', checkKeyDown, false);
        window.addEventListener('keyup', checkKeyUp, false);
    }
}
function startLoop(){
    isPlaying = true;
    loop();
}


function loop(){
    if(isPlaying){
        moveBg();
        drawHUD();
        mainPlayer.draw();
        DrawEnemies();
        requestAnimFrame(loop);
    }
    if(!isPlaying){
        window.removeEventListener('click',mousePause,false);
        window.removeEventListener('touchstart',touchmousePause,false);
        window.addEventListener('click',mouseReturn,false);
        window.addEventListener('touchstart',touchmouseReturn,false);
    }
}


function drawMenu() {
    if(mainPlayer.gameOver){
        mainPlayer.gameOver = true;
        restartGame();
    }
    if(!isPlaying){
        canvasTouchHUD.style.display = 'none';
        canvasControlsHUD.style.display = 'none';
    }
    window.addEventListener('click',mouseClicked,false);
    window.addEventListener('touchstart',touchmouseClicked,false);
    ctxBg.drawImage(imgSprite, 0, 580, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

function drawBg() {
    ctxBg.clearRect(0,0,gameWidth,gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, backgroundX1, 0, 1600, gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, backgroundX2, 0, 1600, gameHeight);
}

function drawHUD() {
    ctxHUD.clearRect(0,0,gameWidth,gameHeight);
    ctxHUD.font = "bold 20px Arial";
    ctxHUD.fillStyle = "rgba(0,0,0,.5)";
    ctxHUD.fillText('Score: ' + mainPlayer.score,680,30);
    ctxHUD.fillRect(45,15,5,20);
    ctxHUD.fillRect(55,15,5,20);
    if(mainPlayer.gameOver){
        canvasTouchHUD.style.display = 'none';
        canvasControlsHUD.style.display = 'none';
        isPlaying = false;
        menuGameOver();
        btnMainMenu = new ButtonMainMenu();
        btnRestart = new ButtonRestart();
        btnMainMenu.draw();
        btnRestart.draw();
        window.addEventListener('click',mouseMainMenu,false);
        window.addEventListener('touchstart',touchmouseMainMenu,false);
        window.addEventListener('click',mouseRestart,false);
        window.addEventListener('touchstart',touchmouseRestart,false);
    }

    if(isMobile && !mainPlayer.gameOver){
        canvasTouchHUD.style.display = 'inline-block';
        canvasControlsHUD.style.display = 'inline-block';
        ctxTouchHUD.clearRect(0,0,300,300);
        ctxControlsHUD.clearRect(0,0,300,300);
        ctxControlsHUD.drawImage(gamePad,0,0,189,203,25,75,189,203);
        ctxTouchHUD.beginPath();
        ctxTouchHUD.fillStyle = "rgba(0,0,0,.5)";
        ctxTouchHUD.lineWidth   = 1;
        ctxTouchHUD.arc(225,175,45,0,2*Math.PI);
        ctxTouchHUD.arc(125,225,45,0,2*Math.PI);
        ctxTouchHUD.fill();
        ctxTouchHUD.closePath();
        ctxTouchHUD.fillStyle = "rgba(255,255,255,1)";
        ctxTouchHUD.strokeStyle = 'rgba(255,255,255,1)';
        ctxTouchHUD.lineWidth   = 1;
        ctxTouchHUD.font = 'bold 22px Arial';
        ctxTouchHUD.fillText('TURBO',186,183);
        ctxTouchHUD.fillText('SHOOT',85,233);

    }
}

// END OF MAIN FUNCTIONS






// MOVE BACKGROUND FUNCTIONS
var backgroundX1 = 0;
var backgroundX2 = 1600;

function moveBg(){
    backgroundX1 -= 5;
    backgroundX2 -=5;

    if(backgroundX1 <= -1600){
        backgroundX1 = 1600;
    }
    else if(backgroundX2 <= -1600){
        backgroundX2 = 1600;
    }
    drawBg();
}

// END OF MOVE HACKGROUND FUNCTIONS






// BUTTON HUD FUNCTIONS

function ButtonStop(xL,xR,yT,yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonStop.prototype.checkPaused = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};


function ButtonReturn(xL,xR,yT,yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonReturn.prototype.draw = function(){
    this.xLeft = 45;
    this.xRight =  65;
    this.yTop =  15;
    this.yBottom =  35;
    returnFigure();
};

ButtonReturn.prototype.checkReturned = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};


function ButtonMainMenu(xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonMainMenu.prototype.draw = function(){
    this.xLeft = 155;
    this.xRight = 355;
    this.yTop =  310;
    this.yBottom =  365;
};

ButtonMainMenu.prototype.checkBack = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};


function ButtonRestart(xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonRestart.prototype.draw = function(){
    this.xLeft = 445;
    this.xRight = 645;
    this.yTop =  310;
    this.yBottom =  365;
};

ButtonRestart.prototype.checkRestarted = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};


// END OF BUTTON HUD FUNCTIONS

// TOUCH HUD BUTTON FUNCTIONS

function ButtonShoot (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonShoot.prototype.checkShoot = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonTurbo (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonTurbo.prototype.checkTurbo = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonLT (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonLT.prototype.checkLT = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonUP (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonUP.prototype.checkUP = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonRT (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonRT.prototype.checkRT = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonRight (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonRight.prototype.checkRight = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonRB (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonRB.prototype.checkRB = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonDown (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonDown.prototype.checkDown = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonLB (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonLB.prototype.checkLB = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

function ButtonLeft (xL,xR,yT,yB){
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

ButtonLeft.prototype.checkLeft = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};
// END OF TOUCH HUD BUTTON FUNCTIONS






// BUTTON FUNCTIONS

function Button(xL,xR,yT,yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom){
        return true;
    }
};

// END OF BUTTON FUNCTIONS





// JET FUNCTIONS

function Jet() {
    this.srcX = 0;
    this.srcY = 500;
    this.width = 100;
    this.height = 40;
    this.speed = 2;
    this.turbo = 2;
    this.drawX = 220;
    this.drawY = 200;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpaceBar = false;
    this.isShiftKey = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    this.score = 0;
    this.kills = 0;
    this.exploded = new Explosion();
    this.gameOver = false;
    for (var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet();
    }
}

Jet.prototype.draw = function(){
    clearJet();
    this.checkCoors();
    this.checkDied();
    this.checkDirection();
    this.checkShooting();
    this.drawAllBullets();
    ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
};

Jet.prototype.checkCoors = function(){
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.yTop = this.drawY;
    this.yBottom = this.drawY + this.height;
    this.xLeft = this.drawX;
    this.xRight = this.drawX + this.width;
};

Jet.prototype.checkDirection = function(){
    if(this.isUpKey && this.yTop > 0){
        this.drawY -= this.speed;
    }
    if(this.isShiftKey && this.yTop > 0 && this.isUpKey){
        this.drawY -= this.turbo;
    }
    if(this.isDownKey && this.yBottom < 500){
        this.drawY += this.speed;
    }
    if(this.isShiftKey && this.yBottom < 500 && this.isDownKey){
        this.drawY += this.turbo;
    }
    if(this.isLeftKey && this.xLeft > 0){
        this.drawX -= this.speed;
    }
    if(this.isShiftKey && this.xLeft > 0 && this.isLeftKey){
        this.drawX -= this.turbo;
    }
    if(this.isRightKey && this.xRight < 800){
        this.drawX += this.speed;
    }
    if(this.isShiftKey && this.xRight < 800 && this.isRightKey){
        this.drawX += this.turbo;
    }
};

Jet.prototype.checkShooting = function (){
    if(this.isSpaceBar && !this.isShooting){
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX,this.noseY);
        this.currentBullet++;
        if(this.currentBullet >= this.bullets.length){
            this.currentBullet = 0;
        }
    }
    else if(!this.isSpaceBar){
        this.isShooting = false;
    }
};

Jet.prototype.drawAllBullets = function(){
    for(var i = 0; i < this.bullets.length; i++){
        if(this.bullets[i].drawX >= 0){
            this.bullets[i].draw();
        }
        if(this.bullets[i].explosion.hasHit){
            this.bullets[i].explosion.draw();
        }
    }
};

Jet.prototype.checkDied = function(){
    for(var i = 0; i < enemies.length; i++){
        if( this.noseX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.noseY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height){
            this.exploded.drawX = this.drawX + this.width/2;
            this.exploded.drawY = this.drawY -6;
            this.exploded.checkDying();

        }
    }
};

// END OF JET FUNCTION


// BULLET FUNCTION

function Bullet() {
    this.srcX = 100;
    this.srcY = 500;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 5;
    this.height = 5;
    this.speed = 30;
    this.explosion = new Explosion ();
}


Bullet.prototype.draw = function(){
    this.drawX += this.speed;
    ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    this.checkHitEnemy();
    if(this.drawX >= gameWidth){
        this.recycle();
    }
};

Bullet.prototype.recycle = function(){
    this.drawX = -20;
};

Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function(){
    for(var i = 0; i < enemies.length; i++){
        if(this.drawX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height){
            this.explosion.hasHit = true;
            this.explosion.drawX = enemies[i].drawX - (this.explosion.width /2);
            this.explosion.drawY = enemies[i].drawY;
            mainPlayer.score += enemies[i].score;
            mainPlayer.kills ++;
            this.recycle();
            enemies[i].recycleEnemy();
        }
    }
};

// END OD BULLET FUNCTION

// EXPLOSION FUNCTIONS

function Explosion () {
    this.srcX = 750;
    this.srcY = 500;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 50;
    this.height = 50;
    this.hasHit = false;
    this.currentFrame = 0;
    this.totalFrames = 10;
}

Explosion.prototype.draw = function(){
    if(this.currentFrame <= this.totalFrames){
        ctxJet.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
        this.currentFrame++
    }
    else{
        this.currentFrame = 0;
        this.hasHit = false;
    }
};

Explosion.prototype.checkDying = function() {
    mainPlayer.gameOver = true;
    this.drawDied();
};

Explosion.prototype.drawDied = function(){
    if(mainPlayer.gameOver){
        clearExlosion();
        ctxExplosion.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    }
    else{
        this.gameOver = false;
    }
};

//END OF EXPLOSION FUNCTIONS


// ENEMY FUNCTION

function Enemy(){
    this.width = 100;
    this.height = 40;
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
    this.speed = 2;
    this.score = 5;
}

Enemy.prototype.draw = function(){
    this.drawX -= this.speed;
    ctxEnemy.drawImage(imgSprite,0,540,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
    this.checkEscaped();
};

Enemy.prototype.checkEscaped = function(){
    if(this.drawX + this.width <= 0){
        this.recycleEnemy();
    }
};


Enemy.prototype.recycleEnemy = function() {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
};

function CreatingEnemies(spawnAmount) {
    for (i = 0; i < spawnAmount; i++){
        enemies[enemies.length] = new Enemy;
    }
}

function DrawEnemies(){
    clearEnemy();
    for(i = 0; i < enemies.length; i++){
        enemies[i].draw()
    }
}


// END ENEMY JET FUNCTIONS




// EVENT FUNCTIONS

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        mainPlayer.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        mainPlayer.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        mainPlayer.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        mainPlayer.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        mainPlayer.isSpaceBar = true;
        e.preventDefault();
    }
    if (keyID === 16) { //shift key
        mainPlayer.isShiftKey = true;
        e.preventDefault();
    }
}


function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        mainPlayer.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        mainPlayer.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        mainPlayer.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        mainPlayer.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        mainPlayer.isSpaceBar = false;
        e.preventDefault();
    }
    if (keyID === 16) { //shift key
        mainPlayer.isShiftKey = false;
        e.preventDefault();
    }
}

function mouseClicked (e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying) {
        if (btnPlay.checkClicked()) {
            mainPlayer.gameOver = false;
            playGame();
        }
    }
}

function touchmouseClicked (e) {
    var touch = e.changedTouches[0];
    mouseX = touch.pageX - canvasBg.offsetLeft;
    mouseY = touch.pageY - canvasBg.offsetTop;
    e.preventDefault();
    if (!isPlaying) {
        if (btnPlay.checkClicked()) {
            mainPlayer.gameOver = false;
            playGame();
        }
    }
}

function mousePause(e){
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if(isPlaying){
        if(btnStop.checkPaused()){
            isPlaying = false;
            btnReturn = new ButtonReturn();
            btnReturn.draw();
        }
    }
}

function touchmousePause (e){
    var touch = e.changedTouches[0];
    mouseX = touch.pageX - canvasBg.offsetLeft;
    mouseY = touch.pageY - canvasBg.offsetTop;
    e.preventDefault();
    if(isPlaying){
        if(btnStop.checkPaused()){
            isPlaying = false;
            btnReturn = new ButtonReturn();
            btnReturn.draw();
        }
    }
}

function mouseReturn(e){
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if(!isPlaying){
        if(btnReturn.checkReturned()){
            playGame();
        }
    }
}

function touchmouseReturn(e){
    var touch = e.changedTouches[0];
    mouseX = touch.pageX - canvasBg.offsetLeft;
    mouseY = touch.pageY - canvasBg.offsetTop;
    e.preventDefault();
    if(!isPlaying) {
        if (btnReturn.checkReturned()) {
            playGame();
        }
    }
    else if(mainPlayer.gameOver){
        if(btnReturn.checkReturned()){
            playGame();
        }
    }
}

function mouseMainMenu(e){
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if(mainPlayer.gameOver){
        if(btnMainMenu.checkBack()){
            drawMenu();
        }
    }
}

function touchmouseMainMenu(e){
    var touch = e.changedTouches[0];
    mouseX = touch.pageX - canvasBg.offsetLeft;
    mouseY = touch.pageY - canvasBg.offsetTop;
    e.preventDefault();
    if(mainPlayer.gameOver){
        if(btnMainMenu.checkBack()){
            drawMenu();
        }
    }
}

function mouseRestart(e){
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if(mainPlayer.gameOver){
        if(btnRestart.checkRestarted()){
            mainPlayer.gameOver = false;
            restartGame();
        }
    }
}

function touchmouseRestart(e){
    var touch = e.changedTouches[0];
    mouseX = touch.pageX - canvasBg.offsetLeft;
    mouseY = touch.pageY - canvasBg.offsetTop;
    e.preventDefault();
    if(mainPlayer.gameOver){
        if(btnRestart.checkRestarted()){
            mainPlayer.gameOver = false;
            restartGame();
        }
    }
}

if(isMobile){
    ctxHUD.drawImage(gamePad,0,0,189,203,25,275,189,203);
    canvasControlsHUD.addEventListener('touchstart',checkLT,false);
    canvasControlsHUD.addEventListener('touchend',checkLTfalse,false);
    canvasTouchHUD.addEventListener('touchstart',checkShoot,false);
    canvasTouchHUD.addEventListener('touchend',checkShootfalse,false);
    canvasTouchHUD.addEventListener('touchstart',checkTurbo,false);
    canvasTouchHUD.addEventListener('touchend',checkTurbofalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkUP,false);
    canvasControlsHUD.addEventListener('touchend',checkUPfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkRT,false);
    canvasControlsHUD.addEventListener('touchend',checkRTfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkRight,false);
    canvasControlsHUD.addEventListener('touchend',checkRightfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkRB,false);
    canvasControlsHUD.addEventListener('touchend',checkRBfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkDown,false);
    canvasControlsHUD.addEventListener('touchend',checkDownfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkLB,false);
    canvasControlsHUD.addEventListener('touchend',checkLBfalse,false);
    canvasControlsHUD.addEventListener('touchstart',checkLeft,false);
    canvasControlsHUD.addEventListener('touchend',checkLeftfalse,false);
    var btnTurbo = new ButtonTurbo(680,775,330,425);
    var btnShoot = new ButtonShoot(575,675,380,475);
    var btnLT = new ButtonLT(35,90,285,340);
    var btnUP = new ButtonUP(91,150,275,360);
    var btnRT = new ButtonRT(151,205,285,340);
    var btnRight = new ButtonRight(135,215,345,410);
    var btnRB = new ButtonRB(150,205,420,470);
    var btnDown = new ButtonDown(91,150,395,480);
    var btnLB = new ButtonLB(35,90,415,470);
    var btnLeft = new ButtonLeft(25,105,345,410);

    function checkMoveR(e){
        document.getElementById("area").innerHTML = 'clientY(touchmove) ' + e.touches[0].clientY +'\nstartX (touchstart)' + startX;
        if(e.touches[0].clientX - canvasHUD.offsetLeft < 135 ||
            e.touches[0].clientX - canvasHUD.offsetLeft > 215 ||
            e.touches[0].clientY - canvasHUD.offsetTop < 345 ||
            e.touches[0].clientY - canvasHUD.offsetTop > 410){
            mainPlayer.isRightKey = false;
        }
    }

    function checkTurbo (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        if(isMobile && !mainPlayer.gameOver){
            if(btnTurbo.checkTurbo()){
                mainPlayer.isShiftKey = true;
                //canvasTouchHUD.addEventListener('touchmove',checkMoveTurbo,false);
            }
        }
    }
    function checkTurbofalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnTurbo.checkTurbo()){
                mainPlayer.isShiftKey = false;
            }
        }
    }

    function checkMoveTurbo(e){
        if(e.touches[0].clientX - canvasHUD.offsetLeft < 680 ||
            e.touches[0].clientX - canvasHUD.offsetLeft > 775 ||
            e.touches[0].clientY - canvasHUD.offsetTop < 330 ||
            e.touches[0].clientY - canvasHUD.offsetTop > 425){
            mainPlayer.isShiftKey = false;
        }
    }

    function checkShoot (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnShoot.checkShoot()){
                mainPlayer.isSpaceBar = true;
            }
        }
    }
    function checkShootfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnShoot.checkShoot()){
                mainPlayer.isSpaceBar = false;
            }
        }
    }

    function checkLeft (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLeft.checkLeft() && !btnLT.checkLT() && !btnLB.checkLB()){
                mainPlayer.isLeftKey = true;
            }
        }
    }
    function checkLeftfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLeft.checkLeft() && !btnLT.checkLT() && !btnLB.checkLB()){
                mainPlayer.isLeftKey = false;
            }
        }
    }

    function checkLB (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLB.checkLB()){
                mainPlayer.isDownKey = true;
                mainPlayer.isLeftKey = true;
            }
        }
    }
    function checkLBfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLB.checkLB()){
                mainPlayer.isDownKey = false;
                mainPlayer.isLeftKey = false;
            }
        }
    }

    function checkDown (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnDown.checkDown() && !btnRB.checkRB() && !btnLB.checkLB()){
                mainPlayer.isDownKey = true;
            }
        }
    }
    function checkDownfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnDown.checkDown() && !btnRB.checkRB() && !btnLB.checkLB()){
                mainPlayer.isDownKey = false;
            }
        }
    }

    function checkRB (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRB.checkRB()){
                mainPlayer.isDownKey = true;
                mainPlayer.isRightKey = true;
            }
        }
    }
    function checkRBfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRB.checkRB()){
                mainPlayer.isDownKey = false;
                mainPlayer.isRightKey = false;
            }
        }
    }

    function checkRight (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRight.checkRight() && !btnRT.checkRT() && !btnRB.checkRB()){
               // canvasControlsHUD.removeEventListener('touchmove',checkMoveRT,false);
               // startX = e.changedTouches[0].clientX;
                mainPlayer.isRightKey = true;
                document.getElementById('area').innerHTML = 'Touch Type:' + e.type;
            }
        }
    }
    function checkRightfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRight.checkRight() && !btnRT.checkRT() && !btnRB.checkRB()){
                mainPlayer.isRightKey = false;
                document.getElementById('area').innerHTML = 'Touch Type:' + e.type;

            }
        }
    }

    function checkRT (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRT.checkRT()){
             //   canvasControlsHUD.removeEventListener('touchmove',checkMoveR,false);
               // canvasControlsHUD.addEventListener('touchmove',checkMoveRT,false);
                mainPlayer.isUpKey = true;
                mainPlayer.isRightKey = true;
            }
        }
    }

    function checkMoveRT(e){
        if(e.touches[0].clientX - canvasHUD.offsetLeft < 151 ||
            e.touches[0].clientX - canvasHUD.offsetLeft > 205 ||
            e.touches[0].clientY - canvasHUD.offsetTop < 285 ||
            e.touches[0].clientY - canvasHUD.offsetTop > 340){
            mainPlayer.isRightKey = false;
            mainPlayer.isUpKey = false;
        }
    }
    function checkRTfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnRT.checkRT()){
                mainPlayer.isUpKey = false;
                mainPlayer.isRightKey = false;
            }
        }
    }

    function checkUP (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnUP.checkUP() && !btnLT.checkLT() && !btnRT.checkRT()){
                mainPlayer.isUpKey = true;
            }
        }
    }
    function checkUPfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnUP.checkUP() && !btnLT.checkLT() && !btnRT.checkRT()){
                mainPlayer.isUpKey = false;
            }
        }
    }

    function checkLT (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLT.checkLT()){
                mainPlayer.isUpKey = true;
                mainPlayer.isLeftKey = true;
            }
        }
    }
    function checkLTfalse (e){
        var touch = e.changedTouches[0];
        mouseX = touch.pageX - canvasBg.offsetLeft;
        mouseY = touch.pageY - canvasBg.offsetTop;
        e.preventDefault();
        if(isMobile && !mainPlayer.gameOver){
            if(btnLT.checkLT()){
                mainPlayer.isUpKey = false;
                mainPlayer.isLeftKey = false;                }
        }
    }


}
// END OF EVENT FUCTIONS

canvasBgMarginRight = parseInt(getComputedStyle(canvasBg).marginRight);
canvasBgMarginLeft = parseInt(getComputedStyle(canvasBg).marginLeft);
canvasTouchHUD.setAttribute('style','margin-right:' + canvasBgMarginRight + 'px');
canvasControlsHUD.setAttribute('style','margin-left:' + canvasBgMarginLeft + 'px');

