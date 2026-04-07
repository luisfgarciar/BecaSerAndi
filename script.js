const character = document.getElementById('character');
const message   = document.getElementById('message');
const btn       = document.getElementById('btn');

const milestones = [
  { el: document.getElementById('m1'), label: '📚 Aprendiendo...', color: '#64b5f6' },
  { el: document.getElementById('m2'), label: '💡 Progresando...', color: '#ffb74d' },
  { el: document.getElementById('m3'), label: '🎓 ¡Lograste la Beca Ser ANDI!', color: '#a5d6a7' },
];

// Positions relative to the road width (percentage-based)
const stops = [0.07, 0.48, 0.87];

// ── Mini-quiz ─────────────────────────────────────────────────────────────────
// quizData is loaded from quizData.js

const quizEl       = document.getElementById('quiz');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions  = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');

function showQuiz(index) {
  return new Promise(resolve => {
    const { q, options, answer } = quizData[index];
    quizQuestion.textContent = q;
    quizFeedback.textContent = '';
    quizFeedback.className   = '';
    quizOptions.innerHTML    = '';

    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className   = 'quiz-btn';
      btn.addEventListener('click', () => {
        if (i === answer) {
          quizFeedback.textContent = '¡Correcto! 🎉';
          quizFeedback.className   = 'correct';
          quizOptions.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);
          setTimeout(() => {
            quizEl.hidden = true;
            resolve();
          }, 700);
        } else {
          quizFeedback.textContent = 'Incorrecto, intentá de nuevo.';
          quizFeedback.className   = 'wrong';
          btn.disabled = true;
        }
      });
      quizOptions.appendChild(btn);
    });

    quizEl.hidden = false;
  });
}

// ── Web Audio helpers ─────────────────────────────────────────────────────────
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration = 0.18, delay = 0) {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t = audioCtx.currentTime + delay;
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

function playCelebration() {
  // Short ascending arpeggio
  [523, 659, 784, 1047].forEach((freq, i) => playTone(freq, 0.22, i * 0.12));
}

// Milestone tones: Aprendé → Progresá → Beca
const milestoneTones = [440, 523, 659];

// ── localStorage helpers ──────────────────────────────────────────────────────
function saveProgress(reachedIndex) {
  try {
    localStorage.setItem('journeyProgress', JSON.stringify({ reached: reachedIndex }));
  } catch (_) {}
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem('journeyProgress') || 'null');
    if (!saved || saved.reached == null) return;
    for (let i = 0; i <= saved.reached; i++) {
      milestones[i].el.classList.add('active');
    }
    character.style.transition = 'none';
    character.style.left = (stops[saved.reached] * getRoadWidth()) + 'px';
  } catch (_) {}
}

function getRoadWidth() {
  return document.getElementById('road').offsetWidth;
}

function moveTo(stopIndex) {
  return new Promise(resolve => {
    const road = getRoadWidth();
    const targetLeft = stops[stopIndex] * road;

    character.style.left = targetLeft + 'px';
    character.classList.add('bounce');

    milestones[stopIndex].el.classList.add('active');
    message.textContent = milestones[stopIndex].label;
    message.style.color = milestones[stopIndex].color;
    playTone(milestoneTones[stopIndex]);
    saveProgress(stopIndex);

    setTimeout(resolve, 1800);
  });
}

function launchConfetti() {
  const colors = ['#6c63ff', '#e040fb', '#ffb74d', '#a5d6a7', '#f48fb1', '#80deea'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti');
    piece.style.left       = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width      = (6 + Math.random() * 10) + 'px';
    piece.style.height     = (6 + Math.random() * 10) + 'px';
    piece.style.animationDuration  = (1.5 + Math.random() * 2) + 's';
    piece.style.animationDelay     = (Math.random() * 1) + 's';
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// Position character at first milestone, then restore any saved progress
character.style.transition = 'none';
character.style.left = (stops[0] * getRoadWidth()) + 'px';
loadProgress();

async function startJourney() {
  initAudio();
  btn.disabled = true;
  character.classList.remove('celebrate');

  // Reset
  milestones.forEach(m => m.el.classList.remove('active'));
  try { localStorage.removeItem('journeyProgress'); } catch (_) {}
  character.style.transition = 'none';
  character.style.left = (stops[0] * getRoadWidth()) + 'px';

  await new Promise(r => setTimeout(r, 50)); // flush reset
  character.style.transition = 'left 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

  character.hidden = false;
  message.hidden = false;
  message.textContent = '¡Comenzando el camino...';
  message.style.color = 'white';

  await pause(400);
  await showQuiz(0); await moveTo(0); // Aprendé
  await pause(600);
  await showQuiz(1); await moveTo(1); // Progresá
  await pause(600);
  await showQuiz(2); await moveTo(2); // Lográ tu Beca

  // Celebrate
  character.classList.remove('bounce', 'walking');
  character.classList.add('celebrate');
  launchConfetti();
  playCelebration();

  await pause(3000);
  character.classList.remove('celebrate');
  btn.disabled = false;
  btn.textContent = '🔄 Volver a intentarlo';
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
