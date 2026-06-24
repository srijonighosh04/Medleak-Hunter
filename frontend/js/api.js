/**
 * MedLeak AI - Centralized FastAPI Service Module
 */

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

// Tracks if the backend is currently offline
let isBackendOffline = false;

export function getBackendStatus() {
  return isBackendOffline;
}

/**
 * Dynamically computes ML features from an employee's timeline logs
 */
export function computeUserFeatures(employee) {
  const logins = employee.loginHistory || [];
  const devices = employee.deviceHistory || [];
  const files = employee.fileHistory || [];

  // Parse login hours
  let loginHours = logins.map(l => new Date(l.timestamp).getHours());
  if (loginHours.length === 0) loginHours = [12]; // fallback
  
  const sumHours = loginHours.reduce((a, b) => a + b, 0);
  const mean_hour = sumHours / loginHours.length;
  const min_hour = Math.min(...loginHours);
  const max_hour = Math.max(...loginHours);

  // Unique PCs accessed
  const pcSet = new Set();
  logins.forEach(l => { if (l.device) pcSet.add(l.device); });
  devices.forEach(d => { if (d.deviceName) pcSet.add(d.deviceName); });
  const unique_pcs = pcSet.size || 1;

  // Event Count
  const event_count = logins.length + devices.length + files.length || 1;

  // Device Events
  const device_events = devices.length;

  // Device Unique PCs
  const devPcs = new Set();
  devices.forEach(d => { if (d.deviceName) devPcs.add(d.deviceName); });
  const device_unique_pcs = devPcs.size;

  // File Statistics
  const total_files = files.length;
  const uniqueFilesSet = new Set(files.map(f => f.fileName));
  const unique_files = uniqueFilesSet.size;

  // File types
  let doc = 0, exe = 0, jpg = 0, pdf = 0, txt = 0, zip = 0, sensitive_files = 0;
  files.forEach(f => {
    const ext = (f.fileType || "").toLowerCase();
    const name = (f.fileName || "").toLowerCase();
    
    if (ext.includes("doc") || name.endsWith(".doc") || name.endsWith(".docx")) doc++;
    else if (ext.includes("exe") || name.endsWith(".exe")) exe++;
    else if (ext.includes("jpg") || ext.includes("png") || name.endsWith(".jpg") || name.endsWith(".png")) jpg++;
    else if (ext.includes("pdf") || name.endsWith(".pdf")) pdf++;
    else if (ext.includes("txt") || ext.includes("csv") || ext.includes("xlsx") || name.endsWith(".txt") || name.endsWith(".csv") || name.endsWith(".xlsx")) txt++;
    else if (ext.includes("zip") || name.endsWith(".zip")) zip++;

    if (f.isSensitive) sensitive_files++;
  });

  return {
    mean_hour,
    min_hour,
    max_hour,
    unique_pcs,
    event_count,
    device_events,
    device_unique_pcs,
    total_files,
    unique_files,
    doc,
    exe,
    jpg,
    pdf,
    txt,
    zip,
    sensitive_files
  };
}

/**
 * Sends features to FastAPI backend. Falls back gracefully if backend is offline.
 */
export async function analyzeUser(employee) {
  const payload = computeUserFeatures(employee);

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/analyze-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    isBackendOffline = false;
    
    // Update local cache inside employee object
    employee.riskScore = data.risk_score;
    employee.threatLevel = data.risk_level;
    employee.isHighRisk = data.is_high_risk;
    employee.apiMessage = data.message;
    employee.isApiOffline = false;

    return {
      is_high_risk: data.is_high_risk,
      risk_score: data.risk_score,
      risk_level: data.risk_level,
      message: data.message,
      offline: false
    };

  } catch (error) {
    console.warn(`MedLeak AI Backend Offline: ${error.message}`);
    isBackendOffline = true;
    
    // Mark cache as offline fallback
    employee.isApiOffline = true;
    
    // Keep using existing mock values from data.js as fallback
    return {
      is_high_risk: employee.riskScore >= 50,
      risk_score: employee.riskScore,
      risk_level: employee.threatLevel,
      message: "Backend Offline. Displaying local cache.",
      offline: true
    };
  }
}

/**
 * Scans all employees on startup to populate live risk scores
 */
export async function initializeLiveRiskData(employees) {
  // Test connection to backend first
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/`);
    if (res.ok) {
      console.log("Connected to MedLeak AI FastAPI backend.");
      isBackendOffline = false;
      
      // Perform predictions for all employees
      const promises = employees.map(emp => analyzeUser(emp));
      await Promise.all(promises);
    } else {
      throw new Error("Base endpoint returned bad status");
    }
  } catch (e) {
    console.warn("FastAPI backend is offline. Using local security models.");
    isBackendOffline = true;
    employees.forEach(emp => {
      emp.isApiOffline = true;
    });
  }
}
