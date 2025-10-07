function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const correctPassword = 'SummitLoveIt!1978';
    const resultDiv = document.getElementById('result');

    if (input === correctPassword) {
        resultDiv.innerHTML = '<strong>🎉 Congratulations you cracked it!</strong> You unlocked: "Remember, strong passwords like this keep hackers out. Submit a screenshot of this to fabiof@summithomes.com.au to be in the running to win one of 3 $50 Amazon gift vouchers."';
        resultDiv.className = 'success';
    } else {
        resultDiv.innerHTML = '<strong>❌ Not quite!</strong> Double-check the clues and try again. (Hint: No spaces!)';
        resultDiv.className = '';
    }

    resultDiv.classList.remove('hidden');
}