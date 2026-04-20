document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLL FADE ANIMATION =================
  // Targets all elements that need fade-in on scroll
  const fadeSelectors = [
    ".fade",
    ".step-box",
    ".why-btn",
    ".btn-start",
    ".card"
  ];

  const allFadeEls = document.querySelectorAll(fadeSelectors.join(","));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  allFadeEls.forEach((el) => observer.observe(el));

  // ================= SEARCH TRIP =================
  window.searchTrip = function () {
    const from = "Albay";
    const to = document.getElementById("to")?.value;
    const date = document.getElementById("date")?.value;

    if (!to || !date) {
      alert("Please enter destination and date");
      return;
    }

    window.location.href = `results.html?from=${from}&to=${to}&date=${date}`;
  };

  // ================= SEAT SELECTION =================
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("booked")
    ) {
      e.target.classList.toggle("selected");
    }
  });

  // ================= FORM VALIDATION =================
  const form = document.getElementById("registerForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      const password = document.getElementById("password")?.value;
      const confirm = document.getElementById("confirmPassword")?.value;

      if (!password || !confirm) return;

      if (password.length < 6) {
        e.preventDefault();
        alert("Password must be at least 6 characters");
        return;
      }

      if (password !== confirm) {
        e.preventDefault();
        alert("Passwords do not match");
        return;
      }
    });
  }
});

// ================= PASSWORD TOGGLE =================
// Must be OUTSIDE DOMContentLoaded to be globally accessible from HTML onclick=""
function togglePassword() {
  const pass = document.getElementById("password");
  const confirm = document.getElementById("confirmPassword");

  if (!pass || !confirm) return;

  const isHidden = pass.type === "password";
  pass.type = isHidden ? "text" : "password";
  confirm.type = isHidden ? "text" : "password";
}

