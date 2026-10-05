/* ══════════════════════════════════════════════════════════
   ZENOVO ROBOTIC SYSTEMS v3 — MASTER CYBERNETIC JAVASCRIPT
   ══════════════════════════════════════════════════════════ */

/* ═══ WEB AUDIO SYNTHESIZER (CYBER SOUND FX) ═══ */
let audioCtx = null;
let audioEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
  if (!audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio context graceful fallback
  }
}

function soundHover() {
  playTone(880, 'triangle', 0.05, 0.03);
}

function soundClick() {
  playTone(1200, 'square', 0.08, 0.04);
  setTimeout(() => playTone(1600, 'sine', 0.06, 0.03), 40);
}

function soundWhoosh() {
  if (!audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch(e) {}
}

function soundAlert() {
  playTone(540, 'sine', 0.1, 0.06);
  setTimeout(() => playTone(820, 'sine', 0.12, 0.06), 90);
  setTimeout(() => playTone(1100, 'sine', 0.16, 0.06), 180);
}

// Audio Toggle Button
const audioToggleBtn = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');
const audioLabel = document.getElementById('audio-label');

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    initAudio();
    audioEnabled = !audioEnabled;
    audioIcon.textContent = audioEnabled ? '🔊' : '🔇';
    audioLabel.textContent = audioEnabled ? 'FX: ON' : 'FX: OFF';
    if (audioEnabled) soundClick();
  });
}

/* ═══ TELEMETRY TICKER LIVE CLOCK & FREQ ═══ */
const tbClock = document.getElementById('tb-clock');
const tbFreq = document.getElementById('tb-freq');

function updateTelemetry() {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
  if (tbClock) tbClock.textContent = `${h}:${m}:${s}.${ms}`;
  
  if (tbFreq && Math.random() < 0.08) {
    const val = (2.840 + (Math.random() * 0.015)).toFixed(3);
    tbFreq.textContent = `${val} THz`;
  }
  requestAnimationFrame(updateTelemetry);
}
requestAnimationFrame(updateTelemetry);

/* ═══ INITIAL LOADER ═══ */
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const loader = document.getElementById('loader');
let pct = 0;

const loaderInterval = setInterval(() => {
  pct += Math.random() * 20;
  if (pct >= 100) { pct = 100; clearInterval(loaderInterval); }
  if (loaderBar) loaderBar.style.width = pct + '%';
  if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
  if (pct >= 100) {
    setTimeout(() => {
      if (loader) loader.classList.add('out');
      document.body.style.overflow = '';
      startHeroCounters();
    }, 400);
  }
}, 110);

document.body.style.overflow = 'hidden';

/* ═══ CUSTOM MOUSE CURSOR ═══ */
const cursorEl = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', (e) => {
  cx = e.clientX; cy = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
  }
});

(function trailLoop() {
  tx += (cx - tx) * 0.12;
  ty += (cy - ty) * 0.12;
  if (cursorEl) {
    cursorEl.style.left = tx + 'px';
    cursorEl.style.top = ty + 'px';
  }
  requestAnimationFrame(trailLoop);
})();

document.querySelectorAll('a, button, .clip-card, .mc, .stat, .cf, .tqb').forEach(el => {
  el.addEventListener('mouseenter', () => {
    soundHover();
    if (cursorEl) {
      cursorEl.querySelector('.cursor-ring').style.transform = 'scale(1.8)';
      cursorEl.querySelector('.cursor-ring').style.borderColor = 'rgba(0,240,255,.9)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursorEl) {
      cursorEl.querySelector('.cursor-ring').style.transform = '';
      cursorEl.querySelector('.cursor-ring').style.borderColor = '';
    }
  });
  el.addEventListener('click', () => {
    soundClick();
  });
});

/* ═══ PARTICLE CANVAS MATRIX ═══ */
(function particles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  const N = 120;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4,
    vy: -(Math.random() * .5 + .15),
    r: Math.random() * 1.8 + .4,
    op: Math.random() * .5 + .1,
    ph: Math.random() * Math.PI * 2,
    col: Math.random() > .5 ? '0,240,255' : '123,47,255',
  }));

  let mouseX = -9999, mouseY = -9999;
  canvas.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.ph += .018;
      p.op = .25 + Math.sin(p.ph) * .2;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5 || p.x > W + 5) p.x = Math.random() * W;
      
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 95) { p.x += (dx / d) * 1.8; p.y += (dy / d) * 1.8; }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.op})`;
      ctx.fill();
    });
    
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.strokeStyle = `rgba(0,240,255,${(1 - d / 110) * .12})`;
          ctx.lineWidth = .5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });
})();

/* ═══ NAVBAR & SCROLL REVEALS ═══ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nl');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
  updateNav();
});

function updateNav() {
  let active = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) active = s.id; });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + active);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Hamburger
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const open = navMenu.style.display === 'flex';
    Object.assign(navMenu.style, open ? { display: '' } : {
      display: 'flex', flexDirection: 'column', position: 'absolute',
      top: '72px', left: '0', right: '0', background: 'rgba(1,4,8,.97)',
      backdropFilter: 'blur(20px)', padding: '22px 28px', gap: '8px',
      borderBottom: '1px solid rgba(0,240,255,.15)', zIndex: '999'
    });
    const s = burger.querySelectorAll('span');
    s[0].style.transform = open ? '' : 'rotate(45deg) translate(5px,5px)';
    s[1].style.opacity = open ? '1' : '0';
    s[2].style.transform = open ? '' : 'rotate(-45deg) translate(5px,-5px)';
  });
}

// Reveal Observer
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('vis'), i * 60);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => io.observe(el));

/* ═══ STATS & HERO NUMBER COUNTERS ═══ */
function animCount(el, from, to, dur, suffix = '') {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    const v = Math.floor(from + (to - from) * e);
    el.textContent = v + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = to + suffix;
  };
  requestAnimationFrame(tick);
}

function startHeroCounters() {
  document.querySelectorAll('.hs-n').forEach(el => {
    animCount(el, 0, +el.dataset.target, 2000);
  });
}

const statIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animCount(el, 0, +el.dataset.target, 2000, el.dataset.suffix || '');
      statIO.unobserve(el);
    }
  });
}, { threshold: .4 });
document.querySelectorAll('.stat-n').forEach(el => statIO.observe(el));

/* ═══ SAMPLE CLIPS: FILTER TABS ═══ */
const filterBtns = document.querySelectorAll('.cf');
const clipCards = document.querySelectorAll('.clip-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    
    soundWhoosh();

    clipCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.classList.remove('vis');
        setTimeout(() => card.classList.add('vis'), 40);
      }
    });
  });
});

/* ═══ SAMPLE CLIPS: HOLOGRAPHIC LIGHTBOX (ALL 10 ZENOVO ROBOTIC MODELS WITH 10s VIDEOS) ═══ */
const lightboxData = [
  {
    video: 'robot_clip_1.mp4',
    img: 'robot_clip_1.jpg',
    name: 'Zenovo Robotic Atlas-Dynamic',
    label: 'ZENOVO ROBOTIC ATLAS-DYNAMIC // BIPEDAL VAULT (10s HD)',
    status: '🏃 DYNAMIC OBSTACLE VAULT CLEARED',
    coords: 'TESTING HANGAR B4 // HIGH-SPEED TRACKING OK',
    desc: 'High-power bipedal research humanoid with carbon-composite limbs and high-bandwidth hydraulic force actuators. Navigates real-world obstacle courses autonomously.',
    metrics: [
      { l: 'MOTOR TORQUE', v: '320 N·m' },
      { l: 'WALKING SPEED', v: '2.4 m/s' },
      { l: 'MPC BALANCE', v: '1,000 Hz Loop' }
    ]
  },
  {
    video: 'robot_clip_2.mp4',
    img: 'robot_clip_2.jpg',
    name: 'Zenovo Robotic Kinetic-Legs',
    label: 'ZENOVO ROBOTIC KINETIC-LEGS // HYDRAULIC STRIDE (10s HD)',
    status: '🦿 HYDRAULIC SUSPENSION CALIBRATED',
    coords: 'DYNAMICS LAB // GROUND REACTION SENSORS ACTIVE',
    desc: 'Dual inverted hydraulic knee architecture with elastomer shock absorption. Absorbs up to 800 kg-force impact upon ground landing with zero joint backlash.',
    metrics: [
      { l: 'MAX LOAD', v: '800 kgf' },
      { l: 'ACTUATOR STROKE', v: '420 mm' },
      { l: 'IMPACT DAMPING', v: '100% Absorbed' }
    ]
  },
  {
    video: 'robot_clip_3.mp4',
    img: 'robot_clip_3.jpg',
    name: 'Zenovo Robotic Dexter-Grip',
    label: 'ZENOVO ROBOTIC DEXTER-GRIP // 16-DOF TACTILE HAND (10s HD)',
    status: '🖐 SUB-MILLIMETER TACTILE GRIP ONLINE',
    coords: 'MANIPULATION CELL // FORCE SENSORS NORMAL',
    desc: '5-finger articulated biomechanical hand featuring cable-driven synthetic tendons and 256 silicone tactile pressure cells per fingertip.',
    metrics: [
      { l: 'ACTIVE FINGERS', v: '5 Independent' },
      { l: 'TACTILE NODES', v: '1,280 Sensor Cells' },
      { l: 'GRIP SENSITIVITY', v: '99.8%' }
    ]
  },
  {
    video: 'robot_clip_4.mp4',
    img: 'robot_clip_4.jpg',
    name: 'Zenovo Robotic Prime-One',
    label: 'ZENOVO ROBOTIC PRIME-ONE // WORKSTATION HUMANOID (10s HD)',
    status: '🏭 COLLABORATIVE LOGISTICS ACTIVE',
    coords: 'ASSEMBLY LINE // WORKFORCE PROTOCOL LEVEL-1',
    desc: 'Commercial humanoid engineered for factory logistics, assembly lines, and collaborative tool operation with human workforce safety protocols.',
    metrics: [
      { l: 'PAYLOAD LIFT', v: '35 kg' },
      { l: 'STATURE', v: '1.78 Meters' },
      { l: 'RUN-TIME', v: '8.5 Hours' }
    ]
  },
  {
    video: 'robot_clip_5.mp4',
    img: 'robot_clip_5.jpg',
    name: 'Zenovo Robotic Vision-Stereo',
    label: 'ZENOVO ROBOTIC VISION-STEREO // OPTIC DEPTH (10s HD)',
    status: '👁 STEREOSCOPIC POINT CLOUD LOCKED',
    coords: 'SPATIAL TEST // DUAL F/1.4 LENSES FOCUSED',
    desc: 'Dual multi-focal optical cameras with anti-reflective sapphire coating. Merges real-time stereoscopic depth disparity with high-speed optical flow.',
    metrics: [
      { l: 'LENS APERTURE', v: 'Dual F/1.4 Glass' },
      { l: 'DEPTH FPS', v: '120 FPS Realtime' },
      { l: 'RANGE', v: '0.1m - 80.0m' }
    ]
  },
  {
    video: 'robot_clip_6.mp4',
    img: 'robot_clip_6.jpg',
    name: 'Zenovo Robotic Cranium-X',
    label: 'ZENOVO ROBOTIC CRANIUM-X // EDGE NEURAL CORE (10s HD)',
    status: '🧠 INFERENCE LATENCY 0.8ms',
    coords: 'CNC TITANIUM HOUSING // PASSIVE FIN COOLING',
    desc: 'CNC-machined aerospace titanium head chassis housing dual neural accelerators, passive thermal heatsink fins, and 360-degree acoustic microphone array.',
    metrics: [
      { l: 'ONBOARD TOPS', v: '400 TOPS Edge AI' },
      { l: 'HEAD MASS', v: '3.4 kg' },
      { l: 'THERMAL REGIME', v: 'Passive Air' }
    ]
  },
  {
    video: 'robot_clip_7.mp4',
    img: 'zenovo_hero_robot.jpg',
    name: 'Zenovo Robotic Prime-X',
    label: 'ZENOVO ROBOTIC PRIME-X // FLAGSHIP HUMANOID (10s HD)',
    status: '👑 PRODUCTION MODEL v4 ONLINE',
    coords: 'RESEARCH TESTBED // WHOLE-BODY EQUILIBRIUM',
    desc: 'Our flagship general-purpose commercial humanoid robot. Combining 34 active degrees of freedom with human-scale form factor and whole-body balance.',
    metrics: [
      { l: 'ACTIVE DoF', v: '34 Harmonic Joints' },
      { l: 'CHASSIS', v: 'Brushed Titanium' },
      { l: 'BALANCE EQUIL', v: '99.8% Stability' }
    ]
  },
  {
    video: 'robot_clip_8.mp4',
    img: 'zenovo_robot_closeup.jpg',
    name: 'Zenovo Robotic Sensor-Array',
    label: 'ZENOVO ROBOTIC SENSOR-ARRAY // SPATIAL LIDAR (10s HD)',
    status: '🔬 MULTI-SPECTRAL SENSOR FUSION ACTIVE',
    coords: 'PERCEPTION SUITE // SOLID-STATE LiDAR OK',
    desc: 'Integrated sensor suite incorporating time-of-flight LiDAR, thermal infrared mapping, and high-definition wide-baseline RGB vision.',
    metrics: [
      { l: 'LiDAR TYPE', v: 'Solid-State 3D' },
      { l: 'CAMERA RESOLUTION', v: '4K 60FPS Stereo' },
      { l: 'FUSION LATENCY', v: '< 1.2 ms' }
    ]
  },
  {
    video: 'robot_clip_9.mp4',
    img: 'zenovo_robot_models.jpg',
    name: 'Zenovo Robotic Factory-Fleet',
    label: 'ZENOVO ROBOTIC FLEET // DEPLOYED WORKFORCE (10s HD)',
    status: '⚙ MULTI-AGENT SYNCHRONIZATION ACTIVE',
    coords: 'GLOBAL TELEMETRY // 5,000 ROBOTS DEPLOYED',
    desc: 'Multi-unit industrial collective coordination. Fleet-linked humanoid units collaborating in manufacturing logistics and pallet transfer.',
    metrics: [
      { l: 'ACTIVE FLEET', v: '5,000 Robots' },
      { l: 'FLEET LATENCY', v: '0.04 ms' },
      { l: 'PROTOCOL', v: 'Industrial Mesh' }
    ]
  },
  {
    video: 'robot_clip_10.mp4',
    img: 'zenovo_tech_lab.jpg',
    name: 'Zenovo Robotic Testing Lab',
    label: 'ZENOVO ROBOTIC LAB // R&D TESTING FACILITY (10s HD)',
    status: '🔬 ISO-5 ROBOTICS INTEGRATION FACILITY',
    coords: 'R&D FACILITY // DYNAMICS STAGE SECTOR 4',
    desc: 'State-of-the-art humanoid manufacturing and validation laboratory where hardware endurance, gait balance, and neural perception are certified 24/7.',
    metrics: [
      { l: 'FACILITY CLASS', v: 'ISO-5 Certified' },
      { l: 'TEST RIGS', v: '24 Dynamic Stages' },
      { l: 'WEEKLY CAPACITY', v: '120 Humanoids' }
    ]
  },
  {
    video: 'robot_action_10s.mp4',
    img: 'robot_action_poster.jpg',
    name: 'Zenovo Robotic Dynamic Agility Test',
    label: 'ZENOVO ROBOTIC 10s DYNAMIC AGILITY // OBSTACLE TEST',
    status: '🏃 FULL DYNAMIC BIPEDAL TEST SEQUENCE (10 SECONDS)',
    coords: 'HANGAR B4 TEST TRACK // HIGH-SPEED CAPTURE',
    desc: '10-second multi-angle robotics test sequence: Atlas-Dynamic leaping over 1.4m hurdle, stereoscopic lens autofocus, and torso balance compensation.',
    metrics: [
      { l: 'TEST DURATION', v: '10.00 Seconds' },
      { l: 'OBSTACLE HEIGHT', v: '1.40 Meters' },
      { l: 'MOTOR TORQUE', v: '320 N·m Peak' }
    ]
  }
];

let currentClip = 0;
const lbVideo = document.getElementById('lb-video');
const lbVfill = document.getElementById('lb-vfill');
const lbVtime = document.getElementById('lb-vtime');
const lbPlayToggle = document.getElementById('lb-play-toggle');
const lbMuteToggle = document.getElementById('lb-mute-toggle');

/* ═══ 10-SECOND ROBOT ACTION CLIP CONTROLLER ═══ */
const actionVid = document.getElementById('action-vid-elem');
const acPlayBtn = document.getElementById('ac-play-btn');
const acPlayBtnIcon = document.getElementById('ac-play-btn-icon');
const acPlayBtnText = document.getElementById('ac-play-btn-text');
const acCenterPlay = document.getElementById('ac-center-play');
const acReplayBtn = document.getElementById('ac-replay-btn');
const acSoundBtn = document.getElementById('ac-sound-btn');
const acSoundIcon = document.getElementById('ac-sound-icon');
const acSoundText = document.getElementById('ac-sound-text');
const acCurTime = document.getElementById('ac-cur-time');
const acTotTime = document.getElementById('ac-tot-time');
const acProgressFill = document.getElementById('ac-progress-fill');
const acProgressHandle = document.getElementById('ac-progress-handle');
const acProgressBar = document.getElementById('ac-progress-bar');
const acSpdBtns = document.querySelectorAll('.ac-spd-btn');
const acHologramBtn = document.getElementById('ac-hologram-btn');
const acPhases = document.querySelectorAll('.ac-phase');

function formatActionTime(sec) {
  const s = Math.floor(sec);
  const ms = Math.floor((sec - s) * 100);
  return `00:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
}

function updateActionUI() {
  if (!actionVid) return;
  const isPlaying = !actionVid.paused && !actionVid.ended;
  if (acPlayBtnIcon) acPlayBtnIcon.textContent = isPlaying ? '⏸' : '▶';
  if (acPlayBtnText) acPlayBtnText.textContent = isPlaying ? 'Pause Sequence' : 'Play Action Sequence';
  if (acCenterPlay) {
    if (isPlaying) acCenterPlay.classList.add('hidden');
    else acCenterPlay.classList.remove('hidden');
  }
}

function toggleActionPlay() {
  if (!actionVid) return;
  if (actionVid.paused || actionVid.ended) {
    actionVid.play().then(() => {
      soundWhoosh();
      updateActionUI();
    }).catch(() => {});
  } else {
    actionVid.pause();
    soundClick();
    updateActionUI();
  }
}

if (actionVid) {
  actionVid.muted = false;

  actionVid.addEventListener('timeupdate', () => {
    const cur = actionVid.currentTime || 0;
    const dur = actionVid.duration || 10;
    const pct = Math.min((cur / dur) * 100, 100);
    
    if (acProgressFill) acProgressFill.style.width = pct + '%';
    if (acProgressHandle) acProgressHandle.style.left = pct + '%';
    if (acCurTime) acCurTime.textContent = formatActionTime(cur);
    if (acTotTime) acTotTime.textContent = formatActionTime(dur);

    // Update phase highlight
    acPhases.forEach(p => {
      const t = parseFloat(p.dataset.time || 0);
      let isActive = false;
      if (t === 0 && cur < 3.5) isActive = true;
      else if (t === 3.5 && cur >= 3.5 && cur < 7.0) isActive = true;
      else if (t === 7.0 && cur >= 7.0) isActive = true;
      p.classList.toggle('active', isActive);
    });
  });

  actionVid.addEventListener('play', updateActionUI);
  actionVid.addEventListener('pause', updateActionUI);
  actionVid.addEventListener('ended', () => {
    updateActionUI();
    soundAlert();
  });
}

if (acPlayBtn) acPlayBtn.addEventListener('click', toggleActionPlay);
if (acCenterPlay) acCenterPlay.addEventListener('click', toggleActionPlay);

if (acReplayBtn && actionVid) {
  acReplayBtn.addEventListener('click', () => {
    actionVid.currentTime = 0;
    actionVid.play().catch(() => {});
    soundWhoosh();
    updateActionUI();
  });
}

if (acSoundBtn && actionVid) {
  acSoundBtn.addEventListener('click', () => {
    actionVid.muted = !actionVid.muted;
    if (actionVid.muted) {
      acSoundBtn.classList.remove('sound-active');
      if (acSoundIcon) acSoundIcon.textContent = '🔇';
      if (acSoundText) acSoundText.textContent = 'Combat Audio (OFF)';
    } else {
      acSoundBtn.classList.add('sound-active');
      if (acSoundIcon) acSoundIcon.textContent = '🔊';
      if (acSoundText) acSoundText.textContent = 'Combat Audio (ON)';
      soundAlert();
    }
  });
}

// Speed toggles
acSpdBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    acSpdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const spd = parseFloat(btn.dataset.spd || 1.0);
    if (actionVid) actionVid.playbackRate = spd;
    soundClick();
  });
});

// Scrubbing progress bar
if (acProgressBar && actionVid) {
  acProgressBar.addEventListener('click', (e) => {
    const rect = acProgressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = actionVid.duration || 10;
    actionVid.currentTime = pos * dur;
    soundClick();
  });
}

// Phase clicking jumps to timestamp
acPhases.forEach(p => {
  p.addEventListener('click', () => {
    const t = parseFloat(p.dataset.time || 0);
    if (actionVid) {
      actionVid.currentTime = t;
      actionVid.play().catch(() => {});
      soundWhoosh();
    }
  });
});

// Hologram lightbox launcher for Action Clip
if (acHologramBtn) {
  acHologramBtn.addEventListener('click', () => {
    openLightbox(10);
  });
}

// Card hover video stream triggers
document.querySelectorAll('.clip-card').forEach(card => {
  const vid = card.querySelector('.cc-video');
  if (vid) {
    card.addEventListener('mouseenter', () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      vid.pause();
    });
  }
});

function openLightbox(i) {
  currentClip = i;
  const d = lightboxData[i];
  if (!d) return;
  
  soundWhoosh();
  
  if (lbVideo) {
    lbVideo.src = d.video;
    lbVideo.poster = d.img;
    lbVideo.currentTime = 0;
    lbVideo.muted = true;
    lbVideo.play().catch(() => {});
  }
  
  document.getElementById('lb-title').textContent = d.label;
  document.getElementById('lb-status').textContent = d.status;
  document.getElementById('lb-coords').textContent = d.coords;
  document.getElementById('lb-name').textContent = d.name;
  document.getElementById('lb-desc').textContent = d.desc;
  
  const metricsEl = document.getElementById('lb-metrics');
  if (metricsEl) {
    metricsEl.innerHTML = d.metrics.map(m => `
      <div class="lbm">
        <div class="lbm-l">${m.l}</div>
        <div class="lbm-v">${m.v}</div>
      </div>
    `).join('');
  }
  
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('hidden');
  if (lbVideo) lbVideo.pause();
  document.body.style.overflow = '';
}

// Lightbox video controls
if (lbVideo) {
  lbVideo.addEventListener('timeupdate', () => {
    const cur = lbVideo.currentTime || 0;
    const dur = lbVideo.duration || 10;
    const pct = (cur / dur) * 100;
    if (lbVfill) lbVfill.style.width = pct + '%';
    if (lbVtime) {
      const cSec = Math.floor(cur);
      const dSec = Math.floor(dur);
      lbVtime.textContent = `00:${String(cSec).padStart(2,'0')} / 00:${String(dSec).padStart(2,'0')}`;
    }
  });
}

if (lbPlayToggle) {
  lbPlayToggle.addEventListener('click', () => {
    if (!lbVideo) return;
    if (lbVideo.paused) {
      lbVideo.play().catch(() => {});
      lbPlayToggle.textContent = '⏸ Pause';
    } else {
      lbVideo.pause();
      lbPlayToggle.textContent = '▶ Play';
    }
    soundClick();
  });
}

if (lbMuteToggle) {
  lbMuteToggle.addEventListener('click', () => {
    if (!lbVideo) return;
    lbVideo.muted = !lbVideo.muted;
    lbMuteToggle.textContent = lbVideo.muted ? '🔇 Muted' : '🔊 Sound';
    soundClick();
  });
}

document.querySelectorAll('.cc-play').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const idx = parseInt(btn.dataset.index, 10);
    openLightbox(idx);
  });
});

document.querySelectorAll('.clip-card').forEach((card, i) => {
  card.addEventListener('click', () => {
    openLightbox(i);
  });
});

const lbClose = document.getElementById('lb-close');
const lbX = document.getElementById('lb-x');
if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbX) lbX.addEventListener('click', closeLightbox);

const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
if (lbPrev) {
  lbPrev.addEventListener('click', () => {
    currentClip = (currentClip - 1 + lightboxData.length) % lightboxData.length;
    openLightbox(currentClip);
  });
}
if (lbNext) {
  lbNext.addEventListener('click', () => {
    currentClip = (currentClip + 1) % lightboxData.length;
    openLightbox(currentClip);
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && !document.getElementById('lightbox')?.classList.contains('hidden')) {
    if (lbPrev) lbPrev.click();
  }
  if (e.key === 'ArrowRight' && !document.getElementById('lightbox')?.classList.contains('hidden')) {
    if (lbNext) lbNext.click();
  }
});

/* ═══ 3D CARD TILT ON SAMPLES & MODELS ═══ */
document.querySelectorAll('.clip-card, .mc, .stat').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - .5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - .5) * 12;
    card.style.transform = `translateY(-8px) rotateX(${-y}deg) rotateY(${x}deg) perspective(800px)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

/* ═══ ROBOT OPERATING MODE CONTROLLER (LIVE ROBOT) ═══ */
const modeBtns = document.querySelectorAll('.rmb-btn');
const svgRobot = document.getElementById('svg-robot');
const hudRobotName = document.getElementById('hud-robot-name');
const hudThreat = document.getElementById('hud-threat');
const hudCpu = document.getElementById('hud-cpu');
const hudTemp = document.getElementById('hud-temp');
const hudPwr = document.getElementById('hud-pwr');

const barCog = document.getElementById('bar-cog');
const barEm = document.getElementById('bar-em');
const barMot = document.getElementById('bar-mot');
const barRef = document.getElementById('bar-ref');

const txtCog = document.getElementById('txt-cog');
const txtEm = document.getElementById('txt-em');
const txtMot = document.getElementById('txt-mot');
const txtRef = document.getElementById('txt-ref');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    
    soundAlert();
    
    document.body.dataset.mode = mode;
    
    if (svgRobot) {
      svgRobot.classList.remove('mode-combat', 'mode-stealth', 'mode-overdrive');
      if (mode !== 'standard') svgRobot.classList.add(`mode-${mode}`);
    }
    
    if (mode === 'combat') {
      if (hudRobotName) hudRobotName.textContent = 'ZENOVO ROBOTIC NOVA-1 // DYNAMIC OBSTACLE VAULT';
      if (hudThreat) { hudThreat.textContent = 'VAULT HEIGHT: 1.4m'; hudThreat.className = 'lrp-v r'; }
      if (hudCpu) hudCpu.textContent = '1,000 Hz MPC';
      if (hudTemp) hudTemp.textContent = '41.2°C (ACTUATORS)';
      if (hudPwr) hudPwr.textContent = '320 N·m PEAK TORQUE';
      if (barCog) barCog.style.width = '99%'; if (txtCog) txtCog.textContent = '99%';
      if (barRef) barRef.style.width = '100%'; if (txtRef) txtRef.textContent = '0.001s';
    } else if (mode === 'stealth') {
      if (hudRobotName) hudRobotName.textContent = 'ZENOVO ROBOTIC NOVA-1 // TACTILE MANIPULATION';
      if (hudThreat) { hudThreat.textContent = 'SUB-MM: ±0.01mm'; hudThreat.className = 'lrp-v g'; }
      if (hudCpu) hudCpu.textContent = '256 SENSORS/FINGER';
      if (hudTemp) hudTemp.textContent = '28.4°C';
      if (hudPwr) hudPwr.textContent = '450 N GRIP FORCE';
      if (barCog) barCog.style.width = '98%'; if (txtCog) txtCog.textContent = '98%';
      if (barRef) barRef.style.width = '96%'; if (txtRef) txtRef.textContent = '96%';
    } else if (mode === 'overdrive') {
      if (hudRobotName) hudRobotName.textContent = 'ZENOVO ROBOTIC NOVA-1 // HIGH-SPEED SPRINT';
      if (hudThreat) { hudThreat.textContent = 'VELOCITY: 2.4 m/s'; hudThreat.className = 'lrp-v p'; }
      if (hudCpu) hudCpu.textContent = 'DYNAMIC STRIDE 1.2m';
      if (hudTemp) hudTemp.textContent = '52.0°C (LIQUID LOOP)';
      if (hudPwr) hudPwr.textContent = '100% DISCHARGE';
      if (barCog) barCog.style.width = '100%'; if (txtCog) txtCog.textContent = '100%';
      if (barRef) barRef.style.width = '100%'; if (txtRef) txtRef.textContent = 'MAX';
    } else {
      if (hudRobotName) hudRobotName.textContent = 'ZENOVO ROBOTIC NOVA-1 // STANDARD GAIT';
      if (hudThreat) { hudThreat.textContent = 'EQUILIBRIUM: NOMINAL'; hudThreat.className = 'lrp-v g'; }
      if (hudCpu) hudCpu.textContent = '500 Hz KINEMATICS';
      if (hudTemp) hudTemp.textContent = '32.1°C';
      if (hudPwr) hudPwr.textContent = '89% CHARGE';
      if (barCog) barCog.style.width = '94%'; if (txtCog) txtCog.textContent = '94%';
      if (barRef) barRef.style.width = '91%'; if (txtRef) txtRef.textContent = '91%';
    }
  });
});

/* ═══ INTERACTIVE AI COMMAND TERMINAL ═══ */
const termScreen = document.getElementById('term-screen');
const termInput = document.getElementById('term-input');
const termSendBtn = document.getElementById('term-send-btn');
const quickBtns = document.querySelectorAll('.tqb');

function addTermLine(html) {
  if (!termScreen) return;
  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = html;
  termScreen.appendChild(line);
  termScreen.scrollTop = termScreen.scrollHeight;
}

function executeCommand(rawCmd) {
  if (!rawCmd) return;
  const cmd = rawCmd.trim().toUpperCase();
  addTermLine(`<span class="prompt">zenovo@core:~$</span> ${rawCmd}`);
  
  soundClick();
  
  if (cmd === 'HELP') {
    addTermLine(`<span class="sys">[COMMAND LIST]</span> DIAGNOSE, OVERCLOCK, SCAN, COMBAT, ROBOTS, STATUS, CLEAR, HELP`);
  } else if (cmd === 'DIAGNOSE' || cmd === 'RUN DIAGNOSTICS') {
    addTermLine(`<span class="sys">[DIAGNOSTICS]</span> Running automated quantum core audit...`);
    setTimeout(() => {
      addTermLine(`<span class="res">✓ Biomechanical Actuators: 100% HEALTHY</span>`);
      addTermLine(`<span class="res">✓ ZenCore 9.2 Synapses: 2.84 Trillion Nominal</span>`);
      addTermLine(`<span class="res">✓ Global Swarm Mesh Latency: 0.04ms</span>`);
      soundAlert();
    }, 300);
  } else if (cmd === 'OVERCLOCK' || cmd === 'OVERCLOCK CORE') {
    addTermLine(`<span class="sys">[OVERCLOCK]</span> Increasing bus frequency to 4.95 THz... Core overclocked!`);
    const odBtn = document.querySelector('.rmb-btn[data-mode="overdrive"]');
    if (odBtn) odBtn.click();
  } else if (cmd === 'SCAN' || cmd === 'SCAN_SWARM' || cmd === 'SCAN SWARM UNITS') {
    addTermLine(`<span class="sys">[SWARM RADAR]</span> Scanning 68 country sectors...`);
    setTimeout(() => {
      addTermLine(`<span class="res">✓ North America: 42,190 Zenovo Robotic Units Active</span>`);
      addTermLine(`<span class="res">✓ Europe / UK: 38,400 Zenovo Robotic Units Active</span>`);
      addTermLine(`<span class="res">✓ Asia-Pacific: 41,200 Zenovo Robotic Units Active</span>`);
      addTermLine(`<span class="res">✓ Orbital / Deep Sea: 8,692 Zenovo Robotic Units Active</span>`);
      soundWhoosh();
    }, 250);
  } else if (cmd === 'ACTION' || cmd === 'ACTION CLIP' || cmd === 'ACTION_CLIP' || cmd === 'BATTLE') {
    addTermLine(`<span class="sys">[ACTION MATRIX]</span> Initializing 10-Second High-Octane Robot Action Feed...`);
    const actionSec = document.getElementById('action-clip');
    if (actionSec) actionSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (actionVid) {
      setTimeout(() => {
        actionVid.currentTime = 0;
        actionVid.play().catch(() => {});
        updateActionUI();
      }, 500);
    }
    soundAlert();
  } else if (cmd === 'ENGAGE_COMBAT' || cmd === 'COMBAT') {
    addTermLine(`<span class="err">⚠ WARNING: ENGAGING DEFENSE COMBAT MATRIX // SHIELDS ARMED</span>`);
    const cbBtn = document.querySelector('.rmb-btn[data-mode="combat"]');
    if (cbBtn) cbBtn.click();
  } else if (cmd === 'ROBOTS' || cmd === 'MODELS') {
    addTermLine(`<span class="sys">[ZENOVO ROBOTIC FLEET]</span>`);
    addTermLine(`• Zenovo Robotic Volt-X (Plasma Combat)`);
    addTermLine(`• Zenovo Robotic Titan-X (Siege Battle Mech)`);
    addTermLine(`• Zenovo Robotic Aura-S (Zero-G Space AI)`);
    addTermLine(`• Zenovo Robotic Titan-IV (Mega Constructor)`);
    addTermLine(`• Zenovo Robotic Nano-Core (Quantum Swarm)`);
    addTermLine(`• Zenovo Robotic Deep-7 (Ocean Explorer)`);
    addTermLine(`• Zenovo Robotic Prime-X (Flagship Humanoid)`);
    addTermLine(`• Zenovo Robotic Atlas-7 (Industrial Titan)`);
    addTermLine(`• Zenovo Robotic Nova-1 (Humanoid AI)`);
    addTermLine(`• Zenovo Robotic Swift-S (Expedition Scout)`);
  } else if (cmd === 'STATUS') {
    addTermLine(`<span class="sys">[STATUS]</span> System: NOMINAL | Defcon: LEVEL 5 | Active: 130,482 Units | Battery: 99.8%`);
  } else if (cmd === 'CLEAR') {
    if (termScreen) termScreen.innerHTML = '';
  } else {
    addTermLine(`<span class="err">Command not recognized: '${rawCmd}'. Type HELP for commands.</span>`);
  }
}

if (termSendBtn && termInput) {
  termSendBtn.addEventListener('click', () => {
    executeCommand(termInput.value);
    termInput.value = '';
  });
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      executeCommand(termInput.value);
      termInput.value = '';
    }
  });
}

quickBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    executeCommand(btn.dataset.cmd);
  });
});

/* ═══ CONTACT FORM HANDLER ═══ */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Encrypting &amp; Transmitting...</span>';
    btn.disabled = true;
    btn.style.opacity = '.7';
    soundWhoosh();
    
    setTimeout(() => {
      soundAlert();
      btn.innerHTML = '<span>✓ Mission Parameters Received!</span>';
      btn.style.background = 'linear-gradient(135deg,#00ff88,#00c678)';
      btn.style.boxShadow = '0 0 30px rgba(0,255,136,.5)';
      const ok = document.getElementById('form-ok');
      if (ok) ok.style.display = 'block';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.boxShadow = '';
        if (ok) ok.style.display = 'none';
      }, 5000);
    }, 1800);
  });
}

/* ═══ CONSOLE EASTER EGG ═══ */
console.log('%c⚡ ZENOVO ROBOTIC SYSTEMS — DEFENSE PROTOCOL ONLINE', 'color:#00f0ff;font-family:Orbitron,monospace;font-size:16px;font-weight:900;text-shadow:0 0 12px #00f0ff');
console.log('%cZenCore AI v9.2.4 | Quantum Mesh Active across 68 nations.', 'color:#7b2fff;font-family:monospace;font-size:12px');
console.log('%cAll 10 Zenovo Robotic platforms verified and synchronized.', 'color:#00ff88;font-family:monospace;font-size:11px');
