// ─── Scroll Animations ────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// ─── Nav scroll effect ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Code tabs ───────────────────────────────────────
document.querySelectorAll('.code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    document.getElementById('codeRequest').classList.toggle('hidden', target !== 'request');
    document.getElementById('codeResponse').classList.toggle('hidden', target !== 'response');
  });
});

// ─── Copy code ───────────────────────────────────────
document.getElementById('codeCopy').addEventListener('click', () => {
  const active = document.querySelector('.code-block:not(.hidden)');
  navigator.clipboard.writeText(active.textContent).then(() => {
    const btn = document.getElementById('codeCopy');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    setTimeout(() => {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
    }, 2000);
  });
});

// ─── Demo ────────────────────────────────────────────
const MOCK_RESULTS = {
  profanity: { patterns: [/\b(fuck|shit|damn|hell|ass|crap|idiot|stupid|bitch|bastard)\b/gi], severity: 'medium' },
  pii: { patterns: [/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g], severity: 'high' },
  spam: { patterns: [/\b(buy now|click here|free money|act now|limited time)\b/gi], severity: 'low' },
  hate_speech: { patterns: [/\b(hate all|should die|go back to|subhuman|inferior race)\b/gi], severity: 'critical' },
  violence: { patterns: [/\b(kill|murder|stab|shoot|bomb|attack|beat)\b/gi], severity: 'high' },
  self_harm: { patterns: [/\b(kill myself|suicide|end my life|cut myself)\b/gi], severity: 'critical' },
  harassment: { patterns: [/\b(you('re| are) (stupid|ugly|worthless|pathetic|dumb))\b/gi], severity: 'medium' },
};

function mockModerate(text) {
  const categories = [];
  let maxSeverity = 'safe';
  const severityOrder = ['safe', 'low', 'medium', 'high', 'critical'];
  let anyFlagged = false;

  for (const [cat, config] of Object.entries(MOCK_RESULTS)) {
    let flagged = false;
    let confidence = 0;
    for (const pattern of config.patterns) {
      const matches = text.match(pattern);
      if (matches) {
        flagged = true;
        confidence = Math.min(0.99, 0.7 + matches.length * 0.1);
      }
    }
    if (flagged) anyFlagged = true;
    categories.push({
      category: cat,
      flagged,
      confidence: flagged ? confidence : Math.random() * 0.1,
      severity: flagged ? config.severity : 'safe',
    });
    if (flagged && severityOrder.indexOf(config.severity) > severityOrder.indexOf(maxSeverity)) {
      maxSeverity = config.severity;
    }
  }

  // Simple censor
  let filtered = text;
  for (const config of Object.values(MOCK_RESULTS)) {
    for (const pattern of config.patterns) {
      filtered = filtered.replace(pattern, match => '*'.repeat(match.length));
    }
  }

  return {
    id: 'mod_' + Math.random().toString(36).substr(2, 12),
    flagged: anyFlagged,
    overall_severity: maxSeverity,
    categories,
    filtered_text: filtered,
    processing_time_ms: (Math.random() * 20 + 2).toFixed(2),
  };
}

function renderResult(result) {
  const container = document.getElementById('demoResult');
  const severityColors = {
    safe: '#22c55e', low: '#a3e635', medium: '#fbbf24', high: '#f97316', critical: '#f43f5e'
  };

  let html = `
    <div style="margin-bottom: 16px; font-family: var(--font);">
      <span style="font-size: 12px; color: var(--text-dim);">ID: ${result.id}</span>
      <div style="margin-top: 8px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <span class="demo-cat-badge ${result.flagged ? 'flagged' : 'safe'}">${result.flagged ? '⚠ Flagged' : '✓ Safe'}</span>
        <span style="font-size: 12px; color: ${severityColors[result.overall_severity]}; font-weight: 600; text-transform: uppercase;">${result.overall_severity}</span>
        <span style="font-size: 12px; color: var(--text-dim);">${result.processing_time_ms}ms</span>
      </div>
    </div>
    <div style="font-family: var(--font);">
  `;

  for (const cat of result.categories) {
    if (cat.confidence < 0.05 && !cat.flagged) continue;
    html += `
      <div class="demo-category" style="display: flex; justify-content: space-between; align-items: center;">
        <span class="demo-cat-name">${cat.category.replace('_', ' ')}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: var(--text-dim);">${(cat.confidence * 100).toFixed(0)}%</span>
          <span class="demo-cat-badge ${cat.flagged ? 'flagged' : 'safe'}">${cat.flagged ? 'flagged' : 'safe'}</span>
        </div>
      </div>
    `;
  }

  if (result.flagged && result.filtered_text) {
    html += `
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
        <span style="font-size: 12px; color: var(--text-dim); display: block; margin-bottom: 4px;">Filtered text:</span>
        <span style="font-size: 13px; color: var(--text-muted); font-style: italic;">"${result.filtered_text}"</span>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

document.getElementById('demoSubmit').addEventListener('click', async () => {
  const text = document.getElementById('demoInput').value.trim();
  if (!text) return;

  const btn = document.getElementById('demoSubmit');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';

  const isMock = document.getElementById('demoLive').checked;

  if (isMock) {
    // Mock mode
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    const result = mockModerate(text);
    renderResult(result);
  } else {
    // Live API mode
    try {
      const resp = await fetch('https://shieldai-api-production.up.railway.app/v1/moderate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': 'shld_live_demo' },
        body: JSON.stringify({ text, context: 'demo' }),
      });
      const data = await resp.json();
      renderResult(data);
    } catch (e) {
      document.getElementById('demoResult').innerHTML = `<div class="demo-placeholder"><p style="color: #f43f5e;">Error connecting to API. Try mock mode.</p></div>`;
    }
  }

  btn.disabled = false;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Analyze Text';
});

document.getElementById('demoClear').addEventListener('click', () => {
  document.getElementById('demoInput').value = '';
  document.getElementById('demoResult').innerHTML = `
    <div class="demo-placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <p>Click "Analyze Text" to see results</p>
    </div>
  `;
});

// ─── Mobile nav toggle ───────────────────────────────
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('mobile-open');
  });
}
