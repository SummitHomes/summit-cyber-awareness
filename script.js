// Improved script.js: Enhanced UX with loading states, Enter key support, accessibility,
// progressive hints, button disabling, and better error handling.
// Password hash remains unchanged for security.

// Sample stored hash (SHA-256 of the correct password - kept as-is)
const STORED_HASH = '156ebb02a92829a7adf3efffd1d7b5181f35e05a0155bb401e9d16c59e90ed03';

// Progressive hints based on partial checks (e.g., length, special char) to guide without spoiling
const HINTS = {
    empty: '❌ Enter a guess first!',
    length: '❌ Hint: Check the character count! (Clue 1)',
    noExclaim: '❌ Hint: Look for the special character! (Clue 2)',
    noYear: '❌ Hint: Think about our founding year! (Clue 2)',
    noSlogan: '❌ Hint: Consider the slogan! (Clue 3)',
    generic: '❌ Not quite! Double-check the clues and try again. (Hint: No spaces!)'
};

async function checkPassword() {
    const input = document.getElementById('passwordInput');
    const button = document.querySelector('button[onclick="checkPassword()"]'); // Assumes single button
    const resultDiv = document.getElementById('result');
    const guess = input.value.trim(); // Trim to handle accidental spaces

    // Reset previous state
    resultDiv.classList.add('hidden');
    input.disabled = false;
    button.disabled = false;
    button.textContent = 'Crack It!'; // Reset button text

    if (guess.length === 0) {
        showResult(HINTS.empty, 'error');
        input.focus(); // Refocus for quick retry
        return;
    } 

    // Progressive hints before full hash check (for better UX without revealing)
    if (guess.length !== 22) {
        showResult(HINTS.length, 'error');
        return;
    }
    if (!guess.includes('!')) {
        showResult(HINTS.noExclaim, 'error');
        return;
    }
    if (!guess.includes('1978')) { // Assuming founding year from clues; adjust if needed
        showResult(HINTS.noYear, 'error');
        return;
    }
    if (!guess.toLowerCase().includes('Built')) { // Assuming slogan keyword; adjust if exact differs
        showResult(HINTS.noSlogan, 'error');
        return;
    }

    // Set loading state
    button.disabled = true;
    button.textContent = 'Cracking... 🔄';
    input.disabled = true;

    try {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(guess);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex === STORED_HASH) {
            showResult('<strong>🎉 Congratulations, you cracked it!</strong><br>Remember, strong passwords like this keep hackers out. Submit a screenshot of this to <a href="mailto:fabiof@summithomes.com.au">fabiof@summithomes.com.au</a> to be in the running to win one of 3 $50 Amazon gift vouchers.', 'success');
            // Optional: Disable input/button permanently on success
            input.disabled = true;
            button.textContent = 'Cracked! 🎉';
        } else {
            showResult(HINTS.generic, 'error');
        }
    } catch (error) {
        console.error('Hash error:', error);
        showResult('❌ Something went wrong—try again later!', 'error');
        // Re-enable on error
        input.disabled = false;
        button.disabled = false;
        button.textContent = 'Crack It!';
    }

    // Focus back to input for retry
    if (!input.disabled) {
        input.focus();
    }
}

function showResult(message, type = 'error') {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.className = type;
    resultDiv.classList.remove('hidden');
    // Accessibility: Announce to screen readers
    resultDiv.setAttribute('aria-live', 'polite');
    resultDiv.setAttribute('role', 'alert');
}

// Event listeners for better UX
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('passwordInput');
    const button = document.querySelector('button[onclick="checkPassword()"]');

    // Auto-focus on load
    input.focus();

    // Enter key to submit
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !input.disabled) {
            checkPassword();
        }
    });

    // Escape key to clear
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            resultDiv.classList.add('hidden');
            input.focus();
        }
    });
});