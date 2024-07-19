import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../../components/Header';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TrackScreen from './TrackScreen';
import SequenceScreen from './SequenceScreen';
import AddLibraryModal from '../../../modals/AddLibraryModal';

const Tab = createMaterialTopTabNavigator();

const LibraryScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleButtonPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Library" onButtonPress={handleButtonPress} buttonIcon='plus'/>
      <Tab.Navigator style={styles.topTab}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: 'red' },
          tabBarLabelStyle: { fontSize: 16, fontFamily: 'Ligconsolata' },
        }}
      >
        <Tab.Screen name="Sequences" component={SequenceScreen} />
        <Tab.Screen name="Tracks" component={TrackScreen} />
      </Tab.Navigator>
      <AddLibraryModal
        visible={isModalVisible}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topTab: {
    marginTop: -38,
  },
});

export default LibraryScreen;
