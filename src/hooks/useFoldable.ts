import { useEffect, useState } from 'react'

export type FoldState =
  | { folded: false; spanning: false }
  | { folded: true; spanning: false }
  | { folded: false; spanning: true; foldType: 'single-fold-vertical' | 'single-fold-horizontal' | 'unknown' }

export function useFoldable(): FoldState {
  const [state, setState] = useState<FoldState>({ folded: false, spanning: false })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const ratio = w / h

      // CSS Display Module Level 4 / Samsung Internet の spanning 検出
      const mqlVertical = window.matchMedia('(screen-spanning: single-fold-vertical)')
      const mqlHorizontal = window.matchMedia('(screen-spanning: single-fold-horizontal)')
      const mqlFoldVertical = window.matchMedia('(foldable: single-fold-vertical)')
      const mqlFoldHorizontal = window.matchMedia('(foldable: single-fold-horizontal)')

      if (mqlVertical.matches || mqlFoldVertical.matches) {
        setState({ folded: false, spanning: true, foldType: 'single-fold-vertical' })
        return
      }
      if (mqlHorizontal.matches || mqlFoldHorizontal.matches) {
        setState({ folded: false, spanning: true, foldType: 'single-fold-horizontal' })
        return
      }

      // フォールバック: 大画面かつ横長なら展開中、縦長または小さいなら折りたたみ
      const isLarge = w >= 600 && h >= 600
      if (isLarge && ratio >= 0.95 && ratio <= 1.25) {
        setState({ folded: false, spanning: false })
      } else if (w < 600 || h < 600) {
        setState({ folded: true, spanning: false })
      } else {
        setState({ folded: false, spanning: false })
      }
    }

    update()

    const mqls = [
      window.matchMedia('(screen-spanning: single-fold-vertical)'),
      window.matchMedia('(screen-spanning: single-fold-horizontal)'),
      window.matchMedia('(foldable: single-fold-vertical)'),
      window.matchMedia('(foldable: single-fold-horizontal)'),
    ]
    mqls.forEach((mql) => mql.addEventListener('change', update))
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      mqls.forEach((mql) => mql.removeEventListener('change', update))
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return state
}
