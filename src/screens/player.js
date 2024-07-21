import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const albumSize = width - 80;
const miniPlayerHeight = 60;

const songs = [
    { id: '1', title: 'The Perfect Girl', artist: 'patrick bateman', image: 'https://upload.wikimedia.org/wikipedia/en/5/52/American-psycho-patrick-bateman.jpg?20230727203932' },
    { id: '2', title: 'Song 2', artist: 'Artist 2', image: 'https://tse4.mm.bing.net/th?id=OIP.yQjTb5-bTqsSiAU9lmhyqAHaHa&pid=15.1' },
    { id: '3', title: 'Song 3', artist: 'Artist 3', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f8/11/27/f8112775-b320-2f77-b5de-a2d2139c0237/689690360221.jpg/316x316bb.webp' },
];

const PlayerScreen = ({ isExpanded, setIsExpanded, tabBarHeight }) => {
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [likedSongs, setLikedSongs] = useState(new Set());

    const animation = useSharedValue(isExpanded ? 0 : height - miniPlayerHeight);
    const imageSize = useSharedValue(isExpanded ? albumSize : 50);
    const imagePositionX = useSharedValue(isExpanded ? 0 : 20);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -50) {
                    expandPlayer();
                } else if (gestureState.dy > 50) {
                    minimizePlayer();
                }
                if (gestureState.dx > 50) {
                    previousSong();
                } else if (gestureState.dx < -50) {
                    nextSong();
                }
            },
        })
    ).current;

    const animatePlayer = useCallback((toValue) => {
        animation.value = withSpring(toValue, { damping: 15, stiffness: 90 });
    }, [animation]);

    const animateImage = useCallback((toSize, toX) => {
        imageSize.value = withSpring(toSize, { damping: 15, stiffness: 90 });
        imagePositionX.value = withSpring(toX, { damping: 15, stiffness: 90 });
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

    const containerHeight = useAnimatedStyle(() => ({
        height: animation.value,
    }));

    const albumArtSize = useAnimatedStyle(() => ({
        width: imageSize.value,
        height: imageSize.value,
        transform: [{ translateX: imagePositionX.value }],
    }));

    const mainPlayerOpacity = useAnimatedStyle(() => ({
        opacity: animation.value === 0 ? 1 : 0,
    }));

    const miniPlayerOpacity = useAnimatedStyle(() => ({
        opacity: animation.value === height - miniPlayerHeight - insets.bottom - tabBarHeight ? 1 : 0,
    }));

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const previousSong = () => {
        setCurrentSongIndex(prevIndex => (prevIndex - 1 + songs.length) % songs.length);
    };

    const nextSong = () => {
        setCurrentSongIndex(prevIndex => (prevIndex + 1) % songs.length);
    };

    const toggleLike = () => {
        setLikedSongs(prev => {
            const newLikedSongs = new Set(prev);
            const songId = songs[currentSongIndex].id;
            if (newLikedSongs.has(songId)) {
                newLikedSongs.delete(songId);
            } else {
                newLikedSongs.add(songId);
            }
            return newLikedSongs;
        });
    };

    const isLiked = likedSongs.has(songs[currentSongIndex].id);

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                containerHeight,
                {
                    bottom: isExpanded ? 0 : insets.bottom + tabBarHeight,
                    zIndex: isExpanded ? 1000 : 1,
                }
            ]}
        >
            <LinearGradient
                colors={['#17153B', '#2E236C']}
                style={StyleSheet.absoluteFill}
            >
                {/* Main Player */}
                <Animated.View style={[styles.mainPlayer, mainPlayerOpacity]}>
                    <View style={styles.albumContainer}>
                        <Animated.Image
                            source={{ uri: songs[currentSongIndex].image }}
                            style={[styles.albumArt, albumArtSize]}
                        />
                        <TouchableOpacity style={styles.loopIcon}>
                            <Ionicons name="repeat" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.likeIcon, { color: isLiked ? 'red' : 'white' }]}
                            onPress={toggleLike}
                        >
                            <Ionicons name="heart" size={32} color={isLiked ? 'red' : 'white'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{songs[currentSongIndex].title}</Text>
                    <Text style={styles.artist}>{songs[currentSongIndex].artist}</Text>
                    <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={1}
                        value={progress}
                        onValueChange={setProgress}
                        minimumTrackTintColor="#C8ACD6"
                        maximumTrackTintColor="#555"
                        thumbTintColor="#C8ACD6"
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>0:00</Text>
                        <Text style={styles.timeText}>3:30</Text>
                    </View>
                    {isExpanded && (
                        <View style={styles.controls}>
                            <TouchableOpacity onPress={previousSong}>
                                <Ionicons name="play-skip-back" size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextSong}>
                                <Ionicons name="play-skip-forward" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                {/* Mini Player */}
                <Animated.View style={[styles.miniPlayer, miniPlayerOpacity]}>
                    <Image
                        source={{ uri: songs[currentSongIndex].image }}
                        style={styles.miniAlbumArt}
                    />
                    <View style={styles.miniInfo}>
                        <Text style={styles.miniTitle}>{songs[currentSongIndex].title}</Text>
                        <Text style={styles.miniArtist}>{songs[currentSongIndex].artist}</Text>
                    </View>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
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
    albumContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20,
    },
    albumArt: {
        borderRadius: 30,
    },
    loopIcon: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    likeIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
    },
    artist: {
        fontSize: 18,
        color: 'white',
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
        color: 'white',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width - 80,
        marginTop: 30,
    },
    playPauseButton: {
        backgroundColor: '#433D8B',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: miniPlayerHeight,
        backgroundColor: '#2E236C',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    miniAlbumArt: {
        width: 50,
        height: 50,
        borderRadius: 10,
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
        color: '#C8ACD6',
        fontSize: 14,
    },
});

export default PlayerScreen;