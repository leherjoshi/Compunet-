function doGet(e) {
  // Get the first sheet (Form Responses)
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var jsonData = [];
  
  // Start from row 1 (skip header row 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    // Skip empty rows
    if (!row[1]) continue;
    
    // Based on your sheet structure:
    // Column A (0): Timestamp
    // Column B (1): Name
    // Column C (2): Father Name
    // Column D (3): Date of birth
    // Column E (4): Email
    // Column F (5): Address
    // Column G (6): Phone number
    // Column H (7): COURSE Name
    // Column I (8): Passport Size photo
    
    jsonData.push({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[4] || '',
      phone: row[6] || '',  // Column G is Phone number
      course: row[7] || '',
      address: row[5] || ''
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
