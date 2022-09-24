/*
verticality
arrow keys
boundry

*/
var spaceship;
var astroids = [];
var score;
const lvl1 = 50;
const baseSpeed = .0001
document.addEventListener('keydown', (event) => {
  if (event.key == 'd') {
    spaceship.angle += 100 * Math.PI / 180;
    accelerate(baseSpeed)
  }
  else if (event.key == 'a')
    accelerate(-baseSpeed)
  else if (event.key == 'w')
    acceleratey(-baseSpeed)
  else if (event.key == 's')
    acceleratey(baseSpeed)
  else if (event.key == 'D')
    accelerate(5 * baseSpeed)
  else if (event.key == 'A')
    accelerate(-5 * baseSpeed)
  else if (event.key == 'W')
    acceleratey(-5 * baseSpeed)
  else if (event.key == 'S')
    acceleratey(5 * baseSpeed)
  else if(event.key.toLowerCase()=='e'){
    hyperaccelerate(-0.5)
  }
  else if(event.key.toLowerCase()=='q'){
    hyperaccelerate(2)
  }
}, false);
function startGame() {
  spaceship = new component(30, 50, "spaceship.png", 240, 480, "image");
  spaceship.accel = 0.00;
  score = new component("30px", "Consolas", "black", 10, 240, "text");
  space.start();
  //myGameArea.start();
}

var space = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateSpace, lvl1);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
    this.clear();
    document.getElementById("gameOver").innerHTML = "GAME OVER!";
    //alert("GAME OVER! RESTART?");
    //restart();
  },
  speedUp: function() {
    this.interval = setInterval(updateSpace, lvl1)
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.accelx = 0;
  this.accelSpeedx = 0;
  this.accely = 0;
  this.accelSpeedy = 0;
  this.angle = 0;
  this.update = function() {
    ctx = space.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
      document.getElementById("score").innerHTML = this.text;
    } else if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    }
    else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.restore();
  }
  this.newPos = function() {
    this.accelSpeedx += 0.2 * this.accelx;
    this.accelSpeedy += 0.2 * this.accely;
    this.speedX += 0.4 * this.accelSpeedx;
    this.speedY += 0.4 * this.accelSpeedy;
    this.x += 0.8 * this.speedX;
    this.y += 0.8 * this.speedY;
    this.hitBottom();
    console.log(this.accelx);
    console.log(this.accelSpeedx);
    console.log(this.speedX);
  }
  this.hitBottom = function() {
    var rockbottom = space.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.accelSpeedy = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.accelSpeedy = 0;
    }
    var right = space.canvas.width - this.width;
    if (this.x > right) {
      stop()
      this.x = right;
      this.accelSpeedx = -1;
    }
    if (this.x < 0) {
      stop();
      this.x = 0;
      this.accelSpeedx = 1;
    }

  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if (otherobj.type == "circle"){
      var distX = Math.abs(otherobj.x - this.x-this.width/2);
      var distY = Math.abs(otherobj.y - this.y-this.height/2);
      if (distX > (this.width/2 + otherobj.r)) {
        return false; 
      }
      if (distY > (this.height/2 + otherobj.r)) {
        return false; 
      }
      if (distX <= (this.width/2)) {
        return true; 
      } 
      var dx=distX-this.width/2;
      var dy=distY-this.height/2;
      return (dx*dx+dy*dy<=(otherobj.radius*otherobj.radius));
    } else if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function componentCircle(radius, color, x, y) {
  this.type = "circle";
  this.image = new Image();
  this.image.src = color;
  this.radius = radius;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.accelx = 0;
  this.accelSpeedx = 0;
  this.accely = 0;
  this.accelSpeedy = 0;
  this.angle = 0;
  this.update = function() {
    ctx = space.context;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.restore();
  }
  this.newPos = function() {
    this.accelSpeedx += 0.2 * this.accelx;
    this.accelSpeedy += 0.2 * this.accely;
    this.speedX += 0.4 * this.accelSpeedx;
    this.speedY += 0.4 * this.accelSpeedy;
    this.x += 0.8 * this.speedX;
    this.y += 0.8 * this.speedY;
    console.log(this.accelx);
    console.log(this.accelSpeedx);
    console.log(this.speedX);
  }
}


function updateSpace() {
  var y, width, gap, minWidth, maxWidth, minGap, maxGap;
  for (i = 0; i < astroids.length; i += 1) {
    if (spaceship.crashWith(astroids[i])) {
      space.stop();
      return;
    }
  }
  space.clear();
  space.frameNo += 1;
  var start = true;
  if (space.frameNo == 1 || everyinterval(100)) {
    y = space.canvas.height;
    if (start) {
      y = space.canvas.height / 10;
      start = false;
    }
    minWidth = 9;
    maxWidth = 150;
    minGap = 20;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    var randomInt = 0;
    if (gap < 50) {
      randomInt = Math.random() * 10 + 60
    }
    var choice = Math.floor(Math.random() * 2);
    if (choice > 0) {
      width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      astroids.push(new componentCircle(width / 1.5, "fallingMeteor.png", Math.floor(Math.random() * 20) + 200 + randomInt, -(y + 20)));
      width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      astroids.push(new componentCircle(width / 1.5, "fallingMeteor.png", 480 - width - randomInt, -y));
    }
    else {
      width = Math.floor(Math.random() * (maxWidth - minWidth + 2) + minWidth + 1);
      astroids.push(new componentCircle(width / 1.4, "fallingMeteor.png", Math.floor(Math.random() * 10) + 25 + randomInt, -y));
    }
  }
  for (i = 0; i < astroids.length; i += 1) {
    astroids[i].y += 1;
    astroids[i].update();
  }
  score.text = "SCORE: " + space.frameNo;
  score.update();
  spaceship.newPos();
  spaceship.update();
  if (space.framNo % 1000) {
    space.speedup();
  }
}

function everyinterval(n) {
  if ((space.frameNo / n) % 1 == 0) { return true; }
  return false;
}

function accelerate(n) {
  spaceship.accelx = Math.log(n + 1);
}
function acceleratey(n) {
  spaceship.accely = Math.log(n + 1);
}
function hyperaccelerate(n) {
  spaceship.accelx *= n;
  spaceship.accely *= n;
}
/*var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -1; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 1; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 1; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -1; }
    myGamePiece.newPos();
    myGamePiece.update();
}*/
function stop() {
  space.stop();
  while (astroids.length > 0) {
    astroids.pop();
  }
  spaceship.remove();
  clearInterval(space.interval);
  space.clear();
  score.text="SCORE: " + space.frameNo;
  score.update();
  return;
}
function restart() {
  while (astroids.length > 0) {
    astroids.pop();
  }
  space.clear();
  clearInterval(space.interval);
  document.getElementById("gameOver").innerHTML = `<button onmousedown="hyperaccelerate(1.5)" id="accelerateButton">ACCELERATE</button>
    <button onmousedown="hyperaccelerate(-0.000000001)" id="accelerateButton">BRAKE</button>
    <p>Use the ACCELERATE button to speed up</p>
    <p>Use the BRAKE button to slow down</p>
    <p>How long can you stay alive?</p>`
  startGame();
}