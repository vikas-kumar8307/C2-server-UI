// ==========================================
// 1. Chart.js Initialization
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('activityChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const activityData = {
      labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
      datasets: [{
        label: 'Beacon Check-ins',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4 
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: activityData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }
});

// ==========================================
// 2. Terminal Console Logic
// ==========================================
const commandInput = document.getElementById("command");
const logsPanel = document.getElementById("logs");

if (commandInput) {
  commandInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCommand();
    }
  });
}

function appendLog(message, type) {
  if (!logsPanel) return;
  const p = document.createElement("p");
  p.textContent = message;
  p.className = `log-${type}`;
  logsPanel.appendChild(p);
  logsPanel.scrollTop = logsPanel.scrollHeight;
}

function sendCommand() {
  if (!commandInput) return;
  const command = commandInput.value.trim();
  if (!command) return;

  appendLog(`root@c2:~# ${command}`, "cmd");
  commandInput.value = "";
  commandInput.disabled = true;

  setTimeout(() => {
    if (command.toLowerCase() === "help") {
      appendLog("Available commands: help, whoami, ping, sysinfo", "success");
    } else if (command.toLowerCase() === "whoami") {
      appendLog("nt authority\\system", "success");
    } else {
      appendLog(`[✓] Command '${command}' queued for execution.`, "success");
    }
    commandInput.disabled = false;
    commandInput.focus();
  }, 600); 
}

// ==========================================
// 3. Modal & Payload Generation Logic
// ==========================================
const payloadModal = document.getElementById('payloadModal');
const generateBtn = document.getElementById('generateBtn');
const payloadOutput = document.getElementById('payloadOutput');

function openPayloadModal() {
  if (payloadModal) {
    payloadModal.style.display = 'flex';
    if (payloadOutput) payloadOutput.style.display = 'none';
    if (generateBtn) {
      generateBtn.innerHTML = '<i class="ph ph-gear-six"></i> Build';
      generateBtn.disabled = false;
    }
  }
}

function closePayloadModal() {
  if (payloadModal) {
    payloadModal.style.display = 'none';
  }
}

function simulatePayloadGeneration() {
  if (!generateBtn || !payloadOutput) return;
  
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Compiling...';
  payloadOutput.style.display = 'none';

  setTimeout(() => {
    generateBtn.innerHTML = '<i class="ph ph-check"></i> Success';
    payloadOutput.style.display = 'block';
    appendLog("[System] New payload compiled successfully. Ready for deployment.", "success");
  }, 2000);
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
  if (event.target == payloadModal) {
    closePayloadModal();
  }
}

// ==========================================
// 4. View Navigation Logic (Single Page App)
// ==========================================
function switchView(viewId, clickedElement) {
  // Hide all view sections
  const views = document.querySelectorAll('.view-section');
  views.forEach(view => {
    view.classList.remove('active');
  });

  // Show the targeted view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update the active state on the sidebar
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(li => {
    li.classList.remove('active');
  });
  
  if (clickedElement) {
    clickedElement.parentElement.classList.add('active');
    
    // Update the page title dynamically
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const clickedText = clickedElement.innerText.trim();
    
    if (pageTitle && pageSubtitle) {
      if (clickedText === "Dashboard") {
        pageTitle.innerText = "Command Center";
        pageSubtitle.innerText = "Active Deployments & Telemetry";
      } else if (clickedText === "Audit Logs") {
        pageTitle.innerText = "System Audit Trail";
        pageSubtitle.innerText = "Immutable log of operator actions and network events";
      } else if (clickedText === "File Explorer") {
        pageTitle.innerText = "Remote File System";
        pageSubtitle.innerText = "Browse and manage target files";
      } else if (clickedText === "Operators") {
        pageTitle.innerText = "Team Roster";
        pageSubtitle.innerText = "Manage access and permissions";
      } else if (clickedText === "Settings") {
        pageTitle.innerText = "Server Configuration";
        pageSubtitle.innerText = "C2 backend and OpSec preferences";
      }
    }
  }
}

// ==========================================
// 5. Audit Logs Logic
// ==========================================
const systemLogs = [
  { time: "2026-03-31 16:45:02", type: "COMMAND", ip: "192.168.1.10", user: "admin", details: "Executed: 'whoami /priv' on BCN-01" },
  { time: "2026-03-31 16:42:15", type: "COMMAND", ip: "10.0.5.22", user: "admin", details: "Executed: 'ls -la /etc' on BCN-02" },
  { time: "2026-03-31 15:30:00", type: "CONNECTION", ip: "10.0.5.22", user: "SYSTEM", details: "New beacon check-in (Linux ELF)" },
  { time: "2026-03-31 15:10:44", type: "LOGIN", ip: "203.0.113.45", user: "admin", details: "Successful operator authentication" },
  { time: "2026-03-31 14:05:12", type: "LOGIN", ip: "198.51.100.2", user: "UNKNOWN", details: "Failed login attempt (Invalid Passphrase)" },
  { time: "2026-03-31 12:22:01", type: "CONNECTION", ip: "192.168.1.10", user: "SYSTEM", details: "New beacon check-in (Windows .exe)" }
];

function renderLogs(data) {
  const tbody = document.getElementById("logTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = "";
  data.forEach(log => {
    let typeColor = "";
    if (log.type === "LOGIN") typeColor = "color: var(--accent-blue); font-weight: bold;";
    if (log.type === "COMMAND") typeColor = "color: var(--accent-orange); font-weight: bold;";
    if (log.type === "CONNECTION") typeColor = "color: var(--accent-green); font-weight: bold;";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="mono" style="color: var(--text-muted);">${log.time}</td>
      <td style="${typeColor}">[${log.type}]</td>
      <td class="mono">${log.ip}</td>
      <td>${log.user}</td>
      <td class="mono">${log.details}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterLogs() {
  const searchTerm = document.getElementById("searchLog").value.toLowerCase();
  const typeFilter = document.getElementById("typeFilter").value;

  const filtered = systemLogs.filter(log => {
    const matchesSearch = log.ip.includes(searchTerm) || log.details.toLowerCase().includes(searchTerm) || log.user.toLowerCase().includes(searchTerm);
    const matchesType = typeFilter === "ALL" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  renderLogs(filtered);
}

// Render the logs when the script loads
document.addEventListener("DOMContentLoaded", () => {
  renderLogs(systemLogs);
});
