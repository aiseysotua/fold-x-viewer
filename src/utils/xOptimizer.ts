export interface OptimizerOptions {
  fontScale: number
  columnMode: 'auto' | 'single' | 'dual'
  wideMargins: boolean
  hideTrends: boolean
  hideWhoToFollow: boolean
  compactNav: boolean
  darkMode: boolean
}

export const defaultOptions: OptimizerOptions = {
  fontScale: 1.05,
  columnMode: 'auto',
  wideMargins: true,
  hideTrends: false,
  hideWhoToFollow: false,
  compactNav: true,
  darkMode: true,
}

function makeBaseCSS(opts: OptimizerOptions): string {
  const columnCSS =
    opts.columnMode === 'dual' || opts.columnMode === 'auto'
      ? `
    /* 大画面で中央カラムを固定幅にし、左右余白を広げる */
    @media (min-width: 1100px) {
      main, [data-testid="primaryColumn"], .r-1ye8kvj {
        max-width: 720px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
    @media (min-width: 1600px) and (min-aspect-ratio: 1/1) {
      /* 超ワイド画面では2カラム風の余白 */
      main, [data-testid="primaryColumn"] {
        margin-left: 5vw !important;
      }
    }
`
      : `
    main, [data-testid="primaryColumn"] {
      max-width: 640px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
`

  return `
/* Fold X Viewer Optimizer for x.com */
:root {
  --fold-x-font-scale: ${opts.fontScale.toFixed(2)};
  --fold-x-wide-margin: ${opts.wideMargins ? '24px' : '0px'};
}

html, body {
  font-size: calc(15px * var(--fold-x-font-scale)) !important;
  line-height: 1.55 !important;
  -webkit-text-size-adjust: 100% !important;
}

/* ツイート本文を少し大きく */
article [data-testid="tweetText"],
article [lang] {
  font-size: calc(1rem * var(--fold-x-font-scale)) !important;
  line-height: 1.6 !important;
}

/* ユーザー名・IDの可読性向上 */
article a[href^="/"] {
  font-size: calc(0.95rem * var(--fold-x-font-scale)) !important;
}

/* ボタン類のタップ領域拡大 */
article [role="button"],
article button,
header [role="button"] {
  min-height: 40px !important;
  min-width: 40px !important;
}

${columnCSS}

${
  opts.compactNav
    ? `
/* ナビゲーションをコンパクトに */
header nav [role="tablist"] a,
header nav [role="tab"] {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
`
    : ''
}

${
  opts.hideTrends
    ? `
/* トレンドを非表示 */
[aria-label*="Trending" i],
[aria-label*="トレンド" i],
[data-testid="sidebarColumn"] > div > div:nth-child(2) {
  display: none !important;
}
`
    : ''
}

${
  opts.hideWhoToFollow
    ? `
/* おすすめユーザーを非表示 */
[aria-label*="Who to follow" i],
[aria-label*="おすすめユーザー" i],
[data-testid="UserCell"] {
  display: none !important;
}
`
    : ''
}

/* 折りたたみ（狭画面）では全幅を有効活用 */
@media (max-width: 360px) {
  main, [data-testid="primaryColumn"] {
    max-width: 100% !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

/* Flex Mode 対応: 半分折りたたみ時 */
@media (screen-spanning: single-fold-horizontal) {
  main, [data-testid="primaryColumn"] {
    max-width: 100% !important;
    padding-bottom: env(fold-bottom, 0px) !important;
  }
}

@media (screen-spanning: single-fold-vertical) {
  main, [data-testid="primaryColumn"] {
    margin-left: env(fold-left, 0px) !important;
    margin-right: env(fold-right, 0px) !important;
  }
}

/* ダークモード強制 */
${
  opts.darkMode
    ? `
html { color-scheme: dark !important; }
`
    : ''
}
`.trim()
}

export function generateUserCSS(opts: OptimizerOptions): string {
  return makeBaseCSS(opts)
}

export function generateBookmarklet(opts: OptimizerOptions): string {
  const css = makeBaseCSS(opts).replace(/`/g, '\\`').replace(/\\n/g, '\\\\n')
  const js = `
(function(){
  const id = 'fold-x-style';
  let s = document.getElementById(id);
  if (!s) {
    s = document.createElement('style');
    s.id = id;
    document.head.appendChild(s);
  }
  s.textContent = \`${css}\`;
})();
  `.trim()
  return `javascript:${encodeURIComponent(js)}`
}

export function generateStylusUrl(opts: OptimizerOptions): string {
  const css = makeBaseCSS(opts)
  const header = `/* ==UserStyle==
@name           Fold X Viewer for x.com
@namespace      fold-x-viewer
@version        1.0.0
@description    Galaxy Z Fold 7向けX.com最適化CSS
@author         Fold X Viewer
@match          https://x.com/*
@match          https://twitter.com/*
==/UserStyle== */

`
  return 'data:text/css;charset=utf-8,' + encodeURIComponent(header + css)
}
