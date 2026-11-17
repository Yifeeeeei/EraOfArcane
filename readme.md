# EraOfArcane

奥术纪元的静态主页、游戏手册、故事阅读页与设定集，部署于 GitHub Pages。

## 本地预览

在仓库根目录运行：

```sh
python3 -m http.server 8080
```

打开 `http://localhost:8080/`。无需安装前端依赖。

## 主页与统一样式

- `index.html`：主页布局。
- `script/config.js`：主页主菜单与工具链接。
- `script/main.js`：随机元素背景、主菜单与社群弹窗。
- `style/arcane.css`：主页、设定集、正文共用的字体、色彩、徽章页眉与基础样式。
- `style/style.css`：主页布局。
- `world/world.css`：设定集布局。
- `htmls/styles/gothic.css`：正文排版、目录、移动端与打印样式。

字体与插画直接复用仓库内的 `world/assets/`，不依赖外部字体服务。外部卡牌工具、视频和 TTS 模组仅作为链接。

## 从 Markdown 生成阅读页

需要 Python 3.9+ 和 [Pandoc](https://pandoc.org/installing.html)。**修改 `mds/` 中的源文，不直接编辑生成的 `htmls/*.html`。**

```sh
sh genmd.sh
```

脚本调用 `tools/build-pages.py`，将 `mds/*.md` 全部生成至 `htmls/`，统一使用 `tools/templates/reader.html`。页面含中文标题、页眉、章节目录与返回导航；故事封面及名称取自 `world/catalog.json`。新增顶层 Markdown 文件后再次运行即可生成对应页面。正文中的相对资源路径以输出目录 `htmls/` 为基准，例如 `resources/rules/image_1.png`。

修改正文样式时编辑 CSS；修改页面结构时编辑 Pandoc 模板并重新运行脚本。源文件、模板与生成的 HTML 一并提交，GitHub Pages 无需额外构建。

## 设定集

世界正文来自 `mds/world/*.md`，索引来自 `world/catalog.json`：

```sh
python3 tools/build-world.py
```

详细说明见 [world/README.md](world/README.md)。
