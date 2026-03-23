// Typing effect with blinking cursor
function typeEffect(element, text, speed, callback) {
  let i = 0;

  // Create cursor span
  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  element.appendChild(cursor);

  function typing() {
    if (i < text.length) {
      // Insert character before cursor
      cursor.insertAdjacentText("beforebegin", text.charAt(i));
      i++;
      setTimeout(typing, speed);
    } else {
      // Remove cursor after typing finishes
      cursor.remove();
      if (callback) callback();
    }
  }
  typing();
}

// Intro sequence
window.onload = function() {
  const bg2 = document.getElementById("bg2");
  const bg3 = document.getElementById("bg3");
  const staticSound = document.getElementById("static-sound");
  const intro = document.getElementById("intro");
  const mainContent = document.getElementById("main-content");

  // Step 1: Show background2 and play sound once
  bg2.style.opacity = "1";
  setTimeout(() => {
    if (staticSound) {
      staticSound.muted = false;
      staticSound.currentTime = 0;
      staticSound.play().catch(() => {
        console.log("Autoplay blocked, will play on user interaction.");
      });
    }
    bg2.style.filter = "blur(6px)";
  }, 200);

  // Step 2: After 2s, switch to background3
  setTimeout(() => {
    bg2.style.opacity = "0";
    bg3.style.opacity = "1";
    bg3.style.filter = "blur(3px)";
    setTimeout(() => { bg3.style.filter = "blur(0px)"; }, 800);
  }, 2200);

  // Step 3: After another 2s, show login page
  setTimeout(() => {
    intro.style.display = "none";
    mainContent.style.display = "block";

    if (staticSound) {
      staticSound.pause();
      staticSound.currentTime = 0;
    }

    const heading = document.getElementById("main-heading");
    const quote = document.getElementById("quote");
    const headingText = heading.innerText;
    const quoteText = quote.innerText;

    heading.innerText = "";
    quote.innerText = "";

    typeEffect(heading, headingText, 100, () => {
      typeEffect(quote, quoteText, 50);
    });
  }, 4200);
};

// ✅ Login form handler with glitch + redirect
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (username === "admin" && password === "admin123") { // replace with your credentials
    message.textContent = "Access Granted";
    message.setAttribute("data-text", "Access Granted");
    message.classList.add("glitch");
    message.style.color = "lime";

    // Redirect after glitch animation
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  } else {
    message.textContent = "Access Denied";
    message.setAttribute("data-text", "Access Denied");
    message.classList.add("glitch");
    message.style.color = "red";
  }
});