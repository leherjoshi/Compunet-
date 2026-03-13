// Authentication check for admin pages
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Check authentication on page load
if (!window.location.pathname.includes('login.html')) {
    checkAuth();
}
