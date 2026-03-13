# CompuNet Computer Center - Admin Portal

A professional admin dashboard to view and manage student records from Google Forms submissions.

## Features

✅ **Secure Login** - Static admin credentials (single admin)
✅ **Dashboard** - Overview with statistics and charts
✅ **Student Records** - View all students with search and filtering
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Professional UI** - Modern gradient design with smooth animations

## Admin Credentials

```
Username: admin
Password: compunet@2024
```

## Pages

1. **login.html** - Admin login page
2. **dashboard.html** - Main dashboard with statistics
3. **students.html** - Full student records table

## How to Access

1. Open your browser and navigate to: `http://localhost:8000/admin/login.html`
2. Enter the admin credentials above
3. You'll be redirected to the dashboard

## Current Setup

The admin portal currently displays **sample data**. To connect to your actual Google Sheets:

### Option 1: Google Sheets API (Recommended)
1. Enable Google Sheets API in Google Cloud Console
2. Create API credentials
3. Update `SHEET_ID` and `API_KEY` in `js/admin.js`

### Option 2: Google Apps Script (Simpler)
1. Create a Google Apps Script web app
2. Fetch data from your Google Sheets
3. Return as JSON
4. Update the fetch URL in `js/admin.js`

## File Structure

```
admin/
├── login.html          # Login page
├── dashboard.html      # Dashboard with stats
├── students.html       # All students table
├── css/
│   └── admin.css      # Admin portal styles
└── js/
    ├── auth.js        # Authentication logic
    ├── admin.js       # Common functions
    ├── dashboard.js   # Dashboard logic
    └── students.js    # Students page logic
```

## Technologies Used

- HTML5, CSS3, JavaScript
- Bootstrap 5
- Font Awesome 6
- DataTables (for table features)
- Chart.js (for charts)
- Google Fonts (Poppins)

## Notes

- Session-based authentication (stored in sessionStorage)
- Logout clears session and redirects to login
- All pages are protected except login page
- Mobile-responsive sidebar navigation
