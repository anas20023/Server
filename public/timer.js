let evnt_nmbr;
const rslt_head = document.getElementById("rslt_head");
const countdownElement = document.getElementById("cnt_dwn");
const lckynum = document.getElementById("lucky-number");

document.addEventListener("DOMContentLoaded", function () {
  eventnmbr();
  startCountdown();
  // Function to start the countdown
  function startCountdown() {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("/api/remaining-time");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const remainingTime = data.remainingTime;

        // Update countdown display
        updateCountdownDisplay(remainingTime);

        // Check if countdown has reached zero
        if (remainingTime <= 0) {
          clearInterval(intervalId); // Stop the interval
          evnt_nmbr++;
          const luckyNumResponse = await fetch("/api/reset-timer", {
            method: "POST",
          });
          if (!luckyNumResponse.ok) {
            throw new Error("Failed to reset timer");
          }
          const luckyNumData = await luckyNumResponse.json();
          console.log(luckyNumData);
          const luckyNum = luckyNumData.luckyNum;
          addWinner(luckyNumData.luckyNum, evnt_nmbr);
          addEventNumber(evnt_nmbr, luckyNum);
          // Start the next countdown
          startCountdown();
          eventnmbr();
          // reload the window
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }, 1000);
  }
  // Function to update the countdown display
  function updateCountdownDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes} min ${seconds} sec`;
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
      const matchingSubmissions = submissions.filter(
        (submission) =>
          (submission.number === luckyNumber ||
            submission.number === luckyNumber % 10 ||
            submission.number === luckyNumber % 100) &&
          submission.eventNumber === evtnm
      );

      if (matchingSubmissions.length > 0) {
        for (const winner of matchingSubmissions) {
          let currprize;
          if (winner.number === luckyNumber) {
            currprize = 50;
          } else if (winner.number === luckyNumber % 10) {
            currprize = 1;
          } else if (winner.number === luckyNumber % 100) {
            currprize = 5;
          }

          const addWinnerResponse = await fetch("/add-winner", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: new Date().toISOString(), // Add the current date in ISO format
              number: winner.number,
              users: winner.username, // Adjust to match your schema
              evnt: winner.eventNumber,
              prize: currprize,
            }),
          });
          if (!addWinnerResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await addWinnerResponse.json();
          console.log("Winner added successfully:");
          window.location.reload();
        }
      } else {
        const noWinnerEntry = {
          date: new Date().toISOString(), // Add the current date in ISO format
          number: luckyNumber,
          users: "no winner", // Ensure this field is populated
          evnt: evtnm,
          prize: 0,
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
        const data = await addNoWinnerResponse.json();
        console.log("No winner entry added:", data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch event number and start the countdown
  async function eventnmbr() {
    try {
      const response = await fetch("/getevntnmr");
      if (!response.ok) {
        throw new Error("Failed to fetch event number");
      }
      const data = await response.json();
      evnt_nmbr = data.nmbr;
      rslt_head.innerText = `Previous Submission (Event:${data.nmbr})`;
      lckynum.innerText = data.luck;
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
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
// on window reload event
