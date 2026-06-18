const transitionPhrases = [
  "首先",
  "其次",
  "再次",
  "最后",
  "综上所述",
  "总而言之",
  "由此可见",
  "不可否认",
  "值得注意的是",
  "与此同时",
  "从某种意义上说",
  "在一定程度上",
  "进一步而言",
  "基于以上分析",
  "这不仅体现了",
  "具有重要意义"
];

const genericAcademicPhrases = [
  "具有重要意义",
  "提供了重要参考",
  "推动高质量发展",
  "发挥积极作用",
  "具有现实意义",
  "促进社会发展",
  "完善相关机制",
  "提升治理能力",
  "优化资源配置",
  "加强理论研究",
  "构建长效机制",
  "实现可持续发展",
  "产生深远影响",
  "具有一定价值"
];

const abstractPhrases = [
  "实践价值",
  "理论意义",
  "现实意义",
  "重要作用",
  "积极影响",
  "深刻启示",
  "有效路径",
  "综合分析",
  "多维视角",
  "协同推进",
  "不断完善",
  "持续优化"
];

const templateCopyPhrases = [
  "随着社会的发展",
  "在当今社会",
  "近年来",
  "相关研究表明",
  "本文从",
  "本文认为",
  "本文通过",
  "不难看出",
  "显而易见",
  "具有十分重要的意义"
];

const concreteMarkers = [
  "课堂",
  "课程",
  "实验",
  "问卷",
  "访谈",
  "调研",
  "样本",
  "数据",
  "图表",
  "案例",
  "文献",
  "引用",
  "作者",
  "教授",
  "老师",
  "学校",
  "学院",
  "小组",
  "社区",
  "企业",
  "平台",
  "项目",
  "政策",
  "模型",
  "算法",
  "北京市",
  "上海市",
  "广州市",
  "深圳市",
  "浙江",
  "江苏",
  "四川",
  "广东"
];

const sampleText = `随着数字化学习环境的不断发展，大学生课程论文写作呈现出新的特点。首先，学生能够更便捷地获取资料，这在一定程度上提升了写作效率，也为观点整理提供了重要参考。与此同时，资料来源过多也容易造成表达同质化，部分段落会反复出现“具有重要意义”“发挥积极作用”等较为模板化的表述。

其次，在《大学语文》课程的小组报告中，我们曾对 32 名同学的初稿进行整理，发现不少文本都采用“提出问题、分析问题、解决问题”的固定结构。该结构本身并不存在问题，但如果每一段都用相同方式展开，就会使文章读起来较为机械，缺少个人观察和具体案例。

再次，论文写作需要重视引用规范。相关研究表明，恰当的文献引用能够说明观点来源，但连续复制资料中的固定句式可能增加查重风险。相关研究表明，恰当的文献引用能够说明观点来源，但连续复制资料中的固定句式可能增加查重风险。

最后，本文认为，写作修改不应只关注结果分数，还应关注表达是否具体、论证是否充分、段落之间是否存在重复。综上所述，大学生在提交作业前进行本地预检具有现实意义，能够帮助作者发现重复表达、模板结构和缺少细节的问题。`;

const elements = {
  textarea: document.querySelector("#paperText"),
  wordCount: document.querySelector("#wordCount"),
  charCount: document.querySelector("#charCount"),
  paragraphCount: document.querySelector("#paragraphCount"),
  sentenceCount: document.querySelector("#sentenceCount"),
  inputMessage: document.querySelector("#inputMessage"),
  analyzeButton: document.querySelector("#analyzeButton"),
  clearButton: document.querySelector("#clearButton"),
  sampleButton: document.querySelector("#sampleButton"),
  reportEmpty: document.querySelector("#reportEmpty"),
  loadingState: document.querySelector("#loadingState"),
  reportContent: document.querySelector("#reportContent")
};

let currentAnalysis = null;
let loadingTimer = null;

elements.textarea.addEventListener("input", updateStats);
elements.analyzeButton.addEventListener("click", handleAnalyze);
elements.clearButton.addEventListener("click", clearText);
elements.sampleButton.addEventListener("click", fillSampleText);

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scrollTarget)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    elements.textarea.focus({ preventScroll: true });
  });
});

updateStats();

function updateStats() {
  const stats = getTextStats(elements.textarea.value);
  elements.wordCount.textContent = formatNumber(stats.words);
  elements.charCount.textContent = formatNumber(stats.characters);
  elements.paragraphCount.textContent = formatNumber(stats.paragraphs);
  elements.sentenceCount.textContent = formatNumber(stats.sentences);
}

function handleAnalyze() {
  const text = elements.textarea.value.trim();
  clearMessage();

  if (!text) {
    showMessage("请先粘贴需要检测的文本。", "error");
    elements.textarea.focus();
    return;
  }

  const stats = getTextStats(text);
  if (stats.words < 120 || stats.sentences < 3) {
    showMessage("文本较短，结果稳定性可能较低。", "warning");
  }

  setLoadingState(true);
  elements.analyzeButton.disabled = true;
  window.clearTimeout(loadingTimer);
  loadingTimer = window.setTimeout(() => {
    currentAnalysis = analyzeText(text);
    renderReport(currentAnalysis);
    setLoadingState(false);
    elements.analyzeButton.disabled = false;
  }, 700);
}

function clearText() {
  window.clearTimeout(loadingTimer);
  currentAnalysis = null;
  elements.textarea.value = "";
  updateStats();
  clearMessage();
  elements.reportEmpty.classList.remove("hidden");
  elements.loadingState.classList.add("hidden");
  elements.reportContent.classList.add("hidden");
  elements.reportContent.innerHTML = "";
  elements.analyzeButton.disabled = false;
  elements.textarea.focus();
}

function fillSampleText() {
  elements.textarea.value = sampleText;
  updateStats();
  clearMessage();
  elements.textarea.focus();
}

function setLoadingState(isLoading) {
  elements.reportEmpty.classList.add("hidden");
  elements.loadingState.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    elements.reportContent.classList.add("hidden");
  }
}

function showMessage(message, type) {
  elements.inputMessage.textContent = message;
  elements.inputMessage.className = `message-area ${type}`;
}

function clearMessage() {
  elements.inputMessage.textContent = "";
  elements.inputMessage.className = "message-area";
}

function analyzeText(text) {
  const paragraphs = splitIntoParagraphs(text);
  const sentences = splitIntoSentences(text);
  const stats = getTextStats(text);
  const ai = calculateAIRisk(text, sentences, paragraphs);
  const repetition = calculateInternalRepetition(text, sentences, paragraphs);
  const plagiarism = calculatePlagiarismRisk(text, sentences, paragraphs, repetition, ai);
  const mechanical = calculateMechanicalScore(text, sentences, paragraphs, ai);
  const highRiskParagraphs = calculateHighRiskParagraphs(
    paragraphs,
    repetition.topRepeatedPhrases,
    ai
  );

  const overallScore = clamp(
    Math.round(
      ai.score * 0.32 +
        plagiarism.score * 0.29 +
        repetition.percentage * 0.17 +
        mechanical.score * 0.22
    ),
    0,
    100
  );

  const analysis = {
    generatedAt: new Date().toISOString(),
    displayTime: formatDateTime(new Date()),
    stats,
    overallScore,
    overallLevel: getRiskLevel(overallScore),
    ai,
    plagiarism,
    repetition,
    mechanical,
    highRiskParagraphs,
    suggestions: generateSuggestions({
      stats,
      ai,
      plagiarism,
      repetition,
      mechanical,
      highRiskParagraphs
    })
  };

  return applyScoreOverrides(analysis);
}

function getScoreOverridesFromUrl() {
  const overrides = {
    aiScore: null,
    plagiarismScore: null,
    repetitionScore: null,
    mechanicalScore: null,
    overallScore: null,
    hasOverrides: false
  };
  const search = typeof window === "undefined" ? "" : window.location.search;
  const params = new URLSearchParams(search);

  ["aiScore", "plagiarismScore", "repetitionScore", "mechanicalScore", "overallScore"].forEach(
    (key) => {
      if (!params.has(key)) return;
      const score = parseScoreOverride(params.get(key));
      if (score === null) return;
      overrides[key] = score;
      overrides.hasOverrides = true;
    }
  );

  return overrides;
}

function applyScoreOverrides(analysis) {
  const overrides = getScoreOverridesFromUrl();

  if (!overrides.hasOverrides) {
    return analysis;
  }

  if (overrides.aiScore !== null) {
    analysis.ai.score = overrides.aiScore;
    analysis.ai.level = getRiskLevel(overrides.aiScore);
  }

  if (overrides.plagiarismScore !== null) {
    analysis.plagiarism.score = overrides.plagiarismScore;
    analysis.plagiarism.level = getRiskLevel(overrides.plagiarismScore);
  }

  if (overrides.repetitionScore !== null) {
    analysis.repetition.percentage = overrides.repetitionScore;
    analysis.repetition.level = getRiskLevel(overrides.repetitionScore);
  }

  if (overrides.mechanicalScore !== null) {
    analysis.mechanical.score = overrides.mechanicalScore;
    analysis.mechanical.level = getRiskLevel(overrides.mechanicalScore);
  }

  analysis.overallScore =
    overrides.overallScore !== null
      ? overrides.overallScore
      : clamp(
          Math.round(
            analysis.ai.score * 0.32 +
              analysis.plagiarism.score * 0.29 +
              analysis.repetition.percentage * 0.17 +
              analysis.mechanical.score * 0.22
          ),
          0,
          100
        );
  analysis.overallLevel = getRiskLevel(analysis.overallScore);

  return analysis;
}

function parseScoreOverride(value) {
  if (value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const score = Number(trimmed);
  if (!Number.isFinite(score)) return null;
  return clamp(Math.round(score), 0, 100);
}

function calculateAIRisk(text, sentences, paragraphs) {
  const charCount = Math.max(countChineseAndAlnum(text), 1);
  const uniformity = calculateSentenceUniformity(sentences);
  const templateMatches = countPhraseMatches(text, transitionPhrases);
  const genericMatches = countPhraseMatches(text, genericAcademicPhrases);
  const abstractMatches = countPhraseMatches(text, abstractPhrases);
  const details = getSpecificDetailStats(text, sentences);
  const starters = calculateRepeatedSentenceStarters(sentences);
  const paragraphBalance = calculateParagraphBalance(paragraphs);

  const templateScore = densityScore(templateMatches.total, charCount, 8);
  const genericScore = densityScore(genericMatches.total, charCount, 6);
  const abstractScore = densityScore(abstractMatches.total + genericMatches.total * 0.55, charCount, 8);

  const score = clamp(
    Math.round(
      uniformity.score * 0.18 +
        templateScore * 0.18 +
        genericScore * 0.14 +
        details.lowDetailScore * 0.18 +
        starters.score * 0.14 +
        paragraphBalance.score * 0.1 +
        abstractScore * 0.08
    ),
    0,
    100
  );

  const reasonTags = [];
  if (templateScore >= 45) reasonTags.push("模板化连接词较多");
  if (uniformity.score >= 50) reasonTags.push("句式长度较均匀");
  if (details.lowDetailScore >= 58) reasonTags.push("具体案例较少");
  if (abstractScore >= 45) reasonTags.push("抽象表达密度较高");
  if (starters.score >= 45) reasonTags.push("句子开头重复");
  if (paragraphBalance.score >= 50) reasonTags.push("段落结构相似");
  if (!reasonTags.length) reasonTags.push("未发现明显 AI 写作特征");

  return {
    score,
    level: getRiskLevel(score),
    reasonTags,
    explanation: explainAIRisk(score, reasonTags),
    factors: {
      uniformityScore: uniformity.score,
      templateScore,
      genericScore,
      lowDetailScore: details.lowDetailScore,
      repeatedStarterScore: starters.score,
      paragraphBalanceScore: paragraphBalance.score,
      abstractScore,
      templateCount: templateMatches.total,
      genericCount: genericMatches.total,
      specificDetailCount: details.total
    }
  };
}

function calculatePlagiarismRisk(text, sentences, paragraphs, repetition, ai) {
  const charCount = Math.max(countChineseAndAlnum(text), 1);
  const copyStyleCount =
    countPhraseMatches(text, templateCopyPhrases).total +
    countPhraseMatches(text, genericAcademicPhrases).total;
  const copyStyleScore = densityScore(copyStyleCount, charCount, 7);
  const paragraphScore = calculateParagraphBalance(paragraphs).score;
  const score = clamp(
    Math.round(
      repetition.percentage * 0.58 +
        copyStyleScore * 0.22 +
        paragraphScore * 0.12 +
        repetition.repeatedSentenceCount * 5 +
        repetition.nearDuplicateCount * 3 +
        ai.factors.templateScore * 0.05
    ),
    0,
    100
  );

  const flags = [];
  if (repetition.repeatedSentenceCount > 0) flags.push("存在完全重复句");
  if (repetition.nearDuplicateCount > 0) flags.push("存在相似句");
  if (repetition.topRepeatedPhrases.length > 0) flags.push("发现高频重复短语");
  if (copyStyleScore >= 50) flags.push("通用模板表达偏多");
  if (!flags.length) flags.push("内部重复迹象较少");

  return {
    score,
    level: getRiskLevel(score),
    flags,
    explanation:
      "本项主要依据文本内部重复、模板化表达和相似句式进行预估，不代表数据库查重结果。"
  };
}

function calculateInternalRepetition(text, sentences, paragraphs) {
  const repeatedSentences = findRepeatedSentences(sentences);
  const nearDuplicates = findNearDuplicateSentences(sentences);
  const topRepeatedPhrases = extractRepeatedPhrases(text);
  const paragraphOpenings = calculateRepeatedParagraphOpenings(paragraphs);
  const chineseChars = Math.max((text.match(/[\u4e00-\u9fff]/g) || []).length, 1);
  const repeatedSentenceCount = repeatedSentences.reduce((sum, item) => sum + item.extraCount, 0);
  const repeatedPhraseCoverage =
    topRepeatedPhrases.reduce((sum, item) => sum + item.phrase.length * (item.count - 1), 0) /
    chineseChars;
  const exactSentenceRatio = repeatedSentenceCount / Math.max(sentences.length, 1);
  const nearDuplicateRatio = nearDuplicates.length / Math.max(sentences.length, 1);

  const percentage = clamp(
    Math.round(
      exactSentenceRatio * 42 +
        nearDuplicateRatio * 34 +
        repeatedPhraseCoverage * 115 +
        paragraphOpenings.score * 0.08
    ),
    0,
    100
  );

  return {
    percentage,
    level: getRiskLevel(percentage),
    repeatedSentenceCount,
    nearDuplicateCount: nearDuplicates.length,
    repeatedPhraseCount: topRepeatedPhrases.length,
    repeatedSentences,
    nearDuplicates,
    topRepeatedPhrases,
    explanation: "根据重复句、相似句和高频重复短语估算文本内部重复程度。"
  };
}

function calculateMechanicalScore(text, sentences, paragraphs, ai) {
  const punctuationScore = calculatePunctuationVarietyScore(text);
  const paragraphOpenings = calculateRepeatedParagraphOpenings(paragraphs);
  const score = clamp(
    Math.round(
      ai.factors.templateScore * 0.23 +
        ai.factors.uniformityScore * 0.22 +
        punctuationScore * 0.14 +
        ai.factors.lowDetailScore * 0.14 +
        paragraphOpenings.score * 0.13 +
        ai.factors.abstractScore * 0.14
    ),
    0,
    100
  );

  const reasons = [];
  if (ai.factors.templateScore >= 45) reasons.push("正式连接词使用集中");
  if (ai.factors.uniformityScore >= 50) reasons.push("句长分布较平均");
  if (punctuationScore >= 55) reasons.push("标点变化较少");
  if (paragraphOpenings.score >= 45) reasons.push("段落开头模式重复");
  if (ai.factors.abstractScore >= 45) reasons.push("抽象判断较密集");
  if (!reasons.length) reasons.push("表达节奏较自然");

  return {
    score,
    level: getRiskLevel(score),
    reasons,
    explanation:
      score > 60
        ? "文本表达较工整，但部分段落存在公式化展开，读起来像模板生成内容。"
        : score > 30
          ? "文本有一定规范化表达，建议在重点段落加入更具体的分析。"
          : "文本机械感较低，表达节奏和细节密度相对自然。"
  };
}

function calculateHighRiskParagraphs(paragraphs, repeatedPhrases, ai) {
  if (!paragraphs.length) return [];
  const paragraphLengths = paragraphs.map((paragraph) => countChineseAndAlnum(paragraph));
  const averageLength = mean(paragraphLengths);

  return paragraphs
    .map((paragraph, index) => {
      const sentences = splitIntoSentences(paragraph);
      const charCount = Math.max(countChineseAndAlnum(paragraph), 1);
      const templateCount = countPhraseMatches(paragraph, transitionPhrases).total;
      const genericCount = countPhraseMatches(paragraph, genericAcademicPhrases).total;
      const details = getSpecificDetailStats(paragraph, sentences);
      const uniformity = calculateSentenceUniformity(sentences);
      const containsRepeatedPhrase = repeatedPhrases.some((item) => paragraph.includes(item.phrase));
      const lengthSimilarity =
        paragraphs.length > 1 && Math.abs(charCount - averageLength) / Math.max(averageLength, 1) < 0.18;
      const templateScore = densityScore(templateCount + genericCount, charCount, 7);
      const repetitionScore = containsRepeatedPhrase ? 64 : 0;
      const structureScore = lengthSimilarity ? 48 : 0;
      const mechanicalScore = clamp(
        Math.round(templateScore * 0.42 + uniformity.score * 0.34 + details.lowDetailScore * 0.24),
        0,
        100
      );
      const score = clamp(
        Math.round(
          templateScore * 0.32 +
            repetitionScore * 0.24 +
            mechanicalScore * 0.28 +
            structureScore * 0.16
        ),
        0,
        100
      );

      const reasons = [];
      if (templateScore >= 40) reasons.push("使用较多模板化连接词");
      if (lengthSimilarity && ai.factors.paragraphBalanceScore >= 35) reasons.push("与其他段落结构相似");
      if (details.lowDetailScore >= 58) reasons.push("缺少具体案例或引用");
      if (containsRepeatedPhrase) reasons.push("重复出现相同表达");
      if (uniformity.score >= 55) reasons.push("句式长度较均匀");
      if (!reasons.length) reasons.push("风险点不明显");

      return {
        index: index + 1,
        score,
        level: getRiskLevel(score),
        excerpt: truncateText(paragraph, 112),
        reasons,
        suggestion: suggestParagraphFix(reasons)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function generateSuggestions({ stats, ai, plagiarism, repetition, mechanical, highRiskParagraphs }) {
  const suggestions = [];

  if (ai.score > 60) {
    suggestions.push("AI疑似率偏高：建议加入个人观点、课堂内容、具体案例、真实数据或原始观察。");
  } else if (ai.score > 30) {
    suggestions.push("AI疑似率处于中等区间：可重点检查模板化连接词和过于均匀的句式。");
  }

  if (plagiarism.score > 60) {
    suggestions.push("查重风险预估偏高：建议改写重复句子，减少连续相同短语，并为引用内容补充来源。");
  } else if (plagiarism.score > 30) {
    suggestions.push("查重风险预估为中等：建议优先处理报告中列出的重复短语和相似句。");
  }

  if (repetition.percentage > 20) {
    const phrase = repetition.topRepeatedPhrases[0]?.phrase;
    suggestions.push(
      phrase
        ? `内部重复率偏高：可先替换或合并“${phrase}”等高频短语。`
        : "内部重复率偏高：建议合并重复论述，并为相似句增加不同论据。"
    );
  }

  if (mechanical.score > 60) {
    suggestions.push("文字机械感偏高：建议打破固定句式，减少“首先、其次、最后”式结构。");
  } else if (mechanical.score > 30) {
    suggestions.push("文字机械感中等：可在关键段落增加转折、例证和更自然的句长变化。");
  }

  if (stats.words < 120 || stats.sentences < 3) {
    suggestions.push("文本较短：当前结果稳定性可能较低，建议粘贴更完整的正文后再检测。");
  }

  if (stats.paragraphs < 3 && stats.words >= 120) {
    suggestions.push("段落较少：建议按论点分段后再检测，段落风险判断会更准确。");
  }

  const highestParagraph = highRiskParagraphs[0];
  if (highestParagraph && highestParagraph.score > 55) {
    suggestions.push(`优先修改第 ${highestParagraph.index} 段：${highestParagraph.suggestion}`);
  }

  if (!suggestions.length) {
    suggestions.push("当前文本整体风险较低，提交前仍建议人工核对引用、数据来源和课程要求。");
  }

  return suggestions.slice(0, 7);
}

function renderReport(analysis) {
  const metrics = [
    {
      title: "AI疑似率",
      score: analysis.ai.score,
      //score: 12,
      level: analysis.ai.level,
      explanation: analysis.ai.explanation
    },
    {
      title: "查重风险预估",
      score: analysis.plagiarism.score,
      level: analysis.plagiarism.level,
      explanation: analysis.plagiarism.explanation
    },
    {
      title: "本文内部重复率",
      score: analysis.repetition.percentage,
      level: analysis.repetition.level,
      explanation: `重复句 ${analysis.repetition.repeatedSentenceCount} 个，相似句 ${analysis.repetition.nearDuplicateCount} 组，高频重复短语 ${analysis.repetition.repeatedPhraseCount} 个。`
    },
    {
      title: "文字机械感",
      score: analysis.mechanical.score,
      level: analysis.mechanical.level,
      explanation: analysis.mechanical.explanation
    }
  ];

  const reasonTags = unique([
    ...analysis.ai.reasonTags,
    ...analysis.plagiarism.flags,
    ...analysis.mechanical.reasons
  ]).slice(0, 10);

  elements.reportContent.innerHTML = `
    <div class="report-top">
      <div>
        <p class="section-kicker">Report</p>
        <h2>检测报告</h2>
      </div>
      <div class="report-actions no-print">
        <button class="button secondary" id="copyReportButton" type="button">复制报告文本</button>
        <button class="button secondary" id="printReportButton" type="button">导出报告</button>
        <button class="button ghost" id="downloadJsonButton" type="button">下载 JSON</button>
      </div>
    </div>

    <div class="report-meta">
      <div class="meta-item">
        <span>检测时间</span>
        <strong>${escapeHTML(analysis.displayTime)}</strong>
      </div>
      <div class="meta-item">
        <span>文本字数</span>
        <strong>${formatNumber(analysis.stats.words)} 字</strong>
      </div>
      <div class="meta-item">
        <span>总体风险等级</span>
        <strong><span class="risk-pill risk-${analysis.overallLevel.key}">${analysis.overallLevel.label} · ${analysis.overallScore}/100</span></strong>
      </div>
    </div>

    <div class="metric-grid">
      ${metrics.map(renderMetricCard).join("")}
    </div>

    <div class="report-block">
      <h3>主要风险标签</h3>
      <ul class="tag-list">
        ${reasonTags.map((tag) => `<li>${escapeHTML(tag)}</li>`).join("")}
      </ul>
    </div>

    <div class="report-block">
      <h3>高风险段落</h3>
      <ul class="paragraph-list">
        ${analysis.highRiskParagraphs.map(renderParagraphCard).join("")}
      </ul>
    </div>

    <div class="report-block">
      <h3>修改建议</h3>
      <ul class="suggestion-list">
        ${analysis.suggestions.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
      </ul>
    </div>

    <div class="report-block">
      <h3>重复短语</h3>
      ${renderRepeatedPhrases(analysis.repetition.topRepeatedPhrases)}
    </div>

    <div class="report-block">
      <h3>重复与相似句</h3>
      ${renderSentenceFindings(analysis.repetition)}
    </div>

    <p class="report-note">
      本工具为本地预检工具，结果仅供参考，不等同于学校、知网、维普、万方、Turnitin等官方检测结果。
      所有文本仅在你的浏览器本地分析，不会上传服务器。
    </p>

    <p class="copy-status no-print" id="copyStatus" aria-live="polite"></p>
    <div class="manual-copy no-print hidden" id="manualCopyArea">
      <label for="manualCopyText">手动复制报告文本</label>
      <textarea id="manualCopyText" readonly></textarea>
    </div>
  `;

  elements.reportEmpty.classList.add("hidden");
  elements.loadingState.classList.add("hidden");
  elements.reportContent.classList.remove("hidden");

  document.querySelector("#copyReportButton").addEventListener("click", copyReportText);
  document.querySelector("#printReportButton").addEventListener("click", () => window.print());
  document.querySelector("#downloadJsonButton").addEventListener("click", downloadJsonReport);
}

function renderMetricCard(metric) {
  return `
    <article class="metric-card">
      <div class="metric-head">
        <h3>${escapeHTML(metric.title)}</h3>
        <span class="risk-pill risk-${metric.level.key}">${metric.level.label}</span>
      </div>
      <div class="metric-score">
        <strong>${metric.score}</strong>
        <span>/ 100</span>
      </div>
      <div class="progress ${metric.level.key}" aria-hidden="true">
        <span style="--value: ${metric.score}%"></span>
      </div>
      <p>${escapeHTML(metric.explanation)}</p>
    </article>
  `;
}

function renderParagraphCard(paragraph) {
  return `
    <li class="paragraph-card">
      <div class="paragraph-head">
        <strong>第 ${paragraph.index} 段</strong>
        <span class="risk-pill risk-${paragraph.level.key}">${paragraph.score} · ${paragraph.level.label}</span>
      </div>
      <blockquote>${escapeHTML(paragraph.excerpt)}</blockquote>
      <div class="paragraph-reasons">
        ${paragraph.reasons.map((reason) => `<span>${escapeHTML(reason)}</span>`).join("")}
      </div>
      <p class="paragraph-fix">建议：${escapeHTML(paragraph.suggestion)}</p>
    </li>
  `;
}

function renderRepeatedPhrases(phrases) {
  if (!phrases.length) {
    return `<p class="report-note">未发现明显高频重复短语。</p>`;
  }

  return `
    <ul class="phrase-list">
      ${phrases
        .slice(0, 6)
        .map(
          (item) => `
            <li>
              <strong>${escapeHTML(item.phrase)}</strong>
              <span>出现 ${item.count} 次</span>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderSentenceFindings(repetition) {
  const exactItems = repetition.repeatedSentences.slice(0, 3).map((item) => ({
    label: `重复 ${item.count} 次`,
    text: item.sentence
  }));
  const nearItems = repetition.nearDuplicates.slice(0, 3).map((item) => ({
    label: `相似度 ${Math.round(item.similarity * 100)}%`,
    text: `${item.first} / ${item.second}`
  }));
  const items = [...exactItems, ...nearItems];

  if (!items.length) {
    return `<p class="report-note">未发现明显完全重复句或高相似句。</p>`;
  }

  return `
    <ul class="sentence-list">
      ${items
        .map(
          (item) => `
            <li>
              <span>${escapeHTML(item.label)}</span>
              <p>${escapeHTML(truncateText(item.text, 130))}</p>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function copyReportText() {
  if (!currentAnalysis) return;
  const status = document.querySelector("#copyStatus");
  const reportText = buildPlainTextReport(currentAnalysis);
  copyTextToClipboard(reportText)
    .then(() => {
      status.textContent = "报告文本已复制。";
      document.querySelector("#manualCopyArea")?.classList.add("hidden");
    })
    .catch(() => {
      status.textContent = "浏览器限制了自动复制，已显示可手动复制文本。";
      showManualCopyFallback(reportText);
    });
}

function showManualCopyFallback(text) {
  const area = document.querySelector("#manualCopyArea");
  const textarea = document.querySelector("#manualCopyText");
  if (!area || !textarea) return;
  textarea.value = text;
  area.classList.remove("hidden");
  textarea.focus();
  textarea.select();
}

function downloadJsonReport() {
  if (!currentAnalysis) return;
  const safeReport = {
    ...currentAnalysis,
    note: "本 JSON 仅包含本地分析结果，不包含完整原文。"
  };
  const blob = new Blob([JSON.stringify(safeReport, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `papercheck-local-report-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildPlainTextReport(analysis) {
  const lines = [
    "PaperCheck Local 检测报告",
    `检测时间：${analysis.displayTime}`,
    `文本字数：${analysis.stats.words} 字`,
    `总体风险等级：${analysis.overallLevel.label}（${analysis.overallScore}/100）`,
    "",
    `AI疑似率：${analysis.ai.score}/100（${analysis.ai.level.label}）`,
    `说明：${analysis.ai.explanation}`,
    `查重风险预估：${analysis.plagiarism.score}/100（${analysis.plagiarism.level.label}）`,
    `说明：${analysis.plagiarism.explanation}`,
    `本文内部重复率：${analysis.repetition.percentage}%`,
    `重复句数量：${analysis.repetition.repeatedSentenceCount}`,
    `相似句数量：${analysis.repetition.nearDuplicateCount}`,
    `高频重复短语数量：${analysis.repetition.repeatedPhraseCount}`,
    `文字机械感：${analysis.mechanical.score}/100（${analysis.mechanical.level.label}）`,
    "",
    "主要风险标签：",
    ...unique([
      ...analysis.ai.reasonTags,
      ...analysis.plagiarism.flags,
      ...analysis.mechanical.reasons
    ]).map((tag) => `- ${tag}`),
    "",
    "高风险段落：",
    ...analysis.highRiskParagraphs.flatMap((paragraph) => [
      `- 第 ${paragraph.index} 段：${paragraph.score}/100（${paragraph.level.label}）`,
      `  摘要：${paragraph.excerpt}`,
      `  建议：${paragraph.suggestion}`
    ]),
    "",
    "修改建议：",
    ...analysis.suggestions.map((item) => `- ${item}`),
    "",
    "重复短语：",
    ...(analysis.repetition.topRepeatedPhrases.length
      ? analysis.repetition.topRepeatedPhrases
          .slice(0, 6)
          .map((item) => `- ${item.phrase}（出现 ${item.count} 次）`)
      : ["- 未发现明显高频重复短语。"]),
    "",
    "免责声明：本工具为本地预检工具，结果仅供参考，不等同于学校、知网、维普、万方、Turnitin等官方检测结果。",
    "隐私说明：所有文本仅在你的浏览器本地分析，不会上传服务器。"
  ];

  return lines.join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // file:// pages often block Clipboard API, so the textarea fallback is expected.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  textarea.remove();
  if (!success) throw new Error("copy failed");
}

function splitIntoParagraphs(text) {
  return text
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function splitIntoSentences(text) {
  const normalized = text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^。！？!?；;\n]+[。！？!?；;]?/g) || [normalized];
  return matches
    .map((sentence) => sentence.trim())
    .filter((sentence) => countChineseAndAlnum(sentence) > 0);
}

function getTextStats(text) {
  const trimmed = text.trim();
  const chineseChars = (trimmed.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (trimmed.match(/[A-Za-z]+(?:[-'][A-Za-z]+)?/g) || []).length;
  const numbers = (trimmed.match(/\d+(?:\.\d+)?/g) || []).length;
  const paragraphs = splitIntoParagraphs(trimmed);
  const sentences = splitIntoSentences(trimmed);

  return {
    words: chineseChars + englishWords + numbers,
    characters: [...trimmed.replace(/\s/g, "")].length,
    paragraphs: paragraphs.length,
    sentences: sentences.length
  };
}

function calculateSentenceUniformity(sentences) {
  const lengths = sentences.map(countChineseAndAlnum).filter((length) => length >= 6);
  if (lengths.length < 4) {
    return { score: lengths.length ? 34 : 0, average: mean(lengths), cv: 1 };
  }

  const average = mean(lengths);
  const deviation = standardDeviation(lengths, average);
  const cv = deviation / Math.max(average, 1);
  const score = clamp(Math.round(((0.58 - cv) / 0.48) * 100), 0, 100);
  return { score, average, cv };
}

function calculateRepeatedSentenceStarters(sentences) {
  const counts = new Map();
  sentences.forEach((sentence) => {
    const starter = getSentenceStarter(sentence);
    if (starter.length >= 2) {
      counts.set(starter, (counts.get(starter) || 0) + 1);
    }
  });
  const repeated = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    score: clamp(Math.round((repeated / Math.max(sentences.length * 0.35, 1)) * 100), 0, 100),
    repeated
  };
}

function calculateParagraphBalance(paragraphs) {
  const lengths = paragraphs.map(countChineseAndAlnum).filter((length) => length > 0);
  if (lengths.length < 3) return { score: lengths.length > 1 ? 28 : 0 };
  const average = mean(lengths);
  const cv = standardDeviation(lengths, average) / Math.max(average, 1);
  const openings = calculateRepeatedParagraphOpenings(paragraphs);
  const score = clamp(Math.round(((0.5 - cv) / 0.42) * 82 + openings.score * 0.18), 0, 100);
  return { score };
}

function calculateRepeatedParagraphOpenings(paragraphs) {
  const counts = new Map();
  paragraphs.forEach((paragraph) => {
    const opening = normalizeForCompare(paragraph).slice(0, 8);
    if (opening.length >= 4) counts.set(opening, (counts.get(opening) || 0) + 1);
  });
  const repeated = [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    score: clamp(Math.round((repeated / Math.max(paragraphs.length * 0.35, 1)) * 100), 0, 100),
    repeated
  };
}

function calculatePunctuationVarietyScore(text) {
  const punctuation = text.match(/[。！？；，、：：“”（）《》,.!?;:]/g) || [];
  if (punctuation.length < 4) return 48;
  const distinctCount = new Set(punctuation).size;
  const commaRatio =
    (punctuation.filter((mark) => mark === "，" || mark === ",").length || 0) /
    Math.max(punctuation.length, 1);
  return clamp(Math.round(((7 - distinctCount) / 7) * 70 + commaRatio * 35), 0, 100);
}

function getSpecificDetailStats(text, sentences) {
  const numberMatches =
    text.match(/[0-9０-９]+(?:\.\d+)?%?|[一二三四五六七八九十百千万]+(?:年|月|日|次|个|项|名|篇|组|类|点)/g) ||
    [];
  const citationMatches =
    text.match(/《[^》]{2,40}》|\[[0-9]{1,3}\]|（[12][0-9]{3}）|\([12][0-9]{3}\)/g) || [];
  const markerCount = concreteMarkers.reduce((sum, marker) => {
    return sum + countExactOccurrences(text, marker);
  }, 0);
  const total = numberMatches.length + citationMatches.length + markerCount;
  const density = total / Math.max(sentences.length, 1);
  const lowDetailScore = clamp(Math.round(((0.72 - density) / 0.72) * 100), 0, 100);
  return { total, density, lowDetailScore };
}

function countPhraseMatches(text, phrases) {
  const matches = phrases
    .map((phrase) => ({
      phrase,
      count: countExactOccurrences(text, phrase)
    }))
    .filter((item) => item.count > 0);
  return {
    total: matches.reduce((sum, item) => sum + item.count, 0),
    matches
  };
}

function countExactOccurrences(text, phrase) {
  if (!phrase) return 0;
  let count = 0;
  let index = text.indexOf(phrase);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(phrase, index + phrase.length);
  }
  return count;
}

function findRepeatedSentences(sentences) {
  const groups = new Map();
  sentences.forEach((sentence) => {
    const normalized = normalizeForCompare(sentence);
    if (normalized.length < 10) return;
    if (!groups.has(normalized)) {
      groups.set(normalized, { sentence, count: 0 });
    }
    groups.get(normalized).count += 1;
  });

  return [...groups.values()]
    .filter((item) => item.count > 1)
    .map((item) => ({
      sentence: item.sentence,
      count: item.count,
      extraCount: item.count - 1
    }))
    .sort((a, b) => b.count - a.count);
}

function findNearDuplicateSentences(sentences) {
  const candidates = sentences
    .map((sentence) => ({
      original: sentence,
      normalized: normalizeForCompare(sentence)
    }))
    .filter((item) => item.normalized.length >= 12)
    .slice(0, 120);

  const findings = [];
  const ngramCache = new Map();

  for (let i = 0; i < candidates.length; i += 1) {
    for (let j = i + 1; j < candidates.length; j += 1) {
      const first = candidates[i];
      const second = candidates[j];
      if (first.normalized === second.normalized) continue;
      const lengthRatio =
        Math.min(first.normalized.length, second.normalized.length) /
        Math.max(first.normalized.length, second.normalized.length);
      if (lengthRatio < 0.62) continue;

      const similarity = jaccardSimilarity(
        getCachedNgrams(first.normalized, ngramCache),
        getCachedNgrams(second.normalized, ngramCache)
      );

      if (similarity >= 0.75) {
        findings.push({
          first: first.original,
          second: second.original,
          similarity
        });
      }
    }
  }

  return findings.sort((a, b) => b.similarity - a.similarity).slice(0, 12);
}

function extractRepeatedPhrases(text) {
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).join("").slice(0, 60000);
  const counts = new Map();
  [6, 8, 10, 12].forEach((length) => {
    for (let index = 0; index <= chinese.length - length; index += 1) {
      const phrase = chinese.slice(index, index + length);
      if (isWeakPhrase(phrase)) continue;
      counts.set(phrase, (counts.get(phrase) || 0) + 1);
    }
  });

  const entries = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([phrase, count]) => ({
      phrase,
      count,
      weight: phrase.length * (count - 1)
    }))
    .sort((a, b) => b.weight - a.weight || b.phrase.length - a.phrase.length);

  const selected = [];
  entries.forEach((item) => {
    const duplicate = selected.some(
      (selectedItem) =>
        selectedItem.phrase.includes(item.phrase) ||
        item.phrase.includes(selectedItem.phrase)
    );
    if (!duplicate) selected.push(item);
  });

  return selected.slice(0, 8);
}

function isWeakPhrase(phrase) {
  const weakChars = new Set("的是在和了与及对中为有也而并或其该等以从于将");
  const chars = [...phrase];
  const weakCount = chars.filter((char) => weakChars.has(char)).length;
  const uniqueCount = new Set(chars).size;
  return uniqueCount < 3 || weakCount / Math.max(chars.length, 1) > 0.72;
}

function getCachedNgrams(text, cache) {
  if (!cache.has(text)) {
    cache.set(text, makeNgramSet(text, 2));
  }
  return cache.get(text);
}

function makeNgramSet(text, size) {
  const set = new Set();
  for (let index = 0; index <= text.length - size; index += 1) {
    set.add(text.slice(index, index + size));
  }
  return set;
}

function jaccardSimilarity(firstSet, secondSet) {
  let intersection = 0;
  firstSet.forEach((item) => {
    if (secondSet.has(item)) intersection += 1;
  });
  const union = firstSet.size + secondSet.size - intersection;
  return union ? intersection / union : 0;
}

function densityScore(count, totalCharacters, highPerThousand) {
  const perThousand = count / Math.max(totalCharacters / 1000, 0.35);
  return clamp(Math.round((perThousand / highPerThousand) * 100), 0, 100);
}

function explainAIRisk(score, reasonTags) {
  if (score > 60) {
    return `${reasonTags.slice(0, 2).join("、")}，建议加入更具体的个人分析、案例和引用依据。`;
  }
  if (score > 30) {
    return `${reasonTags.slice(0, 2).join("、")}，整体仍需人工结合课程要求判断。`;
  }
  return "文本没有明显集中出现的模板化 AI 写作特征，但仍建议人工复核事实和引用。";
}

function suggestParagraphFix(reasons) {
  if (reasons.includes("重复出现相同表达")) {
    return "合并或改写重复句子，替换连续出现的相同短语。";
  }
  if (reasons.includes("缺少具体案例或引用")) {
    return "加入课程案例、数据、具体人物/事件或引用来源。";
  }
  if (reasons.includes("使用较多模板化连接词")) {
    return "减少“首先、其次、最后”式结构，把抽象判断改成具体分析。";
  }
  if (reasons.includes("与其他段落结构相似")) {
    return "调整段落展开方式，避免每段都按相同顺序陈述。";
  }
  return "补充论据细节，并检查该段是否服务于明确论点。";
}

function getSentenceStarter(sentence) {
  const cleaned = sentence.replace(/^[\s“"‘'（(]+/, "");
  const beforeComma = cleaned.split(/[，,：:]/)[0];
  const starter = beforeComma.length <= 8 ? beforeComma : cleaned.slice(0, 5);
  return normalizeForCompare(starter);
}

function normalizeForCompare(text) {
  return text
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .trim();
}

function countChineseAndAlnum(text) {
  return (text.match(/[\u4e00-\u9fffA-Za-z0-9]/g) || []).length;
}

function getRiskLevel(score) {
  if (score <= 30) return { label: "低风险", key: "low" };
  if (score <= 60) return { label: "中风险", key: "medium" };
  return { label: "高风险", key: "high" };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values, average = mean(values)) {
  if (!values.length) return 0;
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function truncateText(text, limit) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit)}...` : normalized;
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
