/**
 * MedLeak AI - Employee Risk Analysis Page Component
 */

import { mockEmployees } from '../data.js?v=5';
import { renderGaugeChart, renderActivityHeatmap } from '../charts.js?v=5';
import { refreshEmployeePrediction } from '../app.js?v=5';

export function renderRiskAnalysis(container, query = {}) {
  // Extract initial query values
  let searchQuery = query.search || "";
  let selectedEmpId = query.id || "EMP-1087"; // Default to Marcus Vance (highest risk)

  // Helper to determine score color
  function getScoreColor(score) {
    if (score >= 80) return "var(--severity-critical)";
    if (score >= 50) return "var(--severity-high)";
    if (score >= 20) return "var(--severity-medium)";
    return "var(--severity-low)";
  }

  // Renders the full risk analysis template
  function updateDOM() {
    // Filter employee list based on local search input
    const filteredEmployees = mockEmployees.filter(emp => 
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If selected employee is not in filtered list, pick the first filtered employee
    let currentEmployee = mockEmployees.find(e => e.id === selectedEmpId);
    if (!currentEmployee && filteredEmployees.length > 0) {
      currentEmployee = filteredEmployees[0];
      selectedEmpId = currentEmployee.id;
    } else if (filteredEmployees.length === 0) {
      currentEmployee = null;
    }

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Behavioral Risk Analysis</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Deep ML investigation of individual user behavior vectors and security score deviations.</p>
      </div>

      <div class="analysis-layout">
        
        <!-- Left Sidebar: Employee List -->
        <div class="glass-panel" style="display:flex; flex-direction:column; padding:1rem;">
          <div class="search-list-input-container">
            <i data-lucide="search" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.8rem; color:var(--text-secondary);"></i>
            <input type="text" id="emp-list-search" class="search-input" style="padding-left:2rem; width:100%;" placeholder="Filter employees..." value="${searchQuery}">
          </div>

          <div class="search-list-card" id="emp-search-results">
            ${filteredEmployees.map(emp => {
              const isSelected = emp.id === selectedEmpId;
              const scoreColor = getScoreColor(emp.riskScore);

              return `
                <div class="employee-card-item ${isSelected ? 'selected' : ''}" data-empid="${emp.id}">
                  <div class="user-avatar" style="width:30px; height:30px; font-size:0.75rem; border-color:${scoreColor}; flex-shrink:0;">
                    ${emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div class="emp-item-info">
                    <span class="emp-item-name">${emp.name}</span>
                    <span class="emp-item-dept">${emp.id} &bull; ${emp.department}</span>
                  </div>
                  <span class="emp-item-score" style="color: ${scoreColor};">${Math.round(emp.riskScore)}</span>
                </div>
              `;
            }).join('')}
            ${filteredEmployees.length === 0 ? `
              <div style="text-align:center; padding:2rem 1rem; color:var(--text-muted); font-size:0.8rem;">
                No employees matching filter query.
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right Main View: Details Panel -->
        <div id="analysis-details-panel">
          ${currentEmployee ? renderDetailsPanelMarkup(currentEmployee) : `
            <div class="glass-panel" style="display:flex; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-secondary);">
              Please select or search an employee from the left panel to begin risk profiling.
            </div>
          `}
        </div>

      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach listeners
    attachEventListeners();

    // Render Canvas components if an employee is active
    if (currentEmployee) {
      renderDetailsCanvas(currentEmployee);
    }
  }

  function renderDetailsCanvas(emp) {
    let gaugeColor = "#10b981"; // Low (Green)
    if (emp.riskScore >= 80) gaugeColor = "#ef4444"; // Critical (Red)
    else if (emp.riskScore >= 50) gaugeColor = "#f97316"; // High (Orange)
    else if (emp.riskScore >= 20) gaugeColor = "#eab308"; // Medium (Yellow)

    renderGaugeChart("analysis-gauge-canvas", emp.riskScore, "#00f0ff", gaugeColor);
    renderActivityHeatmap("analysis-heatmap-container");
  }

  function renderDetailsPanelMarkup(emp) {
    let threatBadgeClass = "low";
    if (emp.threatLevel === 'Critical') threatBadgeClass = "critical";
    else if (emp.threatLevel === 'High') threatBadgeClass = "high";
    else if (emp.threatLevel === 'Medium') threatBadgeClass = "medium";

    // Progress bar classes based on score
    const getFillClass = (score) => {
      if (score >= 80) return 'danger';
      if (score >= 50) return 'warning';
      return 'normal';
    };

    const isOffline = emp.isApiOffline;
    const offlineBanner = isOffline ? `
      <div style="background: rgba(239, 68, 68, 0.08); border: 1px dashed var(--severity-critical); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem; color: var(--severity-critical); font-family: var(--font-mono); font-size: 0.8rem; box-shadow: 0 0 10px rgba(239, 68, 68, 0.05);">
        <i data-lucide="wifi-off" style="width: 16px; height: 16px; flex-shrink:0;"></i>
        <span>SECURITY CORE WARNING: Backend Offline. Showing cached prediction profile.</span>
      </div>
    ` : '';

    return `
      <div class="details-main">
        ${offlineBanner}
        
        <!-- Header Profile Grid -->
        <div class="glass-panel" style="display:grid; grid-template-columns: auto 1fr auto; align-items:center; gap:1.5rem;">
          <div class="user-avatar" style="width:64px; height:64px; font-size:1.5rem; border-color:var(--accent-cyan);">
            ${emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div class="detail-meta-info">
            <h2 style="font-family: var(--font-display); font-size:1.4rem; font-weight:700; display:flex; align-items:center; gap:0.75rem; flex-wrap: wrap;">
              ${emp.name}
              <span class="badge-threat ${threatBadgeClass}">${emp.threatLevel} THREAT</span>
              <span class="badge-threat ${emp.isHighRisk ? 'critical' : 'low'}" style="font-size: 0.7rem; border-radius: 4px; padding: 0.15rem 0.45rem;">
                ${emp.isHighRisk ? 'HIGH RISK' : 'NORMAL STATUS'}
              </span>
            </h2>
            <span style="color:var(--text-secondary); font-size:0.85rem;">
              ${emp.role} &bull; <strong style="color:#fff;">${emp.department}</strong> &bull; ID: ${emp.id}
            </span>
          </div>
          <div>
            <a href="#employee-detail?id=${emp.id}" class="btn-cyber-outline" style="text-decoration:none; padding:0.5rem 1rem; font-size:0.8rem;">
              <i data-lucide="eye" style="width:14px; height:14px;"></i> View Full Profile
            </a>
          </div>
        </div>

        <!-- Metric Score and Gauge Row -->
        <div class="analysis-details-grid">
          
          <!-- Behavioral Metrics Bars -->
          <div class="glass-panel">
            <div class="panel-header">
              <h3 class="panel-title"><i data-lucide="activity"></i> Behavioral Score Breakdown</h3>
            </div>
            
            <div class="behavior-progress-group">
              
              <!-- Login Activity -->
              <div class="behavior-bar-item">
                <div class="bar-meta">
                  <span class="bar-label">Login Activity Index</span>
                  <span class="bar-value">${emp.behavioralMetrics.loginActivity}/100</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${getFillClass(emp.behavioralMetrics.loginActivity)}" style="width: ${emp.behavioralMetrics.loginActivity}%;"></div>
                </div>
              </div>

              <!-- Device Activity -->
              <div class="behavior-bar-item">
                <div class="bar-meta">
                  <span class="bar-label">Device Interaction Risk</span>
                  <span class="bar-value">${emp.behavioralMetrics.deviceActivity}/100</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${getFillClass(emp.behavioralMetrics.deviceActivity)}" style="width: ${emp.behavioralMetrics.deviceActivity}%;"></div>
                </div>
              </div>

              <!-- File Access Activity -->
              <div class="behavior-bar-item">
                <div class="bar-meta">
                  <span class="bar-label">File Export Frequency</span>
                  <span class="bar-value">${emp.behavioralMetrics.fileAccessActivity}/100</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${getFillClass(emp.behavioralMetrics.fileAccessActivity)}" style="width: ${emp.behavioralMetrics.fileAccessActivity}%;"></div>
                </div>
              </div>

              <!-- Sensitive Interactions -->
              <div class="behavior-bar-item">
                <div class="bar-meta">
                  <span class="bar-label">PHI Record Exposure Score</span>
                  <span class="bar-value">${emp.behavioralMetrics.sensitiveInteractions}/100</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${getFillClass(emp.behavioralMetrics.sensitiveInteractions)}" style="width: ${emp.behavioralMetrics.sensitiveInteractions}%;"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Risk Score gauge -->
          <div class="glass-panel" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <h3 class="panel-title" style="margin-bottom:1rem; align-self:flex-start;"><i data-lucide="gauge"></i> Risk Coefficient</h3>
            <div style="width: 100%; height: 140px; position: relative;">
              <canvas id="analysis-gauge-canvas"></canvas>
            </div>
            <div style="margin-top:-90px; text-align:center;">
              <span class="ai-score-value" style="font-size:2.5rem;">${Math.round(emp.riskScore)}%</span>
              <div class="ai-score-label" style="font-size:0.75rem; margin-top:0.5rem;">Threat Quotient</div>
            </div>
          </div>

        </div>

        <!-- AI Explanation Panel -->
        <div class="glass-panel ai-reasoning-panel">
          <h3 class="ai-reasoning-title"><i data-lucide="brain"></i> Cognitive Security Analysis & AI Explanation</h3>
          <p class="ai-reasoning-body" style="margin-top:0.75rem; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.5; color: var(--accent-cyan);">
            ${emp.apiMessage ? emp.apiMessage : emp.aiExplanation}
          </p>
          <div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(168, 85, 247, 0.15); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
            <span>ML Model: MedLeak-Classifier v3.4.1</span>
            <span>API Link: ${isOffline ? '<span style="color:var(--severity-critical); font-weight:700;">OFFLINE</span>' : '<span style="color:var(--severity-low); font-weight:700;">ONLINE</span>'}</span>
            <span>Confidence Index: 94.8%</span>
          </div>
        </div>

        <!-- Activity Heatmap -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title"><i data-lucide="calendar"></i> 11-Week Behavioral Activity Grid</h3>
            <span style="font-size:0.75rem; color:var(--text-secondary);">Daily Event Density</span>
          </div>
          <div id="analysis-heatmap-container">
            <!-- Populated dynamically -->
          </div>
        </div>

      </div>
    `;
  }

  async function loadEmployeeDetails(empId) {
    const detailsPanel = document.getElementById("analysis-details-panel");
    if (!detailsPanel) return;

    // Show loading spinner
    detailsPanel.innerHTML = `
      <div class="loader-overlay">
        <div class="loader-spinner"></div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 0 0 8px rgba(0, 240, 255, 0.2);">Analyzing behavioral signatures...</div>
      </div>
    `;

    // Fetch live risk prediction
    const emp = await refreshEmployeePrediction(empId);
    selectedEmpId = empId;

    if (!emp) {
      detailsPanel.innerHTML = `
        <div class="glass-panel" style="display:flex; align-items:center; justify-content:center; height:100%; min-height:400px; color:var(--text-secondary);">
          Error loading employee details or backend offline.
        </div>
      `;
      return;
    }

    // Re-render only details panel
    detailsPanel.innerHTML = renderDetailsPanelMarkup(emp);

    // Initialize Lucide icons inside details panel
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Render Canvas components
    renderDetailsCanvas(emp);

    // Update list card selected state
    container.querySelectorAll(".employee-card-item").forEach(item => {
      if (item.getAttribute("data-empid") === empId) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });

    // Update list card score display
    const scoreEl = container.querySelector(`.employee-card-item[data-empid="${emp.id}"] .emp-item-score`);
    const avatarEl = container.querySelector(`.employee-card-item[data-empid="${emp.id}"] .user-avatar`);
    if (scoreEl && avatarEl) {
      scoreEl.textContent = Math.round(emp.riskScore);
      const scoreColor = getScoreColor(emp.riskScore);
      scoreEl.style.color = scoreColor;
      avatarEl.style.borderColor = scoreColor;
    }
  }

  function attachEventListeners() {
    // Search list input typing listener
    const searchInput = document.getElementById("emp-list-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        filterListDOM();
      });
    }

    // Card item selection click
    container.querySelectorAll(".employee-card-item").forEach(item => {
      item.addEventListener("click", () => {
        const empId = item.getAttribute("data-empid");
        loadEmployeeDetails(empId);
      });
    });
  }

  function filterListDOM() {
    const listContainer = document.getElementById("emp-search-results");
    if (!listContainer) return;

    const filtered = mockEmployees.filter(emp => 
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    listContainer.innerHTML = filtered.map(emp => {
      const isSelected = emp.id === selectedEmpId;
      const scoreColor = getScoreColor(emp.riskScore);

      return `
        <div class="employee-card-item ${isSelected ? 'selected' : ''}" data-empid="${emp.id}">
          <div class="user-avatar" style="width:30px; height:30px; font-size:0.75rem; border-color:${scoreColor}; flex-shrink:0;">
            ${emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div class="emp-item-info">
            <span class="emp-item-name">${emp.name}</span>
            <span class="emp-item-dept">${emp.id} &bull; ${emp.department}</span>
          </div>
          <span class="emp-item-score" style="color: ${scoreColor};">${Math.round(emp.riskScore)}</span>
        </div>
      `;
    }).join('');

    // Reattach card selection listeners
    listContainer.querySelectorAll(".employee-card-item").forEach(item => {
      item.addEventListener("click", () => {
        const empId = item.getAttribute("data-empid");
        loadEmployeeDetails(empId);
      });
    });
  }

  // Trigger initial render
  updateDOM();
  // Trigger initial live predictive fetch for the selected employee to ensure live score is shown
  if (selectedEmpId) {
    loadEmployeeDetails(selectedEmpId);
  }
}

