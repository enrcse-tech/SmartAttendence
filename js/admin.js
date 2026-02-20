// Chart Configuration
const ctx = document.getElementById('attendanceChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
            label: 'Attendance %',
            data: [85, 88, 92, 94, 91, 89],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    }
});

// Mock Attendance Data
const mockData = [
    { name: 'Alex Thompson', id: 'CS202401', course: 'Computer Science', time: '09:05 AM', status: 'present' },
    { name: 'Sarah Miller', id: 'CS202412', course: 'Computer Science', time: '09:12 AM', status: 'present' },
    { name: 'James Wilson', id: 'EE202405', course: 'Electrical Eng', time: '-', status: 'absent' },
    { name: 'Emma Davis', id: 'CS202408', course: 'Computer Science', time: '09:15 AM', status: 'present' },
    { name: 'Ryan Garcia', id: 'ME202403', course: 'Mechanical Eng', time: '09:18 AM', status: 'present' }
];

function populateTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    tableBody.innerHTML = mockData.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.course}</td>
            <td>${student.time}</td>
            <td><span class="status-chip status-${student.status}">${student.status.toUpperCase()}</span></td>
        </tr>
    `).join('');
}

// QR Generation Simulation
function generateQR() {
    const placeholder = document.getElementById('qrPlaceholder');
    const timer = document.getElementById('timer');

    // Simulate QR generation
    placeholder.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SESSION_${Date.now()}" alt="QR">`;
    placeholder.style.background = 'white';

    let seconds = 300;
    const interval = setInterval(() => {
        seconds--;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.innerText = `Expires in: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (seconds <= 0) {
            clearInterval(interval);
            placeholder.innerHTML = '<span style="color: #000;">EXPIRED</span>';
            timer.innerText = 'QR Code Expired. Generate a new one.';
        }
    }, 1000);
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    populateTable();
});
