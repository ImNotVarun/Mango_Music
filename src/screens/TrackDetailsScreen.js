import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const TrackDetailsScreen = ({ route, navigation }) => {
    const { trackId } = route.params;

    // Fetch and display track details based on trackId
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Track Details</Text>
            {/* Render track details here */}
            <Button
                title="Play"
                onPress={() => navigation.navigate('Player', { trackId })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TrackDetailsScreen;
