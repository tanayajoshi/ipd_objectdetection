import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const { width, height } = Dimensions.get('window');
  const cameraWidth = width * 0.8; // Set the camera width to cover 80% of the screen
  const cameraHeight = (width * 3) / 4; // Setting a 2:3 aspect ratio

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      speakOnAppOpen(); // Speak when the app is opened
    })();
  }, []);

  const speakOnAppOpen = async () => {
    try {
      await Speech.speak('Camera has opened');
    } catch (error) {
      console.error('Speech synthesis failed:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        console.log(photo); // Handle the captured photo data
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[styles.camera, { width: cameraWidth, height: cameraHeight }]}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      />
      <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    justifyContent: 'flex-end',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 70,
    width: 70,
    marginBottom: 20,
  },
});
