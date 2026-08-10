/* ==========================================================================
   Oluwatobi Ayodele — Portfolio
   Vanilla JS: nav state, mobile menu, cursor, scroll progress, typewriter,
   counters, scroll reveal, magnetic buttons, signal-line generation, form.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const docEl = document.documentElement;

  /* ---------------------------------------------------------------------
     Theme toggle (dark / light) — persists across visits
     --------------------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const rootEl = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      rootEl.setAttribute("data-theme", "light");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
    } else {
      rootEl.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Switch to light mode");
    }
  }

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (err) {
    /* localStorage unavailable (e.g. privacy mode) — default to dark */
  }
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isLight = rootEl.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch (err) { /* ignore */ }
  });

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Sticky nav state on scroll
     --------------------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const scrollProgressBar = document.getElementById("scrollProgressBar");

  function onScroll() {
    const scrollY = window.scrollY;
    nav.classList.toggle("scrolled", scrollY > 40);

    const docHeight = docEl.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = progress + "%";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile hamburger menu
     --------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    hamburgerBtn.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburgerBtn.classList.toggle("open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ---------------------------------------------------------------------
     Smooth scroll for in-page anchor links (with nav-height offset)
     --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ---------------------------------------------------------------------
     Custom cursor
     --------------------------------------------------------------------- */
  const cursorDot = document.querySelector(".cursor-dot");
  if (cursorDot && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let dx = cx, dy = cy;

    window.addEventListener("mousemove", (e) => {
      cx = e.clientX; cy = e.clientY;
      cursorDot.classList.add("active");
    });

    function animateCursor() {
      dx += (cx - dx) * 0.35;
      dy += (cy - dy) * 0.35;
      cursorDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorDot.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursorDot.classList.remove("hovering"));
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------------------- */
  if (!prefersReducedMotion && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.22}px, ${relY * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Typewriter / rotating role text
     --------------------------------------------------------------------- */
  const roles = [
    "Web Developer",
    "Web Designer",
    "Social Media Manager",
    "WordPress Developer",
    "UI/UX Designer",
    "Digital Creative"
  ];
  const typewriterEl = document.getElementById("typewriter");

  if (typewriterEl) {
    if (prefersReducedMotion) {
      typewriterEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;

      function tick() {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1500);
            return;
          }
          setTimeout(tick, 55);
        } else {
          charIndex--;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 350);
            return;
          }
          setTimeout(tick, 28);
        }
      }
      tick();
    }
  }

  /* ---------------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblingDelay = Array.from(el.parentElement.children).indexOf(el) % 6;
            el.style.transitionDelay = prefersReducedMotion ? "0ms" : `${siblingDelay * 70}ms`;
            el.classList.add("in-view");
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------------------------------
     Animated counters
     --------------------------------------------------------------------- */
  const counters = document.querySelectorAll(".stat-number[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = prefersReducedMotion ? 0 : 1400;
          const start = performance.now();

          function frame(now) {
            const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------------------------------------------------------------------
     Signature signal-line (generative "waveform" behind hero & contact)
     --------------------------------------------------------------------- */
  function buildPulsePath(points, width, height, amplitude) {
    const segment = width / (points - 1);
    let d = [];
    for (let i = 0; i < points; i++) {
      const x = i * segment;
      let y = height / 2;
      // occasional spike to read as a "signal", mostly a calm baseline
      const spike = (i % 7 === 0) ? (Math.sin(i * 12.9) * amplitude) : (Math.sin(i * 1.4) * amplitude * 0.18);
      y += spike;
      d.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return d.join(" ");
  }

  function initPulseLine(id, width, height, amplitude) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("points", buildPulsePath(70, width, height, amplitude));
  }
  initPulseLine("pulseLine", 1400, 400, 70);
  initPulseLine("pulseLine2", 1400, 300, 46);

  /* Gentle parallax drift of the hero pulse line on mouse move */
  const heroPulse = document.getElementById("heroPulse");
  if (heroPulse && !prefersReducedMotion && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 16;
      const relY = (e.clientY / window.innerHeight - 0.5) * 10;
      heroPulse.style.transform = `translate(calc(-50% + ${relX}px), calc(-50% + ${relY}px))`;
    });
  }

  /* ---------------------------------------------------------------------
     Contact form (front-end only — no backend wired up)
     --------------------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please fill in all required fields.";
        formStatus.style.color = "#e08a8a";
        return;
      }
      const submitBtn = contactForm.querySelector(".form-submit .btn-label");
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      // Front-end only demo: replace with a real endpoint (Formspree, EmailJS, etc.)
      setTimeout(() => {
        submitBtn.textContent = originalLabel;
        formStatus.style.color = "";
        formStatus.textContent = "Thanks — your message is ready to send. Connect a form service (e.g. Formspree) to deliver it to your inbox.";
        contactForm.reset();
      }, 700);
    });
  }

})();
