const selections = {
    q1: null,
    q2: null,
    q3: null,
    q4: null
};

function selectOption(questionId, value) {
    // Save selection
    selections[questionId] = value;

    // Update UI
    const container = document.getElementById(questionId);
    const cards = container.querySelectorAll('.option-card');
    
    cards.forEach(card => {
        card.classList.remove('selected');
        // Find the p tag inside card to match value
        // For simplicity, we just match the onclick handler we set
        if(card.getAttribute('onclick').includes(value.substring(0, 10))) {
            card.classList.add('selected');
        }
    });
}

function generatePrompt() {
    if (!selections.q1 || !selections.q2 || !selections.q3 || !selections.q4) {
        alert("Please select one option for all 4 questions before generating.");
        return;
    }

    const promptText = `You are a YouTube strategist for faceless cinematic finance channels.

MY CHANNEL:
Niche: Personal Finance
Style: Faceless cinematic
Earning: AdSense + Affiliate + Digital products
Platform: Shorts only

I have answered the 4 strategic questions for my next video:

Q1. AUDIENCE PSYCHOGRAPHIC
${selections.q1}

Q2. VIDEO PURPOSE
${selections.q2}

Q3. AFFILIATE CATEGORY
${selections.q3}

Q4. HOOK STYLE
${selections.q4}

STEP 2 — GENERATION
─────────────────────────
Generate 5 video ideas based on these inputs.

STRICT RULES:
No "get rich quick" angles
No income promises in titles
Each idea must make a skeptical viewer stop
Each idea must have natural affiliate fit

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
─────────────────────────

Sort output: strongest HOOK QUESTION first.`;

    document.getElementById('prompt-output').value = promptText;
    document.getElementById('output-section').style.display = 'block';
    
    // Smooth scroll to output
    document.getElementById('output-section').scrollIntoView({ behavior: 'smooth' });
}

function copyPrompt() {
    const textarea = document.getElementById('prompt-output');
    textarea.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    copyBtn.style.backgroundColor = 'var(--accent-gold)';
    copyBtn.style.color = '#000';
    
    setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.backgroundColor = '';
        copyBtn.style.color = '';
    }, 2000);
}
