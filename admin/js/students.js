// Students page initialization
let studentsDataTable;

document.addEventListener('DOMContentLoaded', async function() {
    await loadStudentsTable();
});

// Load students table with DataTables
async function loadStudentsTable() {
    const students = await fetchGoogleSheetData();
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No students found</td></tr>';
        return;
    }
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td><span class="badge bg-primary">${student.course}</span></td>
            <td>${student.address}</td>
            <td>${formatDate(student.timestamp)}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Initialize DataTables
    if (studentsDataTable) {
        studentsDataTable.destroy();
    }
    
    studentsDataTable = $('#studentsTable').DataTable({
        pageLength: 10,
        order: [[6, 'desc']], // Sort by date descending
        language: {
            search: "Search students:",
            lengthMenu: "Show _MENU_ students per page",
            info: "Showing _START_ to _END_ of _TOTAL_ students",
            infoEmpty: "No students found",
            infoFiltered: "(filtered from _MAX_ total students)"
        }
    });
}

// Refresh data function
async function refreshData() {
    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');
    
    icon.classList.add('fa-spin');
    btn.disabled = true;
    
    await loadStudentsTable();
    
    setTimeout(() => {
        icon.classList.remove('fa-spin');
        btn.disabled = false;
    }, 1000);
}
