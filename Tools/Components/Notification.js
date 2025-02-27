import React, { Component, useEffect, useState } from 'react'
import {Platform,Alert, View,AppState,StyleSheet } from 'react-native'
// import messaging from '@react-native-firebase/messaging';
import WebServices from '../../Tools/constants/WebServices'
import * as Tools from '../Components/Tools';
import OpenFullScreen from './OpenFullScreen';
import {requestNotifications} from 'react-native-permissions';
import {  StateContext } from '../context/ContextState';
import { useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import ReactMoE from 'react-native-moengage'
export default function Notification(props){
  const {pageContent, setPageContent} = useContext(StateContext);
  const [appState, setAppState] = useState(AppState.currentState);
  const [notificationIn, setNotificationIn] = useState(undefined);
  const [registerToken, setregisterToken] = useState(undefined);
  const [fcmRegistered, setfcmRegistered] = useState(false);
  const [refreshing,setRefreshing]= useState(false);
  const { state, dispatch } = useAppContext();
  // const ReactMoE = require('react-native-moengage')
  //   return <NotificationC {...props} pageContent={pageContent} setPageContent={setPageContent}/>
  // }
  // class NotificationC extends Component {
  
  
  onRegister=(token)=>{
    setregisterToken(token.token)
    setfcmRegistered(true)
  }
  
  useEffect(()=>{
    // AppState.addEventListener('change', _handleAppStateChange);
    
    if(Platform.OS=='ios'){
      ReactMoE.registerForPush();
      // ReactMoE.registerForProvisionalPush(); 
    }else{
      ReactMoE.requestPushPermissionAndroid()  
    }
    
    // ReactMoE.setEventListener("pushTokenGenerated", (payload) => { 
    //   console.log("pushTokenGenerated", payload); 
    // });
    // console.log("pushClickedTest"); 
    // ReactMoE.setEventListener("pushClicked", (notificationPayload) => { 
    //   console.log("pushClicked"); 
    //   console.log("Data push : ", notificationPayload); 
    // });
    
    // ReactMoE.setEventListener("pushTokenGenerated", (payload) => { 
      //   console.log("pushTokenGenerated", payload); 
    // });
    
    // ReactMoE.setEventListener("pushClicked", (notificationPayload) => { 
      //   console.log("pushClicked", notificationPayload); 
    // });
    // checkPermission();
    // messageListener();
    // onTokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
      //   if (!Tools.IsNull(fcmToken)){
    //     console.log("Notify Token :"+fcmToken);
    //     ReactMoE.passFcmPushToken(fcmToken);
    //     if(global.mobileToken!=fcmToken){
    //       updateToken(fcmToken);
    //     }
    //   }
    // });
    
    return()=>{
      // if(_handleAppStateChange!=undefined&&AppState!=undefined)
      //   AppState.removeEventListener('change', _handleAppStateChange);
    };
    
  },[])
  

  updateToken=(LaccessToken)=>{
    global.mobileToken=LaccessToken;
    return;
  }
  
  createPageContent= (pageData)=>{
    // console.log("createPageContent"+JSON.stringify(pageData));
    // if(Tools.IsNull(pageData.data.nav_type))
    {
      let pageContentIn={
        backgroundWallOpacity:0.8,
        type:'notification',
        data:pageData,
        onDone:(stateIn)=>{
          onDone(stateIn);
        }
      }
      global.pageContent=pageContentIn;
      setPageContent(pageContentIn);
    }
  }
  const messageListener = async () => {
    console.log("messageListener");
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //   const { title, body }  =remoteMessage.notification;
    //   console.log("NotificationList : "+JSON.stringify(remoteMessage));
    //   // this.ReacttoNotification(title,body);
    //   setNotificationIn(remoteMessage)
    //   createPageContent(remoteMessage);
    //   updateNotification(remoteMessage.messageId,"read");
    // });
    
    foreGroundMsg = messaging().onMessage((remoteMessage) => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      const { title, body }  =remoteMessage.notification;
      console.log("NotificationList : "+JSON.stringify(remoteMessage));
      // this.ReacttoNotification(title,body);
      // ReactMoE.passFcmPushPayload(remoteMessage);
      setNotificationIn(remoteMessage)
      createPageContent(remoteMessage);
      if(!Tools.IsNull(notificationOpen)&&!Tools.IsNull(notificationOpen.messageId))
        updateNotification(remoteMessage.messageId,"read");
    });
    
    notificationOpenedListener = messaging().onNotificationOpenedApp((notificationOpen) => {
      const { title, body }  = notificationOpen.notification;
      console.log('No :'+JSON.stringify(notificationOpen));
      // Alert.alert('A new FCM message arrived!', JSON.stringify(notificationOpen.notification));
      // ReactMoE.passFcmPushPayload(notificationOpen);
      setNotificationIn(notificationOpen);
      createPageContent(notificationOpen);
      if(!Tools.IsNull(notificationOpen)&&!Tools.IsNull(notificationOpen.messageId))
        updateNotification(notificationOpen.messageId,"read");
    });
    
    // const notificationOpen = await messaging().getInitialNotification();
    // if (notificationOpen) {
    //   const { title, body } = notificationOpen.notification;
    //   this.movetoPage(body);
    // }
    
  }
  updateNotification=(_notifyId,_action)=>{
    {
      // console.log('ID:'+_notifyId+"/"+state.accessToken.access_token);
      const verifyurl= WebServices.UpdateNotification.replace('{NotifyID}',_notifyId).replace('{action}',_action);
      // console.log("URL updateNotification : "+verifyurl);
      try{
        return fetch(WebServices.MainURL +verifyurl, {
          method: 'POST',
          headers: {
            'Authorization':'Bearer '+state.accessToken.access_token,
            'Content-Type': 'application/json',
          },
        }, WebServices.timeout)
        .then((response) =>   {
          setRefreshing(false);
          if(response.ok)
            return response.text();
          else{
            // console.log("updateNotification : "+(response.text()));
            return response.text();
          }}).then((responseJson) => {
            // console.log("updateNotification : "+(responseJson));
          })
          .catch((error) =>{
            console.error("updateNotification-"+error);
          });
        }
        catch(error){
          console.error("updateNotification-"+error);
        }
      }
    }
    showAlert = (title, message) => {
      Alert.alert(
        title,
        message,
        [{text: 'Ok', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
    
    
    
    
    onDone=(stateIn)=>{
      setNotificationIn(undefined);
      const navigation = useNavigation();
      console.log(JSON.stringify(pageContent.data));
      if(stateIn){
        if(Tools.IsNull(pageContent.data.nav_type)){
          
        }else if(pageContent.data.nav_type=='viewurl')
          {
          if(pageContent.data.nav_prmtr.length>0){
            navigation.navigate('Adpage',{
              url:pageContent.data.nav_prmtr
            })
          }
        }else{
          navigation.navigate(Tools.getAppNames(pageContent.data.nav_url),Tools.getScreen(pageContent.data.nav_prmtr));
        }
      }
      setPageContent(undefined);
    }
    
    
    return (<>
      </>
    )
  }

  