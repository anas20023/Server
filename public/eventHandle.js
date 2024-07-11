var wresponse = [];
document.addEventListener("DOMContentLoaded", async () => {
  // all variables
  const urlParams = new URLSearchParams(window.location.search);
  const eventDate = urlParams.get("date");
  const winningNumber = urlParams.get("number");
  const eventID = parseInt(urlParams.get("eventID"));
  // all variables

  /// refill page ///
  try {
    const response = await fetch(`/event/${eventID}/submissions`);

    if (!response.ok) {
      throw new Error("Failed to fetch user submissions");
    }

    const submissions = await response.json();
    const userSubmissionsContainer =
      document.getElementById("user-submissions");
    userSubmissionsContainer.innerHTML = ""; // Clear existing content
    //console.log(submissions);
    wresponse = submissions;
    if (submissions.length === 0) {
      document
        .getElementById("nosbmt")
        .classList.add(
          "inline-block",
          "lg:text-lg",
          "font-medium",
          "bg-gray-800",
          "text-white",
          "lg:p-3",
          "p-2.5",
          "text-sm",
          "rounded,",
          "mb-2"
        );
      document.getElementById(
        "nosbmt"
      ).innerHTML = `No Guesses Found for this Event !`;
    } else {
      submissions.forEach((submission) => {
        const submissionItem = document.createElement("div");
        submissionItem.classList.add(
          "bg-gray-200",
          "p-2",
          "rounded",
          "text-center"
        );
        submissionItem.textContent = JSON.stringify(submission.number); // Display the JSON data as text
        userSubmissionsContainer.appendChild(submissionItem);
      });
    }
  } catch (error) {
    console.error("Error fetching user submissions:", error);
  }
  /// refill page ///
  try {
    const response = await fetch(
      `/event/${eventID}/submissions/${winningNumber}`
    );
    const data = await response.json();
    wresponse = data;
    //console.log(wresponse);
  } catch (error) {
    //console.log(error);
  }
  document.getElementById("event-date").innerHTML = `
  <div class="text-2xl font-bold">${eventDate}</div>
  <div class="lg:block text-sm text-sky-600">Date</div>
`;
  document.getElementById("lnm").innerHTML = `
  <div class="text-2xl font-bold ">${winningNumber}</div>
  <div class="lg:block text-sm text-sky-600">Winning Number</div>
`;

  document.getElementById("event-id").innerHTML = `
<div class="text-4xl font-bold text-slate-800">${eventID}</div>
<div class="lg:block text-sm">Event ID</div>
`;
  // console.log(wresponse);
  if (!Array.isArray(wresponse) || wresponse.length === 0) {
    document.getElementById("wincontain").innerHTML = "";
    document.getElementById("wincontain").innerHTML = `
      <div class="text-2xl font-bold">No Winners Found for this Event!</div>`;
  } else {
    const container = document.getElementById("wincontain");
    //container.innerHTML = ""; // Clear the container first
    wresponse.forEach((winner) => {
      // Create a new div element for the winner
      if (winner.users === "no winner") {
        document.getElementById("wincontain").innerHTML = `
        <div class="text-xl font-bold">No withdraw</div
        `;
      } else {
        const winnerDiv = document.createElement("div");
        winnerDiv.className =
          "flex flex-row mb-2 justify-between items-center bg-white border-2 rounded py-2 px-2 w-full";

        // Create the number element
        const numberP = document.createElement("p");
        numberP.className = "text-center text-md font-bold";
        numberP.innerHTML = `${winner.users} `;

        // Create the prize element
        const prizeP = document.createElement("p");
        prizeP.className = "text-xl  font-bold text-center";
        prizeP.innerHTML = `${winner.prize} $`;

        // Append the elements to the winnerDiv
        winnerDiv.appendChild(numberP);
        winnerDiv.appendChild(prizeP);
        // Append the winnerDiv to the container
        container.appendChild(winnerDiv);
      }
    });
  }
});
