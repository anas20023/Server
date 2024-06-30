// Function to fetch event details and update UI
async function fetchEventDetails() {
  //console.log(eventId);
  try {
    const response = await fetch(`/event`);
    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }
    const eventt = await response.json();
    //console.log(eventt);

    // Update UI elements with fetched data
    const titleElement = document.getElementById("event-id");
    const dateElement = document.getElementById("event-date");
    const winningNumberElement = document.getElementById("winning-number");
    const winnerElement = document.getElementById("winner");
    const prizeElement = document.getElementById("prize");
    const descriptionElement = document.getElementById("description");

    eventt.forEach((event) => {
      if (titleElement) {
        titleElement.textContent = `Event ID : ${event.eventID}`;
      }
      if (dateElement) {
        dateElement.textContent = `Event Date: ${event.eventDate.substring(0,10)}`;
      }
      if (winningNumberElement) {
        winningNumberElement.textContent = `Winning Number: ${event.winningNumber}`;
      }
      if (winnerElement) {
        winnerElement.textContent = `Winner: ${event.winner}`;
      }
      if (prizeElement) {
        prizeElement.textContent = `Prize: ${event.prize}`;
        prizeElement.classList.add("font-medium");
      }
      if (descriptionElement) {
        descriptionElement.textContent = `Description: ${event.description}`;
      }

      // Update user submissions
      const submissionsContainer = document.getElementById("user-submissions");
      if (submissionsContainer) {
        submissionsContainer.innerHTML = "";
        event.userSubmissions.forEach((submission) => {
          const submissionElement = document.createElement("div");
          submissionElement.classList.add(
            "text-center",
            "p-2",
            "bg-blue-200",
            "rounded"
          );
          submissionElement.textContent = submission;
          submissionsContainer.appendChild(submissionElement);
        });
      }
    });
  } catch (error) {
    console.log("Error fetching event details:", error);
    alert("Failed to fetch event details: " + error.message);
  }
}

// Function to fetch submission numbers and update UI
async function fetchSubmissionNumbers() {
  try {
    const response = await fetch("/submission-numbers");
    if (!response.ok) {
      throw new Error("Failed to fetch submission numbers");
    }
    const numbers = await response.json();

    const submissionsContainer = document.getElementById("user-submissions");
    submissionsContainer.innerHTML = "";

    numbers.forEach((submission) => {
      const submissionElement = document.createElement("div");
      submissionElement.classList.add(
        "text-center",
        "p-2",
        "bg-blue-200",
        "rounded"
      );
      submissionElement.textContent = submission.number;
      submissionsContainer.appendChild(submissionElement);
    });
  } catch (error) {
    console.error("Error fetching submission numbers:", error);
    alert("Failed to fetch submission numbers: " + error.message);
  }
}

// Initial actions on DOM content load
document.addEventListener("DOMContentLoaded", function () {
  fetchEventDetails();
  fetchSubmissionNumbers();
});
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle-menu');
  const menu = document.getElementById('responsive-menu');

  toggleButton.addEventListener('click', function() {
    menu.classList.toggle('hidden');
  });
});
