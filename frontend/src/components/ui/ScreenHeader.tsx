import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../theme';
import Button from './Button';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  rightContent,
  style
}) => {
  return (
    <View style={[styles.header, style]}>
      {onBack ? (
        <Button
          onPress={onBack}
          label="← Back"
          variant="text"
          textStyle={styles.backButton}
          style={{ padding: 0, minWidth: 0 }}
        />
      ) : (
        <View style={{ width: 60 }} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        {rightContent || <View style={{ width: 60 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: 'bold',
    minWidth: 60,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
});

export default ScreenHeader; 