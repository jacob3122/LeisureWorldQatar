// import Application from './AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {MainTabNavigator} from './MainTabNavigator';
import OpenFullScreen from '../Components/OpenFullScreen';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { act, useContext, useState } from 'react';
import { createNavigationContainerRef } from "@react-navigation/native"
import { StateContext} from '../context/ContextState';
import { View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import HamBurgerMenu from './HamBurgerMenu';
import * as Tools from '../Components/Tools'
import Notification from '../Components/Notification';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import SecureStore from '../Components/SecureStore';
import InviteCode from './InviteCode';
import ProfileData from '../Components/ProfileData';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import InfoBar from '../Components/InfoBar';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import WebServices from '../constants/WebServices';
const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();
function AppNavigation({notification}) {
  const { state, dispatch } = useAppContext();
  const {bottomBar, setBottomBar} = useContext(StateContext);
  const {pageContent, setPageContent} = useContext(StateContext);
  const {referralCode, setReferralCode} = useContext(StateContext);
  const {openProductCode, setOpenProductCode} = useContext(StateContext);
  const {pageToGo, setPageToGo} = useContext(StateContext);
  const [routeName, setRouteName] = useState();
  const [prevrouteName, setPrevRouteName] = useState();
  
  const getRouteName=()=>{
    return routeName;
  }
  useEffect(()=>{
    // console.log('Notification');
    if(!Tools.IsNull(notification)){
      console.log(JSON.stringify(notification));
      reactToNotification(notification);
    }
  },[notification]);
  //#region  ReferralCode fromURL
  useEffect(() => {
    const getInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        // console.log('getInitialUrl'+initialUrl);
        
        if (!Tools.IsNull(initialUrl)) {
          
          const url = initialUrl;
          InitialURLNavigation(url);
          // const queryStartIndex = initialUrl.indexOf('?');
          // if (queryStartIndex !== -1) {
          //   const queryString = initialUrl.slice(queryStartIndex + 1);
          //   console.log("getInitialUrl Ap: " + queryString);
          //   const params = parseQueryString(queryString);
          //   console.log("getInitialUrl params: " + JSON.stringify(params));
          //   const referralCode = params.referralcode;
          
          //   if (referralCode) {
          //     setreferralCode(referralCode);
          //   }
          // }
        }
      } catch (error) {
        setreferralCode("");
        console.error('Error handling initial URL:', error);
      }
    };
    
    
    getInitialUrl();
    const parseQueryStringDL=(queryString)=> {
      const params = {};
      const pairs = queryString.split('&');
      
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
      
      return params;
    }
    
    const getDeepLinkParams = (event) => {
      try {
        // console.log('getDeepLinkParams'+event.url);
        
        const url = event.url;
        UrlNavigation(url);
       
        
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };
    
    
    
    Linking.addEventListener('url', getDeepLinkParams);
    
    // Remove the event listener when the component unmounts
    return () => {
      // Linking.removeEventListener('url', getDeepLink);
    };
    
  }, []);
  const InitialURLNavigation=(_url)=>{
    // console.log("InitialURLNavigation "+_url);
    const url=_url;
    const match = url.match(/:\/\/([^\/]+)\?(.*)/);
    if (match && match[1] && match[2]) {
      // console.log("URL if "+url);
      const action = match[1];

      const queryParams = match[2];
      const params = parseQueryStringDL(queryParams);
      
      // console.log('Action:', action);
      // console.log('Referral Code:', params['referralcode']);
      
      if (action === 'refer' && params['referralcode']) {
        const referralCode = params['referralcode'];
        setreferralCode(referralCode);
      }
    }else{
      // console.log("URL "+url);
      const pathSegments = url.split('/').filter(segment => segment);
      
      // Assuming the URL structure is known and fixed
      if (pathSegments.length>3) {
        action = pathSegments[2];
        code = pathSegments[3];
      }
      console.log("Page "+action);
      console.log("View "+code);
      if(action==WebServices.DeepLinkCode){
        // console.log(pathSegments.length+"=InitialUrlCode "+code);
        if(code=='store'&&pathSegments.length>3&&Tools.stringIsContains(url,"=")){
          const _segments = pathSegments[4].split('=');
          console.log(_segments);
          setOpenProductCode(_segments[1]);
        }else if(pathSegments.length>3){
          if (action==WebServices.ProductCode) {
            setOpenProductCode(code);
          }
          // console.log(_segments);
          navigationRef.navigate(getAppNames(code),getScreen(pathSegments[4]));
        }
      }else{
        console.log("URL else "+url);
        
        if (action==WebServices.ProductCode) {
          setOpenProductCode(code);
        }else{
        navigationRef.navigate(getAppNames(action),getScreen(code));
        }
      }
    }
  }
  const getAppNames=(_code)=>{
    if(_code=='home'||_code=='events'){
      return 'Homescreen'
    }else if(_code=='wallet'){
      return 'Walletscreen'
    }else if(_code=='rewards'){
      return 'Cardscreen'
    }else if(_code=='partners'){
      return 'Parkscreen'
    }else if(_code=='store'||_code=='product'){
      return 'Storescreen'
    }
    
  }
  
  
  const reactToNotification=(_notification)=>{
    if(!Tools.IsNull(_notification)&&!Tools.IsNull(_notification.data)&&!Tools.IsNull(_notification.data.payload)
      &&!Tools.IsNull(_notification.data.payload.moeFeatures)&&!Tools.IsNull(_notification.data.payload.moeFeatures.richPush)&&!Tools.IsNull(_notification.data.payload.moeFeatures.richPush.defaultActions)&&
    _notification.data.payload.moeFeatures.richPush.defaultActions.length>0&&_notification.data.payload.moeFeatures.richPush.defaultActions[0].type=="deepLink"){
      InitialURLNavigation(_notification.data.payload.moeFeatures.richPush.defaultActions[0].value);
    }
  }
  const UrlNavigation=(_url)=>{
    try{
      const url = _url;
      const match = url.match(/:\/\/([^\/]+)\?(.*)/);
      if (match && match[1] && match[2]) {
        const action = match[1];
        const queryParams = match[2];
        const params = parseQueryStringDL(queryParams);
        
        // console.log('Action:', action);
        
        // console.log('param:', JSON.stringify(params));
        
        if (action === 'refer' && params['referralcode']) {
          const referralCode = params['referralcode'];
          setreferralCode(referralCode);
        }else if(params['view']){
          // console.log('P:',params['view'])
          navigationRef.navigate(getAppNames(action),getScreen(params['view']));
        }
      }
      else{
        const pathSegments = url.split('/').filter(segment => segment);
        // console.log("P :"+pathSegments.length);
        for (let index = 0; index < pathSegments.length; index++) {
          const element = pathSegments[index];
          // console.log(element);
          
        }
        // Assuming the URL structure is known and fixed
        if (pathSegments.length>3) {
          action = pathSegments[2];
          code = pathSegments[3];
        }
        // console.log("Page "+action);
        // console.log("View "+code);
        if(action==WebServices.DeepLinkCode){
          // console.log(pathSegments.length+"=DeepLinkCode "+code);
          // console.log("DeepLinkCode "+code);
          if(code=='store'&&pathSegments.length>3&&Tools.stringIsContains(url,"=")){
            const _segments = pathSegments[4].split('=');
            // console.log(_segments);
            console.log("DeepLinkCode "+code);
            setOpenProductCode(_segments[1]);
          }else if(pathSegments.length>3){
            const _segments = pathSegments[4].split('=');
            // console.log(_segments);
            if (action==WebServices.ProductCode) {
              setOpenProductCode(code);
            }
            navigationRef.navigate(getAppNames(code),getScreen(_segments[0]));
          }
        }else{
          if (action==WebServices.ProductCode) {
            setOpenProductCode(code);
          }else{
            navigationRef.navigate(getAppNames(action),getScreen(code));
          }
        }
      }
    }catch (error) {
      console.error('Error handling deep link:', error);
    }
  }
  
  const getScreenName=(_code)=>{
    return _code;
    
  }
  const getScreen=(_code)=>{
    if(!Tools.stringIsEmpty(_code)){
      return {screen:getScreenName(_code)}
    }else{
      return {}
    }
  }
  
  useEffect(()=>{
    if(!Tools.IsNull(openProductCode)){
      // console.log("Open IN :"+openProductCode);
      // const navigationIn=useNavigation();
      navigationRef.navigate('Storescreen');
    }
    // console.log("Open P :"+openProductCode);
  },[openProductCode])
  
  const parseQueryString=(queryString)=>{
    // console.log("parseQueryStringAp : "+queryString);
    
    const params = {};
    if(!Tools.stringIsContains(queryString,"&")){
      const parts = queryString.split('=');
      if (parts.length === 2) {
        // console.log(decodeURIComponent(parts[0])+" : "+decodeURIComponent(parts[1]));
        
        const key = decodeURIComponent(parts[0]);
        const value = decodeURIComponent(parts[1]);
        params[key] = value;
      }
    }else{
      queryString.split('&').forEach(param => {
        const parts = param.split('=');
        if (parts.length === 2) {
          // console.log(decodeURIComponent(parts[0])+" : "+decodeURIComponent(parts[1]));
          
          const key = decodeURIComponent(parts[0]);
          const value = decodeURIComponent(parts[1]);
          params[key] = value;
        }
      });
    }
    return params;
  }
  
  const setreferralCode=(_code)=>{
    SecureStore.setItemAsync('referralCode',_code);
    global.referralCode=_code;
    setReferralCode(_code);
    // console.log("Referral Code : "+_code);
    
  }
  //#endregion
  return (
    <View style={{width:'100%',height:'100%',backgroundColor:Colors.bgColor}}>
    <NavigationContainer    
    ref={navigationRef}
    onReady={() => {
      setRouteName(navigationRef.getCurrentRoute().name)
    }}
    onStateChange={async () => {
      const previousRouteName = routeName;
      const currentRouteName = navigationRef.getCurrentRoute().name;
      setRouteName(currentRouteName);
      setPrevRouteName(previousRouteName);
      // console.log(previousRouteName+"//"+currentRouteName);
      if(Tools.stringIsContains(currentRouteName,'home')){
        global.showHamView=true
      }else{
        global.showHamView=false
      }
      if(currentRouteName=="Home"){
        setBottomBar(1);
      }
    }}
    >
    <Notification navigation={navigationRef}/>
    <HamBurgerMenu referralCode={referralCode} routeNameOut={prevrouteName} routeNameIn={routeName} navigation={navigationRef}>
    <OpenFullScreen pageContent={pageContent} navigation={navigationRef}/>
    
    {/* <View style={{position:'absolute',top:0,height:'100%'}}>
      <ProfileData pagetogo={pageToGo} navigation={navigationRef}/></View> */}
      {/* <View style={{position:'absolute',bottom:0,width:'100%',backgroundColor:'transparent',height:StaticSafeAreaInsets.safeAreaInsetsBottom+heightPercentageToDP(15)}}> */}
      <Stack.Navigator initialRouteName="Main" 
      screenOptions={{
        cardStyle: { backgroundColor: 'lightblue' },
        headerShown:false
      }}>
      
      <Stack.Screen name="Main" 
      component={MainTabNavigator} 
      // initialParams={{ navigationRef: getRouteName }}
      />
      </Stack.Navigator>
      {/* </View> */}
      
      </HamBurgerMenu>
      </NavigationContainer>
      
      <View style={{position:'absolute',height:'112%',width:'80%',alignSelf:'center'}} pointerEvents="box-none">
      {state.ShowInfo!=undefined&&<InfoBar textToDisplay={state.ShowInfo.textToDisplay} isopen={true}/>}
      </View>
      </View>
    );
  }
  
  export default AppNavigation;
  
  
  