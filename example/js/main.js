document.addEventListener('DOMContentLoaded', () => {

  // Unix timestamp (in seconds) to count down to
  var twoDaysFromNow = (new Date().getTime() / 1000) + (86400 * 2) + 1;

  // Set up FlipDown
  var flipdown = new FlipDown(1541970090, 'flipdown')

    // Start the countdown
    .start()

    // Do something when the countdown ends
    .ifEnded(function() {
      console.log('The countdown has ended!');
    });
});
