// import 'react-native-gesture-handler';
import SecureStore from './Tools/Components/SecureStore';
import React, { useEffect, useState } from 'react';
import { Linking, StatusBar, StyleSheet, View,Text, Appearance} from 'react-native';
import Localisation from './Tools/Components/Localisation';
import { ThemeProvider } from './Tools/context/ThemeProvider';
import * as Tools from './Tools/Components/Tools'
import LightColors from './Tools/constants/LightColors';
import AppProvider from './src/js/reducers/AppReducer';
import ReactMoE, { MoEAnalyticsConfig, MoEInitConfig, MoEPushConfig,MoEngageLogConfig, MoEngageLogLevel } from 'react-native-moengage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import RNBootSplash from 'react-native-bootsplash';

export default function App (props) {
  const [fontload,setFontLoad]=useState(false);
  const [isEnabledForReleaseBuild,setisEnabledForReleaseBuild]=useState(true);
  
  
  useEffect(()=>{
    
    const moEInitConfig = new MoEInitConfig(
      // MoEPushConfig.defaultConfig(),
      new MoEPushConfig(true),
      new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, isEnabledForReleaseBuild),
      new MoEAnalyticsConfig(true)
    );
    ReactMoE.initialize("DCMBBW4GE1CX78NNNXFU1VN8", moEInitConfig);

    global.initProfile=undefined;
    global.rateVisible=false;
    global.loadingBar=0;
    global.showRegister=false;
    global.showHamView=true;
    global.checkBio=false;
    global.bgColor=Tools.hextorgb(LightColors.bluelightShadeColor);
    global.pageContent=undefined;
    global.AdVisible=undefined;
    
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    errorFix();
    setFontLoad(true);
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
      ReactMoE.showInApp();
    }, 1000);
    
    return () => {
      // This code will run when the component unmounts
      // You can perform any cleanup tasks here, such as
      // canceling network requests, unsubscribing from subscriptions, etc.
      SecureStore.setItemAsync('initLogin','');
      
    };
  },[])
  
  const errorFix=()=>{
    global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    global.FormData = global.originalFormData || global.FormData;
    
    if (window.FETCH_SUPPORT) {
      window.FETCH_SUPPORT.blob = false;
    } else {
      global.Blob = global.originalBlob || global.Blob;
      global.FileReader = global.originalFileReader || global.FileReader;
    }
  }
  
  
  return (
    <KeyboardProvider>
    <SafeAreaProvider>
    <ThemeProvider>
    {/* <StatusBar translucent barStyle='dark-content' backgroundColor='rgba(0,0,0,0)'/> */}
    <View style={styles.container}>
    <AppProvider>
    {fontload&&(<Localisation props={props}/>)}
    </AppProvider>
    </View> 
    </ThemeProvider>
    </SafeAreaProvider></KeyboardProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    }
  });
  
  