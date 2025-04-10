import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { COLORS } from '../../theme';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isTextArea?: boolean;
  hint?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerStyle,
  isTextArea = false,
  hint,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          isTextArea && styles.textArea,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          style
        ]}
        placeholderTextColor={COLORS.textLight}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    color: COLORS.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 5,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default FormInput; 