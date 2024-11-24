import React, { useEffect } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

const InviteCode = () => {
    //   useEffect(() => {
    //     // Listen for postMessage events from the WebView
    //     const handleMessage = (event) => {
    //       try {
    //         const data = JSON.parse(event.nativeEvent.data);
    //         if (data && data.key === 'myData') {
    //           const receivedValue = data.value;
    //           console.log('Received data from WebView:', receivedValue);
    //         }
    //       } catch (error) {
    //         console.error('Error parsing message:', error);
    //       }
    //     };
    
    //     window.addEventListener('message', handleMessage);
    
    //     // Clean up the event listener when the component unmounts
    //     return () => {
    //         window.removeEventListener('message', handleMessage);
    //     };
    //   }, []);
    
    return (
        <View style={{position:'absolute',width:0,height:0}}>
        <WebView
        source={{uri:"https://leisure.qa/invite/get.html"}}
        />
        </View>
        );
    };
    
    export default InviteCode;