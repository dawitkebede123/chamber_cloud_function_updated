const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendNotificationOnWrite = functions.database
  .ref('Query10')
  .onWrite(async (change, context) => {
    const newRecord = change.after.val();

    // Prepare notification data (customize title, body, etc.)
    const notificationData = {
      title: "New business added!",
      body: ` ${context.params['Account Name']}`,
    };

    // Send notification using FCM
    const message = {
      notification: notificationData,
      android: {
        priority: "high", // Set priority (optional)
      },
      // Add iOS specific options if needed
    };

    await admin.messaging().sendToDevice(message);

    console.log('Notification sent successfully!');
  });
