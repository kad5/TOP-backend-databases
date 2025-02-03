const dialog = document.querySelector("dialog");
const openBtn = dialog.nextElementSibling;
const wrapper = document.querySelector("form");
openBtn.addEventListener("click", () => dialog.showModal());
dialog.addEventListener(
  "click",
  (e) => !wrapper.contains(e.target) && dialog.close()
);

document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("rating-value");
  let currentRating = 1;

  // Function to highlight stars on hover
  function highlightStars(index) {
    stars.forEach((star, idx) => {
      if (idx < index) {
        star.classList.add("filled");
      } else {
        star.classList.remove("filled");
      }
    });
  }

  // Event listeners for hovering over the stars
  stars.forEach((star) => {
    star.addEventListener("mouseenter", function () {
      const value = parseInt(star.getAttribute("data-value"), 10);
      highlightStars(value);
    });

    // Reset stars on mouse leave
    star.addEventListener("mouseleave", function () {
      highlightStars(currentRating);
    });

    // Click to set the rating
    star.addEventListener("click", function () {
      currentRating = parseInt(star.getAttribute("data-value"), 10);
      ratingValue.textContent = currentRating;
      highlightStars(currentRating);
    });
  });
});
