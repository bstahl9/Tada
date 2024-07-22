// src/screens/TrackScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Track } from 'react-native-track-player';
import { useTheme } from '../../../context/ThemeContext';
import { colours } from '../../../constants/colours'; 
import { getTracksDb } from '../../../db/dbTrack';
import LibraryTrackList from '../../../components/LibraryTrackList';

const TrackScreen = () => {
  const { theme } = useTheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTracks();
    }, [])
  );

  const fetchTracks = async () => {
    try {
      const files = await getTracksDb();
      setTracks(files);
    } catch (error) {
      console.error('Failed to fetch audio files from database:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTracks();
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={50}
          />
        }
      >
        <LibraryTrackList tracks={tracks} queueId="none" onUpdate={fetchTracks} />
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
  });

export default TrackScreen;
