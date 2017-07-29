
$(function() {
	// ----------------------Custom JS-------------------------//

	//-----------------------Text-Typing-----------------------//
	var
  words = ['Hi, my name is Ant','I like WEB','Here I can translate','my ideas into reality'],
  part,
  i = 0,
  offset = 0,
  len = words.length,
  forwards = true,
  skip_count = 0,
  skip_delay = 5,
  speed = 100;

var wordflick = function(){
  setInterval(function(){
      if (forwards) {
        if(offset >= words[i].length){
          ++skip_count;
          if (skip_count == skip_delay) {
            forwards = false;
            skip_count = 0;
          }
        }
      }
      else {
         if(offset == 0){
            forwards = true;
            i++;
            offset = 0;
            if(i >= len){
              i=0;
            } 
         }
      }
      part = words[i].substr(0, offset);
      if (skip_count == 0) {
        if (forwards) {
          offset++;
        }
        else {
          offset--;
        }
      }
    	$('.word').text(part);
  },speed);
};

$(document).ready(function(){
  wordflick();
});
	// ----------------------welcome-canvas--------------------//
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var shapes = [];
var num = 50;

var staticXpos;
var staticYpos;

var opt = {
  shapecolor: "#666",
  radius: 2,
  distance: 200,
  circleopacity: 1,
  speed: .5
};

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
addEventListener('resize', function() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});
//helper functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearcanvas() {
  ctx.clearRect(0, 0, w, h);
}

function getCords(e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function createShapes(Xpos, Ypos) {
  this.x = Xpos ? Xpos : random(0, w);
  this.y = Ypos ? Ypos : random(0, h);
  this.speed = opt.speed;
  this.vx = Math.cos(random(0, 360)) * this.speed;
  this.vy = Math.sin(random(0, 360)) * this.speed;
  this.r = opt.radius;
  this.color = opt.shapecolor;
  this.opacity = opt.circleopacity;
  this.draw = function() {
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = this.opacity;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

  };
  this.move = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= w || this.x <= 0) {
      this.vx *= -1;
    }
    if (this.y >= h || this.y <= 0) {
      this.vy *= -1;
    }
    this.x > w ? this.x = w : this.x;
    this.y > h ? this.y = h : this.y;
    this.x < 0 ? this.x = 0 : this.x;
    this.y < 0 ? this.y = 0 : this.y;
  };
}

function check(point1, rest) {
  for (var j = 0; j < rest.length; j++) {
    var yd = point1.y - rest[j].y;
    var xd = point1.x - rest[j].x;
    var d = Math.sqrt(xd * xd + yd * yd);
    if (d < opt.distance) {
      ctx.beginPath();
      ctx.globalAlpha = (1 - (d / opt.distance));
      ctx.globalCompositeOperation = 'destination-over';
      ctx.lineWidth = 1;
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(rest[j].x, rest[j].y);
      ctx.strokeStyle = opt.shapecolor;
      ctx.lineCap = "round";
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function loop() {
  clearcanvas();
  shapes[0].x = staticXpos;
  shapes[0].y = staticYpos;
  shapes[0].move();
  shapes[0].draw();
  for (var i = 1; i < shapes.length; i++) {
    shapes[i].move();
    shapes[i].draw();
    check(shapes[i], shapes);
  }
  window.requestAnimationFrame(loop);
}

function init() {
  for (var i = 0; i < num; i++) {
    shapes.push(new createShapes());
  }
  window.requestAnimationFrame(loop);
}

//events
canvas.addEventListener('mousemove', function(e) {
  var pos = getCords(e);
  staticXpos = pos.x;
  staticYpos = pos.y;
});
canvas.addEventListener('click', function(e) {
  var pos = getCords(e);
  shapes.push(new createShapes(pos.x, pos.y));
});
canvas.addEventListener("contextmenu", function(e) {
  e.preventDefault();
  shapes.splice(shapes.length - 1, 1);
});

init();
// ----------------------welcome-canvas END--------------------//


});

