document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/winner-history");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const winnerHistories = await response.json();
    const winnerHistoriesContainer = document.getElementById(
      "winnerHistoriesContainer"
    );
    winnerHistoriesContainer.innerHTML = "";

    winnerHistories.forEach((history) => {
      let usrnm = history.users;
      let newUsrnm;
      let winnerprize = 0;
      if (usrnm !== "no winner") {
        newUsrnm = "1";
        winnerprize = 100;
      } else {
        newUsrnm = "0";
      }
      let datestr = history.date;
      let newDatestr = datestr.substring(0, 10);

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
        <div class="flex flex-row text-lg justify-between cursor-pointer items-center font-medium text-gray-700 hover:text-gray-900">
          <div class="flex flex-col justify-evenly">
            <p>Date: ${newDatestr}</p>
            <p class="text-sm">Event ID: ${history.evnt}</p>
          </div>
          <div class="flex flex-col justify-evenly items-end text-2xl text-blue-600 lg:text-4xl font-bold">
            ${history.number}
            <span class="text-xs lg:text-sm text-gray-800 font-medium">Winning Number</span>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-blue-600">
          <span>Payout Prize: ${winnerprize}</span>
          <span>Winner(s): ${newUsrnm}</span>
        </div>
      `;

      historyItem.addEventListener("click", () => {
        if (newUsrnm === "0") {
          newUsrnm = "no winner";
        } else {
          newUsrnm = usrnm;
        }
        const urlParams = new URLSearchParams({
          date: newDatestr,
          number: history.number,
          winner: newUsrnm,
          prize: winnerprize,
          eventID: history.evnt,
        }).toString();

        window.location.href = `event-detail.html?${urlParams}`;
      });

      winnerHistoriesContainer.appendChild(historyItem);
    });
  } catch (error) {
    console.error("Error fetching winner histories:", error);
  }
});
