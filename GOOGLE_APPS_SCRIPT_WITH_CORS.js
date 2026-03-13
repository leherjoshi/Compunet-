function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var jsonData = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[1]) continue;
    
    jsonData.push({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[4] || '',
      phone: row[6] || '',
      course: row[7] || '',
      address: row[5] || ''
    });
  }
  
  var output = ContentService.createTextOutput(JSON.stringify(jsonData));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers to allow requests from any origin
  return output;
}
