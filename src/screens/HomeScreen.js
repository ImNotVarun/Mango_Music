import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const HomePage = () => {
    return (
        <LinearGradient
            colors={['#FF3B30', '#121212']} // Black gradient colors
            style={styles.container}
        >
            <StatusBar style="light" backgroundColor="#000000" />
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to My App</Text>
                {/* Add your other components here */}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width - 40,
        height: height - 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default HomePage;
