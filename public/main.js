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

      const historyContainer = document.querySelector(
        "#create_dv"
      );
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
//////////////////// Form Submit Event///////////////////////
async function fetchEvents() {
  const response = await fetch("http://localhost:5000/events");
  const events = await response.json();
  console.log(events);
}

//fetchEvents();
