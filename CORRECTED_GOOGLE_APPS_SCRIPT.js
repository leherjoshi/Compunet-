function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form_Responses');
  var data = sheet.getDataRange().getValues();
  
  var jsonData = [];
  
  // Start from row 1 (skip header row 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    // Skip empty rows
    if (!row[1]) continue;
    
    jsonData.push({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[4] || '',
      phone: row[6] || '',  // Column G (index 6) is Phone number
      course: row[7] || '',
      address: row[5] || ''
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
