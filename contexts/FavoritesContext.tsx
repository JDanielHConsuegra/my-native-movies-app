import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveMovie } from '../services/appwrite';

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoriteIds');
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem('favoriteIds', JSON.stringify(ids));
    } catch (error) {
      console.log('Error saving favorites:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const isNowFav = await saveMovie(id); // sync with db, returns true if saved, false if removed
      const newIds = isNowFav ? (favoriteIds.includes(id) ? favoriteIds : [...favoriteIds, id]) : favoriteIds.filter(i => i !== id);
      setFavoriteIds(newIds);
      await saveFavorites(newIds);
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};