let html5QrcodeScanner = null;

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    initScanner();
});

function initScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        },
        false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

async function onScanSuccess(decodedText) {
    console.log(`Scan result: ${decodedText}`);

    try {
        // 1. Verify session
        const { data: session, error: sessionError } = await supabaseClient
            .from('sessions')
            .select('*')
            .eq('qr_token', decodedText)
            .single();

        if (sessionError || !session) throw new Error("Invalid QR Code");

        if (new Date(session.expires_at) < new Date()) {
            throw new Error("QR Code has expired");
        }

        // 2. Mark attendance
        const { data: { user } } = await supabaseClient.auth.getUser();
        const { error: attendError } = await supabaseClient
            .from('attendance')
            .insert({
                session_id: session.id,
                student_id: user.id
            });

        if (attendError) {
            if (attendError.code === '23505') throw new Error("Attendance already marked!");
            throw attendError;
        }

        // 3. Success UI
        showSuccess(decodedText);

    } catch (err) {
        alert(err.message);
    }
}

function showSuccess(token) {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(() => {
            document.querySelector('.qr-container').style.display = 'none';
            const resultCard = document.getElementById('result-card');
            resultCard.style.display = 'block';

            const timestamp = new Date().toLocaleTimeString();
            document.getElementById('result-text').innerText =
                `Attendance successfully recorded at ${timestamp}.`;
        });
    }
}

function onScanFailure(error) {
    // Suppress noise
}
