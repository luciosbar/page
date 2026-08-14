/* ==========================================================================
   LUCIUS BAR — script.js
   Funcionalidades: menu mobile, header com estado de scroll,
   rolagem suave com offset do header fixo, animação de entrada
   das seções (respeitando prefers-reduced-motion) e ano no rodapé.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const yearEl = document.getElementById("year");

  /* ---------- Ano automático no rodapé ---------- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Header muda de aparência ao rolar ---------- */
  const SCROLL_THRESHOLD = 24;

  const updateHeaderState = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Menu mobile ---------- */
  const closeMobileMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
  };

  const openMobileMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  // Fecha o menu mobile ao clicar em qualquer link dele
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Fecha o menu mobile ao pressionar Esc
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  /* ---------- Rolagem suave com offset do header fixo ----------
     O CSS já define scroll-behavior: smooth e scroll-padding-top,
     mas some navegadores/casos (foco de acessibilidade, cliques
     rápidos) se beneficiam de um controle explícito via JS. */
  const scrollLinks = document.querySelectorAll('a[href^="#"][data-scroll], .nav__link, .mobile-menu__link, .footer__link');

  scrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      // Move o foco para o destino, por acessibilidade de teclado
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Animação de entrada ao rolar ---------- */
  const revealElements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el, index) => {
      // pequeno atraso escalonado dentro de cada seção
      el.style.transitionDelay = `${(index % 4) * 70}ms`;
      observer.observe(el);
    });
  }
});
