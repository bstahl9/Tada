import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { colours } from '../constants/colours';

interface HeaderProps {
  title: string;
  onButtonPress?: () => void;
  buttonIcon?: string;
}

const Header: React.FC<HeaderProps> = ({ title, onButtonPress, buttonIcon }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        {onButtonPress && (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name={buttonIcon || 'circle'} size={30} color={theme === 'dark' ? colours.dark.text : colours.light.text} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme === 'dark' ? colours.dark.background : colours.light.background,
      height: 150,
    },
    header: { 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    headerText: { 
      marginLeft: 20,
      fontFamily: 'Ligconsolata',
      fontSize: 35,
      color: theme === 'dark' ? colours.dark.text : colours.light.text,
    },
    button: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default Header;
