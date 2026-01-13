// 🔐 CHANGE THIS SECRET CODE
const SECRET_CODE = "bubu";  // <-- sirf tum dono ko pata ho

function unlock() {
  const input = document.getElementById("code").value;
  const error = document.getElementById("error");

  if (input === SECRET_CODE) {
    document.getElementById("lock").style.display = "none";
    document.getElementById("content").classList.remove("hidden");
  } else {
    error.innerText = "❌ Wrong code. Access denied.";
  }
}
