let evnt_nmbr;
const rslt_head = document.getElementById("rslt_head");
const countdownElement = document.getElementById("cnt_dwn");
const lckynum = document.getElementById("lucky-number");

document.addEventListener("DOMContentLoaded", function () {
  eventnmbr();

  // Function to start a countdown with the given remaining time
  function startCountdown(remainingTime, initialLuckyNum) {
    let luckyNum = initialLuckyNum;

    const intervalId = setInterval(() => {
      // Decrease remaining time by 1 second
      remainingTime--;

      // Update countdown display
      updateCountdownDisplay(remainingTime);

      // Check if countdown has reached zero
      if (remainingTime <= 0) {
        clearInterval(intervalId); // Stop the interval
        evnt_nmbr++;
        addEventNumber(evnt_nmbr, luckyNum);
        addWinner(luckyNum, evnt_nmbr);
        // Reset the timer on the server and start the next countdown
        resetTimerOnServer().then((newEvent) => {
          startCountdown(newEvent.remainingTime, newEvent.luckyNum);
        });
      }
    }, 1000);

    // Display initial countdown
    updateCountdownDisplay(remainingTime);
  }

  // Function to update the countdown display
  function updateCountdownDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes} min ${seconds
      .toString()
      .padStart(2, "0")} sec`;
    countdownElement.textContent = `Next draw (Event: ${
      evnt_nmbr + 1
    }) in ${formattedTime}`;
  }

  // Function to add winner and store to database
  async function addWinner(luckyNumber, evtnm) {
    try {
      const response = await fetch("/previous-submissions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const submissions = await response.json();
      const winner = submissions.find(
        (submission) =>
          submission.number === luckyNumber && submission.eventNumber === evtnm
      );

      let data;
      if (winner) {
        const addWinnerResponse = await fetch("/add-winner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: new Date(), // Add the current date
            number: winner.number,
            users: winner.username, // Adjust to match your schema
            evnt: winner.eventNumber,
          }),
        });
        if (!addWinnerResponse.ok) {
          throw new Error("Network response was not ok");
        }
        data = await addWinnerResponse.json();
        console.log("Winner added successfully:", data);
      } else {
        const noWinnerEntry = {
          date: new Date(), // Add the current date
          number: luckyNumber,
          users: "no winner", // Ensure this field is populated
          evnt: evtnm,
        };
        const addNoWinnerResponse = await fetch("/add-winner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noWinnerEntry),
        });
        if (!addNoWinnerResponse.ok) {
          throw new Error("Network response was not ok");
        }
        data = await addNoWinnerResponse.json();
        console.log("No winner entry added:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Function to reset the timer on the server
  async function resetTimerOnServer() {
    try {
      const response = await fetch("/api/reset-timer", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to reset timer");
      }
      const data = await response.json();
      return { remainingTime: 300, luckyNum: data.luckyNum }; // 5 minutes in seconds
    } catch (error) {
      console.error("Error resetting timer:", error);
      return {
        remainingTime: 300,
        luckyNum: Math.floor(100 + Math.random() * 900),
      }; // Fallback values
    }
  }

  // Function to fetch the remaining time from the server
  async function fetchRemainingTime() {
    try {
      const response = await fetch("/api/remaining-time");
      if (!response.ok) {
        throw new Error("Failed to fetch remaining time");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching remaining time:", error);
      return {
        remainingTime: 300,
        eventNumber: 1,
        luckyNum: Math.floor(100 + Math.random() * 900),
      }; // Fallback values
    }
  }

  // Start the countdown with the remaining time from the server
  fetchRemainingTime().then((data) => {
    evnt_nmbr = data.eventNumber;
    startCountdown(data.remainingTime, data.luckyNum);
  });
});

// Function to fetch event number and update the page
const eventnmbr = async () => {
  const res = await fetch("/getevntnmr");
  const data = await res.json();
  evnt_nmbr = data.nmbr;
  rslt_head.innerHTML = `Previous Result (Event: ${evnt_nmbr})`;
  if (evnt_nmbr === 0) {
    lckynum.innerHTML = "NULL";
  } else {
    lckynum.innerHTML = data.luck;
  }
};

// Function to add event number to the database
const addEventNumber = async (number, luck) => {
  try {
    const response = await fetch("/addnumber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nmbr: number, luck: luck }),
    });

    if (!response.ok) {
      throw new Error("Failed to add event number");
    }

    const data = await response.json();
    console.log(data.message); // Message from the server
    // Handle success scenario here, if needed
  } catch (error) {
    console.error("Error adding event number:", error.message);
    // Handle error scenario here, if needed
  }
};

export { evnt_nmbr };
