// Dashboard initialization
document.addEventListener('DOMContentLoaded', async function() {
    // Fetch student data
    const students = await fetchGoogleSheetData();
    
    // Update statistics
    updateStatistics(students);
    
    // Load recent students table
    loadRecentStudents(students);
    
    // Load course distribution chart
    loadCourseChart(students);
});

// Update statistics cards
function updateStatistics(students) {
    const stats = calculateStats(students);
    
    document.getElementById('totalStudents').textContent = stats.total;
    document.getElementById('newStudents').textContent = stats.newThisMonth;
    document.getElementById('enrollmentRate').textContent = stats.growthRate + '%';
}

// Load recent students table
function loadRecentStudents(students) {
    const tbody = document.getElementById('recentStudentsBody');
    tbody.innerHTML = '';
    
    // Get last 5 students
    const recentStudents = students.slice(-5).reverse();
    
    if (recentStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No students found</td></tr>';
        return;
    }
    
    recentStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td><span class="badge bg-primary">${student.course}</span></td>
            <td>${formatDate(student.timestamp)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load course distribution chart
function loadCourseChart(students) {
    const distribution = getCourseDistribution(students);
    const ctx = document.getElementById('courseDistributionChart');
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(distribution),
            datasets: [{
                data: Object.values(distribution),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe',
                    '#00f2fe',
                    '#43e97b',
                    '#38f9d7',
                    '#fa709a',
                    '#fee140',
                    '#30cfd0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Poppins'
                        }
                    }
                }
            }
        }
    });
}
