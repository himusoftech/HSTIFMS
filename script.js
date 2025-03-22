function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle("Feedback Management System");
}

function getFeedbackData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Feedback");
    
    if (!sheet) {
        Logger.log("❌ ERROR: 'Feedback' sheet not found!");
        return { error: "Sheet not found" };
    }

    var data = sheet.getDataRange().getValues();

    if (!data || data.length <= 1) { // Check if there's data (excluding headers)
        Logger.log("⚠️ No feedback data found.");
        return { feedback: [] }; // Return empty array instead of null
    }

    var feedbackList = [];
    for (var i = 1; i < data.length; i++) { // Skip headers
        feedbackList.push({
            UIN: data[i][0] || "N/A",
            Timestamp: data[i][1] || "N/A",
            Name: data[i][2] || "N/A",
            Mobile: data[i][3] || "N/A",
            Feedback: data[i][4] || "N/A",
            Email: data[i][5] || "N/A",
            Status: data[i][6] || "N/A",
            AssignedTo: data[i][7] || "N/A",
            Resolution: data[i][8] || "N/A"
        });
    }

    Logger.log("✅ Returning Feedback Data: " + JSON.stringify(feedbackList));  
    return { 
     feedbackList };  // ✅ Ensure data is returned
    // return { 
      // feedback: [
      //         { UIN:"FB-45338",Timestamp:"2025-03-18T09:39:00.942Z",Name:"lokesh",Mobile:9901988388,Feedback:"testing",Email:"lokeshramdas@gmail.com",Status:"Pending",AssignedTo:"Assigned TO",Resolution:"awiting" },
      //         {UIN:"FB-9",Timestamp:"2025-03-18T09:39:00.942Z",Name:"lokesh",Mobile:9901988388,Feedback:"testing",Email:"lokeshramdas@gmail.com",Status:"Pending",AssignedTo:"Assigned TO",Resolution:"awiting"}
      //    ] 
      //   };

     
}




function assignFeedback(refNum, assigneeName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Feedback");
    var data = sheet.getDataRange().getValues();
    var managementSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Management");
    var managementData = managementSheet.getDataRange().getValues();

    var assigneeEmail = "";

    for (var i = 1; i < managementData.length; i++) {
        if (managementData[i][0] === assigneeName) {
            assigneeEmail = managementData[i][1];
            break;
        }
    }

    for (var i = 1; i < data.length; i++) {
        if (data[i][0] === refNum) {
            sheet.getRange(i + 1, 8).setValue(assigneeName);
            sheet.getRange(i + 1, 7).setValue("In Process");

            if (assigneeEmail) {
                var subject = "New Feedback Assigned - " + refNum;
                var body = "Dear " + assigneeName + ",\n\nYou have been assigned feedback: " + refNum + "\n\nPlease review and provide a resolution.\n\nRegards,\nFMS-SSGT";
                MailApp.sendEmail(assigneeEmail, subject, body);
            }

            return "Feedback assigned successfully.";
        }
    }
    return "Feedback not found.";
}
