import React, { Component, useEffect, useState } from 'react';
import  { DatePickerIOS,View,Modal,Text,StyleSheet,Dimensions,TextInput,Image, TouchableOpacity,Alert,Keyboard,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Platform,ImageBackground, SafeAreaView  } from 'react-native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import * as Tools from './Tools'
import regLogo from'../../assets/Icons/register0.png'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import Colors from '../constants/Colors';
import Verfication from './Verification';
import WebServices from '../../Tools/constants/WebServices'
import OverlayLoad from './OverlayLoad'
import backButton from '../../assets/Icons/back.png'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import {AdaptiveWidth,AdaptiveHeight,AdaptiveOffsetHeight} from '../Components/AdaptiveSize';
import HeaderLogo from './HeaderLogo';
import OTP from './OTP';
import moment from 'moment';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoogleRecaptcha, {
    GoogleRecaptchaSize,
    GoogleRecaptchaToken,
    GoogleRecaptchaRefAttributes
  } from 'react-native-google-recaptcha';
import { useAppContext } from '../../src/js/reducers/AppReducer';


export default function ChangePassword(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [password,setPassword]=useState('');    
    const [otp,setOtp]=useState(0);    
    const [confirmpassword,setconfirmpassword]=useState('');    
    const [showPass,setShowPass]=useState(false);    
    const [showConfirmPass,setShowConfirmPass]=useState(false);    
    const [passwordCreate,setpasswordCreate]=useState(false);    
    const [passfilled,setpassfilled]=useState(false);    
    const [isLoading,setisLoading]=useState(false);    
    const [timeRemain,settimeRemain]=useState('');    
    const [remain,setremain]=useState('');    
    const [showTime,setshowTime]=useState(false);    
    const [visible,setvisible]=useState(true);
    

    const [googleToken,setgoogleToken]=useState('');
    let recaptchaRef=React.createRef();

    useEffect(()=>{
        getRemainingTime();
        
    },[])

    const handleSend=async()=>{
        // console.log('Recaptcha Token');
        try {
          if(recaptchaRef!=undefined){
            const token = await recaptchaRef.getToken();
            // console.log('Recaptcha Token2'+token);
            setgoogleToken(token);
            // console.log('Recaptcha Token:', token);
            return token;
          }else{
            // console.error('Recaptcha Error')
          }
        } catch (e) {
        //   console.error('Recaptcha Error:', e)
        }
      }
    
    const updateTimeRemain=(_timeRemain)=>{
        // console.log("updateTimeRemain"+_timeRemain);
        settimeRemain(_timeRemain);
    }
    const checkSamePass=()=>{
        if(passwordCreate&&!Tools.stringIsEmpty(confirmpassword)&&password!=confirmpassword){
            return(
                <Text allowFontScaling={false} style={[styles.warning,{marginTop:15}]}>{i18n.t('confirmpassnotsame')}</Text>);
            }
        }
        
        
        useEffect(()=>{
            // console.log("RemainCP"+timeRemain);
            if(!Tools.IsNull(timeRemain)){
                setshowTime(true);
                const timeInterval= setInterval(() => {
                    let remain= moment(timeRemain).diff(moment(new Date()),"seconds");
                    
                    setremain(remain);
                    if(remain<=0){
                        setshowTime(false)
                        clearInterval(timeInterval);
                    }
                }, 1000);
                return()=>{
                    clearInterval(timeInterval);
                }
            }
        },[timeRemain])
        
        const  getRemainingTime=()=>{
            // console.log("getRemainingTime");
            const _getData = async () => {
                try {
                    const userData = await AsyncStorage.getItem('remaintimecp');
                    if(!Tools.IsNull(userData)){
                        // console.log("RemainDataCP In-"+JSON.stringify(userData));
                        const dateVal=parseInt(JSON.stringify(userData).replace('"',''));
                        // setState({timeRemain:moment(dateVal)})
                        settimeRemain(moment(dateVal));
                        let remain= moment(dateVal).diff(moment(new Date()),"seconds")
                        setremain(remain);
                        // console.log(remain);
                    }else{
                        settimeRemain(moment(new Date()).add(3,'minutes'))
                    }
                } catch (error) {
                    // console.log(error); 
                }
            };
            _getData();
        }
        
        
        
        const CreatePassword=async ()=>{
            setisLoading(true);
            const _token= await handleSend();
            if(!Tools.IsNull(props.mobileNo)&&props.mobileNo.length>0){
                verifyurl=WebServices.setforgetPass.replace('{Mobile}',props.mobileNo.replace('+','')).replace('{Password}',password).replace('{OTPCode}',otp)
            }else{
                verifyurl=WebServices.confirmChangeOTP.replace('{MemberID}',props.accessToken.MemberID).replace('{Password}',password).replace('{OTPCode}',otp)
            }
            console.log(verifyurl);
            if(!Tools.IsNull(props.accessToken))
            console.log(props.accessToken.access_token);
            return fetch (WebServices.MainURL+verifyurl,{
                method: 'POST',
                headers:props.accessToken!=undefined? {
                    'Authorization':'Bearer '+props.accessToken.access_token,
                    'Content-Type': 'application/json',
                    'RecToken':_token
                }:{'Content-Type': 'application/json',
            },
        },WebServices.timeout)
        .then((response) => response.text())
        .then((responseJson) => {
            setisLoading(false);
            console.log(responseJson);
            dateGot=responseJson.replace('"','').replace('"','');
            console.log("J R :"+dateGot);
            
            if(!Tools.stringIsContains(dateGot,'error')){
                if(Tools.stringIsContains(dateGot,"success")){
                    Alert.alert(i18n.t("passchangesuccess"))
                    closeStack(false);
                }else{
                    Alert.alert(i18n.t('failed'),i18n.t('tryagain'));
                }
            }else{
                Alert.alert(i18n.t('failed'),i18n.t('tryagain'));
            }
        })
        .catch((error) =>{
            console.error(error);
            Alert.alert(i18n.t('failed'),i18n.t('tryagain'));
        });
    }
    const onloadEnd=()=>{
        // console.log('load done');
    }
    
    const checkLoading=(elements)=>{
        return(<Modal  statusBarTranslucent={true} animationType={'fade'}transparent = {false} visible={visible}>
        <View style={{height:'100%',backgroundColor:Colors.bgColor}} >
        <BackgroundWall/>
        {elements}
        {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} onDismiss={onloadEnd} />}
        </View></Modal>);
        
    }
    
    const togglePassword=()=>{
        setShowPass(!showPass);
    }
    
    const styles = StyleSheet.create({
        shadow:{
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        }
        
        
        ,passwordBut:{
            // textAlign:'left',
            alignSelf:'center',
            textAlign:'center',
            fontWeight: '100',
            zIndex:1,
            fontFamily:'Cairo-Regular',
            color:Colors.blueColor,
            fontSize: 13, 
            textTransform:'uppercase'
        },passwordButView:{
            position:'absolute',
            flex:1,
            
            flexDirection:'row',
            fontSize: 12,
            // height:35,
            height:40,
            fontWeight: '400',
            // width:50,
        },
        buttonSign:{
            // flex:1,
            height:heightPercentageToDP(4.75),
            alignSelf:'center',
            alignItems:'center',
            borderRadius:heightPercentageToDP(4.75),
            justifyContent:'center',
            backgroundColor:Colors.blueColor,
        },
        buttontext:{
            fontSize:16,
            color:'white',
            fontFamily:'Cairo-Regular',
        },
        buttonReg:{
            fontSize:widthPercentageToDP(4),
            paddingHorizontal:widthPercentageToDP(5),
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            
        },
        inputView:{
            width:'80%',
            // borderWidth:1,
            flexDirection:'column',
            alignContent:'center',
            alignItems:'center',
            alignSelf:'center',
            
            backgroundColor:Colors.whiteColor,
            borderWidth:2,
            borderColor:Colors.whiteColor,
            height:heightPercentageToDP(4.75),
            borderRadius:heightPercentageToDP(4.75),
        },
        formInput:{
            justifyContent:'center',
            alignContent:'center',
        },
        inputValue: {
            fontSize: 18,
            textAlign:'left',
            color: Colors.inputfontColor,
            width:'100%',
            height:'100%',
            // padding:5,
            paddingStart:15,
            paddingEnd:10,
            
            
        },
        
        
        rowView:{
            width:'92%',
            justifyContent:'center',
            alignSelf:'center',
            flexDirection:'row',
        },
        
        homeScrollView: {
            
        },homeView: {
        },bgImage:{
            position:'absolute',
            alignSelf:'center',
            width:'100%',
            height:heightPercentageToDP(100)+(Platform.OS=='ios'?0: heightPercentageToDP('9.5%')),
            resizeMode:'contain'
        },regImg:{
            alignSelf:'center',
            resizeMode:'cover',
            marginTop:20,
            width:90,
            height:90,
            // maxWidth:220,
        },alttxt:{
            alignSelf:'center',
            color:Colors.inputfontColor,
            fontWeight:'400',
            fontFamily:'Cairo-Regular',
            fontSize: widthPercentageToDP(3.5),
        }, warning:{
            overflow:'hidden',
            // backgroundColor:Colors.warningColor,
            borderRadius:15,
            color:Colors.warningColor,
            marginTop:5,
            // width:300,
            alignSelf:'center',
            textAlign:'left',
            // paddingBottom:15,
            // marginStart:-80,
            fontFamily:'Cairo-Bold',
            fontSize: 15,
            lineHeight: 15* 1.6,
            padding:3,
            
            // lineHeight: 15* 1.6,
            // borderWidth:1,
        },
    });
    
    
    const OnBack=()=>{
        closeStack(false);
    }
    
    const closeStack = (onclose) =>{
        {
            setvisible(false);
            var dismiss=props.onDismiss;
            dismiss(onclose);
            // this.setState({visible:false})
        }
    }
    const checkOTP=(text)=>{
        setOtp(text);
    }
    const checkPassword=(text)=>{
        setPassword(text);
        if(!Tools.stringIsEmpty(confirmpassword)&&text==confirmpassword)
        setpassfilled(true);
        else
        setpassfilled(false);
    }
    const checkConfirmPassword=(text)=>{
        setconfirmpassword(text);
        if(!Tools.stringIsEmpty(password)&&password==text)
        setpassfilled(true);
        else
        setpassfilled(false);
        
    }
    const setPasswordIn=()=>{
        CreatePassword();
    }
    
    const OnVerifyDone=(otpvalue,Vstate)=>{
        VerifyOtpWS(otpvalue);
    }
    
    const checkPassFilled=()=>{
        if(passfilled){
            return(
                <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                );
            }else{
                return(
                    <Text allowFontScaling={false} style={styles.buttontext}>{i18n.t('setpass')}</Text>
                    );
                }
            }
            return (checkLoading(
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <SafeAreaView >
                <GoogleRecaptcha
          ref={(ref)=>{recaptchaRef=ref}}
          size={GoogleRecaptchaSize.INVISIBLE}
          // baseUrl="http://localhost:3000"
          baseUrl={WebServices.googleRecaptchaSiteURL}
          siteKey={WebServices.googleRecaptchaSiteKey}
          />
                {/* <ImageBackground source={homebg} style={styles.bgImage}/> */}
                <ScrollView 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle={styles.homeScrollView}
                style={styles.homeView}>
                {UIElements.drawGap(30)}
                
                <TouchableOpacity style={{position:'absolute',marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{
                    var ondone= props.onDismiss;
                    ondone();
                }}>
                <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                </TouchableOpacity>
                
                {UIElements.drawGap(heightPercentageToDP('5%'))}
                <View style={styles.formInput} >
                {UIElements.drawGap(30)}
                <OTP onChangeText={(text) => {checkOTP(text)}}/>
                {UIElements.drawGap(30)}
                
                <View style={{flexDirection:'row',alignSelf:'center'}}>
                <Text allowFontScaling ={false} style={styles.alttxt}>{i18n.t('didntreceivecode')}</Text>
                {UIElements.drawRGap(7)}
                {((showTime)&&remain>0)&&<Text style ={styles.alttxt} allowFontScaling={false}>{i18n.t('pleasewait')} {moment(remain*1000).format('mm:ss')} {i18n.t('to')} </Text>}
                {/* <Text  allowFontScaling ={false} style={styles.alttxt}>{i18n.t('or')}</Text> */}
                <TouchableOpacity
                disabled={showTime}
                onPress={()=>{
                    // Keyboard.dismiss();
                    var sendOTP=props.sendOTP;
                    sendOTP(null,null,(_timeR)=>{
                        updateTimeRemain(_timeR)
                    },props.mobileNo);
                    
                }}>
                {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                <Text  allowFontScaling ={false} style={{opacity:showTime?0.6:1, color:Colors.inputfontColor,fontFamily:'Cairo-Bold',textDecorationLine:'underline',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5)}}>{i18n.t('requestagain')}</Text>
                {/* </Gradient> */}
                </TouchableOpacity></View>
                {/* <View style={styles.rowView}>
                <View style ={[styles.inputView,styles.shadow]}>
                <TextInput allowFontScaling={false} style ={[styles.inputValue]}
                placeholderTextColor='#676667'
                editable={true}
                keyboardType='numeric'
                value={this.state.otp}
                onChangeText={(text) => {this.checkOTP(text)}}
                returnKeyType='done'
                placeholder='OTP'></TextInput>
                
                </View>
            </View> */}
            {UIElements.drawGap(30)}
            <View style={styles.rowView}>
            <View style ={[styles.inputView,styles.shadow]}>
            <TextInput allowFontScaling={false} style ={[styles.inputValue,password.length>0?{}:{fontFamily:'Cairo-Regular'}]}
            placeholderTextColor='#676667'
            editable={true}
            value={password}
            secureTextEntry={!showPass}
            onChangeText={(text) => {checkPassword(text)}}
            onEndEditing={()=>{
                if(!Tools.IsNull(confirmpassword))
                setpasswordCreate(true);
            }}
            returnKeyType='done'
            placeholder='Password'></TextInput>
            <View style={[styles.passwordButView,Tools.stringIsContains(i18n.locale,"en")?{alignSelf:'flex-end',paddingEnd:10,}:{paddingStart:10,alignSelf:'flex-start'}]}>
            <Text allowFontScaling={false} style={[styles.passwordBut,]}
            onPress={()=>
                togglePassword()
            }>{(!showPass)?i18n.t('show'):i18n.t('hide')}</Text></View>
            </View>
            </View>
            {UIElements.drawGap(30)}
            <View style={styles.rowView}>
            <View style ={[styles.inputView,styles.shadow]}>
            <TextInput allowFontScaling={false} style ={[styles.inputValue,confirmpassword.length>0?{}:{fontFamily:'Cairo-Regular'}]}
            placeholderTextColor='#676667'
            editable={true}
            value={confirmpassword}
            secureTextEntry={!showConfirmPass}
            onChangeText={(text) => {checkConfirmPassword(text)}}
            onEndEditing={()=>{
                if(!Tools.IsNull(password))
                setpasswordCreate(true);
            }}
            returnKeyType='done'
            placeholder='Confirm Password'></TextInput>
            <View style={[styles.passwordButView,Tools.stringIsContains(i18n.locale,"en")?{alignSelf:'flex-end',paddingEnd:10,}:{paddingStart:10,alignSelf:'flex-start'}]}>
            
            <Text allowFontScaling={false} style={[styles.passwordBut,]}
            onPress={()=>
                setShowConfirmPass(!showConfirmPass)
            }>{(!showConfirmPass)?i18n.t('show'):i18n.t('hide')}</Text></View>
            </View>
            </View>
            {checkSamePass()}
            {UIElements.drawGap(30)}
            
            
            <TouchableOpacity
            onPress={()=>setPasswordIn()}
            style={[styles.buttonSign,passfilled==false?{opacity:0.6}:{opacity:1}]}
            disabled={passfilled===false?true:false}>
            {/* <Image source={regLogo} style={[styles.regImg,this.state.passfilled==false?{tintColor:Colors.inputboxColor}:{tintColor:Colors.whiteColor}]}/> */}
            <Text allowFontScaling={false} style={[styles.buttonReg]}>{i18n.t('setpass')}</Text>
            </TouchableOpacity>
            {UIElements.drawGap(65)}
            </View>
            </ScrollView>
            </SafeAreaView>
            
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>)
            )
        }
        
        