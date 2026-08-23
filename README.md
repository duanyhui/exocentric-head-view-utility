# Is a Head View Still Necessary with Large-FoV Wrist Cameras?

Project page for the technical report **"Assessing the Marginal Utility of Exocentric
Head Views in UMI-Style Large-FoV Wrist-Camera Manipulation: A Controlled Study for
Tabletop Bimanual Manipulation."**

**[Project page](https://duanyhui.github.io/exocentric-head-view-utility/)** ·
**[Paper (PDF)](https://duanyhui.github.io/exocentric-head-view-utility/static/paper.pdf)** ·
arXiv: *coming soon*

Yuhui Duan · Wenchang Gao · Shi Jin · Yuntian Wang · Jin Wang · Siao Liu · Yan Ding · Zhaxizhuoma

Multi-view perception is often treated as a safe design choice in robot manipulation: if
one camera helps, more cameras should help more. We test that assumption directly. On a
real bimanual platform with a fixed OpenPI π<sub>0.5</sub> backbone, we compare policies
trained with two large-FoV wrist cameras against policies that additionally receive a head
view, holding everything else constant.

## What this study asks

Four research questions, each answered with a controlled contrast rather than an ablation
sweep. Scores are FinalScore, a quality-adjusted metric that separates high-quality success
from coarse completion.

**RQ1 — Wrist-only is already a strong baseline.** Under large-FoV wrists, head-view
contrasts are inconsistent: a raw head view lowers mean FinalScore on Task A (−16.0) and
Task B (−1.1); an ROI-cropped head view helps on Task B (+21.0) and Task C (+12.2) but not
on Task A (−6.0).

**RQ2 — Restricting wrist FoV creates opportunity, not a guarantee.** ROIHead improves
localization under *every* FoV setting, yet the head-view delta flips negative at the medium
settings (−5.3, −7.9) because longer trajectories violate the quality gate — while the
D435-like setting converts the same opportunity into a +29.2 gain. The contrast is
**non-monotonic** in wrist FoV.

**RQ3 — The form of the head view matters more than its presence.** ROI-cropped head views
beat raw head views on 5 of 6 task–FoV combinations. RawHead shows a characteristic
signature: tasks get completed, but with low quality-success and longer trajectories.

**RQ4 — FoV conclusions are data-scale-dependent.** Only the large-FoV wrist-only
configuration crosses FinalScore 60, and only at 800 demonstrations. Wide observations may
need more data to stabilize, but suggest a higher ceiling.

## What's in this repository

This repository holds **the project page only** — a hand-built static site with no framework
and no build step, plus the report PDF. The training and evaluation code is not released
here; the `Code` button on the page is intentionally disabled until it is.

```
.
├── index.html            # the single-page project site
├── .nojekyll             # disable GitHub Pages' Jekyll processing
└── static/
    ├── css/style.css     # all styling (light and dark)
    ├── js/data.js        # chart data, transcribed from the report's tables
    ├── js/charts.js      # hand-written interactive SVG charts (tooltips, metric switching)
    ├── js/rollouts.js    # rollout gallery: clip metadata + rendering + filtering
    ├── img/              # photos, schematics, heatmaps (converted from the report's figures)
    ├── video/            # three task example clips + poster frames
    │   └── eval/         # 21 three-view evaluation clips + poster frames
    └── paper.pdf         # the report
```

## Evaluation rollouts

The gallery holds **21 evaluation clips**. Each source recording is the policy's actual
input stream: `robot_0`, `robot_1`, and `head` concatenated horizontally into a single 3:1
frame. Clips are uniformly sped up 3–4×, stripped of audio, and encoded at 1080 px wide,
with a poster frame sampled at 15% of the duration.

All clip metadata — configuration, outcome classification, and description — lives in the
`window.ROLLOUTS` array in `static/js/rollouts.js`. Adding or removing a clip means editing
that one array.

<details>
<summary>Video encoding commands</summary>

Task example clips (uniform 3×, no audio, 720p30):

```bash
ffmpeg -i video/Task-A.mp4 -vf "setpts=PTS/3,fps=30,scale=1280:-2" -an \
  -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart \
  static/video/task_a_3x.mp4
```

Evaluation clips are batch-processed with a target duration of about 35 s, which selects a
speed-up factor per clip within a 3×–4× range, then encodes at 1080 px wide with `-crf 28`
and no audio. Uncompressed sources live in `video/` and are git-ignored; only the compressed
outputs are committed.

</details>

## Chart data

Every number rendered on the page comes from `window.REPORT_DATA` in `static/js/data.js`,
which mirrors the report's result tables and the plotting scripts that produce the paper's
figures (`regenerate_public_figures.py`, `plot_fov_delta_decomposition.py`). Editing the
data file and refreshing the page is enough — there is nothing to rebuild.

## Local preview

```bash
python3 -m http.server 8124
```

Then open <http://localhost:8124>. Opening `index.html` over `file://` mostly works, but
HTTP is recommended.

## Deployment

GitHub Pages builds from the root of the `main` branch, so pushing is deploying.

## Citation

```bibtex
@techreport{duan2026headview,
  title  = {Assessing the Marginal Utility of Exocentric Head Views in
            UMI-Style Large-FoV Wrist-Camera Manipulation:
            A Controlled Study for Tabletop Bimanual Manipulation},
  author = {Yuhui Duan and Wenchang Gao and Shi Jin and Yuntian Wang and
            Jin Wang and Siao Liu and Yan Ding and {Zhaxizhuoma}},
  year   = {2026},
  month  = {June},
  note   = {Public technical report}
}
```

## License

Copyright (c) 2026 Yuhui Duan, Wenchang Gao, Shi Jin, Yuntian Wang, Jin Wang, Siao Liu,
Yan Ding, Zhaxizhuoma.

Licensed under [Creative Commons Attribution 4.0 International](LICENSE) (CC BY 4.0). You
may share and adapt the page, figures, videos, and report, including commercially, as long
as you give appropriate credit.
