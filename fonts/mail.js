// Falling snow
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = "❄";
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.animationDuration = (Math.random() * 3 + 2) + "s";
  document.body.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 5000);
}
setInterval(createSnowflake, 200);

// Message modal
const previews = document.querySelectorAll(".message-preview");
const modal = document.getElementById("modal");
const modalTo = document.getElementById("modal-to");
const modalFrom = document.getElementById("modal-from");
const modalMessage = document.getElementById("modal-message");

previews.forEach(preview => {
  preview.addEventListener("click", () => {
    modalTo.textContent = "To: " + preview.dataset.to;
    modalFrom.textContent = "From: " + preview.dataset.from;
    modalMessage.textContent = preview.dataset.message;
    modal.style.display = "flex";
  });
});

function closeModal() {
  modal.style.display = "none";
}
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Snow trail
document.addEventListener("mousemove", (e) => {
  const snow = document.createElement("div");
  snow.textContent = "❄️";
  snow.style.position = "absolute";
  snow.style.left = e.pageX + "px";
  snow.style.top = e.pageY + "px";
  snow.style.pointerEvents = "none";
  snow.style.fontSize = "1rem";
  snow.style.opacity = 0.8;
  snow.style.zIndex = 9999;
  snow.style.transition = "transform 1s ease-out, opacity 1s ease-out";
  document.body.appendChild(snow);

  setTimeout(() => {
    snow.style.transform = "translateY(20px)";
    snow.style.opacity = 0;
  }, 10);

  setTimeout(() => snow.remove(), 1000);
});

// Envelope animation
const envelope = document.getElementById('envelope');
envelope.querySelector('iframe').addEventListener('load', () => {
  envelope.classList.add('animate');
  setTimeout(() => envelope.classList.remove('animate'), 1200);
});

// Elf Mode
const elfModeBtn = document.getElementById("elfModeBtn");
const jingle = new Audio("jingle.mp3");

elfModeBtn.addEventListener("click", () => {
  const isElfModeOn = document.documentElement.classList.toggle("elf-mode");
  
  if (isElfModeOn) {
    jingle.currentTime = 0; // Restart from beginning
    jingle.play();
  } else {
    jingle.pause();
    jingle.currentTime = 0; // Reset to start
  }
});
