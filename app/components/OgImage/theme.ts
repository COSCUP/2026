// Shared style constants for the OG image templates (Default + Session).
// Takumi only supports inline styles, so brand colors are duplicated here.
export const OG_COLORS = {
  background: '#191733', // primary-800
  brand: '#CCC7FF', // primary-100
  muted: '#B2ABFE', // primary-200
  accent: '#3C9838', // cp-green
  text: '#ffffff',
}

// Mirrors the fonts in nuxt.config.ts; SC first for widest Han coverage.
export const OG_FONT_FAMILY = '\'Noto Sans SC\', \'Noto Sans TC\', \'Noto Sans JP\', \'Noto Sans KR\', sans-serif'

// COSCUP wordmark. viewBox/path/transform are fixed; callers set width/height.
export const OG_LOGO = {
  viewBox: '0 0 92.993 38',
  path: 'M145.315,50.538l-6.406-19.789-3.327,5.666C95.4,17.41,78.007,54.746,78.007,54.746s14.47-27.308,49.942-5.39L124.631,55ZM171,36.779,164.6,17l-3.332,5.641C121.094,3.648,103.7,40.989,103.7,40.989s14.465-27.3,49.941-5.4l-3.327,5.648Z',
  transform: 'translate(-78.007 -17)',
}

// Base card layout shared by both templates; callers add their own padding.
export const ogCardBaseStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: OG_COLORS.background,
  color: OG_COLORS.text,
  fontFamily: OG_FONT_FAMILY,
} as const
