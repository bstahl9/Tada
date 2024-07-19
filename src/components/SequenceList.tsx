// src/components/SequenceList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Sequence from '../constants/types';

type SequenceListProps = {
  sequences: Sequence[];
  deleteSequence: (sequence: Sequence) => void;
  onPress: (sequence: Sequence) => void;
};

const SequenceList = ({ sequences, deleteSequence, onPress }: SequenceListProps) => {
  return (
    <View>
      {sequences.map((sequence) => (
        <TouchableOpacity key={sequence.id} onPress={() => onPress(sequence)} style={styles.item}>
          <Text style={styles.itemText}>{sequence.name}</Text>
          <TouchableOpacity onPress={() => deleteSequence(sequence)}>
            <Icon name={'trash'} size={24} color='red' />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 24,
    fontFamily: 'Ligconsolata',
  },
  deleteText: {
    color: 'red',
    fontFamily: 'Ligconsolata',
  },
});

export default SequenceList;

