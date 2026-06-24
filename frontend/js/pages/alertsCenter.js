/**
 * MedLeak AI - Alerts Center Page Component
 */

import { mockAlerts } from '../data.js?v=5';

export function renderAlertsCenter(container) {
  // Local state copy to allow modifying status (Acknowledge / Dismiss)
  // We attach it to the global window or module scope if we want persistence across route transitions.
  if (!window.alertsRegistry) {
    window.alertsRegistry = [...mockAlerts];
  }

  // Filter settings
  let severityFilter = "All";
  let statusFilter = "All";
  let searchVal = "";

  function updateDOM() {
    // 1. Filter alerts
    let filtered = window.alertsRegistry.filter(alert => {
      const matchSeverity = severityFilter === "All" || alert.severity === severityFilter;
      const matchStatus = statusFilter === "All" || alert.status === statusFilter;
      const matchSearch = alert.employeeName.toLowerCase().includes(searchVal.toLowerCase()) || 
                          alert.type.toLowerCase().includes(searchVal.toLowerCase()) ||
                          alert.id.toLowerCase().includes(searchVal.toLowerCase()) ||
                          alert.department.toLowerCase().includes(searchVal.toLowerCase());
      return matchSeverity && matchStatus && matchSearch;
    });

    // Injected Alerts Layout
    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Alerts Intake Operations</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Continuous ingestion pipeline for suspicious behavioral telemetry, endpoint events, and integrity violations.</p>
      </div>

      <!-- Search and Filter Bar -->
      <div class="glass-panel" style="margin-bottom: 1.5rem;">
        <div style="display:grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items:flex-end;">
          
          <!-- Search field -->
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; font-family:var(--font-mono);">SEARCH REGISTRY</span>
            <div style="position:relative;">
              <i data-lucide="search" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.8rem; color:var(--text-secondary); width:14px; height:14px;"></i>
              <input type="text" id="alerts-search-input" class="search-input" style="padding-left:2.25rem; width:100%;" placeholder="Search by name, alert ID, or type..." value="${searchVal}">
            </div>
          </div>

          <!-- Severity Filter -->
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; font-family:var(--font-mono);">SEVERITY LEVEL</span>
            <select id="alerts-severity-filter" class="select-cyber">
              <option value="All" ${severityFilter === "All" ? "selected" : ""}>All Severities</option>
              <option value="Critical" ${severityFilter === "Critical" ? "selected" : ""}>Critical</option>
              <option value="High" ${severityFilter === "High" ? "selected" : ""}>High</option>
              <option value="Medium" ${severityFilter === "Medium" ? "selected" : ""}>Medium</option>
              <option value="Low" ${severityFilter === "Low" ? "selected" : ""}>Low</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div style="display:flex; flex-direction:column; gap:0.25rem;">
            <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; font-family:var(--font-mono);">ALERT STATUS</span>
            <select id="alerts-status-filter" class="select-cyber">
              <option value="All" ${statusFilter === "All" ? "selected" : ""}>All States</option>
              <option value="Active" ${statusFilter === "Active" ? "selected" : ""}>Active Alerts</option>
              <option value="Acknowledged" ${statusFilter === "Acknowledged" ? "selected" : ""}>Acknowledged</option>
              <option value="Dismissed" ${statusFilter === "Dismissed" ? "selected" : ""}>Dismissed</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Alerts Feed List -->
      <div id="alerts-feed-container">
        ${filtered.map(alert => {
          let rowBorderClass = "";
          let badgeColorClass = "low";
          if (alert.severity === 'Critical') {
            rowBorderClass = "critical-alert";
            badgeColorClass = "critical";
          } else if (alert.severity === 'High') {
            rowBorderClass = "high-alert";
            badgeColorClass = "high";
          } else if (alert.severity === 'Medium') {
            rowBorderClass = "medium-alert";
            badgeColorClass = "medium";
          } else if (alert.severity === 'Low') {
            rowBorderClass = "low-alert";
            badgeColorClass = "low";
          }

          // Status representation
          let statusBadgeColor = "var(--text-muted)";
          if (alert.status === 'Active') statusBadgeColor = "var(--severity-high)";
          else if (alert.status === 'Acknowledged') statusBadgeColor = "var(--severity-medium)";
          else if (alert.status === 'Dismissed') statusBadgeColor = "var(--severity-low)";

          // Format Date
          const alertTime = new Date(alert.timestamp);
          const formattedTime = `${alertTime.toLocaleDateString()} ${alertTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

          return `
            <div class="alert-row ${rowBorderClass}">
              
              <!-- Col 1: ID -->
              <span class="alert-col-id">${alert.id}</span>
              
              <!-- Col 2: Severity badge -->
              <div>
                <span class="badge-threat ${badgeColorClass}">${alert.severity}</span>
              </div>
              
              <!-- Col 3: Details & Description -->
              <div class="alert-col-desc">
                <div class="alert-col-type">${alert.type}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.15rem;">${alert.description}</div>
              </div>
              
              <!-- Col 4: Target Employee Node -->
              <div>
                <div style="font-weight:600; color:#fff;">${alert.employeeName}</div>
                <div style="font-size:0.7rem; color:var(--text-secondary);">${alert.department} &bull; ${alert.employeeId}</div>
              </div>
              
              <!-- Col 5: Time -->
              <span class="alert-col-time">${formattedTime}</span>
              
              <!-- Col 6: Status and actions -->
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:${statusBadgeColor}; font-weight:700;">
                  ${alert.status.toUpperCase()}
                </span>
                
                <div class="alert-actions-cell">
                  <!-- Acknowledge -->
                  ${alert.status === 'Active' ? `
                    <button class="alert-btn-icon success btn-ack" data-altid="${alert.id}" title="Acknowledge Alert">
                      <i data-lucide="check"></i>
                    </button>
                  ` : ''}

                  <!-- Dismiss -->
                  ${alert.status !== 'Dismissed' ? `
                    <button class="alert-btn-icon btn-dismiss" data-altid="${alert.id}" title="Dismiss Alert">
                      <i data-lucide="eye-off"></i>
                    </button>
                  ` : ''}

                  <!-- Investigate -->
                  <button class="alert-btn-icon btn-inv" data-empid="${alert.employeeId}" title="Deep Investigate Node">
                    <i data-lucide="chevron-right"></i>
                  </button>
                </div>
              </div>

            </div>
          `;
        }).join('')}
        ${filtered.length === 0 ? `
          <div class="glass-panel" style="text-align:center; padding:4rem 1rem; color:var(--text-muted);">
            No telemetry alerts match current search and status filters.
          </div>
        ` : ''}
      </div>
    `;

    // Reattach icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach controllers listeners
    attachListeners();
  }

  function attachListeners() {
    // Search listener
    document.getElementById("alerts-search-input").addEventListener("input", (e) => {
      searchVal = e.target.value;
      // Filter DOM directly to preserve cursor focus
      updateDOM();
      // Refocus cursor to the end
      const input = document.getElementById("alerts-search-input");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });

    // Severity filter change
    document.getElementById("alerts-severity-filter").addEventListener("change", (e) => {
      severityFilter = e.target.value;
      updateDOM();
    });

    // Status filter change
    document.getElementById("alerts-status-filter").addEventListener("change", (e) => {
      statusFilter = e.target.value;
      updateDOM();
    });

    // Acknowledge button click
    container.querySelectorAll(".btn-ack").forEach(btn => {
      btn.addEventListener("click", () => {
        const altId = btn.getAttribute("data-altid");
        window.alertsRegistry = window.alertsRegistry.map(a => 
          a.id === altId ? { ...a, status: 'Acknowledged' } : a
        );
        updateDOM();
      });
    });

    // Dismiss button click
    container.querySelectorAll(".btn-dismiss").forEach(btn => {
      btn.addEventListener("click", () => {
        const altId = btn.getAttribute("data-altid");
        window.alertsRegistry = window.alertsRegistry.map(a => 
          a.id === altId ? { ...a, status: 'Dismissed' } : a
        );
        updateDOM();
      });
    });

    // Investigate button click
    container.querySelectorAll(".btn-inv").forEach(btn => {
      btn.addEventListener("click", () => {
        const empId = btn.getAttribute("data-empid");
        window.location.hash = `#employee-detail?id=${empId}`;
      });
    });
  }

  updateDOM();
}
