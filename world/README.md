# 设定集

`world/index.html` 是独立的静态设定集。主页只通过 `script/config.js` 跳转到这里，原有故事正文仍来自 `mds/` 和 `htmls/`。

## 编辑和生成

- 世界基础正文：`mds/world/*.md`。
- 地域、地图坐标、纪事、人物简介和故事索引：`world/catalog.json`。
- 布局和交互：`world/index.html`、`world/world.css`、`world/world.js`。
- `world/data.json` 是生成文件，不直接编辑。

安装 Python 3.9+ 与 pandoc 后，在仓库根目录执行：

```sh
python tools/build-world.py
python -m http.server 8080
```

打开 `http://localhost:8080/world/`。提交源文件和生成后的 `world/data.json`；GitHub Pages 不需要额外的构建步骤。构建器校验引用、唯一 ID、故事目标和地标是否落在地图范围内。

## 外部链接和嵌入

公开入口是 `https://yifeeeeei.github.io/EraOfArcane/world/`。游戏或其他网页可直接链接：

```text
#lore/origins                 世界之初
#lore/elements                元素与奥术
#atlas                       世界总图
#atlas/celtic/capital         凯尔特皇城
#chronicle/voyages            近世纪事
#people/andrew                安德鲁
#stories                      故事目录
```

每个地址都可独立打开和刷新，浏览器前进/后退可返回上一步。`?embed=1` 会隐藏页眉和页脚，保留页内导航，方便 iframe 使用，例如 `world/?embed=1#lore/elements`。

其他客户端也可读取同目录的 `data.json`。`schema_version` 为结构版本，章节内包含 `id`、`title` 和从 Markdown 生成的 `html`；其他分组为 `regions`、`eras`、`events`、`people`、`stories`。代码不依赖相邻仓库或本机路径，所有运行时资源均位于本站内，外链故事仍在本仓库的 `htmls/` 下。跨域读取由 GitHub Pages 的响应头控制；可直接跳转或嵌入，无需跨域请求。

## 地图

世界总图只标大陆与群岛；选择后进入各地域的详图，展示城市、势力与自然地标。地图图像为 1536×1024，`label`、`bounds` 和 `features[].x/y` 全部使用该原始坐标系。详图通过 SVG `viewBox` 裁出同一地形，避免总图和详图位置漂移；图像内部的小城堡是地图装饰，可交互地标以文字和圆点为准。

地图有缩放、拖动、类型与文字筛选，也提供完整链接目录。手机在未放大时可正常纵向滚动，放大后可拖动地图。新增正文时沿用面向读者的叙述，故事的后续结局不写入年表摘要。
