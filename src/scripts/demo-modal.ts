const demoModal = document.getElementById('demoModal');
const demoForm = document.getElementById('demoForm') as HTMLFormElement | null;
const demoSuccess = document.getElementById('demoSuccess') as HTMLElement | null;
const demoSuccessEmail = document.getElementById('demoSuccessEmail');
const demoSubmitBtn = document.getElementById('demoSubmitBtn') as HTMLButtonElement | null;

function openDemoModal(): void {
  if (!demoModal) return;
  demoModal.classList.add('open');
  demoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    demoForm?.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
  }, 200);
}

function closeDemoModal(): void {
  if (!demoModal) return;
  demoModal.classList.remove('open');
  demoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (demoForm) demoForm.hidden = false;
    if (demoSuccess) demoSuccess.hidden = true;
    demoForm?.reset();
    if (demoSubmitBtn) {
      demoSubmitBtn.disabled = false;
      demoSubmitBtn.textContent = 'Send and book a demo →';
    }
  }, 350);
}

document.querySelectorAll<HTMLElement>('[data-action="open-demo"]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); openDemoModal(); });
});

document.querySelectorAll('.demo-modal-close, .demo-modal-close-btn, .demo-modal-backdrop')
  .forEach(el => el.addEventListener('click', closeDemoModal));

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && demoModal?.classList.contains('open')) closeDemoModal();
});

demoForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(demoForm));
  if (demoSubmitBtn) {
    demoSubmitBtn.disabled = true;
    demoSubmitBtn.textContent = 'Sending…';
  }

  // Notify founders via mailto as a reliable static-site fallback
  const name = String(payload['name'] ?? '');
  const email = String(payload['email'] ?? '');
  const message = String(payload['message'] ?? '');
  const subject = encodeURIComponent(`Demo request from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTime: ${new Date().toISOString()}`);
  window.open(`mailto:weston@anyinterview.to?subject=${subject}&body=${body}`, '_blank');

  // Show success immediately
  if (demoSuccessEmail) demoSuccessEmail.textContent = email;
  if (demoForm) demoForm.hidden = true;
  if (demoSuccess) demoSuccess.hidden = false;
});
