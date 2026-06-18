# PaperCheck Local

PaperCheck Local 是一个本地运行的论文风险预检原型，面向中国大陆高校学生的作业、论文、课程报告和作文修改场景。

它可以在浏览器中根据启发式规则生成：

- AI疑似率
- 查重风险预估
- 本文内部重复率
- 文字机械感
- 高风险段落
- 修改建议
- 可复制的检测报告

## 如何运行

直接用浏览器打开 `index.html` 即可使用。

也可以在项目目录中启动一个本地静态服务器：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## GitHub Pages 部署方法

1. Push this project to a GitHub repository.
2. Open the repository on GitHub.
3. Go to Settings.
4. Go to Pages.
5. Under “Build and deployment”, choose “Deploy from a branch”.
6. Select branch: main.
7. Select folder: /root.
8. Click Save.
9. Wait 1–2 minutes.
10. Open the generated GitHub Pages link.

GitHub Pages only hosts the website files. User text is processed locally in each visitor’s browser and is not uploaded to GitHub.

## URL 分数参数

可以在 URL 后添加临时参数，用于查看不同最终报告分数的展示效果：

```text
?aiScore=50
?aiScore=50&plagiarismScore=40
?aiScore=50&plagiarismScore=40&repetitionScore=12&mechanicalScore=37
```

支持的参数：

- `aiScore`
- `plagiarismScore`
- `repetitionScore`
- `mechanicalScore`
- `overallScore`

这些参数不会改变真实算法，不会保存任何内容，也只影响打开该精确链接的当前访问者。删除 URL 参数后，网站会恢复正常评分。

## 重要声明

本工具为本地预检工具，结果仅供写作修改参考。

它不是官方 AI 检测工具，也不是官方查重工具，不等同于学校、知网、维普、万方、Turnitin 等平台的检测结果。

本工具不会帮助规避检测，也不应被用于作弊。它的定位是提交前的写作风险与质量预检。

## 隐私

所有文本仅在你的浏览器本地分析，不会上传服务器。

本项目不需要登录、后端、数据库、付费 API、云服务或互联网连接。

## 可选本地升级方向

- 添加 Word/PDF 上传
- 添加引用与参考文献检查
- 生成完整可下载 PDF 报告
