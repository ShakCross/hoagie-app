/**
 * App spacing system
 */

export const SPACING = {
  // Base spacing units
  xxs: 2, 
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Special purpose spacing
  sectionPadding: 16,
  screenPadding: 16,
  cardPadding: 16,
  cardMargin: 8,
  inputHeight: 56,
  buttonHeight: 48,
  buttonHeightSmall: 36,
  borderRadius: 8,
  borderRadiusSmall: 4,
  borderRadiusLarge: 16,
  iconSize: 24,
  iconSizeSmall: 18,
  iconSizeLarge: 32,
};

// Helper functions for common spacing patterns
export const getSpacing = (multiplier = 1) => SPACING.md * multiplier;

export const SHADOWS = {
  // iOS shadows
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1, // Android
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3, // Android
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6, // Android
  },
};

export default { SPACING, getSpacing, SHADOWS }; 