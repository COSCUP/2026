export function isMarkdown(text: string): boolean {
  return /\[.+?\]\(.+?\)/.test(text)
}
