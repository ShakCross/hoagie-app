import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Hoagie } from '../types';
import { COLORS } from '../theme/colors';

interface HoagieCardProps {
  hoagie: Hoagie;
  onPress: (hoagie: Hoagie) => void;
}

const HoagieCard: React.FC<HoagieCardProps> = ({ hoagie, onPress }) => {
  const [imageError, setImageError] = useState(false);
  
  // Function to get the image source
  const getImageSource = () => {
    if (imageError || !hoagie.picture || hoagie.picture.trim() === '') {
      // Return a hamburger image from the web
      return { uri: 'https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Big-Mac-1:1-4-product-tile-desktop' };
    }
    return { uri: hoagie.picture };
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(hoagie)}>
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.image}
          onError={() => {
            setImageError(true);
          }}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{hoagie.name}</Text>
        <Text style={styles.ingredients}>
          {hoagie.ingredients.join(', ')}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.creator}>By {hoagie.creator.name}</Text>
          <Text style={styles.comments}>{hoagie.commentCount} comments</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: 15,
    backgroundColor: COLORS.card,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.primary,
  },
  ingredients: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },
  creator: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  comments: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
});

export default HoagieCard; 