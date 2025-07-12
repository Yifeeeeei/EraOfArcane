# EraOfArcane

用于展示EraOfArcane主页

## 更改元素配置

 修改**config.js**.

## 测试

```bash
sh test.sh
```

在浏览器打开相应端口

## 从MarkDown生成HTML网页

**不要直接修改html文件**

假设要添加/修改关键词页面

1. 安装[pandoc](https://pandoc.org/installing.html)
2. 添加/修改mds/Keywords.md
3. 运行以下命令，会在htmls目录下生成Keywords.html

```bash
pandoc mds/Keywords.md -o htmls/Keywords.html --standalone --toc --css=styles/gothic.css
```

