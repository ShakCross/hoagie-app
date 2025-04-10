import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { Hoagie } from './src/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import SplashScreen from './src/components/ui/SplashScreen';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HoagieListScreen from './src/screens/HoagieListScreen';
import CreateHoagieScreen from './src/screens/CreateHoagieScreen';
import HoagieDetailsScreen from './src/screens/HoagieDetailsScreen';
import EditHoagieScreen from './src/screens/EditHoagieScreen';

// Define stack navigator types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  HoagieList: undefined;
  HoagieDetails: { hoagie: Hoagie };
  CreateHoagie: undefined;
  EditHoagie: { hoagie: Hoagie };
};

// Export types for screens
export type HoagieDetailsScreenProps = NativeStackScreenProps<AppStackParamList, 'HoagieDetails'>;
export type EditHoagieScreenProps = NativeStackScreenProps<AppStackParamList, 'EditHoagie'>;

// Create the navigators using the type definitions
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator initialRouteName="Login">
    <AuthStack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
    <AuthStack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ headerShown: false }} 
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator>
    <AppStack.Screen 
      name="HoagieList" 
      component={HoagieListScreen} 
      options={{ headerShown: false }} 
    />
    <AppStack.Screen
      name="CreateHoagie"
      component={CreateHoagieScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="HoagieDetails"
      component={HoagieDetailsScreen}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="EditHoagie"
      component={EditHoagieScreen}
      options={{ headerShown: false }}
    />
  </AppStack.Navigator>
);

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
