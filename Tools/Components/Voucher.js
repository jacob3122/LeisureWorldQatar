import React, { Component, useState } from 'react';
import {Image, View,ScrollView,StyleSheet,Dimensions,Text,Platform,Alert,TouchableOpacity} from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import FastImage from 'react-native-fast-image'
import * as UIElements from './UIElements'
import Verfication from './Verification';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const smallerWidth = width * .9346;
import * as Tools from '../Components/Tools';
import lockIcon from '../../assets/Icons/lock-2.png';
import PopUpModal from './PopUpModal';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeProvider';
import { logRedeemClickEvent, logRedeemEvent } from '../Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function Voucher(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [otpModal,setOtpModal]=useState(false);
    const styles = StyleSheet.create({
        lockit:{
            top:(heightPercentageToDP(6.5)/2)-12,
            alignSelf:'flex-end',
            position:'absolute',
            right:widthPercentageToDP(2),
            width:25,height:25,
        },
        image:{
            flex:1,
            width: width -20,
            height: height/5,
            resizeMode:'contain',
            borderRadius: 10,
            // position:'absolute'
            // transform:[{translateY:-width/4.8}]
        },
        title:{
            start:widthPercentageToDP(5),
            // paddingStart:20,
            fontSize:widthPercentageToDP(4),
            // height:28*1.4,
            // borderWidth:1,
            textTransform:'uppercase',
            textAlign:'left',
            color:Colors.inputfontColor,
            fontFamily:'Cairo-Bold'
        }, points:{
            color:Colors.whiteColor,
            padding:20,
            paddingTop:0,
            fontSize:widthPercentageToDP(3.75),
            lineHeight:widthPercentageToDP(3.75)*1.5,
            // height:20*1.1,
            textTransform:'uppercase',
            textAlign:'left',
            fontWeight:'100',color:'white',fontFamily:'Cairo-Regular'
        },
        duration:{
            marginLeft: 10,
            fontSize:15,
            textAlign:'left',
        },
        view: {
            // margin: 5,
            // marginTop: 10,
            backgroundColor: Colors.blueColor,
            width: "80%",
            height: heightPercentageToDP(6.5),
            borderRadius: heightPercentageToDP(2),
            marginBottom:heightPercentageToDP(1.5),
            alignSelf:'center',
            justifyContent:'flex-start',
            // borderWidth:2,
        }
    });
    
    const OnVerifyDone=(otpvalue,Vstate)=>{
        // console.log(otpvalue+"V :"+Vstate);
        setOtpModal(false);
        onConfirmVoucher=props.onConfirmVoucher;
        onConfirmVoucher(Vstate,props.voucherInfo)
        // if(Vstate){
        //     props.navigation.navigate('cashier',{pagefrom:props.pagefrom,redeemPoint:props.redeemPoint,selectedVoucher:props.voucherInfo, assignProfile:props.assignProfile});
        // }
    }
    const OnPressAd=()=>{
        // OnRedeemYes();
        // return;
        logRedeemClickEvent(props.profile.Points,props.voucherInfo.Points);
        if(props.profile.Points>=props.voucherInfo.Points){
            OnRedeemYes();
        }else{
            Alert.alert(i18n.t('needmorepoints').replace('{value}',(props.voucherInfo.Points-props.profile.Points)))
        }
        // Alert.alert('Are you sure to Redeem '+props.voucherInfo.title+"?",
        // "",
        // [
        //     {text: 'Yes',onPress: () => {OnRedeemYes()}},
        //     {text: 'No', onPress: () => console.log('No Pressed')},
        // ],
        // {cancelable: false},
        // );
    }
    const OnRedeemYes=()=>{
        console.log('Yes Pressed');
        setOtpModal(true);
    }
    return (
        <TouchableOpacity style={[styles.view,{backgroundColor:props.voucherColor,opacity:props.voucherInfo.MemberCanRedeem?1:0.5}]} onPress={()=>{OnPressAd()}}>
        {/* <CacheImage
        bg={true}
        style={styles.image}
        uri={props.parkInfo.banner}
    /> */}
    <Text allowFontScaling={false} style={styles.title} >{Tools.stringIsContains(i18n.locale,'en')?props.voucherInfo.TitleEn:props.voucherInfo.TitleAr}</Text>
    <Text allowFontScaling={false} style={[styles.points,{color:(props.voucherInfo.MemberCanRedeem?Colors.whiteColor:Colors.blueColor)}]} >{props.voucherInfo.Points} {i18n.t('points')}</Text>
    {!props.voucherInfo.MemberCanRedeem&&(
        <Image source={lockIcon} resizeMode='contain' style={styles.lockit}/>)}
        {/* <Text style={styles.title} >{props.voucherInfo.title}</Text> */}
        {/* <Text style={styles.duration}>{i18n.t('adduration')}</Text> */}
        {UIElements.drawGap(10)}
        {otpModal&&(<PopUpModal title={i18n.t('areyousuretoredeem')+(Tools.stringIsContains(i18n.locale,'en')?props.voucherInfo.TitleEn:props.voucherInfo.TitleAr)+
        (i18n.t('questionmark'))} onDone={OnVerifyDone}/>)}
        </TouchableOpacity>
        )
    }
    
    