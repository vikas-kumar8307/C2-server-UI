// Append messages to the logs panel
function logMessage(message) {
  const logs = document.getElementById("logs");
  if (logs) {
    const p = document.createElement("p");
    p.textContent = message;
    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;
  }
}

// Send command to Flask backend
async function sendCommand() {
  const commandInput = document.getElementById("command");
  const command = commandInput.value.trim();
  if (!command) return;

  logMessage("[>] Executing: " + command);

  try {
    const response = await fetch("http://127.0.0.1:8080/send_command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command })
    });

    const data = await response.json();

    // Display result (help text, screenshot confirmation, etc.)
    if (typeof data.result === "string") {
      logMessage("[✓] " + data.result);
    } else {
      logMessage("[✓] Command executed successfully.");
    }
  } catch (err) {
    logMessage("[!] Error: " + err.message);
  }

  commandInput.value = "";
}

// Auto-refresh logs (for logs.html page)
async function refreshLogs() {
  try {
    const response = await fetch("http://127.0.0.1:8080/get_logs");
    const data = await response.json();
    const logs = document.getElementById("logs");
    if (logs) {
      logs.innerHTML = "";
      data.forEach(entry => {
        const p = document.createElement("p");
        p.textContent = entry;
        logs.appendChild(p);
      });
      logs.scrollTop = logs.scrollHeight;
    }
  } catch (err) {
    console.error("Failed to fetch logs:", err);
  }
}

// Refresh logs every 3 seconds (only if logs panel exists)
setInterval(refreshLogs, 3000);