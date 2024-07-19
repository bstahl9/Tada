// src/screens/LibraryScreen/SequenceScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext'; // Adjust the path if needed
import { colours } from '../../../constants/colours'; // Adjust the path if needed
import Sequence from '../../../constants/types';
import { getSequences, deleteSequence } from '../../../db/dbSequence';
import SequenceList from '../../../components/SequenceList';

const SequenceScreen = () => {
  const { theme } = useTheme();
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchSequences();
    }, [])
  );

  const fetchSequences = async () => {
    try {
      const sequences = await getSequences();
      setSequences(sequences);
    } catch (error) {
      console.error('Failed to fetch sequences from database:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (sequence: Sequence) => {
    try {
      await deleteSequence(sequence);
      fetchSequences();
      console.log('Deleted sequence from database:', sequence);
    } catch (error) {
      console.error('Failed to delete sequence from database:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSequences();
  };

  const handleSequencePress = (sequence: Sequence) => {
    navigation.navigate('SequenceDetails', { id: sequence.id, name: sequence.name });
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme === 'dark' ? colours.dark.background : colours.light.background} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={50}
          />
        }
      >
        <SequenceList sequences={sequences} deleteSequence={handleDelete} onPress={handleSequencePress} />
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
  });

export default SequenceScreen;
