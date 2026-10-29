document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const backToTopButton = document.querySelector(".back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 260) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const form = document.getElementById("appointmentForm");
  const formMessage = form?.querySelector(".form-message");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const phone = form.querySelector('input[name="phone"]');
      const department = form.querySelector('select[name="department"]');
      const date = form.querySelector('input[name="date"]');

      const validName = name && name.value.trim();
      const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const validPhone = phone && phone.value.replace(/\D/g, "").length >= 10;
      const validDepartment = department && department.value.trim();
      const validDate = date && date.value;

      if (!validName || !validEmail || !validPhone || !validDepartment || !validDate) {
        if (formMessage) {
          formMessage.textContent = "Please fill in all required fields correctly.";
          formMessage.className = "form-message error";
        }
        form.reportValidity();
        return;
      }

      form.reset();
      if (formMessage) {
        formMessage.textContent = "Appointment request submitted successfully.";
        formMessage.className = "form-message success";
      }
    });
  }
});
