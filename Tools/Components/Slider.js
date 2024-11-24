import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

function Slider({
    images, dotStyle, dotColor, inactiveDotColor, autoplay = false, firstItem = 0, parentWidth, circleLoop = false,
}) {
    const [currentIndex, setCurrentIndex] = useState(firstItem);
    const windowWidth = Dimensions.get('window').width;
    const sliderRef = useRef(null);

    // Auto-slide logic
    useEffect(() => {
        if (autoplay && images.length > 1) {
            const interval = setInterval(() => {
                const nextIndex = circleLoop
                    ? (currentIndex + 1) % images.length
                    : Math.min(currentIndex + 1, images.length - 1);
                setCurrentIndex(nextIndex);
                sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }, 3000); // 3 seconds timer for auto sliding

            return () => clearInterval(interval); // Clean up on unmount
        }
    }, [currentIndex, autoplay, circleLoop]);

    // Handle scrolling manually
    const onScrollEnd = (e) => {
        const newIndex = Math.floor(e.nativeEvent.contentOffset.x / parentWidth);
        setCurrentIndex(newIndex);
    };

    // Render dots for image indicator
    const renderDots = () => {
        return (
            <View style={styles.dotContainer}>
                {images.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            dotStyle,
                            { backgroundColor: currentIndex === index ? dotColor : inactiveDotColor },
                        ]} />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
            removeClippedSubviews={false}
                ref={sliderRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
                renderItem={({ item }) => (
                    <FastImage
                        style={[styles.image, { width: parentWidth }]}
                        source={{ uri: item }}
                        resizeMode={FastImage.resizeMode.cover} />
                )}
                keyExtractor={(item, index) => 'sb' + index} />
            {renderDots()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 300,
        resizeMode: 'cover',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'space-between',
        marginTop: 10,
        width:widthPercentageToDP(50),
        position:'absolute',bottom:heightPercentageToDP(2)
    },
    dot: {
        
        marginHorizontal: 7.5,
    },
});

export default Slider;