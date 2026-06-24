/**
 * MedLeak AI - Threat Intelligence Page Component
 */

import { mockEmployees } from '../data.js?v=5';

export function renderThreatIntel(container) {
  // Sort initial data by Risk Score descending so they represent the top risk profiles
  let currentData = [...mockEmployees].sort((a, b) => b.riskScore - a.riskScore);
  
  // Sort parameters
  let sortBy = "riskScore";
  let sortDirection = "desc"; // desc or asc

  // Filter parameters
  let departmentFilter = "All";
  let threatLevelFilter = "All";

  // Get departments
  const departments = ["All", ...new Set(mockEmployees.map(e => e.department))];

  function updateDOM() {
    // 1. Filter the dataset
    let filtered = currentData.filter(emp => {
      const matchDept = departmentFilter === "All" || emp.department === departmentFilter;
      const matchLevel = threatLevelFilter === "All" || emp.threatLevel === threatLevelFilter;
      return matchDept && matchLevel;
    });

    // 2. Sort the dataset
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle custom sorting cases (e.g. dates or text strings)
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Inject Threat Intel Template
    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Threat Intelligence Registry</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Aggregated ledger of high-risk nodes, behavioral vectors, and organizational risk ranks.</p>
      </div>

      <!-- Filters & Stats panel -->
      <div class="glass-panel" style="margin-bottom: 1.5rem;">
        <div class="table-filter-bar">
          
          <div class="filter-group">
            <!-- Dept Filter -->
            <div style="display:flex; flex-direction:column; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; font-family:var(--font-mono);">DEPARTMENT</span>
              <select id="intel-dept-filter" class="select-cyber">
                ${departments.map(d => `<option value="${d}" ${d === departmentFilter ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>

            <!-- Threat Level Filter -->
            <div style="display:flex; flex-direction:column; gap:0.25rem;">
              <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; font-family:var(--font-mono);">THREAT SEVERITY</span>
              <select id="intel-level-filter" class="select-cyber">
                <option value="All" ${threatLevelFilter === "All" ? "selected" : ""}>All Severities</option>
                <option value="Critical" ${threatLevelFilter === "Critical" ? "selected" : ""}>Critical</option>
                <option value="High" ${threatLevelFilter === "High" ? "selected" : ""}>High</option>
                <option value="Medium" ${threatLevelFilter === "Medium" ? "selected" : ""}>Medium</option>
                <option value="Low" ${threatLevelFilter === "Low" ? "selected" : ""}>Low</option>
              </select>
            </div>
          </div>

          <!-- Total results tracker -->
          <div style="text-align:right; font-family:var(--font-mono); font-size:0.8rem;">
            <span style="color:var(--text-secondary);">Showing:</span>
            <span style="color:var(--accent-cyan); font-weight:700;">${filtered.length} of ${mockEmployees.length} Accounts</span>
          </div>

        </div>
      </div>

      <!-- Main Ledger Table -->
      <div class="glass-panel" style="padding:0.5rem 1rem;">
        <div class="table-container">
          <table class="cyber-table">
            <thead>
              <tr>
                <th data-sort="rank">Ranks</th>
                <th data-sort="name">Identity <i data-lucide="${getSortIcon('name')}"></i></th>
                <th data-sort="department">Department <i data-lucide="${getSortIcon('department')}"></i></th>
                <th data-sort="suspiciousEventsCount" style="text-align:center;">Incidents <i data-lucide="${getSortIcon('suspiciousEventsCount')}"></i></th>
                <th data-sort="riskScore" style="text-align:center;">Threat Score <i data-lucide="${getSortIcon('riskScore')}"></i></th>
                <th data-sort="lastActive">Last Sensor Active <i data-lucide="${getSortIcon('lastActive')}"></i></th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((emp, index) => {
                // Compute rank based on its index relative to sorted risk score descending
                const rankNum = currentData.findIndex(e => e.id === emp.id) + 1;
                
                let rankColor = "var(--text-secondary)";
                if (rankNum === 1) rankColor = "var(--severity-critical)";
                else if (rankNum === 2) rankColor = "var(--severity-high)";
                else if (rankNum === 3) rankColor = "var(--severity-medium)";

                let levelClass = "low";
                if (emp.threatLevel === 'Critical') levelClass = "critical";
                else if (emp.threatLevel === 'High') levelClass = "high";
                else if (emp.threatLevel === 'Medium') levelClass = "medium";

                let scoreColor = "var(--severity-low)";
                if (emp.riskScore >= 80) scoreColor = "var(--severity-critical)";
                else if (emp.riskScore >= 50) scoreColor = "var(--severity-high)";
                else if (emp.riskScore >= 20) scoreColor = "var(--severity-medium)";

                // Format date nicely
                const lastActiveDate = new Date(emp.lastActive);
                const timeStr = lastActiveDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const dateStr = lastActiveDate.toLocaleDateString([], {month: 'short', day: 'numeric'});

                return `
                  <tr>
                    <td style="font-family: var(--font-mono); font-weight:700; color:${rankColor};">
                      #${rankNum.toString().padStart(2, '0')}
                    </td>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.75rem;">
                        <div class="user-avatar" style="width:28px; height:28px; font-size:0.7rem; border-color:${scoreColor}; flex-shrink:0;">
                          ${emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style="display:flex; flex-direction:column;">
                          <span style="font-weight:600; color:#fff;">${emp.name}</span>
                          <span style="font-size:0.7rem; color:var(--text-secondary);">${emp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style="font-family: var(--font-display); font-weight:500;">${emp.department}</span>
                      <div style="font-size:0.7rem; color:var(--text-muted);">${emp.role}</div>
                    </td>
                    <td style="text-align:center; font-family:var(--font-mono); font-weight:600;">
                      ${emp.suspiciousEventsCount}
                    </td>
                    <td style="text-align:center;">
                      <span class="badge-threat ${levelClass}" style="width: 70px; justify-content:center;">
                        ${Math.round(emp.riskScore)}%
                      </span>
                    </td>
                    <td style="font-family:var(--font-mono); font-size:0.75rem;">
                      ${dateStr} &bull; <span style="color:var(--text-secondary);">${timeStr}</span>
                    </td>
                    <td style="text-align:right;">
                      <a href="#employee-detail?id=${emp.id}" class="incident-action-btn" style="text-decoration:none; display:inline-block;">Investigate</a>
                    </td>
                  </tr>
                `;
              }).join('')}
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center; padding:3rem; color:var(--text-muted);">
                    No risk vectors detected for the selected filter parameters.
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Reattach icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach Table controls event listeners
    attachListeners();
  }

  function getSortIcon(colName) {
    if (sortBy !== colName) return "chevrons-up-down";
    return sortDirection === "desc" ? "chevron-down" : "chevron-up";
  }

  function attachListeners() {
    // Dept Filter Change
    document.getElementById("intel-dept-filter").addEventListener("change", (e) => {
      departmentFilter = e.target.value;
      updateDOM();
    });

    // Level Filter Change
    document.getElementById("intel-level-filter").addEventListener("change", (e) => {
      threatLevelFilter = e.target.value;
      updateDOM();
    });

    // Sortable headers click
    container.querySelectorAll("table.cyber-table th[data-sort]").forEach(header => {
      header.addEventListener("click", () => {
        const field = header.getAttribute("data-sort");
        
        if (field === "rank") {
          // Rank is effectively sorting by riskScore (rank 1 is highest risk score)
          sortBy = "riskScore";
          sortDirection = sortDirection === "desc" ? "asc" : "desc";
        } else {
          if (sortBy === field) {
            sortDirection = sortDirection === "desc" ? "asc" : "desc";
          } else {
            sortBy = field;
            sortDirection = "desc"; // Default to desc for score/events, alphabetical is handled
          }
        }
        updateDOM();
      });
    });
  }

  updateDOM();
}
