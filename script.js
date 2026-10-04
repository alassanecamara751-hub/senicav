/* =========================================================
   SENICAV — SCRIPT PRINCIPAL
   Version : 2026
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1. MENU MOBILE
     ========================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    // Fermer le menu lorsqu'on clique sur un lien
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });

    // Fermer avec la touche Échap
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    });
  }


  /* =========================================================
     2. HEADER AU SCROLL
     ========================================================= */

  const header = document.querySelector(".header");

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* =========================================================
     3. ANIMATIONS AU DÉFILEMENT
     ========================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Une seule animation par élément
            revealObserver.unobserve(entry.target);
          }

        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    // Compatibilité avec les navigateurs plus anciens
    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  /* =========================================================
     4. APPARITION DES CARTES
     ========================================================= */

  const cards = document.querySelectorAll(
    ".vision-card, .talent-card, .service-card, .news-card"
  );

  if ("IntersectionObserver" in window && cards.length) {

    const cardObserver = new IntersectionObserver(
      entries => {

        entries.forEach((entry, index) => {

          if (entry.isIntersecting) {

            // Petit effet progressif
            entry.target.style.transitionDelay =
              `${Math.min(index * 0.05, 0.25)}s`;

            entry.target.classList.add("visible");

            cardObserver.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.08
      }
    );

    cards.forEach(card => {
      card.classList.add("reveal");
      cardObserver.observe(card);
    });
  }


  /* =========================================================
     5. NAVIGATION ACTIVE
     ========================================================= */

  const sections = [
    ...document.querySelectorAll("main section[id]")
  ];

  const navLinks = [
    ...document.querySelectorAll('.nav a[href^="#"]')
  ];

  const updateActiveNavigation = () => {

    const scrollPosition = window.scrollY + 160;

    let currentSection = "accueil";

    sections.forEach(section => {

      if (scrollPosition >= section.offsetTop) {
        currentSection = section.id;
      }

    });

    navLinks.forEach(link => {

      const href = link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentSection}`
      );

    });
  };

  updateActiveNavigation();

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );


  /* =========================================================
     6. SCROLL FLUIDE
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight +
        5;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });


  /* =========================================================
     7. FORMULAIRE DE CONTACT
     ========================================================= */

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {

    contactForm.addEventListener("submit", event => {

      event.preventDefault();

      const name =
        contactForm.querySelector('[name="name"]')?.value.trim() || "";

      const email =
        contactForm.querySelector('[name="email"]')?.value.trim() || "";

      const phone =
        contactForm.querySelector('[name="phone"]')?.value.trim() || "";

      const profile =
        contactForm.querySelector('[name="profile"]')?.value.trim() || "";

      const message =
        contactForm.querySelector('[name="message"]')?.value.trim() || "";


      /* Vérification minimale */

      if (!name || !email || !message) {

        showFormMessage(
          "Veuillez remplir les champs obligatoires.",
          "error"
        );

        return;
      }


      /* Création du message WhatsApp */

      const whatsappMessage = `
Bonjour SENICAV,

Je souhaite contacter votre équipe.

Nom : ${name}
Email : ${email}
Téléphone : ${phone || "Non renseigné"}
Profil : ${profile || "Non renseigné"}

Message :
${message}

Merci.
      `.trim();


      const whatsappURL =
        `https://wa.me/221774336878?text=${encodeURIComponent(
          whatsappMessage
        )}`;


      /* Message avant redirection */

      showFormMessage(
        "Votre demande est prête. Ouverture de WhatsApp...",
        "success"
      );


      setTimeout(() => {
        window.open(whatsappURL, "_blank");
      }, 700);

    });
  }


  /* =========================================================
     8. MESSAGE DU FORMULAIRE
     ========================================================= */

  function showFormMessage(message, type) {

    let messageBox =
      document.querySelector(".form-message");

    if (!messageBox && contactForm) {

      messageBox = document.createElement("div");

      messageBox.className = "form-message";

      contactForm.appendChild(messageBox);
    }

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className =
      `form-message ${type}`;

    messageBox.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }


  /* =========================================================
     9. ANNÉE AUTOMATIQUE
     ========================================================= */

  const yearElements =
    document.querySelectorAll("[data-year]");

  const currentYear =
    new Date().getFullYear();

  yearElements.forEach(element => {
    element.textContent = currentYear;
  });


  /* =========================================================
     10. LIENS EXTERNES
     ========================================================= */

  document
    .querySelectorAll('a[href^="http"]')
    .forEach(link => {

      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

    });


  /* =========================================================
     11. LOG CONSOLE
     ========================================================= */

  console.log(
    "%c SENICAV ",
    "background:#000;color:#D4AF37;font-size:20px;font-weight:bold;padding:8px 14px;"
  );

  console.log(
    "%c LES TALENTS SÉNÉGALAIS ONT UNE VOIX. ",
    "color:#D4AF37;font-size:14px;font-weight:bold;"
  );

  console.log(
    "%c SENICAV LES FAIT RÉSONNER.",
    "color:#777;font-size:12px;"
  );

});