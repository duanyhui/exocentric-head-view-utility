# 报告项目主页（GitHub Pages）

纯静态站点，无构建步骤。目录结构：

```
网页界面/
├── index.html            # 单页项目主页（英文）
├── .nojekyll             # 关闭 GitHub Pages 的 Jekyll 处理
└── static/
    ├── css/style.css     # 全部样式（浅色主题）
    ├── js/data.js        # 图表数据（转录自报告表格与绘图脚本）
    ├── js/charts.js      # 手写 SVG 交互图表（tooltip / 指标切换）
    ├── img/              # 照片、示意图、热力图（由 figs/ 与 figure_y/ 转换）
    ├── js/rollouts.js    # 评测片段画廊：元数据 + 渲染 + 筛选
    ├── video/            # 三个任务的示例 rollout 视频（压缩版）+ 海报帧
    │   └── eval/         # 21 个三视角评测片段 + 海报帧（约 19MB）
    └── paper.pdf         # 报告 PDF（out/main.pdf 副本）
```

原始视频放在 `video/`（已 gitignore，不入库），只提交压缩产物。

**任务示例视频**（A/B 二倍速、C 三倍速，去声、720p30）：

```bash
ffmpeg -i video/Task-A.mp4 -vf "setpts=PTS/2,fps=30,scale=1280:-2" -an \
  -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart \
  static/video/task_a_2x.mp4
```

**三视角评测片段**（`video/三视角评测视频/` → `static/video/eval/`）：源片是
robot_0 / robot_1 / head 三路横向拼接（3:1），即策略的真实输入流。批量压缩脚本
按"目标时长约 35s"自动选 2×–4× 倍速，输出 1080 宽、crf 28、去声，并抽 15% 处
的帧作海报。片段的配置、结局分类和说明文字都在 `static/js/rollouts.js` 的
`window.ROLLOUTS` 数组里，增删片段只改这一个数组。

卡片上**不显示 trial 编号**：源录像的 trial 命名出现过错标（`g5/trial1_左臂不动`
实为 trial6），所以每张卡以"画面里发生了什么"描述，不绑定 episode ID。输出文件名
里仍保留 trial 号供追溯。每个片段的结局都逐帧核对过，不是照抄文件名——例如
`taskC/g2/trial5_不完美完成` 的实际问题是紫盘平放在铁丝上（3 送达 / 2 正立），
与重试无关。

注意：批量处理时 ffmpeg 会吞掉 shell `while read` 循环的 stdin 导致静默丢文件，
要么加 `-nostdin`，要么用脚本语言驱动（本项目用的是 Python + subprocess）。

## 本地预览

```bash
cd 网页界面 && python3 -m http.server 8124
```

然后访问 <http://localhost:8124>。（用 `file://` 直接打开也可以，但建议走 HTTP。）

## 部署（已上线）

本文件夹是一个独立 git 仓库（与论文仓库分开做版本管理，论文仓库已将其 gitignore）：

- 远程仓库：<https://github.com/duanyhui/exocentric-head-view-utility>
- 线上地址：<https://duanyhui.github.io/exocentric-head-view-utility/>（Pages 从 `main` 分支根目录构建）

更新流程：改完文件后在本目录 `git add -A && git commit && git push` 即可，Pages 会自动重新部署。
论文重编译后记得同步 `static/paper.pdf`（复制 `../out/main.pdf`）。

## 更新数据图

图表数据都在 `static/js/data.js`，与 `scripts/regenerate_public_figures.py`、
`scripts/plot_fov_delta_decomposition.py` 及 main.tex 中的表格一一对应；改数据后刷新页面即可。

作者/单位/链接目前是匿名占位，正式发布时改 `index.html` 里 hero 区块与 BibTeX 即可
（`Code (soon)` 按钮换成真实仓库链接，删掉 `aria-disabled`）。
