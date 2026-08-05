/* Hand-rolled SVG charts for the report page.
   All charts read from window.REPORT_DATA (static/js/data.js). */
(function () {
  "use strict";
  const D = window.REPORT_DATA;

  const COLOR = {
    NoHead: "#2a78d6",
    RawHead: "#eb6834",
    ROIHead: "#1baf7a",
    loc: "#4a3aa7",
    comp: "#eda100",
    qual: "#e87ba4",
    ink: "#14181f",
    ink2: "#52514e",
    ink3: "#898781",
    grid: "#e1e0d9",
    axis: "#c3c2b7"
  };
  const SCALING_COLOR = ["#2a78d6", "#eb6834", "#1baf7a"];
  // sequential blue ramp (light -> dark) for the heatmap
  const RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7",
    "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b"];

  /* ---------- helpers ---------- */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function txt(parent, x, y, str, attrs) {
    const t = el("text", Object.assign({ x, y }, attrs || {}), parent);
    t.textContent = str;
    return t;
  }
  function fmt(v, dp) {
    return Number(v).toFixed(dp === undefined ? 1 : dp);
  }
  function rampColor(v, lo, hi) {
    const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
    return RAMP[Math.round(t * (RAMP.length - 1))];
  }
  function tintColor(hex, f) {
    f = f === undefined ? 0.55 : f;
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const mix = (c) => Math.round(c + (255 - c) * f);
    return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
  }

  /* ---------- tooltip ---------- */
  const tip = document.createElement("div");
  tip.id = "viz-tooltip";
  document.body.appendChild(tip);
  function showTip(evt, html) {
    tip.innerHTML = html;
    tip.style.opacity = "1";
    moveTip(evt);
  }
  function moveTip(evt) {
    const pad = 14;
    let x = evt.clientX + pad, y = evt.clientY + pad;
    const r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = evt.clientY - r.height - pad;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }
  function hideTip() { tip.style.opacity = "0"; }
  window.addEventListener("scroll", hideTip, { passive: true });
  function hover(node, htmlFn) {
    node.addEventListener("mouseenter", (e) => showTip(e, htmlFn()));
    node.addEventListener("mousemove", moveTip);
    node.addEventListener("mouseleave", hideTip);
  }
  function ttRows(title, swatch, rows) {
    const sw = swatch
      ? `<span style="width:9px;height:9px;border-radius:3px;background:${swatch};display:inline-block"></span>`
      : "";
    return `<div class="tt-title">${sw}${title}</div>` +
      rows.map(([k, v]) => `<div class="tt-row"><span>${k}</span><b>${v}</b></div>`).join("");
  }

  /* =====================================================
     1. Main experiment — grouped bars, one panel per task
     ===================================================== */
  const mainMetricTabs = document.querySelectorAll("#main-metric-tabs button");
  let mainMetric = "final";

  function renderMainResults() {
    const host = document.getElementById("chart-main-results");
    if (!host) return;
    host.innerHTML = "";
    const meta = D.metrics[mainMetric];

    D.tasks.forEach((task) => {
      const W = 340, H = 288;
      const m = { t: 40, r: 8, b: 30, l: task === "Task A" ? 40 : 26 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
        "aria-label": `${meta.label} for ${task}, configurations G1 to G6` });
      host.appendChild(svg);

      const vals = D.main[task][mainMetric];
      const maxV = meta.max;
      const y = (v) => m.t + ih - (v / maxV) * ih;

      // gridlines + y ticks
      const ticks = mainMetric === "steps" ? [0, 400, 800, 1200, 1600] : [0, 25, 50, 75, 100];
      ticks.forEach((tv) => {
        el("line", { x1: m.l, x2: W - m.r, y1: y(tv), y2: y(tv),
          stroke: COLOR.grid, "stroke-width": 1 }, svg);
        if (task === "Task A") {
          txt(svg, m.l - 7, y(tv) + 3.5, String(tv),
            { "text-anchor": "end", "font-size": 10, fill: COLOR.ink3 });
        }
      });

      // FoV group separation
      const bw = 34, gap = (iw - 6 * bw) / 7;
      const bx = (i) => m.l + gap + i * (bw + gap);
      const sepX = bx(3) - gap / 2;
      el("line", { x1: sepX, x2: sepX, y1: m.t - 4, y2: m.t + ih,
        stroke: COLOR.axis, "stroke-width": 1, "stroke-dasharray": "3 3" }, svg);
      txt(svg, (m.l + sepX) / 2, m.t - 10, "Large FoV wrist",
        { "text-anchor": "middle", "font-size": 9.5, fill: COLOR.ink3 });
      txt(svg, (sepX + W - m.r) / 2, m.t - 10, "D435-like wrist",
        { "text-anchor": "middle", "font-size": 9.5, fill: COLOR.ink3 });

      // G1 baseline reference (only for higher-is-better metrics)
      if (mainMetric !== "steps") {
        el("line", { x1: m.l, x2: W - m.r, y1: y(vals[0]), y2: y(vals[0]),
          stroke: "#c95d43", "stroke-width": 1.1, "stroke-dasharray": "2 4", opacity: 0.85 }, svg);
      }

      // bars (group is inert so the hover hit-rects stay on top)
      const barsG = el("g", { "pointer-events": "none" }, svg);
      D.configs.forEach((cfg, i) => {
        const head = D.headTypes[i];
        const v = vals[i];
        const barY = y(v);
        const baseline = m.t + ih;
        const roundedTop = (topY, botY) => {
          const r = Math.max(0, Math.min(4, botY - topY));
          return `M${bx(i)},${botY} L${bx(i)},${topY + r} Q${bx(i)},${topY} ${bx(i) + r},${topY} ` +
            `L${bx(i) + bw - r},${topY} Q${bx(i) + bw},${topY} ${bx(i) + bw},${topY + r} L${bx(i) + bw},${botY} Z`;
        };
        const bonus = D.main[task].bonus[i];
        if (mainMetric === "final" && bonus > 0) {
          // split bar: solid outcome segment + light bonus segment, 2px surface gap
          const oY = y(D.main[task].outcome[i]);
          el("rect", { x: bx(i), y: oY, width: bw, height: baseline - oY,
            fill: COLOR[head] }, barsG);
          el("path", { d: roundedTop(barY, oY - 2), fill: tintColor(COLOR[head]) }, barsG);
        } else {
          el("path", { d: roundedTop(barY, baseline), fill: COLOR[head] }, barsG);
        }

        // direct value label
        txt(svg, bx(i) + bw / 2, barY - 5,
          mainMetric === "steps" ? String(Math.round(v)) : fmt(v, mainMetric === "final" ? 1 : 0),
          { "text-anchor": "middle", "font-size": 10, "font-weight": 600, fill: COLOR.ink });
        // x label
        txt(svg, bx(i) + bw / 2, m.t + ih + 16, cfg,
          { "text-anchor": "middle", "font-size": 10.5, fill: COLOR.ink2 });

        const md = D.main[task];
        const hit = el("rect", { x: bx(i) - gap / 2, y: m.t - 4, width: bw + gap,
          height: ih + 4, fill: "transparent" }, svg);
        hover(hit, () => ttRows(`${task} · ${cfg} (${head})`, COLOR[head], [
          ["FinalScore", fmt(md.final[i]) + ` (${fmt(md.outcome[i])} + ${fmt(md.bonus[i])})`],
          ["Completion", md.completion[i] + "%"],
          ["Quality success", md.quality[i] + "%"],
          ["Avg. steps", Math.round(md.steps[i])]
        ]));
      });

      // baseline axis
      el("line", { x1: m.l, x2: W - m.r, y1: m.t + ih, y2: m.t + ih,
        stroke: COLOR.axis, "stroke-width": 1 }, svg);
      // panel title
      txt(svg, m.l + iw / 2, 14, `${task} — ${D.taskNames[task]}`,
        { "text-anchor": "middle", "font-size": 12, "font-weight": 650, fill: COLOR.ink });
    });
  }

  function syncSplitLegend() {
    document.querySelectorAll("#main-legend .split-only").forEach((n) => {
      n.style.display = mainMetric === "final" ? "" : "none";
    });
  }
  mainMetricTabs.forEach((b) => {
    b.addEventListener("click", () => {
      mainMetricTabs.forEach((x) => x.classList.toggle("active", x === b));
      mainMetric = b.dataset.metric;
      document.getElementById("main-metric-note").textContent = D.metrics[mainMetric].note;
      syncSplitLegend();
      renderMainResults();
    });
  });

  /* =====================================================
     2. FinalScore heatmap (tasks x configurations)
     ===================================================== */
  function renderHeatmap() {
    const host = document.getElementById("chart-heatmap");
    if (!host) return;
    const W = 760, H = 240;
    const m = { t: 34, r: 96, b: 10, l: 64 };
    const cols = 6, rows = 3;
    const cw = (W - m.l - m.r) / cols, ch = (H - m.t - m.b) / rows;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Mean FinalScore heatmap across tasks and configurations" });
    host.appendChild(svg);
    const LO = 25, HI = 95;

    D.tasks.forEach((task, r) => {
      txt(svg, m.l - 10, m.t + r * ch + ch / 2 + 4, task,
        { "text-anchor": "end", "font-size": 12, "font-weight": 600, fill: COLOR.ink2 });
      D.configs.forEach((cfg, c) => {
        const v = D.main[task].final[c];
        const fill = rampColor(v, LO, HI);
        const dark = (v - LO) / (HI - LO) > 0.45;
        const cell = el("rect", { x: m.l + c * cw + 2, y: m.t + r * ch + 2,
          width: cw - 4, height: ch - 4, rx: 7, fill }, svg);
        txt(svg, m.l + c * cw + cw / 2, m.t + r * ch + ch / 2 + 4.5, fmt(v),
          { "text-anchor": "middle", "font-size": 13, "font-weight": 600,
            fill: dark ? "#ffffff" : "#1d2733", "pointer-events": "none" });
        hover(cell, () => ttRows(`${task} · ${cfg} (${D.headTypes[c]})`, fill, [
          ["FinalScore", fmt(v)],
          ["Wrist FoV", D.fovs[c]],
          ["Quality success", D.main[task].quality[c] + "%"]
        ]));
      });
    });
    D.configs.forEach((cfg, c) => {
      txt(svg, m.l + c * cw + cw / 2, m.t - 8, cfg,
        { "text-anchor": "middle", "font-size": 11.5, "font-weight": 600, fill: COLOR.ink2 });
    });
    // group divider
    const sx = m.l + 3 * cw;
    el("line", { x1: sx, x2: sx, y1: m.t - 20, y2: H - m.b,
      stroke: COLOR.ink3, "stroke-width": 1, "stroke-dasharray": "3 3", opacity: 0.6 }, svg);

    // color scale legend
    const lx = W - m.r + 26, lw = 13, lh = H - m.t - m.b - 16;
    for (let i = 0; i < 40; i++) {
      el("rect", { x: lx, y: m.t + 8 + lh - (i + 1) * (lh / 40), width: lw,
        height: lh / 40 + 0.5, fill: rampColor(LO + ((HI - LO) * i) / 39, LO, HI) }, svg);
    }
    [LO, 60, HI].forEach((v) => {
      const yy = m.t + 8 + lh - ((v - LO) / (HI - LO)) * lh;
      txt(svg, lx + lw + 6, yy + 3.5, String(v), { "font-size": 10, fill: COLOR.ink3 });
    });
    txt(svg, lx + lw / 2, m.t - 6, "FinalScore",
      { "text-anchor": "middle", "font-size": 10, fill: COLOR.ink3 });
  }

  /* =====================================================
     3. Head-view contrasts under Large FoV (diverging bars)
     ===================================================== */
  function renderHeadGain() {
    const host = document.getElementById("chart-headgain");
    if (!host) return;
    const W = 760, H = 260;
    const m = { t: 26, r: 30, b: 34, l: 74 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Head-view FinalScore contrasts versus the G1 baseline under Large FoV" });
    host.appendChild(svg);

    const MIN = -22, MAX = 26;
    const x = (v) => m.l + ((v - MIN) / (MAX - MIN)) * iw;

    // gridlines
    for (let v = -20; v <= 25; v += 5) {
      el("line", { x1: x(v), x2: x(v), y1: m.t, y2: m.t + ih,
        stroke: COLOR.grid, "stroke-width": v === 0 ? 0 : 1 }, svg);
      txt(svg, x(v), m.t + ih + 16, (v > 0 ? "+" : "") + v,
        { "text-anchor": "middle", "font-size": 10, fill: COLOR.ink3 });
    }
    txt(svg, m.l + iw / 2, H - 2, "Δ FinalScore vs. G1 (Large-FoV wrist, NoHead)",
      { "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2 });

    const bh = 20, groupH = ih / 3;
    D.headGain.tasks.forEach((task, i) => {
      const cy = m.t + i * groupH + groupH / 2;
      txt(svg, m.l - 12, cy + 4, task,
        { "text-anchor": "end", "font-size": 12, "font-weight": 600, fill: COLOR.ink2 });

      [["raw", "RawHead", -bh - 1.5, D.headGain.rawDetail],
       ["roi", "ROIHead", 1.5, D.headGain.roiDetail]].forEach(([key, head, dy, detail]) => {
        const v = D.headGain[key][i];
        const bx0 = Math.min(x(0), x(v)), bw = Math.abs(x(v) - x(0));
        const by = cy + dy - (dy < 0 ? 0 : 0);
        const yTop = dy < 0 ? cy + dy : cy + dy;
        const bar = el("rect", { x: bx0, y: yTop, width: Math.max(bw, 0),
          height: bh, rx: 4, fill: COLOR[head] }, svg);
        if (Math.abs(v) < 0.05) {
          el("line", { x1: x(0), x2: x(0), y1: yTop, y2: yTop + bh,
            stroke: COLOR[head], "stroke-width": 3.5, "stroke-linecap": "round" }, svg);
        }
        txt(svg, v >= 0 ? x(v) + 6 : x(v) - 6, yTop + bh / 2 + 3.5,
          (v > 0 ? "+" : "") + fmt(v),
          { "text-anchor": v >= 0 ? "start" : "end", "font-size": 11,
            "font-weight": 650, fill: COLOR.ink });
        const contrast = key === "raw" ? "G2 − G1" : "G3 − G1";
        hover(bar, () => ttRows(`${task} · ${contrast} (${head})`, COLOR[head], [
          ["Δ FinalScore", (v > 0 ? "+" : "") + fmt(v)],
          ["Δ Completion", detail[i].comp],
          ["Δ Quality success", detail[i].q],
          ["Δ Steps", detail[i].steps]
        ]));
      });
    });

    // zero line on top
    el("line", { x1: x(0), x2: x(0), y1: m.t - 4, y2: m.t + ih,
      stroke: "#464646", "stroke-width": 1.2 }, svg);
  }

  /* =====================================================
     4. FoV scan — contrast + decomposition
     ===================================================== */
  function renderFovDelta() {
    const host = document.getElementById("chart-fov-delta");
    if (!host) return;
    const W = 380, H = 300;
    const m = { t: 34, r: 12, b: 40, l: 46 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Head-view FinalScore contrast across wrist FoV settings" });
    host.appendChild(svg);

    const MIN = -40, MAX = 60;
    const y = (v) => m.t + ih - ((v - MIN) / (MAX - MIN)) * ih;
    for (let v = -40; v <= 60; v += 20) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v),
        stroke: COLOR.grid, "stroke-width": 1 }, svg);
      txt(svg, m.l - 7, y(v) + 3.5, (v > 0 ? "+" : "") + v,
        { "text-anchor": "end", "font-size": 10, fill: COLOR.ink3 });
    }
    el("line", { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0),
      stroke: "#464646", "stroke-width": 1.1 }, svg);

    const S = D.fovScan, n = S.settings.length;
    const bw = 40, gap = (iw - n * bw) / (n + 1);
    S.settings.forEach((label, i) => {
      const cx = m.l + gap + i * (bw + gap) + bw / 2;
      const v = S.delta[i];
      const pos = v >= 0;
      // descriptive interval: slim rounded range behind the bar, no caps
      el("line", { x1: cx, x2: cx, y1: y(S.ciLo[i]) - 2, y2: y(S.ciHi[i]) + 2,
        stroke: "#c6cbd4", "stroke-width": 4, "stroke-linecap": "round",
        opacity: 0.7 }, svg);
      const bar = el("rect", {
        x: cx - bw / 2, y: pos ? y(v) : y(0),
        width: bw, height: Math.abs(y(v) - y(0)), rx: 4,
        fill: pos ? "#2e8b72" : "#c05b49"
      }, svg);
      txt(svg, cx + bw / 2 + 5, y(v) + (pos ? -3 : 10),
        (v > 0 ? "+" : "") + fmt(v),
        { "text-anchor": "start", "font-size": 10.5, "font-weight": 650, fill: COLOR.ink });
      txt(svg, cx, m.t + ih + 16, label,
        { "text-anchor": "middle", "font-size": 10.5, fill: COLOR.ink2 });

      const no = S.rows.NoHead[i], roi = S.rows.ROIHead[i];
      hover(bar, () => ttRows(`${label} · ROIHead − NoHead`, pos ? "#2e8b72" : "#c05b49", [
        ["Δ FinalScore", (v > 0 ? "+" : "") + fmt(v) + ` [${fmt(S.ciLo[i])}, ${fmt(S.ciHi[i])}]`],
        ["FinalScore", `${fmt(no.fs)} → ${fmt(roi.fs)}`],
        ["Localization", `${no.loc}% → ${roi.loc}%`],
        ["Quality success", `${no.q}% → ${roi.q}%`],
        ["Avg. steps", `${no.steps} → ${roi.steps}`]
      ]));
    });
    txt(svg, m.l + iw / 2, 14, "(a) FinalScore contrast Δhead, Task B",
      { "text-anchor": "middle", "font-size": 12, "font-weight": 650, fill: COLOR.ink });
    txt(svg, m.l + iw / 2, H - 4, "Wrist-camera FoV setting",
      { "text-anchor": "middle", "font-size": 10.5, fill: COLOR.ink2 });
  }

  function renderFovDecomp() {
    const host = document.getElementById("chart-fov-decomp");
    if (!host) return;
    const W = 500, H = 300;
    const m = { t: 34, r: 12, b: 40, l: 44 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Metric decomposition of the head-view contrast" });
    host.appendChild(svg);

    const MIN = -40, MAX = 70;
    const y = (v) => m.t + ih - ((v - MIN) / (MAX - MIN)) * ih;
    for (let v = -40; v <= 70; v += 20) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v),
        stroke: COLOR.grid, "stroke-width": 1 }, svg);
      txt(svg, m.l - 7, y(v) + 3.5, (v > 0 ? "+" : "") + v,
        { "text-anchor": "end", "font-size": 10, fill: COLOR.ink3 });
    }
    el("line", { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0),
      stroke: "#464646", "stroke-width": 1.1 }, svg);

    const S = D.fovScan, n = S.settings.length;
    const series = [
      ["loc", "Localization rate", COLOR.loc],
      ["comp", "Completion rate", COLOR.comp],
      ["qual", "Quality success rate", COLOR.qual]
    ];
    const groupW = iw / n, bw = 22, inner = 4;
    S.settings.forEach((label, i) => {
      const gx = m.l + i * groupW + groupW / 2;
      series.forEach(([key, name, color], s) => {
        const v = S.decomp[key][i];
        const bx = gx + (s - 1) * (bw + inner) - bw / 2;
        const pos = v >= 0;
        const bar = el("rect", {
          x: bx, y: pos ? y(v) : y(0), width: bw,
          height: Math.max(Math.abs(y(v) - y(0)), 1.2), rx: 3.5, fill: color
        }, svg);
        if (v === 0) {
          el("line", { x1: bx, x2: bx + bw, y1: y(0), y2: y(0),
            stroke: color, "stroke-width": 3.5, "stroke-linecap": "round" }, svg);
        }
        txt(svg, bx + bw / 2, pos ? y(v) - 4 : y(v) + 11, (v > 0 ? "+" : "") + v,
          { "text-anchor": "middle", "font-size": 9.5, "font-weight": 600, fill: COLOR.ink2 });
        hover(bar, () => ttRows(`${label} · ${name}`, color, [
          ["Δ vs. NoHead", (v > 0 ? "+" : "") + v + " pp"]
        ]));
      });
      txt(svg, gx, m.t + ih + 16, label,
        { "text-anchor": "middle", "font-size": 10.5, fill: COLOR.ink2 });
    });
    txt(svg, m.l + iw / 2, 14, "(b) Metric decomposition (ROIHead − NoHead, pp)",
      { "text-anchor": "middle", "font-size": 12, "font-weight": 650, fill: COLOR.ink });
    txt(svg, m.l + iw / 2, H - 4, "Wrist-camera FoV setting",
      { "text-anchor": "middle", "font-size": 10.5, fill: COLOR.ink2 });
  }

  /* =====================================================
     5. Data-scaling curves (Task A)
     ===================================================== */
  function renderScaling() {
    const host = document.getElementById("chart-scaling");
    if (!host) return;
    const W = 760, H = 360;
    const m = { t: 24, r: 26, b: 46, l: 50 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Task A data-scaling curves for three visual configurations" });
    host.appendChild(svg);

    const xLo = Math.log2(42), xHi = Math.log2(1000);
    const x = (v) => m.l + ((Math.log2(v) - xLo) / (xHi - xLo)) * iw;
    const y = (v) => m.t + ih - (v / 100) * ih;

    for (let v = 0; v <= 100; v += 20) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v),
        stroke: COLOR.grid, "stroke-width": 1 }, svg);
      txt(svg, m.l - 7, y(v) + 3.5, String(v),
        { "text-anchor": "end", "font-size": 10, fill: COLOR.ink3 });
    }
    [50, 200, 800].forEach((v) => {
      txt(svg, x(v), m.t + ih + 18, String(v),
        { "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2 });
    });
    txt(svg, m.l + iw / 2, H - 6, "Number of demonstrations (log scale)",
      { "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2 });
    txt(svg, 14, m.t + ih / 2, "FinalScore", {
      "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2,
      transform: `rotate(-90 14 ${m.t + ih / 2})`
    });

    // threshold line at 60
    el("line", { x1: m.l, x2: W - m.r, y1: y(60), y2: y(60),
      stroke: "#c95d43", "stroke-width": 1, "stroke-dasharray": "2 5", opacity: 0.8 }, svg);
    txt(svg, m.l + 6, y(60) - 5, "FinalScore 60 threshold",
      { "text-anchor": "start", "font-size": 9.5, fill: "#c95d43" });

    // per-point label offsets [dx, dy], staggered to avoid collisions
    const LABEL_OFF = [
      [[11, -3], [0, -10], [11, -2]],   // 2W-Large
      [[11, 8], [-10, -7], [11, -8]],   // 2W-D435Crop
      [[11, 19], [0, 15], [11, 11]]     // 3V-D435Crop-ROIHead
    ];

    D.scaling.forEach((s, si) => {
      const color = SCALING_COLOR[si];
      // descriptive intervals: slim rounded ranges at the measured points only,
      // dodged per series so overlapping ranges stay readable
      const dodge = (si - 1) * 7;
      s.x.forEach((xv, i) => {
        el("line", {
          x1: x(xv) + dodge, x2: x(xv) + dodge,
          y1: y(s.lo[i]) - 2, y2: y(s.hi[i]) + 2,
          stroke: color, "stroke-width": 4, "stroke-linecap": "round",
          opacity: 0.28
        }, svg);
      });
      // line
      el("path", {
        d: "M" + s.x.map((xv, i) => `${x(xv)},${y(s.mean[i])}`).join(" L"),
        fill: "none", stroke: color, "stroke-width": 2.4, "stroke-linejoin": "round"
      }, svg);
      // points + labels + hover
      s.x.forEach((xv, i) => {
        el("circle", { cx: x(xv), cy: y(s.mean[i]), r: 4.5, fill: color,
          stroke: "#fff", "stroke-width": 1.6 }, svg);
        const [dx, dy] = LABEL_OFF[si][i];
        txt(svg, x(xv) + dx, y(s.mean[i]) + dy + (dy > 0 ? 4 : 0), fmt(s.mean[i]), {
          "text-anchor": dx > 0 ? "start" : dx < 0 ? "end" : "middle",
          "font-size": 10, "font-weight": 600, fill: COLOR.ink2
        });
        const hit = el("circle", { cx: x(xv), cy: y(s.mean[i]), r: 13, fill: "transparent" }, svg);
        hover(hit, () => ttRows(`${s.name} · ${xv} demos`, color, [
          ["Mean FinalScore", fmt(s.mean[i])],
          ["Interval", `[${fmt(s.lo[i])}, ${fmt(s.hi[i])}]`]
        ]));
      });
    });

    // annotate the non-monotonic point
    el("circle", { cx: x(200), cy: y(57.1), r: 9, fill: "none",
      stroke: "#a77768", "stroke-width": 1.4, "stroke-dasharray": "2.5 2.5",
      opacity: 0.9 }, svg);
    txt(svg, x(200) + 10, y(57.1) - 26, "non-monotonic point",
      { "font-size": 9.5, fill: "#a77768" });
    el("line", { x1: x(200) + 8, x2: x(200) + 2, y1: y(57.1) - 22, y2: y(57.1) - 8,
      stroke: "#a77768", "stroke-width": 1 }, svg);
  }

  /* =====================================================
     6. Completion vs. quality scatter
     ===================================================== */
  function renderScatter() {
    const host = document.getElementById("chart-scatter");
    if (!host) return;
    const W = 640, H = 420;
    const m = { t: 18, r: 20, b: 46, l: 52 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": "Completion rate versus quality success rate for all configurations" });
    host.appendChild(svg);

    const x = (v) => m.l + (v / 100) * iw;
    const y = (v) => m.t + ih - (v / 90) * ih;

    for (let v = 0; v <= 100; v += 20) {
      el("line", { x1: x(v), x2: x(v), y1: m.t, y2: m.t + ih, stroke: COLOR.grid, "stroke-width": 1 }, svg);
      txt(svg, x(v), m.t + ih + 16, String(v), { "text-anchor": "middle", "font-size": 10, fill: COLOR.ink3 });
    }
    for (let v = 0; v <= 80; v += 20) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), stroke: COLOR.grid, "stroke-width": 1 }, svg);
      txt(svg, m.l - 7, y(v) + 3.5, String(v), { "text-anchor": "end", "font-size": 10, fill: COLOR.ink3 });
    }
    txt(svg, m.l + iw / 2, H - 6, "Completion rate (%)",
      { "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2 });
    txt(svg, 14, m.t + ih / 2, "Quality success rate (%)", {
      "text-anchor": "middle", "font-size": 11, fill: COLOR.ink2,
      transform: `rotate(-90 14 ${m.t + ih / 2})`
    });

    // identity line: completion == quality
    el("line", { x1: x(0), y1: y(0), x2: x(85), y2: y(85),
      stroke: "#9a9a9a", "stroke-width": 1.2, "stroke-dasharray": "4 4" }, svg);
    txt(svg, x(58), y(63), "completion = quality success", {
      "font-size": 9.5, fill: "#9a9a9a",
      transform: `rotate(-38 ${x(58)} ${y(63)})`
    });

    // RawHead low-quality region annotation
    txt(svg, x(66), y(6) - 14, "low-quality RawHead pattern:",
      { "font-size": 10, fill: "#a05c3f", "font-weight": 600 });
    txt(svg, x(66), y(6), "high completion, low quality success",
      { "font-size": 10, fill: "#a05c3f" });

    // collect duplicate positions to offset them slightly
    const seen = {};
    D.tasks.forEach((task) => {
      D.configs.forEach((cfg, i) => {
        const head = D.headTypes[i];
        let px = D.main[task].completion[i], py = D.main[task].quality[i];
        const key = px + "," + py;
        const dup = seen[key] || 0;
        seen[key] = dup + 1;
        const dx = dup * 7, dy = dup * -1;
        const cx = x(px) + dx, cy = y(py);
        const node = el("circle", {
          cx, cy, r: 7, fill: COLOR[head],
          stroke: head === "RawHead" ? "#8f3d14" : "#ffffff",
          "stroke-width": head === "RawHead" ? 1.8 : 1.6,
          opacity: 0.92
        }, svg);
        hover(node, () => ttRows(`${task} · ${cfg} (${head})`, COLOR[head], [
          ["Wrist FoV", D.fovs[i]],
          ["Completion", px + "%"],
          ["Quality success", py + "%"],
          ["FinalScore", fmt(D.main[task].final[i])]
        ]));
      });
    });
  }

  /* ---------- init ---------- */
  renderMainResults();
  renderHeatmap();
  renderHeadGain();
  renderFovDelta();
  renderFovDecomp();
  renderScaling();
  renderScatter();

  /* bibtex copy */
  const copyBtn = document.getElementById("copy-bibtex");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const t = document.getElementById("bibtex-code").textContent;
      navigator.clipboard.writeText(t).then(() => {
        copyBtn.textContent = "Copied ✓";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1600);
      });
    });
  }
})();
