let evnt_nmbr;
const rslt_head = document.getElementById("rslt_head");
const countdownElement = document.getElementById("cnt_dwn");
const lckynum = document.getElementById("lucky-number");
document.addEventListener("DOMContentLoaded", function () {
  eventnmbr();
  // Function to start a 5-minute countdown
  function startFiveMinuteCountdown() {
    // A random 3-digit number is generated and saved in a variable
    let luckyNum = Math.floor(100 + Math.random() * 900);

    // Retrieve the target end time from localStorage, or set it to 5 minutes from now
    let targetEndTime =
      parseInt(localStorage.getItem("targetEndTime")) || Date.now() + 300000; // 5 minutes in milliseconds

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      let remainingTime = Math.floor((targetEndTime - currentTime) / 1000);

      // Save the target end time to localStorage
      localStorage.setItem("targetEndTime", targetEndTime);

      // Update countdown display
      updateCountdownDisplay(remainingTime);

      // Check if countdown has reached zero
      if (remainingTime <= 0) {
        clearInterval(intervalId); // Stop the interval
        localStorage.removeItem("targetEndTime"); // Clear the saved target end time
        evnt_nmbr++;
        addEventNumber(evnt_nmbr, luckyNum);
        addWinner(luckyNum, evnt_nmbr);
        // Start the next countdown
        startFiveMinuteCountdown();
      }
    }, 1000);

    // Display initial countdown
    const initialRemainingTime = Math.floor(
      (targetEndTime - Date.now()) / 1000
    );
    updateCountdownDisplay(initialRemainingTime);
  }

  // Function to update the countdown display
  function updateCountdownDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes}m ${seconds}s`;
    countdownElement.textContent = `Next draw (Event : ${
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
        //console.log("No winner entry added:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  // Start the initial 5-minute countdown when the DOM is loaded
  startFiveMinuteCountdown();
});
const eventnmbr = async () => {
  const res = await fetch("/getevntnmr");
  const data = await res.json();
  //console.log(data);
  evnt_nmbr = data.nmbr;
  rslt_head.innerHTML = `Previous Result (Event: ${evnt_nmbr})`;
  if (evnt_nmbr === 0) {
    lckynum.innerHTML = "NULL";
  } else {
    lckynum.innerHTML = data.luck;
  }
};
// api call for add data
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
    //console.log(data.message); // Message from the server
    // Handle success scenario here, if needed
    window.location.reload();
  } catch (error) {
    console.error("Error adding event number:", error.message);
    // Handle error scenario here, if needed
  }
};
export { evnt_nmbr };
