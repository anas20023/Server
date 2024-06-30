document.addEventListener("DOMContentLoaded", function () {
  // Set the lucky number on page load
  const currentDate = new Date();
  const timestamptodat = Date.parse(currentDate);
  let mxnm = -1;

  async function getDataAndDisplayNumber() {
    try {
      const response = await fetch("/winner-history");
      const history = await response.json();

      // Iterate through history to find the entry with the latest date and update mxnm
      history.forEach((entry) => {
        // Assuming entry.date is a Date object or a timestamp
        const toDate = new Date(entry.date);
        // console.log(timestamptodat);
        const timestamptent = Date.parse(toDate);
        if (timestamptent > timestamptodat) {
          mxnm = entry.number;
        }
      });

      // Display the latest number after fetching and processing
      document.getElementById("lucky-number").textContent = mxnm.toString();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
    }
  }

  getDataAndDisplayNumber();
  // Handle opening form modal
  document.getElementById("open-form").addEventListener("click", function () {
    document.getElementById("formModal").classList.remove("hidden");
  });

  // Handle loading more submissions

  // Handle toggle for responsive menu
  const toggleButton = document.getElementById("toggle-menu");
  const responsiveMenu = document.getElementById("responsive-menu");

  toggleButton.addEventListener("click", () => {
    responsiveMenu.classList.toggle("hidden");
  });

  // Close responsive menu on link/button click (if needed)
  const menuLinks = document.querySelectorAll(
    "#responsive-menu a, #open-form-responsive"
  );
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      responsiveMenu.classList.add("hidden");
    });
  });

  // Handle winner modal
  const modalshow = document.querySelector("#winnerModalshow");
  const modalclose = document.querySelector("#modclose");

  modalshow.addEventListener("click", function () {
    //document.getElementById("winnerModal").classList.remove("hidden");
    //redirect to winner-history html
    window.location.href = "winner-history.html";
  });

  modalclose.addEventListener("click", function () {
    //console.log(e);
    document.getElementById("winnerModal").classList.add("hidden");
  });

  // Close form modal
  const closebtn = document.querySelector("#closebtn");
  closebtn.addEventListener("click", function () {
    document.getElementById("formModal").classList.add("hidden");
  });
});
////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  // Function to calculate and display the countdown
  function updateNextDrawTime() {
    const now = new Date();
    let nextDrawTime = new Date();
    nextDrawTime.setHours(24, 0, 0, 0); // Set next draw time to 12 AM

    if (nextDrawTime <= now) {
      nextDrawTime.setDate(nextDrawTime.getDate() + 1); // Next draw is tomorrow if already past 12 AM today
    }

    // Calculate the time difference in milliseconds
    let timeUntilNextDraw = nextDrawTime - now;

    // Update countdown every second
    const countdownElement = document.getElementById("cnt_dwn");
    const luckyNumberElement = document.getElementById("lucky-number");

    const intervalId = setInterval(() => {
      const hours = Math.floor(
        (timeUntilNextDraw % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeUntilNextDraw % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeUntilNextDraw % (1000 * 60)) / 1000);

      countdownElement.textContent = `Next draw in ${hours}h ${minutes}m ${seconds}s`;

      // Check if countdown has reached zero
      if (timeUntilNextDraw <= 0) {
        clearInterval(intervalId); // Stop the interval

        // Fetch new lucky number from backend
        fetch("/current-lucky-number")
          .then((response) => response.json())
          .then((data) => {
            const newNumber = data.number; // Assuming API returns { number: 'xxx' }
            luckyNumberElement.textContent = newNumber;

            // Calculate new next draw time for the next day
            nextDrawTime = new Date();
            nextDrawTime.setDate(nextDrawTime.getDate() + 1);
            nextDrawTime.setHours(12, 0, 0, 0);

            // Restart countdown for the new draw
            timeUntilNextDraw = nextDrawTime - now;
            updateNextDrawTime(); // Restart countdown
          })
          .catch((error) => {
            console.error("Error fetching new lucky number:", error);
          });
      }

      // Decrease time until next draw every second
      timeUntilNextDraw -= 1000;
    }, 1000);
  }

  // Call the function to initialize the countdown timer
  updateNextDrawTime();
});
///////////Button Control button will apear after 5mins and desapir and a time counter will added ////////////////
// set a count down div when btn in hidden for interval time
///////////Button Control////////////////
