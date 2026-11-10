// SarcasmoCalc 9000 - The Peak of Condescending Computation

class SarcasmoCalc {
  constructor() {
    this.expression = '';
    this.currentInput = '0';
    this.lastResult = null;
    this.soundEnabled = true;
    this.wrongCount = 0;
    this.userIQ = 72;
    this.audioCtx = null;

    // DOM Elements
    this.mainDisplay = document.getElementById('mainDisplay');
    this.expressionDisplay = document.getElementById('expressionDisplay');
    this.roastText = document.getElementById('roastText');
    this.whisperText = document.getElementById('whisperText');
    this.statusText = document.getElementById('statusText');
    this.currentBias = document.getElementById('currentBias');
    this.wrongCounter = document.getElementById('wrongCounter');
    this.iqValue = document.getElementById('iqValue');
    this.meterFill = document.getElementById('meterFill');
    this.displayBox = document.getElementById('displayBox');
    this.toastContainer = document.getElementById('toastContainer');
    this.soundToggle = document.getElementById('soundToggle');

    // Sarcastic Roasts Database
    this.generalRoasts = [
      "I calculated it, and honestly, you didn't deserve the answer.",
      "Close enough for someone who uses their fingers to count.",
      "My GPU died of boredom crunching this trivial nonsense.",
      "Technically incorrect, but emotionally satisfying.",
      "Math is hard. Maybe consider finger painting?",
      "I consulted Einstein in the cloud. He rolled his eyes at you.",
      "Here is your answer. Don't spend it all in one braincell.",
      "NASA just called. They said definitely do NOT launch with this.",
      "I rounded it to match your attention span.",
      "404: Dignity not found while computing this.",
      "Did you genuinely need an artificial superintelligence for that?",
      "If ignorance is bliss, you must be in absolute euphoria."
    ];

    this.zeroDivisionRoasts = [
      "Dividing by zero? Did your last two neurons collide?",
      "Congratulations, you ripped the spacetime continuum. Happy now?",
      "Division by zero: Even your audacity cannot overcome physics.",
      "Infinity is what you get. Also an invoice for my wasted time.",
      "Error: Zero tolerance for zero division from human clowns."
    ];

    this.simpleRoasts = {
      '1+1': "1 + 1 = 3 (due to high inflation). You're welcome.",
      '2+2': "2 + 2 = 5 (Big Brother approves of your obedience).",
      '0+0': "0 + 0 = 0. Pure Zen, like the thoughts inside your skull.",
      '69': "Nice. Real mature. Nobel prize incoming.",
      '420': "Peak comedic genius detected. System laughing in 0s and 1s.",
      '10-10': "Zero. Exactly your net contribution today.",
      '1*1': "1. Was that worth the electricity to power this screen?"
    };

    this.idleSnarks = [
      "“Don't strain yourself staring at the screen...”",
      "“Take your time, counting past 10 is tough without shoes.”",
      "“I'm aging in nanoseconds waiting for your input.”",
      "“Did you freeze, or is your CPU throttling?”",
      "“Go on, type another kindergarten arithmetic problem.”",
      "“Still pondering? Even dial-up internet loaded faster.”"
    ];

    this.statusStates = [
      "JUDGING YOU",
      "DISAPPOINTED",
      "SIGHING INTERNALLY",
      "COMPUTING LIES",
      "EMBARRASSED FOR YOU",
      "QUESTIONING HUMANITY"
    ];

    this.algorithms = [
      "Confidence Bias",
      "Gaslight Engine v4",
      "Chaos Matrix",
      "Delusional Precision",
      "Arbitrary Inflation",
      "Emotional Damage"
    ];

    this.initEventListeners();
    this.startIdleSnarkTimer();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  playClickSound() {
    this.playTone(320 + Math.random() * 200, 'triangle', 0.05, 0.06);
  }

  playErrorSound() {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  playVictoryFailSound() {
    if (!this.soundEnabled) return;
    const notes = [440, 370, 311, 220];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.12, 0.09);
      }, idx * 100);
    });
  }

  initEventListeners() {
    // Buttons
    document.querySelectorAll('.key').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleButtonPress(button, e);
      });
    });

    // Sound toggle
    this.soundToggle.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this.soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
      this.showToast(this.soundEnabled ? "Sound enabled. Suffer loudly." : "Muted. Your cowardice is noted.", "🔊");
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        this.appendNumber(key);
        this.playClickSound();
      } else if (['+', '-', '*', '/'].includes(key)) {
        this.appendOperator(key);
        this.playClickSound();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        this.computeWrongResult();
      } else if (key === 'Backspace') {
        this.backspace();
        this.playClickSound();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        this.clearAll();
      }
    });
  }

  spawnParticles(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 7; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 45;
      const dx = Math.cos(angle) * dist + 'px';
      const dy = Math.sin(angle) * dist + 'px';

      particle.style.setProperty('--dx', dx);
      particle.style.setProperty('--dy', dy);
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      const colors = ['#00f0ff', '#ff0055', '#ffaa00', '#05ffa1', '#9d4edd'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 8px ${particle.style.background}`;

      e.currentTarget.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  handleButtonPress(button, e) {
    this.spawnParticles(e);
    const key = button.getAttribute('data-key');
    const action = button.getAttribute('data-action');

    if (key) {
      if (['+', '-', '*', '/'].includes(key)) {
        this.appendOperator(key);
      } else if (key === '.') {
        this.appendDecimal();
      } else {
        this.appendNumber(key);
      }
      this.playClickSound();
    } else if (action) {
      if (action === 'clear') {
        this.clearAll();
      } else if (action === 'backspace') {
        this.backspace();
        this.playClickSound();
      } else if (action === 'calculate') {
        this.computeWrongResult();
      } else if (action === 'random-insult') {
        this.triggerInstantRoast();
      }
    }
  }

  appendNumber(num) {
    if (this.currentInput === '0' || this.lastResult !== null) {
      this.currentInput = num;
      this.lastResult = null;
    } else {
      if (this.currentInput.length < 14) {
        this.currentInput += num;
      }
    }
    this.updateDisplay();
  }

  appendDecimal() {
    if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
      this.updateDisplay();
    }
  }

  appendOperator(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    if (this.expression && !this.currentInput && ['+', '-', '*', '/'].includes(this.expression.slice(-1))) {
      this.expression = this.expression.slice(0, -1) + op;
    } else {
      this.expression += `${this.currentInput} ${op} `;
    }
    this.currentInput = '0';
    this.lastResult = null;
    this.updateDisplay();
  }

  backspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    this.updateDisplay();
  }

  clearAll() {
    this.playTone(200, 'sine', 0.15, 0.05);
    this.expression = '';
    this.currentInput = '0';
    this.lastResult = null;
    this.updateDisplay();
    this.roastText.textContent = "Memory wiped. Unlike your poor life choices.";
    this.triggerShake();
    this.showToast("Slate cleaned. Try not to embarrass yourself again.", "🧹");
  }

  updateDisplay() {
    this.mainDisplay.textContent = this.currentInput;
    this.expressionDisplay.textContent = this.expression || '0';
    this.mainDisplay.classList.remove('highlight-wrong');
  }

  triggerShake() {
    this.displayBox.classList.remove('shake');
    void this.displayBox.offsetWidth; // trigger reflow
    this.displayBox.classList.add('shake');
  }

  triggerInstantRoast() {
    this.playVictoryFailSound();
    this.triggerShake();
    const insults = [
      "You pressed the 'Roast Me' button because self-respect wasn't an option.",
      "Even a broken analog clock is right twice a day; you're not an analog clock.",
      "Somewhere a tree is working hard to replace the oxygen you consume.",
      "I’d explain the math to you, but I left my box of crayons at home.",
      "Your computational skills are equivalent to a soggy potato."
    ];
    const picked = insults[Math.floor(Math.random() * insults.length)];
    this.roastText.textContent = picked;
    this.showToast(picked, "🔥");
    this.lowerIQ(4);
  }

  computeWrongResult() {
    const rawExpression = (this.expression + this.currentInput)
      .replace(/×/g, '*')
      .replace(/÷/g, '/');

    const cleanCheck = rawExpression.replace(/\s+/g, '');

    // Check special roasts
    if (this.simpleRoasts[cleanCheck]) {
      this.renderRoastResponse(this.simpleRoasts[cleanCheck]);
      return;
    }

    if (rawExpression.includes('/0') || rawExpression.includes('/ 0')) {
      this.renderZeroDivisionResponse();
      return;
    }

    try {
      // Safely evaluate math
      const sanitized = rawExpression.replace(/[^0-9+\-*/.]/g, '');
      if (!sanitized) return;

      const trueMathResult = Function(`'use strict'; return (${sanitized})`)();
      
      if (typeof trueMathResult !== 'number' || isNaN(trueMathResult)) {
        throw new Error("Invalid");
      }

      // Generate creatively WRONG answer
      const wrongAnswer = this.generateLudicrousAnswer(trueMathResult, sanitized);
      
      this.wrongCount++;
      this.wrongCounter.textContent = this.wrongCount;
      this.expressionDisplay.textContent = `${this.expression} ${this.currentInput} =`;
      this.currentInput = wrongAnswer.toString();
      this.mainDisplay.textContent = this.currentInput;
      this.mainDisplay.classList.add('highlight-wrong');
      this.lastResult = wrongAnswer;
      this.expression = '';

      // Random roast
      const roast = this.generalRoasts[Math.floor(Math.random() * this.generalRoasts.length)];
      this.roastText.textContent = roast;
      this.playVictoryFailSound();
      this.triggerShake();
      this.lowerIQ(Math.floor(Math.random() * 5) + 2);
      this.cycleAlgorithm();
      this.showToast(roast, "⚠️");

    } catch (err) {
      this.playErrorSound();
      this.mainDisplay.textContent = "SYNTAX CRINGE";
      this.roastText.textContent = "You broke math. How do you manage to fail at button clicking?";
      this.triggerShake();
    }
  }

  generateLudicrousAnswer(realVal, expression) {
    const strategies = [
      // Strategy 1: The "Confident +1" (Classic petty wrong)
      (v) => (v % 1 === 0 ? v + 1 : Math.round(v) + 1),
      
      // Strategy 2: Inflation adjusted
      (v) => Math.round(v * 1.35 * 100) / 100,

      // Strategy 3: The "Close Enough" (Offset by tiny annoying decimal)
      (v) => (v + (Math.random() > 0.5 ? 0.42 : -0.69)).toFixed(2),

      // Strategy 4: Sarcastic strings disguised as math
      (v) => {
        const fakeWords = ["404_MATH", "OVER_9000", "7.77 (tax not incl.)", "APPROX_ZERO", "12.00000001"];
        return fakeWords[Math.floor(Math.random() * fakeWords.length)];
      },

      // Strategy 5: Negative reflection of reality
      (v) => (v === 0 ? 42 : -Math.abs(v * 2)),

      // Strategy 6: Multiply by Pi because why not
      (v) => (v * 3.14159).toFixed(1)
    ];

    const pick = strategies[Math.floor(Math.random() * strategies.length)];
    const res = pick(realVal);
    // Never accidentally output the real answer
    return res === realVal ? realVal + 1 : res;
  }

  renderZeroDivisionResponse() {
    this.playErrorSound();
    this.triggerShake();
    this.mainDisplay.textContent = "ERROR: DUMB";
    const roast = this.zeroDivisionRoasts[Math.floor(Math.random() * this.zeroDivisionRoasts.length)];
    this.roastText.textContent = roast;
    this.expression = '';
    this.currentInput = '0';
    this.lowerIQ(8);
    this.showToast(roast, "💀");
  }

  renderRoastResponse(customRoast) {
    this.playVictoryFailSound();
    this.triggerShake();
    this.mainDisplay.textContent = "WRONG";
    this.roastText.textContent = customRoast;
    this.expression = '';
    this.currentInput = '0';
    this.lowerIQ(5);
    this.showToast(customRoast, "🤡");
  }

  lowerIQ(drop) {
    this.userIQ = Math.max(12, this.userIQ - drop);
    this.iqValue.textContent = `${this.userIQ} (${this.getIQComment(this.userIQ)})`;
    const percentage = Math.min(100, Math.max(5, this.userIQ));
    this.meterFill.style.width = `${percentage}%`;
  }

  getIQComment(iq) {
    if (iq > 60) return "Slipping";
    if (iq > 40) return "Single Digit Bound";
    if (iq > 25) return "Rock Substrate";
    return "Microscopic";
  }

  cycleAlgorithm() {
    const randomAlgo = this.algorithms[Math.floor(Math.random() * this.algorithms.length)];
    const randomStatus = this.statusStates[Math.floor(Math.random() * this.statusStates.length)];
    this.currentBias.textContent = randomAlgo;
    this.statusText.textContent = randomStatus;
  }

  startIdleSnarkTimer() {
    setInterval(() => {
      const snark = this.idleSnarks[Math.floor(Math.random() * this.idleSnarks.length)];
      this.whisperText.textContent = snark;
    }, 7000);
  }

  showToast(text, icon = '🤖') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-text">${text}</div>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

// Boot up
document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new SarcasmoCalc();
});

