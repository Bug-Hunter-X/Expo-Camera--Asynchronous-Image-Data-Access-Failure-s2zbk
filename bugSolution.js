// bugSolution.js
import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect } from 'react';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [imageUri, setImageUri] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setImageUri(photo.uri);
        // Load image data after capture
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = function (event) {
          setImageData(event.target.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const [cameraRef, setCameraRef] = useState(null);

  if (hasPermission === null) {
    return <View />; // Requesting permissions
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => setCameraRef(ref)}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={{alignSelf: 'flex-end', margin: 20}}
            onPress={takePicture}>
            <Text style={{fontSize: 20}}>Take picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {imageData && <Image source={{ uri: imageData }} style={{ width: 300, height: 300 }}/>}
      {imageUri && <Text>Image URI: {imageUri}</Text>}
    </View>
  );
};
export default CameraScreen;