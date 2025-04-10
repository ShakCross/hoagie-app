import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
}) => {
  // Animation
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Determine button styles based on variant and size
  const getButtonStyles = () => {
    const buttonStyles: ViewStyle[] = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        buttonStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        buttonStyles.push(styles.outlineButton);
        break;
      case 'text':
        buttonStyles.push(styles.textButton);
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.smallButton);
        break;
      case 'large':
        buttonStyles.push(styles.largeButton);
        break;
    }
    
    // Disabled style
    if (disabled) {
      buttonStyles.push(styles.disabledButton);
    }
    
    return buttonStyles;
  };
  
  // Determine text styles based on variant and size
  const getTextStyles = () => {
    const textStyles: TextStyle[] = [styles.buttonText];
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryButtonText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryButtonText);
        break;
      case 'outline':
        textStyles.push(styles.outlineButtonText);
        break;
      case 'text':
        textStyles.push(styles.textButtonText);
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.smallButtonText);
        break;
      case 'large':
        textStyles.push(styles.largeButtonText);
        break;
    }
    
    // Disabled text style
    if (disabled) {
      textStyles.push(styles.disabledButtonText);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.6}
      disabled={disabled || loading}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ zIndex: 999 }}
    >
      <Animated.View
        style={[
          getButtonStyles(),
          style,
          { transform: [{ scale }] },
        ]}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white} 
            size="small" 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text 
              style={[getTextStyles(), textStyle]} 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {label}
            </Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SPACING.borderRadius,
    minWidth: 100,
  } as ViewStyle,
  primaryButton: {
    backgroundColor: COLORS.primary,
    minHeight: 48,
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    minHeight: 48,
  } as ViewStyle,
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  } as ViewStyle,
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 'auto',
  } as ViewStyle,
  smallButton: {
    height: SPACING.buttonHeightSmall,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    minWidth: 80,
  } as ViewStyle,
  largeButton: {
    height: SPACING.buttonHeight + SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,
  disabledButton: {
    opacity: 0.6,
  } as ViewStyle,
  buttonText: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 1,
  } as TextStyle,
  primaryButtonText: {
    color: COLORS.white,
  } as TextStyle,
  secondaryButtonText: {
    color: COLORS.white,
  } as TextStyle,
  outlineButtonText: {
    color: COLORS.primary,
  } as TextStyle,
  textButtonText: {
    color: COLORS.primary,
  } as TextStyle,
  smallButtonText: {
    ...TYPOGRAPHY.buttonSmall,
  } as TextStyle,
  largeButtonText: {
    fontSize: 16,
  } as TextStyle,
  disabledButtonText: {
    // No specific changes needed as the button's opacity is reduced
  } as TextStyle,
});

export default Button; 