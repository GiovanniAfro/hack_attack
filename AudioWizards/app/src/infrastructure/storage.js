import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveProgress = async (
  metrics,
  food,
  sleep,
  clean,
  coins,
  emotionsStats
) => {
  try {
    const progress = JSON.stringify({ metrics, food, sleep, clean, coins, emotionsStats });
    await AsyncStorage.setItem('progress', progress);
  } catch (error) {
    // Error saving data
    console.error('Failed to save the progress', error);
  }
};

export const loadProgress = async () => {
  try {
    const value = await AsyncStorage.getItem('progress');
    if (value !== null) {
      // We have data!!
      return JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
    console.error('Failed to load the progress', error);
  }
  return {
    metrics: [0],
    food: 0,
    sleep: 0,
    clean: 0,
    coins: 0,
    emotionsStats: { happy: 0, annoyed: 0, fearful: 0, dead: 0 }
  };
};

export const resetProgress = async () => {
  try {
    await AsyncStorage.removeItem('progress');
    // Alternatively: await AsyncStorage.setItem('progress', JSON.stringify({ metrics: [0], food: 0, sleep: 0, clean: 0, coins: 0 }));
  } catch (error) {
    console.error('Failed to reset the progress', error);
  }
};
