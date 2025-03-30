

/*
export function load_messages(msgobj) {
  const container = document.getElementById("messagesContainer");
  container.innerHTML = ""; // Clear previous messages

  let msgObj = [];
  msgObj = msgobj;
  if (msgobj != null) {
    msgObj.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.innerHTML = `
          <p>${msg.text} <button onclick="deleteMessage('${msg.id}')">🗑️</button></p>
        `;
      container.appendChild(messageDiv);

      //load_messages(msg.text,msg.id);
    });
  } else {
    container.innerHTML = "";
  }
}
*/
export function set_header_txt(input_txt) {
  document.getElementById("message_header").textContent = input_txt;
}

function deleteMessage(input_key){

}

export function addItem(txt, val) {
  let select = document.getElementById("emailDropdown");
  let option = new Option(txt, val);
  select.add(option);
}
