import React, { Component } from 'react'
import {View,StyleSheet,Text,I18nManager,NativeModules,TouchableOpacity,Image,ImageBackground,PixelRatio, SafeAreaView, TextInput, ActivityIndicator, StatusBar,} from 'react-native';
import PropTypes from 'prop-types';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import SecureStore from '../../Tools/Components/SecureStore';

import Colors from '../../Tools/constants/Colors';
import * as Tools from '../../Tools/Components/Tools'
import RNRestart from 'react-native-restart';

import HeaderLogo from '../../Tools/Components/HeaderLogo';
// import { Updates } from 'expo';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import BackButton from '../../Tools/Components/BackButton';
import backButton from '../../assets/Icons/back.png'

import * as UIElements from '../../Tools/Components/UIElements'

import {Dimensions } from "react-native";

import Share from 'react-native-share';

const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

import WebServices from '../../Tools/constants/WebServices';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';

import { logScreenViewEvent, logShareInviteClickEvent } from '../../Tools/Analytics/AppAnalytics';
import { connect } from 'react-redux';

import {updateProfile} from '../../src/js/actions/profileActions';
import { useEffect } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useState } from 'react';


export default function ReferFriendHandle(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [change, setChange] = useState(false);
    const [Code, setCode] = useState(Tools.stringIsEmpty(state.profile.MembersInvitationCode) ? "" : state.profile.MembersInvitationCode.toUpperCase());
    const [language, setLanguage] = useState('');
    useEffect(()=>{
        logScreenViewEvent("Referafriend","referPage");
        SecureStore.getItemAsync('languageENAR').then(languagecheck=>{
            // console.log('LC :'+languagecheck);
            setLanguage(languagecheck);
        });
        if(Tools.stringIsEmpty(Code)){
            getInviteCode(state.profile.Id);
        }else{
            // console.log("InviteCode : "+Code);
        }
        Tools.updateRatePoints(1);
    },[]);
    
    const getInviteCode=(_memberId=null)=>{
        const verifyurl= WebServices.GenerateInviteCode.replace('{MemberID}',_memberId);
        // console.log("URL getInviteCode : "+verifyurl);
        return fetch(WebServices.MainURL +verifyurl, {
            method: 'POST',
            headers: {
                'Authorization':'Bearer '+state.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        }, WebServices.timeout)
        .then((response) =>   {
            if(response.ok)
            return response.text();
            else{
                throw new Error('Request failed with status code ' + response.status);
            }}).then((responseJson) => {
                // console.log("getInviteCode : "+JSON.stringify(responseJson));
                
                if(Tools.stringIsContains(responseJson,'denied')){
                    return;
                }else{
                    dataGot = responseJson;
                    // console.log(dataGot);
                    let codeIn=responseJson.replace(/"/g, '').toUpperCase();
                    setCode(codeIn);
                        profileIn=props.profile;
                        profileIn.MembersInvitationCode=codeIn;
                        if(!Tools.IsNull(profileIn)){
                            dispatch({
                                type:'update_Profile',
                                payload:profileIn
                            })
                        }
                }
            })
            .catch((error) =>{
                console.error("getInviteCode"+error);
            });
        }
        
        
        const changeHappened=()=>{
            setChange(true);
        }
        
        const performActionWithTime=(callback,params,timeTaken)=>{
            setTimeout(() => {callback(params)},timeTaken);
        }
        const shareInvite=(_title,_message)=>{
            Share.open({ message:_title, url: _message })
        }
        const OnSelectedLanguage=(langcode)=>{
            setLanguage(langcode);
            changeHappened();
        }
        useEffect(()=>{
                i18n.locale=global.locale;
            },[global.locale])
        const changeLanguage=(langToggle)=>{
            SecureStore.getItemAsync('languageENAR').then(lan=>{
                if(lan!==langToggle){
                    SecureStore.setItemAsync('languageENAR',langToggle);
                    i18n.locale=langToggle;
                    CheckRTL=(i18n.locale.indexOf("ar") > -1)?true:false;
                    I18nManager.allowRTL(CheckRTL);
                    I18nManager.forceRTL(CheckRTL);
                    
                    setTimeout(() => {
                        RNRestart.Restart();
                        
                    }, 100);
                }
            });
        }
        
        const OnSave=()=>{
            //update server
            setChange(false);
            changeLanguage(language);
        }
        
        const styles = StyleSheet.create({
            
            totalView:{
                padding:widthPercentageToDP(2),
                alignSelf:'center',
                justifyContent:'center',
                height:heightPercentageToDP(75),
                width:widthPercentageToDP('85%'),
                borderRadius:widthPercentageToDP(5),
                backgroundColor:Colors.whiteColor
            },
            detailstitle:{
                alignSelf:'center',
                fontSize: 22,
                textTransform:'uppercase',
                fontWeight: '200',
                width:'90%',
                textAlign:'center',
                color:Colors.black,
                fontFamily:'Cairo-Regular',
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
            referTxt:{
                textTransform: 'uppercase',
                color:Colors.black,
                alignSelf:'center',
                fontFamily:'Cairo-Bold',
                fontSize: widthPercentageToDP(5),
                textAlign:'center'
            },
            
            Button:{
                // flex:1,
                width:widthPercentageToDP('40%'),
                height:heightPercentageToDP(4.5),
                alignSelf:'center',
                alignItems:'center',
                backgroundColor:Colors.blueColor,
                borderRadius:heightPercentageToDP(4.5),
                justifyContent:'center'
            },
            buttontext:{
                fontSize:15,
                color:Colors.whiteColor,
                fontFamily:'Cairo-Regular',
                alignSelf:'center',
                textTransform:'uppercase'
            },
        });
        return (
            <View style={{flex:1,backgroundColor:Colors.bgColor}}>
            <BackgroundWall/>
            <SafeAreaView style={{marginTop:StatusBar.currentHeight}}>
            {/* <TouchableOpacity style={{position:'absolute', marginTop:heightPercentageToDP(6),marginRight:20,marginLeft:20}} onPress={()=>{props.navigation.goBack()}}>
            <Image style={{tintColor:Colors.orangeShadeColor,width:35,height:35}} source={backButton}/>
        </TouchableOpacity> */}
        <View style={{width:'90%',alignSelf:'center'}}>
        <TouchableOpacity onPress={()=>{props.navigation.goBack()}}>
        <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
        </TouchableOpacity>
        </View>
        {/* <Image source={bgred} style={{transform: [
            { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 }
        ],position:'absolute',top:heightPercentageToDP('50%'),opacity:1}}/> */}
        <View style={styles.totalView}>
        {UIElements.drawGap(50)}
        {/* <Text allowFontScaling={false} numberOfLines={1} style={styles.detailstitle}>{i18n.t('howitworks')}</Text> */}
        <Text allowFontScaling={false} style={styles.detailstitle}>{i18n.t('referralmessage')}</Text>
        {UIElements.drawGap(10)}
        <View style={{
            backgroundColor:Colors.whiteColor,
            justifyContent:'center',
            borderRadius:widthPercentageToDP(2.5),alignSelf:'center',width:'80%',
            height:heightPercentageToDP(5)
        }}>
        {Tools.stringIsEmpty(Code)&&<ActivityIndicator/>}
        {!Tools.stringIsEmpty(Code)&&<Text allowFontScaling={false} numberOfLines={1} style={styles.referTxt}>{Code}</Text>}
        </View>
        {UIElements.drawGap(10)}
        <TouchableOpacity onPress={()=>{
            logShareInviteClickEvent(Code);
            shareInvite(i18n.t('signupwithcode').replace('{code}',Code),WebServices.CodeUrl.replace('{Code}',Code))
        }} style={styles.Button}>
        <Text style={styles.buttontext}>{i18n.t('share')}</Text>
        </TouchableOpacity>
        {UIElements.drawGap(50)}
        
        <Text allowFontScaling={false}  style={styles.buttonheadtitle}>{i18n.t('howitworks')}</Text>
        <Text allowFontScaling={false}  style={[styles.buttontext,{color:Colors.blueColor, width:'90%',alignSelf:'center',textAlign:'center'}]}>{i18n.t('howitworksdata').replace(/\\n/g,'\n')}</Text>
        {/* {UIElements.drawGap(50)}
        <TouchableOpacity style={{justifyContent:'center'}}>
        <Text allowFontScaling={false}  style={[styles.buttontext,{fontFamily:'Cairo-Bold'}]}>{i18n.t('termsofuse')}</Text>
    </TouchableOpacity> */}
    {/* <BackButton onpress={()=>props.navigation.goBack()}/> */}
    </View></SafeAreaView>
    </View>
    )
}


