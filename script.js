// =============================
// QUICK CUSTOMIZATION
// =============================
const birthdayPlan = {
  title: "Team dinner it is!",
  message: "After careful analysis of vibes, weather, and cake probability, tonight's winning plan is a team dinner.",
  place: "Dinner at [Venue Name]",
  time: "Today · 7:00 PM · Bring your appetite"
};

// Carousel
const track = document.querySelector('.carousel-track');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.querySelector('.dots');
let current = 0;
let autoPlay;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  restartAutoPlay();
}
function restartAutoPlay() {
  clearInterval(autoPlay);
  autoPlay = setInterval(() => goToSlide(current + 1), 5000);
}
document.querySelector('.next').addEventListener('click', () => goToSlide(current + 1));
document.querySelector('.prev').addEventListener('click', () => goToSlide(current - 1));
restartAutoPlay();

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Illusion-of-choice game: every selection leads to one predetermined outcome.
let selectedChoice = null;
const revealButton = document.getElementById('revealPlan');
document.querySelectorAll('#choices button').forEach(button => {
  button.addEventListener('click', () => {
    selectedChoice = button.dataset.choice;
    document.querySelectorAll('#choices button').forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
    revealButton.disabled = false;
  });
});

revealButton.addEventListener('click', () => {
  if (!selectedChoice) return;
  revealButton.textContent = 'Analysing birthday vibes…';
  revealButton.disabled = true;
  setTimeout(() => {
    document.getElementById('gameStart').classList.add('hidden');
    document.getElementById('resultTitle').textContent = birthdayPlan.title;
    document.getElementById('resultText').textContent = birthdayPlan.message;
    document.getElementById('resultPlace').textContent = birthdayPlan.place;
    document.getElementById('resultTime').textContent = birthdayPlan.time;
    document.getElementById('gameResult').classList.remove('hidden');
    launchConfetti(150);
  }, 1300);
});

document.getElementById('playAgain').addEventListener('click', () => {
  selectedChoice = null;
  document.querySelectorAll('#choices button').forEach(b => b.classList.remove('selected'));
  revealButton.textContent = 'Let fate decide';
  revealButton.disabled = true;
  document.getElementById('gameResult').classList.add('hidden');
  document.getElementById('gameStart').classList.remove('hidden');
});

// Lightweight canvas confetti, no library required.
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas(){ canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
addEventListener('resize', resizeCanvas); resizeCanvas();
function launchConfetti(amount = 120) {
  const colors = ['#ffffff','#ff5a71','#ffd166','#ffb3c1','#d31d40'];
  for (let i=0;i<amount;i++) particles.push({x:Math.random()*innerWidth,y:-20-Math.random()*120,vx:(Math.random()-.5)*6,vy:2+Math.random()*5,g:.05+Math.random()*.08,r:3+Math.random()*5,c:colors[Math.floor(Math.random()*colors.length)],a:Math.random()*Math.PI});
  if (particles.length === amount) requestAnimationFrame(drawConfetti);
}
function drawConfetti(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=>{p.x+=p.vx;p.vy+=p.g;p.y+=p.vy;p.a+=.08;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);ctx.restore();});
  particles=particles.filter(p=>p.y<innerHeight+30);
  if(particles.length) requestAnimationFrame(drawConfetti); else ctx.clearRect(0,0,innerWidth,innerHeight);
}

const admireCards = document.querySelectorAll(".admire-card");

admireCards.forEach((card) => {
  const memoryImage = card.querySelector(".admire-card-back img");

  function toggleMemory() {
    const willOpen = !card.classList.contains("is-flipped");

    card.classList.toggle("is-flipped", willOpen);
    card.setAttribute("aria-pressed", String(willOpen));

    /*
      Reset the image source when opening the card.
      This makes animated GIFs restart from the beginning.
    */
    if (willOpen && memoryImage) {
      const imageSource =
        memoryImage.dataset.src || memoryImage.getAttribute("src");

      memoryImage.setAttribute("src", "");
      memoryImage.setAttribute("src", imageSource);
    }
  }

  card.addEventListener("click", toggleMemory);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMemory();
    }
  });
});



document.getElementById('celebrateBtn').addEventListener('click', () => launchConfetti(180));
document.getElementById('finalConfetti').addEventListener('click', () => launchConfetti(220));
document.getElementById('year').textContent = new Date().getFullYear();
