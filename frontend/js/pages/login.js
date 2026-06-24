/**
 * MedLeak AI - Login Page Component
 */

export function renderLogin(container) {
  // Clear any existing session elements in layout (if any lingering banner)
  const existingBanner = document.getElementById("session-banner");
  if (existingBanner) existingBanner.remove();

  container.innerHTML = `
    <div class="cyber-bg">
      <div class="auth-card">
        
        <div class="auth-header">
          <div class="logo-icon" style="width:50px; height:50px; margin: 0 auto 1rem auto; font-size: 1.5rem;">M</div>
          <h2 class="auth-title">MedLeak AI Portal</h2>
          <p class="auth-subtitle">Enterprise Insider Threat Detection Platform</p>
        </div>

        <div class="auth-warning-msg">
          <i data-lucide="shield-alert" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
          <span>SECURE PROTOCOL ACTIVE: Authorized healthcare security officers only. Telemetric access audits are logged.</span>
        </div>

        <div id="login-error-container" style="display:none;"></div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Employee ID / Email</label>
            <input type="email" id="login-email" class="input-cyber" placeholder="name@medleak.ai" required autocomplete="username">
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">System Password</label>
            <input type="password" id="login-password" class="input-cyber" placeholder="••••••••" required autocomplete="current-password">
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input type="checkbox" id="login-remember" class="checkbox-cyber">
              Remember Active Node
            </label>
            <a href="#forgot-password" class="link-cyber">Reset Access?</a>
          </div>

          <button type="submit" class="btn-cyber" style="width:100%; padding:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-family:var(--font-mono);">
            Establish Session
          </button>
        </form>

      </div>
    </div>
  `;

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Pre-fill email if Remembered
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    document.getElementById("login-email").value = rememberedEmail;
    document.getElementById("login-remember").checked = true;
  }

  // Handle Form Submission
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const remember = document.getElementById("login-remember").checked;
    const errorEl = document.getElementById("login-error-container");

    // Clear previous error
    errorEl.style.display = "none";
    errorEl.innerHTML = "";

    // Validate Credentials
    const validCredentials = [
      "admin@medleak.ai",
      "analyst@medleak.ai",
      "compliance@medleak.ai"
    ];

    if (validCredentials.includes(email) && password === "Password123") {
      // Save state
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("userEmail", email);
      
      // Save last login time
      localStorage.setItem("lastLoginTime", new Date().toLocaleString());
      
      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Route to Role Selection page
      window.location.hash = "#select-role";
    } else {
      // Show Error Banner
      errorEl.className = "auth-error-msg";
      errorEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="x-circle" style="width:16px; height:16px; flex-shrink:0;"></i>
          <span>Access Denied: Invalid credentials or unauthorized employee node.</span>
        </div>
      `;
      errorEl.style.display = "block";
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  });
}
