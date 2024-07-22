// src/screens/LibraryScreen/SequenceDetails.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext'; // Adjust the path if needed
import { colours } from '../../../constants/colours'; // Adjust the path if needed
import Header from '../../../components/Header';
import TrackList from '../../../components/TrackList';
import { getTracksFromSequenceId } from '../../../db/dbJunction';
import TrackPlayer, { Track } from 'react-native-track-player';

const SequenceDetails = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTracks();
    }, [])
  );

  const fetchTracks = async () => {
    try {
      const files = await getTracksFromSequenceId(id);
      setTracks(files);
    } catch (error) {
      console.error('Failed to fetch tracks from database:', error);
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          progressViewOffset={50}
        />
      }
    >
      <Header title={name} />
      <TrackList tracks={tracks} playlistId={id} onUpdate={fetchTracks} />
    </ScrollView>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
    },
  });

export default SequenceDetails;