
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Create floating background particles
const particleContainer = document.getElementById("particles");

if (particleContainer && !reducedMotion) {
  for (let i = 0; i < 65; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 110 + 10}%`;
    particle.style.animationDuration = `${6 + Math.random() * 12}s`;
    particle.style.animationDelay = `${-Math.random() * 18}s`;
    particle.style.opacity = `${0.2 + Math.random() * 0.6}`;
    const size = 1 + Math.random() * 2.5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particleContainer.appendChild(particle);
  }
}

// Mouse-follow background glow
const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("pointermove", (event) => {
  if (!cursorGlow || event.pointerType === "touch") return;

  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

// 3D profile tilt
const heroVisual = document.getElementById("heroVisual");

if (heroVisual && !reducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroVisual.style.transform =
      `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "";
  });
}

// Interactive 3D cube
const cube = document.getElementById("dataCube");
const cubeStage = document.getElementById("cubeStage");

if (cube && cubeStage && !reducedMotion) {
  let rotationX = -20;
  let rotationY = -30;
  let targetX = rotationX;
  let targetY = rotationY;
  let interacting = false;
  let animationFrame;

  cubeStage.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    interacting = true;
    cube.style.animation = "none";
  });

  cubeStage.addEventListener("pointermove", (event) => {
    if (!interacting || event.pointerType === "touch") return;

    const rect = cubeStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    targetY = -30 + x * 100;
    targetX = -20 - y * 70;
  });

  cubeStage.addEventListener("pointerleave", () => {
    interacting = false;
    targetX = -20;
    targetY = -30;
  });

  function animateCube() {
    rotationX += (targetX - rotationX) * 0.07;
    rotationY += (targetY - rotationY) * 0.07;

    cube.style.transform =
      `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    animationFrame = requestAnimationFrame(animateCube);
  }

  animateCube();
}

// Reveal sections and cards as you scroll
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 80}ms`;
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// Mobile navigation menu
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

// Highlight the active navigation link
const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${entry.target.id}`;

        link.classList.toggle("active", isActive);
      });
    });
  }, {
    rootMargin: "-25% 0px -55% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Current year in the footer
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}
