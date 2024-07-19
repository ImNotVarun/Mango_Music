import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const albumSize = width - 80;
const miniPlayerHeight = 90;
const TAB_BAR_HEIGHT = 50; // Adjust based on your actual tab bar height

const PlayerScreen = ({ isExpanded, setIsExpanded }) => {
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 20,
            onPanResponderMove: (_, gestureState) => {
                const newValue = isMiniPlayer
                    ? Math.max(0, height - miniPlayerHeight - insets.bottom - TAB_BAR_HEIGHT + gestureState.dy)
                    : Math.max(0, gestureState.dy);
                animation.setValue(newValue);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isMiniPlayer && gestureState.dy < -50) {
                    expandPlayer();
                } else if (!isMiniPlayer && gestureState.dy > 50) {
                    minimizePlayer();
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const animatePlayer = (toValue) => {
        Animated.spring(animation, {
            toValue,
            useNativeDriver: false,
            tension: 40,
            friction: 8,
        }).start(() => setIsMiniPlayer(toValue !== 0));
    };

    const minimizePlayer = () => animatePlayer(height - miniPlayerHeight - insets.bottom - TAB_BAR_HEIGHT);
    const expandPlayer = () => animatePlayer(0);
    const resetPosition = () => animatePlayer(isMiniPlayer ? height - miniPlayerHeight - insets.bottom - TAB_BAR_HEIGHT : 0);

    const interpolate = (outputRange) =>
        animation.interpolate({
            inputRange: [0, height - miniPlayerHeight - insets.bottom - TAB_BAR_HEIGHT],
            outputRange,
            extrapolate: 'clamp',
        });

    const containerHeight = interpolate([height - insets.bottom - TAB_BAR_HEIGHT, miniPlayerHeight]);
    const albumArtSize = interpolate([albumSize, 80]);
    const albumArtPosition = interpolate([0, -120]);
    const albumArtMarginTop = interpolate([40, 7]);
    const opacity = interpolate([1, 1]);
    const albumNamePosition = interpolate([0, -90]);
    const artistNamePosition = interpolate([0, -95]);
    const playPauseButtonPositionX = interpolate([0, 120]);
    const playPauseButtonPositionY = interpolate([0, -239]);
    const playPauseButtonScale = interpolate([1, 0.7]);
    const miniPlayerTextOpacity = interpolate([0, 1]);

    return (
        <Animated.View
            style={[styles.container, { height: containerHeight, bottom: insets.bottom + TAB_BAR_HEIGHT }]}
            {...panResponder.panHandlers}
        >
            <LinearGradient
                colors={['#ff6e7f', '#000000']}
                style={StyleSheet.absoluteFill}
            >
                <Animated.Image
                    source={{ uri: 'https://source.boomplaymusic.com/group10/M00/05/19/dd05de98d8644a4a83f635cbdc61e279_464_464.webp' }}
                    style={[styles.albumArt, { width: albumArtSize, height: albumArtSize, left: albumArtPosition, marginTop: albumArtMarginTop }]}
                />

                <Animated.View style={[styles.songInfoContainer, { opacity }]}>
                    <Animated.Text style={[styles.title, { transform: [{ translateY: albumNamePosition }], opacity }]}>
                        Liability
                    </Animated.Text>
                    <Animated.Text style={[styles.artist, { transform: [{ translateY: artistNamePosition }], opacity }]}>
                        Lorde
                    </Animated.Text>
                </Animated.View>

                <Animated.View style={[styles.progressContainer, { opacity }]}>
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
                        <Text style={styles.timeText}>2:42</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.controls, { opacity }]}>
                    <TouchableOpacity>
                        <FontAwesome name="step-backward" size={32} color="white" />
                    </TouchableOpacity>
                    <Animated.View style={{
                        transform: [
                            { translateX: playPauseButtonPositionX },
                            { translateY: playPauseButtonPositionY },
                            { scale: playPauseButtonScale }
                        ]
                    }}>
                        <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)} style={styles.playPauseButton}>
                            <FontAwesome name={isPlaying ? "pause" : "play"} size={64} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity>
                        <FontAwesome name="step-forward" size={32} color="white" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.miniPlayer, { opacity: Animated.subtract(1, opacity) }]}>
                    <View style={styles.miniPlayerContent}>
                        <Animated.Text style={[styles.miniTitle, { opacity: miniPlayerTextOpacity }]}>
                            Liability
                        </Animated.Text>
                        <Animated.Text style={[styles.miniArtist, { opacity: miniPlayerTextOpacity }]}>
                            Lorde
                        </Animated.Text>
                    </View>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
};

PlayerScreen.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    albumArt: {
        alignSelf: 'center',
        borderRadius: 20,
    },
    songInfoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    artist: {
        fontSize: 18,
        color: '#888',
        marginTop: 5,
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    progressBar: {
        width: '100%',
        height: 20,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: '#888',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
    },
    playPauseButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
    },
    miniPlayer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: miniPlayerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#000',
    },
    miniPlayerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    miniTitle: {
        fontSize: 18,
        color: 'white',
    },
    miniArtist: {
        fontSize: 14,
        color: '#888',
        marginTop: 3,
    },
});

export default PlayerScreen;
