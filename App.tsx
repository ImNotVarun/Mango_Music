import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import your screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PlayerScreen from './src/screens/player';

const Tab = createBottomTabNavigator();
const TAB_BAR_HEIGHT = 50;

const App = () => {
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="dark" backgroundColor="#17153B" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName: string;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'Search':
                    iconName = 'search';
                    break;
                  case 'Favorites':
                    iconName = 'heart';
                    break;
                  default:
                    iconName = 'home'; // default icon
                }

                return <FontAwesome name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: route.name === 'Home' ? '#C8ACD6' : '#433D8B',
              tabBarInactiveTintColor: 'lightgrey',
              tabBarStyle: {
                backgroundColor: '#17153B',
                height: TAB_BAR_HEIGHT,
                borderTopColor: 'transparent',
                borderTopWidth: 0,
                borderBottomLeftRadius: 30, // Added border radius
                borderBottomRightRadius: 30, // Added border radius
                overflow: 'hidden', // Ensure content doesn't overflow
              },
              tabBarShowLabel: false,
              headerStyle: {
                backgroundColor: '#17153B',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerStyle: {
                  backgroundColor: '#17153B',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                },
              }}
            />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
          </Tab.Navigator>
          <PlayerScreen
            isExpanded={isPlayerExpanded}
            setIsExpanded={setIsPlayerExpanded}
            tabBarHeight={TAB_BAR_HEIGHT}
          />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Ensure the background color matches the tab bar
  },
});

export default App;
