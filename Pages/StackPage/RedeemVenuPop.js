import React, { Component, useEffect } from 'react'
import {View,ScrollView,StyleSheet,Text,Image,SafeAreaView,TextInput,TouchableOpacity,PixelRatio} from 'react-native';
import * as UiElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import Colors from '../../Tools/constants/Colors';
// import Voucher from '../../Tools/Components/Voucher';
// import vouchers from '../../Tools/constants/vouchers';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
// import RedeemVenue from './RedeemVenue';
// import { NavigationEvents } from 'react-navigation';
import backButton from '../../assets/Icons/back.png'

import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';

import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
// import cardbgB from '../../assets/card/carddeb.png';

import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import BackButton from '../../Tools/Components/BackButton';

import * as Tools from '../../Tools/Components/Tools.js'
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import OTP from '../../Tools/Components/OTP';
import { Modal } from 'react-native';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useState } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';

export default function(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    let _myScroll=ScrollView;
    const [loading, setLoading] = useState(true);
    const [passcode, setPasscode] = useState('');
    useEffect(()=>{
        logScreenViewEvent("RedeemVenu","Venue Passcode");
        Tools.updateRatePoints(1);
    },[]);
    
    
    const setLoadingState=(stateP)=>{
        setLoading(stateP);
    }
    
    const performActionWithTime=(callback,params,timeTaken)=>{
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    
    const getLoading=()=>{
        return(
            <View>
            {UiElements.drawGap(10)}
            </View>
            )
        }
        const styles = StyleSheet.create({
            detailstitle:{
                textAlign:'center',
                alignSelf:'center',
                // marginTop:15,
                color:Colors.whiteColor,
                fontFamily:'Cairo-Bold',
                fontSize:14,
                lineHeight:14*1.5,
                textTransform:'uppercase',
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3,
            },
            bottomBar:
            {
                width:widthPercentageToDP(20),
                backgroundColor:Colors.blueColor,
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                height:widthPercentageToDP(12),
                borderRadius:widthPercentageToDP(4)
            },
            
            bgcard:{
                position:'absolute',
                resizeMode:'contain',
                alignSelf:'center',
                // aspectRatio:1417/895,
                // width:wp('99%'),
                width:'100%',
                // left:0,
                top:hp('4'),
            },
            points: {
                // position:'absolute',
                alignSelf:'flex-start',
                paddingLeft:10,
                textAlign:'left',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Bold',
                fontSize: 35,
                lineHeight:35*1.4
            },
            totalView:{
                // marginBottom:10,
                // flex:1,
                // aspectRatio:1417/895,
                alignSelf:'center',
                justifyContent:'center',
                // shadowColor: "#000",
                // shadowOffset: {
                //     width: 2,
                //     height: 4,
                // },
                // shadowOpacity: .6,
                // shadowRadius: 10,
                // borderWidth:1,
                // elevation: 20,
                // height:hp('60'),
                height:'50%',
                width:'100%',
            },
            
            inputValueView:{
                height:heightPercentageToDP(4.75),
                alignSelf:'center',
                width:widthPercentageToDP(70),
                backgroundColor:Colors.whiteColor,
                borderRadius:heightPercentageToDP(4.75),
                alignContent:'center',justifyContent:'center'
            },shadow:{
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 3,
                shadowOpacity: 0.12,
            },
            inputValue: {
                fontSize: 18,
                height:50,
                color: Colors.inputfontColor,
                alignSelf:'center',
                width:widthPercentageToDP("50%"),
                textAlign:'center',
                fontFamily:'Cairo-Regular',
            },
            Button:{
                // flex:1,
                // width:widthPercentageToDP("50%"),
                paddingHorizontal:widthPercentageToDP(5),
                height:heightPercentageToDP(4.75),
                alignSelf:'center',
                alignItems:'center',
                backgroundColor:Colors.blueColor,
                borderRadius:heightPercentageToDP(4.75),
                justifyContent:'center'
            },
            buttontext:{
                fontSize:15,
                color:'white',
                // textTransform:'uppercase',
                fontFamily:'Cairo-Regular',
                alignSelf:'center'
            },
            RedeemTitle:{
                fontSize:20,
                lineHeight:20*1.4,
                fontFamily:'Cairo-Regular',
                color:Colors.inputfontColor,
                textAlign:'center',
                alignSelf:'center',
                // width:100,
                // lineHeight:26,
                // height:widthPercentageToDP(6),
                textAlignVertical:'center'
            },
            RedeemPoint:{
                fontWeight:'100',
                fontSize:18,
                fontFamily:'Cairo-Regular',
                color:Colors.whiteColor,
                textAlign:'center',
            },
            
            
            
            backbut:{
                position:'absolute',
                alignSelf:'center',
                width:50,
                height:50,
                // bottom:hp('36%'),
                bottom:hp('3%'),
                zIndex:2,
            },
            heading: {
                textAlign:'left',
                paddingLeft:20,
                fontFamily:'Cairo-Regular',color:Colors.blueColor
            },
        });
         
        const onSubmitPass=()=>{
            var redeemPoint= props.redeemPoint;
            redeemPoint(props.selectedVoucher.Id,passcode,()=>{
                resetPage=props.resetPage;
                resetPage();
            });
            // setState({otpModal:true});
        }
        
        const OnVerifyDone=(Vstate)=>{
         
        }
        return (
            <View style={{flexDirection:'column'}}>
            <View style={{width:'100%',justifyContent:'center'}}>
            <View  style={styles.totalView}>
            <View style={ {}}>
            <View style={{alignSelf:'center',justifyContent:'center',width:'100%',paddingTop:heightPercentageToDP(8)}}>
            <OTP boxStyle={{backgroundColor:Colors.bgColor}} title={false} onChangeText={(text)=>{setPasscode(text)}}/>
            
            {UiElements.drawGap(heightPercentageToDP(4))}
            <TouchableOpacity style={styles.Button} onPress={()=>{onSubmitPass()}}>
            <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t('submit')}</Text>
            </TouchableOpacity>
            </View></View>
            </View>
            
            </View>
            </View>
            )
        }
       
        
    