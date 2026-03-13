# Google Apps Script Fix for Phone Number Issue

## Problem
The phone numbers are showing as timestamps because the Google Apps Script is mapping columns incorrectly.

## Solution
Replace your Google Apps Script code with this corrected version:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1');
  var data = sheet.getDataRange().getValues();
  
  // Get headers from first row
  var headers = data[0];
  
  // Find column indices
  var timestampCol = headers.indexOf('Timestamp');
  var nameCol = headers.indexOf('Name') >= 0 ? headers.indexOf('Name') : headers.indexOf('नाम');
  var emailCol = headers.indexOf('Email') >= 0 ? headers.indexOf('Email') : headers.indexOf('ईमेल');
  var phoneCol = headers.indexOf('Phone Number') >= 0 ? headers.indexOf('Phone Number') : 
                 headers.indexOf('Mobile Number') >= 0 ? headers.indexOf('Mobile Number') :
                 headers.indexOf('Contact Number') >= 0 ? headers.indexOf('Contact Number') :
                 headers.indexOf('फ़ोन नंबर');
  var courseCol = headers.indexOf('Course') >= 0 ? headers.indexOf('Course') : headers.indexOf('कोर्स');
  var addressCol = headers.indexOf('Address') >= 0 ? headers.indexOf('Address') : headers.indexOf('पता');
  
  var jsonData = [];
  
  // Start from row 1 (skip header row 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    jsonData.push({
      timestamp: row[timestampCol] || '',
      name: row[nameCol] || '',
      email: row[emailCol] || '',
      phone: row[phoneCol] || '',
      course: row[courseCol] || '',
      address: row[addressCol] || ''
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Steps to Fix:

1. Open your Google Sheet with form responses
2. Go to Extensions → Apps Script
3. Replace the existing code with the code above
4. Click "Deploy" → "Manage deployments"
5. Click the edit icon (pencil) on your existing deployment
6. Change "Version" to "New version"
7. Click "Deploy"
8. The URL will remain the same, but the data mapping will be fixed

## What This Does:

- Automatically detects column names (works with English and Hindi)
- Maps columns correctly by name instead of by position
- Handles different variations of column names (Phone Number, Mobile Number, Contact Number)
- Returns properly formatted JSON data

After deploying this fix, refresh your admin portal and the phone numbers should display correctly!
