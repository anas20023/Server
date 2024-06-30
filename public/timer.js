document.addEventListener("DOMContentLoaded", function () {
  // Function to start a 5-minute countdown
  function startFiveMinuteCountdown() {
    const countdownElement = document.getElementById("cnt_dwn");

    // Retrieve the remaining time from localStorage
    let timer = parseInt(localStorage.getItem("remainingTime")) || 300; // 5 minutes in seconds

    // Display initial countdown
    updateCountdownDisplay(timer);

    const intervalId = setInterval(() => {
      timer--;

      // Save the remaining time to localStorage
      localStorage.setItem("remainingTime", timer);

      // Update countdown display
      updateCountdownDisplay(timer);

      // Check if countdown has reached zero
      if (timer <= 0) {
        clearInterval(intervalId); // Stop the interval
        localStorage.removeItem("remainingTime"); // Clear the saved timer
        refreshLuckyNumber(); // Refresh the lucky number
      }
    }, 1000);
  }

  // Function to update the countdown display
  function updateCountdownDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes}m ${seconds}s`;
    const countdownElement = document.getElementById("cnt_dwn");
    countdownElement.textContent = `Next draw in ${formattedTime}`;
  }

  // Function to refresh the lucky number
  function refreshLuckyNumber() {
    const luckyNumberElement = document.getElementById("lucky-number");

    // Fetch new lucky number from backend
    fetch("/current-lucky-number")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const newNumber = data.number; // Assuming API returns { number: 'xxx' }
        luckyNumberElement.textContent = newNumber;

        // Restart the 5-minute countdown
        startFiveMinuteCountdown();
      })
      .catch((error) => {
        console.error("Error fetching new lucky number:", error);
      });
  }

  // Start the initial 5-minute countdown when the DOM is loaded
  startFiveMinuteCountdown();
});
