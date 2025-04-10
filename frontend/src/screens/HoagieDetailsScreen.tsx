import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, FlatList, ImageSourcePropType } from 'react-native';
import { Hoagie, Comment, User } from '../types';
import { hoagieService, commentService } from '../services/api';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { HoagieDetailsScreenProps } from '../../App';
import CommentItem from '../components/CommentItem';
import Button from '../components/ui/Button';
import { COLORS } from '../theme/colors';

const HoagieDetailsScreen: React.FC<HoagieDetailsScreenProps> = ({ navigation, route }) => {
  const [hoagie, setHoagie] = useState<Hoagie>(route.params.hoagie);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [collaboratorModalVisible, setCollaboratorModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState<boolean>(false);
  const { user } = useAuth();
  const [imageError, setImageError] = useState<boolean>(false);

  // Memoize creator and collaborator checks to prevent unnecessary recalculations
  const isCreator = useMemo(() => {
    return user?._id === hoagie.creator._id;
  }, [user, hoagie]);
  
  // Check if current user is a collaborator
  const isCollaborator = useMemo<boolean>(() => {
    if (!user || !hoagie) return false;
    const collaborators = hoagie.collaborators || [];
    return collaborators.some(collaborator => collaborator._id === user._id);
  }, [user?._id, hoagie?.collaborators]);

  // Check if user has edit permissions (creator or collaborator)
  const hasEditPermission = useMemo<boolean>(() => {
    return isCreator || isCollaborator;
  }, [isCreator, isCollaborator]);
  
  // Fetch comments - only include id in dependencies
  const fetchComments = useCallback(async (): Promise<void> => {
    if (!hoagie?._id) return;
    
    try {
      setLoadingComments(true);
      const commentsData = await commentService.getComments(hoagie._id);
      setComments(commentsData.items);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  }, [hoagie?._id]);

  // Function to get the image source - memoize to prevent recreation on renders
  const getImageSource = useMemo<ImageSourcePropType>(() => {
    if (imageError || !hoagie.picture || hoagie.picture.trim() === '') {
      // Return a hamburger image from the web
      return { uri: 'https://s7d1.scene7.com/is/image/mcdonalds/t-mcdonalds-Big-Mac-1:1-4-product-tile-desktop' };
    }
    
    return { uri: hoagie.picture };
  }, [hoagie.picture, imageError]);

  // Format date for comments display - memoize the function
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Refresh hoagie data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchHoagieDetails = async (): Promise<void> => {
        if (!route.params.hoagie?._id) return;
        try {
          setRefreshing(true);
          const updatedHoagie = await hoagieService.getHoagie(route.params.hoagie._id);
          setHoagie(updatedHoagie);
          
          // Fetch comments after hoagie data is refreshed
          await fetchComments();
        } catch (error) {
          console.error('Error refreshing hoagie details:', error);
        } finally {
          setRefreshing(false);
        }
      };

      fetchHoagieDetails();
    }, [route.params.hoagie?._id, fetchComments])
  );

  // Reset image error state when hoagie changes
  useEffect(() => {
    setImageError(false);
  }, [hoagie]);

  const handleEditPress = useCallback(() => {
    navigation.navigate('EditHoagie', { hoagie });
  }, [hoagie, navigation]);

  const handleDeleteHoagie = useCallback(() => {
    Alert.alert(
      "Delete Hoagie",
      "Are you sure you want to delete this hoagie?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: confirmDeleteHoagie
        }
      ]
    );
  }, []);

  const confirmDeleteHoagie = useCallback(async () => {
    if (!hoagie._id) return;
    
    try {
      setIsDeleting(true);
      await hoagieService.deleteHoagie(hoagie._id);
      setIsDeleting(false);
      Alert.alert("Success", "Hoagie was deleted successfully");
      navigation.navigate('HoagieList');
    } catch (error) {
      setIsDeleting(false);
      Alert.alert("Error", "Failed to delete hoagie");
      console.error(error);
    }
  }, [hoagie._id, navigation]);

  const handleAddComment = useCallback((): void => {
    setCommentText('');
    setCommentModalVisible(true);
  }, []);

  const handleSubmitComment = async (): Promise<void> => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to comment');
      return;
    }

    setIsSubmitting(true);

    try {
      await commentService.createComment({
        text: commentText.trim(),
        user: user._id,
        hoagie: hoagie._id
      });

      // Refresh hoagie data to update comment count
      const updatedHoagie = await hoagieService.getHoagie(hoagie._id);
      setHoagie(updatedHoagie);
      
      // Refresh comments
      await fetchComments();
      
      setCommentModalVisible(false);
      setCommentText('');
      Alert.alert('Success', 'Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding collaborators
  const handleAddCollaborator = useCallback(async (collaborator: User) => {
    if (!hoagie._id || !collaborator._id || !user?._id) return;
    
    try {
      setIsAddingCollaborator(true);
      await hoagieService.addCollaborator(hoagie._id, collaborator._id, user._id);
      
      // Update hoagie with new collaborator
      const updatedHoagie = await hoagieService.getHoagie(hoagie._id);
      setHoagie(updatedHoagie);
      
      setCollaboratorModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);
      setIsAddingCollaborator(false);
    } catch (error) {
      setIsAddingCollaborator(false);
      Alert.alert("Error", "Failed to add collaborator");
      console.error(error);
    }
  }, [hoagie._id, user?._id]);

  // Search for users
  const handleSearchUsers = async (query: string): Promise<void> => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      
      let users: User[] = [];
      try {
        // Try to use the real API
        users = await hoagieService.searchUsers(query);
        console.log(`Found ${users.length} users from API matching "${query}"`);
      } catch (searchError) {
        console.error('Search API failed, using fallback:', searchError);
        
        // Fall back to mock data if the API fails
        const mockUsers: User[] = [
          { _id: 'user1', name: 'Test User', email: 'test@example.com', createdAt: '', updatedAt: '' },
          { _id: 'user2', name: 'Andre User', email: 'andre@example.com', createdAt: '', updatedAt: '' },
          { _id: 'user3', name: 'Alice Smith', email: 'alice@example.com', createdAt: '', updatedAt: '' },
          { _id: 'user4', name: 'Bob Johnson', email: 'bob@example.com', createdAt: '', updatedAt: '' },
        ];
        
        // Filter mock users by name
        users = mockUsers.filter(mockUser => 
          mockUser.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log(`Using mock data - found ${users.length} mock users matching "${query}"`);
      }
      
      // Ensure hoagie.collaborators exists before trying to use it
      const collaborators = hoagie.collaborators || [];
      
      // Filter out creator and existing collaborators
      const filteredUsers = users.filter((searchUser: User) => 
        searchUser._id !== hoagie.creator._id && 
        !collaborators.some(collaborator => collaborator._id === searchUser._id)
      );
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error during user search:', error);
      Alert.alert('Error', 'Failed to search for users. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle removing a collaborator - memoize to prevent recreating on render
  const handleRemoveCollaborator = useCallback(async (collaboratorId: string) => {
    if (!hoagie._id || !user?._id) return;
    
    try {
      await hoagieService.removeCollaborator(hoagie._id, collaboratorId, user._id);
      
      // Update hoagie without removed collaborator
      const updatedHoagie = await hoagieService.getHoagie(hoagie._id);
      setHoagie(updatedHoagie);
    } catch (error) {
      Alert.alert("Error", "Failed to remove collaborator");
      console.error(error);
    }
  }, [hoagie._id, user?._id]);

  // Render collaborators section only if there are collaborators
  const collaboratorsSection = useMemo(() => {
    if (!hoagie?.collaborators?.length) return null;
    
    return (
      <View style={styles.collaboratorsSection}>
        <Text style={styles.collaboratorsLabel}>Collaborators:</Text>
        <View style={styles.collaboratorsList}>
          {hoagie.collaborators.map((collaborator) => (
            <View key={collaborator._id} style={styles.collaboratorItem}>
              <Text style={styles.collaboratorName}>{collaborator.name}</Text>
              {isCreator && (
                <TouchableOpacity 
                  onPress={() => handleRemoveCollaborator(collaborator._id)}
                  style={styles.removeCollaboratorButton}
                >
                  <Text style={styles.removeCollaboratorText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  }, [hoagie?.collaborators, isCreator, handleRemoveCollaborator]);

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
        <Text style={styles.title}>Hoagie Details</Text>
        <View style={styles.headerActions}>
          {hasEditPermission && (
            <Button
              onPress={handleEditPress}
              label="Edit"
              variant="text"
              textStyle={styles.actionButton}
              style={styles.headerButton}
            />
          )}
          {isCreator && (
            <>
              <Button
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setCollaboratorModalVisible(true);
                }}
                label="Collab"
                variant="text"
                textStyle={styles.collaborateButton}
                style={styles.headerButton}
              />
              <Button
                onPress={handleDeleteHoagie}
                label="Delete"
                variant="text"
                textStyle={styles.collaborateButton}
                style={{...styles.headerButton, marginLeft: 10}}
              />
            </>
          )}
        </View>
      </View>
      
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Deleting...</Text>
        </View>
      )}
      
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource}
          style={styles.image}
          onError={() => {
            console.log('Image failed to load, setting error state');
            setImageError(true);
          }}
        />
        {/* {(imageError || !hoagie.picture || hoagie.picture.trim() === '') && (
          <View style={styles.placeholderOverlay}>
            <Text style={styles.placeholderText}>Hoagie</Text>
          </View>
        )} */}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.hoagieName}>{hoagie.name}</Text>
        
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorLabel}>Created by:</Text>
          <Text style={styles.creatorName}>{hoagie.creator.name}</Text>
        </View>
        
        {collaboratorsSection}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <View style={styles.ingredientsList}>
            {hoagie.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>• {ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comments:</Text>
            <Button
              onPress={handleAddComment}
              label="Add Comment"
              variant="secondary"
              style={styles.addCommentButtonCustom}
              textStyle={{ fontSize: 11 }}
            />
          </View>
          <Text style={styles.commentCount}>
            {hoagie.commentCount === 0 
              ? 'No comments yet.' 
              : `${hoagie.commentCount} comment${hoagie.commentCount !== 1 ? 's' : ''}`}
          </Text>
          
          {/* Comments list */}
          {loadingComments ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 10 }} />
          ) : comments.length > 0 ? (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </View>
          ) : null}
        </View>
        
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Created: {new Date(hoagie.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.metadataText}>
            Last updated: {new Date(hoagie.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Comment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Comment</Text>
            
            <TextInput
              style={styles.commentInput}
              placeholder="Write your comment here..."
              multiline
              numberOfLines={4}
              value={commentText}
              onChangeText={setCommentText}
            />
            
            <View style={styles.modalButtons}>
              <Button
                onPress={() => setCommentModalVisible(false)}
                label="Cancel"
                variant="outline"
                disabled={isSubmitting}
                style={styles.modalButtonCustom}
                textStyle={{ fontSize: 11 }}
              />
              
              <Button
                onPress={handleSubmitComment}
                label={isSubmitting ? 'Submitting...' : 'Submit'}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.modalButtonCustom}
                textStyle={{ fontSize: 11 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Collaborator Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={collaboratorModalVisible}
        onRequestClose={() => setCollaboratorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Collaborator</Text>
              <TouchableOpacity onPress={() => setCollaboratorModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search users by name..."
              value={searchQuery}
              onChangeText={handleSearchUsers}
              autoCapitalize="none"
            />
            
            {isSearching ? (
              <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id}
                style={styles.searchResults}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.searchResultItem}
                    onPress={() => handleAddCollaborator(item)}
                    disabled={isAddingCollaborator}
                  >
                    <Text style={styles.searchResultName}>{item.name}</Text>
                    <Text style={styles.searchResultEmail}>{item.email}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : searchQuery.length >= 2 ? (
              <Text style={styles.noResultsText}>No users found</Text>
            ) : null}
            
            {isAddingCollaborator && (
              <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
            )}
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 110,
    flexWrap: 'nowrap',
  },
  headerButton: {
    marginLeft: 5,
    padding: 0,
    minWidth: 0,
  },
  actionButton: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  deleteButton: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  collaborateButton: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  collaboratorsSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.accentLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  collaboratorsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.primary,
  },
  collaboratorsList: {
    marginTop: 5,
  },
  collaboratorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  collaboratorName: {
    fontSize: 15,
    color: COLORS.text,
  },
  removeCollaboratorButton: {
    padding: 5,
  },
  removeCollaboratorText: {
    fontSize: 20,
    color: COLORS.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 10,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.primary,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  searchResults: {
    marginTop: 20,
    maxHeight: 300,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: COLORS.accentLight,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchResultEmail: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 3,
  },
  noResultsText: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.textLight,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: 20,
  },
  hoagieName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primary,
  },
  creatorInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  creatorLabel: {
    color: COLORS.textLight,
    marginRight: 5,
  },
  creatorName: {
    fontWeight: '500',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addCommentButtonCustom: {
    marginVertical: 10,
    backgroundColor: COLORS.secondary,
  },
  ingredientsList: {
    marginLeft: 10,
  },
  ingredientItem: {
    marginBottom: 5,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.secondary,
    paddingLeft: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: COLORS.text,
  },
  commentCount: {
    fontStyle: 'italic',
    color: COLORS.textLight,
    marginBottom: 10,
  },
  commentsList: {
    marginTop: 10,
  },
  commentItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  metadata: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.accentLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.primary,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: COLORS.accentLight,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCustom: {
    minWidth: 120,
    marginHorizontal: 10,
  },
});

export default HoagieDetailsScreen; 