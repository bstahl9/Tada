import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { initializeDatabase } from '../db/initDB';
import { useLogTrackPlayerState } from '../hooks/useLogTrackPlayer';
import { useSetupTrackPlayer } from '../hooks/useSetupTrackPlayer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LibraryStackNavigator from './(tabs)/(library)/';
import RecordScreen from './(tabs)/RecordScreen';
import SettingsScreen from './(tabs)/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/SimpleLineIcons'; 
import { colours } from '../constants/colours';
import { FloatingPlayer } from '../components/FloatingPlayer';

const Tab = createBottomTabNavigator();

const App = () => {
    useLogTrackPlayerState();

    const handleTrackPlayerLoaded = useCallback(() => {
        // SplashScreen.hideAsync(); // Uncomment when SplashScreen is set up
    }, []);

    useSetupTrackPlayer({ onLoad: handleTrackPlayerLoaded });

    useEffect(() => {
        (async () => {
            await initializeDatabase();
        })();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={({ route }) => {
                            const { theme } = useTheme();
                            const colors = theme === 'dark' ? colours.dark : colours.light;

                            return {
                                headerShown: false,
                                tabBarShowLabel: false, // Hide the tab bar labels
                                tabBarIcon: ({ color, size, focused }) => {
                                    let iconName: string;

                                    switch (route.name) {
                                        case 'Library':
                                            iconName = 'music-tone';
                                            break;
                                        case 'Record':
                                            iconName = 'microphone'; 
                                            break;
                                        case 'Settings':
                                            iconName = 'settings';
                                            break;
                                        default:
                                            iconName = 'alert';
                                            break;
                                    }

                                    return (
                                        <Icon
                                            name={iconName}
                                            size={size}
                                            color={focused ? colors.highlight : colors.text}
                                        />
                                    );
                                },
                            };
                        }}
                    >
                        <Tab.Screen name="Library" component={LibraryStackNavigator} />
                        <Tab.Screen name="Record" component={RecordScreen} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                    <FloatingPlayer
                        style={{
                            position: 'absolute',
                            left: 8,
                            right: 8,
                            bottom: 78,
                        }}
                    />
                </NavigationContainer>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
};

export default App;
