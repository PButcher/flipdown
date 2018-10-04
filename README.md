<span style="text-align:center;display:block;width:100%;"><img src="http://i.imgur.com/UtbIc4S.png" title="Example of FlipDown" style="width: 500px;text-align:center"></span>

# FlipDown

⏰ A lightweight and performant flip styled countdown clock.

Version: 0.1.3 [JS: 3.9KB, CSS: 2.45KB]

## Example

Example live at: https://pbutcher.uk/flipdown/

Remix FlipDown on CodePen: https://codepen.io/PButcher/pen/dzvMzZ

## Basic Usage

FlipDown takes a unix timestamp (in seconds) and a DOM element ID as arguments.

```javascript
new FlipDown(1538137672, 'flipdown').start();
```

Include the CSS and JS in `<head>` and include the following line in your HTML.

```html
<div id="flipdown" class="flipdown"></div>
```

See a full example [here](https://github.com/PButcher/flipdown/tree/master/example).

## API

### `FlipDown.prototype.start()`

Start the countdown.

### `FlipDown.prototype.isEnded(callback)`

Call a function once the countdown has ended.

#### Parameters

##### `callback`

Function to execute once the countdown has ended.
