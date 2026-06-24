/**
 * MedLeak AI - Employee Security Detail Page Component
 */

import { mockEmployees } from '../data.js?v=5';
import { renderRiskTrendChart } from '../charts.js?v=5';
import { refreshEmployeePrediction } from '../app.js?v=5';

export function renderEmployeeDetail(container, query = {}) {
  const empId = query.id || "EMP-1002"; // Fallback to Sarah Chen

  // Let's set up tabs state
  let activeTab = "timeline"; // timeline, logins, devices, files

  // Helper to determine score color
  function getScoreColor(score) {
    if (score >= 80) return "var(--severity-critical)";
    if (score >= 50) return "var(--severity-high)";
    if (score >= 20) return "var(--severity-medium)";
    return "var(--severity-low)";
  }

  function renderProfile(emp) {
    let threatBadgeClass = "low";
    if (emp.threatLevel === 'Critical') threatBadgeClass = "critical";
    else if (emp.threatLevel === 'High') threatBadgeClass = "high";
    else if (emp.threatLevel === 'Medium') threatBadgeClass = "medium";

    const isOffline = emp.isApiOffline;
    const offlineBanner = isOffline ? `
      <div style="background: rgba(239, 68, 68, 0.08); border: 1px dashed var(--severity-critical); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; color: var(--severity-critical); font-family: var(--font-mono); font-size: 0.8rem; box-shadow: 0 0 10px rgba(239, 68, 68, 0.05);">
        <i data-lucide="wifi-off" style="width: 16px; height: 16px; flex-shrink:0;"></i>
        <span>SECURITY CORE WARNING: Backend Offline. Showing cached prediction profile.</span>
      </div>
    ` : '';

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <a href="#threat-intel" style="color:var(--text-secondary); font-size:0.8rem; text-decoration:none; display:flex; align-items:center; gap:0.25rem; margin-bottom:0.75rem;">
          <i data-lucide="arrow-left" style="width:14px; height:14px;"></i> Return to Registry
        </a>
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Security Node Detail Profile</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Deep forensics audit console and historic telemetry tracking for selected node.</p>
      </div>

      ${offlineBanner}

      <!-- Profile Header Panel -->
      <div class="glass-panel detail-header-panel">
        <div class="user-avatar" style="width:70px; height:70px; font-size:1.6rem; border-color:var(--accent-cyan);">
          ${emp.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div class="detail-meta-info">
          <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight:700; display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            ${emp.name}
            <span class="badge-threat ${threatBadgeClass}">${emp.threatLevel} RISK</span>
            <span class="badge-threat ${emp.isHighRisk ? 'critical' : 'low'}" style="font-size: 0.7rem; border-radius: 4px; padding: 0.15rem 0.45rem;">
              ${emp.isHighRisk ? 'HIGH RISK' : 'NORMAL STATUS'}
            </span>
          </h2>
          <div class="detail-role-dept">
            <span style="color:#fff; font-weight:600;">${emp.role}</span> &bull; <span>${emp.department}</span> &bull; <span style="font-family:var(--font-mono); font-size:0.75rem;">${emp.id}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-secondary);">${emp.email}</span>
        </div>
        
        <!-- Forensics Action Triggers -->
        <div class="detail-action-bar">
          <button class="btn-cyber-outline" id="btn-trigger-audit">
            <i data-lucide="mail-warning"></i> Request Audit
          </button>
          <button class="btn-cyber-danger" id="btn-trigger-revoke">
            <i data-lucide="lock"></i> Revoke Access
          </button>
        </div>
      </div>

      <!-- Trend and Meta Stats Grid -->
      <div class="analytics-grid-row-1" style="margin-top:1.5rem;">
        
        <!-- Risk trend line chart -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i data-lucide="trending-up"></i> Threat Trend History</h3>
            <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--accent-cyan);">Risk Coefficient over 7 Days</span>
          </div>
          <div class="chart-container">
            <canvas id="detail-risk-canvas"></canvas>
          </div>
        </div>

        <!-- AI overview & metrics summary -->
        <div class="glass-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="panel-header" style="margin-bottom:0.75rem;">
              <h3 class="panel-title" style="color:var(--accent-purple);"><i data-lucide="brain"></i> Cognitive Flag Reason</h3>
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--accent-cyan); font-family:var(--font-mono);">
              ${emp.apiMessage ? emp.apiMessage : (emp.aiExplanation || "No anomaly profiles matched this user. Behavior conforms to established role parameters.")}
            </p>
          </div>

          <div style="border-top:1px solid var(--border-color); padding-top:0.75rem; margin-top:1rem; display:grid; grid-template-columns: repeat(3, 1fr); text-align:center; gap:0.5rem;">
            <div>
              <div style="font-size:0.7rem; color:var(--text-secondary);">EVENTS</div>
              <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; color:var(--accent-cyan);">${emp.suspiciousEventsCount}</div>
            </div>
            <div>
              <div style="font-size:0.7rem; color:var(--text-secondary);">THREAT SCORE</div>
              <div style="font-family:var(--font-mono); font-size:1.1rem; font-weight:700; color:${getScoreColor(emp.riskScore)}">${Math.round(emp.riskScore)}%</div>
            </div>
            <div>
              <div style="font-size:0.7rem; color:var(--text-secondary);">STATUS</div>
              <div style="font-family:var(--font-mono); font-size:0.9rem; font-weight:700; color:${emp.isHighRisk ? 'var(--severity-critical)' : 'var(--severity-low)'};">
                ${emp.isHighRisk ? 'HIGH RISK' : 'NORMAL'}
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Tabbed Activity Logs -->
      <div class="glass-panel tabs-container">
        
        <div class="tabs-header">
          <button class="tab-btn ${activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
            Timeline Feed
          </button>
          <button class="tab-btn ${activeTab === 'logins' ? 'active' : ''}" data-tab="logins">
            Login Logs (${emp.loginHistory ? emp.loginHistory.length : 0})
          </button>
          <button class="tab-btn ${activeTab === 'devices' ? 'active' : ''}" data-tab="devices">
            Device Operations (${emp.deviceHistory ? emp.deviceHistory.length : 0})
          </button>
          <button class="tab-btn ${activeTab === 'files' ? 'active' : ''}" data-tab="files">
            File Accesses (${emp.fileHistory ? emp.fileHistory.length : 0})
          </button>
        </div>

        <!-- Tab content container -->
        <div style="padding-top:0.5rem;">
          
          <!-- Timeline View Pane -->
          <div class="tab-pane ${activeTab === 'timeline' ? 'active' : ''}" id="tab-timeline">
            <div class="timeline-feed">
              ${generateTimelineMarkup(emp)}
            </div>
          </div>

          <!-- Login History Pane -->
          <div class="tab-pane ${activeTab === 'logins' ? 'active' : ''}" id="tab-logins">
            <div class="table-container">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                    <th>Sensor Node</th>
                    <th>Connection Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${emp.loginHistory && emp.loginHistory.length > 0 ? emp.loginHistory.map(log => `
                    <tr>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${new Date(log.timestamp).toLocaleString()}</td>
                      <td style="font-family:var(--font-mono); color:var(--accent-cyan);">${log.ip}</td>
                      <td>${log.location} &bull; <span style="font-size:0.7rem; color:var(--text-secondary);">${log.device}</span></td>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${log.type}</td>
                      <td>
                        <span style="font-weight:700; color:${log.status === 'Success' ? 'var(--severity-low)' : 'var(--severity-high)'};">
                          ${log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No login logs available for this account.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Device Operations Pane -->
          <div class="tab-pane ${activeTab === 'devices' ? 'active' : ''}" id="tab-devices">
            <div class="table-container">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Device Console</th>
                    <th>Trigger Category</th>
                    <th>Telemetry Summary</th>
                    <th>Security Code</th>
                  </tr>
                </thead>
                <tbody>
                  ${emp.deviceHistory && emp.deviceHistory.length > 0 ? emp.deviceHistory.map(dev => `
                    <tr>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${new Date(dev.timestamp).toLocaleString()}</td>
                      <td style="font-weight:600; color:#fff;">${dev.deviceName}</td>
                      <td style="font-family:var(--font-display);">${dev.type}</td>
                      <td style="color:var(--text-secondary);">${dev.description}</td>
                      <td>
                        <span class="badge-threat ${dev.status === 'Critical' ? 'critical' : dev.status === 'Warning' ? 'medium' : 'low'}">
                          ${dev.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No suspicious hardware mounting telemetry detected.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <!-- File Access Pane -->
          <div class="tab-pane ${activeTab === 'files' ? 'active' : ''}" id="tab-files">
            <div class="table-container">
              <table class="cyber-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>File Identifier</th>
                    <th>Format</th>
                    <th>Action</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  ${emp.fileHistory && emp.fileHistory.length > 0 ? emp.fileHistory.map(file => `
                    <tr>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${new Date(file.timestamp).toLocaleString()}</td>
                      <td style="font-weight:600; color:#fff; word-break:break-all;">${file.fileName}</td>
                      <td style="font-family:var(--font-mono); font-size:0.75rem;">${file.fileType}</td>
                      <td style="color:var(--accent-cyan); font-weight:600;">${file.action.toUpperCase()}</td>
                      <td>
                        ${file.isSensitive ? `
                          <span class="badge-threat critical" style="font-size:0.65rem;">SENSITIVE PHI</span>
                        ` : `
                          <span class="badge-threat low" style="font-size:0.65rem; color:var(--text-muted); border-color:var(--border-color); background:none;">UNCLASSIFIED</span>
                        `}
                      </td>
                    </tr>
                  `).join('') : `
                    <tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No file interactions logged under this account.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach listeners
    attachEventListeners(emp);

    // Render Canvas Risk Trend
    if (emp.riskHistory) {
      // Modify the last history point to reflect backend score
      const historyCopy = [...emp.riskHistory];
      if (historyCopy.length > 0) {
        historyCopy[historyCopy.length - 1] = {
          ...historyCopy[historyCopy.length - 1],
          score: emp.riskScore
        };
      }
      renderRiskTrendChart("detail-risk-canvas", historyCopy);
    }
  }

  // Combines logs to make an aggregate timeline
  function generateTimelineMarkup(employee) {
    const events = [];
    
    if (employee.loginHistory) {
      employee.loginHistory.forEach(l => {
        events.push({
          timestamp: new Date(l.timestamp),
          type: "login",
          title: `Successful login: ${l.type}`,
          desc: `Account logged in from ${l.location} (IP: ${l.ip}) using device: ${l.device}`,
          severity: l.type.includes("VPN") ? "warning" : "normal"
        });
      });
    }

    if (employee.deviceHistory) {
      employee.deviceHistory.forEach(d => {
        events.push({
          timestamp: new Date(d.timestamp),
          type: "device",
          title: `Device alert: ${d.type}`,
          desc: `${d.description} (Console: ${d.deviceName})`,
          severity: d.status === 'Critical' ? 'critical' : 'warning'
        });
      });
    }

    if (employee.fileHistory) {
      employee.fileHistory.forEach(f => {
        events.push({
          timestamp: new Date(f.timestamp),
          type: "file",
          title: `File ${f.action}: ${f.fileName}`,
          desc: `Accessed document structure [${f.fileType}] in department folder: ${f.department}`,
          severity: f.isSensitive ? 'critical' : 'normal'
        });
      });
    }

    // Sort events by timestamp descending
    events.sort((a, b) => b.timestamp - a.timestamp);

    if (events.length === 0) {
      return `<div style="text-align:center; padding:2rem; color:var(--text-muted); font-size:0.8rem;">No events recorded in system log pipeline.</div>`;
    }

    return events.map(ev => {
      let timelineClass = "";
      if (ev.severity === 'critical') timelineClass = "critical";
      else if (ev.severity === 'warning') timelineClass = "warning";

      return `
        <div class="timeline-item ${timelineClass}">
          <div class="timeline-time">${ev.timestamp.toLocaleString()}</div>
          <div class="timeline-content">
            <div class="timeline-title">${ev.title}</div>
            <div class="timeline-desc">${ev.desc}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function attachEventListeners(emp) {
    // Audit Trigger click
    const btnAudit = document.getElementById("btn-trigger-audit");
    if (btnAudit) {
      btnAudit.addEventListener("click", () => {
        alert(`MedLeak AI: Verification alert request sent to St. Jude Security Officer for Node ${emp.id} (${emp.name}). Escalation ticket ID: ESC-${Math.floor(Math.random()*90000+10000)}.`);
      });
    }

    // Revoke Trigger click
    const btnRevoke = document.getElementById("btn-trigger-revoke");
    if (btnRevoke) {
      btnRevoke.addEventListener("click", () => {
        const confirmRevoke = confirm(`CRITICAL ACTION: Are you sure you want to revoke Active Directory and EHR access tokens for ${emp.name} (${emp.id})? This will immediately disconnect active sessions.`);
        if (confirmRevoke) {
          alert(`Access revoked. AD Session revoked for user principal ${emp.email}. Workstations lock initiated.`);
        }
      });
    }

    // Tab buttons switching logic
    container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-tab");
        // Re-render UI
        renderProfile(emp);
      });
    });
  }

  async function loadEmployeeData() {
    container.innerHTML = `
      <div class="loader-overlay">
        <div class="loader-spinner"></div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 0 0 8px rgba(0, 240, 255, 0.2);">Analyzing telemetry logs...</div>
      </div>
    `;

    // Fetch live risk prediction
    const employee = mockEmployees.find(e => e.id === empId) || mockEmployees[0];
    const empData = await refreshEmployeePrediction(employee.id);

    if (!empData) {
      container.innerHTML = `
        <div class="glass-panel" style="display:flex; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-secondary);">
          Error loading employee profile details or backend offline.
        </div>
      `;
      return;
    }

    renderProfile(empData);
  }

  loadEmployeeData();
}

