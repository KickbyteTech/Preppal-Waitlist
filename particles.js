// Lightweight particle background script
// - No external deps
// - Particles only (no connection lines)
// - Responsive and high-DPI aware
// - Pauses when tab is hidden for performance
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  // Particle configuration (tweak for performance/appearance)
  const config = {
    particleColor: 'rgba(34,211,238,0.65)',
    backgroundColor: null,
    maxParticles: 90, // base count
    particleSize: { min: 0.8, max: 2.0 },
    speed: 0.22, // px per frame (will be multiplied)
  };

  let particles = [];
  let running = true;

  function setSize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    width = Math.max(300, window.innerWidth);
    height = Math.max(300, window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Recreate particles proportional to area
    const area = (width * height) / (1280 * 720);
    const target = Math.round(config.maxParticles * Math.min(Math.max(area, 0.5), 2));
    initParticles(target);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-config.speed, config.speed),
        vy: rand(-config.speed, config.speed),
        r: rand(config.particleSize.min, config.particleSize.max),
        alpha: rand(0.12, 0.45),
      });
    }
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    // draw particles only (no connecting lines)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // move
      p.x += p.vx * dpr;
      p.y += p.vy * dpr;

      // wrap around if out of bounds
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // draw
      ctx.beginPath();
      ctx.fillStyle = `rgba(34,211,238,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  // Visibility handling
  function handleVisibility() {
    if (document.hidden) {
      running = false;
    } else {
      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }
  }

  // Throttle resize
  let resizeTimer = null;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSize, 150);
  }

  // Init
  setSize();
  requestAnimationFrame(step);
  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibility);

  // Expose a simple API to tweak if needed
  window.__PrepPalParticles = {
    setSpeed(s) { config.speed = s; },
    setMaxParticles(n) { config.maxParticles = n; setSize(); },
    stop() { running = false; },
    start() { if (!running) { running = true; requestAnimationFrame(step); } }
  };
})();
