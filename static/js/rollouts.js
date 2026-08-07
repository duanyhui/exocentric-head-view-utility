/* Evaluation rollout gallery — metadata + render + filter.
   Clip files live in static/video/eval/. Speed suffix is part of the filename.
   Trial numbers are deliberately not shown: the per-episode identifiers in the
   source recordings are not reliable, so each card is described by what the
   footage shows rather than by an episode ID. */

window.ROLLOUTS = [
  /* ---------- Task A: four-object organization ---------- */
  {
    group: "taskA", cfg: "G5", fov: "D435-like", head: "RawHead",
    base: "taskA_g5_trial4_completion", speed: 3,
    outcome: "4 of 4 placed", tone: "ok", lead: "Sequential two-arm completion.",
    desc: "The right arm shelves a cup and a jar, then the left arm follows with the remaining pair. Table clear and everything stable at the end."
  },
  {
    group: "taskA", cfg: "G5", fov: "D435-like", head: "RawHead",
    base: "taskA_g5_trial5_left-arm-frozen", speed: 4,
    outcome: "2 of 4 placed", tone: "bad", lead: "The left arm never grasps.",
    desc: "It drifts and repositions beside the jar but never closes its gripper. Only the right arm's two objects reach the shelf, after which the tabletop stays unchanged for the rest of the episode."
  },
  {
    group: "taskA", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskA_g6_trial1_completion", speed: 3,
    outcome: "4 of 4 placed", tone: "ok", lead: "Clean completion.",
    desc: "Two cups upright on the upper tier, two jars on the lower tier, nothing left on the table."
  },
  {
    group: "taskA", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskA_g6_trial4_grasp-fail", speed: 3,
    outcome: "0 of 4 placed", tone: "bad", lead: "The first grasp never closes.",
    desc: "The right gripper descends onto the same cup again and again without ever closing on it, and the left arm never starts. The shelf is still empty at the end."
  },
  {
    group: "taskA", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskA_g6_trial6_drop-after-place", speed: 3,
    outcome: "3 of 4 stable", tone: "warn", lead: "Placed, then toppled.",
    desc: "All four objects are delivered, but the first cup falls the instant the gripper opens and is never recovered. Placed is not the same as stable — which is why the outcome score counts them separately."
  },

  /* ---------- Task B: basket nesting ---------- */
  {
    group: "taskB", cfg: "G3", fov: "Large", head: "ROIHead",
    base: "taskB_g3_trial3_success", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "The fastest run in this gallery.",
    desc: "Four baskets into one stack by 55 s with no retries. This is the configuration with the largest head-view gain on Task B."
  },
  {
    group: "taskB", cfg: "G3", fov: "Large", head: "ROIHead",
    base: "taskB_g3_trial1_success", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "A second clean run.",
    desc: "The stack builds up without a single re-grasp and closes at 57 s."
  },
  {
    group: "taskB", cfg: "G2", fov: "Large", head: "RawHead",
    base: "taskB_g2_trial1_completion", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "The raw head view also gets there.",
    desc: "All four baskets nested, finishing at 60 s. Note how much of the room the uncropped wrist fisheye takes in along the way."
  },
  {
    group: "taskB", cfg: "G2", fov: "Large", head: "RawHead",
    base: "taskB_g2_trial9_timeout", speed: 3,
    outcome: "3 of 4 nested", tone: "bad", lead: "Released beside the stack.",
    desc: "The fourth basket is set down next to the stack rather than into it. Both arms then hover over it with an open, empty gripper until the budget expires — the basket stays in view the whole time and is simply never picked up again."
  },
  {
    group: "taskB", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskB_g6_trial2_success", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "Narrow wrist view, still succeeds.",
    desc: "The nesting completes, but the last insertion only lands at 62 s — slower than either large-FoV run above."
  },
  {
    group: "taskB", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskB_g6_trial4_timeout", speed: 3,
    outcome: "3 of 4 nested", tone: "bad", lead: "Held against the rim.",
    desc: "The last basket is grasped and then held tilted against the stack for roughly 40 s, oscillating without ever aligning or releasing. The left arm stays parked throughout."
  },
  {
    group: "taskB", cfg: "G6", fov: "D435-like", head: "ROIHead",
    base: "taskB_g6_trial6_timeout-severe", speed: 3,
    outcome: "3 of 4 nested", tone: "bad", lead: "The same stall, twice over.",
    desc: "From about 56 s the right wrist camera is filled edge to edge by the basket it is carrying — the target it is reaching for is no longer inside its own field of view."
  },

  /* ---------- Task C: plate placement ---------- */
  {
    group: "taskC", cfg: "G2", fov: "Large", head: "RawHead",
    base: "taskC_g2_trial9_completion", speed: 3,
    outcome: "3 of 3 upright", tone: "ok", lead: "The cleanest Task C run here.",
    desc: "Green, purple and pink each land upright in their own evenly spaced slot, first try. Read it against the run beside it."
  },
  {
    group: "taskC", cfg: "G2", fov: "Large", head: "RawHead",
    base: "taskC_g2_trial5_imperfect", speed: 3,
    outcome: "2 of 3 upright", tone: "warn", lead: "One plate laid flat.",
    desc: "At a glance the rack looks full — but watch the purple plate. It is released flat across the rack wires instead of standing in a slot, and is never corrected. Same three plates delivered, one unacceptable final pose."
  },
  {
    group: "taskC", cfg: "G2", fov: "Large", head: "RawHead",
    base: "taskC_g2_trial2_completion", speed: 3,
    outcome: "3 of 3 upright", tone: "ok", lead: "Three plates seated in sequence.",
    desc: "Purple, then green, then pink. The last two share neighbouring slots and lean slightly together, but all three stand."
  },
  {
    group: "taskC", cfg: "G3", fov: "Large", head: "ROIHead",
    base: "taskC_g3_trial9_completion", speed: 3,
    outcome: "3 of 3 upright", tone: "ok", lead: "A direct approach each time.",
    desc: "ROI cropping keeps the rack slots in frame, and each of the three approaches commits to a slot without visible retries."
  },
  {
    group: "taskC", cfg: "G3", fov: "Large", head: "ROIHead",
    base: "taskC_g3_trial10_retry-timeout", speed: 3,
    outcome: "1 of 3 upright", tone: "bad", lead: "Six attempts, one plate.",
    desc: "Only the pink plate is placed. The arm then spends more than half the episode closing on the green plate, nudging it, backing off and re-approaching, never lifting it. The purple plate is never touched."
  },

  /* ---------- Wrist-FoV scan (Task B) ---------- */
  {
    group: "fov", cfg: "FoV120", fov: "120°", head: "ROIHead",
    base: "fov_taskB_fov120_completion", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "Completes, but slower.",
    desc: "Only the wrist streams are cropped; the head stream is unchanged. The room context the fisheye supplied is gone — two or three baskets fit in frame at once — and the last insertion needs 68 s."
  },
  {
    group: "fov", cfg: "FoV120", fov: "120°", head: "ROIHead",
    base: "fov_taskB_fov120_timeout", speed: 3,
    outcome: "3 of 4 nested", tone: "bad", lead: "Carried, then never inserted.",
    desc: "The last basket is brought to the stack and held beside it for about 30 s without the insertion ever being attempted to completion."
  },
  {
    group: "fov", cfg: "FoV90", fov: "90°", head: "ROIHead",
    base: "fov_taskB_fov90_completion", speed: 3,
    outcome: "4 of 4 nested", tone: "ok", lead: "The slowest success here.",
    desc: "The narrowest wrist view in the scan: a patch of table and the grippers, one or two baskets at a time. The four surrounding baskets can no longer be seen together, and the final insertion only lands at 72 s."
  },
  {
    group: "fov", cfg: "FoV90", fov: "90°", head: "ROIHead",
    base: "fov_taskB_fov90_timeout", speed: 3,
    outcome: "3 of 4 nested", tone: "bad", lead: "Aligning against an unseen target.",
    desc: "The recurring narrow-FoV failure: once the carried basket fills the wrist frame, the arm is aligning against something it can no longer see, and the insertion never converges."
  }
];

(function renderRollouts() {
  const grid = document.getElementById("eval-grid");
  if (!grid || !window.ROLLOUTS) return;

  const HEAD_COLOR = {
    NoHead: "var(--c-nohead)",
    RawHead: "var(--c-rawhead)",
    ROIHead: "var(--c-roihead)"
  };
  const GROUP_LABEL = { taskA: "Task A", taskB: "Task B", taskC: "Task C", fov: "FoV scan" };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  grid.innerHTML = window.ROLLOUTS.map((r) => {
    const src = `static/video/eval/${r.base}_${r.speed}x.mp4`;
    const poster = `static/video/eval/${r.base}.jpg`;
    const headBadge = r.head
      ? `<span class="badge"><span class="dot" style="background:${HEAD_COLOR[r.head]}"></span>${esc(r.head)}</span>`
      : "";
    const label = `${GROUP_LABEL[r.group]}, ${r.cfg}, ${r.outcome}`;
    return `
    <figure class="eval-card" data-group="${r.group}">
      <div class="vwrap">
        <video src="${src}" poster="${poster}" muted loop playsinline preload="none"
               aria-label="${esc(label)} — muted, ${r.speed}x speed"></video>
        <span class="speed-badge">${r.speed}&times;</span>
        <button class="expand-btn" type="button" aria-label="View ${esc(label)} full screen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
        </button>
      </div>
      <figcaption class="meta">
        <div class="badges">
          <span class="badge">${esc(r.cfg)}</span>
          <span class="badge">${esc(r.fov)} wrist</span>
          ${headBadge}
          <span class="badge ${r.tone}">${esc(r.outcome)}</span>
        </div>
        <p class="desc"><b>${esc(r.lead)}</b> ${r.desc}</p>
      </figcaption>
    </figure>`;
  }).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".expand-btn");
    if (!btn) return;
    e.stopPropagation();
    const v = btn.parentElement.querySelector("video");
    const req = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen;
    if (req) { try { req.call(v); } catch (_) {} }
    delete v.dataset.userPaused;
    v.play().catch(() => {});
  });

  const cards = [...grid.querySelectorAll(".eval-card")];
  const countEl = document.getElementById("eval-count");
  const setCount = (n) => { if (countEl) countEl.textContent = `${n} episode${n === 1 ? "" : "s"}`; };
  setCount(cards.length);

  const filters = document.getElementById("eval-filters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const g = btn.dataset.group;
      filters.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
      let shown = 0;
      cards.forEach((c) => {
        const hit = g === "all" || c.dataset.group === g;
        c.classList.toggle("hidden", !hit);
        if (hit) shown++;
        if (!hit) { const v = c.querySelector("video"); if (v) v.pause(); }
      });
      setCount(shown);
    });
  }
})();
