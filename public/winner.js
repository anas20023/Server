document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch winner histories from backend
    const response = await fetch("/winner-history");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const winnerHistories = await response.json();
    //console.log(winnerHistories);

    // Display winner histories
    const winnerHistoriesContainer = document.getElementById(
      "winnerHistoriesContainer"
    );

    // Clear existing content if needed
    winnerHistoriesContainer.innerHTML = "";
    // Iterate over each history object and create HTML elements dynamically
    winnerHistories.forEach((history) => {
      let usrnm = history.users;
      usrnm.toString();
      // logic for modify the username. ex : user123 to u****23 must show some first and last letters
      let newUsrnm =
        usrnm.substring(0, 1) +
        "***" +
        usrnm.substring(usrnm.length - 2, usrnm.length);
      // should show 1st and last 1/2 letter
      //console.log(newUsrnm);
      const historyItem = document.createElement("div");
      historyItem.classList.add(
        "history-item",
        "bg-white",
        "rounded-lg",
        "shadow",
        "p-4",
        "border-l-4",
        "border-blue-500"
      );
      historyItem.innerHTML = `
    <a href="event-detail.html" class="text-lg font-medium text-gray-700 hover:text-gray-900">
      <span>Date: ${history.date}</span>
    </a>
    <div class="flex justify-between mt-2 text-blue-600">
      <span>Winning Number: ${history.number}</span>
      <span>Winner(s): ${newUsrnm}</span>
    </div>
  `;
      winnerHistoriesContainer.appendChild(historyItem);
    });
  } catch (error) {
    console.error("Error fetching winner histories:", error);
  }
});
