import {
  AddInfo,
  getmyinfo,
  PushMessage,
  ReadMessage,
  GetInfoData,
} from "./firebase_db.js";
import {
  signin_firebase,
  signout_firebase,
  signup_firebase,
} from "./firebase_auth.js";
import { MESSAGES_KEY, INFO_KEY } from "./firebase_config.js";

export let account_uid = "";
export let selected_uid="";
let myfirstname = "";

function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("displ").innerHTML = data;
      if (page === "chat.html") {
        reload_messages();
        document.getElementById("emailDropdown").addEventListener("change", function() {
          let selectedOption = this.options[this.selectedIndex];
          if(selectedOption.value!=null){
            selected_uid=selectedOption.value;
            get_messages(MESSAGES_KEY,selected_uid);
          }
         
        });
      }
    })
    .catch((error) => console.error("Error loading page:", error));
}

async function signUpAndLoad(input_email, input_password) {
  const success = await signup_firebase(input_email, input_password); // Wait for the function to resolve
  if (success != null) {
    // If it resolves to true

    return success;
  } else {
    return null;
  }
}

async function signInAndLoad(input_email, input_password) {
  const success = await signin_firebase(input_email, input_password); // Wait for the function to resolve
  if (success != null) {
    // If it resolves to true
    //  alert("sign_in test");
    return success;
  } else {
    return null;
  }
}

function check_credential_signup(
  input_fname,
  input_lname,
  input_email,
  input_password1,
  input_password2
) {
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let namePattern = /^[A-Za-z ]{2,}$/;

  if (namePattern.test(input_fname)) {
  } else {
    alert("invalid first name!");
    return false;
  }
  if (namePattern.test(input_lname)) {
  } else {
    alert("invalid Last name!");

    return false;
  }

  if (input_email != null && emailPattern.test(input_email)) {
  } else {
    alert("email incorrect!");
    return false;
  }
  if (input_password1 == null) {
    alert("Empty password!");
    return false;
  }
  if (input_password2.length < 6) {
    alert("Password must be at 6 characters.");

    return false;
  }
  if (input_password1 === input_password2) {
    return true;
  } else {
    alert("Password dont match!");
    return false;
  }
}

function check_credential_signin(input_email, input_password) {
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input_email)) {
    alert("Email incorrect!");
    return false;
  }
  if (input_password.length < 6) {
    alert("Password atleast 6 characters!");
  }
  return true;
}



document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "openForm") {
    // alert("hello");
    loadPage("signin.html");
    document.getElementById("displ").style.display = "flex";
  } else if (event.target && event.target.id === "closeSignin") {
    document.getElementById("displ").style.display = "none";
  } else if (event.target && event.target.id === "openSignup") {
    loadPage("signup.html");
    document.getElementById("displ").style.display = "flex";
  } else if (event.target && event.target.id === "closeSignup") {
    document.getElementById("displ").style.display = "none";
  } else if (event.target && event.target.id === "signinbtn") {
    let signin_email = document.getElementById("signin_email").value;
    let signin_password = document.getElementById("signin_password").value;

    if (check_credential_signin(signin_email, signin_password)) {
      signInAndLoad(signin_email, signin_password)
        .then((USER_ID) => {
          if (USER_ID) {
            account_uid = USER_ID;
            loadPage("chat.html");
            DownLoadInfoData();
            get_my_info(INFO_KEY, account_uid);
            selected_uid=account_uid;
            // get_name(INFO_KEY, account_uid);
            // alert(myname);
            //alert("Welcome");

            // ReadMessage(MESSAGES_KEY, account_uid);
          } else {
            alert("Sign-in failed.");
          }
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
        });
    }
  } else if (event.target && event.target.id === "signupbtn") {
    let myfname = document.getElementById("RFname").value;
    let mylname = document.getElementById("RLname").value;
    let signup_email = document.getElementById("REmail").value;
    let signup_password1 = document.getElementById("Rpassword1").value;
    let signup_password2 = document.getElementById("Rpassword2").value;

    if (
      check_credential_signup(
        myfname,
        mylname,
        signup_email,
        signup_password1,
        signup_password2
      ) === true
    ) {
      signUpAndLoad(signup_email, signup_password2)
        .then((USER_ID) => {
          if (USER_ID) {
            //  account_uid = USER_ID;
            AddInfo(INFO_KEY, myfname, mylname, signup_email, USER_ID);
            loadPage("signin.html");
          } else {
            alert("Sign-in failed. Incorrect password or email");
          }
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
        });
    }
  } else if (event.target && event.target.id === "sendMsgBtn") {
    let msg = document.getElementById("inputmsg").value;
    // alert(account_uid);
    msg = myfirstname + ": " + msg;
    PushMessage(MESSAGES_KEY, selected_uid, msg);
    document.getElementById("inputmsg").value = "";
  } else if (event.target && event.target.id === "closechatbtn") {
    SignOut_FireBase()
      .then((RESULTS) => {
        if (RESULTS != null) {
          alert(RESULTS + " " + myfirstname + " Come again!");
          document.getElementById("displ").style.display = "none";
        } else {
          alert("failed signout");
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  } else if (event.target && event.target.id === "readmsgbtn") {
    get_data(MESSAGES_KEY, account_uid);
  } else if (event.target && event.target.id === "search_email_uid_btn") {
    let signin_email = document.getElementById("signin_email").value;
    search_uid_by_email(signin_email)
      .then((RESULTS) => {
        if (RESULTS) {
          alert(RESULTS);
        } else {
          alert("Failed to get data!");
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }
});
/*
function get_name(input_key, input_uid) {
  get_my_info(input_key, input_uid)
    .then((RESULTS) => {
      if (RESULTS) {
        let dataStr = RESULTS;
        let arr = dataStr.split(",").map((item) => item.trim());
        if (arr.length === 3) {
          myfirstname = arr[0];
          alert("Welcome " + arr[0] + " " + arr[1]);
        }
      } else {
        alert("Failed to get data!");
      }
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
    });
}

  */
/*
 function reload_my_msgbox(input_key, input_uid) {
  get_messages(input_key, input_uid)
    .then((RESULTS) => {
      if (RESULTS != null) {
        document.getElementById("message_box").value = RESULTS;
      } else {
        alert("Failed to get data!");
      }
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
    });
}
*/
export function reload_messages() {
  //reload_my_msgbox(MESSAGES_KEY, account_uid);
  get_messages(MESSAGES_KEY,account_uid);
}
export async function get_messages(input_message_key, input_uid) {
  const success = await ReadMessage(input_message_key, input_uid);
  if (success != null) {
    document.getElementById("message_box").value = success;
  } else {
    //return null;
  }
}

async function get_my_info(input_info_key, input_uid) {
  const success = await getmyinfo(input_info_key, input_uid);
  if (success != null) {
    // return success;
    let dataStr = success;
    let arr = dataStr.split(",").map((item) => item.trim());
    if (arr.length === 3) {
      myfirstname = arr[0];
      alert("Welcome " + arr[0] + " " + arr[1]);
    }
  }
}

async function SignOut_FireBase() {
  const success = await signout_firebase();
  if (success != null) {
    return success;
  } else {
    return null;
  }
}
/*
async function search_uid_by_email(input_email) {
  const success = await findUidByEmail(input_email);
  if (success != null) {
    return success;
  } else {
    return null;
  }
}
*/
async function DownLoadInfoData() {
  const success = await GetInfoData(INFO_KEY);
  if (success != null) {
    const usersData = success;
    addItem("Select contacts", null);
    for (const [uid, data] of Object.entries(usersData)) {
      const infoArray = data.info.split(","); // Convert string to array
      const email = infoArray[2]; // Extract email
      addItem(email, uid);
    }
  }
}
function addItem(txt, val) {
  let select = document.getElementById("emailDropdown");
  let option = new Option(txt, val);
  select.add(option);
}
