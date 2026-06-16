const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealEls = document.querySelectorAll(".reveal");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const motionShell = document.querySelector(".hero-panel");
const motionHero = document.querySelector(".hero-visual");
const amenitySection = document.querySelector("#amenities");
const amenityTrack = document.querySelector("[data-amenity-track]");
const amenityButtons = amenitySection ? [...amenitySection.querySelectorAll(".arrow-btn")] : [];
const amenityDots = amenitySection ? [...amenitySection.querySelectorAll(".carousel-dots span")] : [];
const enquiryForm = document.querySelector(".enquiry-form");
const submitButton = document.querySelector(".submit-button");

let amenityPage = 0;
let amenityPageCount = 2;

document.querySelectorAll(".section-heading, .hero-brand-block, .overview-copy, .enquiry-copy").forEach((node, index) => {
  node.style.setProperty("--stagger", `${index * 70}ms`);
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => link.classList.remove("is-active"));
      const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${visible.target.id}`);
      if (activeLink) activeLink.classList.add("is-active");
    },
    { threshold: [0.3, 0.5, 0.7] }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

if (motionShell && motionHero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  const updateMotion = () => {
    const rect = motionShell.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const progress = Math.min(1, Math.max(0, 1 - rect.top / viewport));
    const shift = Math.max(-18, Math.min(12, progress * -14));
    motionHero.style.setProperty("--hero-shift", `${shift}px`);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateMotion);
      ticking = true;
    }
  };

  updateMotion();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateMotion);
}

if (amenitySection && amenityTrack && amenityButtons.length >= 2) {
  const getAmenitiesPerPage = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 980) return 2;
    return 4;
  };

  const updateAmenities = () => {
    const viewport = amenitySection.querySelector(".amenity-viewport");
    if (!viewport) return;

    const cards = amenityTrack.querySelectorAll(".media-card").length;
    const perPage = getAmenitiesPerPage();
    amenityPageCount = Math.max(1, Math.ceil(cards / perPage));
    amenityPage = Math.min(amenityPage, amenityPageCount - 1);

    const width = viewport.getBoundingClientRect().width;
    amenityTrack.style.transform = `translateX(${-amenityPage * width}px)`;
    amenityDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === amenityPage);
    });
  };

  amenityButtons[0].addEventListener("click", () => {
    amenityPage = (amenityPage - 1 + amenityPageCount) % amenityPageCount;
    updateAmenities();
  });

  amenityButtons[1].addEventListener("click", () => {
    amenityPage = (amenityPage + 1) % amenityPageCount;
    updateAmenities();
  });

  updateAmenities();
  window.addEventListener("resize", updateAmenities);
}

if (enquiryForm && submitButton) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    const previousText = submitButton.textContent;
    submitButton.textContent = "Submitted";

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = previousText;
    }, 1800);
  });
}
