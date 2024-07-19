import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import PlayerScreen from './src/screens/player';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.container}>
          {!isPlayerExpanded && (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName: 'home' | 'search' | 'heart' = 'home';
                  if (route.name === 'Home') {
                    iconName = 'home';
                  } else if (route.name === 'Search') {
                    iconName = 'search';
                  } else if (route.name === 'Favorites') {
                    iconName = 'heart';
                  }
                  return <FontAwesome name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FF3B30',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Search" component={SearchScreen} />
              <Tab.Screen name="Favorites" component={FavoritesScreen} />
            </Tab.Navigator>
          )}
          <PlayerScreen
            isExpanded={isPlayerExpanded}
            setIsExpanded={setIsPlayerExpanded}
          />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;