/* All numbers are transcribed from the technical report
   (Table: main G1–G6 results, FoV scan, scaling experiment). */
window.REPORT_DATA = {
  configs: ["G1", "G2", "G3", "G4", "G5", "G6"],
  headTypes: ["NoHead", "RawHead", "ROIHead", "NoHead", "RawHead", "ROIHead"],
  fovs: ["Large", "Large", "Large", "D435-like", "D435-like", "D435-like"],
  tasks: ["Task A", "Task B", "Task C"],
  taskNames: {
    "Task A": "Four-Object Organization",
    "Task B": "Basket Nesting",
    "Task C": "Plate Placement"
  },

  main: {
    "Task A": {
      final:      [65.2, 49.2, 59.2, 47.3, 45.1, 44.1],
      completion: [50, 90, 80, 60, 70, 30],
      quality:    [40, 0, 20, 10, 0, 0],
      steps:      [975.0, 1045.0, 1050.0, 1200.0, 1500.0, 1165.0],
      outcome:    [45.2, 49.2, 49.2, 42.3, 45.1, 44.1],
      bonus:      [20.0, 0.0, 10.0, 5.0, 0.0, 0.0]
    },
    "Task B": {
      final:      [68.2, 67.2, 89.2, 42.2, 57.5, 71.4],
      completion: [60, 50, 80, 20, 30, 50],
      quality:    [50, 40, 80, 10, 30, 50],
      steps:      [837.5, 905.0, 790.0, 945.0, 947.5, 907.5],
      outcome:    [43.2, 47.2, 49.2, 37.2, 42.5, 46.4],
      bonus:      [25.0, 20.0, 40.0, 5.0, 15.0, 25.0]
    },
    "Task C": {
      final:      [77.8, 77.8, 90.0, 28.0, 36.9, 58.3],
      completion: [80, 80, 100, 0, 0, 90],
      quality:    [60, 60, 80, 0, 0, 20],
      steps:      [1100.0, 1095.0, 1040.0, 1365.0, 1260.0, 1240.0],
      outcome:    [47.8, 47.8, 50.0, 28.0, 36.9, 48.3],
      bonus:      [30.0, 30.0, 40.0, 0.0, 0.0, 10.0]
    }
  },

  metrics: {
    final:      { label: "FinalScore", unit: "", max: 100, note: "Quality-adjusted score (higher is better)" },
    completion: { label: "Completion Rate", unit: "%", max: 100, note: "Coarse task completion (higher is better)" },
    quality:    { label: "Quality Success Rate", unit: "%", max: 100, note: "Strict high-quality completions (higher is better)" },
    steps:      { label: "Avg. Steps", unit: "", max: 1600, note: "Low-level control steps (lower is better)" }
  },

  // Head-view contrasts vs. G1 under the Large-FoV wrist setting
  headGain: {
    tasks: ["Task A", "Task B", "Task C"],
    raw: [-16.0, -1.1, 0.0],
    roi: [-6.0, 21.0, 12.2],
    rawDetail: [
      { comp: "+40 pp", q: "-40 pp", steps: "+70.0" },
      { comp: "-10 pp", q: "-10 pp", steps: "+67.5" },
      { comp: "0 pp", q: "0 pp", steps: "-5.0" }
    ],
    roiDetail: [
      { comp: "+30 pp", q: "-20 pp", steps: "+75.0" },
      { comp: "+20 pp", q: "+30 pp", steps: "-47.5" },
      { comp: "+20 pp", q: "+20 pp", steps: "-60.0" }
    ]
  },

  // Task B wrist-FoV scan (paired NoHead vs. ROIHead)
  fovScan: {
    settings: ["Large", "FoV120", "FoV90", "D435-like"],
    delta: [21.0, -5.3, -7.9, 29.2],
    ciLo: [5.4, -31.1, -27.9, 2.3],
    ciHi: [38.8, 20.5, 10.2, 55.4],
    decomp: {
      loc:  [40, 40, 50, 60],
      comp: [20, 0, 30, 30],
      qual: [30, -20, -30, 40]
    },
    rows: {
      NoHead:  [
        { fs: 68.2, comp: 60, loc: 60, q: 50, steps: 837.5 },
        { fs: 60.6, comp: 40, loc: 50, q: 40, steps: 885.0 },
        { fs: 55.6, comp: 40, loc: 50, q: 30, steps: 935.0 },
        { fs: 42.2, comp: 20, loc: 40, q: 10, steps: 945.0 }
      ],
      ROIHead: [
        { fs: 89.2, comp: 80, loc: 100, q: 80, steps: 790.0 },
        { fs: 55.3, comp: 40, loc: 90, q: 20, steps: 947.5 },
        { fs: 47.8, comp: 70, loc: 100, q: 0, steps: 970.0 },
        { fs: 71.4, comp: 50, loc: 100, q: 50, steps: 907.5 }
      ]
    }
  },

  // Task A data scaling (50 / 200 / 800 demos), descriptive bootstrap intervals
  scaling: [
    { name: "2W-Large", x: [50, 200, 800],
      mean: [13.4, 16.1, 65.3], lo: [3.8, 10.1, 47.0], hi: [25.0, 21.3, 83.9] },
    { name: "2W-D435Crop", x: [50, 200, 800],
      mean: [12.1, 57.1, 47.3], lo: [4.6, 44.6, 35.8], hi: [19.6, 72.1, 62.1] },
    { name: "3V-D435Crop-ROIHead", x: [50, 200, 800],
      mean: [8.8, 42.3, 44.1], lo: [1.3, 33.5, 39.1], hi: [17.5, 48.9, 47.8] }
  ]
};
