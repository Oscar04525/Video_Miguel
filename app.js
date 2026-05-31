/**
 * BIRTHDAY APP ENGINE - MÓVIL PRO MAX (STABLE ENGINE)
 */

const REQUISITES = {
  video: "0531.mp4",
  audio: "Cumpleaños_Feliz.m4a"
};

const bgMusic = new Audio(REQUISITES.audio);
bgMusic.loop = true;

let audioFadeInterval = null;
let audioTimeoutDelay = null;

// ─── MOTOR DE PARTÍCULAS OPTIMIZADO PARA BAJO CONSUMO DE MÓVILES ───
const canvas = document.getElementById('canvas-core');
const ctx = canvas.getContext('2d');
let particles = [];
let renderMode = 'nebula';
let viewX = 0, viewY = 0;

function resizeEngine() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeEngine);
resizeEngine();

// PARALLAX PRO MAX CON ALTO RENDIMIENTO (Mapeo táctil y orientación del móvil)
const viewport3D = document.getElementById('gyro-viewport');
let rotateX = 0, rotateY = 0;

const updateParallaxView = (clientX, clientY) => {
  // Convierte las coordenadas del toque táctil en porcentajes con respecto al centro
  const normX = (clientX / window.innerWidth) - 0.5;
  const normY = (clientY / window.innerHeight) - 0.5;
  
  rotateY = normX * 25; // Rotación máxima de 25 grados laterales
  rotateX = -normY * 25;
  
  if (viewport3D) {
    viewport3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
};

// Captura gestos de arrastre táctil para interactuar de forma fluida en iOS y Android
window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    updateParallaxView(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener('mousemove', (e) => {
  updateParallaxView(e.clientX, e.clientY);
});

// Resetea el ángulo holográfico cuando la pantalla deja de tocarse
const resetView = () => {
  if (viewport3D) viewport3D.style.transform = `rotateX(0deg) rotateY(0deg)`;
};
window.addEventListener('touchend', resetView);
window.addEventListener('mouseleave', resetView);

class ParticleNode {
  constructor(type) {
    this.type = type;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.allocate();
  }

  allocate() {
    if (this.type === 'star') {
      this.radius = Math.random() * 1.2 + 0.4;
      this.alpha = Math.random();
      this.frequency = Math.random() * 0.02 + 0.005;
      this.color = `hsl(${Math.random() * 30 + 265}, 80%, 85%)`;
    } else if (this.type === 'explosion') {
      this.shrapnelArray = [];
      const coreVolume = 35; // Nivel óptimo para GPU de móviles de gama media
      const pigmentBase = Math.random() * 360;
      for (let i = 0; i < coreVolume; i++) {
        const theta = (Math.PI * 2 / coreVolume) * i;
        const velocity = Math.random() * 4 + 2;
        this.shrapnelArray.push({
          x: this.x, y: this.y,
          vx: Math.cos(theta) * velocity, vy: Math.sin(theta) * velocity,
          alpha: 1, decayRate: Math.random() * 0.025 + 0.015,
          color: `hsl(${pigmentBase + (Math.random() * 20 - 10)}, 100%, 70%)`
        });
      }
    } else if (this.type === 'confetti') {
      this.x = Math.random() * canvas.width; this.y = -20;
      this.radius = Math.random() * 5 + 3;
      this.vx = (Math.random() - 0.5) * 3; this.vy = Math.random() * 3 + 2.5;
      this.rotation = Math.random() * Math.PI * 2; this.angularVelocity = (Math.random() - 0.5) * 0.2;
      this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
      this.geometry = Math.random() > 0.5 ? 'cube' : 'sphere';
    }
  }

  process() {
    if (this.type === 'star') {
      this.alpha += Math.sin(Date.now() * this.frequency) * 0.02;
      this.alpha = Math.max(0.1, Math.min(1, this.alpha));
    } else if (this.type === 'explosion') {
      this.shrapnelArray.forEach(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.08; s.alpha -= s.decayRate; });
      this.shrapnelArray = this.shrapnelArray.filter(s => s.alpha > 0);
    } else if (this.type === 'confetti') {
      this.x += this.vx; this.y += this.vy; this.rotation += this.angularVelocity;
      if (this.y > canvas.height + 20) this.allocate();
    }
  }

  render() {
    ctx.save();
    if (this.type === 'star') {
      ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
    } else if (this.type === 'explosion') {
      // EFECTO PRO MAX: Inyección lumínica por GPU para efectos de neón reales
      ctx.globalCompositeOperation = 'screen';
      this.shrapnelArray.forEach(s => {
        ctx.globalAlpha = s.alpha; ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
    } else if (this.type === 'confetti') {
      ctx.fillStyle = this.color; ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
      if (this.geometry === 'cube') {
        ctx.fillRect(-this.radius, -this.radius / 2, this.radius * 2, this.radius);
      } else {
        ctx.beginPath(); ctx.arc(0, 0, this.radius / 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
}

function orchestrateParticles(modeStr) {
  renderMode = modeStr; particles = [];
  if (modeStr === 'nebula') {
    for (let i = 0; i < 70; i++) particles.push(new ParticleNode('star'));
  } else if (modeStr === 'fireworks') {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (renderMode === 'fireworks') {
          let fireNode = new ParticleNode('explosion');
          fireNode.x = Math.random() * canvas.width;
          fireNode.y = Math.random() * canvas.height * 0.3 + 100;
          fireNode.allocate();
          particles.push(fireNode);
        }
      }, i * 1400);
    }
  } else if (modeStr === 'confetti') {
    for (let i = 0; i < 70; i++) {
      const node = new ParticleNode('confetti'); node.y = Math.random() * canvas.height; particles.push(node);
    }
  }
}

function mainGraphicsLoop() {
  ctx.fillStyle = 'rgba(2, 2, 2, 0.25)'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.process(); p.render(); });
  requestAnimationFrame(mainGraphicsLoop);
}
mainGraphicsLoop();

// ─── SECUENCIADOR DE ESCENAS CRONOLÓGICO ───
const SCENE_PIPELINE = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5'];
let activeIndex = -1;

const progressBar = document.getElementById('progress-timeline');
const replayBtn = document.getElementById('replay-btn');
const videoPlayer = document.getElementById('local-player');
const bootstrapOverlay = document.getElementById('intro-click-scene');
const startBtn = document.getElementById('start-btn');

const TIMING_MATRIX = [6000, 8500, 5000, 9500, 9999999];

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (bootstrapOverlay) {
      bootstrapOverlay.style.opacity = '0';
      setTimeout(() => { bootstrapOverlay.style.display = 'none'; }, 850);
    }

    orchestrateParticles('nebula');
    let initExplosion = new ParticleNode('explosion');
    initExplosion.x = canvas.width / 2; initExplosion.y = canvas.height / 2.5;
    initExplosion.allocate();
    particles.push(initExplosion);

    bgMusic.volume = 1.0;
    bgMusic.play().catch(err => console.log("Audio interactivo inicializado"));
    executeSceneTransition(0);
  });
}

function executeSceneTransition(targetIdx) {
  SCENE_PIPELINE.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  
  if (targetIdx >= SCENE_PIPELINE.length) { 
    if (replayBtn) replayBtn.style.display = 'block'; 
    return; 
  }

  activeIndex = targetIdx;
  
  const targetScene = document.getElementById(SCENE_PIPELINE[targetIdx]);
  if (targetScene) {
    setTimeout(() => { targetScene.classList.add('active'); }, 50);
  }

  if (targetIdx === 0 || targetIdx === 1) orchestrateParticles('nebula');
  if (targetIdx === 2) orchestrateParticles('fireworks');

  if (targetIdx === 3) {
    orchestrateParticles('confetti');
    clearTimeout(audioTimeoutDelay); clearInterval(audioFadeInterval);

    audioTimeoutDelay = setTimeout(() => {
      const msDuration = 4000; const stepMs = 100; const totalSteps = msDuration / stepMs; let currentStep = 0;
      audioFadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep <= totalSteps) {
          bgMusic.volume = Math.pow(1 - (currentStep / totalSteps), 3);
        } else {
          bgMusic.volume = 0; bgMusic.pause(); clearInterval(audioFadeInterval);
        }
      }, stepMs);
    }, 5500);
  }

  if (targetIdx === 4) {
    clearTimeout(audioTimeoutDelay); clearInterval(audioFadeInterval);
    bgMusic.pause(); bgMusic.currentTime = 0; bgMusic.volume = 0;
    orchestrateParticles('nebula'); 
    if (replayBtn) replayBtn.style.display = 'block';

    if (videoPlayer) {
      videoPlayer.src = REQUISITES.video;
      videoPlayer.load();
      videoPlayer.play()
        .then(() => { videoPlayer.muted = false; bgMusic.pause(); })
        .catch(err => {
          const unmuteMobile = () => {
            videoPlayer.muted = false; videoPlayer.play().catch(e => console.log(e));
            document.removeEventListener('touchstart', unmuteMobile);
          };
          document.addEventListener('touchstart', unmuteMobile);
        });
    }
  }

  if (targetIdx === 2) launchMatrixCountdown();

  let clockStart = null;
  const currentDuration = TIMING_MATRIX[targetIdx];
  if (targetIdx === 4) { if (progressBar) progressBar.style.width = '100%'; return; }

  function stepRenderTimeline(timestamp) {
    if (!clockStart) clockStart = timestamp;
    const elapsed = timestamp - clockStart;
    const computeRatio = Math.min((elapsed / currentDuration) * 100, 100);
    if (progressBar) progressBar.style.width = computeRatio + '%';
    
    if (elapsed < currentDuration && activeIndex === targetIdx) {
      requestAnimationFrame(stepRenderTimeline);
    } else if (activeIndex === targetIdx) {
      executeSceneTransition(targetIdx + 1);
    }
  }
  requestAnimationFrame(stepRenderTimeline);
}

function launchMatrixCountdown() {
  const labelEl = document.getElementById('countdown-num');
  if (!labelEl) return;
  const matrixGlyphs = ['3', '2', '1', '🚀'];
  const telemetryColors = ['#ff4444', '#ffca28', '#4caf50', '#ffffff'];
  let currentStep = 0;

  function loopTick() {
    if (activeIndex !== 2) return;
    labelEl.textContent = matrixGlyphs[currentStep];
    labelEl.style.color = telemetryColors[currentStep];
    labelEl.style.animation = 'none';
    void labelEl.offsetWidth; 
    labelEl.style.animation = 'countPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.5)';

    if (currentStep < 3) {
      let countExplosion = new ParticleNode('explosion');
      countExplosion.x = canvas.width / 2; countExplosion.y = canvas.height / 2;
      countExplosion.allocate();
      particles.push(countExplosion);
    }
    currentStep++;
    if (currentStep < matrixGlyphs.length) setTimeout(loopTick, 1100);
  }
  loopTick();
}

if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    clearTimeout(audioTimeoutDelay); clearInterval(audioFadeInterval);
    replayBtn.style.display = 'none'; 
    if (progressBar) progressBar.style.width = '0%';
    if (videoPlayer) { videoPlayer.pause(); videoPlayer.src = ""; }
    bgMusic.currentTime = 0; bgMusic.volume = 1.0;
    bgMusic.play().catch(err => console.log(err));
    executeSceneTransition(0);
  });
}