"use strict";

// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

// Header background after scrolling
const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Elements gently appear as they enter the viewport
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min((index % 6) * 60, 240)}ms`;
  revealObserver.observe(element);
});

// Animate the process connector when it becomes visible
const processLine = document.querySelector(".process-line");
const lineObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      processLine.classList.add("animate");
      lineObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

lineObserver.observe(processLine);

// Cycle through system status messages in the hero
const heroStatus = document.querySelector("#hero-status");
const heroProgress = document.querySelector("#hero-progress");
const heroMessages = [
  { text: "System wird geprüft…", progress: 28 },
  { text: "Probleme werden erkannt…", progress: 62 },
  { text: "Lösung wird vorbereitet…", progress: 88 },
  { text: "System ist bereit.", progress: 100 }
];
let heroMessageIndex = 0;

function rotateHeroStatus() {
  const message = heroMessages[heroMessageIndex];
  heroStatus.textContent = message.text;
  heroProgress.style.width = `${message.progress}%`;
  heroMessageIndex = (heroMessageIndex + 1) % heroMessages.length;
}

rotateHeroStatus();
setInterval(rotateHeroStatus, 2300);

// Pointer glow on feature cards
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  });
});

// Fake diagnostic demo
const scanButton = document.querySelector("#scan-button");
const scanButtonText = scanButton.querySelector(".button-text");
const scanPercentage = document.querySelector("#scan-percentage");
const scanStatus = document.querySelector("#scan-status");
const demoState = document.querySelector("#demo-state");
const ringProgress = document.querySelector("#ring-progress");
const diagnosticRing = document.querySelector("#diagnostic-ring");
const scanItems = [...document.querySelectorAll("[data-scan-item]")];
const ringLength = 427.3;
let scanRunning = false;

const scanStages = [
  { until: 34, item: 0, status: "Hardware wird geprüft…" },
  { until: 67, item: 1, status: "Software wird analysiert…" },
  { until: 99, item: 2, status: "Sicherheit wird geprüft…" }
];

function resetScanItems() {
  scanItems.forEach((item) => {
    item.classList.remove("active", "complete");
    item.querySelector(".item-state").textContent = "WARTET";
    const icon = item.querySelector(".scan-icon");
    icon.textContent = icon.dataset.number || icon.textContent;
  });
}

scanItems.forEach((item) => {
  item.querySelector(".scan-icon").dataset.number = item.querySelector(".scan-icon").textContent;
});

function updateScanItems(progress) {
  scanStages.forEach((stage, index) => {
    const item = scanItems[index];
    const previousLimit = index === 0 ? 0 : scanStages[index - 1].until;

    if (progress > stage.until) {
      item.classList.remove("active");
      item.classList.add("complete");
      item.querySelector(".item-state").textContent = "OK";
      item.querySelector(".scan-icon").textContent = "✓";
    } else if (progress > previousLimit) {
      item.classList.add("active");
      item.classList.remove("complete");
      item.querySelector(".item-state").textContent = "PRÜFT";
      item.querySelector(".scan-icon").textContent = item.querySelector(".scan-icon").dataset.number;
      scanStatus.textContent = stage.status;
    }
  });
}

function finishScan() {
  scanRunning = false;
  diagnosticRing.classList.remove("scanning");
  demoState.textContent = "ABGESCHLOSSEN";
  scanStatus.textContent = "Keine kritischen Probleme erkannt";
  scanButton.disabled = false;
  scanButtonText.textContent = "Erneut scannen";

  scanItems.forEach((item) => {
    item.classList.remove("active");
    item.classList.add("complete");
    item.querySelector(".item-state").textContent = "OK";
    item.querySelector(".scan-icon").textContent = "✓";
  });
}

scanButton.addEventListener("click", () => {
  if (scanRunning) return;

  scanRunning = true;
  let progress = 0;
  resetScanItems();
  scanButton.disabled = true;
  scanButtonText.textContent = "Scan läuft…";
  demoState.textContent = "ANALYSE";
  scanStatus.textContent = "System wird vorbereitet…";
  diagnosticRing.classList.add("scanning");
  scanPercentage.textContent = "0%";
  ringProgress.style.strokeDashoffset = String(ringLength);

  const scanTimer = setInterval(() => {
    progress += Math.floor(Math.random() * 3) + 1;
    progress = Math.min(progress, 100);

    scanPercentage.textContent = `${progress}%`;
    ringProgress.style.strokeDashoffset = String(ringLength - (ringLength * progress) / 100);
    updateScanItems(progress);

    if (progress === 100) {
      clearInterval(scanTimer);
      setTimeout(finishScan, 350);
    }
  }, 90);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
