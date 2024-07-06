document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventDate = urlParams.get("date");
  const winningNumber = urlParams.get("number");
  const winner = urlParams.get("winner");
  const prize = urlParams.get("prize");
  const eventID = parseInt(urlParams.get("eventID"));

  document.getElementById("event-date").innerHTML = `
  <div class="text-2xl font-bold">${eventDate}</div>
  <div class="lg:block text-sm text-sky-600">Date</div>
`;

  document.getElementById("winning-number").innerHTML = `
  <div class="text-lg font-bold">${winningNumber}</div>
  <div class="lg:block text-sm text-sky-600">Winning Number</div>
`;

  document.getElementById("winner").innerHTML = `
  <div class="text-lg font-bold">${winner}</div>
  <div class="lg:block text-sm text-sky-600">Winner(s)</div>
`;

  document.getElementById("prize").innerHTML = `
  <div class="text-lg font-bold">${prize}</div>
  <div class="lg:block text-sm text-sky-600">Prize</div>
`;

  document.getElementById("event-id").innerHTML = `
  <div class="text-4xl font-bold">${eventID}</div>
  <div class="lg:block text-sm">Event ID</div>
`;

  try {
    const response = await fetch(`/event/${eventID}/submissions`);

    if (!response.ok) {
      throw new Error("Failed to fetch user submissions");
    }

    const submissions = await response.json();
    const userSubmissionsContainer =
      document.getElementById("user-submissions");
    userSubmissionsContainer.innerHTML = ""; // Clear existing content
    console.log(submissions);
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
});
