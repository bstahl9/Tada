// src/screens/TrackScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { colours } from '../../../constants/colours';
import LibraryTrackList from '../../../components/TrackList';
import useLibraryStore from '../../../store/libraryStore';

const TrackScreen = () => {
  const { theme } = useTheme();
  const { tracks, isLoading, fetchTracks } = useLibraryStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchTracks();
    }, [fetchTracks])
  );

  const handleRefresh = () => {
    fetchTracks();
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <LibraryTrackList tracks={tracks} />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default TrackScreen;