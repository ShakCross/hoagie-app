import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';
import { ApiError } from '../types/errors';
import { COLORS } from '../theme/colors';
import Button from '../components/ui/Button';
import HamburgerLogo from '../components/ui/HamburgerLogo';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error, user } = useAuth();

  // Log authentication state whenever it changes
  useEffect(() => {
    console.log('LoginScreen - Auth state changed:', { user, isAuthenticated: !!user });
  }, [user]);

  const handleLogin = async () => {
    console.log('Starting login with:', { email, password });
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      console.log('Login successful');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Login error:', apiError);
      // Error is already handled in the auth hook
    }
  };

  // For testing - simple test account login
  const handleTestLogin = async () => {
    const testCredentials = { 
      email: 'test@example.com', 
      password: 'test123' 
    };
    
    try {
      console.log('Attempting test login with:', testCredentials);
      
      // Set the input fields to match test credentials
      setEmail(testCredentials.email);
      setPassword(testCredentials.password);
      
      // Try to login with the test account
      await login(testCredentials);
      console.log('Test login successful!');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Test login failed:', apiError);
      
      Alert.alert(
        'Test Login Failed', 
        'Could not log in with the test account. Please check that the backend is running and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <HamburgerLogo width={120} height={120} />
      </View>
      <Text style={styles.title}>Welcome to Hoagie App</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      
      {user && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Current User:</Text>
          <Text>ID: {user._id || 'missing'}</Text>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        onPress={handleLogin}
        label={isLoading ? "Logging in..." : "Login"}
        disabled={isLoading}
        loading={isLoading}
        style={styles.buttonCustom}
        textStyle={{ fontSize: 11 }}
      />

      <Button
        onPress={handleTestLogin}
        label="Use Test Account"
        variant="secondary"
        style={styles.testButtonCustom}
        textStyle={{ fontSize: 11 }}
      />

      <Button
        onPress={() => navigation.navigate('Register')}
        label="Don't have an account? Register"
        variant="text"
        textStyle={styles.registerText}
        style={{ alignSelf: 'center' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  buttonCustom: {
    backgroundColor: COLORS.primary,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    minHeight: 48,
    justifyContent: 'center',
  },
  testButtonCustom: {
    backgroundColor: COLORS.secondary,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    minHeight: 48,
    justifyContent: 'center',
  },
  registerText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  error: {
    color: COLORS.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  debugInfo: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: COLORS.accentLight,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen; 