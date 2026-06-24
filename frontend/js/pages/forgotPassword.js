/**
 * MedLeak AI - Forgot Password Page Component
 */

export function renderForgotPassword(container) {
  // Clear any existing session elements in layout (if any lingering banner)
  const existingBanner = document.getElementById("session-banner");
  if (existingBanner) existingBanner.remove();

  container.innerHTML = `
    <div class="cyber-bg">
      <div class="auth-card" id="forgot-card">
        
        <div class="auth-header">
          <div class="logo-icon" style="width:50px; height:50px; margin: 0 auto 1rem auto; font-size: 1.5rem;">M</div>
          <h2 class="auth-title">Access Recovery</h2>
          <p class="auth-subtitle">Validate authorization nodes to reset credentials</p>
        </div>

        <div id="forgot-form-container">
          <form id="forgot-form">
            <div class="form-group">
              <label class="form-label" for="forgot-email">Registered Email Address</label>
              <input type="email" id="forgot-email" class="input-cyber" placeholder="name@medleak.ai" required autocomplete="email">
            </div>

            <button type="submit" class="btn-cyber" style="width:100%; padding:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-family:var(--font-mono); margin-bottom: 1.5rem;">
              Send Recovery Signal
            </button>
          </form>
        </div>

        <div class="form-options" style="justify-content:center;">
          <a href="#login" class="link-cyber">
            <i data-lucide="arrow-left" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
            Back to Auth Console
          </a>
        </div>

      </div>
    </div>
  `;

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Handle Form Submission
  const form = document.getElementById("forgot-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim();
    const cardContainer = document.getElementById("forgot-card");

    // Success State rendering
    cardContainer.innerHTML = `
      <div class="auth-header">
        <div class="logo-icon" style="width:50px; height:50px; margin: 0 auto 1rem auto; font-size: 1.5rem; background:linear-gradient(135deg, var(--severity-low) 0%, var(--accent-cyan) 100%);">
          <i data-lucide="check" style="color:var(--bg-dark); width:24px; height:24px;"></i>
        </div>
        <h2 class="auth-title">Signal Transmitted</h2>
        <p class="auth-subtitle">Recovery instructions successfully dispatched</p>
      </div>

      <div class="auth-success-msg">
        <p>A credential authentication reset link has been dispatched to:</p>
        <strong style="color:#fff; word-break:break-all; display:block; margin: 0.5rem 0;">${email}</strong>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:0.5rem;">Please check your secure inbox. The token expires in 15 minutes.</p>
      </div>

      <div class="form-options" style="justify-content:center;">
        <a href="#login" class="link-cyber">
          <i data-lucide="arrow-left" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
          Return to Auth Console
        </a>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}
