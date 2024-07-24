import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { colours } from '../../constants/colours';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { addTrackDb } from '../../db/dbTrack';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [recording, setRecording] = useState(false);
  const [recordingSaved, setRecordingSaved] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordSecs, setRecordSecs] = useState<number>(0);
  const [recordTime, setRecordTime] = useState<string>('00:00');

  const audioDir = `${RNFS.DocumentDirectoryPath}/audio`;

  const startRecording = async () => {
    try {
      await RNFS.mkdir(audioDir);

      const result = await audioRecorderPlayer.startRecorder(audioDir + '/test.mp4');
      setRecording(true);

      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordSecs(e.currentPosition / 1000);
        const minutes = Math.floor(e.currentPosition / 60000);
        const seconds = Math.floor((e.currentPosition % 60000) / 1000);
        setRecordTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        return;
      });
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setRecordingUri(result);
      setRecordingSaved(true);

      const newTrack = {
        id: Date.now().toString(), // or use any UUID generation method
        url: result,
        title: 'New Recording',
        artist: 'Unknown Artist',
      };

      await addTrackDb(newTrack);
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
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
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
