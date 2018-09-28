"use strict";

function FlipDown(t, el) {
  this.version = '0.1.3';
  this.initialised = false;
  this.now = this.getTime();
  this.epoch = t;
  this.countdownEnded = this.epoch - this.now < 0;
  this.element = document.getElementById(el);
  this.rotors = [];
  this.rotorLeafFront = [];
  this.rotorLeafRear = [];
  this.rotorTops = [];
  this.rotorBottoms = [];
  this.countdown = null;
  this.daysRemaining = 0;
  this.clockValues = {};
  this.clockStrings = {};
  this.clockValuesAsString = [];
  this.prevClockValuesAsString = [];
  console.log('FlipDown ' + this.version);
}

FlipDown.prototype.start = function () {
  if (!this.initialised) this.init();
  this.countdown = setInterval(this.tick.bind(this), 1000);
  return this;
};

FlipDown.prototype.ifEnded = function (cb) {
  cb();
  return this;
};

FlipDown.prototype.getTime = function () {
  return new Date().getTime() / 1000;
};

FlipDown.prototype.init = function () {
  this.initialised = true;

  if (this.countdownEnded) {
    this.daysremaining = 0;
  } else {
    this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
  }

  var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

  for (var i = 0; i < dayRotorCount + 6; i++) {
    this.rotors.push(this.createRotor(0));
  }

  var dayRotors = [];

  for (var i = 0; i < dayRotorCount; i++) {
    dayRotors.push(this.rotors[i]);
  }

  this.element.appendChild(this.createRotorGroup(dayRotors));
  var count = dayRotorCount;

  for (var i = 0; i < 3; i++) {
    var otherRotors = [];

    for (var j = 0; j < 2; j++) {
      otherRotors.push(this.rotors[count]);
      count++;
    }

    this.element.appendChild(this.createRotorGroup(otherRotors));
  }

  this.rotorLeafFront = Array.from(document.getElementsByClassName('rotor-leaf-front'));
  this.rotorLeafRear = Array.from(document.getElementsByClassName('rotor-leaf-rear'));
  this.rotorTop = Array.from(document.getElementsByClassName('rotor-top'));
  this.rotorBottom = Array.from(document.getElementsByClassName('rotor-bottom'));
  this.tick();
  this.updateClockValues(true);
  return this;
};

FlipDown.prototype.createRotorGroup = function (rotors) {
  var rotorGroup = document.createElement('div');
  rotorGroup.className = 'rotor-group';
  var dayRotorGroupHeading = document.createElement('div');
  dayRotorGroupHeading.className = 'rotor-group-heading';
  rotorGroup.appendChild(dayRotorGroupHeading);
  appendChildren(rotorGroup, rotors);
  return rotorGroup;
};

FlipDown.prototype.createRotor = function (v) {
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
};

FlipDown.prototype.tick = function () {
  this.now = this.getTime();
  var diff = this.epoch - this.now <= 0 ? 0 : this.epoch - this.now;
  this.clockValues.d = Math.floor(diff / 86400);
  diff -= this.clockValues.d * 86400;
  this.clockValues.h = Math.floor(diff / 3600);
  diff -= this.clockValues.h * 3600;
  this.clockValues.m = Math.floor(diff / 60);
  diff -= this.clockValues.m * 60;
  this.clockValues.s = Math.floor(diff);
  this.updateClockValues();
};

FlipDown.prototype.updateClockValues = function () {
  var _this = this;

  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  this.clockStrings.d = pad(this.clockValues.d, 2);
  this.clockStrings.h = pad(this.clockValues.h, 2);
  this.clockStrings.m = pad(this.clockValues.m, 2);
  this.clockStrings.s = pad(this.clockValues.s, 2);
  this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split('');
  this.rotorLeafFront.forEach(function (el, i) {
    el.textContent = _this.prevClockValuesAsString[i];
  });
  this.rotorBottom.forEach(function (el, i) {
    el.textContent = _this.prevClockValuesAsString[i];
  });

  function rotorTopFlip() {
    var _this2 = this;

    this.rotorTop.forEach(function (el, i) {
      if (el.textContent != _this2.clockValuesAsString[i]) {
        el.textContent = _this2.clockValuesAsString[i];
      }
    });
  }

  function rotorLeafRearFlip() {
    var _this3 = this;

    this.rotorLeafRear.forEach(function (el, i) {
      if (el.textContent != _this3.clockValuesAsString[i]) {
        el.textContent = _this3.clockValuesAsString[i];
        el.parentElement.classList.add('flipped');
        var flip = setInterval(function () {
          el.parentElement.classList.remove('flipped');
          clearInterval(flip);
        }.bind(_this3), 500);
      }
    });
  }

  if (!init) {
    setTimeout(rotorTopFlip.bind(this), 500);
    setTimeout(rotorLeafRearFlip.bind(this), 500);
  } else {
    rotorTopFlip.call(this);
    rotorLeafRearFlip.call(this);
  }

  this.prevClockValuesAsString = this.clockValuesAsString;
};

function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

function appendChildren(parent, children) {
  children.forEach(function (el) {
    parent.appendChild(el);
  });
}
