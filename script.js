document.addEventListener("DOMContentLoaded", () => {
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const deptDetails = {
    CSE: "The Computer Science and Engineering department focuses on software engineering, algorithms, systems design, and emerging technologies through project-based learning and industry collaboration.",
    "AI & DS": "The AI & Data Science program combines machine learning, analytics, and problem-solving to prepare students for the next generation of intelligent technologies and digital transformation.",
    IT: "The Information Technology department emphasizes networking, software systems, cybersecurity, cloud computing, and enterprise technology management for modern digital organizations.",
    ECE: "Students in ECE explore electronics, communication systems, signal processing, embedded design, and the integration of hardware with intelligent applications.",
    EEE: "The EEE department blends power systems, electronics, automation, and sustainable energy solutions for students working at the intersection of engineering and energy innovation.",
    Mechanical: "Mechanical Engineering develops skills in design, manufacturing, thermal systems, and product innovation by combining theory with practical, hands-on experimentation.",
    Civil: "Civil Engineering equips students with expertise in structural design, surveying, environmental systems, and sustainable infrastructure planning for growing urban communities."
  };

  const deptModal = document.getElementById("deptModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  document.querySelectorAll(".learn-more").forEach((button) => {
    button.addEventListener("click", () => {
      const dept = button.dataset.dept;
      modalTitle.textContent = dept;
      modalText.textContent = deptDetails[dept] || "Department information will be updated with official curriculum details.";
      deptModal.classList.add("is-open");
      deptModal.setAttribute("aria-hidden", "false");
    });
  });

  document.querySelectorAll(".modal-close, .modal-backdrop").forEach((element) => {
    element.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
      });
    });
  });

  const galleryModal = document.getElementById("galleryModal");
  const galleryImage = document.getElementById("galleryImage");
  const galleryCaption = document.getElementById("galleryCaption");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      galleryImage.src = item.dataset.full;
      galleryImage.alt = item.dataset.caption;
      galleryCaption.textContent = item.dataset.caption;
      galleryModal.classList.add("is-open");
      galleryModal.setAttribute("aria-hidden", "false");
    });
  });

  const backToTopButton = document.querySelector(".back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const validateField = (field, message) => {
    const value = field.value.trim();
    if (!value) {
      field.setCustomValidity(message);
      return false;
    }
    field.setCustomValidity("");
    return true;
  };

  const admissionForm = document.getElementById("admissionForm");
  const formMessage = document.querySelector(".form-message");

  if (admissionForm) {
    admissionForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameField = admissionForm.querySelector('input[name="name"]');
      const emailField = admissionForm.querySelector('input[name="email"]');
      const phoneField = admissionForm.querySelector('input[name="phone"]');
      const deptField = admissionForm.querySelector('select[name="department"]');
      const messageField = admissionForm.querySelector('textarea[name="message"]');

      const validName = validateField(nameField, "Please enter your name.");
      const validEmail = validateField(emailField, "Please enter your email.");
      const validPhone = validateField(phoneField, "Please enter your phone number.");
      const validDept = validateField(deptField, "Please select a preferred department.");
      const validMessage = validateField(messageField, "Please share a short message.");

      if (validEmail && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.setCustomValidity("Please enter a valid email address.");
        emailField.reportValidity();
        return;
      }

      if (validPhone && phoneField.value && phoneField.value.replace(/\D/g, "").length < 10) {
        phoneField.setCustomValidity("Phone number should contain at least 10 digits.");
        phoneField.reportValidity();
        return;
      }

      if (!validName || !validEmail || !validPhone || !validDept || !validMessage) {
        admissionForm.reportValidity();
        if (formMessage) {
          formMessage.textContent = "Please complete all required fields.";
          formMessage.className = "form-message error";
        }
        return;
      }

      admissionForm.reset();
      if (formMessage) {
        formMessage.textContent = "Your enquiry was submitted successfully.";
        formMessage.className = "form-message success";
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (contactForm.checkValidity()) {
        alert("Thank you for contacting Aurora Institute of Technology. Our team will reach out soon.");
        contactForm.reset();
      } else {
        contactForm.reportValidity();
      }
    });
  }
});
