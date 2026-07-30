document.addEventListener("DOMContentLoaded", () => {
  // ─── DOM ELEMENTS ────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const navLogo = document.getElementById("nav-logo");
  const navWrapper = document.getElementById("nav-wrapper");
  const navLinksList = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");
  const navActions = document.getElementById("nav-actions");
  const navHamburger = document.getElementById("nav-hamburger");
  const hamburgerBar1 = document.querySelector(".bar--1");
  const hamburgerBar2 = document.querySelector(".bar--2");
  const hamburgerBar3 = document.querySelector(".bar--3");
  const currentYearSpan = document.getElementById("current-year");
  const faqTriggers = document.querySelectorAll(".faq-trigger");

  // Forms
  const leadFormHero = document.getElementById("lead-form-hero");
  const leadFormBottom = document.getElementById("lead-form-bottom");
  const popupForm = document.getElementById("popupForm");

  // Popup Elements
  const popupOverlay = document.getElementById("myPopup");
  const popupCloseBtn = document.getElementById("popup-close-btn");
  const popupCancelBtn = document.getElementById("popup-cancel-btn");

  // ─── SET CURRENT YEAR IN FOOTER ──────────────────────
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ─── SCROLLED NAVBAR LOGIC ────────────────────────────
  const handleScroll = () => {
    const isScrolled = window.scrollY > 60;
    navbar.classList.toggle("navbar--scrolled", isScrolled);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // ─── HAMBURGER MENU TOGGLE ────────────────────────────
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    navHamburger.setAttribute("aria-expanded", menuOpen);
    navHamburger.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");
    navLinksList.classList.toggle("nav-links--open", menuOpen);

    hamburgerBar1.classList.toggle("bar--open-1", menuOpen);
    hamburgerBar2.classList.toggle("bar--open-2", menuOpen);
    hamburgerBar3.classList.toggle("bar--open-3", menuOpen);
  };

  navHamburger.addEventListener("click", toggleMenu);

  // Close menu when a link is clicked
  navLinksList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (menuOpen) {
        toggleMenu();
      }
    });
  });

  // ─── SMOOTH SCROLL & NO-HASH NAVIGATION ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          // Adjust scroll offset if there is a sticky header
          const headerHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });




  // ─── FAQ ACCORDION LOGIC ──────────────────────────────
  faqTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const parent = trigger.parentElement;
      const panel = parent.querySelector(".faq-panel");
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      // Close all other panels first
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          otherTrigger.parentElement.querySelector(".faq-panel").style.maxHeight = null;
          otherTrigger.querySelector(".faq-icon-indicator").textContent = "+";
        }
      });

      // Toggle this panel
      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
        trigger.querySelector(".faq-icon-indicator").textContent = "+";
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.querySelector(".faq-icon-indicator").textContent = "−";
      }
    });
  });

  // ─── INTERACTIVE CAT POPUP LOGIC ──────────────────────
  
  // Make popup trigger globally accessible
  window.openPopup = () => {
    if (!popupOverlay) return;
    popupOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closePopup = () => {
    if (!popupOverlay) return;
    popupOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  if (popupCloseBtn) popupCloseBtn.addEventListener("click", window.closePopup);
  if (popupCancelBtn) popupCancelBtn.addEventListener("click", window.closePopup);

  // Close popup if clicking on the background overlay
  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        window.closePopup();
      }
    });
  }

  // Close popup on Escape keypress
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closePopup();
    }
  });

  // ─── AUTOLOAD TRIGGER ON VISIT ────────────────────────
  window.addEventListener("load", () => {
    setTimeout(() => {
      window.openPopup();
    }, 10000);
  });

  // ─── FORM SUBMISSIONS ─────────────────────────────────

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // 1. Hero Lead Form
  if (leadFormHero) {
    leadFormHero.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("hero-name").value.trim();
      const email = document.getElementById("hero-email").value.trim();
      const phone = document.getElementById("hero-phone").value.trim();
      const brand = document.getElementById("hero-brand").value.trim();
      const budget = document.getElementById("hero-budget").value;
      const website = document.getElementById("hero-website").value.trim();
      const description = document.getElementById("hero-description").value.trim();

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("hero-form-error");
      const requiredInputs = [
        { id: "hero-name", name: "Name", val: name },
        { id: "hero-email", name: "Email ID", val: email },
        { id: "hero-phone", name: "Phone Number", val: phone }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        const el = document.getElementById(item.id);
        if (!item.val) {
          el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        const emailEl = document.getElementById("hero-email");
        emailEl.style.borderColor = "#ea4335";
        errorMsg = "Please enter a valid email address.";
        hasError = true;
      }

      if (hasError) {
        if (errorDiv) {
          errorDiv.querySelector(".error-text").textContent = errorMsg;
          errorDiv.style.display = "flex";
        }
        return;
      } else {
        if (errorDiv) {
          errorDiv.style.display = "none";
        }
      }

      // Show submitting state
      const submitBtn = leadFormHero.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        email,
        phone,
        brand,
        budget,
        website,
        description
      }).then(() => {
        // success banner
        const card = leadFormHero.closest(".lead-form-card");
        if (card) {
          card.innerHTML = `
            <div class="form-success-container" style="text-align: center; padding: 40px 20px; animation: fadeIn 0.4s ease forwards;">
              <div style="font-size: 52px; color: var(--orange); margin-bottom: 20px;">✓</div>
              <h2 style="font-size: 22px; font-weight: 800; color: #111; margin-bottom: 12px; line-height: 1.3;">
                All Set!
              </h2>
              <p style="color: #555; font-size: 14.5px; line-height: 1.6; max-width: 290px; margin: 0 auto;">
                Thanks, <strong>${name}</strong>. We've logged your request and will contact you shortly to review your ad setup.
              </p>
            </div>
          `;
        }
      });
    });

    ["hero-name", "hero-email", "hero-phone"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("hero-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
      }
    });
  }

  // 2. Bottom Lead Form
  if (leadFormBottom) {
    leadFormBottom.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("bottom-name").value.trim();
      const email = document.getElementById("bottom-email").value.trim();
      const phone = document.getElementById("bottom-phone").value.trim();
      const brand = document.getElementById("bottom-brand").value.trim();
      const budget = document.getElementById("bottom-budget").value;
      const website = document.getElementById("bottom-website").value.trim();
      const desc = document.getElementById("bottom-description").value.trim();

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("bottom-form-error");
      const requiredInputs = [
        { id: "bottom-name", name: "Name", val: name },
        { id: "bottom-email", name: "Email ID", val: email },
        { id: "bottom-phone", name: "Phone Number", val: phone }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        const el = document.getElementById(item.id);
        if (!item.val) {
          el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        const emailEl = document.getElementById("bottom-email");
        emailEl.style.borderColor = "#ea4335";
        errorMsg = "Please enter a valid email address.";
        hasError = true;
      }

      if (hasError) {
        if (errorDiv) {
          errorDiv.querySelector(".error-text").textContent = errorMsg;
          errorDiv.style.display = "flex";
        }
        return;
      } else {
        if (errorDiv) {
          errorDiv.style.display = "none";
        }
      }

      // Show submitting state
      const submitBtn = leadFormBottom.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        email,
        phone,
        brand,
        budget,
        website,
        description: desc
      }).then(() => {
        const card = leadFormBottom.closest(".bottom-form-card");
        if (card) {
          card.innerHTML = `
            <div class="form-success-container" style="text-align: center; padding: 40px 20px; animation: fadeIn 0.4s ease forwards;">
              <div style="font-size: 60px; color: var(--orange); margin-bottom: 20px;">✓</div>
              <h2 style="font-size: 26px; font-weight: 800; color: #111; margin-bottom: 12px; line-height: 1.3;">
                Form Submitted!
              </h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; max-width: 450px; margin: 0 auto;">
                Thank you, <strong>${name}</strong>. Our digital strategy team will analyze your business requirements and contact you within 24 hours.
              </p>
            </div>
          `;
        }
      });
    });

    ["bottom-name", "bottom-email", "bottom-phone"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("bottom-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
      }
    });
  }

  // 3. Popup Form Submission
  if (popupForm) {
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("popup-name").value.trim();
      const email = document.getElementById("popup-email").value.trim();
      const phone = document.getElementById("popup-phone").value.trim();
      const brand = document.getElementById("popup-brand").value.trim();
      const budget = document.getElementById("popup-budget").value;
      const website = document.getElementById("popup-website").value.trim();
      const desc = document.getElementById("popup-description").value.trim();

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("popup-form-error");
      const requiredInputs = [
        { id: "popup-name", name: "Name", val: name },
        { id: "popup-email", name: "Email ID", val: email },
        { id: "popup-phone", name: "Phone Number", val: phone }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        const el = document.getElementById(item.id);
        if (!item.val) {
          el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        const emailEl = document.getElementById("popup-email");
        emailEl.style.borderColor = "#ea4335";
        errorMsg = "Please enter a valid email address.";
        hasError = true;
      }

      if (hasError) {
        if (errorDiv) {
          errorDiv.querySelector(".error-text").textContent = errorMsg;
          errorDiv.style.display = "flex";
        }
        return;
      } else {
        if (errorDiv) {
          errorDiv.style.display = "none";
        }
      }

      // Show submitting state
      const submitBtn = popupForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        email,
        phone,
        brand,
        budget,
        website,
        description: desc
      }).then(() => {
        const formBody = document.getElementById("popup-content-body");
        if (formBody) {
          formBody.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; animation: fadeIn 0.4s ease forwards;">
              <div style="font-size: 52px; color: var(--purple); margin-bottom: 16px;">✓</div>
              <h3 style="color: var(--purple); font-size: 22px; font-weight: 800; margin: 0 0 10px 0; line-height: 1.3;">
                Thank You!
              </h3>
              <p style="color: #555; font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">
                Your message has been sent. We'll be in touch shortly.
              </p>
              <button onclick="closePopup()" class="popup-btn popup-btn-primary" style="margin-top: 4px;">
                Close
              </button>
            </div>
          `;
        }

        // Close popup after 4 seconds
        setTimeout(() => {
          window.closePopup();
        }, 4000);
      });
    });

    ["popup-name", "popup-email", "popup-phone"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("popup-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
      }
    });
  }

  // ─── SCROLL ENTRY OBSERVER ───────────────────────────
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-active");
        animationObserver.unobserve(entry.target); // Trigger animation once
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: "0px 0px -20px 0px"
  });

  const animatedElements = document.querySelectorAll(".fade-in-up");
  animatedElements.forEach(el => animationObserver.observe(el));
});
