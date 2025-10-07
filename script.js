async function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const storedHash = '69954a7d56e23a5764bbe6d966daecb2d47c0b889ef4a64965188978a4922eb9'; 
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(input);
    
    if (input.length === 0) {
        showResult('❌ Enter a guess first!');
        return;
    }

    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (hashHex === storedHash) {
            showResult(''<strong>🎉 Congratulations you cracked it!</strong>: "Remember, strong passwords like this keep hackers out. Submit a screenshot of this to fabiof@summithomes.com.au to be in the running to win one of 3 $50 Amazon gift vouchers."', true);
        } else {
            showResult('❌ Not quite! Double-check the clues and try again. (Hint: No spaces!)', false);
        }
    } catch (error) {
        console.error('Hash error:', error);
        showResult('❌ Something went wrong—try again!');
    }
}

function showResult(message, isSuccess) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<strong>${message}</strong>`;
    resultDiv.className = isSuccess ? 'success' : '';
    resultDiv.classList.remove('hidden');
}





