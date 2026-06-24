/**
 * MedLeak AI - Central App Controller and SPA Router
 */

import { mockEmployees, mockAlerts, securityStats } from './data.js?v=5';
import { renderDashboard } from './pages/dashboard.js?v=5';
import { renderRiskAnalysis } from './pages/riskAnalysis.js?v=5';
import { renderThreatIntel } from './pages/threatIntel.js?v=5';
import { renderAlertsCenter } from './pages/alertsCenter.js?v=5';
import { renderEmployeeDetail } from './pages/employeeDetail.js?v=5';
import { renderAnalytics } from './pages/analytics.js?v=5';
import { initializeLiveRiskData, analyzeUser, getBackendStatus } from './api.js?v=5';

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
  const hash = window.location.hash || '#dashboard';
  const parts = hash.substring(1).split('?');
  const page = parts[0] || 'dashboard';
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
 * Main routing handler
 */
export function navigateToPage() {
  const { page, query } = getRouteInfo();
  const renderFn = routes[page] || renderDashboard;
  
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

// Initialize
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
