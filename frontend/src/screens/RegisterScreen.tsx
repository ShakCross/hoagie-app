import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';
import { COLORS } from '../theme/colors';
import Button from '../components/ui/Button';
import HamburgerLogo from '../components/ui/HamburgerLogo';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password });
    } catch (error) {
      // Error is already handled in the auth hook
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <HamburgerLogo width={120} height={120} />
      </View>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Hoagie community</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        onPress={handleRegister}
        label={isLoading ? "Registering..." : "Register"}
        disabled={isLoading}
        loading={isLoading}
        style={styles.buttonCustom}
        textStyle={{ fontSize: 11 }}
      />

      <Button
        onPress={() => navigation.navigate('Login')}
        label="Already have an account? Login"
        variant="text"
        textStyle={styles.loginText}
        style={{ alignSelf: 'center' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loginText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  error: {
    color: COLORS.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default RegisterScreen; 