// =============================
// QUICK CUSTOMIZATION
// =============================
const birthdayPlan = {
  title: "Special Birthday dinner it is!",
  message: "After careful analysis of vibes, weather, and cake probability, tonight's winning plan is a team dinner.",
  place: "Dinner at Your Selected Place",
  time: "Today · 8:00 PM · Bring your appetite & Black Denim"
};

// =============================
// CAROUSEL
// =============================

const track = document.querySelector('.carousel-track');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.querySelector('.dots');

let current = 0;
let autoPlay = null;

const NORMAL_SLIDE_TIME = 5000;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');

  dot.type = 'button';
  dot.className = 'dot' + (i === 0 ? ' active' : '');

  dot.setAttribute(
    'aria-label',
    `Go to slide ${i + 1}`
  );

  dot.addEventListener('click', () => {
    goToSlide(i);
  });

  dotsWrap.appendChild(dot);
});


function goToSlide(index) {

  // Stop existing carousel timer
  clearTimeout(autoPlay);

  // Pause any video from the previous slide
  const previousVideo =
    slides[current].querySelector('video');

  if (previousVideo) {
    previousVideo.pause();
    previousVideo.currentTime = 0;
  }

  // Calculate new slide
  current =
    (index + slides.length) % slides.length;

  // Move carousel
  track.style.transform =
    `translateX(-${current * 100}%)`;

  // Update navigation dots
  document
    .querySelectorAll('.dot')
    .forEach((dot, i) => {
      dot.classList.toggle(
        'active',
        i === current
      );
    });

  handleCurrentSlide();
}


function handleCurrentSlide() {

  const currentSlide = slides[current];

  const video =
    currentSlide.querySelector('video');

  // -------------------------
  // VIDEO SLIDE
  // -------------------------

  if (video) {

    clearTimeout(autoPlay);

    video.currentTime = 0;

    // Play video once
    video.play().catch(() => {
      /*
        Browser blocked autoplay.

        User can press Play manually.
        Once video finishes, carousel
        will continue normally.
      */
    });

    return;
  }


  // -------------------------
  // NORMAL IMAGE / GIF SLIDE
  // -------------------------

  autoPlay = setTimeout(() => {

    goToSlide(current + 1);

  }, NORMAL_SLIDE_TIME);
}


// Previous button
document
  .querySelector('.prev')
  .addEventListener('click', () => {

    goToSlide(current - 1);

  });


// Next button
document
  .querySelector('.next')
  .addEventListener('click', () => {

    goToSlide(current + 1);

  });


// When a video finishes,
// immediately move to next slide
slides.forEach((slide, index) => {

  const video = slide.querySelector('video');

  if (!video) return;

  video.addEventListener('ended', () => {

    // Only move if this video
    // is still the active slide
    if (current === index) {
      goToSlide(index + 1);
    }

  });

});

// Start carousel
handleCurrentSlide();

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


// =============================
// LUNCH GUESSING GAME
// =============================

const lunchAnswer = "cock and bull";
const maximumLunchAttempts = 5;

let lunchAttemptsUsed = 0;
let unlockedHints = 0;

const lunchGuessForm =
  document.getElementById("lunchGuessForm");

const lunchGuessInput =
  document.getElementById("lunchGuess");

const attemptCounter =
  document.getElementById("attemptCounter");

const guessFeedback =
  document.getElementById("guessFeedback");

const hintProgress =
  document.getElementById("hintProgress");

const lunchGuessStage =
  document.getElementById("lunchGuessStage");

const lunchSuccess =
  document.getElementById("lunchSuccess");

const lunchFailed =
  document.getElementById("lunchFailed");

const dinnerGame =
  document.getElementById("dinnerGame");

const hintCards = [
  ...document.querySelectorAll(".hint-card")
];


/*
  Converts likely variations into the same format.

  These will all be accepted:
  Cock & Bull
  Cock and Bull
  cock & bull
  COCK AND BULL
*/
function normalizeLunchGuess(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function updateAttemptCounter() {
  const remaining =
    maximumLunchAttempts - lunchAttemptsUsed;

  attemptCounter.textContent =
    `${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining`;
}


function unlockNextHint() {
  if (unlockedHints >= hintCards.length) return;

  hintCards[unlockedHints]
    .classList.add("is-unlocked");

  unlockedHints += 1;

  hintProgress.textContent =
    `${unlockedHints} of ${hintCards.length}`;
}


function showLunchSuccess() {
  lunchGuessStage.classList.add("hidden");
  lunchSuccess.classList.remove("hidden");

  launchConfetti(260);
}


function showLunchFailure() {
  lunchGuessStage.classList.add("hidden");
  lunchFailed.classList.remove("hidden");
}


lunchGuessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submittedGuess =
    normalizeLunchGuess(lunchGuessInput.value);

  if (!submittedGuess) {
    guessFeedback.textContent =
      "Type a guess first, birthday detective.";

    lunchGuessInput.focus();
    return;
  }

  if (submittedGuess === lunchAnswer) {
    guessFeedback.textContent =
      "Correct! Mystery solved.";

    guessFeedback.classList.add("success");

    showLunchSuccess();
    return;
  }

  lunchAttemptsUsed += 1;

  updateAttemptCounter();

  if (lunchAttemptsUsed >= maximumLunchAttempts) {
    showLunchFailure();
    return;
  }

  unlockNextHint();

  const remaining =
    maximumLunchAttempts - lunchAttemptsUsed;

  const wrongGuessMessages = [
    "Not quite! Your first hint has been unlocked.",
    "Still not it. Another hint is now available.",
    "A very respectable guess, but no. Here comes another hint.",
    "One final attempt. The last hint has been unlocked."
  ];

  guessFeedback.textContent =
    wrongGuessMessages[lunchAttemptsUsed - 1] ||
    `Keep guessing. You have ${remaining} attempts remaining.`;

  lunchGuessInput.value = "";
  lunchGuessInput.focus();
});


document
  .querySelectorAll(".continue-to-dinner")
  .forEach((button) => {

    button.addEventListener("click", () => {
      /*
        Hide both potential lunch-result screens
        and reveal the dinner-selection game.
      */

      lunchSuccess.classList.add("hidden");
      lunchFailed.classList.add("hidden");

      dinnerGame.classList.remove("hidden");

      dinnerGame.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.setTimeout(() => {
        launchConfetti(100);
      }, 650);
    });

  });

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
  const memoryVideo = card.querySelector(".memory-video");

  function toggleMemory() {
    const willOpen = !card.classList.contains("is-flipped");

    card.classList.toggle("is-flipped", willOpen);
    card.setAttribute("aria-pressed", String(willOpen));

    if (!memoryVideo) return;

    if (willOpen) {
      // Ensure muted playback is allowed
      memoryVideo.muted = true;
      memoryVideo.currentTime = 0;

      // Wait briefly for the card to begin flipping
      setTimeout(() => {
        const playPromise = memoryVideo.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error(
              "Memory video could not play:",
              memoryVideo.src,
              error
            );
          });
        }
      }, 150);
    } else {
      memoryVideo.pause();
      memoryVideo.currentTime = 0;
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

// Automatic celebration every 10–15 seconds
function scheduleAutoCelebration() {
  // Random delay between 10 and 15 seconds
  const delay = 10000 + Math.random() * 5000;

  setTimeout(() => {
    launchConfetti(100);

    // Schedule the next celebration
    scheduleAutoCelebration();
  }, delay);
}

scheduleAutoCelebration();

// =============================
// WELL-WISHER VIDEO CAROUSEL
// =============================
const wishTrack = document.querySelector('.wish-track');
const wishSlides = [...document.querySelectorAll('.wish-slide')];
const wishDotsContainer = document.querySelector('.wish-dots');
let currentWish = 0;

if (wishTrack && wishSlides.length) {
  wishSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'wish-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Open birthday message ${index + 1}`);
    dot.addEventListener('click', () => showWish(index));
    wishDotsContainer.appendChild(dot);
  });

  function stopWishVideos() {
    wishSlides.forEach(slide => {
      const video = slide.querySelector('.wish-video');
      const replay = slide.querySelector('.wish-replay');
      if (!video) return;
      video.pause();
      video.currentTime = 0;
      replay?.classList.add('hidden');
    });
  }

  function showWish(index) {
    stopWishVideos();
    currentWish = (index + wishSlides.length) % wishSlides.length;
    wishTrack.style.transform = `translateX(-${currentWish * 100}%)`;
    document.querySelectorAll('.wish-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentWish));
  }

  document.querySelector('.wish-prev').addEventListener('click', () => showWish(currentWish - 1));
  document.querySelector('.wish-next').addEventListener('click', () => showWish(currentWish + 1));

  wishSlides.forEach(slide => {
    const video = slide.querySelector('.wish-video');
    const envelope = slide.querySelector('.wish-envelope');
    const replay = slide.querySelector('.wish-replay');

    envelope.addEventListener('click', () => {
      video.currentTime = 0;
      video.play().then(() => envelope.classList.add('is-open')).catch(error => console.log('Birthday message could not play:', error));
    });
    video.addEventListener('ended', () => replay.classList.remove('hidden'));
    replay.addEventListener('click', () => {
      replay.classList.add('hidden');
      video.currentTime = 0;
      video.play().catch(error => console.log('Birthday message could not replay:', error));
    });
  });
}
