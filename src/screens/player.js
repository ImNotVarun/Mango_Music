import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Image, PanResponder } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Removed MaterialIcons import
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const albumSize = width - 80;
const miniPlayerHeight = 60;

const PlayerScreen = ({ isExpanded, setIsExpanded, tabBarHeight }) => {
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const animation = useRef(new Animated.Value(isExpanded ? 0 : height - miniPlayerHeight)).current;
    const imageSize = useRef(new Animated.Value(isExpanded ? albumSize : 50)).current;
    const imagePositionX = useRef(new Animated.Value(isExpanded ? 0 : 20)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -50) {
                    expandPlayer();
                } else if (gestureState.dy > 50) {
                    minimizePlayer();
                }
            },
        })
    ).current;

    const animatePlayer = useCallback((toValue) => {
        Animated.spring(animation, {
            toValue,
            useNativeDriver: false,
            tension: 40,
            friction: 8,
        }).start();
    }, [animation]);

    const animateImage = useCallback((toSize, toX) => {
        Animated.parallel([
            Animated.spring(imageSize, {
                toValue: toSize,
                useNativeDriver: false,
            }).start(),
            Animated.spring(imagePositionX, {
                toValue: toX,
                useNativeDriver: false,
            }).start(),
        ]);
    }, [imageSize, imagePositionX]);

    const minimizePlayer = useCallback(() => {
        animatePlayer(height - miniPlayerHeight - insets.bottom - tabBarHeight);
        animateImage(50, 20);
        setIsExpanded(false);
    }, [animatePlayer, animateImage, height, insets.bottom, tabBarHeight]);

    const expandPlayer = useCallback(() => {
        animatePlayer(0);
        animateImage(albumSize, 0);
        setIsExpanded(true);
    }, [animatePlayer, animateImage, albumSize]);

    const interpolate = useCallback((outputRange) =>
        animation.interpolate({
            inputRange: [0, height - miniPlayerHeight - insets.bottom - tabBarHeight],
            outputRange,
            extrapolate: 'clamp',
        }), [animation, height, miniPlayerHeight, insets.bottom, tabBarHeight]);

    const containerHeight = interpolate([height, miniPlayerHeight]);
    const albumArtSize = imageSize;
    const albumArtMarginTop = interpolate([60, 5]);
    const mainPlayerOpacity = interpolate([1, 0]);
    const miniPlayerOpacity = interpolate([0, 1]);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.container, { height: containerHeight, bottom: insets.bottom + tabBarHeight }]}
        >
            <LinearGradient
                colors={['#ff6e7f', '#000000']}
                style={StyleSheet.absoluteFill}
            >
                {/* Main Player */}
                <Animated.View style={[styles.mainPlayer, { opacity: mainPlayerOpacity }]}>
                    <Animated.Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/5/52/American-psycho-patrick-bateman.jpg?20230727203932' }}
                        style={[styles.albumArt, {
                            width: albumArtSize,
                            height: albumArtSize,
                            marginTop: albumArtMarginTop,
                            transform: [{ translateX: imagePositionX }]
                        }]}
                    />
                    <Text style={styles.title}>Song Title</Text>
                    <Text style={styles.artist}>Artist Name</Text>
                    <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={1}
                        value={progress}
                        onValueChange={setProgress}
                        minimumTrackTintColor="#FF3B30"
                        maximumTrackTintColor="#FFFFFF"
                        thumbTintColor="#FF3B30"
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>0:00</Text>
                        <Text style={styles.timeText}>3:30</Text>
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity>
                            <FontAwesome name="step-backward" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                            <FontAwesome name={isPlaying ? "pause" : "play"} size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="step-forward" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Mini Player */}
                <Animated.View style={[styles.miniPlayer, { opacity: miniPlayerOpacity }]}>
                    <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/5/52/American-psycho-patrick-bateman.jpg?20230727203932' }}
                        style={styles.miniAlbumArt}
                    />
                    <View style={styles.miniInfo}>
                        <Text style={styles.miniTitle}>Song Title</Text>
                        <Text style={styles.miniArtist}>Artist Name</Text>
                    </View>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    mainPlayer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    albumArt: {
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
    },
    artist: {
        fontSize: 18,
        color: '#ccc',
        marginTop: 5,
    },
    progressBar: {
        width: width - 40,
        marginTop: 30,
    },
    timeContainer: {
        width: width - 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    timeText: {
        color: '#ccc',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width - 80,
        marginTop: 30,
    },
    playPauseButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: miniPlayerHeight,
    },
    miniAlbumArt: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    miniInfo: {
        flex: 1,
        marginLeft: 15,
    },
    miniTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    miniArtist: {
        color: '#ccc',
        fontSize: 14,
    },
});

export default PlayerScreen;
