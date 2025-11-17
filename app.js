const compliments = [
  "Tu es la bonne nouvelle de mes journées.",
  "Ton énergie rend tout plus simple et plus doux.",
  "Ton rire est mon son préféré.",
  "Tu arrives à tout rendre joli sans effort.",
  "Ta présence est un refuge et une fête à la fois.",
  "Avec toi, chaque instant devient une histoire à garder.",
  "Ton regard est mon endroit préféré.",
  "Tu transformes le quotidien en jolie parenthèse.",
];

const line = document.getElementById('compliment-line');
const nextBtn = document.getElementById('next-compliment');
const wishBtn = document.getElementById('wish-btn');
let index = 0;

function showCompliment() {
  line.textContent = compliments[index % compliments.length];
  index += 1;
}

nextBtn?.addEventListener('click', () => {
  showCompliment();
  popHearts();
});

wishBtn?.addEventListener('click', () => {
  popHearts(52);
  smoothScroll('#message');
});

function popHearts(count = 28) {
  const container = document.body;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'confetti heart';
    heart.style.left = Math.random() * 100 + 'vw';
    const colorPick = Math.random();
    heart.style.background =
      colorPick > 0.66 ? '#f2b8c6' : colorPick > 0.33 ? '#f7dfe6' : '#b7d3c6';
    heart.style.animationDuration = 2.8 + Math.random() * 1.4 + 's';
    heart.style.animationDelay = Math.random() * 0.25 + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 3800);
  }
}

function smoothScroll(target) {
  const el = document.querySelector(target);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function animateOnScroll() {
  const items = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((el) => observer.observe(el));
}

showCompliment();
animateOnScroll();
popHearts(18);
