/**
 * MedLeak AI - Custom HTML5 Canvas Charting Engine
 * Provides futuristic glowing visualization components
 */

// Polyfill for Canvas roundRect to support older or headless browser test environments
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    if (radii.length === 1) radii = [radii[0], radii[0], radii[0], radii[0]];
    if (radii.length === 2) radii = [radii[0], radii[1], radii[0], radii[1]];
    if (radii.length === 3) radii = [radii[0], radii[1], radii[2], radii[1]];
    const r = { tl: radii[0], tr: radii[1], br: radii[2], bl: radii[3] };
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
    return this;
  };
}

// Global tooltip DOM helper
let chartTooltip = null;
function getOrCreateTooltip() {
  if (!chartTooltip) {
    chartTooltip = document.createElement("div");
    chartTooltip.style.position = "absolute";
    chartTooltip.style.padding = "8px 12px";
    chartTooltip.style.background = "#0d1426";
    chartTooltip.style.border = "1px solid #00f0ff";
    chartTooltip.style.borderRadius = "4px";
    chartTooltip.style.color = "#ffffff";
    chartTooltip.style.fontFamily = "'Inter', sans-serif";
    chartTooltip.style.fontSize = "0.75rem";
    chartTooltip.style.pointerEvents = "none";
    chartTooltip.style.opacity = "0";
    chartTooltip.style.transition = "opacity 0.15s ease";
    chartTooltip.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5), 0 0 8px rgba(0,240,255,0.2)";
    chartTooltip.style.zIndex = "1000";
    document.body.appendChild(chartTooltip);
  }
  return chartTooltip;
}

/**
 * Renders a glowing Line/Area chart for Risk Trends
 */
export function renderRiskTrendChart(canvasId, dataPoints) {
  let canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Clone and replace the canvas to strip any previous event listeners
  const newCanvas = canvas.cloneNode(true);
  canvas.replaceWith(newCanvas);
  canvas = newCanvas;

  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Set internal resolution matching CSS size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;

  // Chart padding
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Find maximum data value to scale appropriately, default to at least 100
  const values = dataPoints.map(dp => dp.score !== undefined ? dp.score : (dp.riskValue !== undefined ? dp.riskValue : (dp.value !== undefined ? dp.value : 0)));
  const maxDataVal = Math.max(...values, 100);

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Background Grid Lines
  ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
  ctx.lineWidth = 1;
  
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const y = padTop + (chartH / numGridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
    
    // Draw Y values
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const val = Math.round(maxDataVal - (maxDataVal / numGridLines) * i);
    ctx.fillText(val.toString(), padLeft - 8, y);
  }

  // Draw X values and calculate positions
  const points = [];
  dataPoints.forEach((dp, idx) => {
    const x = padLeft + (chartW / (dataPoints.length - 1)) * idx;
    const val = dp.score !== undefined ? dp.score : (dp.riskValue !== undefined ? dp.riskValue : (dp.value !== undefined ? dp.value : 0));
    const y = padTop + chartH - (chartH * val) / maxDataVal;
    points.push({ x, y, label: dp.date, val: val });
    
    // X Label
    ctx.fillStyle = "#6b7280";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(dp.date, x, height - padBottom + 8);
  });

  // Create gradient strokes
  const gradientStroke = ctx.createLinearGradient(padLeft, 0, width - padRight, 0);
  gradientStroke.addColorStop(0, "#a855f7"); // Purple
  gradientStroke.addColorStop(0.5, "#3b82f6"); // Blue
  gradientStroke.addColorStop(1, "#00f0ff"); // Cyan

  const gradientFill = ctx.createLinearGradient(0, padTop, 0, height - padBottom);
  gradientFill.addColorStop(0, "rgba(0, 240, 255, 0.12)");
  gradientFill.addColorStop(1, "rgba(0, 240, 255, 0.0)");

  // Draw Area Fill first
  ctx.beginPath();
  ctx.moveTo(points[0].x, padTop + chartH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padTop + chartH);
  ctx.closePath();
  ctx.fillStyle = gradientFill;
  ctx.fill();

  // Draw Line path
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    // Standard linear line
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = gradientStroke;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Glow highlight
  ctx.shadowColor = "rgba(0, 240, 255, 0.3)";
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0; // reset

  // Interactivity tracking
  let activeIndex = -1;
  
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Find closest point on X axis
    let closestIndex = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = idx;
      }
    });

    if (minDist < 35) {
      if (activeIndex !== closestIndex) {
        activeIndex = closestIndex;
        drawChartState();
      }
      
      const activePoint = points[activeIndex];
      const tooltip = getOrCreateTooltip();
      tooltip.style.opacity = "1";
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY - 25}px`;
      tooltip.innerHTML = `
        <div style="font-family: var(--font-display); font-weight:700; color:var(--accent-cyan); margin-bottom:2px;">${activePoint.label}</div>
        <div style="font-family: var(--font-mono); font-size:11px;">Threat Level: <span style="font-weight:700; color:${activePoint.val > 75 ? '#ef4444' : activePoint.val > 45 ? '#eab308' : '#10b981'}">${activePoint.val}%</span></div>
      `;
    } else {
      hideTooltip();
    }
  }

  function hideTooltip() {
    activeIndex = -1;
    drawChartState();
    const tooltip = getOrCreateTooltip();
    tooltip.style.opacity = "0";
  }

  function drawChartState() {
    ctx.clearRect(0, 0, width, height);
    
    // Redraw grid lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= numGridLines; i++) {
      const y = padTop + (chartH / numGridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      
      ctx.fillStyle = "#6b7280";
      const val = Math.round(maxDataVal - (maxDataVal / numGridLines) * i);
      ctx.fillText(val.toString(), padLeft - 8, y);
    }
    
    // Redraw X values
    points.forEach(p => {
      ctx.fillStyle = "#6b7280";
      ctx.fillText(p.label, p.x, height - padBottom + 8);
    });

    // Area Fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, padTop + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradientFill;
    ctx.fill();

    // Line Path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = gradientStroke;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw active vertical line and highlights if active
    if (activeIndex !== -1) {
      const activePoint = points[activeIndex];
      
      // Vertical guide line
      ctx.beginPath();
      ctx.moveTo(activePoint.x, padTop);
      ctx.lineTo(activePoint.x, height - padBottom);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]); // reset
      
      // Outer glow circle
      ctx.beginPath();
      ctx.arc(activePoint.x, activePoint.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner solid point
      ctx.beginPath();
      ctx.arc(activePoint.x, activePoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", hideTooltip);
}

/**
 * Renders an animated gauge threat score chart
 */
export function renderGaugeChart(canvasId, score, minColor = "#00f0ff", maxColor = "#a855f7") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;

  const cx = width / 2;
  const cy = height - 10;
  const radius = Math.min(width / 2 - 20, height - 20);

  // Clear
  ctx.clearRect(0, 0, width, height);

  // 1. Draw outer gauge arc (track)
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0, false);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.stroke();

  // 2. Draw colored gradient arc based on score
  const angle = Math.PI + (Math.PI * score) / 100;
  
  const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  grad.addColorStop(0, minColor);
  grad.addColorStop(1, maxColor);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, angle, false);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  
  // Neon glow effect for value arc
  ctx.shadowColor = score > 75 ? "#ef4444" : score > 45 ? "#a855f7" : "#00f0ff";
  ctx.shadowBlur = 12;
  ctx.stroke();
  
  // Reset shadows
  ctx.shadowBlur = 0;
}

/**
 * Renders a bar chart for login frequency distribution
 */
export function renderLoginDistribution(canvasId, dataset) {
  let canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Clone and replace the canvas to strip any previous event listeners
  const newCanvas = canvas.cloneNode(true);
  canvas.replaceWith(newCanvas);
  canvas = newCanvas;

  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;

  const padLeft = 40;
  const padRight = 10;
  const padTop = 20;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  ctx.clearRect(0, 0, width, height);

  // Find max value
  const maxVal = Math.max(...dataset.map(d => d.value)) * 1.15;

  // Grid lines
  ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padTop + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();

    ctx.fillStyle = "#6b7280";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toString(), padLeft - 8, y);
  }

  // Draw Bars
  const numBars = dataset.length;
  const barGap = 16;
  const barW = (chartW - (barGap * (numBars - 1))) / numBars;

  const rects = [];

  dataset.forEach((dp, idx) => {
    const barH = (chartH * dp.value) / maxVal;
    const anomH = (chartH * dp.anomalous) / maxVal;
    
    const x = padLeft + idx * (barW + barGap);
    const y = padTop + chartH - barH;
    
    rects.push({
      x, y, w: barW, h: barH, anomH, label: dp.hour, total: dp.value, suspicious: dp.anomalous
    });

    // Draw total volume bar
    ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();
    ctx.stroke();

    // Draw anomalous portion (stacked or layered inside)
    if (dp.anomalous > 0) {
      const anomY = padTop + chartH - anomH;
      ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
      ctx.beginPath();
      ctx.roundRect(x, anomY, barW, anomH, [0, 0, 4, 4]);
      ctx.fill();
      
      // Neon glow
      ctx.shadowColor = "rgba(239, 68, 68, 0.4)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(x, anomY, barW, Math.min(anomH, 2), 0);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // X Labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "9px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(dp.hour, x + barW / 2, height - padBottom + 8);
  });

  // Interactivity
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hoveredBar = null;
    rects.forEach(r => {
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
        hoveredBar = r;
      }
    });

    if (hoveredBar) {
      const tooltip = getOrCreateTooltip();
      tooltip.style.opacity = "1";
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY - 25}px`;
      tooltip.innerHTML = `
        <div style="font-family: var(--font-display); font-weight:700; color:#3b82f6; margin-bottom:2px;">Time slot: ${hoveredBar.label}</div>
        <div style="font-family: var(--font-mono); font-size:11px; margin-bottom:2px;">Total requests: <span style="font-weight:700;">${hoveredBar.total}</span></div>
        <div style="font-family: var(--font-mono); font-size:11px; color:#ef4444;">Suspicious requests: <span style="font-weight:700;">${hoveredBar.suspicious}</span></div>
      `;
    } else {
      const tooltip = getOrCreateTooltip();
      tooltip.style.opacity = "0";
    }
  }

  function handleMouseLeave() {
    const tooltip = getOrCreateTooltip();
    tooltip.style.opacity = "0";
  }

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);
}

/**
 * Renders horizontal file type usage statistics
 */
export function renderFileTypeAccess(canvasId, dataset) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const devicePixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  const rowH = height / dataset.length;

  dataset.forEach((dp, idx) => {
    const yOffset = rowH * idx;
    
    // File label
    ctx.fillStyle = "#fff";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(dp.extension, 10, yOffset + 5);

    // Count label
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "right";
    ctx.fillText(`${dp.count} files (${dp.percentage}%)`, width - 10, yOffset + 5);

    // Progress Bar Track
    const barY = yOffset + 24;
    const barW = width - 20;
    const barH = 8;

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.beginPath();
    ctx.roundRect(10, barY, barW, barH, 4);
    ctx.fill();

    // Progress Bar Fill
    const fillW = (barW * dp.percentage) / 100;
    const grad = ctx.createLinearGradient(10, 0, width - 10, 0);
    grad.addColorStop(0, "#3b82f6");
    grad.addColorStop(1, "#00f0ff");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(10, barY, fillW, barH, 4);
    ctx.fill();

    // Subtle glow on fill edge
    ctx.shadowColor = "rgba(0, 240, 255, 0.4)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.roundRect(10, barY, fillW, barH, 4);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
  });
}

/**
 * Renders an activity heatmap grid in a container (resembling GitHub contributions)
 */
export function renderActivityHeatmap(containerId, daysHistory = 70) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(11, 1fr)";
  container.style.gap = "6px";
  container.style.padding = "10px";
  container.style.width = "100%";

  // Create grid cells
  // Random activity density based on cybersecurity profile
  for (let i = 0; i < 77; i++) {
    const cell = document.createElement("div");
    cell.style.aspectRatio = "1";
    cell.style.borderRadius = "3px";
    cell.style.border = "1px solid rgba(255, 255, 255, 0.02)";
    
    // Pick threat levels randomly for display
    const seed = Math.random();
    let bg = "rgba(255,255,255,0.02)";
    let border = "rgba(255,255,255,0.05)";
    let desc = "Normal access (0 alerts)";
    
    if (seed > 0.95) {
      bg = "rgba(239, 68, 68, 0.8)";
      border = "#ef4444";
      desc = "Critical Severity Event (Access anomaly)";
    } else if (seed > 0.85) {
      bg = "rgba(168, 85, 247, 0.6)";
      border = "#a855f7";
      desc = "High Severity Event (Suspicious logs)";
    } else if (seed > 0.7) {
      bg = "rgba(59, 130, 246, 0.4)";
      border = "#3b82f6";
      desc = "Moderate logs (Minor triggers)";
    } else if (seed > 0.4) {
      bg = "rgba(0, 240, 255, 0.15)";
      border = "rgba(0, 240, 255, 0.3)";
      desc = "Standard health-log access activity";
    }

    cell.style.backgroundColor = bg;
    cell.style.borderColor = border;
    cell.style.cursor = "pointer";

    // Set tooltip text
    cell.addEventListener("mouseenter", (e) => {
      const tooltip = getOrCreateTooltip();
      tooltip.style.opacity = "1";
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY - 25}px`;
      tooltip.innerHTML = `<span style="font-family:var(--font-mono); font-weight:700;">${desc}</span>`;
    });
    
    cell.addEventListener("mouseleave", () => {
      const tooltip = getOrCreateTooltip();
      tooltip.style.opacity = "0";
    });

    container.appendChild(cell);
  }
}
