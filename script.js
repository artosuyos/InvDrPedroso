// Standalone Premium Cinematic Best Woman Invitation script

// Initialize Lucide Icons on load
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Check if already accepted on load
  const cachedState = localStorage.getItem('art_invite_dr_pedroso');
  if (cachedState === 'accepted') {
    setAcceptedState(true);
  }

  // Interactive Clickable "Yes" text glow explosion trigger
  const yesBtn = document.getElementById('yes-glow-btn');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // Play chime sound
      playCathedralChime();
      
      // Spawn 100 glowing lights and 100 rose petals in the center of the clicked "YES" word
      const rect = yesBtn.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      
      // Spawn 100 lights on the overlay canvas
      for (let i = 0; i < 100; i++) {
        overlayParticles.push(new SealLightParticle(startX, startY));
      }
      
      // Spawn 100 rose petals on the overlay canvas
      for (let i = 0; i < 100; i++) {
        overlayParticles.push(new SealPetalParticle(startX, startY));
      }
    });
  }
});

// 1. DYNAMIC LOADER SCREEN & CINEMATIC ENVELOPE REVEAL
const loaderScreen = document.getElementById('loader-screen');
const mainContent  = document.getElementById('main-content');
const envelopeContainer = document.getElementById('envelope-container');
const envelopeWrapper = document.getElementById('envelope-wrapper');


// Continuous background golden particles for the envelope scene
let envelopeAmbientAnimationId = null;

function startEnvelopeAmbientParticles() {
  const canvas = document.getElementById('envelope-ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  const particles = [];
  const particleCount = 55;

  class GoldDust {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // distribute initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.0 + 0.8;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = -(Math.random() * 0.5 + 0.25);
      this.opacity = Math.random() * 0.6 + 0.2;
      this.maxOpacity = this.opacity;
      this.oscillationSpeed = Math.random() * 0.015 + 0.005;
      this.oscillationOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.4;

      // fade out near top
      if (this.y < height * 0.2) {
        this.opacity = Math.max(0, this.maxOpacity * (this.y / (height * 0.2)));
      }

      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
      grad.addColorStop(0, `rgba(255, 235, 180, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(229, 192, 96, ${this.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(229, 192, 96, 0)');
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldDust());
  }

  canvas.particlesList = particles;

  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    canvas.particlesList = canvas.particlesList.filter(p => !p.shouldRemove);
    canvas.particlesList.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    envelopeAmbientAnimationId = requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // Expose cleanups
  canvas.stopParticles = () => {
    window.removeEventListener('resize', handleResize);
    if (envelopeAmbientAnimationId) {
      cancelAnimationFrame(envelopeAmbientAnimationId);
      envelopeAmbientAnimationId = null;
    }
  };
}

function stopEnvelopeAmbientParticles() {
  const canvas = document.getElementById('envelope-ambient-canvas');
  if (canvas && typeof canvas.stopParticles === 'function') {
    canvas.stopParticles();
  }
}

let envelopeAnimationStarted = false;
let envelopeOpened = false;

function playEnvelopeRevealTimeline() {
  if (envelopeAnimationStarted) return;
  envelopeAnimationStarted = true;

  // Scene 2 — Force play GIF from frame 0 immediately as soon as envelope container loads
  const gifElement = document.getElementById('intro-gif-element');
  if (gifElement) {
    gifElement.src = 'assets/EnvelopeGIF1.webp';
  }

  // Play cathedral chime immediately as envelope starts opening
  playCathedralChime();
}

function proceedToMainPage() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // Immediately fade out the envelope wrapper so it disappears first
  if (envelopeWrapper) {
    envelopeWrapper.style.transition = 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    envelopeWrapper.style.opacity = '0';
    envelopeWrapper.style.transform = 'scale(0.9) translateY(20px)';
    envelopeWrapper.style.pointerEvents = 'none';
  }

  // Immediately fade out the click prompt below the envelope
  const clickPrompt = document.getElementById('envelope-click-prompt');
  if (clickPrompt) {
    clickPrompt.style.transition = 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    clickPrompt.style.opacity = '0';
    clickPrompt.style.transform = 'translate(-50%, 20px)';
    clickPrompt.style.pointerEvents = 'none';
  }

  // Allow the 100 lights and 100 petals to expand, sway, and dissolve against the dark container backdrop.
  // Then, fade out the background container at 2.8s
  setTimeout(() => {
    if (envelopeContainer) {
      envelopeContainer.style.opacity = '0';
    }
    stopEnvelopeAmbientParticles();
  }, 2800);

  // Scene 8 — Main Page Entrance (completely revealed after 3.8s)
  setTimeout(() => {
    if (envelopeContainer) {
      envelopeContainer.style.display = 'none';
    }
    if (mainContent) {
      mainContent.style.opacity = '1';
    }
    
    // Start main page ambient particles
    startMainPageAmbientParticles();
    
    // Start music & transitions
    startMusicAfterLoader();
    initScrollAnimations();
    startContinuousPetals();
  }, 3800);
}

// Preloader Done
setTimeout(() => {
  // Scene 1 — Loading Complete
  if (loaderScreen) {
    loaderScreen.style.transition = 'opacity 1.2s cubic-bezier(0.85, 0, 0.15, 1), visibility 1.2s';
    loaderScreen.style.opacity    = '0';
    loaderScreen.style.visibility = 'hidden';
  }

  // Scene 2 — Envelope Entrance (wait 0.5s)
  if (envelopeContainer) {
    envelopeContainer.style.display = 'flex';
    setTimeout(() => {
      envelopeContainer.classList.add('active');
      startEnvelopeAmbientParticles();
      setTimeout(() => {
        if (envelopeWrapper) {
          envelopeWrapper.classList.add('visible');
        }
        const clickPrompt = document.getElementById('envelope-click-prompt');
        if (clickPrompt) {
          clickPrompt.style.opacity = '1';
          clickPrompt.style.transform = 'translate(-50%, 0)';
        }
        // Auto-play the envelope opening GIF immediately as it loads
        playEnvelopeRevealTimeline();
      }, 50);
    }, 450);
  }

}, 3800);

// Custom glowing light particle class for envelope burst (enhanced visibility)
class EnvelopeLightParticle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = Math.random() * 10 + 5; // Sized between 5px and 15px
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6; // Wider radial velocity (6 to 18)
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.opacity = 1.0;
    this.fadeSpeed = Math.random() * 0.005 + 0.005; // Fades out slowly (lasts longer)
    this.shouldRemove = false;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.95;
    this.speedY *= 0.95;
    this.opacity -= this.fadeSpeed;
    if (this.opacity <= 0) {
      this.shouldRemove = true;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3.0); // Wider radial bloom
    grad.addColorStop(0, `rgba(255, 235, 180, ${this.opacity})`);
    grad.addColorStop(0.3, `rgba(229, 192, 96, ${this.opacity * 0.9})`);
    grad.addColorStop(1, 'rgba(229, 192, 96, 0)');
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.size * 3.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Custom rose petal particle class for envelope burst (enhanced visibility)
class EnvelopePetalParticle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = Math.random() * 12 + 8; // Sized between 8px and 20px (larger petals)
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4.5; // Wider velocity (4.5 to 13.5)
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed - 2.5; // Stronger initial upward arch velocity
    this.opacity = Math.random() * 0.3 + 0.7;
    this.fadeSpeed = Math.random() * 0.004 + 0.004; // Slower fade out
    this.shouldRemove = false;
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = Math.random() * 0.03 - 0.015;
    
    const colors = [
      { r: 128, g: 15, b: 47 },   // Burgundy vibrant
      { r: 92, g: 11, b: 26 },    // Burgundy warm
      { r: 163, g: 32, b: 59 },   // Velvet rose crimson
      { r: 194, g: 54, b: 86 }    // Soft luxury crimson rose
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.4;
    this.y += this.speedY;
    this.speedX *= 0.95;
    this.speedY = this.speedY * 0.95 + 0.12; // Gravity pull down
    this.angle += this.spinSpeed;
    this.opacity -= this.fadeSpeed;
    if (this.opacity <= 0) {
      this.shouldRemove = true;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    const scaleX = Math.cos(this.y * 0.01 + this.swayOffset);
    ctx.scale(scaleX, 1);
    ctx.beginPath();
    const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
    grad.addColorStop(0, `rgba(${this.colorBase.r + 30}, ${this.colorBase.g + 20}, ${this.colorBase.b + 15}, ${this.opacity})`);
    grad.addColorStop(0.5, `rgba(${this.colorBase.r}, ${this.colorBase.g}, ${this.colorBase.b}, ${this.opacity})`);
    grad.addColorStop(1, `rgba(${this.colorBase.r - 20}, ${this.colorBase.g - 5}, ${this.colorBase.b - 5}, ${this.opacity * 0.8})`);
    ctx.fillStyle = grad;
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(this.size * 1.3, -this.size * 1.3, this.size * 1.4, this.size * 0.6, 0, this.size * 1.4);
    ctx.bezierCurveTo(-this.size * 1.4, this.size * 0.6, -this.size * 1.3, -this.size * 1.3, 0, -this.size);
    ctx.fill();
    ctx.strokeStyle = `rgba(229, 192, 96, ${this.opacity * 0.25})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.restore();
  }
}

// Interactive Click to Open Envelope Trigger
const initEnvelopeClickTrigger = () => {
  const wrapper = document.getElementById('envelope-wrapper');
  const clickPrompt = document.getElementById('envelope-click-prompt');
  
  const triggerReveal = () => {
    if (envelopeOpened) return;
    
    // Play cathedral chime immediately on click (matching the Tap to Seal chime)
    playCathedralChime();
    
    // Spawn massive burst of petals and golden lights radiating from the clicked envelope center
    const canvas = document.getElementById('envelope-ambient-canvas');
    if (canvas && canvas.particlesList) {
      const rect = wrapper ? wrapper.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      
      // Spawn 100 glowing lights radiating from behind the envelope
      for (let i = 0; i < 100; i++) {
        canvas.particlesList.push(new EnvelopeLightParticle(startX, startY));
      }
      // Spawn 100 fluttering rose petals radiating from behind the envelope
      for (let i = 0; i < 100; i++) {
        canvas.particlesList.push(new EnvelopePetalParticle(startX, startY));
      }
    }
    
    // Proceed to the main page immediately
    proceedToMainPage();
  };

  if (wrapper) {
    wrapper.addEventListener('click', triggerReveal);
  }
  if (clickPrompt) {
    clickPrompt.addEventListener('click', triggerReveal);
  }
};

// Initialize the click handler on load
document.addEventListener('DOMContentLoaded', initEnvelopeClickTrigger);

// 2. BACKGROUND MUSIC ENGINE
(function initMusicEngine() {
  const bgMusic = document.getElementById('bg-music-element');
  if (!bgMusic) return;

  bgMusic.volume = 0;
  bgMusic.muted  = false;
  bgMusic.loop   = true;

  let musicStarted = false;

  // Fade-in helper
  const fadeIn = () => {
    let vol = 0;
    bgMusic.volume = 0;
    const iv = setInterval(() => {
      vol = Math.min(vol + 0.015, 0.45);
      bgMusic.volume = vol;
      if (vol >= 0.45) clearInterval(iv);
    }, 80);
  };

  const startMusic = () => {
    if (musicStarted) return;
    bgMusic.muted = false;
    const p = bgMusic.play();
    if (p !== undefined) {
      p.then(() => {
        musicStarted = true;
        fadeIn();
      }).catch(() => {
        // Autoplay blocked — music will start on first user gesture
      });
    }
  };

  // Any user gesture triggers music start
  const onGesture = () => { if (!musicStarted) startMusic(); };
  ['click','touchstart','pointerdown','keydown'].forEach(e => {
    window.addEventListener(e, onGesture, { passive: true });
  });

  // Attempt immediate autoplay as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMusic);
  } else {
    startMusic();
  }

  // Expose for external use
  window.startMusicAfterLoader = startMusic;
})();



// 3. CANVAS BOKEH & CINEMATIC PETALS ENGINE
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
let acceptedState = false;

// Overlay canvas for front-facing explosion particles (drawn on top of all content cards)
const overlayCanvas = document.getElementById('overlay-canvas');
const overlayCtx = overlayCanvas ? overlayCanvas.getContext('2d') : null;
let overlayParticles = [];
let overlayWidth = overlayCanvas ? (overlayCanvas.width = window.innerWidth) : window.innerWidth;
let overlayHeight = overlayCanvas ? (overlayCanvas.height = window.innerHeight) : window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  if (overlayCanvas) {
    overlayWidth = overlayCanvas.width = window.innerWidth;
    overlayHeight = overlayCanvas.height = window.innerHeight;
  }
});

// Original Bokeh background particles
class Particle {
  constructor(isCelebration = false) {
    this.isCelebration = isCelebration;
    this.isPetal = false;
    this.isFadingOut = false;
    this.shouldRemove = false;
    this.reset(isCelebration);
    if (isCelebration) {
      this.y = Math.random() * -height;
    }
  }

  reset(isCelebration = false) {
    this.isCelebration = isCelebration;
    this.x = Math.random() * width;
    this.y = isCelebration ? Math.random() * -50 : Math.random() * height;
    this.size = Math.random() * (isCelebration ? 4 : 10) + 2.5; // Increased size range
    this.speedX = Math.random() * 0.4 - 0.2 + (isCelebration ? (Math.random() * 1.5 - 0.75) : 0);
    this.speedY = isCelebration ? (Math.random() * 2 + 1.5) : (Math.random() * 0.3 + 0.1);
    this.opacity = Math.random() * 0.55 + 0.25; // Increased opacity range for high visibility
    this.maxOpacity = this.opacity;
    this.color = isCelebration 
      ? `hsla(${Math.random() * 15 + 40}, 100%, 65%, ${this.opacity})` // Glowing golden sparkles
      : `rgba(212, 175, 55, ${this.opacity})`; // Bokeh motes
    this.spin = Math.random() * 360;
    this.spinSpeed = Math.random() * 2 - 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.spin += this.spinSpeed;

    if (this.isCelebration) {
      this.speedX *= 0.99;
    } else {
      this.x += Math.sin(this.y * 0.005) * 0.05;
    }

    if (this.isFadingOut) {
      this.opacity -= 0.006; // Slow gradual fadeout
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.shouldRemove = true;
      }
    }

    if (this.y > height + 20) {
      if (this.isCelebration) {
        this.shouldRemove = true;
      } else {
        this.reset(this.isCelebration);
      }
    }
    if (this.x < -20 || this.x > width + 20) {
      if (this.isCelebration) {
        this.shouldRemove = true;
      } else {
        this.x = Math.random() * width;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    if (this.isCelebration) {
      ctx.translate(this.x, this.y);
      ctx.rotate((this.spin * Math.PI) / 180);
      ctx.fillStyle = `hsla(45, 100%, 65%, ${this.opacity})`;
      ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
    } else {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(212, 175, 55, ${this.opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Cinematic Falling Petals Class
class Petal {
  constructor(isCelebration = false) {
    this.isCelebration = isCelebration;
    this.isPetal = true;
    this.isFadingOut = false;
    this.shouldRemove = false;
    this.reset();
    // Scatter them vertically across the entire height of the viewport initially
    this.y = Math.random() * -height;
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -100 - 20;
    this.size = Math.random() * 12 + 8; // Beautiful premium petal size
    this.speedX = Math.random() * 1.5 - 0.75; // Initial wind drift
    this.speedY = Math.random() * 1.5 + 1.2;  // Falling speed
    this.opacity = Math.random() * 0.4 + 0.6; // High quality rich visibility
    
    // Smooth natural swaying
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
    
    // Spin parameters
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = Math.random() * 0.02 - 0.01;
    
    // Curated rich velvet rose colors for Dr. Pedroso's luxury invitation theme
    const colors = [
      { r: 128, g: 15, b: 47 },   // Burgundy vibrant
      { r: 92, g: 11, b: 26 },    // Burgundy warm
      { r: 61, g: 5, b: 16 },     // Burgundy deep
      { r: 163, g: 32, b: 59 },   // Velvet rose crimson
      { r: 194, g: 54, b: 86 }    // Soft luxury crimson rose
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.6;
    this.angle += this.spinSpeed;

    if (this.isFadingOut) {
      this.opacity -= 0.004; // Super gradual, cinematic dissolve for petals
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.shouldRemove = true;
      }
    }

    if (this.y > height + 20) {
      if (this.isCelebration) {
        this.shouldRemove = true;
      } else {
        this.reset();
      }
    }
    if (this.x < -20 || this.x > width + 20) {
      if (this.isCelebration) {
        this.shouldRemove = true;
      } else {
        this.reset();
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Simulate realistic 3D folding and fluttering by scaling the X axis
    const scaleX = Math.cos(this.y * 0.01 + this.swayOffset);
    ctx.scale(scaleX, 1);

    ctx.beginPath();
    
    // Gorgeous premium gradient drawing for organic depth
    const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
    grad.addColorStop(0, `rgba(${this.colorBase.r + 30}, ${this.colorBase.g + 20}, ${this.colorBase.b + 15}, ${this.opacity})`);
    grad.addColorStop(0.5, `rgba(${this.colorBase.r}, ${this.colorBase.g}, ${this.colorBase.b}, ${this.opacity})`);
    grad.addColorStop(1, `rgba(${this.colorBase.r - 20}, ${this.colorBase.g - 5}, ${this.colorBase.b - 5}, ${this.opacity * 0.8})`);
    
    ctx.fillStyle = grad;
    
    // Draw organic curved petal shape
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(this.size * 1.3, -this.size * 1.3, this.size * 1.4, this.size * 0.6, 0, this.size * 1.4);
    ctx.bezierCurveTo(-this.size * 1.4, this.size * 0.6, -this.size * 1.3, -this.size * 1.3, 0, -this.size);
    ctx.fill();

    // Subtle edge highlight (soft gold/rose) for high premium luxury look
    ctx.strokeStyle = `rgba(229, 192, 96, ${this.opacity * 0.25})`; // Soft gold edge highlight
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  }
}

// Regular bokeh floating dust motes initialization
const startMainPageAmbientParticles = () => {
  const particleCount = Math.min(100, Math.floor((width * height) / 18000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(false));
  }
};

const animateParticles = () => {
  ctx.clearRect(0, 0, width, height);
  
  // Filter out completed fadeout celebration elements
  particles = particles.filter(p => !p.shouldRemove);
  
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
};
animateParticles();

// Overlay particles animation loop for front-facing explosions
const animateOverlayParticles = () => {
  if (!overlayCtx) return;
  overlayCtx.clearRect(0, 0, overlayWidth, overlayHeight);
  
  overlayParticles = overlayParticles.filter(p => !p.shouldRemove);
  
  overlayParticles.forEach((p) => {
    p.update();
    p.draw(overlayCtx);
  });
  requestAnimationFrame(animateOverlayParticles);
};
animateOverlayParticles();

const startCelebrationConfetti = () => {
  const confettiCount = 80;
  const petalCount = 80;
  const celebrationConfetti = [];
  
  for (let i = 0; i < confettiCount; i++) {
    celebrationConfetti.push(new Particle(true));
  }
  for (let i = 0; i < petalCount; i++) {
    celebrationConfetti.push(new Petal(true));
  }
  
  particles = [...particles, ...celebrationConfetti];

  // Initiate slow, gradual fading after 9 seconds, letting them gracefully fall off & dissolve
  setTimeout(() => {
    particles.forEach(p => {
      if (p.isCelebration) {
        p.isFadingOut = true;
      }
    });
  }, 9000);
};

const startContinuousPetals = () => {
  const petalCount = 30; // elegant and not too crowded
  const continuousPetals = [];
  for (let i = 0; i < petalCount; i++) {
    continuousPetals.push(new Petal(false));
  }
  particles = [...particles, ...continuousPetals];
};

// 4. ELASTIC 3D MOUSE PARALLAX ON COVER GRAPHICS
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const ease = 0.08;

window.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
  targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
});

const animateParallax = () => {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  const topRoses = document.getElementById('parallax-top-left');
  const bottomRoses = document.getElementById('parallax-bottom-right');

  if (topRoses && bottomRoses) {
    topRoses.style.transform = `translate3d(${currentX * -25}px, ${currentY * -25}px, 0)`;
    bottomRoses.style.transform = `translate3d(${currentX * 30}px, ${currentY * 30}px, 0)`;
  }

  requestAnimationFrame(animateParallax);
};
animateParallax();

// 5. GSAP SCROLL REVEALS
const initScrollAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Stagger entry of Hero content on load
  gsap.fromTo('#hero-content', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1.6, ease: 'power4.out', delay: 0.2 }
  );

  // Fade and slide message envelope panel
  gsap.from('#message-section .glass-panel', {
    scrollTrigger: {
      trigger: '#message-section',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: 'power3.out'
  });


  // Stagger Memories section cards (if present)
  if (document.getElementById('memories-section')) {
    gsap.from('#memories-section .memory-card', {
      scrollTrigger: {
        trigger: '#memories-section',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      stagger: 0.12,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  // Stagger Wedding details cards
  gsap.from('#wedding-section .big-day-card', {
    scrollTrigger: {
      trigger: '#wedding-section',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 35,
    stagger: 0.12,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Stagger final climax panel
  gsap.from('#climax-content', {
    scrollTrigger: {
      trigger: '#climax-section',
      start: 'top 65%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: 'power4.out'
  });
};

// 6. CATHEDRAL DOUBLE-CHIME SYNTHESIZER
const playCathedralChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const chimeCtx = new AudioContext();

    const playTone = (freq, delayTime) => {
      const osc = chimeCtx.createOscillator();
      const gainNode = chimeCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, chimeCtx.currentTime + delayTime);

      gainNode.gain.setValueAtTime(0, chimeCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, chimeCtx.currentTime + delayTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, chimeCtx.currentTime + delayTime + 2.5);

      osc.connect(gainNode);
      gainNode.connect(chimeCtx.destination);

      osc.start(chimeCtx.currentTime + delayTime);
      osc.stop(chimeCtx.currentTime + delayTime + 3.0);
    };

    playTone(1318.51, 0);   // E6 bell chord
    playTone(1760.00, 0.3);  // A6 bell chord
  } catch (e) {
    console.warn("Live chime sound synthesis failed", e);
  }
};

// 7. STATE PRESERVATION
const setAcceptedState = (immediate = false) => {
  acceptedState = true;
  
  // Keep the seal interactive prompt visible
  const tapPrompt = document.getElementById('seal-tap-prompt');
  if (tapPrompt) {
    tapPrompt.style.display = 'block';
  }

  // Trigger celebration confetti
  if (!immediate) {
    startCelebrationConfetti();
  } else {
    setTimeout(() => {
      startCelebrationConfetti();
    }, 4500);
  }
};

// Seal Light Particle class for bursting effect (significantly enhanced visibility)
class SealLightParticle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = Math.random() * 8 + 4; // Increased size range (4px to 12px)
    // Radial explosion velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4; // Increased speed (4 to 12) for a wider blast radius
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.opacity = 1.0;
    this.fadeSpeed = Math.random() * 0.007 + 0.007; // Slower fade out (persists longer)
    this.shouldRemove = false;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Friction deceleration
    this.speedX *= 0.96;
    this.speedY *= 0.96;
    this.opacity -= this.fadeSpeed;
    if (this.opacity <= 0) {
      this.shouldRemove = true;
    }
  }
  draw(canvasCtx = ctx) {
    canvasCtx.save();
    canvasCtx.beginPath();
    const grad = canvasCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5); // Wider glow gradient
    grad.addColorStop(0, `rgba(255, 235, 180, ${this.opacity})`);
    grad.addColorStop(0.3, `rgba(229, 192, 96, ${this.opacity * 0.9})`);
    grad.addColorStop(1, 'rgba(229, 192, 96, 0)');
    canvasCtx.fillStyle = grad;
    canvasCtx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    canvasCtx.fill();
    canvasCtx.restore();
  }
}

// Seal Petal Particle class for custom rose petals radiating from the seal
class SealPetalParticle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = Math.random() * 8 + 6; // Sized between 6px and 14px
    
    // Radial explosion velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2.5; 
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed - 1.5; // Slight upward force
    
    this.opacity = Math.random() * 0.3 + 0.7; 
    this.fadeSpeed = Math.random() * 0.007 + 0.007; // Fades out gradually
    this.shouldRemove = false;
    
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = Math.random() * 0.03 - 0.015;
    
    // Velvet rose colors
    const colors = [
      { r: 128, g: 15, b: 47 },   // Burgundy vibrant
      { r: 92, g: 11, b: 26 },    // Burgundy warm
      { r: 163, g: 32, b: 59 },   // Velvet rose crimson
      { r: 194, g: 54, b: 86 }    // Soft luxury crimson rose
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.4;
    this.y += this.speedY;
    
    // Slow down explosion, apply soft gravity drift
    this.speedX *= 0.95;
    this.speedY = this.speedY * 0.95 + 0.12; 
    
    this.angle += this.spinSpeed;
    this.opacity -= this.fadeSpeed;
    
    if (this.opacity <= 0 || this.y > height + 20) {
      this.shouldRemove = true;
    }
  }

  draw(canvasCtx = ctx) {
    canvasCtx.save();
    canvasCtx.translate(this.x, this.y);
    canvasCtx.rotate(this.angle);
    
    // Flutter scale
    const scaleX = Math.cos(this.y * 0.01 + this.swayOffset);
    canvasCtx.scale(scaleX, 1);

    canvasCtx.beginPath();
    const grad = canvasCtx.createLinearGradient(-this.size, -this.size, this.size, this.size);
    grad.addColorStop(0, `rgba(${this.colorBase.r + 30}, ${this.colorBase.g + 20}, ${this.colorBase.b + 15}, ${this.opacity})`);
    grad.addColorStop(0.5, `rgba(${this.colorBase.r}, ${this.colorBase.g}, ${this.colorBase.b}, ${this.opacity})`);
    grad.addColorStop(1, `rgba(${this.colorBase.r - 20}, ${this.colorBase.g - 5}, ${this.colorBase.b - 5}, ${this.opacity * 0.8})`);
    
    canvasCtx.fillStyle = grad;
    
    canvasCtx.moveTo(0, -this.size);
    canvasCtx.bezierCurveTo(this.size * 1.3, -this.size * 1.3, this.size * 1.4, this.size * 0.6, 0, this.size * 1.4);
    canvasCtx.bezierCurveTo(-this.size * 1.4, this.size * 0.6, -this.size * 1.3, -this.size * 1.3, 0, -this.size);
    canvasCtx.fill();

    canvasCtx.strokeStyle = `rgba(229, 192, 96, ${this.opacity * 0.25})`;
    canvasCtx.lineWidth = 0.6;
    canvasCtx.stroke();

    canvasCtx.restore();
  }
}

// Wax Seal Button Click Handler
const waxSealBtn = document.getElementById('wax-seal-btn');
if (waxSealBtn) {
  waxSealBtn.addEventListener('click', () => {
    // Play chime sound
    playCathedralChime();
    
    const rect = waxSealBtn.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    // Spawn dozens of glowing light particles radiating from the seal center on the overlay canvas
    for (let i = 0; i < 50; i++) {
      overlayParticles.push(new SealLightParticle(startX, startY));
    }
    
    // Spawn a few fluttering rose petals radiating from the seal center on the overlay canvas
    for (let i = 0; i < 15; i++) {
      overlayParticles.push(new SealPetalParticle(startX, startY));
    }
    
    // Trigger acceptance state configuration if not already accepted
    if (!acceptedState) {
      setAcceptedState(false);
      localStorage.setItem('art_invite_dr_pedroso', 'accepted');
    }
    
    // Open the thank you modal after a brief delay
    setTimeout(openThankyouModal, 600);
  });
}

// MODAL GLOWING PARTICLES ENGINE
const activeModalParticleLoops = new Map();

function startModalParticles(canvas) {
  if (!canvas) return null;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const resizeObserver = new ResizeObserver(() => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });
  resizeObserver.observe(canvas);

  const particles = [];
  const maxParticles = 25;

  class ModalParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 3.2 + 1.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = -(Math.random() * 0.6 + 0.4);
      this.opacity = Math.random() * 0.5 + 0.4;
      this.maxOpacity = this.opacity;
      this.fadeSpeed = Math.random() * 0.002 + 0.0005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      grad.addColorStop(0, `rgba(255, 235, 180, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(229, 192, 96, ${this.opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(229, 192, 96, 0)');
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new ModalParticle());
  }

  const loop = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(loop);
    activeModalParticleLoops.set(canvas, animationFrameId);
  };
  loop();

  return () => {
    resizeObserver.disconnect();
    cancelAnimationFrame(animationFrameId);
    activeModalParticleLoops.delete(canvas);
    ctx.clearRect(0, 0, width, height);
  };
}

// 9. RECEPTION VENUE MODAL INTERACTION
(function initReceptionModal() {
  const receptionCard = document.getElementById('reception-card');
  const modal = document.getElementById('reception-modal');
  const modalCard = document.getElementById('reception-modal-card');
  const closeBtn = document.getElementById('close-reception-modal');

  if (!receptionCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    // Show modal and reset initial animation states
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Start glowing particles
    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }

    // Animate background overlay fade-in
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Animate modal card scale up & float in
    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    // Fade out overlay and scale down modal card
    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  // Click on the Reception Venue card triggers open
  receptionCard.addEventListener('click', openModal);

  // Click on close button triggers close
  closeBtn.addEventListener('click', closeModal);

  // Click on backdrop (clicking outside modalCard) triggers close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key press triggers close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();

// 9.5 WEDDING DATE MODAL INTERACTION & COUNTDOWN
(function initDateModal() {
  const dateCard = document.getElementById('date-card');
  const modal = document.getElementById('date-modal');
  const modalCard = document.getElementById('date-modal-card');
  const closeBtn = document.getElementById('close-date-modal');

  if (!dateCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    // Show modal and reset initial animation states
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Start glowing particles
    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }

    // Animate background overlay fade-in
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Animate modal card scale up & float in
    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    // Fade out overlay and scale down modal card
    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  // Click on the Date card triggers open
  dateCard.addEventListener('click', openModal);

  // Click on close button triggers close
  closeBtn.addEventListener('click', closeModal);

  // Click on backdrop (clicking outside) triggers close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key press triggers close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Countdown Logic (Target: May 22, 2027 14:00:00)
  const targetDate = new Date('May 22, 2027 14:00:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    if (difference <= 0) {
      setVal('countdown-days', '00');
      setVal('countdown-hours', '00');
      setVal('countdown-mins', '00');
      setVal('countdown-secs', '00');
      setVal('thankyou-countdown-days', '00');
      setVal('thankyou-countdown-hours', '00');
      setVal('thankyou-countdown-mins', '00');
      setVal('thankyou-countdown-secs', '00');
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((difference % (1000 * 60)) / 1000);

    const dStr = days.toString().padStart(2, '0');
    const hStr = hours.toString().padStart(2, '0');
    const mStr = mins.toString().padStart(2, '0');
    const sStr = secs.toString().padStart(2, '0');

    setVal('countdown-days', dStr);
    setVal('countdown-hours', hStr);
    setVal('countdown-mins', mStr);
    setVal('countdown-secs', sStr);
    setVal('thankyou-countdown-days', dStr);
    setVal('thankyou-countdown-hours', hStr);
    setVal('thankyou-countdown-mins', mStr);
    setVal('thankyou-countdown-secs', sStr);
  };

  // Initial update and interval
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// 10. CEREMONY VENUE MODAL INTERACTION
(function initCeremonyModal() {
  const ceremonyCard = document.getElementById('ceremony-card');
  const modal = document.getElementById('ceremony-modal');
  const modalCard = document.getElementById('ceremony-modal-card');
  const closeBtn = document.getElementById('close-ceremony-modal');

  if (!ceremonyCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    // Show modal and reset initial animation states
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Start glowing particles
    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }
    
    // Animate background overlay fade-in
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Animate modal card scale up & float in
    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    // Fade out overlay and scale down modal card
    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  // Click on the Ceremony Venue card triggers open
  ceremonyCard.addEventListener('click', openModal);

  // Click on close button triggers close
  closeBtn.addEventListener('click', closeModal);

  // Click on backdrop (clicking outside modalCard) triggers close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key press triggers close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();

// 11. DRESS CODE MODAL INTERACTION
(function initDressModal() {
  const dressCard = document.getElementById('dress-card');
  const modal = document.getElementById('dress-modal');
  const modalCard = document.getElementById('dress-modal-card');
  const closeBtn = document.getElementById('close-dress-modal');

  if (!dressCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    // Show modal and reset initial animation states
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Start glowing particles
    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }
    
    // Animate background overlay fade-in
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Animate modal card scale up & float in
    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    // Fade out overlay and scale down modal card
    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  // Click on the Dress Theme card triggers open
  dressCard.addEventListener('click', openModal);

  // Click on close button triggers close
  closeBtn.addEventListener('click', closeModal);

  // Click on backdrop (clicking outside modalCard) triggers close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key press triggers close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();

// 10.6 TIME DETAILS MODAL CONTROLLER
(() => {
  const timeCard = document.getElementById('time-card');
  const modal = document.getElementById('time-modal');
  const modalCard = document.getElementById('time-modal-card');
  const closeBtn = document.getElementById('close-time-modal');

  if (!timeCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }
    
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  timeCard.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();

// 10.7 SPECIAL NOTE DETAILS MODAL CONTROLLER
(() => {
  const noteCard = document.getElementById('note-card');
  const modal = document.getElementById('note-modal');
  const modalCard = document.getElementById('note-modal-card');
  const closeBtn = document.getElementById('close-note-modal');

  if (!noteCard || !modal || !modalCard || !closeBtn) return;

  let stopParticles = null;

  const openModal = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const canvas = modalCard.querySelector('.modal-particles');
    if (canvas) {
      stopParticles = startModalParticles(canvas);
    }
    
    gsap.to(modal, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.fromTo(modalCard, 
      { scale: 0.9, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );
  };

  const closeModal = () => {
    if (stopParticles) {
      stopParticles();
      stopParticles = null;
    }

    gsap.to(modal, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
      }
    });

    gsap.to(modalCard, {
      scale: 0.93,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  };

  noteCard.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();

// 10.8 THANK YOU MODAL CONTROLLER (GLOBAL SCOPE)
let thankyouStopParticles = null;

const openThankyouModal = () => {
  const modal = document.getElementById('thankyou-modal');
  const modalCard = document.getElementById('thankyou-modal-card');
  if (!modal || !modalCard) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  const canvas = modalCard.querySelector('.modal-particles');
  if (canvas) {
    thankyouStopParticles = startModalParticles(canvas);
  }
  
  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  });

  gsap.fromTo(modalCard, 
    { scale: 0.9, y: 30, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' }
  );
};

const closeThankyouModal = () => {
  const modal = document.getElementById('thankyou-modal');
  const modalCard = document.getElementById('thankyou-modal-card');
  if (!modal || !modalCard) return;

  if (thankyouStopParticles) {
    thankyouStopParticles();
    thankyouStopParticles = null;
  }

  gsap.to(modal, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete: () => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  });

  gsap.to(modalCard, {
    scale: 0.93,
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut'
  });
};

// Bind Thank You modal events
(() => {
  const closeBtn = document.getElementById('close-thankyou-modal');
  const modal = document.getElementById('thankyou-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeThankyouModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeThankyouModal();
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeThankyouModal();
    }
  });
})();

// 10.9 VENUE PHOTOS LIGHTBOX MODAL CONTROLLER
(function initLightboxModal() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-modal-img');
  const closeBtn = document.getElementById('close-lightbox-modal');
  const triggerImages = document.querySelectorAll('.lightbox-trigger');

  if (!modal || !modalImg || !closeBtn) return;

  const openLightbox = (src) => {
    modalImg.src = src;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // GSAP animations for smooth premium reveal
    gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(modalImg, 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.1)' }
    );
  };

  const closeLightbox = () => {
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modalImg.src = '';
      }
    });
  };

  triggerImages.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'lightbox-modal-overlay') {
      closeLightbox();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLightbox();
    }
  });
})();

