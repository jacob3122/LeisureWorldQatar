import React, { Component, useState } from 'react'
import {View,StyleSheet,Text,I18nManager,NativeModules,TouchableOpacity,Image,ImageBackground,PixelRatio, SafeAreaView, TextInput,Switch, ScrollView, Linking} from 'react-native';
import PropTypes from 'prop-types';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import SecureStore from '../../Tools/Components/SecureStore';
// import messaging from '@react-native-firebase/messaging';
// import Colors from '../../Tools/constants/Colors';
import * as Tools from '../../Tools/Components/Tools'
import RNRestart from 'react-native-restart';
// import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import homebg from'../../assets/bg/bg-01.jpg'
import star from'../../assets/Icons/star.png'
import settingsIcon from '../../assets/Icons/settings.png'
import signoffButton from '../../assets/Icons/signoff.png'
import editIcon from '../../assets/Icons/edit.png'
import nextIcon from '../../assets/Icons/next.png'
import callIcon from '../../assets/Icons/call.png'
import emailIcon from '../../assets/Icons/email.png'
import {checkNotifications} from 'react-native-permissions';

import HeaderLogo from '../../Tools/Components/HeaderLogo';
// import { Updates } from 'expo';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import BackButton from '../../Tools/Components/BackButton';
import backButton from '../../assets/Icons/back.png'

import * as UIElements from '../../Tools/Components/UIElements'


import {Dimensions } from "react-native";


const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
// import RNRestart from 'react-native-restart'; // Import package from node modules

import bgred from '../../assets/card/red.png';
import WebServices from '../../Tools/constants/WebServices';
import SwitchColored from '../../Tools/Components/SwitchColored';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Picker} from '@react-native-picker/picker';
import { connect } from 'react-redux';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { getBuildId, getBuildNumber, getVersion } from 'react-native-device-info';

export default function SettingsHandle(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [loaded, setLoaded] = useState(1);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showCityPicker, setShowCityPicker] = useState(false);
    const [biometryType, setBiometryType] = useState(undefined);
    const [bioAvailable, setBioAvailable] = useState(undefined);
    const [bioKey, setBioKey] = useState(undefined);
    const [change, setChange] = useState(false);
    const [samepass, setSamePass] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirmNew, setShowConfirmNew] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [helpContent, setHelpContent] = useState([]);
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [currentPassRight, setCurrentPassRight] = useState(0);
    const [validNewPass, setValidNewPass] = useState(0);
    const [smsNotify, setSmsNotify] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberNotifications.sms : false);
    const [emailNotify, setEmailNotify] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberNotifications.email : false);
    const [allowFaceID, setAllowFaceID] = useState(!Tools.IsNull(state.profile) ? (!Tools.IsNull(state.profile.TokenInfo)&&!Tools.IsNull(state.profile.TokenInfo.BiometricToken)?true:false) : false);
    const [language, setLanguage] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.AppLanguage : 'en');
    const [tmpLanguage, setTmpLanguage] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.AppLanguage : 'en');
    const [country, setCountry] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberLocations.country : 'QA');
    const [tmpCountry, setTmpCountry] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberLocations.country : 'QA');
    const [city, setCity] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberLocations.city : 'QA1');
    const [tmpCity, setTmpCity] = useState(!Tools.IsNull(state.profile) ? state.profile.TokenInfo.MemberLocations.city : 'QA1');
    const [rated, setRated] = useState(false);
    const [MainURL] = useState(WebServices.MainURL + '');
    const [pushNotify,setPushNotify]=useState(false);
    const [countryCode,setCountryCode]=useState(undefined);
    const [showLanguagePicker,setshowLanguagePicker]=useState(false);
    const [buildID,setBuildID]=useState(undefined);
    useEffect(()=>{
        const init=async()=>{
            logScreenViewEvent("SettingHandle","Settings");
            gethelpData();
            getCountryInUseData();
            SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
                setLanguage(languagecheck);
            });
            
            SecureStore.getItemAsync('appRated').then(appRate=>{
                // console.log('LC :'+languagecheck);
                if(Tools.stringIsContains(appRate,'true'))
                setRated(true);
                else
                setRated(false);
                
            });
            Tools.updateRatePoints(1);
            
            rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })
            let biometry = await rnBiometrics.isSensorAvailable();
            // rnBiometrics=new ReactNativeBiometrics({ allowDeviceCredentials: true })
            // console.log("B:"+JSON.stringify(biometry));
            setBiometryType(biometry.biometryType);
            setBioAvailable(biometry.available);
            // checkNotificationStatus();
            setBuildID(getBuildNumber());
         
        }
        init();
    },[])
    
    // const checkNotificationStatus= async()=>{
    //     if(Platform.OS === 'ios'){
    //         const authStatus = await messaging().hasPermission();
    //         if(authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    //             // console.log("Push:"+authStatus)
    //             setPushNotify(true);
    //         }else{
    //             setPushNotify(false);
                
    //         }
    //     }else{
    //         checkNotifications().then(({status}) => {
    //             // console.log("Push:"+status)
    //             if(status === 'granted'){
    //                 setPushNotify(true);
    //             }else{
    //                 setPushNotify(false);
                    
    //             }
    //         });
    //     }
    // }
    
    
    
    
    
    const changeHappened=()=>{
        setChange(true);
    }
    
    
    const setLoadingState=(stateP)=>{
        setLoading(stateP);
    }
    
    const performActionWithTime=(callback,params,timeTaken)=>{
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    
    const toggleSwitch=(stateName)=>{
        changeHappened();
        switch(stateName){
            case 'p':{
                setPushNotify(!pushNotify);
                return;
            }case 'e':{
                setEmailNotify(!emailNotify);
                return;
            }case 's':{
                setSmsNotify(!smsNotify);
                return;
            }case 'f':{
                setAllowFaceID(!allowFaceID);
                SecureStore.setItemAsync('useBiometric',allowFaceID?'Y':'N');
                return;
            }
        }
        // setState(stateName==='p'?({pushNotify:!pushNotify}):stateName==="e"?({emailNotify:!emailNotify}):({smsNotify:!smsNotify}))
    }
    
    const gethelpData=()=>{
        return fetch(WebServices.MainURL+WebServices.helpContent.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1)
        .then(response  => response.text())
        .then((findresponse)=>{
            var dataIn=JSON.parse(findresponse);
            // console.log(findresponse);
            if(dataIn.length>0){
                setHelpContent(dataIn[0].ContentItems);
            }
        }).catch(function(error) {
            
        });
    }
    const getCountryInUseData=()=>{
        
        // setState({countryCode:countryCodes})
        return fetch(WebServices.countryinUseData.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1)
        .then(response  => response.text())
        .then((findresponse)=>{
            // console.log('country'+findresponse);
            
            var json = JSON.parse(findresponse);
            var countrycodes =json.countrycodes;
            setCountryCode(countrycodes);
            setLoading(false);
            // console.log('country'+JSON.stringify(countrycodes));
            // setState({
            //     countryCode:countrycodes,loading:false
            // });
            global.countryCode=countrycodes;
            setLoaded(0);
            for (let index = 0; index < countrycodes.length; index++) {
                const element = countrycodes[index];
                if(element.code==props.defaultValue){
                    // setState({datafromDropDown:index});
                    return;
                }
            }
        }).catch(function(error) {
            setLoaded(2);
            // console.warn(loaded+' Request Failed: ', error);
            setCountryCode([
                    {
                        "name": "Qatar",
                        "dial_code": "+974",
                        "code": "QA"
                    }
                ]);
                setLoading(false);
            });
    }
    const setOnOffSms=(_onoff)=>{
        changeHappened();
        // console.log("B:"+_onoff)
        setSmsNotify(!smsNotify);
    }
    const  setOnOffPush=async(_onoff)=>{
        // console.log("B:"+_onoff)
        toggleNotification();
    }
    const toggleNotification=async()=>{
        if(Platform.OS === 'ios'){
            const authStatus = await messaging().hasPermission();
            if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
                const authorizationStatus = await messaging().requestPermission();
                if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    setPushNotify(true);
                }
            } else{
                Linking.openURL('app-settings://')
            }
            
        }else{
            Linking.openSettings();
        }
    }
    const setOnOffEmail=(_onoff)=>{
        changeHappened();
        // console.log("B:"+_onoff)
        setEmailNotify(!emailNotify);
    }
    const setOnOffFaceID=(_onoff)=>{
        {
            try{
                
                rnBiometrics.simplePrompt({promptMessage: 'Confirm BioMetric'})
                .then((resultObject) => {
                    const { success } = resultObject
                    
                    if (success) {
                        changeHappened();
                        _onoff=!_onoff;
                        setAllowFaceID(_onoff);
                        SecureStore.setItemAsync('useBiometric',_onoff?'Y':'N');
                        // console.log('successful biometrics provided')
                    } else {
                        // console.log('user cancelled biometric prompt')
                    }
                    
                })
                .catch(() => {
                    // console.log('biometrics failed')
                })
                
            }
            catch(error){
                // console.log("E:"+error);
            }
        }
    }
    const getSettings=()=>{
        var countryIn=[];
        var countryname='';
        var citiesIn=[];
        var cityname='';
        if(loaded==0){
            countryIn=global.countryCode.filter(item=>(item.code==country));
            // console.log(countryIn)
            
            countryname= countryIn.length>0?countryIn[0].name:global.countryCode[0].name;
            // console.log(countryname)
            
            citiesIn=countryIn.length>0?countryIn[0].cities:global.countryCode[0].cities;
            // console.log(citiesIn)
            
            cityFname= citiesIn.length>0?citiesIn.filter(item=>(item.code==city)):citiesIn;
            // console.log(cityFname)
            
            cityname= cityFname.length>0?cityFname[0].name:'';
            // console.log(cityname)
        }
        return(
            <View style={{alignSelf:'center'}}> 
            <ScrollView
            scrollEnabled={true}
            scrollToOverflowEnabled={true}
            ref={ref => mainScrollRef = ref}
            contentContainerStyle={{paddingBottom:heightPercentageToDP(2)}}
            showsVerticalScrollIndicator={false}
            style={{width:'100%',alignSelf:'center'}}
            >
            {/* <Text style={styles.company} allowFontScaling={false}>{props.profile.FirstName} {props.profile.LastName}</Text> */}
            <View style={styles.titleBar}>
            <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('generalsettings')}</Text>
            </View>
            <TouchableOpacity style={styles.infoBar}
              onPress={()=>{
                setshowLanguagePicker(!showLanguagePicker);
            }}>
            <View style={styles.infoBarHalf}>
            <Text allowFontScaling={false} style={styles.inputInfo}>{i18n.t('language')}</Text>
            <Text allowFontScaling={false} style={styles.titleInfo}>{Tools.stringIsContains(language,'en')?"English":'العَرَبِيَّة'}</Text>
            </View>
            
            <TouchableOpacity
            style={{alignSelf:'flex-end',paddingBottom:heightPercentageToDP(0.5)}}
            onPress={()=>{
                setshowLanguagePicker(!showLanguagePicker);
            }}>
            <Image style={styles.editIcon} source={editIcon}/></TouchableOpacity>
            </TouchableOpacity>
            
            {showLanguagePicker&&<>
                <View style={{width:'100%',height:'15%',overflow:'hidden'}}>
                <Picker
                style={{justifyContent:'center',height:'100%'}}
                selectedValue={tmpLanguage}
                onValueChange={(itemValue, itemIndex) =>{
                    setTmpLanguage(itemValue);
                }
            }>
            <Picker.Item allowFontScaling={false} label="English" value="en" />
            <Picker.Item allowFontScaling={false} label={'العَرَبِيَّة'} value="ar" />
            </Picker>
            </View>
            <View style={{marginHorizontal:widthPercentageToDP(2),maxHeight:heightPercentageToDP(4),justifyContent:'space-between',flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{
                OnSelectedLanguage(tmpLanguage);
                changeHappened();
                setshowLanguagePicker(false);
            }} style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
            <Text style={{ color:Colors.whiteColor,alignSelf:'center', includeFontPadding: false , fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('done')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                setshowLanguagePicker(false);
            }}  style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
            <Text style={{ color:Colors.whiteColor,alignSelf:'center', includeFontPadding: false , fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('cancel')}</Text>
            </TouchableOpacity>
            </View>
            </>}
            {UIElements.drawGap(heightPercentageToDP(1))}
            <View style={styles.infoBar}>
            <View style={styles.infoBarHalf}>
            <Text allowFontScaling={false} numberOfLines={1} style={styles.inputInfo}>{i18n.t('notifications')}</Text>
            </View>
            </View>
            {/* {UIElements.drawGap(heightPercentageToDP(1))} */}
            <View style={styles.infoBar}>
            <View style={styles.infoBarHalf}>
            <Text allowFontScaling={false} style={styles.titleInfo}>{i18n.t('pushnotification')}</Text>
            </View>
            <SwitchColored stateIn={pushNotify} setOnOff={setOnOffPush}/>
            </View>
            {!Tools.IsNull(state.profile)&&<>
                <View style={styles.infoBar}>
                <View style={styles.infoBarHalf}>
                <Text allowFontScaling={false} style={styles.titleInfo}>{i18n.t('smsnotification')}</Text>
                </View>
                <SwitchColored stateIn={smsNotify} setOnOff={setOnOffSms}/>
                </View>
                <View style={styles.infoBar}>
                <View style={styles.infoBarHalf}>
                <Text allowFontScaling={false} style={[styles.titleInfo]}>{i18n.t('emailnotification')}</Text>
                </View>
                <SwitchColored stateIn={emailNotify} setOnOff={setOnOffEmail}/>
                </View>
                {bioAvailable&&<View style={styles.infoBar}>
                <View style={styles.infoBarHalf}>
                <Text allowFontScaling={false} style={[styles.titleInfo]}>{i18n.t('allowfaceid')}</Text>
                
                </View>
                <SwitchColored disabled={!bioAvailable} stateIn={allowFaceID} setOnOff={setOnOffFaceID}/>
                </View>}</>}
                {UIElements.drawGap(heightPercentageToDP(1))}
                {loaded==0&&<>
                    {/* <View style={styles.titleBar}>
                    <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('locationsettings')}</Text>
                </View> */}
                <View style={styles.infoBar}>
                <View style={styles.infoBarHalf}>
                <Text numberOfLines={1} allowFontScaling={false} style={styles.inputInfo}>{i18n.t('country')}</Text>
                <Text allowFontScaling={false} style={styles.titleInfo}>{countryname}</Text>
                </View>
                <TouchableOpacity 
                style={{alignSelf:'flex-end',paddingBottom:heightPercentageToDP(0.5)}}
                onPress={()=>{
                    setShowCountryPicker(!showCountryPicker);
                    setTimeout(() => {
                        mainScrollRef.scrollTo({y:200, animated: true })
                    }, 100);
                }} ><Image style={styles.editIcon} source={editIcon}/></TouchableOpacity>
                </View>
                {showCountryPicker&&<>
                    <View style={{width:'100%',height:'15%',overflow:'hidden'}}><Picker
                    style={{justifyContent:'center',height:'100%'}}
                    selectedValue={tmpcountry}
                    onValueChange={(itemValue, itemIndex) =>{
                        setTmpCountry(itemValue);
                    }
                }>
                {global.countryCode.map(item=>{
                    return(
                        <Picker.Item allowFontScaling={false} label={item.name} value={item.code} />
                        )
                    })}
                    </Picker></View>
                    <View style={{marginHorizontal:widthPercentageToDP(2),maxHeight:heightPercentageToDP(4),justifyContent:'space-between',flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{
                        OnSelectedCountry(tmpcountry);
                        changeHappened();
                        setShowCountryPicker(false);
                    }} style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
                    <Text style={{ color:Colors.whiteColor,alignSelf:'center', includeFontPadding: false , fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('done')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        setShowCountryPicker(false);
                    }} style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
                    <Text style={{ color:Colors.whiteColor,alignSelf:'center', includeFontPadding: false , fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('cancel')}</Text>
                    </TouchableOpacity>
                    </View></>}
                    <View style={styles.infoBar}>
                    <View style={styles.infoBarHalf}>
                    <Text numberOfLines={1} allowFontScaling={false} style={styles.inputInfo}>{i18n.t('city')}</Text>
                    <Text allowFontScaling={false} style={styles.titleInfo}>{cityname}</Text>
                    </View>
                    <TouchableOpacity 
                    style={{alignSelf:'flex-end',paddingBottom:heightPercentageToDP(0.5)}}
                    onPress={()=>{
                        setShowCityPicker(!showCityPicker)
                        setTimeout(() => {
                            mainScrollRef.scrollTo({
                                y:200, 
                                animated: true 
                            })
                        }, 100); 
                    }}><Image style={styles.editIcon} source={editIcon}/></TouchableOpacity>
                    </View>
                    
                    {showCityPicker&&<>
                        <View style={{width:'100%',height:'15%',overflow:'hidden'}}><Picker
                        style={{justifyContent:'center',height:'100%'}}
                        selectedValue={tmpcity}
                        onValueChange={(itemValue, itemIndex) =>{
                            setTmpCity(itemValue);
                        }
                    }>
                    <Picker.Item allowFontScaling={false} label={''} value={''} />
                    {citiesIn.map(item=>{
                        return(
                            <Picker.Item allowFontScaling={false} label={item.name} value={item.code} />
                            )
                        })}
                        </Picker></View>
                        <View style={{marginHorizontal:widthPercentageToDP(2),maxHeight:heightPercentageToDP(4),justifyContent:'space-between',flexDirection:'row',marginBottom:heightPercentageToDP(1)}}>
                        <TouchableOpacity onPress={()=>{
                            OnSelectedCity(tmpcity);
                            changeHappened();
                            setShowCityPicker(false);
                        }} style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
                        <Text style={{ color:Colors.whiteColor,alignSelf:'center', includeFontPadding: false , fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('done')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            setShowCityPicker(false);
                        }} style={{width:widthPercentageToDP(25), backgroundColor:Colors.blueColor,height:heightPercentageToDP(4),borderRadius:heightPercentageToDP(4)}}>
                        <Text style={{ color:Colors.whiteColor,alignSelf:'center',  includeFontPadding: false ,fontSize:widthPercentageToDP(4),fontFamily:'Cairo-Regular',paddingHorizontal:widthPercentageToDP(3)}}>{i18n.t('cancel')}</Text>
                        </TouchableOpacity>
                        </View></>}
                        
                        
                        </>}
                        {change&& (<View>{UIElements.drawGap(10)}
                        <TouchableOpacity style={styles.Button} onPress={()=>{OnSave()}}>
                        <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t("savechange")}</Text>
                        </TouchableOpacity>
                        {UIElements.drawGap(10)}
                        </View>)} 
                        {helpContent.length>0&&<>
                            <View style={styles.titleBar}>
                            <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('helpnsupport')}</Text>
                            </View>
                            {/* <View style={styles.infoBar}>
                            <View style={styles.infoBarHalf}>
                            <Text allowFontScaling={false} numberOfLines={1} style={styles.inputInfo}>{i18n.t('help')}</Text>
                        </View></View> */}
                        {helpContent.map((item)=>{
                            return(
                                <TouchableOpacity
                                onPress={()=>{
                                    console.log('URL : '+item.Navigation.NavParameter);
                                    props.navigation.navigate('Adpage',{
                                        url:item.Navigation.NavParameter
                                    })
                                }} style={styles.infoBar}>
                                <View style={styles.infoBarHalf}>
                                <Text allowFontScaling={false} numberOfLines={1} style={styles.titleInfo}>{item.Title}</Text>
                                </View>
                                <Image resizeMode='contain' style={{width:widthPercentageToDP(6),height:widthPercentageToDP(6),tintColor:Colors.blueColor,alignSelf:'center',transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={nextIcon}/>
                                </TouchableOpacity>
                                )
                            })}
                            
                            </>}
                            {UIElements.drawGap(heightPercentageToDP(1))}
                            <View style={styles.titleBar}>
                            <Text allowFontScaling={false} style={styles.titleTxt}>{i18n.t('contactus')}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{
                                Linking.openURL(WebServices.leisuresupportCall)
                            }} style={styles.infoBar}>
                            <View style={styles.infoBarHalf}>
                            <Text allowFontScaling={false} numberOfLines={1} style={styles.titleInfo}>{i18n.t('contactcallcentre')}</Text>
                            </View>
                            <Image resizeMode='contain' style={{width:widthPercentageToDP(6),height:widthPercentageToDP(6),alignSelf:'center',tintColor:Colors.blueColor}} source={callIcon}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                Linking.openURL(WebServices.leisuresupportEmail)
                            }} style={styles.infoBar}>
                            <View style={styles.infoBarHalf}>
                            <Text allowFontScaling={false} numberOfLines={1} style={styles.titleInfo}>{i18n.t('emailtosupport')}</Text>
                            </View>
                            <Image resizeMode='contain' style={{width:widthPercentageToDP(6),height:widthPercentageToDP(6),alignSelf:'center',tintColor:Colors.blueColor}} source={emailIcon}/>
                            </TouchableOpacity>
                            {UIElements.drawGap(heightPercentageToDP(1))}
                            <View style={{paddingHorizontal:widthPercentageToDP(4)}}>
                            <Text allowFontScaling={false} numberOfLines={1} style={[styles.titleInfo,{fontSize:widthPercentageToDP(4)}]}>Version {getVersion()}({buildID})</Text>
                            </View>
                            {UIElements.drawGap(heightPercentageToDP(1))}

                            </ScrollView>
                            </View>
                            )
                        }
                        
                        const OnSelectedLanguage=(langcode)=>{
                            setLanguage(langcode);
                            changeHappened();
                        }
                        const OnSelectedCountry=(code)=>{
                            setCountry(code);()=>{
                                
                                changeHappened()}
                            }
                            const OnSelectedCity=(code)=>{
                                setCity(code);
                                changeHappened();
                            }
                            
                            const changeLanguage=(langToggle)=>{
                                // console.log(" lang :"+langToggle);
                                SecureStore.getItemAsync('languageENAR').then(lan=>{
                                    // console.log(lan+" lang :"+langToggle);
                                    if(lan!==langToggle){
                                        SecureStore.setItemAsync('languageENAR',langToggle);
                                        i18n.locale=langToggle;
                                        CheckRTL=(i18n.locale.indexOf("ar") > -1)?true:false;
                                        I18nManager.allowRTL(CheckRTL);
                                        I18nManager.forceRTL(CheckRTL);
                                        
                                        // console.log(i18n.locale+":"+CheckRTL+":"+I18nManager.isRTL);
                                        setTimeout(() => {
                                            RNRestart.Restart();
                                            
                                        }, 100);
                                    }
                                });
                            }
                            
                            const OnSave=()=>{
                                // console.log("lang :"+JSON.stringify(props.profile));
                                //update server
                                if(!Tools.IsNull(state.profile)){
                                    profile=state.profile;
                                    profile.TokenInfo.MemberNotifications.sms=smsNotify;
                                    profile.TokenInfo.MemberNotifications.email=emailNotify;
                                    profile.TokenInfo.MemberNotifications.app=pushNotify;
                                    
                                    profile.TokenInfo.MemberLocations.country=country;
                                    profile.TokenInfo.MemberLocations.city=city;
                                    
                                    // profile.TokenInfo.BiometricToken=allowFaceID?:false;
                                    dispatch({
                                        type:'update_Profile',
                                        payload:profile
                                    })
                                    var updateSettings= props.updateSettings;
                                    updateSettings(null,allowFaceID?null:"",profile);
                                    
                                }
                                setChange(false);
                                changeLanguage(language);
                            }
                            
                            const styles = StyleSheet.create({
                                bottompart:{
                                    position:'absolute',backgroundColor:Colors.orangeColor,flex:1,
                                    width:widthPercentageToDP('70%'),
                                    height:widthPercentageToDP('60%'),
                                    top:0,
                                    left:0,
                                    borderRadius:30,
                                    overflow:'hidden'
                                },
                                bgcard:{
                                    position:'absolute',
                                    resizeMode:'contain',
                                    alignSelf:'center',
                                    // aspectRatio:1417/895,
                                    // width:wp('99%'),
                                    width:widthPercentageToDP('70%'),
                                    // left:0,
                                    top:(widthPercentageToDP('60%')/2)-40,
                                },
                                totalView:{
                                    marginTop:heightPercentageToDP(1),
                                    paddingTop:heightPercentageToDP(8),
                                    padding:10,
                                    alignSelf:'center',
                                    height:'90%',
                                    width:widthPercentageToDP(93),
                                    borderRadius:widthPercentageToDP(4),
                                    backgroundColor:Colors.whiteColor
                                },
                                star:{
                                    tintColor:Colors.orangeColor,
                                    width:20,height:20,resizeMode:'contain',alignSelf:'center'
                                },
                                selectedBorder:{
                                    borderRadius:15,
                                    backgroundColor:Colors.orangeColor,
                                    flex:0.3,
                                    height:35,
                                    justifyContent:'center',
                                    alignSelf:'center'
                                },
                                notselectedBorder:{
                                    flex:0.3,
                                    height:35,
                                    justifyContent:'center',
                                    alignSelf:'center'
                                },
                                detailstitle:{
                                    alignSelf:'center',
                                    fontSize: 22,
                                    textTransform:'uppercase',
                                    fontWeight: '200',
                                    paddingTop:40,
                                    paddingBottom:20,
                                    width:220,
                                    textAlign:'center',
                                    color:Colors.whiteColor,
                                    fontFamily:'Cairo-Regular',
                                    flex:0.75
                                },
                                buttonheadtitle:{
                                    alignSelf:'center',
                                    fontSize: 17,
                                    textTransform:'uppercase',
                                    // fontWeight: '900',
                                    textAlign:'center',
                                    color:Colors.inputfontColor,
                                    fontFamily:'Cairo-Bold',
                                },
                                inputData:{
                                    fontSize: 17,
                                    fontWeight: '100',
                                    color:Colors.inputfontColor,
                                    fontFamily:'Cairo-Regular',
                                    textAlign:'center',
                                    alignSelf:'center'
                                },
                                switchview:{
                                    // flex:(Platform.OS==='ios'?(0.5):1),
                                    flex:0.5,
                                    // borderWidth:1,
                                    justifyContent:'center',
                                },switch:{
                                    // borderWidth:2,
                                    alignSelf:'flex-end',
                                    color:Colors.orangeColor,
                                    
                                },
                                
                                logoImg:{
                                    alignSelf:'flex-start',
                                    marginLeft:15,
                                    width:70.2*(width/280),
                                    height:65.3*(width/280),
                                    // maxWidth:220,
                                }, titleView:{
                                    position:'absolute',
                                    borderWidth:2,
                                    borderRadius:10,
                                    alignSelf:'flex-end',
                                    transform:[{translateX:width/4.5},{translateY:50}],
                                    borderColor:Colors.whiteColor,
                                },
                                titleTxt:{
                                    includeFontPadding: false ,
                                    color:Colors.whiteColor,
                                    fontFamily:'Cairo-Regular',
                                    fontSize: widthPercentageToDP(3.95),
                                    paddingHorizontal:widthPercentageToDP(4.5)
                                },
                                bgImage:{
                                    position:'absolute',
                                    alignSelf:'center',
                                    width:'100%',
                                    height:height,
                                    resizeMode:'contain'
                                },
                                warning:{
                                    color:Colors.warningColor,
                                    marginTop:15,
                                    // paddingBottom:15,
                                    // fontWeight:'bold',
                                    marginStart:width/9,
                                    fontFamily:'Cairo-Bold',
                                    fontSize: 18
                                },
                                gradStyle:{
                                    position:'absolute',
                                    width:width,
                                    height:height,
                                    zIndex:-1,
                                    // borderRadius:15,
                                },
                                Button:{
                                    // flex:1,
                                    height:heightPercentageToDP(4.75),
                                    alignSelf:'center',
                                    alignItems:'center',
                                    borderRadius:heightPercentageToDP(4.75),
                                    backgroundColor:Colors.blueColor,
                                    justifyContent:'center'
                                },
                                buttontext:{
                                    includeFontPadding: false ,
                                    paddingHorizontal:widthPercentageToDP(5),
                                    fontSize:widthPercentageToDP(4),
                                    color:Colors.whiteColor,
                                    fontFamily:'Cairo-Regular'
                                },
                                rowView:{
                                    height:30,
                                    flexDirection: 'row',
                                    alignSelf:'center'
                                },   
                                homeView: {
                                    flex: 1,
                                    // backgroundColor:'#fff',
                                },
                                homeScrollView: {
                                    // backgroundColor:'#fff',
                                    padding:15,
                                    
                                },heading: {
                                    textAlign:'left',
                                    fontSize: 35,
                                    // fontWeight: 'bold',
                                    color:Colors.darkfontColor,fontFamily:'Cairo-Bold'
                                },
                                subheading: {
                                    flex:0.45,
                                    textAlign:'left',
                                    paddingTop:10,
                                    fontSize: 18,
                                    // height:40,
                                    textAlignVertical:'center',
                                    // fontWeight: 'bold',
                                    color:Colors.darkfontColor,
                                    fontFamily:'Cairo-Bold',
                                    // borderWidth:1
                                },inputView:{
                                    flex:1,
                                    // borderWidth:2,
                                    flexDirection:'column',
                                    alignItems:'flex-start',
                                    alignContent:'flex-start',
                                    borderWidth:2,
                                    borderColor:Colors.whiteColor,
                                    backgroundColor:Colors.inputboxColor,
                                    borderRadius:15,
                                    marginBottom:20,
                                },Names:{
                                    color:Colors.blueColor,
                                    fontFamily:'Cairo-Bold',
                                    alignSelf:'center',
                                    fontSize:widthPercentageToDP(5),
                                    lineHeight:widthPercentageToDP(5)*1.4
                                },titleBar:{
                                    backgroundColor:Colors.blueColor,
                                    borderRadius:widthPercentageToDP(2)
                                },infoBar:{
                                    marginTop:heightPercentageToDP(.8),
                                    flexDirection:'row',
                                    width:'90%',
                                    justifyContent:'space-between',
                                    alignSelf:'center',
                                    // borderWidth:1,
                                },infoBarHalf:{
                                    width:'83%',
                                    // justifyContent:'center',
                                    // paddingEnd:widthPercentageToDP(2),
                                    alignSelf:'flex-start'
                                },editIcon:{
                                    alignSelf:'flex-end',width:widthPercentageToDP(5.5),height:widthPercentageToDP(5.5),tintColor:Colors.blueColor
                                },titleInfo:{
                                    includeFontPadding: false ,
                                    textAlign:'left',
                                    alignSelf:'flex-start',
                                    fontFamily:'Cairo-Regular',
                                    fontSize:widthPercentageToDP(5),
                                    width:'90%',
                                    lineHeight:widthPercentageToDP(5)*1.5,
                                    color:Colors.black,
                                },inputInfo:{
                                    includeFontPadding: false ,
                                    alignSelf:'flex-start',
                                    fontFamily:'Cairo-Regular',
                                    fontSize:widthPercentageToDP(4.5),
                                    lineHeight:widthPercentageToDP(4.5)*1.5,
                                    color:Colors.inactiveTab
                                }, shadow:{
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowRadius: 3,
                                    shadowOpacity: 0.12,
                                },
                                
                            });
                            return (
                                <View style={{flex:1,backgroundColor:Colors.bgColor}}>
                                <BackgroundWall/>
                                <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
                                <View style={{height:heightPercentageToDP(78),width:widthPercentageToDP(93),alignSelf:'center',marginTop:heightPercentageToDP(1)}}>
                                
                                <TouchableOpacity style={{}} onPress={()=>{ 
                                    props.navigation.goBack();
                                }}>
                                <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                </TouchableOpacity>
                                
                                {/* <Image source={bgred} style={{transform: [
                                    { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 }
                                ],position:'absolute',top:heightPercentageToDP('50%'),opacity:1}}/> */}
                                <View style={[styles.totalView,{marginTop:heightPercentageToDP(5)}]}>
                                <View style={[{ 
                                    position:'absolute',
                                    justifyContent:'center',
                                    backgroundColor:Colors.whiteColor,
                                    width:widthPercentageToDP(23),
                                    height:widthPercentageToDP(23),
                                    borderRadius:widthPercentageToDP(23),
                                    alignSelf:'center',top:-1*widthPercentageToDP(12),
                                },styles.shadow]}>
                                <Image
                                style={{alignSelf:'center',width:widthPercentageToDP(12),tintColor:Colors.blueColor,
                                height:widthPercentageToDP(12)}}
                                resizeMode='contain'
                                source={settingsIcon}/>
                                </View>
                                {getSettings()}
                                
                                </View>
                                </View></SafeAreaView>
                                </View>
                                )
                            }
                            
                            
                            