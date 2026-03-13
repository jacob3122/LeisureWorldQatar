import React, {PureComponent, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';



export default function VisionCamera(props){
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() => {
    // const requestCameraPermission = async () => {
    //   const status = await Camera.requestCameraPermission();
    console.log("Camera Permission : "+hasPermission);

      if (hasPermission) {
        // Handle permission denied
      }else{
        requestPermission();
      }
    // };
  
    // requestCameraPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'code-128'],
    onCodeScanned: (codes) => {
    console.log(`Scanned ${codes.length} codes!`);
    var onBarCodeScan = props.onBarCodeScanGotData;
    if (onBarCodeScan != undefined && codes.length > 0) {
        console.log(`Scanned ${JSON.stringify(codes[0].value)} code!`);
        onBarCodeScan(codes[0].value);
    }
}
  })
  return hasPermission&&<Camera style={StyleSheet.absoluteFill} {...props} isActive={true} device={device} codeScanner={codeScanner} />
}