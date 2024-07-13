// main.js
import { evnt_nmbr } from "./timer.js";
document.addEventListener("DOMContentLoaded", function () {
  fetchSubmissionNumbers();
  document.getElementById("winnerModalshow").addEventListener("click", () => {
    console.log("modal reqstd");
  });

  document.getElementById("open-form").addEventListener("click", function () {
    document.getElementById("formModal").classList.remove("hidden");
  });

  document.getElementById("cancel-btn").addEventListener("click", function () {
    document.getElementById("formModal").classList.add("hidden");
  });

  document
    .getElementById("close-winnerModal")
    .addEventListener("click", function () {
      document.getElementById("winnerModal").classList.add("hidden");
    });

  document
    .getElementById("guess-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Add event number from top counting
      const temp = evnt_nmbr + 1;
      data["eventNumber"] = temp;

      // Check for existing entries
      fetch("/check-existing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          brand: data.brand,
          eventNumber: data.eventNumber,
        }),
      })
        .then((response) => response.json())
        .then((checkData) => {
          if (checkData.exists) {
            const prompt_mdl = document.getElementById("popup-modal");
            const hdmodal = document.getElementById("hideppmodal");
            prompt_mdl.classList.remove("hidden");
            prompt_mdl.classList.add("flex");
            if (hdmodal && prompt_mdl) {
              hdmodal.addEventListener("click", function () {
                prompt_mdl.classList.add("hidden");
                prompt_mdl.classList.remove("flex");
                document.getElementById("formModal").classList.add("hidden");
                document.getElementById("guess-form").reset();
              });
            }
          } else {
            // Proceed with form submission if no entry exists
            fetch("/submit-guess", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((data) => {
                alert("Success: " + data.message);
                document.getElementById("formModal").classList.add("hidden");
                this.reset();
                // Refresh the page
                fetchSubmissionNumbers();
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
async function fetchSubmissionNumbers() {
  try {
    const response = await fetch("/submission-numbers");
    if (!response.ok) {
      throw new Error("Failed to fetch submission numbers");
    }
    const numbers = await response.json();

    const submissionsContainer = document.getElementById("submissions");
    submissionsContainer.innerHTML = "";
    //console.log(numbers);
    //console.log(evnt_nmbr);
    numbers.forEach((submission) => {
      if (submission.eventNumber === evnt_nmbr + 1) {
        const submissionElement = document.createElement("div");
        submissionElement.classList.add(
          "submission-number",
          "relative",
          "group"
        );
        submissionElement.innerHTML = `
          <div class="p-2 bg-blue-600 text-white text-center rounded-sm font-medium">
            ${submission.number}
          </div>
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block p-2 bg-white text-gray-700 text-sm rounded-sm z-10">
            ${submission.username}
          </div>
        `;
        submissionsContainer.appendChild(submissionElement);
      }
    });
  } catch (error) {
    console.log("Error fetching submission numbers:", error);
    alert("Failed to fetch submission numbers: " + error.message);
  }
}
