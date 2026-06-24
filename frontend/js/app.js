/**
 * MedLeak AI - Central App Controller, SPA Router, and Session Manager
 */

import { mockEmployees, mockAlerts, securityStats } from './data.js?v=5';
import { renderDashboard } from './pages/dashboard.js?v=5';
import { renderRiskAnalysis } from './pages/riskAnalysis.js?v=5';
import { renderThreatIntel } from './pages/threatIntel.js?v=5';
import { renderAlertsCenter } from './pages/alertsCenter.js?v=5';
import { renderEmployeeDetail } from './pages/employeeDetail.js?v=5';
import { renderAnalytics } from './pages/analytics.js?v=5';
import { initializeLiveRiskData, analyzeUser, getBackendStatus } from './api.js?v=5';
import { renderLogin } from './pages/login.js?v=5';
import { renderForgotPassword } from './pages/forgotPassword.js?v=5';
import { renderSelectRole } from './pages/selectRole.js?v=5';

export function recalculateSystemStats() {
  const scores = mockEmployees.map(e => e.riskScore);
  const maxScore = Math.max(...scores, 0);
  const highRiskCount = mockEmployees.filter(e => e.riskScore >= 50).length;
  
  securityStats.highRiskEmployees = highRiskCount;

  // Dynamic system risk trend update
  if (securityStats.systemRiskTrend && securityStats.systemRiskTrend.length > 0) {
    securityStats.systemRiskTrend[securityStats.systemRiskTrend.length - 1].riskValue = maxScore;
  }

  // Dynamic department risk calculations based on live employee threat scores
  if (securityStats.insiderThreatPredictions) {
    securityStats.insiderThreatPredictions.forEach(pred => {
      const deptEmployees = mockEmployees.filter(e => e.department === pred.department);
      if (deptEmployees.length > 0) {
        const avgScore = deptEmployees.reduce((sum, emp) => sum + emp.riskScore, 0) / deptEmployees.length;
        pred.probability = avgScore / 100;
      }
    });
  }
  
  // Recalculate system threat level label
  let label = "SECURE";
  let labelColor = "var(--severity-low)";
  if (maxScore >= 80) {
    label = "CRITICAL";
    labelColor = "var(--severity-critical)";
  } else if (maxScore >= 50) {
    label = "ELEVATED";
    labelColor = "var(--severity-high)";
  } else if (maxScore >= 20) {
    label = "MODERATE";
    labelColor = "var(--severity-medium)";
  }
  
  const badgeEl = document.getElementById("sys-threat-level-badge");
  if (badgeEl) {
    if (getBackendStatus()) {
      badgeEl.textContent = `BACKEND OFFLINE (${Math.round(maxScore)})`;
      badgeEl.style.color = "var(--severity-critical)"; // Red/high severity warning for offline status
    } else {
      badgeEl.textContent = `${label} (${Math.round(maxScore)})`;
      badgeEl.style.color = labelColor;
    }
  }
}

export async function refreshEmployeePrediction(empId) {
  const employee = mockEmployees.find(e => e.id === empId);
  if (!employee) return null;
  await analyzeUser(employee);
  recalculateSystemStats();
  return employee;
}

const mainContent = document.getElementById("main-content");
const notifBellTrigger = document.getElementById("notif-bell-trigger");
const notifDropdownPanel = document.getElementById("notif-dropdown-panel");
const notifItemsList = document.getElementById("notif-items-list");
const notifCountBadge = document.getElementById("notif-count-badge");
const notifDismissAll = document.getElementById("notif-dismiss-all");
const globalSearch = document.getElementById("global-search");

// Routing definitions
const routes = {
  "login": renderLogin,
  "forgot-password": renderForgotPassword,
  "select-role": renderSelectRole,
  "dashboard": renderDashboard,
  "risk-analysis": renderRiskAnalysis,
  "threat-intel": renderThreatIntel,
  "alerts": renderAlertsCenter,
  "employee-detail": renderEmployeeDetail,
  "analytics": renderAnalytics
};

// Initial state for notifications
let activeAlerts = [...mockAlerts];

/**
 * Parses current hash path and returns page name + query arguments
 */
function getRouteInfo() {
  const hash = window.location.hash || '#login';
  const parts = hash.substring(1).split('?');
  const page = parts[0] || 'login';
  const query = {};
  
  if (parts[1]) {
    parts[1].split('&').forEach(param => {
      const kv = param.split('=');
      query[kv[0]] = decodeURIComponent(kv[1]);
    });
  }
  
  return { page, query };
}

/**
 * Main routing handler with protected views checking
 */
export function navigateToPage() {
  const { page, query } = getRouteInfo();

  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const hasRole = localStorage.getItem("selectedRole") !== null;

  // Protect Routes Redirect Flow
  if (!isAuthenticated) {
    if (page !== "login" && page !== "forgot-password") {
      window.location.hash = "#login";
      return;
    }
  } else {
    // User is Authenticated
    if (!hasRole) {
      if (page !== "select-role") {
        window.location.hash = "#select-role";
        return;
      }
    } else {
      // Authenticated and has role selected
      if (page === "login" || page === "forgot-password") {
        window.location.hash = "#dashboard";
        return;
      }
    }
  }

  // Choose component to render
  const renderFn = routes[page] || renderDashboard;
  
  // Set auth-mode grid overrides on #app-shell
  const appShell = document.getElementById("app-shell");
  if (appShell) {
    if (page === "login" || page === "forgot-password" || page === "select-role") {
      appShell.classList.add("auth-mode");
      // Remove any leftover session banner
      const existingBanner = document.getElementById("session-banner");
      if (existingBanner) existingBanner.remove();
      // Remove profile dropdown if any
      const dropdown = document.getElementById("profile-dropdown");
      if (dropdown) dropdown.remove();
    } else {
      appShell.classList.remove("auth-mode");
      
      // Initialize dynamic session banner, profile drop, and timer
      initializeSessionBanner();
      initializeUserProfileDropdown();
      startSessionTimer();
    }
  }

  // Set active class in sidebar links
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Inject fade-in class
  mainContent.classList.remove('animate-fade-in');
  void mainContent.offsetWidth; // Trigger reflow
  mainContent.classList.add('animate-fade-in');

  // Render view
  renderFn(mainContent, query);

  // Initialize Lucide Icons on newly rendered markup
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Session Top Banner Creator
 */
function initializeSessionBanner() {
  const workspace = document.querySelector(".workspace");
  if (!workspace) return;

  let banner = document.getElementById("session-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "session-banner";
    banner.className = "session-banner";
    workspace.insertBefore(banner, workspace.firstChild);
  }

  const role = localStorage.getItem("selectedRole") || "SOC Administrator";
  const clearance = localStorage.getItem("clearanceLevel") || "Level 4";

  banner.innerHTML = `
    <div class="session-banner-content">
      <i data-lucide="shield-check" style="width:14px; height:14px; flex-shrink:0;"></i>
      <span>AUTHENTICATED SESSION &bull; <strong>ROLE:</strong> ${role.toUpperCase()} &bull; <strong>SECURITY CLEARANCE:</strong> ${clearance.toUpperCase()}</span>
    </div>
    <div class="session-banner-timer">
      <i data-lucide="timer" style="width:14px; height:14px; flex-shrink:0;"></i> Session Expires: <span id="session-countdown">15:00</span>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * User Profile Dropdown Creator
 */
function initializeUserProfileDropdown() {
  const profileHeader = document.querySelector(".user-profile-header");
  if (!profileHeader) return;

  const role = localStorage.getItem("selectedRole") || "SOC Administrator";
  const name = localStorage.getItem("userName") || "Dr. Sarah Chen";
  const lastLogin = localStorage.getItem("lastLoginTime") || new Date().toLocaleString();
  const initials = name.split(" ").map(n => n[0]).join("");

  // Update profile header in layout
  profileHeader.innerHTML = `
    <div class="user-avatar" style="border-color: var(--accent-cyan); font-weight:700;">${initials}</div>
    <div class="user-info">
      <span class="user-name">${name}</span>
      <span class="user-role">${role}</span>
    </div>
  `;

  // Create dropdown card panel
  const headerRight = document.querySelector(".header-right");
  if (!headerRight) return;

  let dropdown = document.getElementById("profile-dropdown");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.id = "profile-dropdown";
    dropdown.className = "profile-dropdown-panel";
    headerRight.appendChild(dropdown);
  }

  let clearanceBadgeClass = "low";
  if (role.includes("Admin")) clearanceBadgeClass = "critical";
  else if (role.includes("Analyst")) clearanceBadgeClass = "high";
  else if (role.includes("Compliance")) clearanceBadgeClass = "medium";

  const clearance = localStorage.getItem("clearanceLevel") || "Level 4";

  dropdown.innerHTML = `
    <div class="dropdown-user-info">
      <span class="dropdown-user-name">${name}</span>
      <span class="dropdown-user-role">${role}</span>
      <span class="badge-threat ${clearanceBadgeClass}" style="font-size:0.65rem; justify-content:center; padding: 0.15rem 0.35rem; width:fit-content; border-radius:4px; font-family:var(--font-mono); margin-top:0.35rem; font-weight:700;">
        ${clearance.toUpperCase()} CLEARANCE
      </span>
    </div>

    <div class="dropdown-security-indicators">
      <div class="dropdown-indicator-item">
        <span>MFA STATUS:</span>
        <span class="badge-threat low" style="font-size:0.55rem; padding:0.1rem 0.3rem; border-radius:4px; font-family:var(--font-mono); font-weight:700;">ENABLED</span>
      </div>
      <div class="dropdown-indicator-item">
        <span>LAST LOGIN:</span>
        <span style="color:#fff; font-size:10px;">${lastLogin.split(",")[0]}</span>
      </div>
      <div class="dropdown-indicator-item">
        <span>SESSION TIMER:</span>
        <span id="dropdown-timer-val" style="color:var(--accent-cyan); font-weight:700;">15:00</span>
      </div>
    </div>

    <ul class="dropdown-menu-list">
      <li class="dropdown-menu-item" data-action="profile">
        <i data-lucide="user" style="width:14px; height:14px;"></i> Profile Console
      </li>
      <li class="dropdown-menu-item" data-action="settings">
        <i data-lucide="settings" style="width:14px; height:14px;"></i> Security Settings
      </li>
      <li class="dropdown-menu-item" data-action="logs">
        <i data-lucide="shield-check" style="width:14px; height:14px;"></i> Audit Logs
      </li>
      <li class="dropdown-menu-item logout" id="dropdown-logout-btn">
        <i data-lucide="log-out" style="width:14px; height:14px;"></i> Terminate Session (Logout)
      </li>
    </ul>
  `;

  // Toggle dropdown on profile header click
  const clickHandler = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  };

  profileHeader.removeEventListener("click", profileHeader._clickHandler);
  profileHeader.addEventListener("click", clickHandler);
  profileHeader._clickHandler = clickHandler;

  // Logout Trigger click
  const logoutBtn = document.getElementById("dropdown-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      logoutUser();
    });
  }

  // Mock links click warning
  dropdown.querySelectorAll(".dropdown-menu-item:not(.logout)").forEach(item => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      alert(`MedLeak AI Security Protocol: Access to "${action}" is locked for demo purposes.`);
      dropdown.classList.remove("show");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Terminate Secure Session and Logout
 */
export function logoutUser() {
  localStorage.removeItem("authenticated");
  localStorage.removeItem("selectedRole");
  localStorage.removeItem("clearanceLevel");
  localStorage.removeItem("userName");
  localStorage.removeItem("sessionStartTime");

  // Remove banner and profile elements
  const existingBanner = document.getElementById("session-banner");
  if (existingBanner) existingBanner.remove();

  const dropdown = document.getElementById("profile-dropdown");
  if (dropdown) dropdown.remove();

  // Reset timer interval
  if (window.sessionTimerInterval) {
    clearInterval(window.sessionTimerInterval);
    window.sessionTimerInterval = null;
  }

  // Redirect back to Login
  window.location.hash = "#login";
}

/**
 * 15-Minute Session Expiration Timer
 */
function startSessionTimer() {
  if (window.sessionTimerInterval) {
    clearInterval(window.sessionTimerInterval);
  }

  const startTime = parseInt(localStorage.getItem("sessionStartTime") || Date.now());
  const duration = 15 * 60 * 1000; // 15 minutes in ms

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, duration - elapsed);

    if (remaining === 0) {
      clearInterval(window.sessionTimerInterval);
      alert("SOC Security Session Expired. Re-authenticating node...");
      logoutUser();
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update countdown in banner
    const countdownEl = document.getElementById("session-countdown");
    if (countdownEl) {
      countdownEl.textContent = timeStr;
    }

    // Update countdown in profile dropdown
    const dropdownTimerEl = document.getElementById("dropdown-timer-val");
    if (dropdownTimerEl) {
      dropdownTimerEl.textContent = timeStr;
    }
  }

  updateTimer();
  window.sessionTimerInterval = setInterval(updateTimer, 1000);
}

/**
 * Renders notification list in the dropdown panel
 */
function updateNotificationPanel() {
  notifItemsList.innerHTML = "";
  
  const unreadAlerts = activeAlerts.filter(a => a.status === 'Active');
  notifCountBadge.textContent = unreadAlerts.length;
  notifCountBadge.style.display = unreadAlerts.length > 0 ? "flex" : "none";

  if (unreadAlerts.length === 0) {
    notifItemsList.innerHTML = `
      <li style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
        No active critical threats detected.
      </li>
    `;
    return;
  }

  unreadAlerts.forEach(alert => {
    const li = document.createElement("li");
    li.className = "notif-item";
    
    // Choose color indicator depending on severity
    let sevColor = "var(--severity-low)";
    if (alert.severity === 'Critical') sevColor = "var(--severity-critical)";
    else if (alert.severity === 'High') sevColor = "var(--severity-high)";
    else if (alert.severity === 'Medium') sevColor = "var(--severity-medium)";

    li.innerHTML = `
      <div class="notif-item-title">
        <span style="color: ${sevColor}; font-weight:700;">[${alert.severity}]</span>
        <span style="font-family: var(--font-mono); font-size: 10px;">${alert.id}</span>
      </div>
      <div class="notif-item-desc">${alert.type} - ${alert.employeeName}</div>
      <span class="notif-item-time">${new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;

    // Click behavior - navigate directly to detailed risk page
    li.addEventListener("click", () => {
      window.location.hash = `#employee-detail?id=${alert.employeeId}`;
      notifDropdownPanel.classList.remove("show");
    });

    notifItemsList.appendChild(li);
  });
}

// Global search bar key listener
globalSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = globalSearch.value.trim().toLowerCase();
    if (!val) return;

    // Search by employee ID or Name
    const found = mockEmployees.find(emp => 
      emp.id.toLowerCase() === val || 
      emp.name.toLowerCase().includes(val)
    );

    if (found) {
      window.location.hash = `#employee-detail?id=${found.id}`;
      globalSearch.value = "";
    } else {
      // If not specific employee, go to risk-analysis and pass search query
      window.location.hash = `#risk-analysis?search=${encodeURIComponent(val)}`;
      globalSearch.value = "";
    }
  }
});

// Notifications panel toggler
notifBellTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  notifDropdownPanel.classList.toggle("show");
});

document.addEventListener("click", () => {
  notifDropdownPanel.classList.remove("show");
});

notifDropdownPanel.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Dismiss all action
notifDismissAll.addEventListener("click", () => {
  activeAlerts = activeAlerts.map(a => ({ ...a, status: 'Acknowledged' }));
  updateNotificationPanel();
});

// Initialize router listener
window.addEventListener("hashchange", navigateToPage);

// Startup Boot function
async function boot() {
  // Pre-load all employee predictions from backend
  await initializeLiveRiskData(mockEmployees);
  recalculateSystemStats();
  
  // Initial page renders
  navigateToPage();
  updateNotificationPanel();
}

boot();
