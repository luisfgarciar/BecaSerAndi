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

async function startJourney() {
  btn.disabled = true;
  character.classList.remove('celebrate');

  // Reset
  milestones.forEach(m => m.el.classList.remove('active'));
  character.style.transition = 'none';
  character.style.left = (stops[0] * getRoadWidth()) + 'px';

  await new Promise(r => setTimeout(r, 50)); // flush reset
  character.style.transition = 'left 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

  message.textContent = '¡Comenzando el camino...';
  message.style.color = 'white';

  await pause(400);
  await moveTo(0); // Aprendé
  await pause(600);
  await moveTo(1); // Progresá
  await pause(600);
  await moveTo(2); // Lográ tu Beca

  // Celebrate
  character.classList.remove('bounce');
  character.classList.add('celebrate');
  launchConfetti();

  await pause(3000);
  character.classList.remove('celebrate');
  btn.disabled = false;
  btn.textContent = '🔄 Volver a intentarlo';
}

function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
