import React from 'react';
import { ImageBackground } from 'react-native';

const StaticBackground = ({ src }) => {
  return (
    <ImageBackground source={src} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} />
  );
};

export default StaticBackground;