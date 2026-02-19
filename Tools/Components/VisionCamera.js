import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

export default function VisionCamera(props) {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const hasScanned = useRef(false);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, []);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'code-128'],
        onCodeScanned: (codes) => {
            // Guard: prevent multiple scans firing
            if (hasScanned.current) return;

            const onBarCodeScan = props.onBarCodeScanGotData;
            // FIX: both conditions AND the callback must be inside the if-block
            if (onBarCodeScan != undefined && codes.length > 0) {
                hasScanned.current = true;
                onBarCodeScan(codes[0].value);
            }
        }
    });

    if (!hasPermission || !device) return null;

    return (
        <Camera
            style={StyleSheet.absoluteFill}
            {...props}
            isActive={true}
            device={device}
            codeScanner={codeScanner}
        />
    );
}