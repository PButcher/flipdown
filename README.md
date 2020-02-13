<span style="text-align:center;display:block;width:100%;"><img src="http://i.imgur.com/UtbIc4S.png" title="Example of FlipDown" style="width: 500px;text-align:center"></span>

# FlipDown

⏰ A lightweight and performant flip styled countdown clock.

Version: 0.2.2 [JS: 5.72KB, CSS: 4.47KB]

## Features

* 💡 Lightweight - No jQuery! <11KB minified
* ⚡ Performant - Animations powered by CSS transitions
* 📱 Responsive - Works great on screens of all sizes
* 🎨 Themeable - Choose from built-in themes, or add your own

## Example

Example live at: https://pbutcher.uk/flipdown/

Remix FlipDown on CodePen: https://codepen.io/PButcher/pen/dzvMzZ

## Basic Usage

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
new FlipDown(1538137672, 'signup').start();
new FlipDown(1538137672, 'register').start();
```
```html
<div id="signup" class="flipdown"></div>
<div id="register" class="flipdown"></div>
```

## Themes

FlipDown comes with 3 themes as standard:
* dark [default]
* light
* small

To change the theme, you can supply the `theme` property in the `opt` object in the constructor with the theme name as a string:

```javascript
{
  theme: 'light'
}
```

For example, to instantiate FlipDown using the light theme instead:

```javascript
new FlipDown(1538137672, {
  theme: 'light'
}).start();
```

### Custom Themes

Custom themes can be added by adding a new stylesheet using the FlipDown [theme template](https://github.com/PButcher/flipdown/blob/master/src/flipdown.css#L3-L34).

FlipDown themes must have the class name prefix of: `.flipdown__theme-` followed by the name of your theme. For example, the standard theme class names are:

* `.flipdown__theme-dark`
* `.flipdown__theme-light`

You can then load your theme by specifying the `theme` property in the `opt` object of the constructor (see [Themes](#Themes)).

## Show Headers

Show the rotor period headers of Day, Hour, Minute and Second. Defaults to true.

## Show Empty Rotors

Show empty (00) rotors if the countdown doesn't require them, e.g. if the countdown is 30 minutes in the future then the day and hour rotors would be empty, if set to false these will be hidden. Defaults to true. 

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

* [`theme`](#Themes)
* [`showHeaders`](#Show Headers)
* [`showEmptyRotors`](#Show Empty Rotors)

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
    console.log('The countdown has ended!');
  });
```

## Acknowledgements

Thanks to the following people for their suggestions/fixes:
- [@chuckbergeron](https://github.com/chuckbergeron) for his help with making FlipDown responsive.
- [@vasiliki-b](https://github.com/vasiliki-b) for spotting and fixing the Safari backface-visibility issue.
