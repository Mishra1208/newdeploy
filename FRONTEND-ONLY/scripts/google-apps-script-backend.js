/*
  GOOGLE APPS SCRIPT BACKEND FOR CONU PLANNER
  -------------------------------------------
  
  Steps to Deploy:
  1. Go to https://script.google.com/
  2. Create a "New Project".
  3. Paste this entire code into "Code.gs".
  4. Click "Deploy" > "New Deployment".
  5. Select type: "Web App".
  6. Description: "Contact Form V1".
  7. Execute as: "Me" (your email).
  8. Who has access: "Anyone".
  9. Click "Deploy" and Authorize access.
  10. Copy the "Web App URL" and paste it into your frontend code (line 33).
*/

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. SETUP HEADERS (Run once automatically if empty)
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Full Name", "Email", "Contact Number", "Help Type", "Suggestion/Message"]);
        // Freeze the top row
        sheet.setFrozenRows(1);
        // Make headers bold
        sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    }

    // 2. PARSE DATA
    var data;
    try {
        // Attempt to parse JSON body
        data = JSON.parse(e.postData.contents);
    } catch (err) {
        // If JSON fails, try standard form parameters
        data = e.parameter;
    }

    // 3. EXTRACT FIELDS (Matching your frontend names)
    var fullName = data.fullName || "N/A";
    var email = data.email || "N/A";
    var contact = data.contact || "N/A";
    var helpType = data.helpType || "N/A";
    var suggestion = data.suggestion || "N/A";
    var timestamp = new Date();

    // 4. APPEND ROW
    sheet.appendRow([timestamp, fullName, email, contact, helpType, suggestion]);

    // 5. RETURN SUCCESS JSON
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to test permission/setup manually
function setup() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Full Name", "Email", "Contact Number", "Help Type", "Suggestion/Message"]);
    }
}
