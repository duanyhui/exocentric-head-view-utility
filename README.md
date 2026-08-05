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
    └── paper.pdf         # 报告 PDF（out/main.pdf 副本）
```

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
