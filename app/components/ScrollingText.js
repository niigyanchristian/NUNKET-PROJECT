import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

const ScrollingText = ({ texts, duration, width }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });

    const nextIndex = (currentIndex + 1) % texts.length;

    const timeout = setTimeout(() => {
      setCurrentIndex(nextIndex);
      animatedValue.setValue(0);
      animation.start();
    }, duration);

    return () => clearTimeout(timeout);
  }, [animatedValue, currentIndex, duration, texts]);

  const currentText = texts[currentIndex];

  return (
    <View style={{ width, overflow: 'hidden' }}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [width, -width],
              }),
            },
          ],
        }}
      >
        <Text>{currentText}</Text>
      </Animated.View>
    </View>
  );
};

export default ScrollingText;
