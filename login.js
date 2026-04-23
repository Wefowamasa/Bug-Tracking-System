

/* Circuit board background */
(function initCircuit() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({length:80}, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    len:   40 + Math.random() * 120,
    dir:   Math.random() < 0.5 ? 'h' : 'v',
    alpha: 0.04 + Math.random() * 0.09
  }));
  const dots = Array.from({length:30}, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     1.5 + Math.random() * 3,
    alpha: 0.1 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.018 + Math.random() * 0.025
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width * 0.85);
    grad.addColorStop(0, '#041a2e');
    grad.addColorStop(1, '#020d18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lines.forEach(l => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,245,255,${l.alpha})`;
      ctx.lineWidth = 1;
      if (l.dir === 'h') { ctx.moveTo(l.x, l.y); ctx.lineTo(l.x + l.len, l.y); }
      else               { ctx.moveTo(l.x, l.y); ctx.lineTo(l.x, l.y + l.len); }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(l.dir === 'h' ? l.x + l.len : l.x, l.dir === 'h' ? l.y : l.y + l.len, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${l.alpha * 2})`;
      ctx.fill();
    });

    dots.forEach(d => {
      d.phase += d.speed;
      const a = d.alpha * (0.4 + 0.6 * Math.sin(d.phase));
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ORIGINAL LOGIN LOGIC (unchanged)  */
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (!users.length) {
    alert('No users found. Please register first.');
    return window.location.href = 'register.html';
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      fullname: user.fullname || user.firstname || user.name
    }));
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password. Please try again.');
  }
};
