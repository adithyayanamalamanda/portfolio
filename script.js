'use strict';

/* ══════════════════════════════════════════════════
   1. THEME SYSTEM
   ══════════════════════════════════════════════════ */
const html = document.documentElement;

/* ══════════════════════════════════════════════════
   2. MOBILE NAV & SCROLL EFFECTS
   ══════════════════════════════════════════════════ */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mainNav = document.getElementById('mainNav');
const progressBar = document.getElementById('progressBar');

// Toggle Menu
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close Mobile Menu on Link Click
document.querySelectorAll('.mmlink').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// Scroll Effects (Progress & Nav resizing)
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollY / Math.max(1, docHeight)) * 100;
  
  // Progress bar
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
  
  // Nav sizing
  if (scrollY > 50) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });

/* ══════════════════════════════════════════════════
   3. BACKGROUND NEURAL/DATA SCIENCE CANVAS
   ══════════════════════════════════════════════════ */
(function() {
  const cv = document.getElementById('dsCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, scrollY = 0;
  
  const isMobile = () => window.innerWidth < 768;
  
  function getThemeAwareColors() {
    return {
      primary: (alpha) => `rgba(182, 0, 168, ${alpha})`,
      secondary: (alpha) => `rgba(118, 33, 176, ${alpha})`,
    };
  }

  function resize() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  
  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
  
  resize();

  /* Neural Network Particles */
  let nnNodes = [], nnEdges = [];
  function buildNN() {
    nnNodes = [];
    nnEdges = [];
    const layers = isMobile() ? [2, 3, 3, 2] : [3, 5, 5, 3];
    const lx = W * 0.08, lw = W * 0.84, ly = H * 0.1, lh = H * 0.8;
    const off = [0];
    
    layers.forEach((count, i) => {
      const x = lx + (i / (layers.length - 1)) * lw;
      for (let n = 0; n < count; n++) {
        nnNodes.push({
          x,
          y: ly + ((n + 1) / (count + 1)) * lh,
          r: 2.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2
        });
      }
      off.push(off[off.length - 1] + count);
    });
    
    for (let li = 0; li < layers.length - 1; li++) {
      for (let a = off[li]; a < off[li + 1]; a++) {
        for (let b = off[li + 1]; b < off[li + 2]; b++) {
          nnEdges.push({
            a,
            b,
            t: -Math.random(),
            spd: 0.002 + Math.random() * 0.003,
            on: Math.random() > 0.4
          });
        }
      }
    }
  }
  
  function drawNN(so, colors) {
    const dy = so * 0.1;
    nnEdges.forEach(e => {
      if (!e.on) return;
      const na = nnNodes[e.a], nb = nnNodes[e.b];
      ctx.beginPath();
      ctx.moveTo(na.x, na.y - dy);
      ctx.lineTo(nb.x, nb.y - dy);
      ctx.strokeStyle = colors.primary(0.04);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      
      e.t += e.spd;
      if (e.t > 1.2) e.t = -0.2;
      if (e.t >= 0 && e.t <= 1) {
        const px = na.x + (nb.x - na.x) * e.t;
        const py = (na.y + (nb.y - na.y) * e.t) - dy;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary(0.7);
        ctx.fill();
      }
    });
    
    nnNodes.forEach(n => {
      n.phase += 0.015;
      const alpha = 0.25 + 0.2 * Math.sin(n.phase);
      ctx.beginPath();
      ctx.arc(n.x, n.y - so * 0.1, n.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary(alpha);
      ctx.fill();
    });
  }

  /* Floating Terms */
  const TERMS = ['Python', 'Pandas', 'NumPy', 'sklearn', 'TensorFlow', 'ML', 'NeuralNet', 'CNN', 
                 'Cybersecurity', 'Nmap', 'Metasploit', 'Wireshark', 'EthicalHacking', 'React.js', 
                 'SQL', 'PostgreSQL', 'Model.fit()', 'Git', 'PowerShell', 'Vulnerability', 'OAuth'];
  let floaters = [];
  function buildFloaters() {
    floaters = [];
    const count = isMobile() ? 12 : 24;
    for (let i = 0; i < count; i++) {
      floaters.push({
        txt: TERMS[Math.floor(Math.random() * TERMS.length)],
        x: Math.random() * W,
        y: Math.random() * H * 2.2,
        vy: 0.1 + Math.random() * 0.15,
        a: 0.04 + Math.random() * 0.06,
        sz: isMobile() ? 8 : 9 + Math.random() * 5,
        gold: Math.random() > 0.8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpd: 0.003 + Math.random() * 0.005
      });
    }
  }
  
  function drawFloaters(so, colors) {
    floaters.forEach(f => {
      f.y -= f.vy;
      f.wobble += f.wobbleSpd;
      if (f.y < -30) f.y = H * 1.8 + Math.random() * H;
      const sy = f.y - so * 0.25;
      if (sy < -40 || sy > H + 40) return;
      ctx.font = `400 ${f.sz}px "Space Mono", monospace`;
      ctx.fillStyle = f.gold ? colors.secondary(f.a) : colors.primary(f.a);
      ctx.fillText(f.txt, f.x + Math.sin(f.wobble) * 10, sy);
    });
  }

  /* Matrix Rain drops */
  const M_CHARS = '01∑∫πβλΔαεσXY#@'.split('');
  let rain = [];
  function buildRain() {
    rain = [];
    const cols = Math.floor(W / (isMobile() ? 40 : 32));
    for (let i = 0; i < cols; i++) {
      if (Math.random() > 0.5) {
        rain.push({
          x: i * (isMobile() ? 40 : 32) + 12,
          y: Math.random() * -H,
          spd: 0.4 + Math.random() * 0.8,
          chars: Array.from({ length: 14 }, () => M_CHARS[Math.floor(Math.random() * M_CHARS.length)]),
          timer: 0,
          interval: 5 + Math.floor(Math.random() * 8),
          alpha: 0.03 + Math.random() * 0.04
        });
      }
    }
  }
  
  function drawRain(so, colors) {
    rain.forEach(drop => {
      drop.y += drop.spd;
      if (drop.y > H + 200) drop.y = -180;
      drop.timer++;
      if (drop.timer >= drop.interval) {
        drop.timer = 0;
        drop.chars[Math.floor(Math.random() * drop.chars.length)] = M_CHARS[Math.floor(Math.random() * M_CHARS.length)];
      }
      const oy = drop.y - so * 0.06;
      drop.chars.forEach((ch, idx) => {
        const cy = oy - idx * 14;
        if (cy < -5 || cy > H + 5) return;
        const fade = 1 - idx / drop.chars.length;
        ctx.font = `700 9px "Space Mono", monospace`;
        ctx.fillStyle = colors.primary(idx === 0 ? drop.alpha * 6 * fade : drop.alpha * 2.2 * fade);
        ctx.fillText(ch, drop.x, cy);
      });
    });
  }

  /* Grid */
  function drawGrid(so, colors) {
    const gs = 60, off = (so * 0.04) % gs;
    ctx.strokeStyle = colors.primary(0.015);
    ctx.lineWidth = 0.8;
    for (let x = 0; x < W + gs; x += gs) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = -gs; y < H + gs; y += gs) {
      ctx.beginPath();
      ctx.moveTo(0, y + off);
      ctx.lineTo(W, y + off);
      ctx.stroke();
    }
  }

  function init() {
    buildNN();
    buildFloaters();
    buildRain();
  }
  
  init();

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    const colors = getThemeAwareColors();
    drawGrid(scrollY, colors);
    drawRain(scrollY, colors);
    drawFloaters(scrollY, colors);
    drawNN(scrollY, colors);
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════════════════
   4. STATS COUNTER SYSTEM
   ══════════════════════════════════════════════════ */
(function() {
  const statElements = document.querySelectorAll('.stat-num');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseFloat(target.getAttribute('data-target'));
        if (isNaN(targetVal)) return; // skip for fixed decimals (like CGPA)
        
        let current = 0;
        const duration = 1200; // ms
        const steps = 40;
        const stepVal = targetVal / steps;
        const intervalTime = duration / steps;
        
        const counter = setInterval(() => {
          current += stepVal;
          if (current >= targetVal) {
            target.textContent = targetVal;
            clearInterval(counter);
          } else {
            target.textContent = Math.floor(current);
          }
        }, intervalTime);
        
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════
   5. TYPEWRITER / SCRAMBLER TEXT EFFECTS
   ══════════════════════════════════════════ */
(function() {
  const typewriterWord = document.getElementById('typewriterWord');
  if (!typewriterWord) return;
  
  const words = ['intelligent AI models', 'secure systems', 'web platforms', 'cyber countermeasures'];
  const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:\',.<>?/~`0123456789';
  
  let currentIdx = 0;
  let wordIdx = 0;
  let timer = null;
  let timeout = null;
  
  function scrambleText() {
    const targetWord = words[currentIdx];
    const charLen = Math.floor(wordIdx / 2);
    
    if (charLen < targetWord.length) {
      let output = '';
      for (let i = 0; i < targetWord.length; i++) {
        if (i < charLen) {
          output += targetWord[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      typewriterWord.textContent = output;
      wordIdx++;
      timer = requestAnimationFrame(scrambleText);
    } else {
      typewriterWord.textContent = targetWord;
      timeout = setTimeout(() => {
        currentIdx = (currentIdx + 1) % words.length;
        wordIdx = 0;
        timer = requestAnimationFrame(scrambleText);
      }, 3000);
    }
  }

  // Start initial typewriter
  timeout = setTimeout(() => {
    timer = requestAnimationFrame(scrambleText);
  }, 1000);
  
  // Clean up
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(timer);
    clearTimeout(timeout);
  });
})();

/* ══════════════════════════════════════════════════
   6. SKILLS RADAR CANVAS CHART (Manual polygon rendering)
   ══════════════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('radarChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const skills = ['Python', 'ML / AI', 'Cybersecurity', 'React/Web', 'Databases', 'Dev Tools'];
  const values = [95, 88, 90, 82, 85, 80];
  const count = skills.length;
  
  let scaleRatio = window.devicePixelRatio || 1;
  let width = 280;
  let height = 280;
  
  canvas.width = width * scaleRatio;
  canvas.height = height * scaleRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(scaleRatio, scaleRatio);
  
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 90;
  let progress = 0;
  let animationId = null;

  function getThemeColors() {
    return {
      grid: 'rgba(12, 12, 12, 0.12)',
      spoke: 'rgba(12, 12, 12, 0.06)',
      labels: '#1a1a1a',
      ticks: '#777777',
      fill: 'rgba(182, 0, 168, 0.15)',
      stroke: '#B600A8'
    };
  }

  function drawRadar(t) {
    ctx.clearRect(0, 0, width, height);
    const colors = getThemeColors();
    
    // Draw polygon concentric grid rings (25%, 50%, 75%, 100%)
    for (let rLevel = 1; rLevel <= 4; rLevel++) {
      const radius = (maxRadius / 4) * rLevel;
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const rx = cx + radius * Math.cos(angle);
        const ry = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw spokes (lines from center)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const sx = cx + maxRadius * Math.cos(angle);
      const sy = cy + maxRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = colors.spoke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw filled skills polygon
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const idx = i % count;
      const radius = (values[idx] / 100) * maxRadius * t;
      const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = colors.fill;
    ctx.fill();
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw data points dot markers
    for (let i = 0; i < count; i++) {
      const radius = (values[i] / 100) * maxRadius * t;
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.stroke;
      ctx.fill();
    }
    
    // Draw labels text
    ctx.fillStyle = colors.labels;
    ctx.font = '10px Kanit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const lx = cx + (maxRadius + 18) * Math.cos(angle);
      const ly = cy + (maxRadius + 14) * Math.sin(angle);
      ctx.fillText(skills[i], lx, ly);
    }
    
    // Draw values numeric indicators along vertical axis
    ctx.fillStyle = colors.ticks;
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    for (let rLevel = 1; rLevel <= 4; rLevel++) {
      const radius = (maxRadius / 4) * rLevel;
      ctx.fillText(rLevel * 25, cx + 4, cy - radius);
    }
  }

  function animate() {
    progress = Math.min(1, progress + 0.025);
    drawRadar(progress);
    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  }

  // Trigger animation on scroll viewport entry
  const skillsSection = document.getElementById('skills');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      progress = 0;
      animationId = requestAnimationFrame(animate);
      
      // Also animate HTML skills progress fill bars
      document.querySelectorAll('.progress-fill').forEach(bar => {
        let widthStr = '0%';
        if (bar.classList.contains('fill-python')) widthStr = '95%';
        else if (bar.classList.contains('fill-ml')) widthStr = '88%';
        else if (bar.classList.contains('fill-cyber')) widthStr = '90%';
        else if (bar.classList.contains('fill-react')) widthStr = '82%';
        else if (bar.classList.contains('fill-db')) widthStr = '85%';
        bar.style.width = widthStr;
      });
      
      observer.unobserve(skillsSection);
    }
  }, { threshold: 0.25 });

  observer.observe(skillsSection);
  

})();

/* ══════════════════════════════════════════════════
   7. INTERACTIVE SHELL TERMINAL ENGINE
   ══════════════════════════════════════════════════ */
(function() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalScreen = document.getElementById('terminalScreen');
  
  if (!terminalForm || !terminalInput) return;
  
  // History commands tracker
  const commandHistory = [];
  let historyIndex = -1;
  
  // Command registry database
  const COMMANDS = {
    help: {
      desc: 'Show list of available console commands',
      run: () => `Available commands:
  help        ${'Show this message'.padEnd(20)}
  about       ${'Adithya profile details'.padEnd(20)}
  skills      ${'Core tools & tech stack'.padEnd(20)}
  projects    ${'Things Adithya has built'.padEnd(20)}
  certs       ${'Workshops & training certifications'.padEnd(20)}
  leadership  ${'Activities & NSS roles'.padEnd(20)}
  education   ${'Academic timeline'.padEnd(20)}
  contact     ${'Contact channels'.padEnd(20)}
  neofetch    ${'System summary spec sheet'.padEnd(20)}
  matrix      ${'Digital matrix rain fall overlay'.padEnd(20)}
  date        ${'Print current date/time'.padEnd(20)}
  clear       ${'Clear output buffer'.padEnd(20)}`
    },
    about: {
      desc: 'About Adithya details',
      run: () => `Yanamalamanda Adithya
  -----------------------------------
  B.Tech CS Student specializing in Data Science at ALIET.
  Interests: AI/ML Engineering & Threat-defense Cybersecurity.
  Tagline: "Turning data into decisions and systems into fortresses."
  Co-founder of 'Mission Placements' guidance platform.`
    },
    skills: {
      desc: 'Core tools & tech stack',
      run: () => `Core Tech Stack:
  -----------------------------------
  Programming  : Python, SQL, JS/TS, PowerShell
  AI & DS      : TensorFlow, sklearn, Pandas, NumPy, Model training, EDA
  Cybersecurity: Kali Linux, Nmap, Wireshark, Metasploit, Ethical Hacking
  Web/Layout   : React, Vite, HTML5, CSS3, REST APIs, Google OAuth
  Databases    : MySQL, PostgreSQL, MongoDB`
    },
    projects: {
      desc: 'List of built projects',
      run: () => `Featured Systems Built:
  -----------------------------------
  [01] AgriLink         - AgriTech land monitoring & market platforms
  [02] Webcam Spyware   - Real-time webcam threat logs via Facial Recognition (Python)
  [03] Placement Prep   - Mission Placements career guidance structure
  [04] Mental Wellness  - AI-driven youth health metrics & pdf reports
  [05] NetraOS          - High performance desktop OS UI workspace
  [06] Aura             - Complex frontend design systems showcase`
    },
    certs: {
      desc: 'Training credentials',
      run: () => `Accreditations & Certificates:
  -----------------------------------
  * 15-Day APMSMEDC Cybersecurity & Ethical Hacking Course (2024)
  * 6-Day Big Data Analytics Workshop (2024)
  * Google Analytics Certification (Google, 2024)
  * Deloitte Australia Data Analytics Job Simulation (2024)
  * AI Tools & AI-Powered People Manager Professional (2024)`
    },
    leadership: {
      desc: 'Extracurricular details',
      run: () => `Extracurricular Roles:
  -----------------------------------
  * Co-Founder - Mission Placements career prep networks (Nov 2025 - Present)
  * Active NSS Volunteer - AI seminars in government schools (2023 - Present)
  * Technical Presenter & Speaker - Department research reports (2023 - Present)
  * Team Coordinator & Mentor - Group programming project leader (2023 - Present)`
    },
    education: {
      desc: 'Academic timeline',
      run: () => `Academics:
  -----------------------------------
  * B.Tech CS (Data Science Specialization) - Andhra Loyola Institute (2023 - Present)
    Grade: 8.0 CGPA
  * Intermediate MPC - MNM's Vijetha Junior College (2021 - 2023)
    Grade: 90%`
    },
    contact: {
      desc: 'Contact routes',
      run: () => `Contact Info:
  -----------------------------------
  Email    : adithyayanamalamanda@gmail.com
  LinkedIn : linkedin.com/in/yanamalamanda-adithya-9852a9366
  GitHub   : github.com/adithyayanamalamanda
  Phone    : +91 7904411858`
    },
    neofetch: {
      desc: 'System neofetch spec sheet',
      run: () => {
        return `   ,---.       OS        : Adithya Shell v2.1 (hacker edition)
  /     \\      Uptime    : 2+ Years engineering
  \\ .-. /      Host      : Yanamalamanda Adithya
   \\   /       Role      : CS Student (DS & Cyber Security)
   /   \\       Target    : AI Internships & Collaborations
  /     \\      Resolution: ${window.innerWidth}x${window.innerHeight}
 /       \\     Theme     : Light Theme Clean`
      }
    },
    date: {
      desc: 'Current local date/time',
      run: () => new Date().toString()
    },
    clear: {
      desc: 'Clear screen outputs',
      run: () => 'CLEAR'
    }
  };

  // Process input
  function executeCommand(inputRaw) {
    const input = inputRaw.trim();
    if (!input) return;
    
    // Push history
    commandHistory.push(input);
    historyIndex = commandHistory.length;
    
    const args = input.split(/\s+/);
    const cmd = args[0].toLowerCase();
    
    let outputText = '';
    
    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }
    
    if (cmd === 'matrix') {
      launchTerminalMatrix();
      return;
    }
    
    if (COMMANDS[cmd]) {
      outputText = COMMANDS[cmd].run(args.slice(1));
    } else {
      outputText = `bash: command not found: ${cmd}. Type 'help' for options.`;
    }
    
    // Create new node logs
    const outputBlock = document.createElement('div');
    outputBlock.className = 'terminal-output-block';
    
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="terminal-prompt">adithya@portfolio:~$</span> <span class="terminal-history-cmd">${escapeHTML(input)}</span>`;
    outputBlock.appendChild(echoLine);
    
    const resultLine = document.createElement('div');
    resultLine.className = 'terminal-line terminal-output-txt';
    resultLine.textContent = outputText;
    outputBlock.appendChild(resultLine);
    
    terminalOutput.appendChild(outputBlock);
    
    // Scroll bottom
    setTimeout(() => {
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }, 20);
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Handle Form submit
  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = terminalInput.value;
    terminalInput.value = '';
    executeCommand(val);
  });
  
  // Terminal history keys
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        historyIndex = Math.max(0, historyIndex - 1);
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        if (historyIndex === commandHistory.length) {
          terminalInput.value = '';
        } else {
          terminalInput.value = commandHistory[historyIndex];
        }
      }
    }
  });

  // Launch Matrix Digital Rain inside Terminal Screen
  function launchTerminalMatrix() {
    // Create matrix canvas container overlay
    const canvas = document.createElement('canvas');
    canvas.className = 'terminal-matrix-canvas';
    terminalScreen.appendChild(canvas);
    
    const mCtx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&'.split('');
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => 1);
    
    let matrixInterval = setInterval(() => {
      mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      mCtx.fillRect(0, 0, width, height);
      
      mCtx.fillStyle = '#0f0'; // bright green rain
      mCtx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
    
    // Escape Matrix
    const exitMsg = document.createElement('div');
    exitMsg.className = 'matrix-exit-btn';
    exitMsg.style.cssText = 'position:absolute;top:10px;right:10px;z-index:15;background:rgba(0,0,0,0.8);border:1px solid #0f0;color:#0f0;font-size:10px;padding:4px 8px;border-radius:4px;cursor:pointer;';
    exitMsg.textContent = 'EXIT MATRIX (ESC)';
    terminalScreen.appendChild(exitMsg);
    
    function exitMatrix() {
      clearInterval(matrixInterval);
      canvas.remove();
      exitMsg.remove();
      window.removeEventListener('keydown', handleEsc);
      terminalInput.focus();
    }
    
    function handleEsc(e) {
      if (e.key === 'Escape') exitMatrix();
    }
    
    exitMsg.addEventListener('click', exitMatrix);
    window.addEventListener('keydown', handleEsc);
  }
})();

/* ══════════════════════════════════════════════════
   8. THREEJS 3D WIREFRAME ORB CORE
   ══════════════════════════════════════════════════ */
(function() {
  const container = document.getElementById('threeJsOrbContainer');
  if (!container) return;
  
  let scene, camera, renderer, mesh, meshOutline;
  let W = 220, H = 220;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  function getThemeColor() {
    return 0x1a1a1a;
  }

  function initThree() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.z = 4.2;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Geometries & Mesh
    // Replicating gkrit Torus knot style mesh
    const geometry = new THREE.TorusKnotGeometry(0.9, 0.3, 100, 16);
    
    const material = new THREE.MeshBasicMaterial({
      color: 0xB600A8, // Brand pink wireframe
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Spoke outer wireframe outlines
    const outlineGeometry = new THREE.TorusKnotGeometry(0.95, 0.32, 32, 8);
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: getThemeColor(),
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    meshOutline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    scene.add(meshOutline);
    
    // Drag control events
    renderer.domElement.addEventListener('mousedown', () => { isDragging = true; });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      
      if (isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
            toRadians(deltaMove.y * 0.5),
            toRadians(deltaMove.x * 0.5),
            0,
            'XYZ'
          ));
        mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mesh.quaternion);
        meshOutline.quaternion.multiplyQuaternions(deltaRotationQuaternion, meshOutline.quaternion);
      }
      
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    // Mobile Touch drag controls
    renderer.domElement.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    
    renderer.domElement.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaMove = {
        x: touch.clientX - previousMousePosition.x,
        y: touch.clientY - previousMousePosition.y
      };
      
      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          toRadians(deltaMove.y * 0.5),
          toRadians(deltaMove.x * 0.5),
          0,
          'XYZ'
        ));
      mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mesh.quaternion);
      meshOutline.quaternion.multiplyQuaternions(deltaRotationQuaternion, meshOutline.quaternion);
      
      previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    
    window.addEventListener('touchend', () => { isDragging = false; });
  }
  
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    if (!isDragging) {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.008;
      
      meshOutline.rotation.x -= 0.003;
      meshOutline.rotation.y -= 0.005;
    }
    
    renderer.render(scene, camera);
  }
  
  initThree();
  animate();
  

})();

/* ══════════════════════════════════════════════════
   9. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ══════════════════════════════════════════════════ */
(function() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  
  reveals.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════
   10. CONTACT FORM HANDLER
   ══════════════════════════════════════════════════ */
(function() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      if (response.ok) {
        formStatus.textContent = 'Message sent successfully! I will reach out soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.className = 'form-status error';
      }
    })
    .catch(() => {
      formStatus.textContent = 'Network error. Could not connect to mail servers.';
      formStatus.className = 'form-status error';
    })
    .finally(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      
      // Clear message status after 5s
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    });
  });
})();

/* ══════════════════════════════════════════════════
   11. AVATAR CARD IMAGE LOADER / FALLBACK
   ══════════════════════════════════════════════════ */
(function() {
  const profileImg = document.getElementById('profileImage');
  const profileFallback = document.getElementById('profileFallback');
  
  if (!profileImg || !profileFallback) return;
  
  // Show image initially
  profileImg.style.display = 'block';
  profileFallback.style.display = 'none';
  
  // Fallback to text initials if image load fails
  profileImg.addEventListener('error', () => {
    profileImg.style.display = 'none';
    profileFallback.style.display = 'flex';
  });
})();

/* ══════════════════════════════════════════════════
   12. AI CHATBOT ENGINE
   ══════════════════════════════════════════════════ */
(function() {
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
  const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotSuggestions = document.getElementById('chatbotSuggestions');
  const chatbotInputForm = document.getElementById('chatbotInputForm');
  const chatbotInput = document.getElementById('chatbotInput');

  if (!chatbotWidget || !chatbotToggleBtn || !chatbotMessages) return;

  // Toggle Chat window open/close
  chatbotToggleBtn.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
    if (chatbotWidget.classList.contains('active')) {
      setTimeout(() => chatbotInput.focus(), 200);
    }
  });

  if (chatbotCloseBtn) {
    chatbotCloseBtn.addEventListener('click', () => {
      chatbotWidget.classList.remove('active');
    });
  }

  // FAQ Knowledge Base - Prioritized from specific to general
  const FAQ = [
    // 1. SPECIFIC PROJECTS (checked first)
    {
      keys: ['agrilink'],
      reply: "🌱 AgriLink (AgriTech Platform)\n-----------------------------------\nDescription: AgriLink is a comprehensive agricultural platform integrating land monitoring, equipment rental, and market dynamics. It empowers farmers with data-driven insights and crop analytics.\nTechnologies: JavaScript, HTML5, CSS3.\nGitHub: https://github.com/adithyayanamalamanda/AgriLink"
    },
    {
      keys: ['webcam', 'spyware'],
      reply: "🛡️ Webcam Spyware Security System\n-----------------------------------\nDescription: A real-time hardware-security monitoring tool. It uses OpenCV facial recognition to detect webcam intruders, logs threat activities, and executes defensive countermeasures.\nTechnologies: Python, Computer Vision, OpenCV, PowerShell.\nGitHub: https://github.com/adithyayanamalamanda/webcam-spyware-security"
    },
    {
      keys: ['mission placements', 'placements'],
      reply: "🚀 Mission Placements (EdTech Platform)\n-----------------------------------\nDescription: A career preparation and assistance platform co-founded by Adithya to help students prepare for interviews. It provides study paths, coding study logs, and mock tests.\nTechnologies: Web platform guidance systems.\nGitHub: https://github.com/adithyayanamalamanda/mission-placements"
    },
    {
      keys: ['wellness', 'mental'],
      reply: "🧠 Youth Mental Wellness (Healthcare AI)\n-----------------------------------\nDescription: An AI-driven mental assessment platform checking user cognitive states. Features Google OAuth and automated HIPAA-compliant PDF reporting.\nTechnologies: JavaScript, AI Engine, PDF Kit.\nGitHub: https://github.com/adithyayanamalamanda/youth-mental-wellness"
    },
    {
      keys: ['netraos'],
      reply: "💻 NetraOS (OS UI Layout)\n-----------------------------------\nDescription: An operating-system-inspired lightweight responsive web interface showcasing desktop layouts, file explorers, and draggable components.\nTechnologies: React.js, TypeScript, Vite.\nGitHub: https://github.com/adithyayanamalamanda/NetraOS"
    },
    {
      keys: ['aura'],
      reply: "✨ Aura (UI/UX System)\n-----------------------------------\nDescription: A cutting-edge aesthetic UI design system showcasing complex CSS transitions and custom interactive canvases.\nTechnologies: HTML, CSS, JavaScript.\nGitHub: https://github.com/adithyayanamalamanda/Aura"
    },
    // 2. CORE CATEGORIES
    {
      keys: ['projects', 'project', 'build', 'built', 'create', 'created', 'portfolio', 'work', 'systems', 'system'],
      reply: "Adithya has built several projects:\n\n1. AgriLink: Agricultural land monitoring and market dynamics platform.\n2. Webcam Spyware Security: Facial recognition camera intruder detector.\n3. Mission Placements: Career prep study pathway platform.\n4. Youth Mental Wellness: AI assessment engine with PDF reports.\n5. NetraOS: OS-inspired lightweight workspace interface.\n6. Aura: Advanced CSS visual layout showcase.\n\nType the name of any project (e.g. 'AgriLink' or 'Webcam') to get details!"
    },
    {
      keys: ['skills', 'skill', 'stack', 'tool', 'tools', 'language', 'languages', 'python', 'react', 'tensorflow', 'what can he do', 'technologies', 'databases', 'sql', 'js', 'ts', 'database'],
      reply: "Adithya's Technical Stack:\n\n• Programming:\n  - Python (Advanced, 95%)\n  - SQL (Proficient, 85%)\n  - JavaScript / TypeScript (82%)\n  - PowerShell (for automation scripting)\n\n• Data Science & AI (88%):\n  - TensorFlow, scikit-learn, Pandas, NumPy, model training, EDA\n\n• Cybersecurity (90%):\n  - Kali Linux CLI, Nmap scanning, Wireshark traffic analysis, Metasploit, Burp Suite, secure OAuth authentication workflows\n\n• Web Engineering:\n  - React.js, Vite, HTML5, CSS3, REST APIs"
    },
    {
      keys: ['contact', 'contacts', 'email', 'emails', 'phone', 'reach', 'linkedin', 'github', 'connect', 'social', 'address', 'where is he', 'mail', 'tel', 'call'],
      reply: "Reach out to Adithya via:\n\n• Email: adithyayanamalamanda@gmail.com\n• LinkedIn: linkedin.com/in/yanamalamanda-adithya-9852a9366\n• GitHub: github.com/adithyayanamalamanda\n• Phone/WhatsApp: +91 7904411858\n• Location: Vijayawada, AP, India"
    },
    {
      keys: ['education', 'college', 'school', 'cgpa', 'aliet', 'grade', 'academic', 'degree', 'study', 'timeline', 'grades'],
      reply: "Academic Timeline:\n\n• B.Tech in Computer Science (Data Science)\n  - Andhra Loyola Institute of Engineering and Technology (ALIET), Vijayawada\n  - August 2023 — Present | Current Grade: 8.0 CGPA\n\n• Intermediate MPC (Math, Physics, Chemistry)\n  - MNM's Vijetha Junior College\n  - August 2021 — May 2023 | Grade: 90%"
    },
    {
      keys: ['certs', 'cert', 'certification', 'certifications', 'workshop', 'workshops', 'google', 'deloitte'],
      reply: "Accreditations & Certificates:\n\n• 15-Day APMSMEDC Cybersecurity & Ethical Hacking Course (2024)\n• 6-Day Big Data Analytics Workshop (2024)\n• Google Analytics Certification (2024)\n• Deloitte Australia Data Analytics Simulation (2024)\n• AI Tools & AI-Powered People Manager Workshop (2024)"
    },
    {
      keys: ['leadership', 'extracurricular', 'nss', 'activities', 'speaker', 'mentor', 'team', 'roles'],
      reply: "Leadership & Activities:\n\n• Co-Founder — Mission Placements: Guides peers with study schedules and mock interview preparations.\n• NSS Volunteer: Delivers seminars on Data Science and AI safety to government school classes.\n• Technical Presenter & Speaker: Simplifies complex research algorithms in academic department reports.\n• Team Coordinator & Mentor: Directs development project teams and hackathon collaborations."
    },
    // 3. GENERAL (checked last to avoid false triggers on helper words like 'about')
    {
      keys: ['about', 'bio', 'vision', 'profile', 'adithya', 'who is he', 'who are you'],
      reply: "Yanamalamanda Adithya is an engineering student at Andhra Loyola Institute of Engineering and Technology (ALIET), specializing in Data Science. His research and development work focuses on the intersection of AI/ML Systems and Cybersecurity (ethical hacking & system vulnerability defense). He is based in Vijayawada, AP, India, and is open to internship opportunities in 2026."
    },
    {
      keys: ['hi', 'hello', 'hey', 'greetings', 'hola', 'help'],
      reply: "Hello! I am Adithya's AI Assistant. Ask me anything about his skills, projects, education, certifications, or how to contact him!"
    }
  ];

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Reply generator using word boundaries
  function getResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    for (let faq of FAQ) {
      for (let key of faq.keys) {
        // Regex word boundary matching
        const regex = new RegExp('\\b' + escapeRegExp(key) + '\\b', 'i');
        if (regex.test(msg)) {
          return faq.reply;
        }
      }
    }
    
    return "I am not sure I understand that query. You can ask about Adithya's skills, projects, certifications, leadership, education, or contact details!";
  }

  // Insert message bubble
  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.innerText = text;
    chatbotMessages.appendChild(msgDiv);
    
    // Auto scroll to bottom
    setTimeout(() => {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 20);
  }

  // Handle Form submit
  chatbotInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;
    
    chatbotInput.value = '';
    addMessage(text, 'user');
    
    // Simulate thinking delay
    setTimeout(() => {
      const reply = getResponse(text);
      addMessage(reply, 'assistant');
    }, 450);
  });

  // Handle suggestion tags click
  chatbotSuggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-tag')) {
      const text = e.target.textContent;
      addMessage(text, 'user');
      
      setTimeout(() => {
        const reply = getResponse(text);
        addMessage(reply, 'assistant');
      }, 450);
    }
  });
})();

/* ══════════════════════════════════════════════════
   13. PROJECTS STACKING SCROLL EFFECT
   ══════════════════════════════════════════════════ */
(function() {
  const container = document.querySelector('.projects-stack-container');
  if (!container) return;
  
  const cards = Array.from(container.querySelectorAll('.project-card'));
  if (cards.length === 0) return;
  
  const stickyTop = 120; // Matches top in CSS
  
  function handleScroll() {
    // Only run on desktop/tablet views where sticky is active
    if (window.innerWidth <= 768) {
      // Reset styles on mobile
      cards.forEach(card => {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.filter = '';
      });
      return;
    }
    
    cards.forEach((card, i) => {
      let scale = 1;
      let translateY = 0;
      let opacity = 1;
      
      const cardHeight = card.offsetHeight || 440;
      
      // Look at all cards after this one to compute the stacking values
      for (let j = i + 1; j < cards.length; j++) {
        const nextCard = cards[j];
        const nextRect = nextCard.getBoundingClientRect();
        
        // Calculate progress of the next card overlapping this card
        const range = cardHeight;
        const dist = nextRect.top - stickyTop;
        const progress = 1 - Math.min(Math.max(dist / range, 0), 1);
        
        if (progress > 0) {
          scale -= progress * 0.04;      // scale down by 4% per stacking card
          translateY -= progress * 22;  // translate up by 22px per stacking card
          opacity -= progress * 0.08;   // reduce opacity by 8% per card
        }
      }
      
      card.style.transform = `translateY(${translateY}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = `brightness(${1 - (1 - opacity) * 0.5})`;
    });
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  
  // Initial call
  handleScroll();
})();


