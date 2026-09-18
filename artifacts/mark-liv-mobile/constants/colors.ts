/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#e9f7ff',
    tint: '#59edff',
    background: '#050b14',
    foreground: '#e9f7ff',
    card: '#0c1724',
    cardForeground: '#e9f7ff',
    primary: '#59edff',
    primaryForeground: '#051018',
    secondary: '#151c35',
    secondaryForeground: '#d8d5ff',
    muted: '#101d2d',
    mutedForeground: '#8192a9',
    accent: '#9f8cff',
    accentForeground: '#ffffff',
    destructive: '#ff6b81',
    destructiveForeground: '#ffffff',
    border: '#1d3247',
    input: '#122235',
  },
  radius: 20,
};

export default colors;
