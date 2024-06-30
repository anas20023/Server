document.addEventListener("DOMContentLoaded", function () {
  // Function to start a 5-minute countdown
  function startFiveMinuteCountdown() {
    const countdownElement = document.getElementById("cnt_dwn");

    // Check if there's a saved timer in localStorage
    let timer = parseInt(localStorage.getItem("remainingTime")) || 300; // 5 minutes in seconds

    const intervalId = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;

      countdownElement.textContent = `Next draw in ${minutes}m ${seconds}s`;

      // Check if countdown has reached zero
      if (timer <= 0) {
        clearInterval(intervalId); // Stop the interval
        localStorage.removeItem("remainingTime"); // Clear the saved timer
        refreshLuckyNumber(); // Refresh the lucky number
      }

      // Save the remaining time to localStorage
      localStorage.setItem("remainingTime", timer);

      timer--; // Decrease time by 1 second
    }, 1000);
  }

  // Function to refresh the lucky number
  function refreshLuckyNumber() {
    const luckyNumberElement = document.getElementById("lucky-number");

    // Fetch new lucky number from backend
    fetch("/current-lucky-number")
      .then((response) => response.json())
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
  // Start the initial 5-minute countdown
  startFiveMinuteCountdown();
});