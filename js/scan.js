function onScanSuccess(decodedText, decodedResult) {
    // Handle the scanned code
    console.log(`Code matched = ${decodedText}`, decodedResult);

    // Stop the scanner
    html5QrcodeScanner.clear().then(_ => {
        // Show success UI
        document.querySelector('.qr-container').style.display = 'none';
        const resultCard = document.getElementById('result-card');
        resultCard.style.display = 'block';

        const timestamp = new Date().toLocaleTimeString();
        document.getElementById('result-text').innerText =
            `Attendance for Session ${decodedText.split('_')[1] || 'Main'} successfully recorded at ${timestamp}.`;

        // In a real app, you would send decodedText to your backend here
        // fetch('/api/attendance', { method: 'POST', body: JSON.stringify({ token: decodedText }) });
    }).catch(error => {
        console.warn("Failed to clear scanner", error);
    });
}

function onScanFailure(error) {
    // Just silenty fail for most cases to avoid UI spam
    // console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    },
    /* verbose= */ false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
