const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeButton = document.querySelector("[data-theme-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const projectMotionPanel = document.querySelector(".project-motion-panel");
const navLinks = document.querySelectorAll(".nav a");
const sections = [...document.querySelectorAll("main section[id]")];
const reveals = document.querySelectorAll(".reveal");
const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const sendEmailButton = document.querySelector("[data-send-email]");
const mailtoAnchor = document.querySelector("[data-mailto-link]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const routeTransition = document.querySelector("[data-route-transition]");
const routeLabel = document.querySelector("[data-route-label]");
const chatbot = document.querySelector("[data-chatbot]");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatClose = document.querySelector("[data-chat-close]");
const chatMessages = document.querySelector("[data-chat-messages]");
const email = "saimanohar.bhiravajjhula@gmail.com";
const mailSubject = "Software Engineering Opportunity";
const mailBody = [
  "Hi Sai,",
  "",
  "I viewed your portfolio and would like to connect about a software engineering opportunity.",
  "",
  "Role/Company: ",
  "Key skills needed: ",
  "Next steps: ",
  "",
  "Thanks,",
].join("\n");
const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
let scrollQueued = false;
const hrAnswers = {
  summary:
    "SaiBot: Sai Manohar is a Software Engineer with 7+ years of experience across fintech, SaaS, cloud, data-driven systems, and AI-enabled enterprise applications.",
  skills:
    "SaiBot: Core skills include Python, C#, SQL, Angular, React, TypeScript, Flask, Django, ASP.NET Core Web API, PostgreSQL, MongoDB, SQL Server, Azure, AWS, Docker, CI/CD, JWT, OAuth 2.0, and RBAC.",
  projects:
    "SaiBot: Featured AI work includes a LangChain/OpenAI agent platform with tool use and memory, a RAG pipeline with evaluation using LlamaIndex and Pinecone, and a multi-agent workflow system with planner, executor, and validator agents.",
  chatbots:
    "SaiBot: Sai has enterprise chatbot experience using Azure Bot Framework V4, LUIS/CLU, QnA Maker/CQA, Azure AI Search, adaptive cards, Azure Functions, Direct Line API, authentication, and Application Insights monitoring.",
  fit:
    "SaiBot: HR fit: Sai combines full-stack delivery, secure API development, SQL/database optimization, Angular and React UI work, cloud automation, and modern AI/chatbot experience for enterprise teams. GitHub: https://github.com/SaiManoharBhiravajjhula. Email: saimanohar.bhiravajjhula@gmail.com.",
};

function animatedScrollTo(targetY, duration = 780) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const start = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

function enhanceIcons() {
  document.querySelectorAll("svg.lucide:not([data-3d-wrapped])").forEach((svg) => {
    const parent = svg.parentElement;
    if (!parent || parent.classList.contains("icon-3d")) return;
    const shell = document.createElement("span");
    shell.className = "icon-3d";
    svg.dataset["3dWrapped"] = "true";
    parent.insertBefore(shell, svg);
    shell.appendChild(svg);
  });
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
    enhanceIcons();
  }
}

function updateThemeIcon() {
  if (!themeButton) return;
  const iconName = root.dataset.theme === "dark" ? "moon" : "sun";
  themeButton.innerHTML = `<i data-lucide="${iconName}"></i>`;
  refreshIcons();
}

themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "" : "dark";
  if (next) {
    root.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("portfolio-theme");
  }
  updateThemeIcon();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
    projectMotionPanel?.classList.toggle("hidden", filter !== "all");
  });
});

copyButton?.addEventListener("click", async () => {
  if (!email) {
    if (copyStatus) copyStatus.textContent = "Add email to enable copy";
    setTimeout(() => {
      if (copyStatus) copyStatus.textContent = "Email not listed in resume";
    }, 1700);
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    copyButton.classList.add("copied");
    if (copyStatus) copyStatus.textContent = "Copied";
    setTimeout(() => {
      copyButton.classList.remove("copied");
      if (copyStatus) copyStatus.textContent = "Click to copy";
    }, 1500);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

sendEmailButton?.addEventListener("click", () => {
  const opened = window.open(gmailComposeLink, "_blank", "noopener,noreferrer");
  if (!opened && mailtoAnchor) {
    mailtoAnchor.href = mailtoLink;
    mailtoAnchor.click();
  }
});

function appendChatMessage(type, text) {
  if (!chatMessages) return;
  const message = document.createElement("div");
  message.className = `chat-message ${type}`;
  if (type === "bot") {
    const [prefix, ...rest] = text.split(":");
    message.innerHTML = `<span>${prefix}:</span>${rest.join(":").trim()}`;
  } else {
    message.textContent = text;
  }
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle?.addEventListener("click", () => {
  chatbot?.classList.toggle("open");
});

chatClose?.addEventListener("click", () => {
  chatbot?.classList.remove("open");
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.question;
    appendChatMessage("user", button.textContent.trim());
    appendChatMessage("bot", hrAnswers[key] || hrAnswers.summary);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    if (routeLabel) routeLabel.textContent = link.dataset.routeName || target.id || "Section";
    routeTransition?.classList.add("active");
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - 92;
      animatedScrollTo(Math.max(top, 0));
    }, 130);
    setTimeout(() => {
      routeTransition?.classList.remove("active");
      history.replaceState(null, "", link.getAttribute("href"));
    }, 820);
  });
});


const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "320px 0px", threshold: 0.08 }
);

reveals.forEach((item, index) => {
  item.style.setProperty("--stagger", index % 4);
  revealObserver.observe(item);
});

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function updateProgress() {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function updateActiveNav() {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 150)
    .at(-1);

  navLinks.forEach((link) => {
    link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
  });
}

function updateScrollState() {
  updateHeader();
  updateProgress();
  updateActiveNav();
  scrollQueued = false;
}

window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(updateScrollState);
}, { passive: true });

document.querySelectorAll(".project-card, .skill-block, .timeline-item, .education-card, .contact-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    card.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-x", "0deg");
  });
});

window.addEventListener("load", () => {
  updateThemeIcon();
  updateHeader();
  updateProgress();
  updateActiveNav();
  refreshIcons();
});
