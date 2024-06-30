// ParallaxBackground.js
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

const window = Dimensions.get('window');

const ParallaxBackground = () => {
  return (
    <ParallaxScrollView
      backgroundColor='blue'
      contentBackgroundColor='white'
      parallaxHeaderHeight={300}
      renderForeground={() => (
        <View style={styles.parallaxHeader}>
          <Text style={styles.parallaxText}>Parallax Header</Text>
        </View>
      )}
      renderBackground={() => (
        <View key='background'>
          <Image
            source={{
              uri: 'https://example.com/your-image.jpg',
              width: window.width,
              height: 300,
            }}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
        </View>
      )}
    >
      <View style={{ height: 500 }}>
        <Text style={styles.sectionTitle}>Section Title</Text>
        <Text style={styles.sectionContent}>Section Content</Text>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  parallaxHeader: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parallaxText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backgroundImage: {
    width: window.width,
    height: 300,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    width: window.width,
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  sectionContent: {
    fontSize: 16,
    padding: 16,
  },
});

export default ParallaxBackground;
