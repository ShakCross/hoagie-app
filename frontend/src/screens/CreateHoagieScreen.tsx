import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { hoagieService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../App';
import { ApiError } from '../types/errors';
import { COLORS } from '../theme/colors';
import Button from '../components/ui/Button';

type CreateHoagieScreenProps = NativeStackScreenProps<AppStackParamList, 'CreateHoagie'>;

const CreateHoagieScreen: React.FC<CreateHoagieScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [picture, setPicture] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCreateHoagie = async () => {
    if (!name || !ingredients) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user?._id) {
      Alert.alert('Error', 'User information not available. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Split ingredients string by commas into an array
      const ingredientsArray = ingredients.split(',').map(item => item.trim());
      
      const newHoagie = await hoagieService.createHoagie({
        name,
        ingredients: ingredientsArray,
        picture: picture || undefined,
        creator: user._id
      });
      
      Alert.alert('Success', 'Hoagie created successfully! The list will refresh when you return.', [
        { text: 'Back to List', onPress: () => navigation.navigate('HoagieList') }
      ]);
    } catch (err: unknown) {
      let errorMessage = 'Failed to create hoagie';
      
      const apiError = err as ApiError;
      
      if (apiError.response) {
        errorMessage = apiError.response.data?.message || errorMessage;
      } else if (apiError.request) {
        errorMessage = 'Network error - could not connect to server';
      } else {
        errorMessage = apiError.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          onPress={() => navigation.goBack()}
          label="← Back"
          variant="text"
          textStyle={styles.backButton}
          style={{ padding: 0, minWidth: 0 }}
        />
        <Text style={styles.title}>Create New Hoagie</Text>
        <View style={{ width: 50 }} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter hoagie name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.textLight}
        />

        <Text style={styles.label}>Ingredients * (comma separated)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Bread, Ham, Cheese, Lettuce"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.textLight}
        />

        <Text style={styles.label}>Image URL (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL or leave empty for placeholder"
          value={picture}
          onChangeText={setPicture}
          placeholderTextColor={COLORS.textLight}
        />
        <Text style={styles.imageHint}>
          Leave empty to burger placeholder image.
        </Text>

        <Button
          onPress={handleCreateHoagie}
          label="Create Hoagie"
          disabled={isLoading}
          loading={isLoading}
          style={styles.submitButton}
          textStyle={{ fontSize: 11, fontWeight: 'bold' }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 15,
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    minHeight: 48,
    justifyContent: 'center',
  },
  error: {
    color: COLORS.error,
    margin: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default CreateHoagieScreen; 