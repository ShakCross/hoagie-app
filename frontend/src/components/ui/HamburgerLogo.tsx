import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../theme/colors';

interface HamburgerLogoProps {
  width?: number;
  height?: number;
}

const HamburgerLogo: React.FC<HamburgerLogoProps> = ({ width = 80, height = 80 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Top Bun */}
      <View style={[styles.topBun, { width: width * 0.9 }]}>
        {/* Sesame Seeds */}
        <View style={[styles.seed, { top: height * 0.12, left: width * 0.2 }]} />
        <View style={[styles.seed, { top: height * 0.08, left: width * 0.35 }]} />
        <View style={[styles.seed, { top: height * 0.1, left: width * 0.5 }]} />
        <View style={[styles.seed, { top: height * 0.15, left: width * 0.65 }]} />
        <View style={[styles.seed, { top: height * 0.11, left: width * 0.8 }]} />
      </View>
      
      {/* Lettuce */}
      <View style={[styles.lettuce, { width: width * 0.8 }]} />
      
      {/* Cheese */}
      <View style={[styles.cheese, { width: width * 0.75 }]} />
      
      {/* Patty */}
      <View style={[styles.patty, { width: width * 0.7 }]} />
      
      {/* Bottom Bun */}
      <View style={[styles.bottomBun, { width: width * 0.8 }]} />
      
      {/* Logo Reference - Simplified "M" */}
      <View style={[styles.logoContainer, { width: width * 0.6 }]}>
        <Text style={styles.mcLogo}>M</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBun: {
    height: '30%',
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: 'relative',
    zIndex: 5,
  },
  seed: {
    position: 'absolute',
    width: 6,
    height: 3,
    backgroundColor: '#FFF8E1',
    borderRadius: 2,
  },
  lettuce: {
    height: '10%',
    backgroundColor: '#00AA00',
    marginTop: -5,
    zIndex: 4,
  },
  cheese: {
    height: '10%',
    backgroundColor: COLORS.secondary,
    marginTop: -3,
    zIndex: 3,
  },
  patty: {
    height: '15%',
    backgroundColor: COLORS.primary,
    marginTop: -3,
    zIndex: 2,
  },
  bottomBun: {
    height: '20%',
    backgroundColor: COLORS.secondary,
    marginTop: -3,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcLogo: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default HamburgerLogo; 