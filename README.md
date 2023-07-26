# elem-smooth-placer
HTMLの要素を移動アニメーション付きで挿入/入替えする、JavaScript/TypeScript用staticクラスを提供します。

## 使い方
1. 使用したいjs, tsファイルでインポートする。
   ```
   例）import ElemSmoothPlacer from './elem-smooth-placer.js'
   ```
3. insertメソッド、swapメソッドを実行する。
   ```
   // fromをtoの前, 後, 先頭, 後尾に挿入する
   ElemSmoothPlacer.insert({
      from: 移動元HTMLElement,
      to: 移動先HTMLElement,
      position: fromの配置位置※,
      duration: アニメーション完了までの時間(ms)
   })
   ※toの前後：'before', 'after'（主にリスト要素内の項目要素に対して使用）
   ※toの内部の先頭後尾：'begin', 'end'（主に子要素が存在しないリスト要素に対して使用）
   ```
   ```
   // fromとtoを入れ替える
   ElemSmoothPlacer.swap({
      from: 移動元HTMLElement,
      to: 移動先HTMLElement,
      duration: アニメーション完了までの時間(ms)
   })
   ```
