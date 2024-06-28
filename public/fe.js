document.addEventListener("DOMContentLoaded", function () {
  // Set the lucky number on page load
  const currentDate = new Date();
  const timestamptodat = Date.parse(currentDate);
  let mxnm = -1;

  async function getDataAndDisplayNumber() {
    try {
      const response = await fetch("/winner-history");
      const history = await response.json();

      // Iterate through history to find the entry with the latest date and update mxnm
      history.forEach((entry) => {
        // Assuming entry.date is a Date object or a timestamp
        const toDate = new Date(entry.date);
        // console.log(timestamptodat);
        const timestamptent = Date.parse(toDate);
        if (timestamptent > timestamptodat) {
          mxnm = entry.number;
        }
      });

      // Display the latest number after fetching and processing
      document.getElementById("lucky-number").textContent = mxnm.toString();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors here
    }
  }

  getDataAndDisplayNumber();
  // Handle opening form modal
  document.getElementById("open-form").addEventListener("click", function () {
    document.getElementById("formModal").classList.remove("hidden");
  });

  // Handle loading more submissions
  document.getElementById("load-more").addEventListener("click", function () {
    const submissions = document.getElementById("submissions");
    for (let i = 0; i < 12; i++) {
      const div = document.createElement("div");
      div.className = "submission-number";
      div.innerHTML =
        '<div class="p-3 bg-blue-600 text-white text-center rounded-lg font-semibold">' +
        Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0") +
        "</div>";
      submissions.appendChild(div);
    }
  });

  // Handle toggle for responsive menu
  const toggleButton = document.getElementById("toggle-menu");
  const responsiveMenu = document.getElementById("responsive-menu");

  toggleButton.addEventListener("click", () => {
    responsiveMenu.classList.toggle("hidden");
  });

  // Close responsive menu on link/button click (if needed)
  const menuLinks = document.querySelectorAll(
    "#responsive-menu a, #open-form-responsive"
  );
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      responsiveMenu.classList.add("hidden");
    });
  });

  // Handle winner modal
  const modalshow = document.querySelector("#winnerModalshow");
  const modalshowResponsive = document.querySelector(
    "#winnerModalshowResponsive"
  );
  const modalclose = document.querySelector("#modclose");

  modalshow.addEventListener("click", function () {
    document.getElementById("winnerModal").classList.remove("hidden");
  });

  modalshowResponsive.addEventListener("click", function () {
    document.getElementById("winnerModal").classList.remove("hidden");
    responsiveMenu.classList.add("hidden"); // Close responsive menu on modal open
  });

  modalclose.addEventListener("click", function () {
    document.getElementById("winnerModal").classList.add("hidden");
  });

  // Close form modal
  const closebtn = document.querySelector("#closebtn");
  closebtn.addEventListener("click", function () {
    document.getElementById("formModal").classList.add("hidden");
  });
});
