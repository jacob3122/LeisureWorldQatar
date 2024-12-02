import React, { useEffect, useMemo, useRef, useState } from 'react';
import {View,Alert,AppState,StatusBar,Platform, SafeAreaView, DeviceEventEmitter} from 'react-native';
import { AccountHandle } from './AccountHandle.js';
import CardHandle  from './CardHandle.js';
import { OfferHandle } from './OfferHandle.js';
import AccountEditor from '../../Pages/StackPage/AccountEditor.js';
import ReciptsHandle from '../../Pages/StackPage/ReciptsHandle.js';
import SecureStore from '../../Tools/Components/SecureStore';
import ClaimsHandle from '../../Pages/StackPage/ClaimsHandle.js';
import RedeemHandle from '../../Pages/StackPage/RedeemHandle.js';
import PasswordHandle from '../../Pages/StackPage/PasswordHandle.js';
import SettingsHandle from '../../Pages/StackPage/SettingsHandle.js';
import ReferFriendHandle from '../../Pages/StackPage/ReferFriendHandle.js';
import RedeemVoucher from '../../Pages/StackPage/RedeemVoucher';
import RedeemVenu from '../../Pages/StackPage/RedeemVenu';
import OfflineNotice from './OfflineNotice.js'
// import { NavigationEvents } from 'react-navigation';
// import Rate, { AndroidMarket } from 'react-native-rate';
import moment from'moment'
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

import OverlayLoad from './OverlayLoad.js';
import PointsHandle from '../../Pages/StackPage/PointsHandle.js';

import WebServices from '../../Tools/constants/WebServices'
import * as Tools from '../Components/Tools'
import PopUpVoucher from './PopUpVoucher.js';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import Colors from '../constants/Colors.js';
import RegisterUser from './RegisterUser.js';
import SigninUser from './SigninUser.js';
import Banner from './Banner.js';
import AppVersionChecker from './AppVersionChecker.js';
import RulesPage from './RulesPage.js';
import VoucherPage from './VoucherPage.js';
import StorePage from '../../Pages/StackPage/StorePage.js';
import Verfication from './Verification.js';
import OtpVerify from './OtpVerify.js'
import ChangePassword from './ChangePassword.js';
import CardsPage from '../../Pages/StackPage/CardsPage.js';
import OrdersPage from '../../Pages/StackPage/OrdersPage.js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EventsPage from '../../Pages/StackPage/EventsPage.js';
import {updateCart} from '../../src/js/actions/profileActions';
import AdnHome from './AdnHome.js';
import ReactNativeBiometrics from 'react-native-biometrics';
import HamBurgerMenu from '../Navigation/HamBurgerMenu.js';
import BiometricRequest from './BiometricRequest.js';
import NotificationPage from './NotificationPage.js';
import Notification from './Notification.js';
import PointsSystemPage from '../../Pages/StackPage/PointsSystemPage.js';
import AddCardsPage from '../../Pages/StackPage/AddCardsPage.js';
import BenefitsHandle from '../../Pages/StackPage/BenefitsHandle.js';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';
import GoogleRecaptcha, {
  GoogleRecaptchaSize,
  GoogleRecaptchaToken,
  GoogleRecaptchaRefAttributes
} from 'react-native-google-recaptcha'
import ReactMoE from 'react-native-moengage';
import { dataDetectorType } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes.js';
import { logClaimEvent, logLoginEvent, logLogoutEvent } from '../Analytics/AppAnalytics.js';
const PopupInfo={
  Title:'',
  SubHeading:'',
  ContentCode:'',
  Buttons:[],
} 


export default function ProfileData(props) {
  const { state, dispatch } = useAppContext();
  i18n.translations = state.i18ntranslation;
  let _isMounted=false;
  let FeedBack=[];
  let loaded=0;
  let intervalSignin=undefined;
  // constructor(props) {
  // super(props);
  const [isLoading,setIsLoading]=useState(false);
  const [feedBackInfo,setfeedBackInfo]=useState([]);
  const [canpop,setcanpop]=useState(0);
  const [showPop,setshowPop]=useState(false);
  const [showOtp,setshowOtp]=useState(false);
  const [reload,setreload]=useState(false);
  const [rated,setrated]=useState(false);
  const [ratePoints,setratePoints]=useState(0);
  const [pagetogo,setpagetogo]=useState('');
  const [useBiometric,setuseBiometric]=useState(false);
  const [showForgetPass,setshowForgetPass]=useState(false);
  const [forgetPassData,setforgetPassData]=useState(undefined);
  const [storeCatalog,setstoreCatalog]=useState([]);
  const [showBiometricPermission,setshowBiometricPermission]=useState(false);
  const [biometricCheck,setbiometricCheck]=useState(false);
  const [dontShowBioAgain,setdontShowBioAgain]=useState(false);
  const [biometryIn,setbiometryIn]=useState({available:false});
  const [popupInfo,setpopupInfo]=useState({});
  const [profileIn,setprofileIn]=useState({});
  const [otpVerifyModal,setotpVerifyModal]=useState(false);
  const [appState,setappState]=useState(AppState.currentState);
  const [loginOpen,setloginOpen]=useState(true);
  const [setpass,setsetpass]=useState(undefined);
  const [otpChangePassModal,setotpChangePassModal]=useState(false);
  const [claimCheck,setclaimCheck]=useState(false);
  // const [callbackOnDelete,setcallbackOnDelete]=useState(undefined);
  const [bioKey,setBioKey]=useState(undefined);
  const [showOtpError,setshowOtpError]=useState(false)
  const [rnBiometrics,setrnBiometrics]=useState(undefined)
  
  const [googleToken,setgoogleToken]=useState('');
  let recaptchaRef=React.createRef();
  
  const createBioKey=async ()=>{
    rnBiometrics.createKeys()
    .then((resultObject) => {
      const { publicKey } = resultObject
      // console.log("BioKey Create"+publicKey);
      SecureStore.setItemAsync('biokey',publicKey);
      // setState({bioKey:publicKey})
      setBioKey(publicKey)
    })
  }
  const setDontShowBio=(stateIn)=>{
    // console.log("setDontShowBio"+stateIn)
    
    SecureStore.setItemAsync('dontshowAgain',stateIn);
    // setState({dontShowBioAgain:stateIn});
    setdontShowBioAgain(stateIn);
  }
  useEffect(()=>{
    console.log("OTP : "+otpVerifyModal);
  },[otpVerifyModal])
  
  useEffect(()=>{
    const AsyncProcess = async () => {
      // SecureStore.removeItemAsync('dontshowAgain');
      SecureStore.getItemAsync('useBiometric').then(valIn=>{
        // console.log("useBio : "+valIn);
        if(valIn=='Y'){
          // setState({useBiometric:true});
          setuseBiometric(true);
        }else{
          if(valIn=='N')
            setshowBiometricPermission(true);
          // setState({useBiometric:false});
          setuseBiometric(false);
        }
      });
      SecureStore.getItemAsync('dontshowAgain').then(valIn=>{
        // console.log("setDontShowBio"+valIn)
        // setState({dontShowBioAgain:(valIn=="Y")?true:false});
        setdontShowBioAgain((valIn=="Y")?true:false);
      });
      setrnBiometrics(new ReactNativeBiometrics({ allowDeviceCredentials: true }));
      
    }
    AsyncProcess();
    return()=>{
      DeviceEventEmitter.removeAllListeners("signout",()=>{
        SignOut();
      })
      _isMounted=false;
    }
  },[])
  
  useEffect(()=>{
    const AsyncProcess = async () => {
      biometry = await rnBiometrics.isSensorAvailable();
      // setState({biometryIn:biometry})
      setbiometryIn(biometry);
      if(biometry.available){
        rnBiometrics.biometricKeysExist()
        .then((resultObject) => {
          const { keysExist } = resultObject
          // console.log("BioKey"+JSON.stringify(resultObject));
          if (keysExist) {
            // console.log('Keys exist')
            SecureStore.getItemAsync('biokey').then(publicKey=>{
              if(Tools.IsNull(publicKey)){
                createBioKey();
              }else{
                // setState({bioKey:publicKey})
                setBioKey(publicKey);
              }
            });
          } else {
            // console.log('Keys do not exist or were deleted')
            createBioKey();
          }
        })
        
      }
      _isMounted=true;
      // AppState.addEventListener('change', _handleAppStateChange);
      SecureStore.getItemAsync('appRated').then(appRate=>{
        // console.log('LC :'+languagecheck);
        if(_isMounted){
          if(Tools.stringIsContains(appRate,'true'))
            setrated(true);
          else
          setrated(false);
        }
      });
      
      DeviceEventEmitter.addListener("signout",()=>{
        SignOut();
      })
    }
    if(rnBiometrics!=undefined){
      AsyncProcess();
    }
  },rnBiometrics)
  
  
  
  const showAlert=(feedInfo)=>{
    if(feedInfo.length>0&&feedInfo[0]!=undefined)
      Alert.alert(feedInfo[0],(feedInfo[1]==undefined?'':feedInfo[1]));
    FeedBack=[];
  }
  
  
  feedIn=[];
  const onloadEnd=()=>{
    if(state.onExitDismiss.FeedBack!=undefined&&state.onExitDismiss.FeedBack.length>0){
      // console.log(state.onExitDismiss.FeedBack);
      FeedBack=state.onExitDismiss.FeedBack;
      // console.log("Loading End"+FeedBack.length);
      if(FeedBack!=undefined&&FeedBack!=[]&&FeedBack.length>0&&feedIn!=FeedBack){
        Alert.alert(FeedBack[0],(FeedBack[1]==undefined?'':FeedBack[1]));
        feedIn=FeedBack;
        // props.updateonDismiss({'FeedBack':FeedBack});
        
      }
    }
  }
  
  const handler=(someValue)=> {
    dispatch({
      type: 'update_Profile',
      payload: someValue
    });
    updateProfileWs(someValue);
  }
  const setloading=(loadstate)=>{
    // setloading(loadstate);
    //console.log("isloading "+loadstate);
    setIsLoading(loadstate)
  }
  
  const updateMobileToken=async (LaccessToken=null,biotoken=null,profile=null)=>
    {
    _profileIn=profile!=null?profile:state.profile!=undefined?state.profile:undefined;
    verifyurl=WebServices.mobileToken;
    // console.log("Device : "+Tools.stringIsEmpty(props.accessToken.MemberID)?'':props.accessToken.MemberID);
    
    var details = {
      'Token': global.mobileToken,
      'DeviceName': Platform.Version,
      'DeviceType': Platform.OS,
      'DeviceAppVersion':Platform.OS=='ios'?global.CurrentiOSversion:global.CurrentAndroidversion,
      'DeviceAppLanguage':i18n.locale,
      'MemberID':Tools.stringIsEmpty(_profileIn.Id)?'':_profileIn.Id,
      "BiometricToken": biotoken==null?(Tools.stringIsEmpty(bioKey)?"":bioKey):biotoken,
      "MemberNotifications": {
        "app": Tools.IsNull(_profileIn.TokenInfo)?true:Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.app)?true:_profileIn.TokenInfo.MemberNotifications.app,
        "email": Tools.IsNull(_profileIn.TokenInfo)?true:Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.email)?true:_profileIn.TokenInfo.MemberNotifications.email,
        "sms": Tools.IsNull(_profileIn.TokenInfo)?true:Tools.IsNull(_profileIn.TokenInfo.MemberNotifications.sms)?true:_profileIn.TokenInfo.MemberNotifications.sms
      },
      "MemberLocations": {
        "country": Tools.IsNull(_profileIn.TokenInfo)?true:Tools.IsNull(_profileIn.TokenInfo.MemberLocations.country)?'':_profileIn.TokenInfo.MemberLocations.country,
        "city": Tools.IsNull(_profileIn.TokenInfo)?true:Tools.IsNull(_profileIn.TokenInfo.MemberLocations.city)?'':_profileIn.TokenInfo.MemberLocations.city
      }
    };
    
    
    // console.info(details);
    // console.log("Token : "+JSON.stringify(details));
    return fetch (WebServices.MainURL+verifyurl,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(details)
    },WebServices.timeout)
    .then((response) => response.text()).then((responseJson) => {
      {
        // console.log('UMT :'+responseJson);
        try {
          dataGot=JSON.parse(responseJson);
        } catch (e) {
          dataGot=undefined;
        }
        if(dataGot!=undefined)
          {
          dispatch({
            type: 'update_Profile',
            payload: dataGot
          });
          SecureStore.setItemAsync('profile',JSON.stringify(dataGot));
        }
      }
    })
    .catch((error) =>{
      // console.log('UPE '+error);
      setloading(false);
      // setloading(false);
    });
  }
  
  const updateProfilewithMobileToken=(LaccessToken)=>{
    // return;
    // setloading(true);
    // LoaderView.show();
    // if(Tools.stringIsEmpty(global.mobileToken)){
    //   return;
    // }
    
    verifyurl=WebServices.profilewithToken.replace('{MemberID}',state.accessToken.MemberID).replace('{TokenID}',global.mobileToken);
    // console.log('url '+verifyurl);
    // console.log('token :'+LaccessToken);
    
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+LaccessToken,
        'Content-Type': 'application/json',
      },
    }, WebServices.timeout)
    .then((response) =>  response.text())
    .then((responseJson) => {
      dataGot = responseJson;
      // console.log(dataGot);
      // setloading(false);
    })
    .catch((error) =>{
      console.error("MT"+error);
      setloading(false);
    });
    
  }
  
  
  const updateProfileWs=async (someValue)=>{
    setloading(true);
    // LoaderView.show();
    
    var details = {
      'FirstName': someValue.FirstName,
      'FullName': someValue.FirstName,
      'LastName': someValue.LastName,
      'Mobile': someValue.Mobile,
      'Email': someValue.Email,
    };
    
    // console.log('bearer '+props.accessToken.access_token+'//'+JSON.stringify(details));
    
    verifyurl=WebServices.UpdateProfile.replace('{MemberID}',state.accessToken.MemberID);
    // console.log('url '+verifyurl);
    
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+state.accessToken.access_token,
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(details)
    }, WebServices.timeout)
    .then((response) => response.text())
    .then((responseJson) => {
      dataGot = responseJson;
      
      // console.log("J R :"+dataGot);
      if (!Tools.stringIsContains(responseJson, 'error')) {
        if(Tools.stringIsContains(responseJson, 'success')) {
          FeedBack=[(i18n.t('updatesuccess')), i18n.t('profileupdated')];
        }else{
          FeedBack=[(i18n.t('updatefail')), i18n.t('profilenotupdated')];
        }
      }
      else {
        FeedBack=[(i18n.t('updatefail')), dataGot.error];
      }
      showAlert(FeedBack);
      // props.updateonDismiss({'FeedBack':FeedBack});
      setloading(false);
    })
    .catch((error) =>{
      console.error("updateProfileWs"+error);
      setloading(false);
      // LoaderView.close();
    });
  }
  
  const SendMobileOTP=(MobileNo,token=null)=>{
    VerifyMobileLoginOTP(MobileNo,token);
  }
  
  const closeOtp=()=>{
    // if(_isMounted)
    setshowOtp(false);
    // setState({showOtp:false},()=>{
      //   // console.log(state.showOtp+"showotp")
    // });
  }
  
  // closeOtp(){
  //   if(_isMounted)
  //   setState({showOtp:false});
  // }
  
  
  const VerifyOTP=(MobileNo,otp,callback=null,_token=null)=>{
    VerifyLoginwithOTP(MobileNo,otp,callback,_token);
    logLoginEvent("mobileotp",MobileNo);
  }
  
  const forgetPassRequest=async(para1=null,para2=null,callback=null,MobileNo,_token=null)=>{
    const userData = await AsyncStorage.getItem('remaintimecp')
    if(!Tools.IsNull(userData)){
      // console.log("RemainData forgetPassRequest In-"+JSON.stringify(userData));
      const dateVal=parseInt(JSON.stringify(userData).replace('"',''));
      let remain= moment(dateVal).diff(moment(new Date()),"seconds")
      if(remain>0){
        // console.log("forgetPassRequest : "+ remain);
        setforgetPassData(remain);
        setshowForgetPass(true);
        return;
      }
    }
    
    setloading(true);
    InMobileNo=MobileNo;
    // const token= await handleSend();
    return fetch(WebServices.MainURL + WebServices.forgetPass, {
      method: 'GET',
      headers: {
        'MobileNo':InMobileNo,
        'RecToken':_token
      },
    }, WebServices.timeout)
    .then((response) => response.text())
    .then((responseJson) => {
      // console.log(responseJson);
      // LoaderView.close();
      
      // console.log("J R :"+dataGot);
      if (!Tools.stringIsContains(responseJson, 'error')) {
        if (Tools.stringIsContains(responseJson,"notexist")) {
          FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckmobileno')];
          setshowOtpError(true);
        }else if (Tools.stringIsContains(responseJson,"failed")) {
          FeedBack=[i18n.t('loginfail'), ""];
          setshowOtpError(true);
        }
        else if(parseInt(responseJson)==0) {
          FeedBack=[i18n.t('loginfail'), ""];
          setshowOtpError(true);
        }else{
          {
            const remain=moment(new Date()).add(parseInt(responseJson),"seconds");
            if(callback!=null){
              callback(remain);
            }
            // console.log("forgetPassRequest-Remain"+remain);
            const _storeData = async () => {
              try {
                // console.log("_storeDataRemainfp"+remain+new Date().toLocaleTimeString());
                await AsyncStorage.multiSet([
                  ['remaintimecp',(""+remain)],['mobilenocp',""+MobileNo]]
                );
                // console.log("_storeDataRemainfpA"+remain+new Date().toLocaleTimeString());
                
                setTimeout(() => {
                  setforgetPassData(remain);
                  setshowForgetPass(true);
                },100);
              } catch (error) {
                // console.log("forgetPassRequest:"+error)
                // Error saving data
              }
            };
            _storeData();
            
          }
          // console.log("U LM:"+MobileNo);
          // fetchUserProfile(dataGot.MemberID, dataGot.token_type, dataGot.access_token);
        }
      }
      
      showAlert(FeedBack);
      // props.updateonDismiss({'FeedBack':FeedBack});
      setloading(false);
      
    })
    .catch((error) =>{
      console.error("VerifyMobileLoginOTP"+error);
      FeedBack=[i18n.t('loginfail'), ""];
      showAlert(FeedBack);
      setshowOtpError(true);
      setloading(false);
      // LoaderView.close();
    });
  }
  
  const VerifyMobileLoginOTP=async(MobileNo,token=null)=>{
    setloading(true);
    // LoaderView.show();
    InMobileNo=MobileNo;
    // console.log("VerifyMobileLoginOTP");
    // const {token} = await handleSend();
    // console.log("T :"+token);
    return fetch(WebServices.MainURL + WebServices.VerifyLoginOTP, {
      method: 'GET',
      headers: {
        'MobileNo':InMobileNo,
        'RecToken':(Tools.IsNull(token)?googleToken:token)
      },
    }, WebServices.timeout)
    .then((response) => response.text())
    .then((responseJson) => {
      // console.log(responseJson);
      // LoaderView.close();
      
      // console.log("J R :"+dataGot);
      if (!Tools.stringIsContains(responseJson, 'error')) {
        if (Tools.stringIsContains(responseJson,"notexist")) {
          FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckmobileno')];
          setshowOtpError(true);
        }else if (Tools.stringIsContains(responseJson,"failed")) {
          FeedBack=[i18n.t('loginfail'), ""];
          setshowOtpError(true);
        }
        else if(parseInt(responseJson)==0) {
          FeedBack=[i18n.t('loginfail'), ""];
          setshowOtpError(true);
        }else{
          {
            var remain=moment(new Date()).add(parseInt(responseJson),"seconds");
            // console.log("Remain"+remain);
            const _storeData = async () => {
              try {
                // console.log("U LM:"+remain);
                await AsyncStorage.multiSet([
                  ['remaintime',(""+remain)],['mobileno',""+MobileNo]]
                );
              } catch (error) {
                // console.log("VerifyMobileLoginOTP E :"+error)
                // Error saving data
              }
            };
            _storeData();
            setTimeout(() => {
              setshowOtp(true)
            },100);
          }
          // console.log("U LM:"+MobileNo);
          // fetchUserProfile(dataGot.MemberID, dataGot.token_type, dataGot.access_token);
        }
      }
      
      showAlert(FeedBack);
      // props.updateonDismiss({'FeedBack':FeedBack});
      setloading(false);
      
    })
    .catch((error) =>{
      console.error("VerifyMobileLoginOTP"+error);
      FeedBack=[i18n.t('loginfail'), ""];
      showAlert(FeedBack);
      setshowOtpError(true);
      setloading(false);
      // LoaderView.close();
    });
  }
  
  const VerifyLoginwithOTP=async(Lusername,LOTP,callback=null,_token=null)=>{
    if(_isMounted)
      setshowOtp(false);
    setshowOtpError(false);
    setloading(true);
    // LoaderView.show();
    
    // console.info(Lusername+"//"+LOTP);
    
    var details = {
      'mobile': Lusername,
      'otp': LOTP,
      'grant_type': 'MobileOTP'
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    // const tokenIn=await handleSend();
    return fetch(WebServices.MainURL + WebServices.Login, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
        'Content-Type': 'text/plain',
        // 'RecToken':_token
      },
      body: formBody
    }, WebServices.timeout)
    .then((response) => response.text())
    .then((responseJson) => {
      // setloading(false);
      // console.log(responseJson);
      dataGot = JSON.parse(responseJson);
      // console.log("J R :"+dataGot);
      if (!Tools.stringIsContains(responseJson, 'error')) {
        
        if(_isMounted&&showOtp)
          setshowOtp(false);
        
        
        // LoaderView.close();
        if (dataGot == "Failed") {
          setloading(false);
          FeedBack=[i18n.t('loginfail'),i18n.t('pleasecheckcred')];
        }
        else if (dataGot == "NotVerified") {
          setloading(false);
          FeedBack=[i18n.t('loginfail'), i18n.t('pleaseverify')];
        }
        
        else {
          if(dataGot.HasPassword==='1'){
            // props.updateCart(undefined);
            dispatch({
              type: 'update_Cart',
              stateIn: undefined
            });
            dispatch({
              type:"update_AccessToken",
              payload:dataGot
            })
            // props.updateAccessToken(dataGot);
            SecureStore.setItemAsync('accessToken',responseJson);
            fetchUserProfile(dataGot.MemberID, dataGot.access_token,()=>{
              callback()
            },dataGot);
            // fetchCatalogFull();
            var remain=moment(new Date()).add(0,"seconds");
            // console.log("Remain"+remain);
            const _storeData = async () => {
              try {
                await AsyncStorage.multiSet([
                  ['remaintime',(""+remain)],['mobileno','']]
                );
              } catch (error) {
                // console.log("_storeData:"+error)
                // Error saving data
              }
            };
            _storeData();
            
          }else{
            setloading(false);
            // console.log(_isMounted+JSON.stringify(dataGot)+"= Create Password")
            //create Password
            if(_isMounted){
              // setotpve
              setsetpass(dataGot);
            }
            // setState({OtpVerify:false, setpass:dataGot});
            
          }
          
          
        }
        showAlert(FeedBack);
        // props.updateonDismiss({'FeedBack':FeedBack});
        // setloading(false);
      }
      else {
        FeedBack=[i18n.t('loginfail'), dataGot.error_description];
        showAlert(FeedBack);
        // props.updateonDismiss({'FeedBack':FeedBack});
        setTimeout(() => {
          setloading(false);
          // setTimeout(() => {
            if(_isMounted)
              setshowOtp(true);
          // },500);
        }, 500); 
        // LoaderView.close();
      }
    })
    .catch((error) =>{
      if(_isMounted)
        setshowOtp(false)
      console.error("VerifyLoginwithOTP"+error);
      FeedBack=[i18n.t('loginfail'), ""];
      showAlert(FeedBack);
      setTimeout(() => {
        setloading(false);
      },500);
      // LoaderView.close();
    });
  }
  
  
  const VerifyLogin=async(Lusername,Lpassword,Lismobile,callbackOnSuccess=null)=>{
    console.log('verify'+Lusername);
    setloading(true);
    // LoaderView.show();
    
    console.info(Lusername+""+Lpassword+":"+Lismobile);
    
    var details = {
      'username': Lusername,
      'password': Lpassword,
      'grant_type': 'password'
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
      console.log('P :'+(encodedKey + "=" + encodedValue));
      
    }
    formBody = formBody.join("&");
    console.log("L:"+formBody);
    
    // console.log('B64 :'+((Platform.OS==='ios')?WebServices.base64Ios:WebServices.base64And));
    // verifyurl=WebServices.Login.replace('{MobileOrEmail}',Lismobile==1?"974":""+Lusername).replace('{Password}',Lpassword).replace('{IsMobile}',Lismobile)
    return fetch(WebServices.MainURL + WebServices.Login, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }, WebServices.timeout)
    .then((response) => response.text()).
    then((responseJson)=>{
      // if(statusCode==200)
      {
        global.checkBio=true;
        // setloading(false);
        // console.log("VL:"+(responseJson));
        let dataGot = JSON.parse(responseJson);
        // console.log("J R :"+dataGot);
        if (!Tools.stringIsContains(responseJson, 'error')) 
          {
          // LoaderView.close();
          if (dataGot == "Failed") {
            FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckcred')];
          }
          else if (dataGot == "NotVerified") {
            FeedBack=[i18n.t('loginfail'), i18n.t('pleaseverify')];
          }
          else {
            // props.updateCart(undefined);
            dispatch({
              type: 'update_Cart',
              stateIn: undefined
            });
            // console.log("UP :"+Lpassword);
            // props.updateAccessToken(dataGot);
            dispatch({
              type:"update_AccessToken",
              payload:dataGot
            })
            
            SecureStore.setItemAsync('accessToken',responseJson);
            // updateMobileToken(global.mobileToken);
            
            // SecureStore.setItemAsync('pass',Lpassword);
            // SecureStore.setItemAsync('loginMethod',""+Lismobile);
            // LoaderView.close();
            fetchUserProfile(dataGot.MemberID, dataGot.access_token,callbackOnSuccess,dataGot);
            // fetchCatalogFull();
          }
          showAlert(FeedBack);
          // props.updateonDismiss({'FeedBack':FeedBack});
          // setloading(false);
        }
        else {
          setloading(false);
          if(Tools.stringIsContains(dataGot.error_description,'incorrect')){
            FeedBack=[i18n.t('loginfail'), i18n.t('usernamepasswrong')];
          }else if(Tools.stringIsContains(dataGot.error_description,'mobile number not verified')){
            FeedBack=[i18n.t('loginfail'), i18n.t('mobilenotverify')];
          }else if(Tools.stringIsContains(dataGot.error_description,'email not verified')){
            FeedBack=[i18n.t('loginfail'), i18n.t('emailnotverify')];
          }
          showAlert(FeedBack);
          // props.updateonDismiss({'FeedBack':FeedBack});
          setloading(false);
          
        }
      }
    })
    .catch((error) =>{
      FeedBack=[i18n.t('loginfail'), ''];
      // setloading(false);
      // console.log("VerifyLogin"+error);
      showAlert(FeedBack);
      // FeedBack=[i18n.t('loginfail'), dataGot.error_description];
      // props.updateonDismiss({'FeedBack':FeedBack});
      // setTimeout(()=>showAlert(FeedBack),500);
      setTimeout(()=>setloading(false),500);
    });
  }
  const resetData=()=>{
    global.profileUpdate=false;
    props.navigation.navigate('Homescreen');
    // console.log("Reset");
    // SignOut();
    SecureStore.setItemAsync('accessToken','');
    SecureStore.setItemAsync('profile','');
    dispatch({
      type: 'update_Profile',
      payload: undefined
    });
    // props.updateAccessToken({});
    dispatch({
      type:"update_AccessToken",
      payload:undefined
    })
    // props.updateCart(undefined);
    dispatch({
      type: 'update_Cart',
      stateIn: undefined
    });
  }
  
  const refreshAccesstoken=async (functionToBindOnFinish,LaccessToken=null)=>{
    let _accessToken=(LaccessToken==null?state.accessToken:LaccessToken);
    // console.log('State :'+JSON.stringify( state));
    // console.log('AccessToken :'+JSON.stringify(LaccessToken));
    // console.log('refreshAccesstoken :'+JSON.stringify( _accessToken.refresh_token));
    
    var details = {
      'refresh_token': _accessToken.refresh_token,
      'grant_type': 'refresh_token'
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(WebServices.MainURL + WebServices.RefreshToken, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + ((Platform.OS === 'ios') ? WebServices.base64Ios : WebServices.base64And),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }, WebServices.timeout)
    .then((response) => {
      setloading(false);
      const statusCode = response.status;
      // console.log('RAT :'+statusCode);
      if(response.status==200)
        return (response.text())
      else{
        //go to loginpage
        AssignProfile('','','');
        props.navigation.navigate('Homescreen');
        resetData();
        FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckcred')];
        global.initProfile=undefined;
        return (null)
      }
    })
    .then((responseJson) => {
      {
        if(responseJson!=null){
          // console.log('RT :'+JSON.parse( responseJson));
          dataGot = JSON.parse(responseJson);
          // console.log("J R :"+dataGot);
          if (!Tools.stringIsContains(responseJson, 'error')) {
            // LoaderView.close();
            if (Tools.stringIsContains(responseJson, "denied")) {
              resetData();
              FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckcred')];
            }
            else if (dataGot == "Failed") {
              resetData();
              FeedBack=[i18n.t('loginfail'), i18n.t('pleasecheckcred')];
            }
            else if (dataGot == "NotVerified") {
              resetData();
              FeedBack=[i18n.t('loginfail'),i18n.t('pleaseverify')];
            }
            else {
              //check for new state of authentication - ask shanoj
              // LoaderView.close();
              SecureStore.setItemAsync('accessToken',responseJson);
              // props.updateAccessToken(dataGot);
              dispatch({
                type:"update_AccessToken",
                payload:dataGot
              })
              fetchUserProfile(dataGot.MemberID, dataGot.access_token,functionToBindOnFinish,dataGot);
            }
          }
          else {
            //go to loginpage
            AssignProfile('','','');
            props.navigation.navigate('Homescreen');
            resetData();
            
            global.initProfile=undefined;
            // FeedBack=[i18n.t('loginfail'), dataGot.error_description];
            // setloading(false);
          }
          showAlert(FeedBack);
          setloading(false);
        }
      }
    })
    .catch((error) =>{
      setloading(false);
    });
  }
  
  const submitChangePassRequest= async(_memberId=null,_a_token=null,callback=null,MobileNo=null,repactcha=null)=>{
    
    const userData = await AsyncStorage.getItem('remaintimecp')
    if(!Tools.IsNull(userData)){
      // console.log("RemainDataCp In-"+JSON.stringify(userData));
      const dateVal=parseInt(JSON.stringify(userData).replace('"',''));
      let remain= moment(dateVal).diff(moment(new Date()),"seconds")
      if(remain>0){
        // console.log("submitChangePassRequest : "+ remain);
        setotpChangePassModal(true);
        return;
      }
    }
    const _storeData = async () => {
      try {
        
        let remain= moment(new Date()).add(3,'minutes')
        // console.log("_storeDataRemaincp"+remain);
        if(callback!=null){
          callback(remain);
        }
        await AsyncStorage.multiSet([
          ['remaintimecp',(""+remain)]]
        );
      } catch (error) {
        // console.log("_storeData:"+error)
      }
    };
    _storeData();
    setloading(true);
    // if(Tools.stringIsEmpty(global.mobileToken)){
    //   return;
    // }
    
    verifyurl= WebServices.changePass.replace('{MemberID}',state.accessToken.MemberID);
    console.log("RecToken"+repactcha);
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+state.accessToken.access_token,
        'Content-Type': 'application/json',
        'RecToken':repactcha
      },
    }, WebServices.timeout)
    .then((response) =>  response.text())
    .then((responseJson) => {
      if(Tools.stringIsContains(responseJson,'denied')){
        refreshAccesstoken((mid,a_token)=>{submitChangePassRequest(mid,a_token,callback)});
        return;
      }else{
        setloading(false);
        dataGot = responseJson;
        // console.log("submitChangePassRequest : "+dataGot);
        setotpChangePassModal(true);
      }
    })
    .catch((error) =>{
      setloading(false);
      console.error("submitChangePassRequest"+error);
    });
  }
  const submitforgetPassRequest=()=>{
    // return;
    setloading(true);
    // LoaderView.show();
    // if(Tools.stringIsEmpty(global.mobileToken)){
    //   return;
    // }
    
    verifyurl= WebServices.setforgetPass.replace('{MemberID}',state.accessToken.MemberID);
    
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+state.accessToken.access_token,
        'Content-Type': 'application/json',
      },
    }, WebServices.timeout)
    .then((response) =>  response.text())
    .then((responseJson) => {
      if(Tools.stringIsContains(responseJson,'denied')){
        refreshAccesstoken((mid,a_token)=>{submitChangePassRequest(mid,a_token)});
        return;
      }else{
        setloading(false);
        dataGot = responseJson;
        // console.log(dataGot);
        setState({otpChangePassModal:true})
      }
    })
    .catch((error) =>{
      setloading(false);
      console.error("submitChangePassRequest"+error);
    });
  }
  
  
  
  const submitDeleteRequest=async (_memberId=null,_a_token=null,onDone=null,repactcha=null)=>{
    // return;
    // if(onDone!=null){
    //   setcallbackOnDelete(onDone);
    //   // setState({callbackOnDelete:onDone})
    // }
    // setloading(true);
    // LoaderView.show();
    // if(Tools.stringIsEmpty(global.mobileToken)){
    //   return;
    // }
    verifyurl= WebServices.deleteAccount.replace('{MemberID}',state.accessToken.MemberID);
    console.log("RecToken"+repactcha);
    
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+state.accessToken.access_token,
        'Content-Type': 'application/json',
        'RecToken':repactcha
      },
    }, WebServices.timeout)
    .then((response) =>  response.text())
    .then((responseJson) => {
      if(Tools.stringIsContains(responseJson,'denied')){
        refreshAccesstoken((mid,a_token,onDone,repactcha)=>{submitDeleteRequest(mid,a_token,onDone,repactcha)});
        return;
      }else{
        // setloading(false);
        dataGot = responseJson;
        console.log(dataGot);
        setotpVerifyModal(true);
        // setState({otpVerifyModal:true})
      }
    })
    .catch((error) =>{
      console.error("submitDeleteRequest"+error);
    });
  }
  
  const completeDeleteRequest= async(_otp)=>{
    // return;
    // setloading(true);
    // LoaderView.show();
    // if(Tools.stringIsEmpty(global.mobileToken)){
    //   return;
    // }
    // handleSend().then(async (tokenIn)=>{
      verifyurl= WebServices.deleteAccountOTP.replace('{MemberID}',state.accessToken.MemberID).replace('{OTPCode}',_otp);
    console.log(verifyurl);
    
    return fetch(WebServices.MainURL +verifyurl, {
      method: 'POST',
      headers: {
        'Authorization':'Bearer '+state.accessToken.access_token,
        'Content-Type': 'application/json',
      },
    }, WebServices.timeout)
    .then((response) =>  response.text())
    .then(async (responseJson) => {
      if(Tools.stringIsContains(responseJson,'denied')){
        refreshAccesstoken((otp)=>{completeDeleteRequest(otp)});
        return;
      }else{
        // setloading(false);
        dataGot = responseJson;
        console.log(dataGot);
        SignOut();
        const userDeletionData = await ReactMoE.deleteUser();
        Alert.alert(i18n.t('successdelete'), "");
        setotpVerifyModal(false);
        props.navigation.popToTop();
        // setState({otpVerifyModal:true})
      }
    }).
    
    
    //   const response = return fetch(WebServices.MainURL + verifyurl, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Bearer ' + state.accessToken.access_token,
    //       'Content-Type': 'application/json',
    //       // 'RecToken': (Tools.IsNull(tokenIn) ? googleToken : tokenIn)
    //     },
    //   }, WebServices.timeout);
    //   const responseJson = response.text();
    //   // setloading(false);
    
    //   dataGot = responseJson;
    //   console.log(dataGot);
    //   SignOut();
    //   Alert.alert(i18n.t('successdelete'), "");
    //   setotpVerifyModal(false);
    // }
    catch((error)=>{
      setloading(false);
      console.log(error);
    });
  }
  
  const SignOut=()=>{
    logLogoutEvent(state.profile.Mobile,state.accessToken.MemberID);
    SecureStore.setItemAsync('loginRequested','N');
    // props.updateCart(undefined);
    dispatch({
      type: 'update_Cart',
      stateIn: undefined
    });
    AssignProfile('','','');
    props.navigation.navigate('Homescreen');
    resetData();
    // if(callbackOnDelete!=undefined){
    //   callbackOnDelete();
    //   setcallbackOnDelete(undefined);
    // }
    // fetchCatalogFull();
  }
  
  const GetMediaIDs=(_userIn)=>{
    var mediaIds=[];
    if(!Tools.IsNull(_userIn)&&!Tools.IsNull(_userIn.Medias)){
      
      for (let index = 0; index < _userIn.Medias.length; index++) {
        const element = _userIn.Medias[index];
        mediaIds.push(element.MediaId);
      }
    }
    return mediaIds;
  }
  const GetMediaBalanceIDs=(_userIn)=>{
    if(!Tools.IsNull(_userIn)&&!Tools.IsNull(_userIn.Medias)){
      console.log("GetMediaBalanceIDs"+_userIn);
      var walletBalance=[];
      // var eticketsBalance=[];
      // var bonusBalance=[];
      for (let index = 0; index < _userIn.Medias.length; index++) {
        walletBalance.push(_userIn.Medias[index].Wallet);
        // if(Tools.stringIsContains(element.Name,"wallet")){
        //   walletBalance.push(element.Balance);
        // }else{
        //   walletBalance.push(0);
        // }
        // if(Tools.stringIsContains(element.Name,"etickets")){
        //   eticketsBalance.push(element.Balance);
        // }else{
        //   eticketsBalance.push(0);
        // }
        // if(Tools.stringIsContains(element.Name,"etickets")){
        //   bonusBalance.push(element.Balance);
        // }else{
        //   bonusBalance.push(0);
        // }
      }
    }
    var mediaIn={};
    mediaIn.walletBalance=JSON.stringify(walletBalance);
    // mediaIn.eticketsBalance=eticketsBalance;
    // mediaIn.bonusBalance=bonusBalance;
    return mediaIn;
  }
  
  
  /*ORder online*/ 
  cportfolios=[];
  portfolios=[];
  products=[];
  totalPrice=0;
  attributeID='';
  
  const SaleItemDetailsGift=(_attributeID,_productPrice,_productQuality,_portfolioCheck,_mediaCheck,_accountId)=>{
    
    cPortCount=cportfolios.length;
    
    $saleItemDetail=[];
    
    for(i=1;i<=_productQuality;i++){
      saleItemDetail.push(
        {
          'OptionList':{
            'AttributeItemId':_attributeID,
            'OptionalPrice':_productPrice
          },
          'Position':i,
          'PortfolioGroup':'PF'+(cPortCount+i),
          'SubItem':false
        }
      );
      cportfolios.push('PF'+(cPortCount+i));
      portfolios.push(_portfolioCheck);
      mediaIds.push(_mediaCheck);
      accountIds.push(_accountId);
    }
    return saleItemDetail;
  }
  
  const SaleItemDetails=(_productQuality,_portfolioCheck,_mediaCheck,_accountId)=>{
    
    cPortCount=cportfolios.length;
    
    $saleItemDetail=[];
    
    for(i=1;i<=_productQuality;i++){
      saleItemDetail.push({
        'Position':i,
        'PortfolioGroup':'PF'+(cPortCount+i),
        'SubItem': false
      });
      acportfolios.push('PF'+(cPortCount+i));
      portfolios.push(_portfolioCheck);
      mediaIds.push(_mediaCheck);
      accountIds.push(_accountId);
    }
    return saleItemDetail;
  }
  
  
  const createAccountMultiple=()=>{
    _createAccount={
      'AccountRef':'AR1',
      'UpdateExisting':true,
      'Account':{ 
        'EntityType': 15, 
        'AccountStatus':1,
        'CategoryIDs':GLOBALS['vgsCategoryID'],
        'MetaDataList':
        [
          { 'MetaFieldCode': 'FT1','Value':_order.get_billing_first_name() },
          { 'MetaFieldCode': 'FT3', 'Value':_order.get_billing_last_name() } ,
          { 'MetaFieldCode': 'FT21', 'Value':_order.get_billing_email() },
          { 'MetaFieldCode': 'FT15', 'Value': _order.get_billing_phone() },
          { 'MetaFieldCode': 'FT11', 'Value': 'QA' },
          { 'MetaFieldCode': 'FT8', 'Value': 'Doha' } 
        ]
      } 
    }
    createAccounts=[];
    cPortCount=(cportfolios.length);
    for(i=0;i<cPortCount;i++){ 
      if(Tools.stringIsEmpty(portfolios[i])){
        _createAccount['AccountRef']=cportfolios[i];
        createAccounts.push(_createAccount);
      } 
    } 
    return createAccounts;
  }
  
  
  const getProducts=(_productsInCart)=>{
    allProducts=[];
    
    
    
    for (let index = 0; index < _productsInCart.length; index++) {
      var element ={
        "ProductId":_productsInCart.item['EntityId'],
        "Quantity":_productsInCart.count,
        "UnitAmount":_productsInCart.item['Pricelist']['Price'],
        "TotalAmount":_productsInCart.item['Pricelist']['Price']*_productsInCart.count,
        "GroupTicketOption":1,
        // "SaleItemDetailList":SaleItemDetails(_productsInCart.count,)
        
      }
      allProducts.push(element);
      
    }
    return allProducts;
  }
  
  
  
  const getPortfolioMultipleList=(_products)=>{
    /* { "PortfolioGroup": "PF4", "AccountRef": "AR4" }, { "PortfolioGroup": "PF5", "PortfolioId": "181608FC-F7C9-0527-0784-01663EF2C014", "AccountId": "08E5F5D7-6815-5AF3-45A0-01663B141C39" } */ 
    cPortCount=cportfolios.length; 
    porfolioDatas=[];
    for(i=0;i<cPortCount;i++)
      { 
      if(isset($_products[$i]['Options'])){
        if(Tools.stringIsEmpty(portfolios[i])){ 
          porfolioDatas.push({ 
            'PortfolioGroup':cportfolios[i],
            // 'AccountRef'=>$this->cportfolios[$i]
          });
        }else{ 
          porfolioDatas.push({ 
            'PortfolioGroup':cportfolios[i],
            // 'PortfolioId'=>$this->portfolios[$i], 
            // 'AccountId'=>$this->accountIds[$i] 
          }); 
        } 
      }else{ 
        if(Tools.stringIsEmpty(portfolios[i])){ 
          porfolioDatas.push({
            'PortfolioGroup':cportfolios[i],
            'AccountRef':cportfolios[i] 
          }); 
        }else{ 
          porfolioDatas.push({
            'PortfolioGroup':cportfolios[i],
            'PortfolioId':portfolios[i],
            'AccountId':accountIds[i] 
          });
        } 
      } 
    } 
    return $porfolioDatas; 
  }
  const getPayment=(_productsInCart)=>{
    
    _totalAmount=0;
    allPayment=[];
    
    var element ={
      "PaymentMethodId":WebServices.vgspaymentMethodId,
      "PaymentAmount":_totalAmount,
      "CurrencyISO":"QAR",
      "CreditCard":{
        "AuthorizationCode":""
      }
      
    }
    allProducts.push(element);
    
    return allPayment;
  }
  
  
  
  
  const fetchCatalogFull=()=>{
    // setloading(true);
    verifyurl=WebServices.catalogUrl;//+"?r="+Math.floor(Math.random()*100)+1;//.replace('{MemberID}',LmemberID);
    
    // console.log("CATALOG:"+WebServices.MainURL+verifyurl);
    fetch (WebServices.CatalogMainUrl+verifyurl,{
      method: 'GET',
    },WebServices.timeout)
    .then((response) => {
      if(response.status==200)
        return (response.text())
    })
    .then((responseJson) => {
      // console.log('DAta :'+(responseJson));
      if(Tools.stringIsEmpty(responseJson)){
        return;
      }
      {
        dataGot=JSON.parse(responseJson);
        // console.log('DAta In:'+dataGot.Nodes.length);
        
        var dataGots=dataGot.Nodes.filter((dataIn)=>{ 
          return ((!Tools.IsNull(state.profile)&&dataIn.TemplateCode=="Tejory")||(Tools.IsNull(state.profile)&&dataIn.TemplateCode=="NonTejory"))});
          
          dataGot.Nodes=dataGots[0].Nodes;
          setstoreCatalog(dataGot)
          // console.log("full :"+responseJson);
        }
      })
      .catch((error) =>{
        setloading(false);
      });
    }
    
    const fetchUserProfile=async (LmemberID,LaccessToken,functionToBindOnFinish=null,_accessData=null)=>{
      // setloading(true);
      let verifyurl=WebServices.ProfileDetails.replace('{MemberID}',LmemberID);
      // console.log("fetchUserProfile"+verifyurl);
      return fetch (WebServices.MainURL+verifyurl,{
        method: 'GET',
        headers:{
          'Authorization':'Bearer'+' '+LaccessToken,
        },
      },WebServices.timeout)
      .then((response) => {
        // console.log("fetchUserProfile resp:"+response.status);
        if(response.ok)
          return response.text()
        else if(response.status==401){   
          refreshAccesstoken(functionToBindOnFinish,_accessData);
          return null;
        }})
        .then((responseJson) => {
          setloading(false);
          loaded=0;
          if(responseJson!=null){
            // console.log('fetch up-'+responseJson);
            
            if(_isMounted)
              setsetpass(undefined)
            // console.log('fetch up1');
            
            if(Tools.stringIsEmpty(responseJson)){
              setloading(false);
              return;
            }
            // console.log('fetch up2');
            
            // console.log("P : "+responseJson);
            if(Tools.stringIsContains(responseJson,'denied')){
              refreshAccesstoken(functionToBindOnFinish,_accessData);
              return;
            }
            else if(!Tools.stringIsContains(responseJson,'error')){
              dataGot=JSON.parse(responseJson);
              // console.log('fetch up3');
              
              // if(dataGot.TokenInfo.Token!=undefined&&state.profile.TokenInfo!=undefined&&state.profile.TokenInfo.Token!=undefined){
              //   console.log(dataGot.TokenInfo.Token+"Token Different"+state.profile.TokenInfo.Token);
              // }
              if(state.profile!=undefined&&state.profile.TokenInfo!=undefined&&state.profile.TokenInfo.Token!=undefined&&dataGot.TokenInfo!=undefined&&dataGot.TokenInfo.Token!=state.profile.TokenInfo.Token){
                // console.log(dataGot.TokenInfo.Token+"Token Different"+state.profile.TokenInfo.Token);
                setloading(false);
                dispatch({
                  type: 'update_Profile',
                  payload: undefined
                });
                resetData();
                return;
              }
              
              setloading(false);
              //gotprofile
              // console.log(JSON.stringify(dataGot)+'Inbackaction');
              if(Tools.IsNull(dataGot.TokenInfo)&&Tools.IsNull(dataGot.TokenInfo.BiometricToken)){
                SecureStore.setItemAsync('useBiometric','N');
              }else{
                global.checkBio=true;
              }
              global.bgColor=Tools.hextorgb(dataGot.TierInfo.Current_TierTheme.Background);
              dispatch({
                type: 'update_Profile',
                payload: dataGot
              });
              SecureStore.setItemAsync('profile',JSON.stringify(dataGot));
              // console.log(JSON.stringify(dataGot));
              
              
              // fetchClaimsProfile(LmemberID,LaccessToken);
              // fetchRedeemProfile(LmemberID,LaccessToken);
              appversion=(Platform.OS=='ios'?global.CurrentiOSversion:global.CurrentAndroidversion);
              if(dataGot.TokenInfo==null||(dataGot.TokenInfo.Token!=global.mobileToken)
                ||(dataGot.TokenInfo.AppVersion!=appversion)||(dataGot.TokenInfo.AppLanguage!=i18n.locale))
              updateMobileToken(global.mobileToken,null,dataGot);
              else{
              }
              // console.log("Bio Check :"+state.biometricCheck);
              
              
              
              // console.log(LmemberID+'LoginT :'+LaccessToken);
              if(functionToBindOnFinish!=null){
                functionToBindOnFinish(LmemberID,LaccessToken);
              }
              // updateProfilewithMobileToken(LaccessToken);
              //getevent to call
              
            }else{
              dataGot=JSON.parse(responseJson);
              
              setloading(false);
              // setloading(false);
              // console.log("login :"+dataGot)
              dispatch({
                type: 'update_Profile',
                payload: undefined
              });
              FeedBack=['Login Error',dataGot.Message];
              showAlert(FeedBack);
              resetData();
              
              // props.updateonDismiss(FeedBack);
              // console.log('In'+FeedBack.length);
            }
            // showAlert(FeedBack);
            // props.updateonDismiss({'FeedBack':FeedBack});
            if(_isMounted)
              setloginOpen(false);
          }
          
        })
        .catch((error) =>{
          // console.log('UPE '+error);
          setloading(false);
          resetData();
          loaded=1;
          if(_isMounted)
            setsetpass(undefined)
          console.error("login - "+error);
          FeedBack=['Login Error',dataGot.Message];
          showAlert(FeedBack);
          SecureStore.setItemAsync('accessToken','');
        });
      }
      
      const fetchClaimsProfile=async(LmemberID,LaccessToken)=>{
        verifyurl=WebServices.ClaimsProfile.replace('{MemberID}',LmemberID);
        return fetch (WebServices.MainURL+verifyurl,{
          method: 'GET',
          headers:{
            'Authorization':'Bearer'+' '+LaccessToken,
          },
        },WebServices.timeout)
        .then((response) => response.text())
        .then((responseJson) => {
          dataGot=JSON.parse(responseJson);
          
          if(!Tools.stringIsContains(responseJson,'denied')&&!Tools.stringIsContains(responseJson,'error')){
            // props.updateClaims(dataGot);
            dispatch({
              type:"update_Claims",
              payload:dataGot
            })
            
            // LoaderView.close();
          }else{
            // console.log("E :"+responseJson);
            
            if(Tools.stringIsContains(responseJson,'denied')){
              refreshAccesstoken((mid,a_token)=>{fetchClaimsProfile(mid,a_token)});
            }
            // Alert.alert('Claim Error',dataGot.Message);
            // LoaderView.close();
          }
          setloading(false);
          
        })
        .catch((error) =>{
          // console.error(error);
          setloading(false);
          // LoaderView.close();
          // Alert.alert('Claim Error','');
        });
      }
      
      const fetchClaimPoints=async(LmemberID,LaccessToken,tokenId)=>{
        //console.log(LmemberID+','+LaccessToken);
        // setState({claimCheck:true});
        setclaimCheck(true);
        // setloading(true);
        // LoaderView.show();
        verifyurl=WebServices.ClaimPoints.replace('{MemberID}',LmemberID).replace('{InvoiceCode}',tokenId);
        // console.log('url :'+verifyurl);
        
        return fetch (WebServices.MainURL+verifyurl,{
          method: 'POST',
          headers:{
            'Authorization':'Bearer'+' '+LaccessToken,
          },
        },WebServices.timeout)
        .then((response) => response.text())
        .then((responseJson) => {
          setclaimCheck(false)
          // console.log(responseJson);
          // refreshAccesstoken(()=>{fetchClaimPoints(props.accessToken.MemberID,props.accessToken.access_token,tokenId)});
          // return;
          if(Tools.stringIsContains(responseJson,'denied')){
            refreshAccesstoken((mid,a_token)=>{fetchClaimPoints(mid,a_token,tokenId)});
          }
          // dataGot=JSON.parse(responseJson);
          else if(Tools.stringIsContains(responseJson,'already')){
            FeedBack=[i18n.t('claimfail'),i18n.t('alreadyclaimed')+tokenId];
          }
          else if(Tools.stringIsContains(responseJson,'notfound')||Tools.stringIsContains(responseJson,'error')||Tools.stringIsContains(responseJson,'invalid')){
            FeedBack=[i18n.t('claimfail'),i18n.t('failclaimed')+tokenId];
          }else if(Tools.stringIsContains(responseJson,'success')) {
            FeedBack=[i18n.t('claimsuccess'),i18n.t('successclaimed')+tokenId];
          }else{
            FeedBack=[i18n.t('claimfail'),i18n.t('failclaimed')+tokenId];
          }
          logClaimEvent(FeedBack);
          // setTimeout(()=>props.updateonDismiss({'FeedBack':FeedBack}),1000);
          // setloading(true);
          showAlert(FeedBack);
          // props.updateonDismiss({'FeedBack':FeedBack});
          // setloading(false);
          
        })
        .catch((error) =>{
          setclaimCheck(false);
          // console.log(error);
          FeedBack=[i18n.t('claimfail'),error];
          showAlert(FeedBack);
          // props.updateonDismiss({'FeedBack':FeedBack});
          // setloading(false);
          // LoaderView.close();
        });
      }
      
      
      const fetchRedeemProfile=async(LmemberID,LaccessToken,callback=null)=>{
        
        // setloading(true);
        // LoaderView.show();
        verifyurl=WebServices.RedeemDetails.replace('{MemberID}',LmemberID);
        // console.log(LmemberID+'/'+LaccessToken+' V :'+verifyurl);
        return fetch (WebServices.MainURL+verifyurl,{
          method: 'GET',
          headers:{
            'Authorization':'Bearer'+' '+LaccessToken,
          },
        },WebServices.timeout)
        .then((response) => response.text())
        .then((responseJson) => {
          // console.log(responseJson);
          dataGot=JSON.parse(responseJson);
          
          if(!Tools.stringIsContains(responseJson,'denied')||!Tools.stringIsContains(responseJson,'error')){
            // props.updateRedeem(dataGot);
            dispatch({
              type:"update_Redeem",
              payload:dataGot
            })
            if(callback){
              callback(dataGot);
            }
          }else{
            if(Tools.stringIsContains(responseJson,'denied')){
              refreshAccesstoken((mid,a_token)=>{fetchRedeemProfile(mid,a_token)});
            }
          }
          setloading(false);
          // LoaderView.close();
        })
        .catch((error) =>{
          if(callback){
            callback(undefined);
          }
          // console.log(error);
          setloading(false);
          // LoaderView.close();
          // Alert.alert('Claim Error','');
        });
      }
      
      const fetchRedeemPoints=async(LmemberID,LaccessToken,tokenId,passcode,_callback=null)=>{
        // console.log(LmemberID+','+LaccessToken);
        setloading(true);
        // LoaderView.show();
        verifyurl=WebServices.RedeemPoints.replace('{MemberID}',LmemberID).replace('{VoucherId}',tokenId).replace('{PassCode}',passcode);
        // console.log('fetchRedeemPointsurl :'+verifyurl);
        
        return fetch (WebServices.MainURL+verifyurl,{
          method: 'POST',
          headers:{
            'Authorization':'Bearer'+' '+LaccessToken,
          },
        },WebServices.timeout)
        .then((response) => response.text())
        .then((responseJson) => {
          // console.log(responseJson);
          // LoaderView.close();
          // dataGot=JSON.parse(responseJson);
          if(Tools.stringIsContains(responseJson,'denied')){
            refreshAccesstoken((mid,a_token)=>{fetchRedeemPoints(mid,a_token,tokenId,passcode,callback)});
          }
          else if(Tools.stringIsContains(responseJson,'already')){
            //gotprofile
            FeedBack=[i18n.t('redeemfail'),i18n.t('alreadyredeemed')+tokenId];
          }else if(Tools.stringIsContains(responseJson,'notenoughpoints')){
            //gotprofile
            FeedBack=[i18n.t('redeemfail'),i18n.t('notenough')];
          }
          else if(!Tools.stringIsContains(responseJson,'invalid')&&!Tools.stringIsContains(responseJson,'error')&&!Tools.stringIsContains(responseJson,'authorization')){
            //gotprofile
            // Alert.alert('Redeem Success','Successfully claimed : '+tokenId);
            PopupInfo.Title=i18n.t('congrats')
            PopupInfo.SubHeading=i18n.t('yourvoucherno')
            PopupInfo.ContentCode=responseJson;
            if(_callback){
              _callback();
            }
            setshowPop(true);
          }else if (Tools.stringIsContains(responseJson,'invalid')){
            FeedBack=[i18n.t('redeemfail'),i18n.t('invalidpass')];
          }else {
            FeedBack=[i18n.t('redeemfail'),i18n.t('failredeemed')+tokenId];
          }
          // setloading(true);
          showAlert(FeedBack);
          // props.updateonDismiss({'FeedBack':FeedBack});
          setloading(false);
        })
        .catch((error) =>{
          // console.error(error);
          setloading(false);
          // LoaderView.close();
        });
      }
      
      const AssignProfile=(_profileIn,profilePass,isMobile,callbackOnSuccess=null,callbackOnFail=null)=> {
        if(!state.isConnected){
          loaded=1;
          return;
        }
        if(_profileIn.length==0){
          resetData();
          return;
        }
        else{
          if(profilePass.length>0){
            VerifyLogin(_profileIn,profilePass,isMobile,callbackOnSuccess);
            logLoginEvent("password",_profileIn);
            
          }else if(_profileIn=="user"){
            // console.log("AssignProfile"+_profileIn);
            SecureStore.getItemAsync('accessToken').then(accessToken=>{
              if((accessToken)){
                // setloading(true);
                // console.log("Access : "+accessToken);
                dataGot=JSON.parse(accessToken);
                // props.updateAccessToken(dataGot);
                dispatch({
                  type:"update_AccessToken",
                  payload:dataGot
                })
                fetchUserProfile(dataGot.MemberID, dataGot.access_token,callbackOnSuccess,dataGot);
              }else{
                resetData();
                return;
              }
            });
            
          }else{
            // console.log("ACcess :"+_profileIn);
            dataGot=JSON.parse(_profileIn);
            // props.updateAccessToken(dataGot);
            dispatch({
              type:"update_AccessToken",
              payload:dataGot
            })
            fetchUserProfile(dataGot.MemberID, dataGot.access_token,callbackOnSuccess,dataGot);
          }
          // setloading(true);
          // fetchProfile(profileIn)
        }
      }
      
      const ClaimProfile=()=>{
        // console.log("P :"+profileIn);
        fetchClaimsProfile(state.accessToken.MemberID,state.accessToken.access_token);
        
      }
      
      const ClaimPoints=(tokenCode)=> {
        // console.log("TC :"+tokenCode);
        fetchClaimPoints(state.accessToken.MemberID,state.accessToken.access_token,tokenCode);
      }
      
      const RedeemProfile=(callback=null)=>{
        fetchRedeemProfile(state.accessToken.MemberID,state.accessToken.access_token,callback);
      }
      
      const RedeemPoints=(tokenCode,tokenPass,callback)=>{
        // console.log(tokenPass+" RedeemPoints :"+tokenCode);
        // console.log(state.accessToken.MemberID+" RedeemPoints  VAL :"+state.accessToken.access_token);
        fetchRedeemPoints(state.accessToken.MemberID,state.accessToken.access_token,tokenCode,tokenPass,callback);
      }
      
      const fetchProfile=async (profileID)=>{
        return fetch(MainURL+profileID)
        .then((response) => response.json())
        .then((responseJson) => {
          dispatch({
            type: 'update_Profile',
            payload: responseJson
          });
          setloading(false);
          // LoaderView.close();
          //  setTimeout(()=>setloading(false),2000);
        })
        .catch((error) =>{
          console.error(error);
          setloading(false);
        });
      }
      
      feedchk=[];
      // const showFeedback=()=>{
        //   // if((feedchk==undefined||feedchk.length==0)&&state.feedBackInfo!=undefined&&state.feedBackInfo.length>0){
      //   //   console.log(feedchk+ "- load statat "+state.onExitDismiss.FeedBack);
      //   //   feedchk=state.onExitDismiss.FeedBack;
      //   //   console.log(feedchk+ "- load after "+state.onExitDismiss.FeedBack);
      
      //   //   setTimeout(() => {
        //   //     console.log("delayed");
      //   //     feedchk=[];
      //   //   }, 2000);
      //   //   setState({feedBackInfo:[]},()=>{
        //   //     // props.updateonDismiss({'FeedBack':[]});
      //   //   })
      //   //   return(
      //   //     <>{
      //   //   Alert.alert(state.feedBackInfo[0],(state.feedBackInfo[1]==undefined?'':state.feedBackInfo[1]))
      //   //     }
      //   //     </>
      //   //   )
      //   // }
      // }
      useEffect(()=>{
        if(state.isConnected===true){
          // console.log("In PD - "+props.isConnected);
          setreload(state.isConnected)
        }
      },[state]);
      // const [currentProfileData, setCurrentProfileData] = useState({});
      const memoizedProfileData = useMemo(() => state.profile, [JSON.stringify(state.profile)]);
      const hasExecuted = useRef(false);
      useEffect(() => {
        if(global.profileUpdate){
          return;
        }
       
        if(!Tools.IsNull(state.profile)&& !hasExecuted.current) {
          hasExecuted.current = true;
          global.profileUpdate=true;
          // console.log("P : "+JSON.stringify(memoizedProfileData));
          var dataGot=state.profile;
          // This effect will only trigger when memoizedProfileData changes
          ReactMoE.setUserUniqueID(dataGot.Mobile);
          setTimeout(() => {
            ReactMoE.setUserName(dataGot.Mobile);
            ReactMoE.setUserFirstName(dataGot.FirstName);
            ReactMoE.setUserLastName(dataGot.LastName);
            ReactMoE.setUserEmailID(dataGot.Email);
            ReactMoE.setUserContactNumber(dataGot.Mobile);
            ReactMoE.setUserAttribute("leisurepoints", dataGot.Points);
            ReactMoE.setUserAttribute("leisurecardno", dataGot.CardNo);
            ReactMoE.setUserAttribute("mediaId", GetMediaIDs(dataGot));
            mediaBalance=GetMediaBalanceIDs(dataGot).walletBalance;
            ReactMoE.setUserAttribute("mediaBalance", mediaBalance);
            
          }, 1500);
        }
      }, [memoizedProfileData]);
      
      
      
      const checkLoading=(elements)=>{
        if(reload&&loaded!==0){
          // setloading(true);
          // console.log("In - "+loaded);
          loaded=0;
          AssignProfile('user','','');
        }
        return(
          <View style={{flex:1}} >
          <AppVersionChecker/>
          <OfflineNotice />
          <GoogleRecaptcha
          ref={(ref)=>{recaptchaRef=ref}}
          size={GoogleRecaptchaSize.INVISIBLE}
          baseUrl={WebServices.googleRecaptchaSiteURL}
          siteKey={WebServices.googleRecaptchaSiteKey}/>
          {elements}
          {(showPop)&&(<PopUpVoucher onDone={OnVerifyDone} content={PopupInfo}/>)}
          {otpVerifyModal&&(<OtpVerify title={i18n.t('wesentyouotptomobile')+" "+state.profile.Mobile } sendOTP={submitDeleteRequest}  onDone={OnVerificationDone}/>)}
          {otpChangePassModal&&(<ChangePassword sendOTP={submitChangePassRequest} accessToken={state.accessToken} assignProfile={AssignProfile}  onDismiss={OnDismissPass}/>)}
          {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} onDismiss={onloadEnd} />}
          {!dontShowBioAgain&&showBiometricPermission&&<BiometricRequest visible={showBiometricPermission} onSetBio={onSetBio}/>}
          <Banner navigation={props.navigation}/>
          {/* </HamBurgerMenu> */}
          
          </View>);
        }
        const OnDismissPass=()=>{
          setotpChangePassModal(false);
          // setState({otpChangePassModal:false});
        }
        const OnVerificationDone=(_otp,_state)=>{
          console.log(_otp,_state);
          if(!_state){
            // setState({otpVerifyModal:false})
          }else{
            completeDeleteRequest(_otp);
          }
          setotpVerifyModal(false)
          
        }
        const onSetBio=(_stateIn,_dontshowAgain)=>{
          // console.log("onSetBio"+_stateIn)
          if(!_stateIn){
            setDontShowBio(_dontshowAgain?"Y":"N");
            setshowBiometricPermission(false);
            return;
          }
          if(!rnBiometrics){
            // console.log("rnBiometrics");
            return;
          }
          rnBiometrics.simplePrompt({promptMessage: 'Confirm BioMetric'})
          .then((resultObject) => {
            const { success } = resultObject
            if (success) {
              SecureStore.setItemAsync('useBiometric','Y').then(()=>{
                setDontShowBio(_dontshowAgain?"Y":"N");
                setshowBiometricPermission(false);
                updateMobileToken(null,null,state.profile);
              });
              // console.log('successful biometrics provided')
            } else {
              // console.log('user cancelled biometric prompt')
            }
            
          })
          .catch(() => {
            // console.log('biometrics failed')
          })
        }
        const OnVerifyDone=(Vstate)=>{
          if(_isMounted)
            setshowPop(false);
          if(Vstate){
            AssignProfile('user','','')
            props.navigation.navigate('Cardscreen',{screen:'Home'},{pagetodivert:undefined});
          }
        }
        
        //   checkLogin(){
        //     if(state.profile&&state.profile.profileId){
        //       return;
        //     }
        //     if(props.isLoading)
        //     return;
        //       console.log("PP"+state.profile.profileId);
        //       props.navigation.navigate('FullScreen',{assignProfile:AssignProfile});
        // }
        const LookStored=()=>{
          SecureStore.getItemAsync('profile').then(profile=>{
            if((profile)&&profile!={}){
              // console.log("Got profile");
              dispatch({
                type: 'update_Profile',
                payload: JSON.parse(profile)
              });
            }
          });
          
        }
        const setupBiometric=()=>{
          // console.log("setupBiometric"+global.checkBio);
          // console.log("biometricCheck"+state.biometricCheck);
          // console.log("dontShowBioAgain"+state.dontShowBioAgain);
          // console.log("Profile"+(!Tools.IsNull(state.profile.FirstName)));
          if(rnBiometrics!=undefined&&biometryIn.available&&global.checkBio&&(!Tools.IsNull(state.profile)&&!Tools.IsNull(state.profile.FirstName))&&!dontShowBioAgain&&!biometricCheck){
            SecureStore.getItemAsync('useBiometric').then(valIn=>
              {
                if(valIn!='Y'){
                  setTimeout(() => {
                    setshowBiometricPermission(true);
                    setbiometricCheck(true);
                    // console.log(state.dontShowBioAgain+"Bio Check TIME"+state.showBiometricPermission);
                    // setState({showBiometricPermission:true,biometricCheck:true},()=>{
                      //   console.log("showBiometricPermission");
                    // });
                    // setState({showBiometricPermission:true,biometricCheck:true},()=>{
                      //   console.log("showBiometricPermission");
                    // });
                    // console.log(state.dontShowBioAgain+"Bio Check TIME"+state.showBiometricPermission);
                  }, 500);
                }
              }
            )
          }
        }
        
        const signinDismiss=(_memeberID)=>{
          // console.log(JSON.stringify(state.accessToken));
          // console.log(_memeberID);
          if(props.onDismiss!=null){
            props.onDismiss(_memeberID);
          }
        }
        // render()
        // {
        // showFeedback();
        if(props.pagetogo==="home"){        
          setupBiometric();
          return(
            
            // <HomeData profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>
            checkLoading(<>
              <AdnHome setSignOff={props.setSignOff} accessToken={state.accessToken} lookStored={LookStored} updateLoading={setloading} profile={state.profile} submitChangePassRequest={submitChangePassRequest} navigation={props.navigation} assignProfile={AssignProfile} sendOTP={SendMobileOTP} verifyOTP={VerifyOTP} isLoading={isLoading} redeem={state.redeem} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>
              </>)
            );
          }else  if(props.pagetogo==="points"){          
            
            return(
              checkLoading(<PointsSystemPage assignProfile={AssignProfile} profile={state.profile} pagefrom={props.pagefrom} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} redeem={state.redeem} navigation={props.navigation} claims={state.claims} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
            );
          }else  if(props.pagetogo==="referafriend"){          
            
            return(
              checkLoading(<ReferFriendHandle assignProfile={AssignProfile} accessToken={state.accessToken} profile={state.profile} navigation ={props.navigation}/>)
            );
          }else if(props.pagetogo==="addcards"){        
            
            // checkLogin();
            return(
              checkLoading(<AddCardsPage updateLoading={setloading} accessToken={state.accessToken} profile={state.profile} 
                navigation={props.navigation} assignProfile={AssignProfile}/>)
              );
            }else if(props.pagetogo==="mycards"){        
              
              // checkLogin();
              return(
                checkLoading(<CardsPage updateLoading={setloading} accessToken={state.accessToken} profile={state.profile} 
                  navigation={props.navigation} assignProfile={AssignProfile}/>)
                );
              }else if(props.pagetogo==="notify"){        
                
                // checkLogin();
                return(
                  checkLoading(<NotificationPage accessToken={state.accessToken} profile={state.profile} updateUnread={props.updateUnread}
                    navigation={props.navigation} assignProfile={AssignProfile}/>)
                  );
                }else if(props.pagetogo==="myevents"){        
                  
                  // checkLogin();
                  return(
                    checkLoading(<EventsPage OpenEvent={props.OpenEvent}  eventObjs={props.eventObjs} updateLoading={setloading} accessToken={state.accessToken} profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>)
                  );
                }else if(props.pagetogo==="myorders"){        
                  
                  // checkLogin();
                  return(
                    checkLoading(<OrdersPage updateLoading={setloading} accessToken={state.accessToken} profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>)
                  );
                }else if(props.pagetogo==="store"){        
                  
                  // checkLogin();
                  return(
                    // checkLoading(<></>)
                    // <HomeData profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>
                    checkLoading(<StorePage profile={state.profile} 
                      navigation={props.navigation} 
                      assignProfile={AssignProfile} 
                      updateLoading={setloading} 
                      accessToken={state.accessToken}
                      isLoading={isLoading} fetchCatalog={fetchCatalogFull}
                      storeCatalog={storeCatalog}/>)
                    );
                  }else if(props.pagetogo==="register"){
                    
                    // checkLogin();
                    return(
                      
                      // <HomeData profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>
                      checkLoading(<RegisterUser profile={state.profile} onDismiss={props.onDismiss}  pagefrom={props.pagefrom} closeOtpModal={closeOtp} navigation={props.navigation} assignProfile={AssignProfile} sendOTP={SendMobileOTP} verifyOTP={VerifyOTP} />)
                    );
                  }else if(props.pagetogo==="signinuser"){
                    // checkLogin();
                    return(
                      
                      // <HomeData profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile}/>
                      checkLoading(<SigninUser useBiometric={useBiometric} 
                        bioKey={bioKey} showsignin={props.showsignin} 
                        setpassmodal={setpass} showOtpError={showOtpError} 
                        onChangePassDismiss={()=>{
                          setshowForgetPass(false);
                        }}
                        showOtpprop={showOtp} forgetPassRequest={forgetPassRequest} 
                        showForgetPass={showForgetPass} forgetPassData={forgetPassData} 
                        closeOtpModal={closeOtp} visible={loginOpen} isLoading={isLoading} 
                        assignProfile={AssignProfile} sendOTP={SendMobileOTP} verifyOTP={VerifyOTP} 
                        onDismiss={signinDismiss}  pagefrom={props.pagefrom} navigation={props.navigation} />)
                      );
                    }else  if(props.pagetogo==="account"){        
                      
                      return(
                        checkLoading(
                          <AccountHandle accessToken={state.accessToken} submitChangePassRequest={submitChangePassRequest} submitDeleteRequest={submitDeleteRequest} profile={state.profile} navigation={props.navigation} assignProfile={AssignProfile} isLoading={isLoading}  redeem={state.redeem} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>
                        )
                      );
                    }else  if(props.pagetogo==="card"){        
                      
                      return(
                        checkLoading(<CardHandle submitChangePassRequest={submitChangePassRequest} pagetodivert={props.pagetodivert} profile={state.profile} navigation={props.navigation} isLoading={isLoading} assignProfile={AssignProfile} redeem={state.redeem} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="offer"){
                      return(
                        checkLoading(<OfferHandle profile={state.profile} navigation={props.navigation}/>)
                      );
                    }else  if(props.pagetogo==="accountEdit"){          
                      
                      return(
                        checkLoading(<AccountEditor submitDeleteRequest={submitDeleteRequest} submitChangePassRequest={submitChangePassRequest} navigation={props.navigation} profile={state.profile} assignProfile={AssignProfile} handler = {handler} /*saveChange={props.saveChange}*//>)
                      );
                    }else  if(props.pagetogo==="receipts"){
                      return(
                        checkLoading(<ReciptsHandle profile={state.profile}/>)
                      );
                    }else  if(props.pagetogo==="benefits"){
                      return(
                        checkLoading(<BenefitsHandle assignProfile={AssignProfile} pagefrom={props.pagefrom} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} redeem={state.redeem} navigation={props.navigation} claims={state.claims} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="claims"){         
                      
                      return(
                        checkLoading(<ClaimsHandle profile={state.profile} pagefrom={props.pagefrom} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} isLoading={isLoading}  redeem={state.redeem} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="redeems"){          
                      
                      return(
                        checkLoading(<RedeemHandle profile={state.profile} pagefrom={props.pagefrom} redeem={state.redeem} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck}  claimpoint={ClaimPoints} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="rules"){          
                      
                      return(
                        
                        
                        checkLoading(<RulesPage profile={state.profile} pagefrom={props.pagefrom} redeem={state.redeem} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="voucherPage"){          
                      
                      return(
                        checkLoading(<VoucherPage assignProfile={AssignProfile} accessToken={state.accessToken} profile={state.profile} pagefrom={props.pagefrom} redeem={state.redeem} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="redeemVoucher"){          
                      
                      
                      return(
                        checkLoading(<RedeemVoucher profile={state.profile} pagefrom={props.pagefrom} redeem={state.redeem} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="redeemVenu"){         
                      
                      return(
                        checkLoading(<RedeemVenu selectedVoucher={props.selectedVoucher} assignProfile={AssignProfile} profile={state.profile} pagefrom={props.pagefrom} redeem={state.redeem} navigation={props.navigation} claims={state.claims} claimprofile={ClaimProfile} claimCheck={claimCheck} claimpoint={ClaimPoints} isLoading={isLoading} redeemProfile={RedeemProfile} redeemPoint={RedeemPoints}/>)
                      );
                    }else  if(props.pagetogo==="points"){
                      return(
                        checkLoading(<PointsHandle profile={state.profile}/>)
                      );
                    }else  if(props.pagetogo==="changepassword"){         
                      
                      
                      return(
                        checkLoading(<PasswordHandle  profile={state.profile} navigation ={props.navigation}/>)
                      );
                    }else  if(props.pagetogo==="settings"){          
                      
                      return(
                        checkLoading(<SettingsHandle biometry={biometryIn} updateSettings={updateMobileToken}  profile={state.profile} defaultValue={'QA'} navigation ={props.navigation}/>)
                      );
                    }
                  }
                  // }
                  
                  // const mapStateToProps = state=>{
                    //   return {
                  //     profile: state.profileReducer.profile,
                  //     memberID:state.profileReducer.memberID,
                  //     accessToken:state.profileReducer.accessToken,
                  //     claims: state.profileReducer.claims,
                  //     redeem: state.profileReducer.redeem,
                  //     // isLoading: state.profileReducer.isLoading,
                  //     onExitDismiss:state.profileReducer.onExitDismiss,
                  //     isConnected:state.profileReducer.isConnected,
                  //   }                
                  // };
                  
                  // const mapDispatchToProps = (dispatch) => {
                    //   return{
                  //     updateCart:(cData)=> dispatch(updateCart(cData)),
                  //     updateClaims:(cData)=> dispatch(updateClaims(cData)),
                  //     updateRedeem:(cData)=> dispatch(updateRedeem(cData)),
                  //     updateProfile: (pData) => dispatch(updateProfile(pData)),
                  //     updateMemberID: (pData) => dispatch(updateMemberID(pData)),
                  //     updateAccessToken: (pData) => dispatch(updateAccessToken(pData)),
                  //     updateLoading: (loadState) => dispatch(updateLoading(loadState)),
                  //     updateonDismiss: (loadState) => dispatch(updateonDismiss(loadState)),
                  
                  //   };
                  // }
                  
                  // function mapDispatchToProps(dispatch,ownprops) {
                  //   return {
                  //     dispatch,
                  //     ...bindActionCreators({ updateProfile, updateLoading }, dispatch)
                  //   }
                  // }
                  
                  // export default connect(
                  //   mapStateToProps,
                  //   mapDispatchToProps
                  //   )(ProfileData)
                  
                  
                  
                  
                  
                  