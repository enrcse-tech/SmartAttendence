// Initialize Supabase and check auth
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Initial data fetch
    updateDashboard();

    // Subscribe to new attendance records
    supabaseClient
        .channel('attendance_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance' }, payload => {
            console.log('New attendance record!', payload);
            updateDashboard();
        })
        .subscribe();
});

async function updateDashboard() {
    await Promise.all([
        fetchStats(),
        fetchRecentActivity(),
        initChart()
    ]);
}

async function fetchStats() {
    try {
        // Total Students
        const { count: studentCount } = await supabaseClient
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        // Records today
        const today = new Date().toISOString().split('T')[0];
        const { count: todayCount } = await supabaseClient
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .gte('scanned_at', today);

        // Update UI
        document.querySelectorAll('.stat-value')[0].innerText = `${todayCount || 0}`;
        document.querySelectorAll('.stat-label')[0].innerText = `Today's Attendance`;

        document.querySelectorAll('.stat-value')[1].innerText = `${studentCount || 0}`;
        document.querySelectorAll('.stat-label')[1].innerText = `Active Students`;

    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

async function fetchRecentActivity() {
    try {
        const { data, error } = await supabaseClient
            .from('attendance')
            .select(`
                id,
                scanned_at,
                profiles (full_name, student_id, course)
            `)
            .order('scanned_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        const tableBody = document.getElementById('attendanceTableBody');
        tableBody.innerHTML = data.map(record => `
            <tr>
                <td>${record.profiles ? record.profiles.full_name : 'Unknown'}</td>
                <td>${record.profiles ? record.profiles.student_id : '-'}</td>
                <td>${record.profiles ? record.profiles.course : '-'}</td>
                <td>${new Date(record.scanned_at).toLocaleTimeString()}</td>
                <td><span class="status-chip status-present">PRESENT</span></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error fetching activity:', err);
    }
}

async function generateQR() {
    const placeholder = document.getElementById('qrPlaceholder');
    const timer = document.getElementById('timer');
    const qr_token = 'SESSION_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        const { error } = await supabaseClient.from('sessions').insert({
            qr_token,
            expires_at,
            created_by: user.id
        });

        if (error) throw error;

        placeholder.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qr_token}" alt="QR" style="border-radius: 8px;">`;

        startTimer(300, timer, placeholder);
    } catch (err) {
        alert('Failed to generate session: ' + err.message);
    }
}

function startTimer(duration, display, container) {
    let seconds = duration;
    const interval = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        display.innerText = `Expires in: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (--seconds < 0) {
            clearInterval(interval);
            container.innerHTML = '<span style="color: #000;">EXPIRED</span>';
            display.innerText = 'QR Code Expired.';
        }
    }, 1000);
}

async function initChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Attendance',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#6366f1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}
