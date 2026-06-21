import type { ImgHTMLAttributes } from 'vue'

declare module 'vue' {
  // NuxtImg 的部分 HTML 屬性無法正確透傳，比如 alt 屬性、@click 事件，
  // 導致在啟用 strictTemplates 的情況下，typecheck 會失敗。
  // 因此，這裡先給所有元件 extend ImgHTMLAttributes，避免報錯。
  // 這也是 vue-tsc 上現在唯一比較簡單的 workaround。
  //
  // Error example:
  //    error TS2353: Object literal may only specify known properties,
  //    and 'alt' does not exist in type '{ ... } & VNodeProps & Allowed
  //    ComponentProps & ComponentCusto...'.
  interface ComponentCustomProps extends ImgHTMLAttributes {}
}
