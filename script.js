/* ==========================================================================
   Oluwatobi Ayodele, Portfolio
   Vanilla JS: nav state, mobile menu, cursor, scroll progress, typewriter,
   counters, scroll reveal, magnetic buttons, signal-line generation, form.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const docEl = document.documentElement;

  /* ---------------------------------------------------------------------
     Theme toggle (dark / light), persists across visits
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
    /* localStorage unavailable (e.g. privacy mode), default to dark */
  }
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isLight = rootEl.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch (err) { /* ignore */ }
  });

  /* ---------------------------------------------------------------------
     AI FAQ assistant
     A lightweight, fully client-side keyword-matching assistant, always
     available with zero backend and zero API cost. Swap this matching
     function for a real LLM API call later if a backend is added (never
     put a real API key directly in this file, it would be publicly
     visible to anyone who views the page source).
     --------------------------------------------------------------------- */
  const aiKnowledgeBase = [
    {
      keywords: ["service", "services", "what do you do", "offer", "help with"],
      answer: "I build websites, design interfaces, and manage websites after launch. Want details?"
    },
    {
      keywords: ["website", "web dev", "web development", "build a site", "build a website", "landing page"],
      answer: "I build custom, responsive websites in HTML, CSS and JavaScript, or WordPress. What do you need?"
    },
    {
      keywords: ["wordpress", "elementor", "woocommerce"],
      answer: "Yes. I build and redesign WordPress sites, including WooCommerce stores."
    },
    {
      keywords: ["design", "ui", "ux", "figma", "interface"],
      answer: "I design modern interfaces in Figma, from full site UI/UX to brand visuals."
    },
    {
      keywords: ["seo", "marketing", "digital marketing", "traffic", "rank"],
      answer: "Yes, I do basic SEO so your site gets found."
    },
    {
      keywords: ["price", "pricing", "cost", "how much", "rate", "budget", "quote"],
      answer: "It depends on the project. Message me on WhatsApp for an exact quote."
    },
    {
      keywords: ["how long", "timeline", "turnaround", "delivery time", "how fast"],
      answer: "A simple site can take days. Larger builds take longer. Message me for a timeline."
    },
    {
      keywords: ["process", "how does it work", "how do you work", "steps"],
      answer: "We chat about your goals, I send a quote, then design, build and launch."
    },
    {
      keywords: ["location", "based", "where are you", "akure", "ondo", "lagos", "nigeria", "remote"],
      answer: "I'm in Akure, Ondo State, Nigeria, and work with clients remotely."
    },
    {
      keywords: ["available", "availability", "hire", "hiring", "freelance", "work with you", "work together"],
      answer: "Yes, I'm available. Tap the WhatsApp button or use the contact form."
    },
    {
      keywords: ["project", "projects", "portfolio", "work you've done", "examples", "case study"],
      answer: "See the Featured Projects section above. Tap Case Study on any project."
    },
    {
      keywords: ["contact", "email", "reach you", "get in touch", "whatsapp", "phone", "number"],
      answer: "Tap the WhatsApp button, use the contact form, or email aoluwatobi928@gmail.com."
    },
    {
      keywords: ["tool", "tools", "software", "photoshop", "canva"],
      answer: "I use HTML, CSS, JavaScript, WordPress, Elementor, Figma and Photoshop."
    },
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
      answer: "Hey! Ask me about my services, projects, or how to get started."
    }
  ];

  const aiFallback = "I don't have an answer for that yet. Ask about services, pricing or projects, or message me on WhatsApp.";

  function matchAiAnswer(userText) {
    const text = userText.toLowerCase();
    let best = null;
    let bestScore = 0;
    aiKnowledgeBase.forEach((entry) => {
      const score = entry.keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    return best ? best.answer : aiFallback;
  }

  const aiWidget = document.querySelector(".ai-widget");
  const aiToggle = document.getElementById("aiToggle");
  const aiPanel = document.getElementById("aiPanel");
  const aiMessages = document.getElementById("aiMessages");
  const aiForm = document.getElementById("aiForm");
  const aiInput = document.getElementById("aiInput");
  const aiQuickReplies = document.getElementById("aiQuickReplies");

  const quickReplyPrompts = [
    "What services do you offer?",
    "How much does a website cost?",
    "Are you available for hire?",
    "Where are you based?"
  ];

  let aiHasGreeted = false;

  function aiScrollToBottom() {
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function addAiMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `ai-msg ai-msg-${sender}`;
    bubble.textContent = text;
    aiMessages.appendChild(bubble);
    aiScrollToBottom();
  }

  function showAiTyping() {
    const typing = document.createElement("div");
    typing.className = "ai-msg-typing";
    typing.id = "aiTypingIndicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    aiMessages.appendChild(typing);
    aiScrollToBottom();
  }

  function removeAiTyping() {
    const typing = document.getElementById("aiTypingIndicator");
    if (typing) typing.remove();
  }

  function respondTo(userText) {
    addAiMessage(userText, "user");
    aiInput.value = "";
    showAiTyping();
    const delay = prefersReducedMotion ? 150 : 500 + Math.random() * 500;
    setTimeout(() => {
      removeAiTyping();
      addAiMessage(matchAiAnswer(userText), "bot");
    }, delay);
  }

  function renderQuickReplies() {
    aiQuickReplies.innerHTML = "";
    quickReplyPrompts.forEach((prompt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ai-quick-reply";
      btn.textContent = prompt;
      btn.addEventListener("click", () => respondTo(prompt));
      aiQuickReplies.appendChild(btn);
    });
  }

  function openAiWidget() {
    aiWidget.classList.add("open");
    aiToggle.setAttribute("aria-expanded", "true");
    aiPanel.setAttribute("aria-hidden", "false");
    if (!aiHasGreeted) {
      aiHasGreeted = true;
      renderQuickReplies();
      showAiTyping();
      setTimeout(() => {
        removeAiTyping();
        addAiMessage("Hi, I'm Oluwatobi's assistant 👋 Ask me about services, pricing, past projects, or how to get started.", "bot");
      }, prefersReducedMotion ? 100 : 500);
    }
    setTimeout(() => aiInput.focus(), 300);
  }

  function closeAiWidget() {
    aiWidget.classList.remove("open");
    aiToggle.setAttribute("aria-expanded", "false");
    aiPanel.setAttribute("aria-hidden", "true");
  }

  if (aiToggle) {
    aiToggle.addEventListener("click", () => {
      aiWidget.classList.contains("open") ? closeAiWidget() : openAiWidget();
    });

    aiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = aiInput.value.trim();
      if (!val) return;
      respondTo(val);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && aiWidget.classList.contains("open")) closeAiWidget();
    });
  }

  /* ---------------------------------------------------------------------
     Project cards, "View Description" expandable panels
     --------------------------------------------------------------------- */
  const detailTriggers = document.querySelectorAll("[data-details-target]");

  function setDetails(panel, open) {
    panel.classList.toggle("open", open);
    document.querySelectorAll('[data-details-target="' + panel.id + '"]').forEach((btn) => {
      if (btn.classList.contains("project-toggle")) {
        btn.setAttribute("aria-expanded", String(open));
        const label = btn.querySelector(".project-toggle-label");
        if (label) label.textContent = open ? "Hide Case Study" : "Case Study";
      }
    });
  }

  detailTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("data-details-target"));
      if (!panel) return;
      const willOpen = !panel.classList.contains("open");
      setDetails(panel, willOpen);
      // Opened from the hover overlay: bring the description into view.
      if (willOpen && !btn.classList.contains("project-toggle")) {
        setTimeout(() => panel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" }), 250);
      }
    });
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
     Motion layer: directional reveals, title words, marquee, hero parallax
     --------------------------------------------------------------------- */
  const sideReveal = (els, dirFn) => els.forEach((el, i) => { el.classList.add("reveal-up", dirFn(i)); });
  sideReveal(document.querySelectorAll(".about-grid > *"), (i) => (i % 2 ? "from-right" : "from-left"));
  sideReveal(document.querySelectorAll(".contact-grid > *"), (i) => (i % 2 ? "from-right" : "from-left"));
  sideReveal(document.querySelectorAll(".timeline-item"), () => "from-left");
  if (matchMedia("(min-width: 1025px)").matches) {
    document.querySelectorAll(".projects-grid > .project-card:not(.project-card-wide)").forEach((el, i) =>
      el.classList.add(i % 2 ? "from-right" : "from-left"));
  }

  document.querySelectorAll(".section-title, .hero-headline").forEach((title) => {
    let n = 0;
    const wrap = (node) => {
      const w = document.createElement("span"); w.className = "w";
      const inner = document.createElement("span"); inner.className = "w-i";
      inner.style.setProperty("--i", n++); inner.append(node); w.append(inner); return w;
    };
    Array.from(title.childNodes).forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          frag.append(/^\s+$/.test(t) ? " " : wrap(document.createTextNode(t)));
        });
        node.replaceWith(frag);
      } else if (node.nodeName !== "BR") {
        const ph = document.createComment(""); node.replaceWith(ph); ph.replaceWith(wrap(node));
      }
    });
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { title.classList.add("words-in"); io.disconnect(); }
      }), { threshold: 0.3 });
      io.observe(title);
    } else title.classList.add("words-in");
  });

  document.querySelectorAll(".skill-group").forEach((g) => g.querySelectorAll(".chip").forEach((chip, i) => chip.style.setProperty("--ci", i)));

  const timelineEl = document.querySelector(".timeline");
  if (timelineEl && !prefersReducedMotion) {
    let tick = false;
    const draw = () => {
      tick = false;
      const r = timelineEl.getBoundingClientRect();
      const p = (window.innerHeight * 0.7 - r.top) / r.height;
      timelineEl.style.setProperty("--p", Math.min(1, Math.max(0.04, p)).toFixed(3));
    };
    window.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(draw); } }, { passive: true });
    draw();
  }

  const marquee = document.querySelector(".marquee");
  if (marquee && "IntersectionObserver" in window) {
    new IntersectionObserver((es) => es.forEach((e) => marquee.classList.toggle("is-paused", !e.isIntersecting)))
      .observe(marquee);
  }

  const heroEl = document.querySelector(".hero");
  const heroInnerEl = document.querySelector(".hero-inner");
  if (heroEl && !prefersReducedMotion) {
    let ticking = false;
    const parallax = () => {
      ticking = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.1) return;
      if (heroInnerEl) heroInnerEl.style.translate = `0 ${y * 0.12}px`;
      const hp = document.getElementById("heroPulse");
      if (hp) hp.style.translate = `0 ${y * 0.22}px`;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
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
            setTimeout(() => { el.style.transitionDelay = ""; }, 1300);
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
     Contact form, builds a WhatsApp message from the entered details and
     opens it directly, since every contact path on this site routes to
     WhatsApp rather than a backend inbox.
     --------------------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const WHATSAPP_NUMBER = "2348103442267";

  const projectTypeLabels = {
    website: "Website / Web App",
    wordpress: "WordPress Site",
    uiux: "UI/UX Design",
    content: "Content & Graphic Design",
    other: "Something else"
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please fill in all required fields.";
        formStatus.style.color = "#e08a8a";
        return;
      }

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const projectTypeValue = contactForm.projectType.value;
      const projectType = projectTypeLabels[projectTypeValue] || projectTypeValue;
      const message = contactForm.message.value.trim();

      const waText =
        `Hi Oluwatobi, I'm ${name}.\n` +
        `Email: ${email}\n` +
        `Project type: ${projectType}\n\n` +
        `${message}`;

      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

      const submitBtn = contactForm.querySelector(".form-submit .btn-label");
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Opening WhatsApp…";

      setTimeout(() => {
        window.open(waLink, "_blank", "noopener");
        submitBtn.textContent = originalLabel;
        formStatus.style.color = "";
        formStatus.textContent = "Opening WhatsApp with your message filled in. Just hit send there.";
        contactForm.reset();
      }, 400);
    });
  }

})();
