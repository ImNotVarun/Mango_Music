import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const albumSize = width - 80;
const miniPlayerHeight = 90;

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = isMiniPlayer
          ? Math.max(0, height - miniPlayerHeight + gestureState.dy)
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

  const minimizePlayer = () => {
    Animated.spring(animation, {
      toValue: height - miniPlayerHeight,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start(() => setIsMiniPlayer(true));
  };

  const expandPlayer = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start(() => setIsMiniPlayer(false));
  };

  const resetPosition = () => {
    Animated.spring(animation, {
      toValue: isMiniPlayer ? height - miniPlayerHeight : 0,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  };

  const containerHeight = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [height, miniPlayerHeight],
    extrapolate: 'clamp',
  });

  const albumArtSize = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [albumSize, 80],
    extrapolate: 'clamp',
  });

  const albumArtPosition = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const albumArtMarginTop = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [40, 7],
    extrapolate: 'clamp',
  });

  const opacity = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [1, 1],
    extrapolate: 'clamp',
  });

  const albumNamePosition = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, -90],
    extrapolate: 'clamp',
  });

  const artistNamePosition = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, -95],
    extrapolate: 'clamp',
  });

  // New animations for play/pause button
  const playPauseButtonPositionX = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, 120],
    extrapolate: 'clamp',
  });

  const playPauseButtonPositionY = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, -279], // Adjust the range based on your desired y-axis movement
    extrapolate: 'clamp',
  });


  const playPauseButtonScale = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });


  const miniPlayerTextOpacity = animation.interpolate({
    inputRange: [0, height - miniPlayerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[styles.container, { height: containerHeight }]}
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

        {/* Main player elements */}
        <Animated.View style={[styles.songInfoContainer, { opacity }]}>
          <Animated.Text style={[styles.title, { transform: [{ translateY: albumNamePosition }], opacity }]}>
            Liability
          </Animated.Text>
          <Animated.Text style={[styles.artist, { transform: [{ translateY: artistNamePosition }], opacity }]}>
            Lorde
          </Animated.Text>
          <TouchableOpacity style={styles.loveButton}>
            <FontAwesome name="heart" size={24} color="red" />
          </TouchableOpacity>
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
              { translateY: playPauseButtonPositionY }, // Use playPauseButtonPositionY for y-axis translation
              { scale: playPauseButtonScale }
            ]
          }}>
            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
              <FontAwesome name={isPlaying ? "pause" : "play"} size={64} color="white" />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity>
            <FontAwesome name="step-forward" size={32} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity }]}>
          <TouchableOpacity>
            <FontAwesome name="ellipsis-h" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Mini player elements */}
        <Animated.View style={[styles.miniPlayer, { opacity: Animated.subtract(1, opacity) }]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  albumArt: {
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 40,
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
  loveButton: {
    marginTop: 10,
    alignItems: 'center',
    marginLeft: 250,
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
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  miniPlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: miniPlayerHeight,
  },
  miniTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  miniArtist: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
});

export default MusicPlayer;