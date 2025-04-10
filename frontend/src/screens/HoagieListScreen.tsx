import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { Hoagie } from '../types';
import { hoagieService } from '../services/api';
import HoagieCard from '../components/HoagieCard';
import { useAuth } from '../hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../App';
import { ApiError } from '../types/errors';
import Button from '../components/ui/Button';
import { COLORS } from '../theme/colors';

type HoagieListScreenProps = NativeStackScreenProps<AppStackParamList, 'HoagieList'>;

const HoagieListScreen: React.FC<HoagieListScreenProps> = ({ navigation }) => {
  const [hoagies, setHoagies] = useState<Hoagie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [userHoagiesModalVisible, setUserHoagiesModalVisible] = useState(false);
  const [userHoagies, setUserHoagies] = useState<Hoagie[]>([]);
  const [loadingUserHoagies, setLoadingUserHoagies] = useState(false);
  const [viewingMyHoagies, setViewingMyHoagies] = useState(false);
  const ITEMS_PER_PAGE = 12;
  const { user, logout } = useAuth();

  const fetchHoagies = async (pageNumber = 1) => {
    setIsLoading(true);

    try {
      const response = await hoagieService.getHoagies(pageNumber, ITEMS_PER_PAGE);
      setHoagies(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load hoagies');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserHoagies = async () => {
    if (!user) return;
    
    console.log('Fetching hoagies for user:', user._id, user.name);
    setLoadingUserHoagies(true);
    try {
      const response = await hoagieService.getUserHoagies(user._id, 1, 100); // Get all user hoagies
      
      // Filter hoagies client-side to ensure we only get the current user's hoagies
      const filteredHoagies = response.items.filter(hoagie => 
        hoagie.creator._id === user._id
      );
      
      console.log('User hoagies response:', {
        userId: user._id,
        totalHoagies: response.total,
        receivedHoagies: response.items.length,
        filteredHoagies: filteredHoagies.length,
        firstFewHoagies: filteredHoagies.slice(0, 3).map(h => ({
          id: h._id,
          name: h.name,
          creatorId: h.creator._id,
          creatorName: h.creator.name
        }))
      });
      
      // Use the filtered hoagies instead of the raw API response
      setUserHoagies(filteredHoagies);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      console.error('Failed to load user hoagies:', apiError);
    } finally {
      setLoadingUserHoagies(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('HoagieListScreen focused - refreshing hoagies');
      fetchHoagies(page);
      
      return () => {
        // Clean up if needed
      };
    }, [page])
  );

  const handleUserHoagiesPress = async () => {
    await fetchUserHoagies();
    setUserHoagiesModalVisible(true);
  };

  const handleCloseUserHoagies = () => {
    setUserHoagiesModalVisible(false);
  };

  const handleSelectUserHoagie = (hoagie: Hoagie) => {
    setUserHoagiesModalVisible(false);
    navigation.navigate('HoagieDetails', { hoagie });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSelectHoagie = (hoagie: Hoagie) => {
    navigation.navigate('HoagieDetails', { hoagie });
  };

  const handleCreateHoagie = () => {
    // console.log("clicked");
    navigation.navigate('CreateHoagie');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoagies</Text>
        <View style={styles.userActions}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
          <View style={styles.userButtons}>
            <TouchableOpacity onPress={handleUserHoagiesPress} style={styles.myHoagiesButton}>
              <Text style={styles.myHoagiesText}>My Hoagies</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            {error}
          </Text>
          <Button
            onPress={() => fetchHoagies(1)}
            label="Retry"
            variant="primary"
          />
        </View>
      ) : isLoading && hoagies.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      ) : hoagies.length === 0 ? (
        <View style={styles.centerContent}>
          <Text>No hoagies found.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={hoagies}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <HoagieCard hoagie={item} onPress={handleSelectHoagie} />
            )}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator style={styles.loadingMore} size="small" color="#ff6b6b" />
              ) : null
            }
          />
          
          {/* Pagination */}
          {totalPages > 0 && (
            <View style={styles.paginationContainer}>
              <Button
                onPress={handlePrevPage}
                label="Previous"
                disabled={page === 1}
                variant="secondary"
                size="small"
                style={styles.paginationButtonCustom}
                textStyle={styles.paginationButtonText}
              />
              
              <Text style={styles.paginationInfo}>
                Page {page} of {totalPages} • {totalItems} Hoagies
              </Text>
              
              <Button
                onPress={handleNextPage}
                label="Next"
                disabled={page === totalPages}
                variant="secondary"
                size="small"
                style={styles.paginationButtonCustom}
                textStyle={styles.paginationButtonText}
              />
            </View>
          )}
        </>
      )}

      {/* User Hoagies Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={userHoagiesModalVisible}
        onRequestClose={handleCloseUserHoagies}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Hoagies</Text>
              <Button
                onPress={handleCloseUserHoagies}
                label="×"
                variant="text"
                textStyle={styles.closeButton}
                style={{ padding: 0, minWidth: 0 }}
              />
            </View>
            
            {loadingUserHoagies ? (
              <ActivityIndicator size="large" color="#ff6b6b" style={styles.modalLoader} />
            ) : userHoagies.length === 0 ? (
              <Text style={styles.noHoagiesText}>You haven't created any hoagies yet.</Text>
            ) : (
              <FlatList
                data={userHoagies}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <HoagieCard hoagie={item} onPress={handleSelectUserHoagie} />
                )}
                contentContainerStyle={styles.modalListContent}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Create button - Using TouchableOpacity directly for better mobile touch handling */}
      <TouchableOpacity
        onPress={handleCreateHoagie}
        activeOpacity={0.7}
        style={styles.fabButtonContainer}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View style={styles.fabButtonCustom}>
          <Text style={styles.fabButtonTextCustom}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
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
    alignItems: 'flex-start',
    padding: 15,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userActions: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 5,
    color: COLORS.white,
    fontWeight: '500',
    textAlign: 'right',
  },
  userButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myHoagiesButton: {
    marginRight: 12,
    paddingVertical: 4,
  },
  myHoagiesText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 4,
  },
  logoutText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    paddingBottom: 80, // Extra padding for pagination controls
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingMore: {
    marginVertical: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryDark,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationButtonCustom: {
    minWidth: 75,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  paginationButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paginationInfo: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  fabButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 70, // Wider than the visible button for easier touching
    height: 70, // Taller than the visible button for easier touching
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButtonCustom: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Higher elevation for Android
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  fabButtonTextCustom: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.white,
  },
  modalListContent: {
    padding: 15,
  },
  modalLoader: {
    padding: 30,
  },
  noHoagiesText: {
    padding: 20,
    textAlign: 'center',
    color: COLORS.textLight,
  },
});

export default HoagieListScreen; 