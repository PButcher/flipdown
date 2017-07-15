/**
* @name FlipDown
* @version 0.1.0
* @description Flip styled countdown clock
* @author Peter Butcher (PButcher) <pbutcher93[at]gmail[dot]com>
**/
function FlipDown(t, el) {

  // FlipDown Version
  this.version = '0.1.0';

  // Time at instantiation in seconds
  this.now = new Date().getTime() / 1000;

  // UTS to count down to
  this.epoch = t;

  // FlipDown DOM element
  this.element = document.getElementById(el);

  // Rotor DOM elements
  this.rotors = [];
  this.rotorLeafFront = [];
  this.rotorLeafRear = [];
  this.rotorTops = [];
  this.rotorBottoms = [];

  // Interval
  this.countdown = null;

  // Number of days remaining
  this.daysRemaining = 0;

  // Clock values as numbers
  this.clockValues = {};

  // Clock values as strings
  this.clockStrings = {};

  // Clock values as array
  this.clockValuesAsString = [];
  this.prevClockValuesAsString = [];

  // Print Version
  console.log('FlipDown ' + this.version);
}

/**
* @name FlipDown.prototype.start
* @description Start the countdown
* @author PButcher
**/
FlipDown.prototype.start = function() {

  // Initialise the clock
  this.init();

  // Set up the countdown interval
  this.countdown = setInterval(this.tick.bind(this), 1000);
}

/**
* @name FlipDown.prototype.init
* @description Initialise the countdown
* @author PButcher
**/
FlipDown.prototype.init = function() {
  this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
  var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

  // Create and store rotors
  for(var i = 0; i < dayRotorCount + 6; i++) {
    this.rotors.push(this.createRotor(0));
  }

  // Create day rotor group
  var dayRotors = [];
  for(var i = 0; i < dayRotorCount; i++) {
    dayRotors.push(this.rotors[i]);
  }
  this.element.appendChild(this.createRotorGroup(dayRotors));

  // Create other rotor groups
  var count = dayRotorCount;
  for(var i = 0; i < 3; i++) {
    var otherRotors = [];
    for(var j = 0; j < 2; j++) {
      otherRotors.push(this.rotors[count]);
      count++;
    }
    this.element.appendChild(this.createRotorGroup(otherRotors));
  }

  this.rotorLeafFront = Array.from(
    document.getElementsByClassName('rotor-leaf-front')
  );
  this.rotorLeafRear = Array.from(
    document.getElementsByClassName('rotor-leaf-rear')
  );
  this.rotorTop = Array.from(
    document.getElementsByClassName('rotor-top')
  );
  this.rotorBottom = Array.from(
    document.getElementsByClassName('rotor-bottom')
  );

  // Set initial values;
  this.tick();
  this.updateClockValues();
}

/**
* @name FlipDown.prototype.createRotorGroup
* @param rotors {array}
* @description Add rotors to the DOM
* @author PButcher
**/
FlipDown.prototype.createRotorGroup = function(rotors) {
  var rotorGroup = document.createElement('div');
  rotorGroup.className = 'rotor-group';
  var dayRotorGroupHeading = document.createElement('div');
  dayRotorGroupHeading.className = 'rotor-group-heading';
  rotorGroup.appendChild(dayRotorGroupHeading);
  appendChildren(rotorGroup, rotors);
  return rotorGroup;
}

/**
* @name FlipDown.prototype.createRotor
* @description Create a rotor DOM element
* @author PButcher
**/
FlipDown.prototype.createRotor = function(v) {
  var rotor = document.createElement('div');
  var rotorLeaf = document.createElement('div');
  var rotorLeafRear = document.createElement('figure');
  var rotorLeafFront = document.createElement('figure');
  var rotorTop = document.createElement('div');
  var rotorBottom = document.createElement('div');
  rotor.className = 'rotor';
  rotorLeaf.className = 'rotor-leaf';
  rotorLeafRear.className = 'rotor-leaf-rear';
  rotorLeafFront.className = 'rotor-leaf-front';
  rotorTop.className = 'rotor-top';
  rotorBottom.className = 'rotor-bottom';
  rotorLeafRear.textContent = v;
  rotorTop.textContent = v;
  rotorBottom.textContent = v;
  appendChildren(rotor, [rotorLeaf, rotorTop, rotorBottom]);
  appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
  return rotor;
}

/**
* @name FlipDown.prototype.tick
* @description Calculate current tick
* @author PButcher
**/
FlipDown.prototype.tick = function() {

  // Get time now
  this.now = new Date().getTime() / 1000;

  // Between now and epoch
  var diff = this.epoch - this.now;

  // Days remaining
  this.clockValues.d = Math.floor(diff / 86400);
  diff -= this.clockValues.d * 86400;

  // Hours remaining
  this.clockValues.h = Math.floor(diff / 3600);
  diff -= this.clockValues.h * 3600;

  // Minutes remaining
  this.clockValues.m = Math.floor(diff / 60);
  diff -= this.clockValues.m * 60;

  // Seconds remaining
  this.clockValues.s = Math.floor(diff);

  // Update clock values
  this.updateClockValues();
}

/**
* @name FlipDown.prototype.updateClockValues
* @description Update the clock face values
* @author PButcher
**/
FlipDown.prototype.updateClockValues = function() {

  // Build clock value strings
  this.clockStrings.d = pad(this.clockValues.d, 2);
  this.clockStrings.h = pad(this.clockValues.h, 2);
  this.clockStrings.m = pad(this.clockValues.m, 2);
  this.clockStrings.s = pad(this.clockValues.s, 2);

  // Concat clock value strings
  this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split('');

  this.rotorBottom.forEach((el, i) => {
    el.textContent = this.prevClockValuesAsString[i];
  });

  // Update rotor values
  this.rotorLeafFront.forEach((el, i) => {
    el.textContent = this.prevClockValuesAsString[i];
  });

  setTimeout(function() {
    this.rotorTop.forEach((el, i) => {
      if(el.textContent != this.clockValuesAsString[i]) {
        el.textContent = this.clockValuesAsString[i];
      }
    });
  }.bind(this), 500);

  setTimeout(function() {
    this.rotorLeafRear.forEach((el, i) => {
      if(el.textContent != this.clockValuesAsString[i]) {
        el.textContent = this.clockValuesAsString[i];
        el.parentElement.classList.add('flipped');
        var flip = setInterval(function() {
          el.parentElement.classList.remove('flipped');
          clearInterval(flip);
        }.bind(this), 500);
      }
    });
  }.bind(this), 500);

  // Save a copy of clock values for next tick
  this.prevClockValuesAsString = this.clockValuesAsString;
}

/**
* @name pad
* @description Prefix a number with zeroes
* @author PButcher
**/
function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

/**
* @name appendChildren
* @description Add multiple children to an element
* @author PButcher
**/
function appendChildren(element, children) {
  children.forEach(el => {
    element.appendChild(el);
  });
}
