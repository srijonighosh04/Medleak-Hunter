/**
 * MedLeak AI - Security Operations Center (SOC)
 * Mock Healthcare Cybersecurity Dataset
 */

// Generate historical dates helper
function getPastDateString(daysAgo, hour = 12, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const mockEmployees = [
  {
    id: "EMP-1002",
    name: "Dr. Sarah Chen",
    role: "Lead Cardiologist",
    department: "Cardiology",
    email: "s.chen@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 88,
    threatLevel: "High",
    suspiciousEventsCount: 14,
    lastActive: getPastDateString(0, 11, 42),
    aiExplanation: "Dr. Chen's account exhibited abnormal access patterns by downloading 47 high-sensitivity EHR (Electronic Health Record) files in PDF format at 02:40 AM on a Sunday. This access was routed through an unmanaged personal iPad via an external VPN node from an IP address block that is blacklisted for hosting compromised medical proxy servers.",
    behavioralMetrics: {
      loginActivity: 85,
      deviceActivity: 92,
      fileAccessActivity: 95,
      sensitiveInteractions: 98
    },
    riskHistory: [
      { date: "06-18", score: 12 },
      { date: "06-19", score: 15 },
      { date: "06-20", score: 14 },
      { date: "06-21", score: 48 }, // First bulk download
      { date: "06-22", score: 55 },
      { date: "06-23", score: 78 }, // Off-hours logins
      { date: "06-24", score: 88 }  // Critical threshold
    ],
    loginHistory: [
      { timestamp: getPastDateString(0, 2, 40), ip: "185.220.101.4", location: "Strasbourg, FR (VPN)", device: "iPad-Chen-Personal", status: "Success", type: "External VPN" },
      { timestamp: getPastDateString(0, 8, 30), ip: "172.16.42.108", location: "Cardiology Wing (Intranet)", device: "Workstation-CARD-04", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(1, 23, 15), ip: "185.220.101.4", location: "Strasbourg, FR (VPN)", device: "iPad-Chen-Personal", status: "Success", type: "External VPN" },
      { timestamp: getPastDateString(2, 9, 0), ip: "172.16.42.108", location: "Cardiology Wing (Intranet)", device: "Workstation-CARD-04", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(3, 8, 45), ip: "172.16.42.108", location: "Cardiology Wing (Intranet)", device: "Workstation-CARD-04", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(0, 2, 42), deviceName: "iPad-Chen-Personal", type: "Unmanaged Device", status: "Warning", description: "Non-enrolled iOS device accessed internal EHR subnet." },
      { timestamp: getPastDateString(0, 2, 45), deviceName: "iPad-Chen-Personal", type: "Data Download", status: "Critical", description: "Large zip archive containing medical charts downloaded to local storage." },
      { timestamp: getPastDateString(3, 14, 20), deviceName: "USB-Kingston-32GB", type: "Mass Storage", status: "Normal", description: "Authorized encrypted USB mounted on Workstation-CARD-04." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(0, 2, 41), fileName: "EHR_Bulk_Export_CARDIOLOGY_Q2.zip", fileType: "ZIP / PDF", department: "Cardiology", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(0, 2, 43), fileName: "PATIENT_RECORD_SHARP_ROGER.pdf", fileType: "PDF", department: "Cardiology", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(0, 2, 45), fileName: "PATIENT_RECORD_GOMEZ_MARIA.pdf", fileType: "PDF", department: "Cardiology", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(0, 8, 35), fileName: "Daily_Ward_Rounds_2026-06-24.xlsx", fileType: "XLSX", department: "Cardiology", action: "Modified", isSensitive: false },
      { timestamp: getPastDateString(1, 10, 15), fileName: "Pacemaker_Telemetry_Data.csv", fileType: "CSV", department: "Cardiology", action: "Viewed", isSensitive: true }
    ]
  },
  {
    id: "EMP-1087",
    name: "Marcus Vance",
    role: "IT Database Administrator",
    department: "Information Technology",
    email: "m.vance@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 95,
    threatLevel: "Critical",
    suspiciousEventsCount: 22,
    lastActive: getPastDateString(0, 12, 10),
    aiExplanation: "Vance disabled security auditing triggers on the primary Electronic Health Records Database Cluster (EHR-PROD-DB-01) at 23:18 PM. Following the audit service suspension, he executed an unindexed query extracting 14,000+ patient records containing VIP identifiers and credit fields, and transferred the payload over SFTP to a public web hosting server.",
    behavioralMetrics: {
      loginActivity: 90,
      deviceActivity: 98,
      fileAccessActivity: 99,
      sensitiveInteractions: 96
    },
    riskHistory: [
      { date: "06-18", score: 5 },
      { date: "06-19", score: 8 },
      { date: "06-20", score: 12 },
      { date: "06-21", score: 12 },
      { date: "06-22", score: 25 }, // Unauthorized config changes
      { date: "06-23", score: 89 }, // Audit logs disabled
      { date: "06-24", score: 95 }  // Large exfiltration detected
    ],
    loginHistory: [
      { timestamp: getPastDateString(0, 1, 15), ip: "172.16.10.45", location: "IT Operations Center", device: "IT-ADMIN-CONSOLE-02", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(0, 11, 0), ip: "172.16.10.45", location: "IT Operations Center", device: "IT-ADMIN-CONSOLE-02", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(1, 23, 10), ip: "172.16.10.45", location: "IT Operations Center", device: "IT-ADMIN-CONSOLE-02", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(2, 9, 30), ip: "172.16.10.45", location: "IT Operations Center", device: "IT-ADMIN-CONSOLE-02", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(0, 23, 18), deviceName: "IT-ADMIN-CONSOLE-02", type: "Audit Configuration", status: "Critical", description: "Disabled audit trail logs on EHR-PROD-DB-01." },
      { timestamp: getPastDateString(0, 23, 22), deviceName: "IT-ADMIN-CONSOLE-02", type: "Outbound SFTP Connection", status: "Critical", description: "SFTP connection established to external server: 198.51.100.12 (HostGator IP)." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(0, 23, 20), fileName: "EHR_VIP_PATIENTS_EXTRACT.csv", fileType: "CSV", department: "Information Technology", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(0, 23, 21), fileName: "FINANCIAL_LEDGER_2025.sql", fileType: "SQL", department: "Information Technology", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(1, 14, 0), fileName: "db_backup_config.json", fileType: "JSON", department: "Information Technology", action: "Modified", isSensitive: false }
    ]
  },
  {
    id: "EMP-1045",
    name: "Elena Rostova",
    role: "Medical Records Clerk",
    department: "Medical Records",
    email: "e.rostova@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 72,
    threatLevel: "Medium",
    suspiciousEventsCount: 8,
    lastActive: getPastDateString(0, 10, 15),
    aiExplanation: "Elena has accessed patient directories and individual charts for oncology research datasets that are outside her assigned workspace queue. Over the past 48 hours, she viewed 182 distinct profiles for pediatric cancer trials, showing a repetitive and crawling access pattern inconsistent with her ticket caseload.",
    behavioralMetrics: {
      loginActivity: 45,
      deviceActivity: 30,
      fileAccessActivity: 90,
      sensitiveInteractions: 88
    },
    riskHistory: [
      { date: "06-18", score: 10 },
      { date: "06-19", score: 10 },
      { date: "06-20", score: 15 },
      { date: "06-21", score: 25 },
      { date: "06-22", score: 45 }, // Viewing non-assigned charts
      { date: "06-23", score: 62 },
      { date: "06-24", score: 72 }  // Pattern continues
    ],
    loginHistory: [
      { timestamp: getPastDateString(0, 8, 0), ip: "172.16.55.12", location: "Medical Records Room", device: "Workstation-REC-11", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(1, 8, 0), ip: "172.16.55.12", location: "Medical Records Room", device: "Workstation-REC-11", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(2, 7, 58), ip: "172.16.55.12", location: "Medical Records Room", device: "Workstation-REC-11", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(1, 15, 30), deviceName: "Workstation-REC-11", type: "Page Scraping", status: "Warning", description: "Repetitive database queries within a short window." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(0, 9, 30), fileName: "PEDIATRIC_ONCO_TRIAL_CASE_0942.html", fileType: "HTML", department: "Medical Records", action: "Viewed", isSensitive: true },
      { timestamp: getPastDateString(0, 9, 33), fileName: "PEDIATRIC_ONCO_TRIAL_CASE_0811.html", fileType: "HTML", department: "Medical Records", action: "Viewed", isSensitive: true },
      { timestamp: getPastDateString(0, 9, 36), fileName: "PEDIATRIC_ONCO_TRIAL_CASE_1120.html", fileType: "HTML", department: "Medical Records", action: "Viewed", isSensitive: true },
      { timestamp: getPastDateString(0, 9, 40), fileName: "PEDIATRIC_ONCO_TRIAL_CASE_1009.html", fileType: "HTML", department: "Medical Records", action: "Viewed", isSensitive: true },
      { timestamp: getPastDateString(1, 14, 15), fileName: "ONCOLOGY_TRIAL_MASTER_LIST.xlsx", fileType: "XLSX", department: "Medical Records", action: "Viewed", isSensitive: true }
    ]
  },
  {
    id: "EMP-1211",
    name: "Dr. James Fletcher",
    role: "Oncology Researcher",
    department: "Oncology Research",
    email: "j.fletcher@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 84,
    threatLevel: "High",
    suspiciousEventsCount: 11,
    lastActive: getPastDateString(0, 9, 20),
    aiExplanation: "Dr. Fletcher inserted an unauthorized USB drive into an oncology lab workstation, copied clinical trial genomic data, and subsequently attempted to bypass the endpoint DLP agent by renaming proprietary clinical research protocols (DOCX extension to PNG image files) before uploading to a personal Dropbox account.",
    behavioralMetrics: {
      loginActivity: 60,
      deviceActivity: 96,
      fileAccessActivity: 85,
      sensitiveInteractions: 90
    },
    riskHistory: [
      { date: "06-18", score: 20 },
      { date: "06-19", score: 22 },
      { date: "06-20", score: 20 },
      { date: "06-21", score: 35 },
      { date: "06-22", score: 60 }, // USB insertion detected
      { date: "06-23", score: 81 }, // Renamed file extensions
      { date: "06-24", score: 84 }  // Dropbox upload trigger
    ],
    loginHistory: [
      { timestamp: getPastDateString(0, 7, 10), ip: "172.16.88.34", location: "Oncology Lab 4", device: "LAB-WORKSTATION-09", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(1, 7, 0), ip: "172.16.88.34", location: "Oncology Lab 4", device: "LAB-WORKSTATION-09", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(2, 6, 50), ip: "172.16.88.34", location: "Oncology Lab 4", device: "LAB-WORKSTATION-09", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(2, 11, 40), deviceName: "LAB-WORKSTATION-09", type: "USB Insertion", status: "Critical", description: "Unregistered storage device 'Sandisk Ultra' mounted." },
      { timestamp: getPastDateString(0, 8, 15), deviceName: "LAB-WORKSTATION-09", type: "DLP Bypass Attempt", status: "Critical", description: "Detected file signature mismatch: Renaming word document to image." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(0, 8, 10), fileName: "Patient_Genomic_Sequencing_Trial_v3.docx (renamed to image_profile.png)", fileType: "DOCX", department: "Oncology Research", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(1, 16, 20), fileName: "FDA_Submission_Protocol_Draft.docx", fileType: "DOCX", department: "Oncology Research", action: "Downloaded", isSensitive: true }
    ]
  },
  {
    id: "EMP-1130",
    name: "Claire Bennett",
    role: "Pharmacy Dispenser",
    department: "Pharmacy",
    email: "c.bennett@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 61,
    threatLevel: "Medium",
    suspiciousEventsCount: 6,
    lastActive: getPastDateString(0, 11, 0),
    aiExplanation: "Claire Bennett logged in from two geographically distinct locations (St. Jude Main Pharmacy terminal and an IP registered in Dallas, TX) within a 45-minute span. This impossible travel indicator points to credentials sharing or active session hijacking on the Narcotics Dispensation Vault Console.",
    behavioralMetrics: {
      loginActivity: 95,
      deviceActivity: 40,
      fileAccessActivity: 50,
      sensitiveInteractions: 70
    },
    riskHistory: [
      { date: "06-18", score: 8 },
      { date: "06-19", score: 8 },
      { date: "06-20", score: 10 },
      { date: "06-21", score: 10 },
      { date: "06-22", score: 12 },
      { date: "06-23", score: 58 }, // Impossible travel log
      { date: "06-24", score: 61 }  // Active monitoring
    ],
    loginHistory: [
      { timestamp: getPastDateString(0, 10, 15), ip: "172.16.33.15", location: "Main Pharmacy Vault", device: "PHARM-VAULT-CONS", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(0, 11, 0), ip: "98.137.11.23", location: "Dallas, TX (Residential)", device: "PC-Bennett-Home", status: "Success", type: "External WAN" },
      { timestamp: getPastDateString(1, 10, 0), ip: "172.16.33.15", location: "Main Pharmacy Vault", device: "PHARM-VAULT-CONS", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(0, 11, 0), deviceName: "PC-Bennett-Home", type: "Anomalous Login Location", status: "Warning", description: "Concurrent logins across multiple cities." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(0, 10, 20), fileName: "Opiate_Discharge_Ledger_2026.csv", fileType: "CSV", department: "Pharmacy", action: "Viewed", isSensitive: true },
      { timestamp: getPastDateString(1, 11, 40), fileName: "Pharmacy_Inventory_Q2.xlsx", fileType: "XLSX", department: "Pharmacy", action: "Modified", isSensitive: false }
    ]
  },
  {
    id: "EMP-1052",
    name: "Thomas Drake",
    role: "Financial Analyst",
    department: "Billing & Finance",
    email: "t.drake@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 45,
    threatLevel: "Low",
    suspiciousEventsCount: 3,
    lastActive: getPastDateString(1, 16, 45),
    aiExplanation: "Thomas's account was flagged for exporting Medicare billing databases containing social security numbers. While this is partially in line with his job scope, the bulk volume (5,000+ entries) and action of renaming the report to 'Budget_Report_2026_Draft' represents anomalous behavior.",
    behavioralMetrics: {
      loginActivity: 40,
      deviceActivity: 40,
      fileAccessActivity: 75,
      sensitiveInteractions: 60
    },
    riskHistory: [
      { date: "06-18", score: 15 },
      { date: "06-19", score: 15 },
      { date: "06-20", score: 18 },
      { date: "06-21", score: 18 },
      { date: "06-22", score: 40 }, // Export SSN database
      { date: "06-23", score: 45 },
      { date: "06-24", score: 45 }
    ],
    loginHistory: [
      { timestamp: getPastDateString(1, 9, 0), ip: "172.16.20.18", location: "Billing Dept (Office 4B)", device: "FIN-DESKTOP-09", status: "Success", type: "Internal LAN" },
      { timestamp: getPastDateString(2, 9, 0), ip: "172.16.20.18", location: "Billing Dept (Office 4B)", device: "FIN-DESKTOP-09", status: "Success", type: "Internal LAN" }
    ],
    deviceHistory: [
      { timestamp: getPastDateString(1, 14, 25), deviceName: "FIN-DESKTOP-09", type: "Large Export File", status: "Warning", description: "CSV file containing 5,000 billing records written to local drive." }
    ],
    fileHistory: [
      { timestamp: getPastDateString(1, 14, 22), fileName: "Medicare_SSN_Billing_Ledger_2025.csv", fileType: "CSV", department: "Billing & Finance", action: "Downloaded", isSensitive: true },
      { timestamp: getPastDateString(1, 15, 0), fileName: "Budget_Report_2026_Draft.csv", fileType: "CSV", department: "Billing & Finance", action: "Modified", isSensitive: true }
    ]
  },
  {
    id: "EMP-1304",
    name: "Dr. Alicia Vance",
    role: "ER Resident Physician",
    department: "Emergency",
    email: "a.vance@stjudemedical.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
    riskScore: 22,
    threatLevel: "Low",
    suspiciousEventsCount: 1,
    lastActive: getPastDateString(0, 12, 0),
    aiExplanation: "Dr. Alicia Vance experienced three failed login attempts from an Android phone using an outdated operating system (Android 9) within 1 minute, followed by a successful login. Her profile is flagged for potential credential stuffing or brute force testing from unsecured endpoints.",
    behavioralMetrics: {
      loginActivity: 65,
      deviceActivity: 20,
      fileAccessActivity: 10,
      sensitiveInteractions: 15
    },
    riskHistory: [
      { date: "06-18", score: 5 },
      { date: "06-19", score: 5 },
      { date: "06-20", score: 5 },
      { date: "06-21", score: 22 }, // Login failures
      { date: "06-22", score: 22 },
      { date: "06-23", score: 22 },
      { date: "06-24", score: 22 }
    ],
    loginHistory: [
      { timestamp: getPastDateString(3, 22, 10), ip: "172.16.80.201", location: "Emergency Ward Intranet", device: "ER-MOBILE-01", status: "Success", type: "Internal Wi-Fi" },
      { timestamp: getPastDateString(3, 22, 9), ip: "172.16.80.201", location: "Emergency Ward Intranet", device: "ER-MOBILE-01", status: "Failed", type: "Internal Wi-Fi" },
      { timestamp: getPastDateString(3, 22, 8), ip: "172.16.80.201", location: "Emergency Ward Intranet", device: "ER-MOBILE-01", status: "Failed", type: "Internal Wi-Fi" }
    ],
    deviceHistory: [],
    fileHistory: [
      { timestamp: getPastDateString(3, 22, 15), fileName: "Emergency_Admissions_Registry.xlsx", fileType: "XLSX", department: "Emergency", action: "Viewed", isSensitive: false }
    ]
  },
  // Add 13 more employees for 20 total top risk list
  { id: "EMP-1402", name: "David Miller", role: "HR Administrator", department: "Human Resources", email: "d.miller@stjudemedical.org", avatar: "", riskScore: 58, threatLevel: "Medium", suspiciousEventsCount: 5, lastActive: getPastDateString(0, 10, 0), aiExplanation: "Bulk access of employee medical files during a standard audit. Flagged because access was completed in bulk rather than individual requests.", behavioralMetrics: { loginActivity: 30, deviceActivity: 40, fileAccessActivity: 75, sensitiveInteractions: 80 }, riskHistory: [{ date: "06-20", score: 10 }, { date: "06-24", score: 58 }] },
  { id: "EMP-1022", name: "Robert Taylor", role: "Helpdesk Engineer", department: "Information Technology", email: "r.taylor@stjudemedical.org", avatar: "", riskScore: 55, threatLevel: "Medium", suspiciousEventsCount: 4, lastActive: getPastDateString(0, 11, 15), aiExplanation: "Accessed administrative servers without active support tickets or configuration change logs matching his employee ID.", behavioralMetrics: { loginActivity: 70, deviceActivity: 40, fileAccessActivity: 60, sensitiveInteractions: 55 }, riskHistory: [{ date: "06-20", score: 15 }, { date: "06-24", score: 55 }] },
  { id: "EMP-1115", name: "Maria Martinez", role: "Clinical Nurse Specialist", department: "Oncology", email: "m.martinez@stjudemedical.org", avatar: "", riskScore: 50, threatLevel: "Medium", suspiciousEventsCount: 3, lastActive: getPastDateString(0, 9, 30), aiExplanation: "Exceeded threshold for patient record searches on a single shift. Searched 85 patient histories in 2 hours.", behavioralMetrics: { loginActivity: 20, deviceActivity: 10, fileAccessActivity: 80, sensitiveInteractions: 85 }, riskHistory: [{ date: "06-20", score: 12 }, { date: "06-24", score: 50 }] },
  { id: "EMP-1082", name: "William Anderson", role: "Medical Records Coordinator", department: "Medical Records", email: "w.anderson@stjudemedical.org", avatar: "", riskScore: 48, threatLevel: "Medium", suspiciousEventsCount: 3, lastActive: getPastDateString(1, 15, 30), aiExplanation: "Shared system credentials with another workstation terminal that queried patient records.", behavioralMetrics: { loginActivity: 75, deviceActivity: 30, fileAccessActivity: 50, sensitiveInteractions: 45 }, riskHistory: [{ date: "06-20", score: 10 }, { date: "06-24", score: 48 }] },
  { id: "EMP-1191", name: "Linda Jackson", role: "Billing Specialist", department: "Billing & Finance", email: "l.jackson@stjudemedical.org", avatar: "", riskScore: 42, threatLevel: "Low", suspiciousEventsCount: 2, lastActive: getPastDateString(1, 14, 0), aiExplanation: "Exported patient invoice registers to an external mail domain.", behavioralMetrics: { loginActivity: 40, deviceActivity: 30, fileAccessActivity: 65, sensitiveInteractions: 50 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 42 }] },
  { id: "EMP-1288", name: "James White", role: "Research Assistant", department: "Oncology Research", email: "j.white@stjudemedical.org", avatar: "", riskScore: 38, threatLevel: "Low", suspiciousEventsCount: 2, lastActive: getPastDateString(2, 10, 0), aiExplanation: "Attempted to mount an unapproved USB flash drive on a research server cluster.", behavioralMetrics: { loginActivity: 30, deviceActivity: 80, fileAccessActivity: 30, sensitiveInteractions: 40 }, riskHistory: [{ date: "06-20", score: 10 }, { date: "06-24", score: 38 }] },
  { id: "EMP-1355", name: "Patricia Harris", role: "Nurse Practitioner", department: "Cardiology", email: "p.harris@stjudemedical.org", avatar: "", riskScore: 35, threatLevel: "Low", suspiciousEventsCount: 1, lastActive: getPastDateString(0, 8, 30), aiExplanation: "Logged in from a mobile device that failed the corporate security patch status check.", behavioralMetrics: { loginActivity: 80, deviceActivity: 50, fileAccessActivity: 20, sensitiveInteractions: 20 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 35 }] },
  { id: "EMP-1452", name: "Richard Martin", role: "IT Security Analyst", department: "Information Technology", email: "r.martin@stjudemedical.org", avatar: "", riskScore: 30, threatLevel: "Low", suspiciousEventsCount: 1, lastActive: getPastDateString(0, 11, 45), aiExplanation: "Run port scans on database network segments as part of auditing, but lacked matching change-control approvals.", behavioralMetrics: { loginActivity: 50, deviceActivity: 60, fileAccessActivity: 20, sensitiveInteractions: 15 }, riskHistory: [{ date: "06-20", score: 10 }, { date: "06-24", score: 30 }] },
  { id: "EMP-1502", name: "Elizabeth Thompson", role: "Radiology Tech", department: "Radiology", email: "e.thompson@stjudemedical.org", avatar: "", riskScore: 28, threatLevel: "Low", suspiciousEventsCount: 1, lastActive: getPastDateString(1, 16, 20), aiExplanation: "Transferred clinical DICOM MRI files to a network folder without write permissions.", behavioralMetrics: { loginActivity: 25, deviceActivity: 20, fileAccessActivity: 55, sensitiveInteractions: 40 }, riskHistory: [{ date: "06-20", score: 8 }, { date: "06-24", score: 28 }] },
  { id: "EMP-1555", name: "Joseph Garcia", role: "Chief Pharmacist", department: "Pharmacy", email: "j.garcia@stjudemedical.org", avatar: "", riskScore: 25, threatLevel: "Low", suspiciousEventsCount: 1, lastActive: getPastDateString(0, 12, 30), aiExplanation: "Accessing drug inventory ledgers from home VPN outside shift schedule window.", behavioralMetrics: { loginActivity: 60, deviceActivity: 20, fileAccessActivity: 30, sensitiveInteractions: 35 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 25 }] },
  { id: "EMP-1620", name: "Susan Robinson", role: "Clinic Receptionist", department: "Outpatient Clinic", email: "s.robinson@stjudemedical.org", avatar: "", riskScore: 24, threatLevel: "Low", suspiciousEventsCount: 1, lastActive: getPastDateString(2, 14, 15), aiExplanation: "Downloaded clinic schedule containing patient insurance IDs on a personal drive.", behavioralMetrics: { loginActivity: 30, deviceActivity: 40, fileAccessActivity: 40, sensitiveInteractions: 30 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 24 }] },
  { id: "EMP-1699", name: "Charles Clark", role: "Purchasing Manager", department: "Supply Chain", email: "c.clark@stjudemedical.org", avatar: "", riskScore: 18, threatLevel: "Low", suspiciousEventsCount: 0, lastActive: getPastDateString(1, 15, 0), aiExplanation: "No critical anomalous behavior detected. Normal procurement accesses.", behavioralMetrics: { loginActivity: 20, deviceActivity: 20, fileAccessActivity: 15, sensitiveInteractions: 10 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 18 }] },
  { id: "EMP-1744", name: "Jessica Rodriguez", role: "Cardiology Nurse", department: "Cardiology", email: "j.rodriguez@stjudemedical.org", avatar: "", riskScore: 15, threatLevel: "Low", suspiciousEventsCount: 0, lastActive: getPastDateString(0, 10, 45), aiExplanation: "Standard clinical access profile. Low alert profile status.", behavioralMetrics: { loginActivity: 15, deviceActivity: 10, fileAccessActivity: 12, sensitiveInteractions: 15 }, riskHistory: [{ date: "06-20", score: 5 }, { date: "06-24", score: 15 }] }
];

export const mockAlerts = [
  {
    id: "ALT-8492",
    employeeId: "EMP-1087",
    employeeName: "Marcus Vance",
    type: "Sensitive patient record exposure",
    severity: "Critical",
    description: "Audit trail services disabled on database cluster EHR-PROD-DB-01, followed by extraction of 14,000+ patient records.",
    timestamp: getPastDateString(0, 23, 20),
    status: "Active",
    department: "Information Technology"
  },
  {
    id: "ALT-3912",
    employeeId: "EMP-1002",
    employeeName: "Dr. Sarah Chen",
    type: "Excessive file access",
    severity: "High",
    description: "47 Electronic Health Record files (ZIP archive) downloaded during off-duty hours (02:40 AM) from external VPN.",
    timestamp: getPastDateString(0, 2, 45),
    status: "Active",
    department: "Cardiology"
  },
  {
    id: "ALT-7193",
    employeeId: "EMP-1211",
    employeeName: "Dr. James Fletcher",
    type: "Unauthorized device usage",
    severity: "High",
    description: "Proprietary FDA trial documents downloaded and renamed to bypass DLP agent filters before transferring to personal cloud storage.",
    timestamp: getPastDateString(0, 8, 15),
    status: "Active",
    department: "Oncology Research"
  },
  {
    id: "ALT-5843",
    employeeId: "EMP-1130",
    employeeName: "Claire Bennett",
    type: "Abnormal employee behavior",
    severity: "High",
    description: "Impossible travel velocity: Successful login from Strasbourg, FR VPN and Dallas, TX within 45 minutes on pharmacy vault console.",
    timestamp: getPastDateString(0, 11, 0),
    status: "Active",
    department: "Pharmacy"
  },
  {
    id: "ALT-1209",
    employeeId: "EMP-1045",
    employeeName: "Elena Rostova",
    type: "Abnormal employee behavior",
    severity: "Medium",
    description: "Accumulated 182 accesses to pediatric oncology research files over 48 hours without active treatment workflow tasks.",
    timestamp: getPastDateString(0, 10, 15),
    status: "Active",
    department: "Medical Records"
  },
  {
    id: "ALT-6432",
    employeeId: "EMP-1052",
    employeeName: "Thomas Drake",
    type: "Excessive file access",
    severity: "Medium",
    description: "Exported billing ledger containing 5,000 Medicare entries including encrypted Social Security Numbers.",
    timestamp: getPastDateString(1, 14, 25),
    status: "Acknowledged",
    department: "Billing & Finance"
  },
  {
    id: "ALT-0428",
    employeeId: "EMP-1304",
    employeeName: "Dr. Alicia Vance",
    type: "Abnormal employee behavior",
    severity: "Low",
    description: "Consecutive login failures from unsupported legacy mobile device (Android 9) on emergency admissions web console.",
    timestamp: getPastDateString(3, 22, 10),
    status: "Dismissed",
    department: "Emergency"
  }
];

// Global security stats helper
export const securityStats = {
  totalMonitored: 842,
  highRiskEmployees: 4, // EMP-1087, EMP-1002, EMP-1211, EMP-1045
  criticalAlerts: 4,   // Critical and High active alerts
  sensitiveAccessEvents: 3418, // Total sensitive accesses this week
  systemRiskTrend: [
    { date: "06-18", riskValue: 18 },
    { date: "06-19", riskValue: 22 },
    { date: "06-20", riskValue: 20 },
    { date: "06-21", riskValue: 35 },
    { date: "06-22", riskValue: 48 },
    { date: "06-23", riskValue: 72 },
    { date: "06-24", riskValue: 84 }
  ],
  loginDistribution: [
    { hour: "00:00 - 04:00", value: 120, anomalous: 48 },
    { hour: "04:00 - 08:00", value: 340, anomalous: 15 },
    { hour: "08:00 - 12:00", value: 1240, anomalous: 20 },
    { hour: "12:00 - 16:00", value: 1450, anomalous: 34 },
    { hour: "16:00 - 20:00", value: 890, anomalous: 28 },
    { hour: "20:00 - 00:00", value: 310, anomalous: 95 }
  ],
  deviceDistribution: [
    { type: "Corporate Laptop", count: 710 },
    { type: "Pharmacy Terminals", count: 48 },
    { type: "Lab Workstations", count: 64 },
    { type: "Personal Mobile (BYOD)", count: 182 },
    { type: "Unauthorized Devices", count: 12 }
  ],
  fileTypeAccess: [
    { extension: "PDF (EHR Logs)", count: 2450, percentage: 55 },
    { extension: "XLSX (Billing / Schedules)", count: 1210, percentage: 27 },
    { extension: "DOCX (Research / Protocols)", count: 480, percentage: 11 },
    { extension: "SQL / CSV (Extracts)", count: 190, percentage: 4 },
    { extension: "Others (DICOM / HTML)", count: 110, percentage: 3 }
  ],
  sensitiveDataAccessTrend: [
    { date: "06-18", value: 410 },
    { date: "06-19", value: 430 },
    { date: "06-20", value: 380 },
    { date: "06-21", value: 520 },
    { date: "06-22", value: 680 },
    { date: "06-23", value: 810 },
    { date: "06-24", value: 920 }
  ],
  insiderThreatPredictions: [
    { department: "Cardiology", probability: 0.18, primaryVector: "External VPN Off-Hours Access" },
    { department: "Information Technology", probability: 0.28, primaryVector: "Privilege Abuse / Auditing Disable" },
    { department: "Pharmacy", probability: 0.15, primaryVector: "Credentials Sharing / Concurrent Session" },
    { department: "Oncology Research", probability: 0.22, primaryVector: "Endpoint DLP Bypass (USB / Cloud)" },
    { department: "Medical Records", probability: 0.12, primaryVector: "Excessive View Crawling" }
  ]
};
