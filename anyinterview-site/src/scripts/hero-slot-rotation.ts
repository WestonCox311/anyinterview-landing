const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const words = document.querySelectorAll<HTMLElement>('.slot-word');
const heroInput = document.getElementById('heroInput') as HTMLTextAreaElement;

const slotWords = [
  'capstone selection', 'source interviews', 'discovery calls', 'user research',
  'churn interviews', 'hiring interviews', 'reference checks', 'audit walkthroughs',
  'witness statements', 'exit interviews'
];

const placeholders = [
  "I need to rank 40 student applicants for our capstone program by Friday…",
  "I want to collect local stories from people across three time zones…",
  "I want to talk to early-stage SaaS founders about onboarding…",
  "I need to run a usability study on our new checkout flow…",
  "I want to understand why power users churned last quarter…",
  "I want to interview senior engineers for a backend role…",
  "I need to do reference checks for a senior hire…",
  "I need to walk through access controls for our SOC 2 audit…",
  "I need a structured intake for new personal injury clients…",
  "I want to do exit interviews for departing employees…"
];

const dwellTimes = [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000];
const transitionMs = 400;
const placeholderFadeMs = 300;
const initialDelayMs = 1500;

let i = 0;
let placeholderLocked = false;

if (reducedMotion) {
  // Snap to last word with no animation
  words.forEach(w => w.classList.remove('active'));
  words[words.length - 1]?.classList.add('active');
  if (heroInput) heroInput.placeholder = placeholders[placeholders.length - 1];
} else {
  function rotate() {
    const current = words[i];
    const next = words[(i + 1) % words.length];

    current.classList.remove('active');
    current.classList.add('exiting');

    if (!placeholderLocked && heroInput && document.activeElement !== heroInput && !heroInput.value) {
      heroInput.classList.add('placeholder-fading');
      setTimeout(() => {
        heroInput.placeholder = placeholders[(i + 1) % placeholders.length];
        heroInput.classList.remove('placeholder-fading');
      }, placeholderFadeMs);
    }

    setTimeout(() => {
      current.classList.remove('exiting');
      next.classList.add('active');
      i = (i + 1) % words.length;
      setTimeout(rotate, dwellTimes[i]);
    }, transitionMs);
  }

  setTimeout(() => {
    setTimeout(rotate, dwellTimes[0]);
  }, initialDelayMs);
}

// Lock placeholder on chip click or typing
document.querySelectorAll<HTMLElement>('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.dataset.prompt;
    if (prompt && heroInput) {
      heroInput.value = prompt;
      heroInput.style.height = 'auto';
      heroInput.style.height = heroInput.scrollHeight + 'px';
      placeholderLocked = true;
    }
  });
});

heroInput?.addEventListener('input', () => {
  placeholderLocked = true;
  heroInput.style.height = 'auto';
  heroInput.style.height = heroInput.scrollHeight + 'px';
});
