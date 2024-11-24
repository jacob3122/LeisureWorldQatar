import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RangeSlider = () => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [selectedMinValue, setSelectedMinValue] = useState(0);
  const [selectedMaxValue, setSelectedMaxValue] = useState(100);

  const handleMinValueChange = (newValue) => {
    if (newValue <= selectedMaxValue) {
      setMinValue(newValue);
      setSelectedMinValue(newValue);
    }
  };

  const handleMaxValueChange = (newValue) => {
    if (newValue >= selectedMinValue) {
      setMaxValue(newValue);
      setSelectedMaxValue(newValue);
    }
  };

  const handleMinThumbPress = () => {
    // Handle press on the min thumb (if needed)
  };

  const handleMaxThumbPress = () => {
    // Handle press on the max thumb (if needed)
  };

  return (
    <View style={styles.container}>
      <Text>Range: {selectedMinValue} - {selectedMaxValue}</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack} />
        <TouchableOpacity
          style={[styles.thumb, { left: (selectedMinValue / maxValue) * 100 + '%' }]}
          onPress={handleMinThumbPress}
        />
        <TouchableOpacity
          style={[styles.thumb, { left: (selectedMaxValue / maxValue) * 100 + '%' }]}
          onPress={handleMaxThumbPress}
        />
      </View>
      <View style={styles.valueLabels}>
        <Text>{minValue}</Text>
        <Text>{maxValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    width: '80%',
    height: 10,
    backgroundColor: 'lightgray',
    position: 'relative',
    borderRadius: 5,
  },
  sliderTrack: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    position: 'absolute',
    borderRadius: 5,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    position: 'absolute',
  },
  valueLabels: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default RangeSlider;
