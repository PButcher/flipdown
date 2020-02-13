/**
* @name FlipDown
* @description Flip styled countdown clock
* @author Peter Butcher (PButcher) <pbutcher93[at]gmail[dot]com>
* @param {number} uts - Time to count down to as unix timestamp
* @param {string} el - DOM element to attach FlipDown to
* @param {object} opt - Optional configuration settings
**/
class FlipDown {
  constructor(uts, el = 'flipdown', opt = {}) {

      // If uts is not specified
      if (typeof uts !== 'number') {
          throw new Error(`FlipDown: Constructor expected unix timestamp, got ${typeof uts} instead.`);
      }

      // If opt is specified, but not el
      if (typeof el === 'object') {
          opt = el;
          el = 'flipdown';
      }

      // FlipDown version
      this.version = '0.2.2';

      // Initialised?
      this.initialised = false;

      // Time at instantiation in seconds
      this.now = this._getTime();

      // UTS to count down to
      this.epoch = uts;

      // Occurence UTS to count down to
      this.outs = null;

      // UTS passed to FlipDown is in the past
      this.countdownEnded = false;

      // UTS passed to FlipDown is in the past
      this.countdownOccured = false;

      // User defined callback for countdown end
      this.hasEndedCallback = null;

      // User defined callback for countdown event occurence
      this.hasOccuredCallback = null;

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

      // Parse options
      this.opts = this._parseOptions(opt);

      // Set options
      this._setOptions();

      // Print Version
      console.log(`FlipDown ${this.version} (Theme: ${this.opts.theme})`);
  }

  /**
  * @name start
  * @description Start the countdown
  * @author PButcher
  **/
  start() {
      // Initialise the clock
      if (!this.initialised) this._init();

      // Set up the countdown interval
      this.countdown = setInterval(this._tick.bind(this), 1000);

      // Chainable
      return this;
  }

  /**
  * @name ifEnded
  * @description Call a function once the countdown ends
  * @author PButcher
  * @param {function} cb - Callback
  **/
  ifEnded(cb) {
      this.hasEndedCallback = function () {
          cb();
          this.hasEndedCallback = null;
      }

      // Chainable
      return this;
  }

  /**
  * @name ifOccured
  * @description Call a function once the countdown event occurs
  * @author mattosaurus
  * @param {integer} outs - Occurence unix timestamp
  * @param {function} cb - Callback
  **/
  ifOccured(outs, cb) {
      this.outs = outs;
      this.hasOccuredCallback = function () {
          cb();
          this.hasOccuredCallback = null;
      }
      
      // Chainable
      return this;
  }

  /**
  * @name _getTime
  * @description Get the time in seconds (unix timestamp)
  * @author PButcher
  **/
  _getTime() {
      return new Date().getTime() / 1000;
  }

  /**
  * @name _hasCountdownEnded
  * @description Has the countdown ended?
  * @author PButcher
  **/
  _hasCountdownEnded() {

      // Countdown has ended
      if ((this.epoch - this.now) < 0) {
          this.countdownEnded = true;

          // Fire the ifEnded callback once if it was set
          if (this.hasEndedCallback != null) {

              // Call ifEnded callback
              this.hasEndedCallback();

              // Remove the callback
              this.hasEndedCallback = null;
          }

          return true;

          // Countdown has not ended
      } else {

          this.countdownEnded = false;
          return false;
      }
  }

  /**
  * @name _hasCountdownEventOccured
  * @description Has the countdown event occured?
  * @author mattosaurus
  **/
  _hasCountdownEventOccured() {

      // Countdown event has occured
      if ((this.outs - this.now) < 0) {
          this.countdownOccured = true;

          // Fire the ifOccured callback once if it was set
          if (this.hasOccuredCallback != null) {

              // Call ifOccured callback
              this.hasOccuredCallback();

              // Remove the callback
              this.hasOccuredCallback = null;
          }

          return true;

          // Countdown event has not occured
      } else {

          this.countdownOccured = false;
          return false;
      }
  }

  /**
  * @name _parseOptions
  * @description Parse any passed options
  * @param {object} opt - Optional configuration settings
  * @author PButcher
  **/
  _parseOptions(opt) {
      return {
          // Theme
          theme: (opt.hasOwnProperty('theme')) ? opt.theme : 'dark',
          showHeaders: (opt.hasOwnProperty('showHeaders')) ? opt.showHeaders : true,
          showEmptyRotors: (opt.hasOwnProperty('showEmptyRotors')) ? opt.showEmptyRotors : true
      }
  }

  /**
  * @name _setOptions
  * @description Set optional configuration settings
  * @author PButcher
  **/
  _setOptions() {

      // Apply theme
      this.opts.theme.split(',').forEach(theme => this.element.classList.add(`flipdown__theme-${theme}`));
  }

  /**
  * @name _init
  * @description Initialise the countdown
  * @author PButcher
  **/
  _init() {

      this.initialised = true;

      // Check whether countdown has ended and calculate how many digits the day counter needs
      if (this._hasCountdownEnded()) {
          this.daysremaining = 0;
      } else {
          this.daysremaining = Math.floor((this.epoch - this.now) / 86400).toString().length;
      }
      var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

      // Create and store rotors
      for (var i = 0; i < dayRotorCount + 6; i++) {
          this.rotors.push(this._createRotor(0));
      }

      // Create day rotor group
      var dayRotors = [];
      for (var i = 0; i < dayRotorCount; i++) {
          dayRotors.push(this.rotors[i]);
      }
      this.element.appendChild(this._createRotorGroup(dayRotors, 'day'));

      // Create other rotor groups
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

      // Store and convert rotor nodelists to arrays
      this.rotorLeafFront = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-leaf-front'));
      this.rotorLeafRear = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-leaf-rear'));
      this.rotorTop = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-top'));
      this.rotorBottom = Array.prototype.slice.call(this.element.getElementsByClassName('rotor-bottom'));

      // Set initial values;
      this._tick();
      this._updateClockValues(true);

      return this;
  }

  /**
  * @name _createRotorGroup
  * @description Add rotors to the DOM
  * @author PButcher
  * @param {array} rotors - A set of rotors
  **/
  _createRotorGroup(rotors, period) {
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

  /**
  * @name _createRotor
  * @description Create a rotor DOM element
  * @author PButcher
  * @param {number} v - Initial rotor value
  **/
  _createRotor(v = 0) {
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
  * @name _tick
  * @description Calculate current tick
  * @author PButcher
  **/
  _tick() {

      // Get time now
      this.now = this._getTime();

      // Between now and epoch
      var diff = ((this.epoch - this.now) <= 0) ? 0 : this.epoch - this.now;

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
      this._updateClockValues();

      // Has the countdown ended?
      this._hasCountdownEnded();

      // Has the event occured?
      this._hasCountdownEventOccured();
  }

  /**
  * @name _updateClockValues
  * @description Update the clock face values
  * @author PButcher
  * @param {boolean} init - True if calling for initialisation
  **/
  _updateClockValues(init = false) {

      // Build clock value strings
      this.clockStrings.d = pad(this.clockValues.d, 2);
      this.clockStrings.h = pad(this.clockValues.h, 2);
      this.clockStrings.m = pad(this.clockValues.m, 2);
      this.clockStrings.s = pad(this.clockValues.s, 2);

      // Concat clock value strings
      this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split('');

      // Update rotor values
      // Note that the faces which are initially visible are:
      // - rotorLeafFront (top half of current rotor)
      // - rotorBottom (bottom half of current rotor)
      // Note that the faces which are initially hidden are:
      // - rotorTop (top half of next rotor)
      // - rotorLeafRear (bottom half of next rotor)
      this.rotorLeafFront.forEach((el, i) => {
          el.textContent = this.prevClockValuesAsString[i];
      });

      this.rotorBottom.forEach((el, i) => {
          el.textContent = this.prevClockValuesAsString[i];
      });

      function rotorTopFlip() {
          this.rotorTop.forEach((el, i) => {
              if (el.textContent != this.clockValuesAsString[i]) {
                  el.textContent = this.clockValuesAsString[i];
              }
          });
      }

      function rotorLeafRearFlip() {
          this.rotorLeafRear.forEach((el, i) => {
              if (el.textContent != this.clockValuesAsString[i]) {
                  el.textContent = this.clockValuesAsString[i];
                  el.parentElement.classList.add('flipped');
                  var flip = setInterval(function () {
                      el.parentElement.classList.remove('flipped');
                      clearInterval(flip);
                  }.bind(this), 500);
              }
          });
      }

      // Init
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
              }
              else if (this.clockStrings.d == '00' && this.clockStrings.h == '00' && this.clockStrings.m == '00' && this.clockStrings.s != '00') {
                  dayRotor.style.display = 'none';
                  hourRotor.style.display = 'none';
                  minuteRotor.style.display = 'none';
              }
              else if (this.clockStrings.d == '00' && this.clockStrings.h == '00' && this.clockStrings.m != '00') {
                  dayRotor.style.display = 'none';
                  hourRotor.style.display = 'none';
              }
              else if (this.clockStrings.d == '00' && this.clockStrings.h != '00') {
                  hourRotor.style.display = 'none';
              }
          }

          rotorTopFlip.call(this);
          rotorLeafRearFlip.call(this);
      }

      // Save a copy of clock values for next tick
      this.prevClockValuesAsString = this.clockValuesAsString;
  }
}

/**
* @name pad
* @description Prefix a number with zeroes
* @author PButcher
* @param {string} n - Number to pad
* @param {number} len - Desired length of number
**/
function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

/**
* @name appendChildren
* @description Add multiple children to an element
* @author PButcher
* @param {object} parent - Parent
**/
function appendChildren(parent, children) {
  children.forEach(el => {
      parent.appendChild(el);
  });
}