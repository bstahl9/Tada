import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { colours } from '../../constants/colours';
import { Audio } from 'expo-av';
import RNFS from 'react-native-fs';
import { addTrackDb } from '../../db/dbTrack';

const RecordScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingSaved, setRecordingSaved] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordSecs, setRecordSecs] = useState<number>(0);
  const [recordTime, setRecordTime] = useState<string>('00:00');

  const audioDir = `${RNFS.DocumentDirectoryPath}/audio`;

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await RNFS.mkdir(audioDir);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setRecordSecs(status.durationMillis / 1000);
          const minutes = Math.floor(status.durationMillis / 60000);
          const seconds = Math.floor((status.durationMillis % 60000) / 1000);
          setRecordTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }
      });
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setRecordingUri(uri);
        setRecordingSaved(true);

        const newTrack = {
          id: Date.now().toString(), // or use any UUID generation method
          url: uri,
          title: 'New Recording',
          artist: 'Unknown Artist',
        };

        await addTrackDb(newTrack);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Record" onButtonPress={() => console.log('Header button pressed')} buttonIcon="menu" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.recordButton}>
            <Text style={styles.buttonText}>{recording ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
          <Text style={styles.recordTime}>{recordTime}</Text>
          {recordingSaved && <Text style={styles.savedText}>Recording saved</Text>}
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
      padding: 16,
    },
    recordButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: theme === 'dark' ? colours.dark.primary : colours.light.primary,
      borderRadius: 5,
    },
    buttonText: {
      color: 'black',
      textAlign: 'center',
      fontSize: 18,
    },
    recordTime: {
      marginTop: 10,
      fontSize: 16,
      color: theme === 'dark' ? colours.dark.text : colours.light.text,
    },
    savedText: {
      marginTop: 20,
      color: 'green',
      fontSize: 16,
    },
  });

export default RecordScreen;
