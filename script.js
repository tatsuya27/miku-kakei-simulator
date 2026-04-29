/* ============================================
   家計の黄金比シミュレーター
   横山光昭式（家計再生メソッド）の参考値
============================================ */

// 世帯タイプ別の黄金比（合計100%）
const RATIOS = {
  single: {
    label: '単身',
    items: [
      { name: '住居費',       pct: 28, color: '#FFB6C1' },
      { name: '食費',         pct: 18, color: '#FFCBA4' },
      { name: '水道光熱費',   pct: 4,  color: '#FFE5A5' },
      { name: '通信費',       pct: 6,  color: '#D4E89E' },
      { name: '小遣い',       pct: 10, color: '#A4E5C5' },
      { name: '衣服美容費',   pct: 5,  color: '#A4D8E5' },
      { name: '日用品費',     pct: 3,  color: '#B6BFE5' },
      { name: '趣味娯楽費',   pct: 4,  color: '#D4B6E5' },
      { name: '交際費',       pct: 5,  color: '#E5B6D4' },
      { name: '医療費',       pct: 1,  color: '#F0C9D9' },
      { name: '保険料',       pct: 4,  color: '#E5D9B6' },
      { name: '嗜好品',       pct: 2,  color: '#C9E5D9' },
      { name: 'その他',       pct: 4,  color: '#D9D9D9' },
      { name: '貯蓄',         pct: 6,  color: '#FF8FA8' },
    ],
  },
  couple: {
    label: '夫婦のみ',
    items: [
      { name: '住居費',       pct: 25, color: '#FFB6C1' },
      { name: '食費',         pct: 15, color: '#FFCBA4' },
      { name: '水道光熱費',   pct: 5,  color: '#FFE5A5' },
      { name: '通信費',       pct: 5,  color: '#D4E89E' },
      { name: '小遣い',       pct: 10, color: '#A4E5C5' },
      { name: '衣服美容費',   pct: 4,  color: '#A4D8E5' },
      { name: '日用品費',     pct: 2,  color: '#B6BFE5' },
      { name: '趣味娯楽費',   pct: 3,  color: '#D4B6E5' },
      { name: '交際費',       pct: 3,  color: '#E5B6D4' },
      { name: '医療費',       pct: 1,  color: '#F0C9D9' },
      { name: '保険料',       pct: 5,  color: '#E5D9B6' },
      { name: '嗜好品',       pct: 2,  color: '#C9E5D9' },
      { name: 'その他',       pct: 8,  color: '#D9D9D9' },
      { name: '貯蓄',         pct: 12, color: '#FF8FA8' },
    ],
  },
  family: {
    label: '夫婦＋子供',
    items: [
      { name: '住居費',         pct: 25, color: '#FFB6C1' },
      { name: '食費',           pct: 15, color: '#FFCBA4' },
      { name: '水道光熱費',     pct: 6,  color: '#FFE5A5' },
      { name: '通信費',         pct: 5,  color: '#D4E89E' },
      { name: '小遣い',         pct: 8,  color: '#A4E5C5' },
      { name: '教育費',         pct: 8,  color: '#A4D8E5' },
      { name: '衣服美容費',     pct: 3,  color: '#B6BFE5' },
      { name: '日用品費',       pct: 2,  color: '#D4B6E5' },
      { name: '趣味娯楽費',     pct: 2,  color: '#E5B6D4' },
      { name: '交際費',         pct: 2,  color: '#F0C9D9' },
      { name: '医療費',         pct: 1,  color: '#E5D9B6' },
      { name: '保険料',         pct: 6,  color: '#C9E5D9' },
      { name: '嗜好品',         pct: 1,  color: '#D9D9D9' },
      { name: '貯蓄',           pct: 16, color: '#FF8FA8' },
    ],
  },
};

// 状態
let currentType = 'couple';
let chartInstance = null;

// DOM
const $income = document.getElementById('income');
const $tabs = document.querySelectorAll('.tab');
const $calcBtn = document.getElementById('calcBtn');
const $result = document.getElementById('result');
const $list = document.getElementById('categoryList');
const $chartCenter = document.getElementById('chartCenter');
const $canvas = document.getElementById('chart');

// 円フォーマット
const fmt = (n) => '¥' + Math.round(n).toLocaleString('ja-JP');

// タブ切替
$tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    $tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    currentType = tab.dataset.type;
    if (!$result.classList.contains('hidden')) {
      calculate();
    }
  });
});

// 計算ボタン
$calcBtn.addEventListener('click', () => {
  const v = parseInt($income.value, 10);
  if (!v || v <= 0) {
    $income.focus();
    $income.classList.add('shake');
    setTimeout(() => $income.classList.remove('shake'), 400);
    return;
  }
  calculate();
  // 結果までスクロール
  setTimeout(() => {
    $result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
});

// Enterキー対応
$income.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $calcBtn.click();
  }
});

function calculate() {
  const income = parseInt($income.value, 10);
  if (!income || income <= 0) return;

  const data = RATIOS[currentType];
  const items = data.items.map((item) => ({
    ...item,
    amount: income * (item.pct / 100),
  }));

  renderList(items);
  renderChart(items);
  $chartCenter.textContent = fmt(income);
  $result.classList.remove('hidden');
}

function renderList(items) {
  $list.innerHTML = items
    .map(
      (item) => `
      <li class="category-item">
        <span class="cat-color" style="background:${item.color}"></span>
        <span class="cat-name">${item.name}</span>
        <span class="cat-percent">${item.pct}%</span>
        <span class="cat-amount">${fmt(item.amount)}</span>
      </li>
    `
    )
    .join('');
}

function renderChart(items) {
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart($canvas, {
    type: 'doughnut',
    data: {
      labels: items.map((i) => i.name),
      datasets: [
        {
          data: items.map((i) => i.amount),
          backgroundColor: items.map((i) => i.color),
          borderColor: '#fff',
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#4A4A4A',
          bodyColor: '#4A4A4A',
          borderColor: '#FFB6C1',
          borderWidth: 2,
          padding: 12,
          titleFont: { family: "'Zen Maru Gothic', sans-serif", weight: 'bold' },
          bodyFont: { family: "'Zen Maru Gothic', sans-serif" },
          callbacks: {
            label: (ctx) => `${ctx.parsed.toLocaleString('ja-JP')}円（${items[ctx.dataIndex].pct}%）`,
          },
        },
      },
    },
  });
}

// 入力エラー時のシェイクアニメ
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  .shake { animation: shake 0.3s ease-in-out; }
`;
document.head.appendChild(styleEl);
