import { firebaseConfig, MESSAGES_KEY } from "./firebase_config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import {
  getDatabase,
  ref,
  child,
  get,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { selected_uid,get_messages_raw } from "./main.js";

const db = getDatabase(app);

const clientsRef = ref(db, MESSAGES_KEY);

// Listen for changes
onValue(clientsRef, (snapshot) => {

  if(snapshot.exists()){
 get_messages_raw(MESSAGES_KEY,selected_uid);
  }
     // document.getElementById("message_box").value = messageText;
  
});

 export function deleteMessage(msg_key,input_uid){
  return new Promise((resolve) => {
  remove(ref(db,MESSAGES_KEY+'/'+input_uid+'/'+msg_key))
  .then(()=>{

    resolve(true);
  })
  .catch((error)=>{
    resolve(false);
  })
});
  }
 

export function PushMessage(input_message_key, input_uid, input_message) {
  const clientsRef = ref(db, input_message_key + "/" + input_uid);
  // Push a single value with a random key
  push(clientsRef, input_message)
    .then(() => {
      //document.getElementById("inputmsg").value="";
      // console.log("Single value pushed with a random key!");
      //return true;
     // alert("sent");
    })
    .catch((error) => {
      console.error("Error:", error);
      //return false;
      alert("send failed!");
    });
}
export function get_info(input_info_key, input_uid) {
  const dbref = ref(db);
  let messageText = "";
  get(child(dbref, input_info_key + "/" + input_uid)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      if (data) {
        Object.keys(data).forEach((key) => {
          messageText += `> ${data[key]}\n`;
        });
      } else {
        messageText = "";
      }

      // Set the value inside the <textarea>
    } else {
      alert("Employee dont exist");
    }
  });
}
/*

export async function ReadMessage(input_message_key, input_uid) {
  return new Promise((resolve) => {
    const dbref = ref(db);
    let messageText = "";
    get(child(dbref, input_message_key + "/" + input_uid)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          Object.keys(data).forEach((key) => {
            messageText += `${data[key]}\n`;
          });
          resolve(messageText);
        } else {
          resolve(null);
        }

        // Set the value inside the <textarea>
      } else {
        resolve(null);
      }
    });
  });
  //return messageText;
}
*/
export async function ReadMessageRaw(input_message_key, input_uid) {
  return new Promise((resolve) => {
    const dbref = ref(db);
    get(child(dbref, input_message_key + "/" + input_uid)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          resolve(data);
        } else {
          resolve(null);
        }

        // Set the value inside the <textarea>
      } else {
        resolve(null);
      }
    });
  });
  //return messageText;
}


export async function getmyinfo(input_info_key, input_uid) {
  return new Promise((resolve) => {
    const dbRef = ref(db, input_info_key + "/" + input_uid + "/info");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let dataStr = snapshot.val(); // Get the stored string
          let arr = dataStr.split(",").map((item) => item.trim()); // Split and trim

          if (arr.length === 3) {
            //  alert(firstName + " " + lastName + " " + email);
            resolve(dataStr);
          } else {
            resolve(null);
            console.error("Invalid data format:", dataStr);
          }
        } else {
          resolve(null);
          console.log("No data found for this user.");
        }
      })
      .catch((error) => {
        resolve(null);
        console.error("Error fetching data:", error);
      });
  });
  //return messageText;
}

export function AddInfo(
  input_info_key,
  fname_input,
  lname_input,
  email_input,
  input_uid
) {
  set(ref(db, input_info_key + "/" + input_uid), {
    info: fname_input + "," + lname_input + "," + email_input,
  })
    .then(() => {
      alert("Info added successfully!");
    })
    .catch((error) => {
      alert("Unsuccessful!");
      console.log(error);
    });
}
/*
export async function findUidByEmail(targetEmail) {
  return new Promise((resolve) => {
    const dbRef = ref(db, INFO_KEY);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();

          for (const [uid, data] of Object.entries(usersData)) {
            const infoArray = data.info.split(","); // Convert string to array
            const email = infoArray[2]; // Extract email

            if (email === targetEmail) {
              alert(`Found UID: ${uid} for email: ${targetEmail}`);
              //  console.log(`Found UID: ${uid} for email: ${targetEmail}`);
              resolve(uid); // Return the matching UID
            }
          }
        } else {
          resolve(null);
          console.log("No data found for this user.");
        }
      })
      .catch((error) => {
        resolve(null);
        console.error("Error fetching data:", error);
      });
  });
}
*/
export async function GetInfoData(info_key) {
  return new Promise((resolve) => {
    const dbRef = ref(db, info_key);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          resolve(usersData);
        } else {
          resolve(null);
        //  console.log("No data found for this user.");
        }
      })
      .catch((error) => {
        resolve(null);
      //  console.error("Error fetching data:", error);
      });
  });
}
