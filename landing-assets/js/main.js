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

      const nameInput = document.getElementById("hero-name");
      const companyInput = document.getElementById("hero-company");
      const phoneInput = document.getElementById("hero-phone");
      const emailInput = document.getElementById("hero-email");
      const serviceInput = document.getElementById("hero-service");
      const budgetInput = document.getElementById("hero-budget");
      const timelineInput = document.getElementById("hero-timeline");
      const descInput = document.getElementById("hero-description");

      const name = nameInput ? nameInput.value.trim() : "";
      const company = companyInput ? companyInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const service = serviceInput ? serviceInput.value : "";
      const budget = budgetInput ? budgetInput.value : "";
      const timeline = timelineInput ? timelineInput.value : "";
      const description = descInput ? descInput.value.trim() : "";

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("hero-form-error");
      const requiredInputs = [
        { el: nameInput, name: "Name", val: name },
        { el: companyInput, name: "Company", val: company },
        { el: phoneInput, name: "Phone Number", val: phone },
        { el: emailInput, name: "Email Address", val: email },
        { el: serviceInput, name: "Service Interested In", val: (service !== "-None-" && service !== "") ? service : "" },
        { el: budgetInput, name: "Budget", val: (budget !== "-None-" && budget !== "") ? budget : "" },
        { el: timelineInput, name: "Timeline", val: (timeline !== "-None-" && timeline !== "") ? timeline : "" }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        if (!item.el) return;
        if (!item.val) {
          item.el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          item.el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        if (emailInput) emailInput.style.borderColor = "#ea4335";
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

      // Populate hidden fields
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      if (leadFormHero.querySelector("input[name='returnURL']")) leadFormHero.querySelector("input[name='returnURL']").value = currentUrl;
      if (leadFormHero.querySelector("input[name='POTENTIALCF4']")) leadFormHero.querySelector("input[name='POTENTIALCF4']").value = currentUrl;
      if (leadFormHero.querySelector("input[name='POTENTIALCF5']")) leadFormHero.querySelector("input[name='POTENTIALCF5']").value = urlParams.get('utm_source') || '';
      if (leadFormHero.querySelector("input[name='POTENTIALCF7']")) leadFormHero.querySelector("input[name='POTENTIALCF7']").value = urlParams.get('utm_campaign') || '';
      if (leadFormHero.querySelector("input[name='POTENTIALCF6']")) leadFormHero.querySelector("input[name='POTENTIALCF6']").value = urlParams.get('utm_content') || '';

      // Submit to Server-side Relay (Hostinger PHP cURL -> Bigin CRM)
      const heroFormData = new FormData(leadFormHero);
      fetch('landing-assets/submit-enquiry.php', {
        method: 'POST',
        body: heroFormData
      }).catch(err => console.warn('Server relay notice:', err));

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        company,
        email,
        phone,
        service,
        budget,
        timeline,
        description,
        source: 'Hero Form'
      });

      // Show in-place success confirmation without destroying the form from the DOM
      leadFormHero.style.display = "none";
      const card = leadFormHero.closest(".lead-form-card");
      if (card) {
        const formTitle = card.querySelector(".form-title");
        if (formTitle) formTitle.style.display = "none";

        let successDiv = card.querySelector(".form-success-container");
        if (!successDiv) {
          successDiv = document.createElement("div");
          successDiv.className = "form-success-container";
          successDiv.style.textAlign = "center";
          successDiv.style.padding = "40px 20px";
          successDiv.style.animation = "fadeIn 0.4s ease forwards";
          successDiv.innerHTML = `
            <div style="font-size: 52px; color: var(--orange); margin-bottom: 20px;">✓</div>
            <h2 style="font-size: 22px; font-weight: 800; color: #111; margin-bottom: 12px; line-height: 1.3;">
              All Set!
            </h2>
            <p style="color: #555; font-size: 14.5px; line-height: 1.6; max-width: 290px; margin: 0 auto;">
              Thanks, <strong>${name}</strong>. We've logged your request and will contact you shortly to review your ad setup.
            </p>
          `;
          card.appendChild(successDiv);
        }
      }
    });

    ["hero-name", "hero-company", "hero-phone", "hero-email", "hero-service", "hero-budget", "hero-timeline", "hero-description"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("hero-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
        el.addEventListener("change", () => {
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

      const nameInput = document.getElementById("bottom-name");
      const companyInput = document.getElementById("bottom-company");
      const phoneInput = document.getElementById("bottom-phone");
      const emailInput = document.getElementById("bottom-email");
      const serviceInput = document.getElementById("bottom-service");
      const budgetInput = document.getElementById("bottom-budget");
      const timelineInput = document.getElementById("bottom-timeline");
      const descInput = document.getElementById("bottom-description");

      const name = nameInput ? nameInput.value.trim() : "";
      const company = companyInput ? companyInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const service = serviceInput ? serviceInput.value : "";
      const budget = budgetInput ? budgetInput.value : "";
      const timeline = timelineInput ? timelineInput.value : "";
      const desc = descInput ? descInput.value.trim() : "";

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("bottom-form-error");
      const requiredInputs = [
        { el: nameInput, name: "Name", val: name },
        { el: companyInput, name: "Company", val: company },
        { el: phoneInput, name: "Phone Number", val: phone },
        { el: emailInput, name: "Email Address", val: email },
        { el: serviceInput, name: "Service Interested In", val: (service !== "-None-" && service !== "") ? service : "" },
        { el: budgetInput, name: "Budget", val: (budget !== "-None-" && budget !== "") ? budget : "" },
        { el: timelineInput, name: "Timeline", val: (timeline !== "-None-" && timeline !== "") ? timeline : "" }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        if (!item.el) return;
        if (!item.val) {
          item.el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          item.el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        if (emailInput) emailInput.style.borderColor = "#ea4335";
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

      // Populate hidden fields
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      if (leadFormBottom.querySelector("input[name='returnURL']")) leadFormBottom.querySelector("input[name='returnURL']").value = currentUrl;
      if (leadFormBottom.querySelector("input[name='POTENTIALCF4']")) leadFormBottom.querySelector("input[name='POTENTIALCF4']").value = currentUrl;
      if (leadFormBottom.querySelector("input[name='POTENTIALCF5']")) leadFormBottom.querySelector("input[name='POTENTIALCF5']").value = urlParams.get('utm_source') || '';
      if (leadFormBottom.querySelector("input[name='POTENTIALCF7']")) leadFormBottom.querySelector("input[name='POTENTIALCF7']").value = urlParams.get('utm_campaign') || '';
      if (leadFormBottom.querySelector("input[name='POTENTIALCF6']")) leadFormBottom.querySelector("input[name='POTENTIALCF6']").value = urlParams.get('utm_content') || '';

      // Submit to Server-side Relay (Hostinger PHP cURL -> Bigin CRM)
      const bottomFormData = new FormData(leadFormBottom);
      fetch('landing-assets/submit-enquiry.php', {
        method: 'POST',
        body: bottomFormData
      }).catch(err => console.warn('Server relay notice:', err));

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        company,
        email,
        phone,
        service,
        budget,
        timeline,
        description: desc,
        source: 'Bottom Lead Form'
      });

      // Show in-place success confirmation without destroying the form from the DOM
      leadFormBottom.style.display = "none";
      const card = leadFormBottom.closest(".bottom-form-card");
      if (card) {
        const bottomTitle = card.querySelector(".bottom-form-title");
        const bottomSubtitle = card.querySelector(".bottom-form-subtitle");
        const titleUnderline = card.querySelector(".title-underline");
        if (bottomTitle) bottomTitle.style.display = "none";
        if (bottomSubtitle) bottomSubtitle.style.display = "none";
        if (titleUnderline) titleUnderline.style.display = "none";

        let successDiv = card.querySelector(".form-success-container");
        if (!successDiv) {
          successDiv = document.createElement("div");
          successDiv.className = "form-success-container";
          successDiv.style.textAlign = "center";
          successDiv.style.padding = "40px 20px";
          successDiv.style.animation = "fadeIn 0.4s ease forwards";
          successDiv.innerHTML = `
            <div style="font-size: 60px; color: var(--orange); margin-bottom: 20px;">✓</div>
            <h2 style="font-size: 26px; font-weight: 800; color: #111; margin-bottom: 12px; line-height: 1.3;">
              Form Submitted!
            </h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6; max-width: 450px; margin: 0 auto;">
              Thank you, <strong>${name}</strong>. Our digital strategy team will analyze your business requirements and contact you within 24 hours.
            </p>
          `;
          card.appendChild(successDiv);
        }
      }
    });

    ["bottom-name", "bottom-company", "bottom-phone", "bottom-email", "bottom-service", "bottom-budget", "bottom-timeline", "bottom-description"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("bottom-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
        el.addEventListener("change", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("bottom-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
      }
    });
  }

  // 3. Popup Lead Form
  if (popupForm) {
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("popup-name");
      const companyInput = document.getElementById("popup-brand");
      const phoneInput = document.getElementById("popup-phone");
      const emailInput = document.getElementById("popup-email");
      const serviceInput = document.getElementById("popup-service");
      const budgetInput = document.getElementById("popup-budget");
      const timelineInput = document.getElementById("popup-timeline");
      const descInput = document.getElementById("popup-description");

      const name = nameInput ? nameInput.value.trim() : "";
      const company = companyInput ? companyInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const service = serviceInput ? serviceInput.value : "";
      const budget = budgetInput ? budgetInput.value : "";
      const timeline = timelineInput ? timelineInput.value : "";
      const desc = descInput ? descInput.value.trim() : "";

      let hasError = false;
      let errorMsg = "";
      const errorDiv = document.getElementById("popup-form-error");
      const requiredInputs = [
        { el: nameInput, name: "Name", val: name },
        { el: companyInput, name: "Brand / Company", val: company },
        { el: phoneInput, name: "Phone Number", val: phone },
        { el: emailInput, name: "Email ID", val: email },
        { el: serviceInput, name: "Service Interested In", val: service },
        { el: budgetInput, name: "Marketing Budget", val: budget },
        { el: timelineInput, name: "Timeline", val: timeline }
      ];

      let missingFields = [];
      requiredInputs.forEach(item => {
        if (!item.el) return;
        if (!item.val) {
          item.el.style.borderColor = "#ea4335";
          missingFields.push(item.name);
          hasError = true;
        } else {
          item.el.style.borderColor = "#e2e8f0";
        }
      });

      if (missingFields.length > 0) {
        errorMsg = `Please fill in required fields: ${missingFields.join(", ")}.`;
      } else if (email && !validateEmail(email)) {
        if (emailInput) emailInput.style.borderColor = "#ea4335";
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

      // Populate hidden fields
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      if (popupForm.querySelector("input[name='returnURL']")) popupForm.querySelector("input[name='returnURL']").value = currentUrl;
      if (popupForm.querySelector("input[name='POTENTIALCF4']")) popupForm.querySelector("input[name='POTENTIALCF4']").value = currentUrl;
      if (popupForm.querySelector("input[name='POTENTIALCF5']")) popupForm.querySelector("input[name='POTENTIALCF5']").value = urlParams.get('utm_source') || '';
      if (popupForm.querySelector("input[name='POTENTIALCF7']")) popupForm.querySelector("input[name='POTENTIALCF7']").value = urlParams.get('utm_campaign') || '';
      if (popupForm.querySelector("input[name='POTENTIALCF6']")) popupForm.querySelector("input[name='POTENTIALCF6']").value = urlParams.get('utm_content') || '';

      // Submit to Server-side Relay (Hostinger PHP cURL -> Bigin CRM)
      const popupFormData = new FormData(popupForm);
      fetch('landing-assets/submit-enquiry.php', {
        method: 'POST',
        body: popupFormData
      }).catch(err => console.warn('Server relay notice:', err));

      // Submit to Google Sheets
      submitToGoogleSheet({
        name,
        company,
        email,
        phone,
        service,
        budget,
        timeline,
        description: desc,
        source: 'Popup Form'
      });

      // Show in-place success confirmation without destroying the form from the DOM
      popupForm.style.display = "none";
      const formBody = document.getElementById("popup-content-body");
      if (formBody) {
        let successDiv = formBody.querySelector(".popup-success-container");
        if (!successDiv) {
          successDiv = document.createElement("div");
          successDiv.className = "popup-success-container";
          successDiv.style.textAlign = "center";
          successDiv.style.padding = "30px 10px";
          successDiv.style.animation = "fadeIn 0.4s ease forwards";
          successDiv.innerHTML = `
            <div style="font-size: 52px; color: var(--purple); margin-bottom: 16px;">✓</div>
            <h3 style="color: var(--purple); font-size: 22px; font-weight: 800; margin: 0 0 10px 0; line-height: 1.3;">
              Thank You!
            </h3>
            <p style="color: #555; font-size: 14.5px; line-height: 1.6; margin-bottom: 20px;">
              Your message has been sent. We'll be in touch shortly.
            </p>
            <button onclick="window.closePopup()" class="popup-btn popup-btn-primary" style="margin-top: 4px;">
              Close
            </button>
          `;
          formBody.appendChild(successDiv);
        }
      }

      // Close popup after 4 seconds
      setTimeout(() => {
        window.closePopup();
      }, 4000);
    });

    ["popup-name", "popup-brand", "popup-phone", "popup-email", "popup-service", "popup-budget", "popup-timeline", "popup-description"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          el.style.borderColor = "#e2e8f0";
          const errorDiv = document.getElementById("popup-form-error");
          if (errorDiv) errorDiv.style.display = "none";
        });
        el.addEventListener("change", () => {
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
