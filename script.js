// Starfield background animation
(function () {
	const canvas = document.getElementById('starfield');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	let width = canvas.width = window.innerWidth;
	let height = canvas.height = window.innerHeight;
	let devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = width * devicePixelRatio;
	canvas.height = height * devicePixelRatio;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';
	ctx.scale(devicePixelRatio, devicePixelRatio);

	const numStars = Math.min(180, Math.floor(width * height / 14000));
	const stars = new Array(numStars).fill(0).map(() => ({
		x: Math.random() * width,
		y: Math.random() * height,
		s: Math.random() * 1.2 + 0.2,
		a: Math.random() * 0.7 + 0.2,
		vx: (Math.random() - 0.5) * 0.02,
		vy: (Math.random() - 0.5) * 0.02
	}));

	function draw() {
		ctx.clearRect(0, 0, width, height);
		for (const star of stars) {
			star.x += star.vx;
			star.y += star.vy;
			if (star.x < -5) star.x = width + 5; if (star.x > width + 5) star.x = -5;
			if (star.y < -5) star.y = height + 5; if (star.y > height + 5) star.y = -5;
			const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 2.2 + star.s * 2);
			glow.addColorStop(0, `rgba(124,245,198,${0.45 * star.a})`);
			glow.addColorStop(1, 'rgba(124,245,198,0)');
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(star.x, star.y, 2 + star.s, 0, Math.PI * 2);
			ctx.fill();
		}
		requestAnimationFrame(draw);
	}
	requestAnimationFrame(draw);

	window.addEventListener('resize', () => {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = width * devicePixelRatio;
		canvas.height = height * devicePixelRatio;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.scale(devicePixelRatio, devicePixelRatio);
	});
})();

// Parallax subtle on scroll for orb/gradient
(function () {
	const orb = document.querySelector('.orb');
	const ring = document.querySelector('.gradient-ring');
	if (!orb || !ring) return;
	window.addEventListener('scroll', () => {
		const y = window.scrollY * 0.05;
		orb.style.transform = `translateY(${y}px)`;
		ring.style.transform = `translateX(-50%) translateY(${y * 0.6}px)`;
	});
})();

// Waitlist form handling
(function () {
	const form = document.getElementById('waitlist-form');
	const emailInput = document.getElementById('email');
	const note = document.getElementById('form-note');
	const year = document.getElementById('year');
	if (year) year.textContent = new Date().getFullYear();
	if (!form || !emailInput || !note) return;

	function isValidEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		note.textContent = '';
		const email = emailInput.value.trim();
		if (!isValidEmail(email)) {
			note.style.color = '#ffb26b';
			note.textContent = 'Please enter a valid email address.';
			return;
		}
		const consent = document.getElementById('consent');
		const payload = { email, consent: !!(consent && consent.checked), source: 'landing-preppal' };
		try {
			// Placeholder: integrate with your Loveable AI/Waitlist backend endpoint here
			await new Promise((res) => setTimeout(res, 600));
			note.style.color = '#7cf5c6';
			note.textContent = 'Thanks! You\'re on the list. We\'ll be in touch soon.';
			form.reset();
		} catch (err) {
			note.style.color = '#ffb26b';
			note.textContent = 'Something went wrong. Please try again later.';
		}
	});
})(); 