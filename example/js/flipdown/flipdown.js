"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FlipDown = function () {
  function FlipDown(uts) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flipdown';
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, FlipDown);

    if (typeof uts !== 'number') {
      throw new Error("FlipDown: Constructor expected unix timestamp, got ".concat(_typeof(uts), " instead."));
    }

    if (_typeof(el) === 'object') {
      opt = el;
      el = 'flipdown';
    }

    this.version = '0.2.2';
    this.initialised = false;
    this.now = this._getTime();
    this.epoch = uts;
    this.outs = null;
    this.countdownEnded = false;
    this.countdownOccured = false;
    this.hasEndedCallback = null;
    this.hasOccuredCallback = null;
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
    this.opts = this._parseOptions(opt);

    this._setOptions();

    console.log("FlipDown ".concat(this.version, " (Theme: ").concat(this.opts.theme, ")"));
  }

  _createClass(FlipDown, [{
    key: "start",
    value: function start() {
      if (!this.initialised) this._init();
      this.countdown = setInterval(this._tick.bind(this), 1000);
      return this;
    }
  }, {
    key: "ifEnded",
    value: function ifEnded(cb) {
      this.hasEndedCallback = function () {
        cb();
        this.hasEndedCallback = null;
      };

      return this;
    }
  }, {
    key: "ifOccured",
    value: function ifOccured(outs, cb) {
      this.outs = outs;

      this.hasOccuredCallback = function () {
        cb();
        this.hasOccuredCallback = null;
      };

      return this;
    }
  }, {
    key: "_getTime",
    value: function _getTime() {
      return new Date().getTime() / 1000;
    }
  }, {
    key: "_hasCountdownEnded",
    value: function _hasCountdownEnded() {
      if (this.epoch - this.now < 0) {
        this.countdownEnded = true;

        if (this.hasEndedCallback != null) {
          this.hasEndedCallback();
          this.hasEndedCallback = null;
        }

        return true;
      } else {
        this.countdownEnded = false;
        return false;
      }
    }
  }, {
    key: "_hasCountdownEventOccured",
    value: function _hasCountdownEventOccured() {
      if (this.outs - this.now < 0) {
        this.countdownOccured = true;

        if (this.hasOccuredCallback != null) {
          this.hasOccuredCallback();
          this.hasOccuredCallback = null;
        }

        return true;
      } else {
        this.countdownOccured = false;
        return false;
      }
    }
  }, {
    key: "_parseOptions",
    value: function _parseOptions(opt) {
      return {
        theme: opt.hasOwnProperty('theme') ? opt.theme : 'dark',
        showHeaders: opt.hasOwnProperty('showHeaders') ? opt.showHeaders : true,
        showEmptyRotors: opt.hasOwnProperty('showEmptyRotors') ? opt.showEmptyRotors : true
      };
    }
  }, {
    key: "_setOptions",
    value: function _setOptions() {
      var _this = this;

      this.opts.theme.split(',').forEach(function (theme) {
        return _this.element.classList.add("flipdown__theme-".concat(theme));
      });
    }
  }, {
    key: "_init",
    value: function _init() {
      this.initialised = true;

      if (this._hasCountdownEnded()) {
        this.daysremaining = 0;
      } else {
        this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
      }

      var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

      for (var i = 0; i < dayRotorCount + 6; i++) {
        this.rotors.push(this._createRotor(0));
      }

      var dayRotors = [];

      for (var i = 0; i < dayRotorCount; i++) {
        dayRotors.push(this.rotors[i]);
      }

      this.element.appendChild(this._createRotorGroup(dayRotors, 'day'));
      var count = dayRotorCount;
      var periods = ['hour', 'minute', 'second'];

      for (var i = 0; i < 3; i++) {
        var otherRotors = [];

        for (var j = 0; j < 2; j++) {
          otherRotors.push(this.rotors[count]);
          count++;
        }

        this.element.appendChild(this._createRotorGroup(otherRotors, periods[i]));
      }

      this.rotorLeafFront = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-leaf-front'));
      this.rotorLeafRear = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-leaf-rear'));
      this.rotorTop = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-top'));
      this.rotorBottom = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-bottom'));

      this._tick();

      this._updateClockValues(true);

      return this;
    }
  }, {
    key: "_createRotorGroup",
    value: function _createRotorGroup(rotors, period) {
      var rotorGroup = document.createElement('div');
      rotorGroup.className = 'rotor-group rotor-period-' + period;

      if (this.opts.showHeaders) {
        var rotorGroupHeading = document.createElement('div');
        rotorGroupHeading.className = 'rotor-group-heading';
        rotorGroup.appendChild(rotorGroupHeading);
      }

      appendChildren(rotorGroup, rotors);
      return rotorGroup;
    }
  }, {
    key: "_createRotor",
    value: function _createRotor() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
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
  }, {
    key: "_tick",
    value: function _tick() {
      this.now = this._getTime();
      var diff = this.epoch - this.now <= 0 ? 0 : this.epoch - this.now;
      this.clockValues.d = Math.floor(diff / 86400);
      diff -= this.clockValues.d * 86400;
      this.clockValues.h = Math.floor(diff / 3600);
      diff -= this.clockValues.h * 3600;
      this.clockValues.m = Math.floor(diff / 60);
      diff -= this.clockValues.m * 60;
      this.clockValues.s = Math.floor(diff);

      this._updateClockValues();

      this._hasCountdownEnded();

      this._hasCountdownEventOccured();
    }
  }, {
    key: "_updateClockValues",
    value: function _updateClockValues() {
      var _this2 = this;

      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.clockStrings.d = pad(this.clockValues.d, 2);
      this.clockStrings.h = pad(this.clockValues.h, 2);
      this.clockStrings.m = pad(this.clockValues.m, 2);
      this.clockStrings.s = pad(this.clockValues.s, 2);
      this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split('');
      this.rotorLeafFront.forEach(function (el, i) {
        el.textContent = _this2.prevClockValuesAsString[i];
      });
      this.rotorBottom.forEach(function (el, i) {
        el.textContent = _this2.prevClockValuesAsString[i];
      });

      function rotorTopFlip() {
        var _this3 = this;

        this.rotorTop.forEach(function (el, i) {
          if (el.textContent != _this3.clockValuesAsString[i]) {
            el.textContent = _this3.clockValuesAsString[i];
          }
        });
      }

      function rotorLeafRearFlip() {
        var _this4 = this;

        this.rotorLeafRear.forEach(function (el, i) {
          if (el.textContent != _this4.clockValuesAsString[i]) {
            el.textContent = _this4.clockValuesAsString[i];
            el.parentElement.classList.add('flipped');
            var flip = setInterval(function () {
              el.parentElement.classList.remove('flipped');
              clearInterval(flip);
            }.bind(_this4), 500);
          }
        });
      }

      if (!init) {
        setTimeout(rotorTopFlip.bind(this), 500);
        setTimeout(rotorLeafRearFlip.bind(this), 500);
      } else {
        var dayRotor = document.querySelector(".rotor-period-day");
        var hourRotor = document.querySelector(".rotor-period-hour");
        var minuteRotor = document.querySelector(".rotor-period-minute");
        var secondRotor = document.querySelector(".rotor-period-second");

        if (!this.opts.showEmptyRotors) {
          if (this.clockStrings.d == '00' && this.clockStrings.h == '00' && this.clockStrings.m == '00' && this.clockStrings.s == '00') {
            dayRotor.style.display = 'none';
            hourRotor.style.display = 'none';
            minuteRotor.style.display = 'none';
            secondRotor.style.display = 'none';
          } else if (this.clockStrings.d == '00' && this.clockStrings.h == '00' && this.clockStrings.m == '00' && this.clockStrings.s != '00') {
            dayRotor.style.display = 'none';
            hourRotor.style.display = 'none';
            minuteRotor.style.display = 'none';
          } else if (this.clockStrings.d == '00' && this.clockStrings.h == '00' && this.clockStrings.m != '00') {
            dayRotor.style.display = 'none';
            hourRotor.style.display = 'none';
          } else if (this.clockStrings.d == '00' && this.clockStrings.h != '00') {
            hourRotor.style.display = 'none';
          }
        }

        rotorTopFlip.call(this);
        rotorLeafRearFlip.call(this);
      }

      this.prevClockValuesAsString = this.clockValuesAsString;
    }
  }]);

  return FlipDown;
}();

function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

function appendChildren(parent, children) {
  children.forEach(function (el) {
    parent.appendChild(el);
  });
}
