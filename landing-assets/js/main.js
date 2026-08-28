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

