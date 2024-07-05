document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventDate = urlParams.get("date");
  const winningNumber = urlParams.get("number");
  const winner = urlParams.get("winner");
  const prize = urlParams.get("prize");
  const eventID = parseInt(urlParams.get("eventID"));

  document.getElementById("event-date").innerText = `Date: ${eventDate}`;
  document.getElementById(
    "winning-number"
  ).innerHTML = `<strong>Winning Number:</strong> ${winningNumber}`;
  document.getElementById(
    "winner"
  ).innerHTML = `<strong>Winner:</strong> ${winner}`;
  document.getElementById(
    "prize"
  ).innerHTML = `<strong>Prize:</strong> ${prize}`;
  document.getElementById(
    "event-id"
  ).innerHTML = `<strong>Event ID:</strong> ${eventID}`;

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
          "text-lg",
          "font-medium",
          "bg-gray-800",
          "text-white",
          "p-3",
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
