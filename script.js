var spaceship;
var asteroids = [];
var score;
var lvl1;
var lvl;
const baseSpeed = 2
const startbutton = document.querySelector("button");
var background;
var backSound;
var explodeSound;
var startSound;
var pauseSound;
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
  else if (event.key.toLowerCase() == 'e') {
    hyperaccelerate(-0.5)
  }
  else if (event.key.toLowerCase() == 'q') {
    hyperaccelerate(2)
  }
}, false);
function startGame() {
  lvl1 = 50;
  lvl = 1;
  startSound = new sound("start3.mp3");
  startSound.play();
  //document.getElementById("start")=;
  document.getElementById("score").innerHTML = 0;
  while (asteroids.length > 0) {
    asteroids.pop();
  }
  explosionSound = new sound("shortex.mp3");
  pauseSound = new sound("pause2.mp3");
  document.getElementById("gameOver").innerHTML = `<div style = "position:relative; left:300%; top:50px; class="logo"><img class = "logo" src="meatball(2).png" alt="something" /></div>
      <div style = "position:relative; right:300%; bottom:50px; class="logo"><img class = "logo" src="meatball(4).png" alt="something" /></div>
      <div style = "position:absolute; bottom: 50%px;">
      <p>Use WASD to move</p>
      <p>Avoid the asteroids and sides</p>  
      <p>How long can you stay alive?</p>
    </div>`;
  document.getElementById("start").innerHTML = `<button onclick = "restart()"> START </button>`;
  spaceship = new component(40, 50, "airship(4).png", 230, 480, "image");
  //spaceship = new component(40, 50, "first_explosion(1).png",240,480, "image");
  spaceship.accel = 0.00;
  score = new component("30px", "Consolas", "yellow", 180, 240, "text");
  backSound = new sound("mixkit-space-rocket-full-power-turbine-1720.mp3");
  backSound.stop();
  backSound.play();
  space.start();
}

var space = {
  canvas: document.createElement("canvas"),

  start: function() {
    clearInterval(this.interval);
    this.canvas.width = 480;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.getElementById("start").after(this.canvas);
    background = new component(480, 480, "space.png", 0, 0, "image");
    //background.src = "space.png";

    // Make sure the image is loaded first otherwise nothing will draw.
    /*background.onload = function() {
      ctx.drawImage(background, 0, 0);
    }*/
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.frameNo = 0;
    this.interval = setInterval(updateSpace, lvl1);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  },
  speedUp: function() {
    lvl++;
    lvl1 = lvl1 / 1.1;
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
      //  ctx.fillText(this.text, this.x, this.y);
      document.getElementById("score").innerHTML = this.text;
    } else if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.restore();
  }
  this.newPos = function() {
    this.x += this.accelx//0.25 * this.speedX;
    this.y += this.accely//0.8 * this.speedY;
    this.hitBottom();
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
    if (otherobj.type == "circle") {
      var distX = Math.abs(otherobj.x - this.x - this.width / 2);
      var distY = Math.abs(otherobj.y - this.y - this.height / 2);
      var dx = distX - this.width / 2;
      var dy = distY - this.height / 2;
      return (dx * dx + dy * dy <= (otherobj.radius * otherobj.radius));
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
    ctx.lineWidth = 0.1;
    ctx.drawImage(this.image, this.x - 1.25 * radius, this.y - 1.25 * radius, 2.5 * radius, 2.5 * radius);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.restore();
  }
  this.newPos = function() {
    this.x += accelx//16 * this.speedX;
    this.y += accely//0.8 * this.speedY;
    this.hitBottom = function() {
      if (this.y < -50) {
        this.pop();

      }
    }
  }
}


function updateSpace() {
  backSound.play();
  var y, width, gap, minWidth, maxWidth, minGap, maxGap;
  for (i = 0; i < asteroids.length; i += 1) {
    if (spaceship.crashWith(asteroids[i])) {
      stop();
      return;
    }
  }
  space.clear();
  background.update();
  space.frameNo += 1;
  var start = true;
  if (space.frameNo == 1 || everyinterval(50)) {
    y = space.canvas.height;
    if (start) {
      y = space.canvas.height / 10;
      start = false;
    }
    minWidth = 20;
    maxWidth = 100;
    minGap = 20;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    var randomInt = 0;
    if (gap < 50) {
      randomInt = Math.random() * 10 + 60
    }
    choice = Math.floor(Math.random() * 2);
    if (choice > 0) {
      width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      asteroids.push(new componentCircle(width / 1.5, ranArt(), Math.floor(Math.random() * 20) + 200 + randomInt, -(y + 20)));
      width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      asteroids.push(new componentCircle(width / 1.5, ranArt(), 480 - width - randomInt, -y));
    }
    else {
      width = Math.floor(Math.random() * (maxWidth - minWidth + 2) + minWidth + 1);
      asteroids.push(new componentCircle(width / 1.4, ranArt(), Math.floor(Math.random() * 10) + 25 + randomInt, -y));
    }
  }
  for (i = 0; i < asteroids.length; i += 1) {
    asteroids[i].y += space.frameNo / 200 + 1;
    asteroids[i].update();
  }
  score.text = "SCORE: " + space.frameNo;
  score.update();
  spaceship.newPos();
  spaceship.update();
  if (space.frameNo > 100 * lvl) {
    space.speedUp();
  }
}

function everyinterval(n) {
  if ((space.frameNo / n) % 1 == 0) { return true; }
  return false;
}

function accelerate(n) {
  spaceship.accelx = n;
}
function acceleratey(n) {
  spaceship.accely = n;
}
function hyperaccelerate(n) {
  spaceship.accelx *= n;
  spaceship.accely *= n;
}
function stop() {
  backSound.stop();
  explosionSound.play();
  e1 = new component(spaceship.width, spaceship.height, "first_explosion(1).png", spaceship.x, spaceship.y, "image");
  setTimeout(() => { e1.update(); }, 500);
  e2 = new component(spaceship.width, spaceship.height, "second_explosion.png", spaceship.x, spaceship.y, "image");
  setTimeout(() => { e2.update(); }, 1000);
  setTimeout(() => { e1.update(); }, 1500);
  setTimeout(() => { e2.update(); }, 2000);
  setTimeout(() => { e1.update(); }, 2500);
  ee = new component(spaceship.width, spaceship.height, "third_explosion(1).png", spaceship.x, spaceship.y, "image");
  //ee.update();
  setTimeout(() => { ee.update(); }, 3000)
  space.stop();
  while (asteroids.length > 0) {
    asteroids.pop();
  }
  document.getElementById("gameOver").innerHTML = "GAME OVER!";
  //score.text = "SCORE: " + space.frameNo;
  //score.update();
  return;
}
var paused = false;
function pause() {
  if (!paused) {
    backSound.stop();
    pauseSound.play();
    clearInterval(space.interval);
    paused = true;
  }
  else {
    backSound.play();
    pauseSound.play();
    space.interval = setInterval(updateSpace, lvl1);
    paused = false;
  }
}
function ranArt() {
  artChoice = Math.floor(Math.random() * 4);
  if (artChoice < 2) {
    art = "meatball(2).png"
  } else {
    art = "meatball(4).png"
  }
  return art;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}
function restart() {
  /*document.getElementById("gameOver").innerHTML = `<p>Use WASD to move</p>
      <p>Avoid the asteroids</p>
      <p>How long can you stay alive?</p>`;
  space.stop();
  while (asteroids.length > 0) {
    asteroids.pop();
  }
  space.clear();
  clearInterval(space.interval);*/
  paused = false;
  backSound.stop();
  startGame();
}

