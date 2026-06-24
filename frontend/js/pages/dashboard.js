/**
 * MedLeak AI - Dashboard Page Component
 */

import { securityStats, mockAlerts, mockEmployees } from '../data.js?v=5';
import { renderRiskTrendChart, renderGaugeChart } from '../charts.js?v=5';

export function renderDashboard(container) {
  // Compute live threat metrics based on actual backend results
  const scores = mockEmployees.map(e => e.riskScore);
  const maxScore = Math.max(...scores, 0);
  
  let systemThreatLabel = "LOW SYSTEM THREAT";
  let gaugeColor = "#10b981"; // Low (Green)
  if (maxScore >= 80) {
    systemThreatLabel = "CRITICAL SYSTEM THREAT";
    gaugeColor = "#ef4444"; // Critical (Red)
  } else if (maxScore >= 50) {
    systemThreatLabel = "HIGH SYSTEM THREAT";
    gaugeColor = "#f97316"; // High (Orange)
  } else if (maxScore >= 20) {
    systemThreatLabel = "MEDIUM SYSTEM THREAT";
    gaugeColor = "#eab308"; // Medium (Yellow)
  }

  // Inject Dashboard Template
  container.innerHTML = `
    <div class="dashboard-wrapper">
      
      <!-- Page Title -->
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Security Operations Center (SOC) Dashboard</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Real-time insider threat analytics and healthcare data leak detection indicators.</p>
      </div>

      <!-- Stat Cards Grid -->
      <div class="dashboard-grid">
        
        <!-- Total Monitored -->
        <div class="glass-panel stat-card">
          <div class="stat-info">
            <span class="stat-label">TOTAL EMPLOYEES</span>
            <span class="stat-val text-glow-cyan" style="color: var(--accent-cyan);">${securityStats.totalMonitored}</span>
          </div>
          <div class="stat-icon-wrapper">
            <i data-lucide="users"></i>
          </div>
        </div>

        <!-- High Risk Employees -->
        <div class="glass-panel stat-card">
          <div class="stat-info">
            <span class="stat-label">HIGH RISK ACCOUNTS</span>
            <span class="stat-val text-glow-purple" style="color: var(--accent-purple);">${securityStats.highRiskEmployees}</span>
          </div>
          <div class="stat-icon-wrapper" style="color: var(--accent-purple); border-color: rgba(168, 85, 247, 0.2);">
            <i data-lucide="user-minus"></i>
          </div>
        </div>

        <!-- Critical Alerts -->
        <div class="glass-panel stat-card">
          <div class="stat-info">
            <span class="stat-label">CRITICAL ALERTS</span>
            <span class="stat-val text-glow-red" style="color: var(--severity-high);">${securityStats.criticalAlerts}</span>
          </div>
          <div class="stat-icon-wrapper" style="color: var(--severity-high); border-color: rgba(239, 68, 68, 0.2);">
            <i data-lucide="shield-alert"></i>
          </div>
        </div>

        <!-- Sensitive File Access Events -->
        <div class="glass-panel stat-card">
          <div class="stat-info">
            <span class="stat-label">PHI ACCESS EVENTS (7D)</span>
            <span class="stat-val" style="color: #fff;">${securityStats.sensitiveAccessEvents}</span>
          </div>
          <div class="stat-icon-wrapper" style="color: #fff;">
            <i data-lucide="file-key-2"></i>
          </div>
        </div>

      </div>

      <!-- Main Visualizations Grid -->
      <div class="dashboard-row-2">
        
        <!-- Risk Trend Chart -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="trending-up"></i>
              System Risk Trend Over Time
            </h3>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">7-Day Systemic Coefficient</span>
          </div>
          <div class="chart-container">
            <canvas id="dashboard-trend-canvas"></canvas>
          </div>
        </div>

        <!-- AI Threat Score Overview -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="cpu"></i>
              AI Threat Score Overview
            </h3>
          </div>
          <div class="ai-gauge-wrapper">
            <div style="width: 100%; height: 160px; position: relative;">
              <canvas id="dashboard-gauge-canvas"></canvas>
            </div>
            <span class="ai-score-value" style="font-size:3rem; font-weight:800; font-family:var(--font-display); line-height:1; margin-top:-100px; color:${gaugeColor}; text-shadow:0 0 12px ${gaugeColor}a0;">${Math.round(maxScore)}</span>
            <span class="ai-score-label" style="color:${gaugeColor}; text-shadow:0 0 8px ${gaugeColor}40;">${systemThreatLabel}</span>
          </div>
        </div>

      </div>

      <!-- Incidents & SOC Status Grid -->
      <div class="dashboard-row-3">
        
        <!-- Recent Incidents -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="history"></i>
              Recent Security Incidents
            </h3>
            <a href="#alerts" style="color: var(--accent-cyan); font-size: 0.8rem; text-decoration: none; font-weight:600;">View All Alerts</a>
          </div>
          
          <div class="incidents-list" id="dashboard-incidents-list">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Dept Risk Breakdown -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="radar"></i>
              Active Department Risks
            </h3>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${securityStats.insiderThreatPredictions.map(dept => {
              const probPercent = Math.round(dept.probability * 100);
              let color = "var(--severity-low)";
              if (probPercent > 25) color = "var(--severity-critical)";
              else if (probPercent > 15) color = "var(--severity-high)";
              
              return `
                <div style="display:flex; flex-direction:column; gap:0.25rem;">
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                    <span style="font-weight:600;">${dept.department}</span>
                    <span style="font-family:var(--font-mono); color:${color}; font-weight:700;">${probPercent}% Threat Index</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: ${probPercent}%; background: ${color};"></div>
                  </div>
                  <span style="font-size:0.7rem; color:var(--text-secondary);">${dept.primaryVector}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;

  // Draw Line Chart
  renderRiskTrendChart("dashboard-trend-canvas", securityStats.systemRiskTrend);

  // Draw radial Gauge
  renderGaugeChart("dashboard-gauge-canvas", maxScore, "#00f0ff", gaugeColor);

  // Populating recent active alerts
  const dashboardIncidentsList = document.getElementById("dashboard-incidents-list");
  const recentAlerts = mockAlerts.slice(0, 4); // Get top 4 recent events
  
  dashboardIncidentsList.innerHTML = recentAlerts.map(alert => {
    let indicatorClass = "low";
    if (alert.severity === 'Critical') indicatorClass = "critical";
    else if (alert.severity === 'High') indicatorClass = "high";
    else if (alert.severity === 'Medium') indicatorClass = "medium";

    return `
      <div class="incident-card">
        <div class="incident-indicator ${indicatorClass}"></div>
        <div class="incident-body">
          <span class="incident-title">${alert.type}</span>
          <span class="incident-meta">
            ${alert.employeeName} (${alert.department}) &bull; 
            <span style="font-family: var(--font-mono); font-size: 10px;">${new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </span>
        </div>
        <button class="incident-action-btn" data-empid="${alert.employeeId}">Investigate</button>
      </div>
    `;
  }).join('');

  // Add click listeners to Investigate buttons
  container.querySelectorAll(".incident-action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const empId = e.target.getAttribute("data-empid");
      window.location.hash = `#employee-detail?id=${empId}`;
    });
  });
}
