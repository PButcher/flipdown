document.addEventListener('DOMContentLoaded', () => {

    // Unix timestamp (in seconds) to count down to
    const fifteenSeconds = Math.floor(new Date().getTime() / 1000) + 2;
    const fiveDays3Hours2Minutes = 5 * 24 * 60 * 60 + 3 * 60 * 60 + 2 * 60;

    // Set up FlipDown with extra time and extended text
    const flipdown = new FlipDown(fifteenSeconds, 'flipdown', {
        extraTime: fiveDays3Hours2Minutes, // Set the extra time in seconds
    });

    // Start the countdown
    flipdown.start();

    // Do something when the initial countdown ends
    flipdown.ifEnded(() => {
        console.log('The initial countdown has ended!');
        document.body.querySelector('#extended').style.display = 'block';
    });

    // Do something when the extended countdown ends
    flipdown.ifExtendedEnded(() => {
        console.log('The extended countdown has ended!');
    });

    // Toggle theme
    var interval = setInterval(() => {
      let body = document.body;
      body.classList.toggle('light-theme');
      body.querySelector('#flipdown').classList.toggle('flipdown__theme-dark');
      body.querySelector('#flipdown').classList.toggle('flipdown__theme-light');
    }, 5000);

    // Show version number
    var ver = document.getElementById('ver');
    ver.innerHTML = flipdown.version;
});
