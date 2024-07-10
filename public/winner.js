document.addEventListener("DOMContentLoaded", async () => {
  try {
    let rsltobj = await getluck();
    const winnerHistoriesContainer = document.getElementById(
      "winnerHistoriesContainer"
    );
    winnerHistoriesContainer.innerHTML = "";

    for (const rslt of rsltobj) {
      //console.log(rslt);
      let eventID = rslt.nmbr;
      let luckyNumber = rslt.luck;
      let { tprize, twinners } = await calculatePrizes(eventID);
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
            <p>Date: ${new Date().toISOString().substring(0, 10)}</p>
            <p class="text-sm">Event ID: ${eventID}</p>
          </div>
          <div class="flex flex-col justify-evenly items-end text-2xl text-blue-600 lg:text-4xl font-bold">
            ${luckyNumber}
            <span class="text-xs lg:text-sm text-gray-800 font-medium">Winning Number</span>
          </div>
        </div>
        <div class="flex justify-between mt-2 text-blue-600">
          <span class="font-medium">Payout Prize: ${tprize}$</span>
          <span>Winner(s): ${twinners}</span>
        </div>
      `;

      winnerHistoriesContainer.appendChild(historyItem);

      historyItem.addEventListener("click", () => {
        const urlParams = new URLSearchParams({
          date: new Date().toISOString().substring(0, 10),
          number: luckyNumber,
          eventID: eventID,
        }).toString();

        window.location.href = `event-detail.html?${urlParams}`;
      });
    }
  } catch (error) {
    console.error("Error fetching winner histories:", error);
  }
});

const winnerlist = async (eventid) => {
  try {
    const response = await fetch(`/${eventid}/winners`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching winner list:", error);
  }
};

const getluck = async () => {
  try {
    const response = await fetch("/lucky");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

async function calculatePrizes(eventid) {
  try {
    const result = await winnerlist(eventid);
    let tprize = 0;
    let twinners = 0;
    result.forEach((dt) => {
      if (dt.prize !== 0) {
        tprize += dt.prize;
        twinners++;
      }
    });
    return { tprize, twinners };
  } catch (error) {
    console.error("Error:", error);
    return { tprize: 0, twinners: 0 };
  }
}
