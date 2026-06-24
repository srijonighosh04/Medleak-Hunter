/**
 * MedLeak AI - Analytics Page Component
 */

import { securityStats } from '../data.js?v=5';
import { renderLoginDistribution, renderRiskTrendChart, renderFileTypeAccess } from '../charts.js?v=5';

export function renderAnalytics(container) {
  // Inject Analytics Template
  container.innerHTML = `
    <div class="analytics-wrapper">
      
      <!-- Page Title -->
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; font-family: var(--font-display);">Security Analytics & Forecasting</h1>
        <p style="color: var(--text-secondary); font-size: 0.85rem;">Global behavioral telemetry logs, EHR transaction patterns, and predictive machine learning vector forecasts.</p>
      </div>

      <!-- Row 1: Login Distribution and Sensitive Data Access Trend -->
      <div class="analytics-grid-row-1">
        
        <!-- Login Distribution -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="clock"></i>
              Hourly Login Load & Anomalies
            </h3>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">24-Hour Network Load</span>
          </div>
          <div style="display:flex; gap:1rem; margin-bottom:0.75rem; font-size:0.75rem; font-family:var(--font-mono);">
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <div style="width:10px; height:10px; background:rgba(59, 130, 246, 0.2); border:1px solid rgba(59, 130, 246, 0.5);"></div>
              <span>Total Volume</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.25rem;">
              <div style="width:10px; height:10px; background:rgba(239, 68, 68, 0.85);"></div>
              <span style="color:var(--severity-high);">Suspicious Flags</span>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="analytics-login-canvas"></canvas>
          </div>
        </div>

        <!-- Sensitive File Access Trend -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="shield-alert"></i>
              Sensitive Data Queries (PHI)
            </h3>
            <span style="font-size:0.75rem; color:var(--accent-purple); font-family:var(--font-mono);">Cumulative Transactions</span>
          </div>
          <div class="chart-container">
            <canvas id="analytics-sensitive-canvas"></canvas>
          </div>
        </div>

      </div>

      <!-- Row 2: File Types and Threat Forecasts -->
      <div class="analytics-grid-row-2" style="margin-top:1.5rem;">
        
        <!-- File Type Access Statistics -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="folder-open"></i>
              File Category Distribution
            </h3>
            <span style="font-size:0.75rem; color:var(--text-secondary);">Total Access Shares</span>
          </div>
          <div class="chart-container" style="height:250px;">
            <canvas id="analytics-file-canvas"></canvas>
          </div>
        </div>

        <!-- Insider Threat Predictions -->
        <div class="glass-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <i data-lucide="target"></i>
              ML Insider Threat Predictions
            </h3>
            <span style="font-size:0.75rem; color:var(--severity-high); font-family:var(--font-mono); font-weight:700;">Forecast Horizon: 48h</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${securityStats.insiderThreatPredictions.map(pred => {
              const probVal = Math.round(pred.probability * 100);
              let labelClass = "low";
              if (probVal > 25) labelClass = "high";
              else if (probVal > 15) labelClass = "medium";

              return `
                <div class="prediction-vector-card">
                  <div class="vector-info">
                    <span class="vector-dept">${pred.department}</span>
                    <span class="vector-desc">Primary vector: ${pred.primaryVector}</span>
                  </div>
                  <div class="vector-probability">
                    <span class="prob-value ${labelClass}">${probVal}%</span>
                    <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase;">Risk Factor</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;

  // Draw Charts
  renderLoginDistribution("analytics-login-canvas", securityStats.loginDistribution);
  renderRiskTrendChart("analytics-sensitive-canvas", securityStats.sensitiveDataAccessTrend);
  renderFileTypeAccess("analytics-file-canvas", securityStats.fileTypeAccess);
}
