// ══════════ CUSTOM CURSOR ══════════
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (window.innerWidth > 900) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX - 3 + 'px';
    cursorDot.style.top  = mouseY - 3 + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top  = ringY - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .gc, .tlc, .fig, .chip, .sbtn').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ══════════ PARTICLES ══════════
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const particleCount = 65;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Colour palette that matches the aurora dark theme
const particleColors = [
  [34, 211, 238],   // --cyan
  [129, 140, 248],  // --indigo
  [167, 139, 250],  // --violet
];

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.35 + 0.08;
    this.color  = particleColors[Math.floor(Math.random() * particleColors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width)  this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    const [r, g, b] = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = 0.07 * (1 - dist / 120);
        const [r, g, b] = particles[i].color;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ══════════ NAVBAR SCROLL ══════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 50);
});

// ══════════ ACTIVE MENU ══════════
const secs  = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-menu a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('on'));
      const active = document.querySelector('.nav-menu a[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('on');
    }
  });
}, { threshold: 0.35 });
secs.forEach(sec => sectionObserver.observe(sec));

// ══════════ REVEAL ON SCROLL ══════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rv').forEach(el => revealObserver.observe(el));

// ══════════ 3D TILT CARDS ══════════
if (window.innerWidth > 900) {
  document.querySelectorAll('.gc, .tlc').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotX    = (y - centerY) / 20;
      const rotY    = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ══════════ PARALLAX SCROLL ══════════
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const heroRing  = document.querySelector('.hero-ring');
  if (heroRing) {
    heroRing.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.07}px)`;
  }
  document.querySelectorAll('.orb').forEach((orb, i) => {
    orb.style.transform = `translateY(${scrolled * 0.035 * (i + 1)}px)`;
  });
});

// ══════════ SMOOTH SCROLL ══════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ══════════ MAGNETIC BUTTONS ══════════
if (window.innerWidth > 900) {
  document.querySelectorAll('.btn-g, .btn-o, .nav-pill, .sbtn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ══════════ GLOW TRAIL ON CURSOR ══════════
if (window.innerWidth > 900) {
  const trail = [];
  const TRAIL_LENGTH = 8;
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;pointer-events:none;z-index:9998;
      width:4px;height:4px;border-radius:50%;
      background:rgba(34,211,238,${0.15 - i * 0.015});
      transform:translate(-50%,-50%);
      transition:left ${0.05 + i * 0.04}s, top ${0.05 + i * 0.04}s;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }
  document.addEventListener('mousemove', (e) => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });
}

// ══════════ SECTION LABEL STYLE ══════════
document.querySelectorAll('.section-label').forEach(el => {
  el.style.cssText = `
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:1.02rem;font-weight:700;
    color:var(--text-primary);margin-bottom:.85rem;display:block;
  `;
});