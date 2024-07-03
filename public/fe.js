document.addEventListener("DOMContentLoaded", function () {
  // Handle opening form modal
  document.getElementById("open-form").addEventListener("click", function () {
    document.getElementById("formModal").classList.remove("hidden");
  });

  // Handle loading more submissions

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
  const modalclose = document.querySelector("#modclose");

  modalshow.addEventListener("click", function () {
    document.getElementById("winnerModal").classList.remove("hidden");
    //redirect to winner-history html
    //window.location.href = "winner-history.html";
  });

  if (modalclose) {
    modalclose.addEventListener("click", function () {
      //console.log(e);
      document.getElementById("winnerModal").classList.add("hidden");
    });
  }

  // Close form modal
  const closebtn = document.querySelector("#closebtn");
  if (closebtn) {
    closebtn.addEventListener("click", function () {
      document.getElementById("formModal").classList.add("hidden");
    });
  }
});
////////////////////////////////////////////////////////////////////
///////////Button Control button will apear after 5mins and desapir and a time counter will added ////////////////
// set a count down div when btn in hidden for interval time
///////////Button Control////////////////
