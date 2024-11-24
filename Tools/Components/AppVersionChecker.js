import React, { PureComponent, useEffect, useReducer, useState } from 'react';
import { SafeAreaView, Text, Dimensions, StyleSheet,Linking,TouchableOpacity,Platform } from 'react-native';
const { width } = Dimensions.get('window');
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import { getAppstoreAppVersion } from "react-native-appstore-version-checker";
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import { checkVersion } from "react-native-check-version";
import Colors from '../constants/Colors';

import * as Tools from './Tools'
import WebServices from '../constants/WebServices';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeProvider';
import AppReducer, { initialState, useAppContext } from '../../src/js/reducers/AppReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactMoE, { MoEAppStatus } from 'react-native-moengage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function AppVersionChecker(props){
  const { state, dispatch } = useAppContext();
  
  const Colors=useTheme();
  i18n.translations = state.i18ntranslation;
  CurrentiOSversion='2.1.5';
  CurrentAndroidversion='2.1.5';
  const [needUpdate,setNeedUpdate]=useState(false);
  const [canshow,setcanshow]=useState(false);
  
  getVersionNo=(_no)=>{
    Numb=0;
    _no=_no.replace('.','');
    // console.log("test"+Number(_no));
    return Number(_no);
    
  }
  useEffect(()=>{
    global.CurrentiOSversion=CurrentiOSversion;
    global.CurrentAndroidversion=CurrentAndroidversion;
    global.needUpdate=false;
    async function versionCheck() {
      try {
        const version = await checkVersion();
        const versionNo=getVersionNo(version.version);
        
        const storedVersion = await AsyncStorage.getItem('appVersion');
        console.log(JSON.stringify(storedVersion));
        if (!storedVersion) {
          // First install
          console.log('Welcome', 'Thanks for installing the app!');
          await AsyncStorage.setItem('appVersion', ""+versionNo);
          
          //For Fresh Install of App
          ReactMoE.setAppStatus(MoEAppStatus.Install);
          
        } else if (storedVersion !== (""+versionNo)) {
          // Update
          console.log('Update Detected', 'Thanks for updating the app!');
          await AsyncStorage.setItem('appVersion', ""+versionNo);
          
          // For Existing user who has updated the app
          ReactMoE.setAppStatus(MoEAppStatus.Update);
        } else {
          // Normal launch (no change in version)
        }
        
        console.log(state.isConnected+":"+versionNo+"//"+getVersionNo(CurrentiOSversion));
        if (Platform.OS==='ios'?(versionNo>getVersionNo(CurrentiOSversion)):(versionNo>getVersionNo(CurrentAndroidversion))) {
          setcanshow(true);
          setNeedUpdate(true);
          dispatch({
            type: 'update_App',
            stateIn: true
          });
          // global.needUpdate=true;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    versionCheck();
    
  },[])
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    offlineContainer: {
      backgroundColor: Colors.orangeColor,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width,
      position: 'absolute',
      top: StatusBar.currentHeight==null?insets.top:StatusBar.currentHeight+ heightPercentageToDP(.8)-5,
      zIndex:10,
    },
    offlineTextClose: { 
      color: '#fff',
      fontFamily:'Cairo-Bold',
      fontSize:20,
      textAlign:'left',
      marginHorizontal:widthPercentageToDP('3%'),
      transform:[{scaleX:1.25}]
    },
    offlineText: { 
      color: '#fff',
      flex:1,
      fontFamily:'Cairo-Regular',
      textAlign:'left',
      marginStart:widthPercentageToDP(12)
    },
    updateBut:{
      backgroundColor: '#fff',
      borderRadius:20,
      flex:0.3,
      marginEnd:widthPercentageToDP('4%'),
      height:35,
      alignSelf:'center',
      justifyContent:'center',
    },
    updateText: { 
      color: Colors.orangeColor,
      fontFamily:'Cairo-Regular',
      justifyContent:'center',
      alignSelf:'center',
      fontSize:16,height:30
    }, shadow:{
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 3,
      shadowOpacity: 0.12,elevation:3
    },
  });
  
  if ((state.isConnected&&needUpdate&&canshow))
    {
    return (
      <SafeAreaView style={styles.offlineContainer}>
      
      <Text allowFontScaling={false} style={[styles.offlineText,{fontSize:Tools.stringIsContains(i18n.locale,"en")?18:16,
        height:35}]}>{i18n.t('newupdate')}</Text>
        <TouchableOpacity 
        onPress={()=>{
          if(Platform.OS==='ios'){
            Linking.openURL(WebServices.iosApp);
          }else{
            Linking.openURL(WebServices.androidApp);
          }
          setNeedUpdate(false);
        }} style={[styles.updateBut,styles.shadow]}><Text allowFontScaling={false} style={styles.updateText}>{i18n.t('update')}</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>{setcanshow(false)}}><Text allowFontScaling={false} style={[styles.offlineTextClose,
        ]}>X</Text>
        </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return null;
  }
  
  
  
  