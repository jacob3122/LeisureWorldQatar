import React, { Component, useEffect, useState } from 'react'
import {View,ScrollView,StyleSheet,Text,Image,SafeAreaView,TouchableOpacity,PixelRatio} from 'react-native';
import * as UiElements from '../../Tools/Components/UIElements'
import i18n from 'i18n-js';
// import Gradient from 'react-native-css-gradient';
// import Colors from '../../Tools/constants/Colors';
import Voucher from '../../Tools/Components/Voucher';
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import * as Tools from '../../Tools/Components/Tools.js'
import backButton from '../../assets/Icons/back.png'

// import vouchers from '../../Tools/constants/vouchers';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
import {AdaptiveWidth,AdaptiveHeight} from '../../Tools/Components/AdaptiveSize'
// import cardbgB from '../../assets/card/carddeb.png';

import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';

// import RedeemVenue from './RedeemVenue';
// import homebg from'../../assets/bg/bg-02.jpg'

// import appLogo from '../../assets/Icons/leisure_white.png'
import backIcon from'../../assets/Icons/back.png'
import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';
import BackButton from '../../Tools/Components/BackButton';
// import { NavigationEvents } from 'react-navigation';

import {Dimensions } from "react-native";
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

export default function RedeemVoucherPop(props){
    const Colors=useTheme();
    
    useEffect(()=>{
        logScreenViewEvent("RedeemVoucher","Choose Voucher");
    },[]);
    
    
    
    
    
    
    
    const onConfirmVoucher=(_stateIn,_voucherInfo)=>{
        if(_stateIn){
            let voucherIn=props.onConfirmVoucher;
            voucherIn(_voucherInfo);
        }
    }
    const getVouchers=()=>{
        
        inCount=3;
        // colorsIn=[Colors.bluelightShadeColor,Colors.blueColor,Colors.bluedarkShadeColor,Colors.blueColor];
        var allines=[];
        var allvoucher=props.voucherInfo;
        for(let t=0;t<allvoucher.ActiveVouchers.length;t++){
            // inCount-=1;
            // inCount=inCount<0?3:inCount;
            allines.push(
                <Voucher key={t} profile={props.profile} onConfirmVoucher={onConfirmVoucher} voucherColor={allvoucher.ActiveVouchers[t].MemberCanRedeem?Colors.blueColor:Colors.bgColor} voucherInfo={allvoucher.ActiveVouchers[t]} navigation={props.navigation} redeemPoint={props.redeemPoint} assignProfile={props.assignProfile}/>
                )
            }
            return(allines);
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
                width:wp(20),
                backgroundColor:Colors.blueColor,
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                height:wp(12),
                borderRadius:wp(4)
            },
            claimBut:{
                borderRadius:6,
                alignSelf:'center',
                width:12,
                height:12,
                backgroundColor:Colors.blueColor
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
                // height:hp('65'),
                // height:'90%',
                
                width:'93%',
                // borderRadius:widthPercentageToDP(3),
                // backgroundColor:'white'
            },
            redeemView:{
                // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
            },
            backbut:{
                position:'absolute',
                alignSelf:'center',
                width:50,
                height:50,
                // bottom:hp('36%'),
                bottom:hp('30%'),
                zIndex:2,
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
            
            backIcon:{
                alignSelf:'center',
                marginTop:20,
                width:50,
                height:50,
            },
            
            bgImage:{
                position:'absolute',
                alignSelf:'center',
                width:'100%',
                height:height,
                resizeMode:'contain'
            },
            homeScrollView: {
                // padding:15,
                width:'100%'
                
            },homeView: {
                // flex:1,
                justifyContent:'center'
            },
            view1: {
                // margin: 10,
                // width: width - 40,
                borderRadius: 10,
                paddingTop:10,
                paddingBottom:20,
                width:'93%',
                alignSelf:'center'
            },
            
            gradStyle:{
                position:'absolute',
                width:width,
                height:height,
                zIndex:-1,
                // borderRadius:15,
            },
            heading: {
                textAlign:'left',
                paddingLeft:20,
                fontFamily:'Cairo-Regular',color:Colors.blueColor
            },
            
        });
        return (
            <View style={{
                flexDirection:'column'
            }}>
            
            
            <View style={{width:'100%'}}>
            <View style={styles.totalView}>
            <View style={ {
                flexDirection:'column',
                height:'100%'}}>
                
                <View style={{backgroundColor:Colors.whiteColor,height:'100%',borderRadius:widthPercentageToDP(3)}}>
                
                <View style={{height:'87%',width:'100%'}}>
                <ScrollView 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle={styles.homeScrollView}
                style={styles.view1}>
                {getVouchers()}
                </ScrollView>
                </View></View>
                </View></View>
                
                </View>
                
                
                </View>
                )
            }
            
            