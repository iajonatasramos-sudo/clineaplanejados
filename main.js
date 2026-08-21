/* Clínea Planejados · interações */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ano dinâmico */
  var yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* ---------- Header: estado ao rolar + WhatsApp flutuante ---------- */
  var header = document.querySelector(".site-header");
  var waFloat = document.getElementById("waFloat");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    if (waFloat) waFloat.classList.toggle("is-visible", y > 640);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu móvel ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("no-scroll", open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var steps = document.querySelectorAll(".step");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    steps.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    steps.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Flourish: desenhar traço ---------- */
  var flourishes = document.querySelectorAll("[data-draw] path");
  flourishes.forEach(function (p) {
    if (reduce) return;
    try {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = "stroke-dashoffset 2.4s cubic-bezier(0.22,1,0.36,1)";
    } catch (err) {}
  });
  function drawFlourishes() {
    flourishes.forEach(function (p) { p.style.strokeDashoffset = "0"; });
  }
  if (reduce) {
    /* nada a animar */
  } else {
    // hero desenha ao carregar; contato desenha ao entrar em vista
    var heroPath = document.querySelector(".hero__flourish path");
    window.addEventListener("load", function () {
      setTimeout(function () { if (heroPath) heroPath.style.strokeDashoffset = "0"; }, 350);
    });
    var contactFl = document.querySelector(".contact .flourish path");
    if (contactFl && "IntersectionObserver" in window) {
      var fo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { contactFl.style.strokeDashoffset = "0"; fo.unobserve(e.target); }
        });
      }, { threshold: 0.3 });
      fo.observe(contactFl);
    }
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var current = [];
  var index = 0;
  var lastFocus = null;

  function buildSet(fromShot) {
    var gallery = fromShot.closest(".project__gallery");
    var shots = gallery ? gallery.querySelectorAll(".shot") : [fromShot];
    current = Array.prototype.map.call(shots, function (s) {
      return { src: s.getAttribute("data-src"), cap: s.getAttribute("data-caption") || "",
               project: (s.closest(".project") || {}).dataset ? s.closest(".project").dataset.gallery : "" };
    });
    return Array.prototype.indexOf.call(shots, fromShot);
  }

  function projectLabel(key) {
    return { daniela: "Consultório Daniela", evelyn: "Clínica Evelyn", kang: "Consultório Kang" }[key] || "";
  }

  function show(i) {
    if (!current.length) return;
    index = (i + current.length) % current.length;
    var item = current[index];
    lbImg.style.opacity = "0";
    var pre = new Image();
    pre.onload = function () {
      lbImg.src = item.src;
      lbImg.alt = item.cap;
      lbImg.style.opacity = "1";
    };
    pre.src = item.src;
    lbCap.innerHTML = "<b>" + projectLabel(item.project) + "</b> · " + item.cap;
  }

  function openLightbox(startIndex) {
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    show(startIndex);
    lbClose.focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll(".shot").forEach(function (shot) {
    shot.setAttribute("tabindex", "0");
    shot.setAttribute("role", "button");
    var cap = shot.getAttribute("data-caption") || "Ampliar imagem";
    shot.setAttribute("aria-label", "Ampliar: " + cap);
    function act() { openLightbox(buildSet(shot)); }
    shot.addEventListener("click", act);
    shot.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); }
    });
  });

  document.querySelectorAll("[data-open-gallery]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-open-gallery");
      var firstShot = document.querySelector('.project[data-gallery="' + key + '"] .shot');
      if (firstShot) openLightbox(buildSet(firstShot));
    });
  });

  if (lb) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { show(index - 1); });
    lbNext.addEventListener("click", function () { show(index + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ---------- Rolagem suave para âncoras ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });
})();
