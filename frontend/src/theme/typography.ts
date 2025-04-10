/**
 * App typography styles
 */

export const FONTS = {
  // Font families
  primary: 'Poppins-Regular',
  primaryBold: 'Poppins-Bold',
  primarySemiBold: 'Poppins-SemiBold',
  primaryMedium: 'Poppins-Medium',
  primaryLight: 'Poppins-Light',
  primaryItalic: 'Poppins-Italic',

  // Default system fonts (fallback)
  system: 'System',
  systemBold: 'System-Bold',
  systemItalic: 'System-Italic',
};

export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontFamily: FONTS.primaryBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0.2,
  },
  h2: {
    fontFamily: FONTS.primaryBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.2,
  },
  h3: {
    fontFamily: FONTS.primaryBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  h4: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  h5: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.2,
  },

  // Body text
  bodyLarge: {
    fontFamily: FONTS.primary,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: FONTS.primary,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: FONTS.primary,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.2,
  },

  // Buttons
  button: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  buttonSmall: {
    fontFamily: FONTS.primarySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Labels
  label: {
    fontFamily: FONTS.primaryMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  labelSmall: {
    fontFamily: FONTS.primaryMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.15,
  },

  // Other
  caption: {
    fontFamily: FONTS.primary,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: FONTS.primaryMedium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

export default { FONTS, TYPOGRAPHY }; 