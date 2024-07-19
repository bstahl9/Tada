import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import TrackPlayer, { Track, Event } from 'react-native-track-player';
import TrackList from '../../components/TrackList';
import CustomHeader from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { colours } from '../../constants/colours';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';

const QueueScreen = () => {
  const { theme } = useTheme();
  const [queue, setQueue] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchQueue = useCallback(async () => {
    try {
      const currentQueue = await TrackPlayer.getQueue();
      const activeTrack = await TrackPlayer.getActiveTrack();

      if (activeTrack) {
        setQueue(currentQueue);
      } else {
        setQueue([]);
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(() => {
    fetchQueue();
  });

  useEffect(() => {
    fetchQueue();

    const stateChangeListener = TrackPlayer.addEventListener(Event.PlaybackState, async (state) => {
      if (state.state === TrackPlayer.STATE_PAUSED || state.state === TrackPlayer.STATE_STOPPED) {
        await fetchQueue();
      }
    });

    const trackChangeListener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (data) => {
      if (data.track) {
        await fetchQueue();
      } else {
        setQueue([]);
      }
    });

    const queueEndedListener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
      setQueue([]);
    });

    return () => {
      stateChangeListener.remove();
      trackChangeListener.remove();
      queueEndedListener.remove();
    };
  }, [fetchQueue]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchQueue();
  };

  const clearQueue = async () => {
    try {
      await TrackPlayer.reset();
      setQueue([]);
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  };

  const playNextTrack = async () => {
    try {
      const currentQueue = await TrackPlayer.getQueue();
      console.log(currentQueue);
      
      if (currentQueue.length === 0) {
        return
      } else {
        await TrackPlayer.play();
        fetchQueue();
      }
    
      await TrackPlayer.play();
    
    } catch (error) {
      console.error('Failed to play next track:', error);
    }
  };
  
  const styles = createStyles(theme);

  if (loading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Queue" onButtonPress={clearQueue} buttonIcon="trash-2" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {queue.length > 0 ? (
          <TrackList tracks={queue} queueId="currentQueue" onUpdate={fetchQueue} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tracks in the queue</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={playNextTrack}>
        <Icon name="skip-forward" size={24} color={theme === 'dark' ? colours.dark.text : colours.light.text} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 22,
      fontFamily: 'Ligconsolata',
      color: theme === 'dark' ? colours.dark.text : colours.light.text,
    },
    nextButton: {
      padding: 10,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 16,
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  });

export default QueueScreen;
