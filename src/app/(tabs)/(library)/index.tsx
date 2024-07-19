// src/screens/LibraryScreen/LibraryStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from './LibraryScreen';
import SequenceDetails from './SequenceDetails';

const Stack = createStackNavigator();

const LibraryStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LibraryHome" component={LibraryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SequenceDetails" component={SequenceDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default LibraryStackNavigator;
