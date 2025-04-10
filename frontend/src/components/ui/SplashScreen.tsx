import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/colors';
import HamburgerLogo from './HamburgerLogo';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <HamburgerLogo width={180} height={180} />
      </View>
      <Text style={styles.title}>Hoagie App</Text>
      <Text style={styles.subtitle}>Delicious hoagies!</Text>
      <ActivityIndicator 
        style={styles.loading} 
        size="large" 
        color={COLORS.secondary} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    marginBottom: 40,
  },
  loading: {
    marginTop: 20,
  }
});

export default SplashScreen; 