import { useEffect, useMemo, useState } from 'react'
import { useFoldable } from './hooks/useFoldable'
import {
  defaultOptions,
  generateBookmarklet,
  generateStylusUrl,
  generateUserCSS,
  type OptimizerOptions,
} from './utils/xOptimizer'
import './App.css'

const STORAGE_KEY = 'fold-x-options-v1'

function loadOptions(): OptimizerOptions {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultOptions, ...JSON.parse(raw) } : defaultOptions
  } catch {
    return defaultOptions
  }
}

function saveOptions(opts: OptimizerOptions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opts))
}

function App() {
  const fold = useFoldable()
  const [opts, setOpts] = useState<OptimizerOptions>(loadOptions)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    saveOptions(opts)
  }, [opts])

  const userCSS = useMemo(() => generateUserCSS(opts), [opts])
  const bookmarklet = useMemo(() => generateBookmarklet(opts), [opts])
  const stylusUrl = useMemo(() => generateStylusUrl(opts), [opts])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied('コピー失敗')
    }
  }

  const deviceLabel = fold.spanning
    ? fold.foldType === 'single-fold-vertical'
      ? '📱 縦折り / Flex Mode'
      : '📱 横折り / Flex Mode'
    : fold.folded
      ? '📱 折りたたみ（Cover Screen）'
      : '📱 展開中（Main Screen）'

  const update = <K extends keyof OptimizerOptions>(key: K, value: OptimizerOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="logo">X</div>
        <h1>Fold X Viewer</h1>
        <p className="tagline">Galaxy Z Fold 7向け X.com 最適化アプリ</p>
        <div className="device-badge">{deviceLabel}</div>
      </header>

      <main className="grid">
        <section className="card primary">
          <h2>🚀 X.com を開く</h2>
          <p>PWAスタンドアロン状態でX.comを開きます。アドレスバーが非表示になり、画面全体を有効活用できます。</p>
          <a
            className="button big"
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            X.com を開く
          </a>
          <p className="hint">
            開いた後は、下記のブックマークレットを実行すると最適化CSSが適用されます。
          </p>
        </section>

        <section className="card">
          <h2>⚡ ブックマークレット</h2>
          <p>ブラウザのブックマークに登録して、X.comを開いたらタップしてください。</p>
          <div className="button-row">
            <button
              className="button"
              onClick={() => copyToClipboard(bookmarklet, 'ブックマークレットをコピーしました')}
            >
              ブックマークレットをコピー
            </button>
            <a className="button outline" href={bookmarklet}>
              今すぐ試す
            </a>
          </div>
          {copied && <p className="toast">{copied}</p>}
        </section>

        <section className="card">
          <h2>🎨 Stylus / UserCSS</h2>
          <p>Stylus拡張機能にインポートすると、X.comを開くたびに自動適用されます。</p>
          <div className="button-row">
            <button
              className="button"
              onClick={() => copyToClipboard(userCSS, 'CSSをコピーしました')}
            >
              CSSをコピー
            </button>
            <a className="button outline" href={stylusUrl} download="fold-x-viewer.user.css">
              Stylus用ファイルを保存
            </a>
          </div>
        </section>

        <section className="card settings">
          <h2>⚙️ 表示設定</h2>

          <label className="field">
            <span>文字サイズ</span>
            <input
              type="range"
              min="0.9"
              max="1.4"
              step="0.05"
              value={opts.fontScale}
              onChange={(e) => update('fontScale', parseFloat(e.target.value))}
            />
            <span className="value">{opts.fontScale.toFixed(2)}x</span>
          </label>

          <label className="field">
            <span>レイアウト</span>
            <select
              value={opts.columnMode}
              onChange={(e) => update('columnMode', e.target.value as OptimizerOptions['columnMode'])}
            >
              <option value="auto">自動（Fold展開時に最適化）</option>
              <option value="single">1カラム</option>
              <option value="dual">2カラム風余白</option>
            </select>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={opts.wideMargins}
              onChange={(e) => update('wideMargins', e.target.checked)}
            />
            <span>左右余白を広くする</span>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={opts.compactNav}
              onChange={(e) => update('compactNav', e.target.checked)}
            />
            <span>ナビゲーションをコンパクトに</span>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={opts.hideTrends}
              onChange={(e) => update('hideTrends', e.target.checked)}
            />
            <span>トレンドを非表示</span>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={opts.hideWhoToFollow}
              onChange={(e) => update('hideWhoToFollow', e.target.checked)}
            />
            <span>おすすめユーザーを非表示</span>
          </label>

          <label className="field checkbox">
            <input
              type="checkbox"
              checked={opts.darkMode}
              onChange={(e) => update('darkMode', e.target.checked)}
            />
            <span>ダークモード強制</span>
          </label>
        </section>
      </main>

      <footer>
        <p>Fold X Viewer — Galaxy Z Fold 7 向け</p>
        <p className="small">
          設定はブラウザに保存されます。ブックマークレットはX.comの画面上で実行してください。
        </p>
      </footer>
    </div>
  )
}

export default App
