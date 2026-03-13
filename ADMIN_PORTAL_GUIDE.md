# CompuNet Admin Portal - Quick Start Guide

## 🎉 What's Been Created

A professional admin portal with:
- ✅ Secure login page with static credentials
- ✅ Dashboard with statistics and charts
- ✅ Student records table with search/filter
- ✅ Settings page for Google Sheets integration
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern gradient UI with smooth animations

## 🔐 Admin Login Credentials

```
Username: admin
Password: compunet@2024
```

## 🚀 How to Access

1. **Start your local server** (if not already running):
   ```bash
   cd public
   python3 -m http.server 8000
   ```

2. **Open the admin portal**:
   - Go to: http://localhost:8000/admin/login.html
   - Enter the credentials above
   - Click "Login to Dashboard"

3. **Explore the portal**:
   - Dashboard: View statistics and recent students
   - Students: See all student records with search
   - Settings: Configure Google Sheets integration

## 📁 File Structure

```
public/admin/
├── login.html              # Login page
├── dashboard.html          # Main dashboard
├── students.html           # All students table
├── settings.html           # Settings page
├── README.md              # Documentation
├── css/
│   └── admin.css          # All styles
└── js/
    ├── auth.js            # Authentication
    ├── admin.js           # Common functions
    ├── dashboard.js       # Dashboard logic
    └── students.js        # Students table logic
```

## 🔗 Connecting to Google Sheets

Currently showing **sample data**. To connect your actual Google Forms data:

### Method 1: Google Sheets API (Recommended)

1. **Enable Google Sheets API**:
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable "Google Sheets API"

2. **Create API Key**:
   - Go to "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

3. **Get your Sheet ID**:
   - Open your Google Forms responses sheet
   - Copy the ID from the URL:
     `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

4. **Update Settings**:
   - Go to Settings page in admin portal
   - Enter Sheet ID and API Key
   - Click "Save Settings"

5. **Update the code**:
   - Edit `public/admin/js/admin.js`
   - Replace the `fetchGoogleSheetData()` function with actual API call

### Method 2: Google Apps Script (Simpler)

1. **Create Apps Script**:
   - Open your Google Sheet
   - Extensions → Apps Script
   - Paste this code:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const students = rows.map(row => {
    return {
      timestamp: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      course: row[4],
      address: row[5]
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(students))
    .setMimeType(ContentService.MimeType.JSON);
}
```

2. **Deploy as Web App**:
   - Click "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the web app URL

3. **Update admin.js**:
   - Replace `fetchGoogleSheetData()` with:

```javascript
async function fetchGoogleSheetData() {
    try {
        const response = await fetch('YOUR_WEB_APP_URL');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
```

## 🎨 Features

### Dashboard
- Total students count
- New students this month
- Active courses count
- Growth rate percentage
- Recent students table
- Course distribution chart

### Students Page
- Searchable data table
- Sort by any column
- Pagination
- Export to Excel (can be added)
- Refresh data button

### Settings Page
- Google Sheets configuration
- Institute information display

## 📱 Mobile Responsive

The admin portal works perfectly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🔒 Security Features

- Session-based authentication
- Protected pages (redirect to login if not authenticated)
- Logout clears session
- Static credentials (single admin only)

## 🎯 Next Steps

1. **Test the portal**: Login and explore all pages
2. **Connect Google Sheets**: Follow the guide above
3. **Customize**: Update colors, add features as needed
4. **Deploy**: Host on a web server when ready

## 💡 Tips

- Keep the admin credentials secure
- Regularly backup your Google Sheets data
- Test on different devices
- Monitor student submissions daily

## 🆘 Troubleshooting

**Can't login?**
- Check credentials: `admin` / `compunet@2024`
- Clear browser cache
- Try incognito mode

**No data showing?**
- Currently showing sample data
- Follow Google Sheets integration guide above

**Page not loading?**
- Ensure server is running on port 8000
- Check browser console for errors

## 📞 Support

For questions or issues:
- Director: Gayatri Joshi (9829293303)
- Principal: Suresh Joshi (9829621004)

---

**Enjoy your professional admin portal! 🎉**
