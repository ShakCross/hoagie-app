import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Hoagie } from '../types';
import { hoagieService } from '../services/api';
import { EditHoagieScreenProps } from '../../App';
import { ApiError } from '../types/errors';
import { COLORS } from '../theme/colors';
import Button from '../components/ui/Button';

const EditHoagieScreen: React.FC<EditHoagieScreenProps> = ({ navigation, route }) => {
  const { hoagie } = route.params;
  
  const [name, setName] = useState(hoagie.name);
  const [ingredients, setIngredients] = useState(hoagie.ingredients.join(', '));
  const [picture, setPicture] = useState(hoagie.picture || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!ingredients.trim()) {
      Alert.alert('Error', 'At least one ingredient is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Split ingredients string into an array
      const ingredientsArray = ingredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Create update data object
      const updateData = {
        name: name.trim(),
        ingredients: ingredientsArray,
        picture: picture.trim() || undefined
      };

      console.log('Updating hoagie with data:', updateData);
      
      // Call API to update the hoagie
      const updatedHoagie = await hoagieService.updateHoagie(hoagie._id, updateData);
      
      console.log('Hoagie updated successfully:', updatedHoagie);
      
      // Show success message and navigate back
      Alert.alert(
        'Success', 
        'Hoagie updated successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('HoagieDetails', { hoagie: updatedHoagie }) 
          }
        ]
      );
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Error updating hoagie:', apiError);
      setError(apiError.message || 'Failed to update hoagie');
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
        <Text style={styles.title}>Edit Hoagie</Text>
        <View style={{ width: 50 }} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Hoagie name"
        />

        <Text style={styles.label}>Ingredients (comma separated)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Bread, Ham, Cheese, etc."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Picture URL (optional)</Text>
        <TextInput
          style={styles.input}
          value={picture}
          onChangeText={setPicture}
          placeholder="Enter image URL or leave empty for placeholder"
        />
        <Text style={styles.imageHint}>
          Leave empty to use default placeholder image.
        </Text>

        <Button
          onPress={handleSave}
          label={isLoading ? "Saving..." : "Save Changes"}
          disabled={isLoading}
          loading={isLoading}
          style={styles.saveButtonCustom}
          textStyle={{ fontSize: 11 }}
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
    marginBottom: 8,
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButtonCustom: {
    backgroundColor: COLORS.secondary,
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  error: {
    color: COLORS.error,
    padding: 15,
    textAlign: 'center',
  },
  imageHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 20,
  },
});

export default EditHoagieScreen; 