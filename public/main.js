//////////////////// Form Submit Event///////////////////////
document
  .getElementById("guess-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

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
        this.reset(); // Reset the form fields
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
///////////////////////////// Fetch History////////////////////////////
// Fetch winner history
document
  .getElementById("winnerModalshow")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("/winner-history");
      const history = await response.json();

      const historyContainer = document.querySelector("#create_dv");
      historyContainer.innerHTML = "";

      history.forEach((entry) => {
        const entryElement = document.createElement("div");
        entryElement.classList.add(
          "flex",
          "flex-col",
          "sm:flex-row",
          "justify-between",
          "items-center",
          "border-b",
          "border-gray-200",
          "py-2"
        );
        entryElement.innerHTML = `
        <span class="font-semibold">Date: ${entry.date}</span>
        <span class="font-semibold">Winning Number: ${entry.number}</span>
        <span class="font-semibold">Winner: ${entry.users}</span>
      `;
        historyContainer.appendChild(entryElement);
      });

      document.getElementById("winnerModal").classList.remove("hidden");
    } catch (error) {
      alert("Failed to fetch winner history: " + error.message);
    }
  });
///////////////////////////// Fetch History////////////////////////////
///////////////////////////// Fetch Submits////////////////////////////
// Fetch and display submission numbers
// Fetch and display submission numbers
async function fetchSubmissionNumbers() {
  try {
    const response = await fetch("/submission-numbers");
    if (!response.ok) {
      throw new Error("Failed to fetch submission numbers");
    }
    const numbers = await response.json();

    const submissionsContainer = document.getElementById("submissions");
    submissionsContainer.innerHTML = "";

    numbers.forEach((submission, index) => {
      const submissionElement = document.createElement("div");
      submissionElement.classList.add("submission-number");
      submissionElement.innerHTML = `
        <div class="p-2 bg-blue-600 text-white text-center rounded-sm font-medium relative" data-tooltip="Event ID: ${index + 1}">${
        submission.number
      }</div>
      `;
      submissionsContainer.appendChild(submissionElement);
    });

    // Add event listeners for tooltips
    const submissionNumbers = document.querySelectorAll(".submission-number > div");
    submissionNumbers.forEach(submissionNumber => {
      submissionNumber.addEventListener("mouseover", showTooltip);
      submissionNumber.addEventListener("mousemove", moveTooltip);
      submissionNumber.addEventListener("mouseout", hideTooltip);
    });
  } catch (error) {
    console.log("Error fetching submission numbers:", error);
    alert("Failed to fetch submission numbers: " + error.message);
  }
}

function showTooltip(event) {
  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);
  }
  tooltip.innerText = event.target.dataset.tooltip;
  tooltip.style.left = event.pageX + "px";
  tooltip.style.top = event.pageY + "px";
  tooltip.classList.add("visible");
}

function moveTooltip(event) {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.style.left = event.pageX + "px";
    tooltip.style.top = event.pageY + "px";
  }
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.classList.remove("visible");
  }
}


// Call fetchSubmissionNumbers when the page loads
document.addEventListener("DOMContentLoaded", fetchSubmissionNumbers);
///////////////////////////// Fetch Submits////////////////////////////
///////////////////////////// Fetch History////////////////////////////
//////////////////// Form Submit Event///////////////////////
