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

const STORED_HASH = '351E56484D97F68F32401AE68DDA5FFB354D65AE846410E94AD7A321F8D4F77F';
const gate = document.getElementById('gate');
const gateForm = document.getElementById('gate-form');
const gateInput = document.getElementById('gate-input');
const gateError = document.getElementById('gate-error');
const app = document.getElementById('app');

const carouselImage = document.getElementById('carousel-image');
const carouselCaption = document.getElementById('carousel-caption');
const dotsWrap = document.getElementById('photo-dots');
const nextBtn = document.getElementById('next-photo');
const prevBtn = document.getElementById('prev-photo');
const line = document.getElementById('compliment-line');
const nextCompliment = document.getElementById('next-compliment');
const wishBtn = document.getElementById('wish-btn');

let index = 0;
let photos = [];
let currentPhoto = 0;
let autoTimer;
let unlocked = false;

function showCompliment() {
  if (!line) return;
  line.textContent = compliments[index % compliments.length];
  index += 1;
}

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

function preloadPhotos(max = 12) {
  return new Promise((resolve) => {
    const found = [];
    const exts = ['jpeg', 'jpg'];
    let pending = max * exts.length;

    for (let i = 1; i <= max; i += 1) {
      let captured = false;
      exts.forEach((ext) => {
        const src = `assets/photo${i}.${ext}`;
        const img = new Image();
        img.onload = () => {
          if (!captured) {
            captured = true;
            found.push({ src, caption: `Moment ${found.length + 1}` });
          }
          check();
        };
        img.onerror = check;
        img.src = src;
      });
    }

    function check() {
      pending -= 1;
      if (pending === 0) {
        resolve(found.length ? found : [
          { src: 'assets/photo1.jpeg', caption: 'Un regard, et tout change.' },
          { src: 'assets/photo2.jpeg', caption: 'Nos éclats de rire complices.' },
          { src: 'assets/photo3.jpeg', caption: 'Le temps suspendu.' },
        ]);
      }
    }
  });
}

function renderDots() {
  dotsWrap.innerHTML = '';
  photos.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = i === currentPhoto ? 'active' : '';
    dot.addEventListener('click', () => goToPhoto(i));
    dotsWrap.appendChild(dot);
  });
}

function goToPhoto(i) {
  if (!photos.length) return;
  currentPhoto = (i + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  carouselImage.classList.remove('show');
  void carouselImage.offsetWidth; // restart transition
  carouselImage.style.backgroundImage = `url('${photo.src}')`;
  carouselCaption.textContent = photo.caption;
  carouselImage.classList.add('show');
  renderDots();
  startAuto();
}

function nextPhoto(step = 1) { goToPhoto(currentPhoto + step); }

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => nextPhoto(1), 5500);
}

async function hashMessage(message) {
  if (!window.crypto?.subtle) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function tryUnlock(value) {
  const hashed = await hashMessage(value);
  if (hashed === STORED_HASH) {
    localStorage.setItem('elsa_gate_token', STORED_HASH);
    unlock();
  } else {
    gateError.textContent = 'Oups, mauvais mot. On réessaie ?';
    gateInput.value = '';
    gateInput.focus();
  }
}

function unlock() {
  if (unlocked) return;
  unlocked = true;
  gate.classList.add('hidden');
  document.body.classList.remove('locked');
  initApp();
}

function bindGate() {
  const stored = localStorage.getItem('elsa_gate_token');
  if (stored === STORED_HASH) {
    unlock();
    return;
  }
  gateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = gateInput?.value?.trim() || '';
    tryUnlock(value);
  });
}

nextCompliment?.addEventListener('click', () => { showCompliment(); popHearts(); });
wishBtn?.addEventListener('click', () => { popHearts(52); smoothScroll('#message'); });
nextBtn?.addEventListener('click', () => nextPhoto(1));
prevBtn?.addEventListener('click', () => nextPhoto(-1));

async function initApp() {
  showCompliment();
  animateOnScroll();
  popHearts(18);
  photos = await preloadPhotos();
  renderDots();
  goToPhoto(0);
}

bindGate();
