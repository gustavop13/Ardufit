// Gustavo Placencia Carranza
// Adapted from p5.js Serial library

var serial;
var portName = "/dev/cu.usbmodem142101";//"/dev/cu.HC-05-DevB";
var textXpos = 10;
let img;
let tracker;

var a = 0;
var c = 0;
var n = false;

function preload() {
  img = loadImage('https://cdn4.iconfinder.com/data/icons/circus-icons-set-cartoon-style/512/a217-512.png');
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.style('display', 'block');
  canvas.style('margin-left', 'auto');
  canvas.style('margin-right', 'auto');
  tracker = select('#points');
  serial = new p5.SerialPort();
  //serial.list();
  serial.open(portName);
  //serial.on('list', gotList);
  serial.on('data', gotData);
  angleMode(DEGREES);
  textSize(30);
}

// Got the list of ports
function gotList(thelist) {
  println("List of Serial Ports:");
  for (var i = 0; i < thelist.length; i++) {
    println(i + " " + thelist[i]);
  }
}

function gotData() {
  var currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  //console.log(currentString);
  if (!isNaN(currentString)) {
    a = currentString;
  }
}

function draw() {
  background(220);
  fill(0);
	translate(width/2, height/2);
	rotate(a);
	imageMode(CENTER);
	image(img, 0, 0);
  tracker.elt.value=c;
	if(a > -10) {
		fill(0, 255, 0);
    if(n) {
      c++;
      n = false;
    }
	} else {
		fill(255, 0, 0);
    n = true;
	}
	rect(60, 60, 50, 50);
}
