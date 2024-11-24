import React, { Component } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

class BlinkingText extends Component {
  constructor() {
    super();
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.startBlinking();
  }

  startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true, // Add this for performance
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true, // Add this for performance
        }),
      ]),
      { iterations: -1 }
    ).start();
  };

  render() {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' },this.props.style]}>
        <Animated.Text
          style={{
            fontSize: 24,
            fontWeight: '500',
            opacity: this.state.opacity,
          }}
        >
          |
        </Animated.Text>
      </View>
    );
  }
}

export default BlinkingText;
