import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { colours } from '../../constants/colours';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resetDB } from '../../db/dbReset';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const audioDir = `${RNFS.DocumentDirectoryPath}/audio`;

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

  return (
    <View style={styles.container}>
      <Header title="Settings" onButtonPress={handleHeaderPress} buttonIcon="menu" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <TouchableOpacity onPress={handleReset} style={styles.button}>
            <Text style={styles.buttonText}>Reset file system, database and queued</Text>
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
    },
    buttonText: {
      fontFamily: 'Ligconsolata',
      fontSize: 18,
      color: theme === 'dark' ? colours.dark.text : colours.light.text,
    },
  });

export default SettingsScreen;
