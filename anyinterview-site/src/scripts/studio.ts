import { escapeHtml } from './escape-html.ts';
import { getTemplate, getParticipants, type Participant } from './canned-responses.ts';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroStage = document.getElementById('hero-stage')!;
const studioStage = document.getElementById('studio-stage')!;
const messages = document.getElementById('messages')!;
const studioScroll = document.getElementById('studioScroll')!;
const studioParticipants = document.getElementById('studioParticipants')!;
const composerInput = document.getElementById('composerInput') as HTMLTextAreaElement;
const heroInput = document.getElementById('heroInput') as HTMLTextAreaElement;
const heroForm = document.getElementById('heroForm') as HTMLFormElement;
const studioTitle = document.querySelector<HTMLElement>('.studio-title');

const charDelayMs = 12;
const punctuationDelayMs = 12 * 12;
const actionCardDelayMs = 300;

// AI canned response based on keyword
function getAIResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('founder') || p.includes('discovery') || p.includes('customer')) {
    return `Got it. I'll run a <strong>30-minute discovery interview</strong> with early-stage SaaS founders — focused on onboarding friction, workarounds, and what nearly made them churn. Voice only. I'll open with a framing question, then move into current state, what they've tried, and unmet needs. Ready when you send the link.`;
  } else if (p.includes('user') || p.includes('research') || p.includes('checkout')) {
    return `Understood. A <strong>25-minute usability study</strong> on the checkout flow — I'll walk participants through a task arc, observe where they hesitate, and close with a reflection round. Voice and screen. I'll record and timestamp every friction point.`;
  } else if (p.includes('intake') || p.includes('legal') || p.includes('injury') || p.includes('client')) {
    return `Ready. I'll run a <strong>structured legal intake</strong> — gathering incident details, injuries sustained, treatment received, and prior history. Voice only, calm tone. Fully templated for personal injury matters. Share the link when you're ready.`;
  }
  return `Perfect. I've set up a <strong>45-minute technical interview</strong> for a senior backend role — covering system design, technical depth, and how they think about tradeoffs. Voice and video. I'll open with context-setting, then move into depth questions and a judgment round.`;
}

function addUserMessage(text: string): void {
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="msg-avatar">W</div>
    <div class="msg-body">
      <div class="msg-author">You</div>
      <div class="msg-content"><p>${escapeHtml(text)}</p></div>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function streamText(el: HTMLElement, html: string, onDone?: () => void): void {
  if (reducedMotion) {
    el.innerHTML = html;
    onDone?.();
    return;
  }
  el.innerHTML = '<span class="typing-cursor"></span>';
  let idx = 0;
  let buffer = '';

  function tick(): void {
    if (idx >= html.length) {
      el.innerHTML = buffer;
      setTimeout(() => {
        const card = document.createElement('div');
        card.className = 'action-card';
        card.innerHTML = `<div class="label"><strong>Ready to test?</strong> Generate a share link to interview yourself first.</div><button>Get link →</button>`;
        el.appendChild(card);
        messages.scrollTop = messages.scrollHeight;
        onDone?.();
      }, actionCardDelayMs);
      return;
    }
    buffer += html[idx];
    el.innerHTML = buffer + '<span class="typing-cursor"></span>';
    idx++;
    messages.scrollTop = messages.scrollHeight;
    const ch = html[idx - 1];
    const delay = (ch === '.' || ch === '?' || ch === '!') ? punctuationDelayMs : charDelayMs;
    setTimeout(tick, delay);
  }
  tick();
}

const availColors: Record<string, string> = {
  green: 'var(--accent)',
  amber: 'var(--ink-mute)',
  muted: 'var(--ink-faint)',
};

function populateParticipants(prompt: string): void {
  const list = getParticipants(prompt);
  studioParticipants.innerHTML = `
    <div class="sp-header">
      <span class="sp-count">${list.length} matched participants</span>
      <a href="#" class="sp-browse" data-action="open-demo">Browse all →</a>
    </div>
    ${list.map((p: Participant, i: number) => `
      <div class="sp-row" style="${!reducedMotion ? `opacity:0;transform:translateY(6px);animation:studioFade 0.4s ease forwards;animation-delay:${i * 0.1}s` : ''}">
        <div class="sp-avatar">${escapeHtml(p.initials)}</div>
        <div class="sp-info">
          <div class="sp-name">${escapeHtml(p.name)}</div>
          <div class="sp-detail">${escapeHtml(p.detail)}</div>
          <div class="sp-tags">${p.tags.map(t => `<span class="sp-tag">${escapeHtml(t)}</span>`).join('')}</div>
        </div>
        <div class="sp-right">
          <span class="sp-avail" style="color:${availColors[p.availColor] ?? 'var(--ink-mute)'}">${escapeHtml(p.availability)}</span>
          <button class="sp-invite" data-action="open-demo">Invite →</button>
        </div>
      </div>
    `).join('')}
    <div class="sp-footer">Source from our network of 12,000+ vetted participants</div>
  `;
  studioParticipants.querySelectorAll<HTMLElement>('[data-action="open-demo"]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); (window as any).openDemoModal?.(); });
  });
}

function populateStudio(prompt: string): void {
  const data = getTemplate(prompt);
  if (studioTitle) studioTitle.textContent = data.title;
  studioScroll.innerHTML = '';

  // Meta grid
  const metaDiv = document.createElement('div');
  metaDiv.className = 'studio-meta';
  metaDiv.innerHTML = data.meta.map(m => `<div class="meta-cell"><span class="meta-label">${escapeHtml(m.label)}</span><span class="meta-value">${escapeHtml(m.value)}</span></div>`).join('');
  studioScroll.appendChild(metaDiv);

  data.sections.forEach((section, idx) => {
    const div = document.createElement('div');
    div.className = 'studio-section';
    if (!reducedMotion) {
      div.style.opacity = '0';
      div.style.transform = 'translateY(8px)';
      div.style.animation = `studioFade 0.5s ease forwards`;
      div.style.animationDelay = `${idx * 0.15}s`;
    }
    div.innerHTML = `<h3>${escapeHtml(section.title)}</h3><ol>${section.questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ol>`;
    studioScroll.appendChild(div);
  });
}

export function launchStudio(value: string): void {
  if (!value.trim()) { heroInput?.focus(); return; }

  document.documentElement.classList.add('studio-active');
  heroStage.classList.add('collapsing');

  setTimeout(() => {
    heroStage.classList.add('gone');
    studioStage.classList.add('visible');
    addUserMessage(value);

    const aiDiv = document.createElement('div');
    aiDiv.className = 'msg ai';
    aiDiv.innerHTML = `<div class="msg-avatar ai-avatar">AI</div><div class="msg-body"><div class="msg-author">AnyInterview</div><div class="msg-content" id="aiContent"></div></div>`;
    setTimeout(() => {
      messages.appendChild(aiDiv);
      messages.scrollTop = messages.scrollHeight;
      const aiContent = document.getElementById('aiContent')!;
      streamText(aiContent, getAIResponse(value));
    }, 600);

    setTimeout(() => {
      populateStudio(value);
      populateParticipants(value);
    }, 1800);

    setTimeout(() => composerInput?.focus(), 200);
  }, 600);
}

export function returnHome(): void {
  studioStage.classList.remove('visible');
  setTimeout(() => {
    document.documentElement.classList.remove('studio-active');
    heroStage.classList.remove('gone');
    requestAnimationFrame(() => heroStage.classList.remove('collapsing'));
    window.scrollTo({ top: 0, behavior: 'instant' });
    messages.innerHTML = '';
    studioScroll.innerHTML = '';
    studioParticipants.innerHTML = '';
    // Reset to Structure tab
    document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
    document.querySelector<HTMLElement>('.studio-tab[data-pane="structure"]')?.classList.add('active');
    studioScroll.hidden = false;
    studioParticipants.hidden = true;
    if (heroInput) heroInput.focus();
  }, 400);
}

function sendMessage(): void {
  const v = composerInput.value.trim();
  if (!v) return;
  addUserMessage(v);
  composerInput.value = '';
  composerInput.style.height = 'auto';

  const aiDiv = document.createElement('div');
  aiDiv.className = 'msg ai';
  aiDiv.innerHTML = `<div class="msg-avatar ai-avatar">AI</div><div class="msg-body"><div class="msg-author">AnyInterview</div><div class="msg-content"></div></div>`;
  setTimeout(() => {
    messages.appendChild(aiDiv);
    const content = aiDiv.querySelector<HTMLElement>('.msg-content')!;
    streamText(content, getAIResponse(v));
  }, 500);
}

// Wire up hero form
heroForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  launchStudio(heroInput.value);
});

// Wire up composer
composerInput?.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
composerInput?.addEventListener('input', () => {
  composerInput.style.height = 'auto';
  composerInput.style.height = composerInput.scrollHeight + 'px';
});

// Composer send button
document.getElementById('composerSendBtn')?.addEventListener('click', () => {
  sendMessage();
});

// Return home via wordmark clicks
document.getElementById('homeLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (document.documentElement.classList.contains('studio-active')) returnHome();
});
document.getElementById('studioHomeLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  returnHome();
});

// Sidebar "New interview" button
document.getElementById('sidebarNewBtn')?.addEventListener('click', () => {
  returnHome();
});

// Escape key closes studio
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && document.documentElement.classList.contains('studio-active')) {
    returnHome();
  }
});

// Folder collapse in sidebar
document.querySelectorAll<HTMLElement>('.folder-header').forEach(header => {
  header.addEventListener('click', () => {
    header.closest('.folder')?.classList.toggle('collapsed');
  });
});

// Studio pane tabs
document.querySelectorAll<HTMLElement>('.studio-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const pane = tab.dataset.pane;
    studioScroll.hidden = pane !== 'structure';
    studioParticipants.hidden = pane !== 'participants';
  });
});

// Scroll to hero links
document.getElementById('scrollToHeroBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector<HTMLElement>('main.hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => heroInput?.focus(), 700);
});
document.getElementById('closingScrollBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector<HTMLElement>('main.hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => heroInput?.focus(), 700);
});
