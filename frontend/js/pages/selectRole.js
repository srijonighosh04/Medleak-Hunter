/**
 * MedLeak AI - Role Selection Page Component
 */

export function renderSelectRole(container) {
  // Clear any existing session elements in layout (if any lingering banner)
  const existingBanner = document.getElementById("session-banner");
  if (existingBanner) existingBanner.remove();

  container.innerHTML = `
    <div class="cyber-bg">
      <div class="role-selection-layout">
        
        <div class="auth-header">
          <div class="logo-icon" style="width:50px; height:50px; margin: 0 auto 1rem auto; font-size: 1.5rem;">M</div>
          <h2 class="auth-title">Verify Operational Clearance</h2>
          <p class="auth-subtitle">Select your active role profile for this security session</p>
        </div>

        <div class="role-grid">
          
          <!-- Role 1: SOC Administrator -->
          <div class="role-card" data-role="SOC Administrator" data-clearance="Level 4" data-name="Dr. Sarah Chen">
            <div class="role-icon-wrapper">
              <i data-lucide="shield" style="width:30px; height:30px;"></i>
            </div>
            <div class="role-title">SOC Administrator</div>
            <p class="role-desc">Full access to telemetry data, auditing nodes, EHR access logs, and active incident response triggers.</p>
            <span class="badge-threat critical" style="font-size:0.65rem; padding:0.25rem 0.5rem; border-radius:4px; font-family:var(--font-mono);">
              LEVEL 4 CLEARANCE
            </span>
          </div>

          <!-- Role 2: Security Analyst -->
          <div class="role-card" data-role="Security Analyst" data-clearance="Level 3" data-name="Alex Rivera">
            <div class="role-icon-wrapper">
              <i data-lucide="activity" style="width:30px; height:30px;"></i>
            </div>
            <div class="role-title">Security Analyst</div>
            <p class="role-desc">Review anomaly alerts, investigate employee risk profiles, monitor trends, and verify file categories.</p>
            <span class="badge-threat high" style="font-size:0.65rem; padding:0.25rem 0.5rem; border-radius:4px; font-family:var(--font-mono);">
              LEVEL 3 CLEARANCE
            </span>
          </div>

          <!-- Role 3: Compliance Officer -->
          <div class="role-card" data-role="Compliance Officer" data-clearance="Level 2" data-name="Elena Rostova">
            <div class="role-icon-wrapper">
              <i data-lucide="file-check-2" style="width:30px; height:30px;"></i>
            </div>
            <div class="role-title">Compliance Officer</div>
            <p class="role-desc">Examine medical HIPAA compliance metrics, review PHI access logs, and generate exception audits.</p>
            <span class="badge-threat medium" style="font-size:0.65rem; padding:0.25rem 0.5rem; border-radius:4px; font-family:var(--font-mono);">
              LEVEL 2 CLEARANCE
            </span>
          </div>

        </div>

      </div>
    </div>
  `;

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Handle Card Selection Clicking
  container.querySelectorAll(".role-card").forEach(card => {
    card.addEventListener("click", () => {
      const role = card.getAttribute("data-role");
      const clearance = card.getAttribute("data-clearance");
      const name = card.getAttribute("data-name");

      // Save role details in localStorage
      localStorage.setItem("selectedRole", role);
      localStorage.setItem("clearanceLevel", clearance);
      localStorage.setItem("userName", name);

      // Start the 15-minute session timer
      const now = Date.now();
      localStorage.setItem("sessionStartTime", now.toString());

      // Redirect to dashboard
      window.location.hash = "#dashboard";
    });
  });
}
