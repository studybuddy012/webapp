// ===== USER INFO =====
const me = localStorage.getItem("me");
const other = localStorage.getItem("other");

document.getElementById("header").innerText = other;

// ===== SOCKET CONNECT =====
const SERVER_URL = "https://final--psrvgamestudio.replit.app"; // 🔥 CHANGE THIS

const socket = io(SERVER_URL, {
  transports: ["websocket"]
});

// LOGIN
socket.emit("login", { username: me });

// ===== LOAD OLD CHATS =====
socket.emit("load_messages", {
  me: me,
  other: other
});

const messages = document.getElementById("messages");
const typing = document.getElementById("typing");

// ===== SEND TEXT MESSAGE =====
function send() {
  const input = document.getElementById("msg");
  const text = input.value.trim();
  if (!text) return;

  addTextBubble(text, "me");

  socket.emit("message", {
    sender: me,
    receiver: other,
    message: text
  });

  socket.emit("typing", {
    sender: me,
    receiver: other,
    typing: false
  });

  input.value = "";
}

// ===== TYPING INDICATOR =====
document.getElementById("msg").addEventListener("input", () => {
  socket.emit("typing", {
    sender: me,
    receiver: other,
    typing: true
  });
});

// ===== RECEIVE TEXT MESSAGE =====
socket.on("message", data => {
  if (data.sender === other && data.receiver === me) {
    addTextBubble(data.message, "other");
  }
});

// ===== RECEIVE OLD MESSAGES =====
socket.on("old_messages", rows => {
  rows.forEach(row => {
    const sender = row[0];
    const msg = row[2];

    if (sender === me) {
      addTextBubble(msg, "me");
    } else {
      addTextBubble(msg, "other");
    }
  });
});

// ===== RECEIVE TYPING =====
socket.on("typing", data => {
  if (data.sender === other && data.receiver === me) {
    typing.innerText = data.typing ? `${other} is typing...` : "";
  }
});

// ===== SEND IMAGE =====
document.getElementById("photo").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    socket.emit("image", {
      sender: me,
      receiver: other,
      image: reader.result
    });

    addImageBubble(reader.result, "me");
  };
  reader.readAsDataURL(file);
});

// ===== RECEIVE IMAGE =====
socket.on("image", data => {
  if (data.sender === other && data.receiver === me) {
    addImageBubble(data.image, "other");
  }
});

// ===== UI FUNCTIONS =====
function addTextBubble(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addImageBubble(base64, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;

  const img = document.createElement("img");
  img.src = base64;
  img.style.maxWidth = "200px";
  img.style.borderRadius = "10px";

  div.appendChild(img);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
