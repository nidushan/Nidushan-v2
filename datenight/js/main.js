// If you don't want the particles, change the following to false:
const doParticles = true;


function getWidth() { // credit to travis on stack overflow
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
if (doParticles) {
	if (getWidth() < 400) $.firefly({minPixel: 1,maxPixel: 3,total: 30});
	else $.firefly({minPixel: 1,maxPixel: 3,total: 100});
}


/*Countdown Timer*/
(function () {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let interval;

  // Function to start or update the countdown
  function startCountdown(targetDate) {
    if (interval) clearInterval(interval); // Clear any existing interval

    interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // Update the countdown display
      document.getElementById("days").innerText = Math.floor(distance / day);
      document.getElementById("hours").innerText = Math.floor(
        (distance % day) / hour
      );
      document.getElementById("minutes").innerText = Math.floor(
        (distance % hour) / minute
      );
      document.getElementById("seconds").innerText = Math.floor(
        (distance % minute) / second
      );

      // If the countdown is over, display a message and stop the interval
      if (distance < 0) {
        clearInterval(interval);
        document.getElementById("headline").innerText = "WE GOING TO JAPAN!";
        document.getElementById("countdown").style.display = "none";
        document.getElementById("departure").style.display = "none";
      }
    }, 0);
  }

  // Function to handle date input changes
  function handleDateChange() {
    const tripStartValue = document.getElementById("trip-start").value;
    const [year, month, day] = tripStartValue.split("-");
    // Create the target date in UTC to avoid timezone issues
    const targetDate = Date.UTC(year, month - 1, day); // month is 0-indexed in JavaScript
    startCountdown(targetDate);
  }

  // Set up the initial countdown with the default date (2025-06-18)
  const defaultDate = Date.UTC(2026, 2, 20); // March is month 2 (0-indexed)
  startCountdown(defaultDate);

  // Add an event listener to the date input to update the countdown when the date changes
  document
    .getElementById("trip-start")
    .addEventListener("change", handleDateChange);
})();
