import React, { createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

export const ProgressContext = createContext(null);

import {
  useFonts as useOswald,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import {
  useFonts as useLato,
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato';

import { theme } from './src/infrastructure/theme';

import Home from './src/screens/home/home.screen';
import Shop from './src/screens/shop/shop.screen';
import Stats from './src/screens/stats/stats.screen';
import Cave from './src/screens/cave/cave.screen';

import { ProgressProvider } from './src/features/progress-provider.feature';

const Tab = createBottomTabNavigator();

export default function App() {
  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_700Bold,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <ProgressProvider>
        <StatusBar style='auto' hidden={true} />
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Shop') {
                  iconName = 'shop';
                } else if (route.name === 'Stats') {
                  iconName = 'user';
                }

                return <Entypo name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
              tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'white',
                bottom: 0,
              },
              tabBarShowLabel: false,
            })}
          >
            <Tab.Screen name='Shop' component={Shop} />
            <Tab.Screen name='Home' component={Home} />
            <Tab.Screen name='Stats' component={Stats} />
            <Tab.Screen
              name='Cave'
              component={Cave}
              options={{
                tabBarButton: () => null,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ProgressProvider>
    </ThemeProvider>
  );
}
