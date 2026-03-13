// Sidebar toggle for mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Google Apps Script API Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxP5kibRVFXo-HqlDhPvRSrK0Y97QTnvXDOK3YIaWoB7F_lavIkVFv-MMQhqhxc-fbY/exec';

// Sample data (fallback if API fails)
const sampleStudents = [
    {
        timestamp: '2024-01-15 10:30:00',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        course: 'RS-CIT',
        address: 'Jaipur, Rajasthan'
    },
    {
        timestamp: '2024-01-14 14:20:00',
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '9876543211',
        course: 'Tally',
        address: 'Udaipur, Rajasthan'
    }
];

// Function to fetch data from Google Sheets
async function fetchGoogleSheetData() {
    try {
        console.log('Fetching data from Google Sheets...');
        const response = await fetch(GOOGLE_SCRIPT_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }
        
        const data = await response.json();
        console.log('Data fetched successfully:', data.length, 'students');
        
        // Log first student to see column names
        if (data.length > 0) {
            console.log('Sample student data:', data[0]);
            console.log('Available fields:', Object.keys(data[0]));
        }
        
        // Normalize phone field names (handle different column names from Google Forms)
        const normalizedData = data.map(student => {
            // Try all possible phone field variations
            const phoneValue = student.phone || 
                              student['Phone Number'] || 
                              student['Mobile Number'] || 
                              student['Contact Number'] ||
                              student['Phone number'] ||
                              student['Mobile number'] ||
                              student['Contact number'] ||
                              student.mobile || 
                              student.contact ||
                              student['फ़ोन नंबर'] || // Hindi
                              student['मोबाइल नंबर'] || // Hindi
                              'N/A';
            
            console.log('Phone value for', student.name, ':', phoneValue);
            
            return {
                ...student,
                phone: phoneValue
            };
        });
        
        // Return actual data if available, otherwise fallback to sample data
        return normalizedData && normalizedData.length > 0 ? normalizedData : sampleStudents;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Using sample data as fallback');
        return sampleStudents;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Calculate statistics
function calculateStats(students) {
    const total = students.length;
    
    // Calculate new students this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = students.filter(student => {
        const studentDate = new Date(student.timestamp);
        return studentDate.getMonth() === currentMonth && 
               studentDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate growth rate (simplified)
    const growthRate = total > 0 ? Math.round((newThisMonth / total) * 100) : 0;
    
    return {
        total,
        newThisMonth,
        growthRate
    };
}

// Get course distribution
function getCourseDistribution(students) {
    const distribution = {};
    students.forEach(student => {
        const course = student.course;
        distribution[course] = (distribution[course] || 0) + 1;
    });
    return distribution;
}
