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

  // ─── COUNTRY CODE PICKER DATA & INITIALIZER ─────────────
  const COUNTRIES_DATA = [
    { iso: "in", fl: "🇮🇳", ds: "India", dial: "+91" },
    { iso: "ae", fl: "🇦🇪", ds: "United Arab Emirates", dial: "+971" },
    { iso: "sa", fl: "🇸🇦", ds: "Saudi Arabia", dial: "+966" },
    { iso: "qa", fl: "🇶🇦", ds: "Qatar", dial: "+974" },
    { iso: "kw", fl: "🇰🇼", ds: "Kuwait", dial: "+965" },
    { iso: "om", fl: "🇴🇲", ds: "Oman", dial: "+968" },
    { iso: "bh", fl: "🇧🇭", ds: "Bahrain", dial: "+973" },
    { iso: "gb", fl: "🇬🇧", ds: "United Kingdom", dial: "+44" },
    { iso: "us", fl: "🇺🇸", ds: "United States", dial: "+1" },
    { iso: "ca", fl: "🇨🇦", ds: "Canada", dial: "+1" },
    { iso: "au", fl: "🇦🇺", ds: "Australia", dial: "+61" },
    { iso: "sg", fl: "🇸🇬", ds: "Singapore", dial: "+65" },
    { iso: "my", fl: "🇲🇾", ds: "Malaysia", dial: "+60" },
    { iso: "de", fl: "🇩🇪", ds: "Germany", dial: "+49" },
    { iso: "fr", fl: "🇫🇷", ds: "France", dial: "+33" },
    { iso: "it", fl: "🇮🇹", ds: "Italy", dial: "+39" },
    { iso: "es", fl: "🇪🇸", ds: "Spain", dial: "+34" },
    { iso: "nl", fl: "🇳🇱", ds: "Netherlands", dial: "+31" },
    { iso: "se", fl: "🇸🇪", ds: "Sweden", dial: "+46" },
    { iso: "ch", fl: "🇨🇭", ds: "Switzerland", dial: "+41" },
    { iso: "nz", fl: "🇳🇿", ds: "New Zealand", dial: "+64" },
    { iso: "ie", fl: "🇮🇪", ds: "Ireland", dial: "+353" },
    { iso: "za", fl: "🇿🇦", ds: "South Africa", dial: "+27" },
    { iso: "pk", fl: "🇵🇰", ds: "Pakistan", dial: "+92" },
    { iso: "bd", fl: "🇧🇩", ds: "Bangladesh", dial: "+880" },
    { iso: "lk", fl: "🇱🇰", ds: "Sri Lanka", dial: "+94" },
    { iso: "np", fl: "🇳🇵", ds: "Nepal", dial: "+977" },
    { iso: "ph", fl: "🇵🇭", ds: "Philippines", dial: "+63" },
    { iso: "id", fl: "🇮🇩", ds: "Indonesia", dial: "+62" },
    { iso: "th", fl: "🇹🇭", ds: "Thailand", dial: "+66" },
    { iso: "vn", fl: "🇻🇳", ds: "Vietnam", dial: "+84" },
    { iso: "eg", fl: "🇪🇬", ds: "Egypt", dial: "+20" },
    { iso: "ng", fl: "🇳🇬", ds: "Nigeria", dial: "+234" },
    { iso: "ke", fl: "🇰🇪", ds: "Kenya", dial: "+254" },
    { iso: "br", fl: "🇧🇷", ds: "Brazil", dial: "+55" },
    { iso: "mx", fl: "🇲🇽", ds: "Mexico", dial: "+52" },
    { iso: "jp", fl: "🇯🇵", ds: "Japan", dial: "+81" },
    { iso: "kr", fl: "🇰🇷", ds: "South Korea", dial: "+82" },
    { iso: "cn", fl: "🇨🇳", ds: "China", dial: "+86" },
    { iso: "hk", fl: "🇭🇰", ds: "Hong Kong", dial: "+852" },
    { iso: "ru", fl: "🇷🇺", ds: "Russia", dial: "+7" },
    { iso: "tr", fl: "🇹🇷", ds: "Turkey", dial: "+90" },
    { iso: "pl", fl: "🇵🇱", ds: "Poland", dial: "+48" },
    { iso: "no", fl: "🇳🇴", ds: "Norway", dial: "+47" },
    { iso: "dk", fl: "🇩🇰", ds: "Denmark", dial: "+45" },
    { iso: "fi", fl: "🇫🇮", ds: "Finland", dial: "+358" },
    { iso: "be", fl: "🇧🇪", ds: "Belgium", dial: "+32" },
    { iso: "at", fl: "🇦🇹", ds: "Austria", dial: "+43" },
    { iso: "pt", fl: "🇵🇹", ds: "Portugal", dial: "+351" },
    { iso: "gr", fl: "🇬🇷", ds: "Greece", dial: "+30" },
    { iso: "af", fl: "🇦🇫", ds: "Afghanistan", dial: "+93" },
    { iso: "al", fl: "🇦🇱", ds: "Albania", dial: "+355" },
    { iso: "dz", fl: "🇩🇿", ds: "Algeria", dial: "+213" },
    { iso: "ad", fl: "🇦🇩", ds: "Andorra", dial: "+376" },
    { iso: "ao", fl: "🇦🇴", ds: "Angola", dial: "+244" },
    { iso: "ar", fl: "🇦🇷", ds: "Argentina", dial: "+54" },
    { iso: "am", fl: "🇦🇲", ds: "Armenia", dial: "+374" },
    { iso: "az", fl: "🇦🇿", ds: "Azerbaijan", dial: "+994" },
    { iso: "by", fl: "🇧🇾", ds: "Belarus", dial: "+375" },
    { iso: "cl", fl: "🇨🇱", ds: "Chile", dial: "+56" },
    { iso: "co", fl: "🇨🇴", ds: "Colombia", dial: "+57" },
    { iso: "cz", fl: "🇨🇿", ds: "Czechia", dial: "+420" },
    { iso: "hu", fl: "🇭🇺", ds: "Hungary", dial: "+36" },
    { iso: "il", fl: "🇮🇱", ds: "Israel", dial: "+972" },
    { iso: "jo", fl: "🇯🇴", ds: "Jordan", dial: "+962" },
    { iso: "lb", fl: "🇱🇧", ds: "Lebanon", dial: "+961" },
    { iso: "mv", fl: "🇲🇻", ds: "Maldives", dial: "+960" },
    { iso: "mu", fl: "🇲🇺", ds: "Mauritius", dial: "+230" },
    { iso: "ma", fl: "🇲🇦", ds: "Morocco", dial: "+212" },
    { iso: "ro", fl: "🇷🇴", ds: "Romania", dial: "+40" }
  ];

  const initCountryCodeDropdown = (wrapperId, btnId, menuId, codeId) => {
    const wrapper = document.getElementById(wrapperId);
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    const codeEl = document.getElementById(codeId);
    if (!wrapper || !btn || !menu || !codeEl) return;

    const searchInput = menu.querySelector(".phone-search-input");
    const optionsList = menu.querySelector(".phone-options-list");

    const renderList = (filterText = "") => {
      optionsList.innerHTML = "";
      const search = filterText.toLowerCase().trim();
      const filtered = COUNTRIES_DATA.filter(c =>
        c.ds.toLowerCase().includes(search) || c.dial.includes(search) || c.iso.includes(search)
      );

      if (filtered.length === 0) {
        const noRes = document.createElement("li");
        noRes.className = "phone-no-results";
        noRes.textContent = "No country found";
        optionsList.appendChild(noRes);
        return;
      }

      filtered.forEach(c => {
        const li = document.createElement("li");
        li.className = "phone-option-item";
        if (codeEl.textContent.trim() === c.dial) {
          li.classList.add("selected");
        }
        li.innerHTML = `
          <div class="phone-option-left">
            <span class="phone-option-name">${c.ds}</span>
          </div>
          <span class="phone-option-dial">${c.dial}</span>
        `;
        li.addEventListener("click", () => {
          codeEl.textContent = c.dial;
          closeMenu();
        });
        optionsList.appendChild(li);
      });
    };

    const openMenu = () => {
      document.querySelectorAll(".phone-country-menu.open").forEach(m => m.classList.remove("open"));
      document.querySelectorAll(".phone-country-dropdown-btn.active").forEach(b => b.classList.remove("active"));
      menu.classList.add("open");
      btn.classList.add("active");
      btn.setAttribute("aria-expanded", "true");
      renderList(searchInput ? searchInput.value : "");
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 50);
      }
    };

    const closeMenu = () => {
      menu.classList.remove("open");
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
      if (searchInput) searchInput.value = "";
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderList(e.target.value);
      });
      searchInput.addEventListener("click", (e) => e.stopPropagation());
    }

    menu.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
      }
    });

    // Initial render
    renderList();
  };

  // Initialize phone dropdowns for both forms
  initCountryCodeDropdown("hero-phone-wrapper", "hero-country-btn", "hero-country-menu", "hero-code");
  initCountryCodeDropdown("bottom-phone-wrapper", "bottom-country-btn", "bottom-country-menu", "bottom-code");

  // ─── FORM SUBMISSIONS ─────────────────────────────────

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // ─── HELPER: PREPARE AND SUBMIT TO BIGIN CRM & GOOGLE SHEETS ───────
  const prepareAndSubmitBiginForm = (form, leadData, submitBtn) => {
    // 1. Calculate absolute redirect URL to thank-you.html
    const thankYouUrl = new URL('thank-you.html', window.location.href).href;
    const currentUrl = window.location.href;

    // 2. Fetch UTMs & Tracking IDs
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || sessionStorage.getItem('vca_utm_source') || '';
    const utmCampaign = urlParams.get('utm_campaign') || sessionStorage.getItem('vca_utm_campaign') || '';
    const utmContent = urlParams.get('utm_content') || sessionStorage.getItem('vca_utm_content') || '';
    const zcGad = urlParams.get('gclid') || urlParams.get('zc_gad') || sessionStorage.getItem('vca_zc_gad') || '';

    // Helper to ensure input exists and is set
    const setHiddenField = (name, value) => {
      let input = form.querySelector(`input[name='${name}']`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    };

    // 3. Populate Bigin tokens and configuration
    setHiddenField('xnQsjsdp', 'a7f69a1ccd4de40bed4645b95d4e4f31865afdeda5a2bbad80fe0f17dbf6b497');
    setHiddenField('xmIwtLD', '6ef2a84dc27fb5ab21b6da00d89fb8ab77a5e3dfddf5ab87ccd38218df78e113fb88bcdca886b27dffc6ca697bdcf5bb');
    setHiddenField('actionType', 'UG90ZW50aWFscw==');
    setHiddenField('returnURL', thankYouUrl);
    setHiddenField('Pipeline', 'Sales Pipeline Standard 1');
    setHiddenField('Stage', 'Qualification');
    setHiddenField('Lead Source', 'Official Website');

    // 4. Populate Tracking & UTM Fields
    setHiddenField('zc_gad', zcGad);
    setHiddenField('POTENTIALCF4', currentUrl);
    setHiddenField('POTENTIALCF5', utmSource);
    setHiddenField('POTENTIALCF7', utmCampaign);
    setHiddenField('POTENTIALCF6', utmContent);

    // 5. Ensure Contacts.Mobile is populated with dialcode + phone
    setHiddenField('Contacts.Mobile', leadData.phone || '');

    // 6. Ensure form action and method are set for Bigin CRM
    form.action = 'https://bigin.zoho.com/crm/WebForm';
    form.method = 'POST';
    form.enctype = 'multipart/form-data';

    // 7. Attach UTMs & Tracking data to Google Sheets payload
    const fullSheetData = {
      ...leadData,
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      lead_page_url: currentUrl,
      gclid: zcGad
    };

    // 8. Submit to Google Sheets in background, then submit directly to Bigin CRM
    let submitted = false;
    const executeBiginSubmit = () => {
      if (!submitted) {
        submitted = true;
        try {
          HTMLFormElement.prototype.submit.call(form);
        } catch (err) {
          form.submit();
        }
      }
    };

    if (window.submitToGoogleSheet) {
      window.submitToGoogleSheet(fullSheetData)
        .then(() => {
          setTimeout(executeBiginSubmit, 150);
        })
        .catch(() => {
          executeBiginSubmit();
        });
      // Safety timeout in case sheet request is slow
      setTimeout(executeBiginSubmit, 450);
    } else {
      executeBiginSubmit();
    }
  };

  // 1. Hero Lead Form
  if (leadFormHero) {
    leadFormHero.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("hero-name");
      const companyInput = document.getElementById("hero-company");
      const phoneInput = document.getElementById("hero-phone");
      const phoneCodeEl = document.getElementById("hero-code");
      const emailInput = document.getElementById("hero-email");
      const serviceInput = document.getElementById("hero-service");
      const budgetInput = document.getElementById("hero-budget");
      const timelineInput = document.getElementById("hero-timeline");
      const descInput = document.getElementById("hero-description");

      const name = nameInput ? nameInput.value.trim() : "";
      const company = companyInput ? companyInput.value.trim() : "";
      const rawPhone = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : "";
      const dialCode = phoneCodeEl ? phoneCodeEl.textContent.trim() : "+91";
      const fullPhone = rawPhone ? (dialCode + rawPhone) : "";
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
        { el: phoneInput, name: "Phone Number", val: rawPhone },
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
      } else if (rawPhone && !/^[0-9+\-()\s]{6,16}$/.test(rawPhone)) {
        if (phoneInput) phoneInput.style.borderColor = "#ea4335";
        errorMsg = "Please enter a valid phone number.";
        hasError = true;
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

      // Sync hidden field
      const hiddenPhone = document.getElementById("hero-phone-hidden");
      if (hiddenPhone) hiddenPhone.value = fullPhone;

      // Submit to Bigin CRM & Google Sheets
      prepareAndSubmitBiginForm(leadFormHero, {
        name,
        company,
        email,
        phone: fullPhone,
        service,
        budget,
        timeline,
        description,
        source: 'Hero Form'
      }, submitBtn);
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
      const phoneCodeEl = document.getElementById("bottom-code");
      const emailInput = document.getElementById("bottom-email");
      const serviceInput = document.getElementById("bottom-service");
      const budgetInput = document.getElementById("bottom-budget");
      const timelineInput = document.getElementById("bottom-timeline");
      const descInput = document.getElementById("bottom-description");

      const name = nameInput ? nameInput.value.trim() : "";
      const company = companyInput ? companyInput.value.trim() : "";
      const rawPhone = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : "";
      const dialCode = phoneCodeEl ? phoneCodeEl.textContent.trim() : "+91";
      const fullPhone = rawPhone ? (dialCode + rawPhone) : "";
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
        { el: phoneInput, name: "Phone Number", val: rawPhone },
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
      } else if (rawPhone && !/^[0-9+\-()\s]{6,16}$/.test(rawPhone)) {
        if (phoneInput) phoneInput.style.borderColor = "#ea4335";
        errorMsg = "Please enter a valid phone number.";
        hasError = true;
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

      // Sync hidden field
      const hiddenPhone = document.getElementById("bottom-phone-hidden");
      if (hiddenPhone) hiddenPhone.value = fullPhone;

      // Submit to Bigin CRM & Google Sheets
      prepareAndSubmitBiginForm(leadFormBottom, {
        name,
        company,
        email,
        phone: fullPhone,
        service,
        budget,
        timeline,
        description: desc,
        source: 'Bottom Lead Form'
      }, submitBtn);
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
        { el: serviceInput, name: "Service Interested In", val: (service !== "-None-" && service !== "") ? service : "" },
        { el: budgetInput, name: "Marketing Budget", val: (budget !== "-None-" && budget !== "") ? budget : "" },
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
      const submitBtn = popupForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Submit to Bigin CRM & Google Sheets
      prepareAndSubmitBiginForm(popupForm, {
        name,
        company,
        email,
        phone,
        service,
        budget,
        timeline,
        description: desc,
        source: 'Popup Form'
      }, submitBtn);
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
