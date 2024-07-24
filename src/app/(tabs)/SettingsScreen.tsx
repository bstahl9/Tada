import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { colours } from '../../constants/colours';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resetDB } from '../../db/dbReset';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
import useLibraryStore from '../../store/libraryStore';

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const audioDir = `${RNFS.DocumentDirectoryPath}/audio`;
  const { playNextTrack, activeSequence, activeSequenceTracks } = useLibraryStore();

  const handleHeaderPress = () => {
    console.log('Header button pressed');
  };

  const handleReset = async () => {
    try {
      await resetDB();
      const dirExists = await RNFS.exists(audioDir);
      if (dirExists) {
        const files = await RNFS.readDir(audioDir);
        const deletePromises = files.map((file) => RNFS.unlink(file.path));
        await Promise.all(deletePromises);
        console.log('Audio files deleted successfully');
      } else {
        console.log('Audio directory does not exist');
      }
      await TrackPlayer.reset();
      console.log('Queue cleared successfully');
    } catch (error) {
      console.error('Failed to reset the file system and database:', error);
    }
  };

  const handlePlayNextTrack = async () => {
    if (!activeSequence) {
      Alert.alert('No Active Sequence', 'Please set an active sequence first.');
      return;
    }

    console.log('Active sequence:', activeSequence);
    console.log('Tracks in active sequence:', activeSequenceTracks);

    try {
      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const currentTrackIndex = activeSequenceTracks.findIndex(track => track.id === currentTrackId);
      const nextTrack = activeSequenceTracks[currentTrackIndex + 1];

      console.log('Current track ID:', currentTrackId);
      console.log('Current track index:', currentTrackIndex);
      if (nextTrack) {
        console.log('Next track to be played:', nextTrack);
      } else {
        console.log('No next track available.');
      }

      await playNextTrack();
      Alert.alert('Success', 'Playing next track from the active sequence.');
    } catch (error) {
      console.error('Failed to play next track:', error);
      Alert.alert('Error', 'Failed to play next track. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" onButtonPress={handleHeaderPress} buttonIcon="menu" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity onPress={handleReset} style={styles.button}>
            <Text style={styles.buttonText}>Reset file system, database and queued</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayNextTrack} style={[styles.button, styles.playButton]}>
            <Text style={styles.buttonText}>Play Next Track from Active Sequence</Text>
          </TouchableOpacity>
          {/* Add more content here */}
        </View>
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
    content: {
      padding: 24,
    },
    button: {
      padding: 10,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,  // Add some space between buttons
    },
    playButton: {
      backgroundColor: '#007AFF',  // You can adjust this color as needed
      borderColor: '#007AFF',
    },
    buttonText: {
      fontFamily: 'Ligconsolata',
      fontSize: 18,
      color: theme === 'dark' ? colours.dark.text : colours.light.text,
    },
  });

export default SettingsScreen;
