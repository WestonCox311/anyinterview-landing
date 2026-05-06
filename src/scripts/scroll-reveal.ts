const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  }
}, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.step, .diff-row').forEach(el => observer.observe(el));
const howClosing = document.getElementById('howClosing');
if (howClosing) observer.observe(howClosing);
