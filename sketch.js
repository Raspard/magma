var myVar;
var termino = false;

let objs = [];
let objsNum = 360;
const noiseScale = 0.01;
let R;
let maxR;
let t = 0;
let nt = 0;
let nR = 0;
let nTheta = 1000;
const palette = ["#ffdb00", "#ff5e0f", "#ee7b06", "#FFF","#F00"];

function setup() {
  createMetaTag();
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES);
  noStroke();
  frameRate(30);
  maxR = max(width, height) * 0.45;
}

function isReady(){
 return true;
}

function myFunction() {
  if(termino || isReady()){
  myVar = setTimeout(showPage, 100);}
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

function draw() {

  if(window.innerWidth>700){
   dibujo();
  }
  else{dibujo_mobil();noLoop();
  }
}

function dibujo(){
  let R = map(noise(nt * 0.01, nR), 0, 1, 0, maxR);
  let t = map(noise(nt * 0.001, nTheta), 0, 1, -360, 360);
  let x = R * cos(t) + width / 2;
  let y = R * sin(t) + height / 2;
  
 if(objs.length>30){}else{objs.push(new Obj(x, y));}
  if (mouseIsPressed) {
    feed();
    objs.push(new Obj(mouseX, mouseY));
  }
  
  for (let i = 0; i < objs.length; i++) {
    objs[i].move();
    objs[i].display();
  }

  for (let j = objs.length - 1; j >= 0; j--) {
    if (objs[j].isFinished()) {
      objs.splice(j, 1);
    }
  }
  
nt++;
lastImg = get();
isReady();

} 


function dibujo_mobil(){

for(let i=0; i < 800; i++){
  let R = map(noise(nt * 0.01, nR), 0, 1, 0, maxR);
  let t = map(noise(nt * 0.001, nTheta), 0, 1, -360, 360);
  let x = R * cos(t) + width / 2;
  let y = R * sin(t) + height / 2;
  objs.push(new Obj(x, y));
  for (let i = 0; i < objs.length; i++) {
    objs[i].move();
    objs[i].display();
  }
  for (let j = objs.length - 1; j >= 0; j--) {
    if (objs[j].isFinished()) {
      objs.splice(j, 1);
    }
  }
  nt++;
  }
  noLoop();
 termino = true;
} 

function feed(){
     if (lastImg) {
    tint(255,255,255, 20);
    image(lastImg,-2,-2,width+5,height+4);
  }
}

class Obj {
  constructor(ox, oy) {
    this.init(ox, oy);
  }

  init(ox, oy) {
    this.vel = createVector(0, 0);
    this.pos = createVector(ox, oy);
    this.t = random(0, noiseScale);
    this.lifeMax = random(20, 50);
    this.life = this.lifeMax;
    this.step = random(0.1, 5);
    this.dMax = random(10) >= 5 ? 10 : 30;
    this.d = this.dMax;
    this.c = color(random(palette));
  }

  move() {
    let theta = map(noise(this.pos.x * noiseScale, this.pos.y * noiseScale, this.t), 0, 1, -360, 360);
    this.vel.x = cos(theta);
    this.vel.y = sin(theta);
    this.pos.add(this.vel);
  }

  isFinished() {
    this.life -= this.step;
    this.d = map(this.life, 0, this.lifeMax, 0, this.dMax);
    if (this.life < 0) {
      return true;
    } else {
      return false;
    }
  }

  display() {

   fill(0);
  circle(this.pos.x+50, this.pos.y-50, 1);
  fill(this.c);
  circle(this.pos.x, this.pos.y, random(2,12));
  circle(this.pos.x+10, this.pos.y+10, random(4,20));
  circle(this.pos.x+10, this.pos.y-10, random(5,10));
  fill(0);
  circle(this.pos.x-50, this.pos.y+50, 1);
  }
}

function func(t, num) {
  let a = 360 / num;
  let A = cos(a);
  let b = acos(cos(num * t));
  let B = cos(a - b / num);

  return A / B;
}

function createMetaTag() {
  let meta = createElement('meta');
  meta.attribute('name', 'viewport');
  meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');

  let head = select('head');
  meta.parent(head);
}
