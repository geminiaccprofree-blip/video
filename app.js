// ========================
// STATE
// ========================
const state = {
    q1: null, q2: null, q3: null, q4: null,
    currentPhase: 1,
    completedPhases: new Set()
};

// ========================
// CARD SELECTION — FIXED
// ========================
function selectCard(questionKey, cardElement, value) {
    // Deselect all cards in that grid
    const gridId = questionKey + '-grid';
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.querySelectorAll('.sel-card').forEach(c => c.classList.remove('selected'));

    // Select the clicked card
    cardElement.classList.add('selected');

    // Save value
    state[questionKey] = value;

    // Update summary dot
    const dot = document.getElementById('dot-' + questionKey);
    if (dot) dot.classList.add('done');

    // Update summary label + button
    checkAllSelected();
}

function checkAllSelected() {
    const all = state.q1 && state.q2 && state.q3 && state.q4;
    const btn = document.getElementById('generate-btn');
    const label = document.getElementById('summary-label');

    if (btn) btn.disabled = !all;
    if (label) {
        const count = [state.q1, state.q2, state.q3, state.q4].filter(Boolean).length;
        label.textContent = all ? 'All selected — ready to generate!' : `${count} of 4 selected`;
    }
}

// ========================
// PHASE NAVIGATION
// ========================
function switchPhase(phaseNum) {
    // Hide all sections
    document.querySelectorAll('.phase-section').forEach(s => {
        s.classList.remove('active-section');
    });

    // Show target
    const target = document.getElementById('phase-' + phaseNum);
    if (target) {
        target.classList.add('active-section');
        // Trigger reveals
        setTimeout(() => triggerReveals(target), 50);
    }

    // Update sidebar
    document.querySelectorAll('.phase-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.phase-item[data-phase="${phaseNum}"]`);
    if (activeItem) activeItem.classList.add('active');

    state.currentPhase = phaseNum;

    // Scroll to top of main
    const main = document.querySelector('.main-content');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================
// PROMPT GENERATION
// ========================
function generatePhase1Prompt() {
    if (!state.q1 || !state.q2 || !state.q3 || !state.q4) return;

    const prompt = `You are a YouTube strategist for faceless cinematic finance channels.

MY CHANNEL:
Niche: Personal Finance
Style: Faceless cinematic
Earning: AdSense + Affiliate + Digital products
Platform: Shorts only

I have answered the 4 strategic questions below.

Q1. AUDIENCE PSYCHOGRAPHIC:
${state.q1}

Q2. VIDEO PURPOSE:
${state.q2}

Q3. AFFILIATE CATEGORY:
${state.q3}

Q4. HOOK STYLE:
${state.q4}

STEP 2 — GENERATION
─────────────────────────
Generate 5 video ideas based on my exact inputs above.

STRICT RULES:
- No "get rich quick" angles
- No income promises in titles
- Each idea must make a skeptical viewer stop scrolling
- Each idea must have a natural affiliate fit
- Sort output: strongest HOOK QUESTION first

For EACH idea output exactly this format:

IDEA [NUMBER]
─────────────────────────
TITLE:
[Max 60 characters. Curiosity gap or counter-intuitive statement. No clickbait promises.]

UNIQUE ANGLE:
[What most finance channels miss about this exact topic]

EMOTION TRIGGER:
[Choose one: fear / hope / shock / curiosity / anger / relief]

HOOK QUESTION:
[The one question viewer becomes desperate to answer]

AFFILIATE PRODUCT:
[Specific product from chosen category that fits naturally as story element]
─────────────────────────`;

    const outputEl = document.getElementById('prompt-output');
    const panelEl = document.getElementById('output-panel');

    if (outputEl) outputEl.value = prompt;
    if (panelEl) panelEl.classList.add('visible');

    // Smooth scroll to output
    setTimeout(() => {
        if (panelEl) panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Update progress
    updateProgress(1);
}

// ========================
// COPY TO CLIPBOARD
// ========================
function copyPrompt() {
    const textarea = document.getElementById('prompt-output');
    if (!textarea) return;

    navigator.clipboard.writeText(textarea.value).then(() => {
        const btn = document.getElementById('copy-btn');
        if (btn) {
            btn.classList.add('copied');
            btn.innerHTML = '<span>✓ Copied!</span>';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = '<span>Copy Prompt</span>';
            }, 2500);
        }
    }).catch(() => {
        // Fallback for older browsers
        textarea.select();
        document.execCommand('copy');
    });
}

// ========================
// PROGRESS BAR
// ========================
function updateProgress(phase) {
    state.completedPhases.add(phase);
    const pct = Math.round((state.completedPhases.size / 6) * 100);
    const bar = document.getElementById('progress-bar');
    const pctEl = document.getElementById('progress-pct');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';

    // Mark sidebar phase as completed
    const item = document.querySelector(`.phase-item[data-phase="${phase}"]`);
    if (item) {
        item.classList.add('completed');
        const statusEl = item.querySelector('.phase-status');
        if (statusEl) statusEl.textContent = '✓';
    }

    // Unlock next phase in sidebar
    const next = document.querySelector(`.phase-item[data-phase="${phase + 1}"]`);
    if (next) next.classList.remove('locked');
}

// ========================
// REVEAL ANIMATIONS ON SCROLL
// ========================
function triggerReveals(container) {
    const reveals = container.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, i * 120);
    });
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Initial reveals for Phase 1
    const phase1 = document.getElementById('phase-1');
    if (phase1) {
        setTimeout(() => triggerReveals(phase1), 100);
    }

    // Intersection Observer for scroll reveals
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Sidebar phase click: prevent locked phases
    document.querySelectorAll('.phase-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('locked')) {
                e.stopPropagation();
            }
        });
    });
});
