import React from 'react';
import { View, StyleSheet } from 'react-native';

const InnerShadowView= () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerShadow} />
      {/* Your content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%%',
    height: '100%',
    backgroundColor: 'white', // Background color of the element
    borderColor: '#ccc', // Border color for better visualization
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10, // Adjust the width to control the size of the shadow
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Shadow color and opacity
    transform: [{ skewX: '-45deg' }], // Skew the shadow to create the effect
  },
});

export default InnerShadowView;
