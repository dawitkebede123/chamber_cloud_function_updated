const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotificationOnWrite = functions.database
  .ref('Almanac')
  .onWrite(async (change, context) => {
    const newRecord = change.after.val();

    // Prepare notification data
    const notificationData = {
      title: "New business added!",
      body: newRecord['Account Name'],
    };

    // Get all registered devices (replace with your token retrieval logic)
    const tokens = 'enSWWn8KQ-OhvrHVPRUpl3:APA91bGkfLvHLUhK394IlhUr_AxmnN1DgdzF8sSEuAulUCyIe012gRRNROh3tG-Sww55Q3qr6l_-_ZyKDhL9m79wP3p7qC_EIg0SgVDd0g9RHLKvXdOvDdkUiCCOApdg6D2vmMoDB28n';

    // Create a message object
    const message = {
      notification: notificationData,
      android: {
        priority: "high", // Set priority (optional)
      },
      // Add iOS specific options if needed
      token: tokens, // Broadcast to all retrieved tokens
    };

    // Send notification to all devices
    await admin.messaging().sendToDevice(message);

    console.log('Notification sent successfully to all devices!');
  });

// This function needs to be implemented based on your specific token storage method
async function getDeviceTokens() {
  // Replace this with your logic to retrieve all registered device tokens
  // This could involve querying a database or fetching from a central storage location
  const tokens = []; // Placeholder for retrieved tokens
  return tokens;
}
