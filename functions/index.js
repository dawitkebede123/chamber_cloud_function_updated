import { database } from 'firebase-functions';
import { initializeApp, messaging } from 'firebase-admin';
import { getDatabase, ref, set, push, query, orderByChild, startAfter, limitToFirst, get, endAt, equalTo, endBefore } from 'firebase/database';

// export {
//   getDatabase,
//   ref,
//   set,
//   push,
//   query,
//   orderByChild,
//   startAfter,
//   limitToFirst,
//   get,
//   endAt,
//   equalTo,
//   endBefore,
// };

initializeApp();

export const sendNotificationOnWrite_updated = database
  .ref('Almanac')
  .onWrite(async (change, context) => {
    const newRecord = change.after.val();

    // Prepare notification data
    const notificationData = {
      title: "New business added!",
      body: newRecord['Account Name'],
    };

    // Define a generic topic name (can be anything)
    const topic = "all_users_topic"; // Replace with your preferred name
   
    async function getInitialTokens(firebaseApp) {
      const database = getDatabase(firebaseApp);
      const reference = ref(database, 'Notification_Token');
    
      try {
        const snapshot = await once(reference); // Fetch a single snapshot
        const tokenList = _mapSnapshotToTokenList(snapshot.val()); // Assuming _mapSnapshotToTokenList is adapted for JavaScript
        return tokenList;
      } catch (error) {
        console.error('Error fetching initial tokens:', error);
        return []; // Return empty list on error
      }
    }
    // Create a message object with the topic
    const message = {
      notification: notificationData,
      android: {
        priority: "high", // Set priority (optional)
      },
      // Add iOS specific options if needed
      topic: topic,
    };
    console.log(message)
     
    const token_list = await getInitialTokens();

   const batchedTokens = chunk(token_list, 1000); // Adjust chunk size as needed

  for (const batch of batchedTokens) {
    try {
      const response = await messaging().sendToDevice(batch, message);
      console.log('Successfully sent notification to:', response.successCount, 'devices');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
    // console.log(message:'Notification sent successfully to topic:');
  });
