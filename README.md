<span style="text-align:center;display:block;width:100%;"><img src="http://i.imgur.com/UtbIc4S.png" style="width:75%" title="Example of FlipDown" style="width: 500px;text-align:center"></span>

# FlipDown

⏰ A lightweight and performant flip styled countdown clock.

![NPM Version](https://img.shields.io/npm/v/flipdown?style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dt/flipdown?style=flat-square)

## Features

- 💡 Lightweight - No jQuery! <11KB minified bundle
- ⚡ Performant - Animations powered by CSS transitions
- 📱 Responsive - Works great on screens of all sizes
- 🎨 Themeable - Choose from built-in themes, or add your own
- 🌍 i18n - Customisable headings for your language

## Example

Example live at: https://pbutcher.uk/flipdown/

Remix FlipDown on CodePen: https://codepen.io/PButcher/pen/dzvMzZ

## Basic Usage

To get started, either clone this repo or install with `npm install flipdown` or `yarn add flipdown`.

For basic usage, FlipDown takes a unix timestamp (in seconds) as an argument.

```javascript
new FlipDown(1538137672).start();
```

Include the [CSS and JS](https://github.com/PButcher/flipdown/tree/master/dist) in `<head>` and include the following line in your HTML.

```html
<div id="flipdown" class="flipdown"></div>
```

See a full example [here](https://github.com/PButcher/flipdown/tree/master/example).

## Multiple Instances

To use multiple instances of FlipDown on the same page, specify a DOM element ID as the second argument in FlipDown's constructor:

```javascript
new FlipDown(1588017373, "registerBy").start();
new FlipDown(1593561600, "eventStart").start();
```

```html
<div id="registerBy" class="flipdown"></div>
<div id="eventStart" class="flipdown"></div>
```

## Themes

FlipDown comes with 2 themes as standard:

- dark [default]
- light

To change the theme, you can supply the `theme` property in the `opt` object in the constructor with the theme name as a string:

```javascript
{
  theme: "light";
}
```

For example, to instantiate FlipDown using the light theme instead:

```javascript
new FlipDown(1538137672, {
  theme: "light",
}).start();
```

### Custom Themes

Custom themes can be added by adding a new stylesheet using the FlipDown [theme template](https://github.com/PButcher/flipdown/blob/master/src/flipdown.css#L3-L34).

FlipDown themes must have the class name prefix of: `.flipdown__theme-` followed by the name of your theme. For example, the standard theme class names are:

- `.flipdown__theme-dark`
- `.flipdown__theme-light`

You can then load your theme by specifying the `theme` property in the `opt` object of the constructor (see [Themes](#Themes)).

## Headings

You can add your own rotor group headings by passing an array as part of the `opt` object. Bear in mind this won't change the functionality of the rotors (eg: the 'days' rotor won't magically start counting months because you passed it 'Months' as a heading).

Suggested use is for i18n. Usage as follows:

```javascript
new FlipDown(1538137672, {
  headings: ["Nap", "Óra", "Perc", "Másodperc"],
}).start();
```

Note that headings will default to English if not provided: `["Days", "Hours", "Minutes", "Seconds"]`

## API

### `FlipDown.prototype.constructor(uts, [el], [opts])`

Create a new FlipDown instance.

#### Parameters

##### `uts`

Type: _number_

The unix timestamp to count down to (in seconds).

##### `[el]`

**Optional**  
Type: _string_ (default: `flipdown`)

The DOM element ID to attach this FlipDown instance to. Defaults to `flipdown`.

##### `[opts]`

**Optional**  
Type: _object_ (default: `{}`)

Optionally specify additional configuration settings. Currently supported settings include:

- [`theme`](#Themes)
- [`headings`](#Headings)

### `FlipDown.prototype.start()`

Start the countdown.

### `FlipDown.prototype.ifEnded(callback)`

Call a function once the countdown has ended.

#### Parameters

##### `callback`

Type: _function_

Function to execute once the countdown has ended.

#### Example

```javascript
var flipdown = new FlipDown(1538137672)

  // Start the countdown
  .start()

  // Do something when the countdown ends
  .ifEnded(() => {
    console.log("The countdown has ended!");
  });
```

## Acknowledgements

Thanks to the following people for their suggestions/fixes:

- [@chuckbergeron](https://github.com/chuckbergeron) for his help with making FlipDown responsive.
- [@vasiliki-b](https://github.com/vasiliki-b) for spotting and fixing the Safari backface-visibility issue.
- [@joeinnes](https://github.com/joeinnes) for adding i18n to rotor group headings.
