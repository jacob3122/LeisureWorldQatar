import React, { Component,PureComponent, useEffect, useState } from 'react';
import  {View,Modal,Text,StyleSheet,Dimensions,TextInput,Image, TouchableOpacity,Alert,Keyboard,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Platform,ImageBackground, SafeAreaView  } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import i18n, { l } from 'i18n-js';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import * as Tools from './Tools'
import homebg from'../../assets/bg/bg-01.jpg'
import backIcon from'../../assets/Icons/back.png'
import faceidIcon from'../../assets/Icons/faceid.png'
import touchidIcon from'../../assets/Icons/touchid.png'

import signingIcon from'../../assets/Icons/signin.png'
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

// import { Header } from 'react-navigation';
import DropDown from './PhoneDropDown'
// import DatePicker from 'react-native-datepicker';
// import RNPickerSelect from 'react-native-picker-select';
import Colors from '../constants/Colors';
// import Gradient from 'react-native-css-gradient';
import Verfication from './Verification';

import OverlayLoad from './OverlayLoad'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import {AdaptiveWidth,AdaptiveHeight,AdaptiveOffsetHeight} from '../Components/AdaptiveSize';
import HeaderLogo from './HeaderLogo';
// import PhoneInput from "react-native-phone-number-input";
import ProfileData from './ProfileData';
import PhoneDropDownInput from './PhoneDropDownInput';
import ChangePassword from './ChangePassword';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import { logScreenViewEvent } from '../Analytics/AppAnalytics';

import GoogleRecaptcha, {
    GoogleRecaptchaSize,
    GoogleRecaptchaToken,
    GoogleRecaptchaRefAttributes
} from 'react-native-google-recaptcha'
import WebServices from '../constants/WebServices';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function SigninUser(props){
    const { onDismiss,assignProfile,verifyOTP } = props;
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const[rnBiometrics,setBiometrics]=useState(undefined);
    
    useEffect(()=>{
        setMounted(true);
        const asyncProcess=async()=>{
            try {
                // console.log("useeffect"+JSON.stringify(props))
                logScreenViewEvent("Signin","SigninUser");
                let rnBiometricsIn = new ReactNativeBiometrics({ allowDeviceCredentials: true });
                setBiometrics(rnBiometricsIn);
                
                biometry = await rnBiometricsIn.isSensorAvailable();
                // console.log("useeffect"+JSON.stringify(biometry))
                
                setbiometryType(biometry.biometryType);
                setbioAvailable(biometry.available)
            } catch (error) {
                console.error('An error occurred:', error);
            }
            
        }
        asyncProcess();
        return()=>{
            // console.log('Component is unmounted');
            setMounted(false);
        };
    },[]);
    
    const [biometryType,setbiometryType]=useState(undefined);
    const [_isMounted,setMounted]=useState(false);
    const [bioAvailable,setbioAvailable]=useState(undefined);
    const [showCountryCode,setshowCountryCode]=useState(false);
    const [profileID,setprofileID]=useState('');
    const [sendOTP,setsendOTP]=useState(null);
    const [isLoading,setIsloading]=useState(false);
    const [checkpass,setcheckpass]=useState(false);
    const [checkuser,setcheckuser]=useState(false);
    const [signPassword,setsignPassword]=useState('');
    const [mobileNo,setmobileNo]=useState('');
    const [email,setemail]=useState('');
    const [signinMethod,setsigninMethod]=useState(1);
    const [countrycode,setcountrycode]=useState('QA');
    const [canSignIn,setcanSignIn]=useState(true);
    const [showPass,setshowPass]=useState(false);
    const [alreadyMember,setalreadyMember]=useState(true);
    const [pageState,setpageState]=useState(1);
    const [otpModal,setotpModal]=useState(false);
    const [showOtpprop,setshowOtpprop]=useState(false);
    const [showPassModal,setshowPassModal]=useState(false);
    const [useBiometric,setuseBiometric]=useState(props.useBiometric);
    const [visible,setvisible]=useState(false);
    const [showRegister,setshowRegister]=useState(false);
    const [showForgetPass,setshowForgetPass]=useState(false);
    let changeCheck=false;
    let loadin=0;
    
    const [googleToken,setgoogleToken]=useState('');
    let recaptchaRef=React.createRef();
    
    useEffect(() => {
        if(props.showOtpprop!==showOtpprop){
            setshowOtpprop(props.showOtpprop)
        }
        if(props.visible!==visible){
            setvisible(props.visible)
        }
        if(props.showForgetPass!==showForgetPass){
            setshowForgetPass(props.showForgetPass)
        }
    }, [props]);
    
    
    const handleSend=async()=>{
        try {
            if(recaptchaRef!=undefined){
                const token = await recaptchaRef.getToken();
                setgoogleToken(token);
                return token;
            }else{
                console.error('Recaptcha Error')
            }
        } catch (e) {
            console.error('Recaptcha Error:', e)
        }
    }
    
    const checkLoading=(elements)=>{
        
        return(
            <View style={{height:heightPercentageToDP(100),width:widthPercentageToDP(100)}} >
            <Modal statusBarTranslucent={true} animationType={'slide'}
            transparent = {false} visible={visible}>
            {elements}
            {props.isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={props.isLoading} onDismiss={undefined} />}
            </Modal>
            </View>
        );
        
    }
    
    const checkOnNumberContinue=(text)=>{
        if(!_isMounted)
            return;
        let newText = '';
        let numbers = '0123456789.';
        if(text.length<=0){
            return
        }
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
                if(text[i]=="."){
                    numbers = '0123456789'
                }
            }
            else {
                // your call back function
                alert("Please enter numbers only");
            }
        }
        setcheckuser(text.length>0?false:true);
    }
    
    const checkMemberAvail=(text)=>{
        if(!_isMounted)
            return;
        setprofileID(text);
        
    }
    const checkNumber=()=>{
        if(!_isMounted)
            return;
        dataReturn=[];
        if(checkuser==true&&mobileNo.length<=0&&props.showsignin==1){
            dataReturn.push(
                <Text key='0' allowFontScaling ={false} style={styles.warning}>*{i18n.t('pleaseentermobilenumber')}</Text>
            );
        }
        return dataReturn;
    }
    const checkEmail=()=>{
        if(!_isMounted)
            return;
        dataReturn=[];
        if(checkuser==true&&email.length<=0&&props.showsignin==2){
            dataReturn.push(
                <Text key='0' allowFontScaling ={false} style={styles.warning}>*{i18n.t('pleaseenteremail')}</Text>
            );
            return dataReturn;
        }
    }
    const checkPassword=()=>{
        if(!_isMounted)
            return;
        dataReturn=[];
        if(checkpass&&signPassword.length===0){
            // setState({checkpass:false,isLoading:false})
            dataReturn.push(
                <Text key='0' allowFontScaling ={false} style={styles.warning}>*{i18n.t('pleaseenterpass')}</Text>
            );
        }
        
        
        return dataReturn;
    }
    
    const checkOnContinue=(text)=>{
        if(!_isMounted)
            return;
        setcheckuser(text.length>0?false:true);
    }
    
    const togglePassword=()=>{
        if(!_isMounted)
            return;
        setshowPass(!showPass);
    }
    const checkArabic=()=>{
        if(Tools.stringIsContains(i18n.locale,'ar'))
            return {right:width*0.7};
        else
        return {marginLeft:width/1.55};
    }
    const passCodeEnter= ()=>{
        // if(!_isMounted)
        // return;
        return(<View><View style={[styles.rowView,{justifyContent:'center'}]}>
            
            <View style={{width:widthPercentageToDP(70),height:heightPercentageToDP(5),}} >
            <View style={[styles.inputTextView,styles.shadow,{justifyContent:'center'}]} >
            
            <TextInput  allowFontScaling ={false}
            placeholderTextColor='#676667'
            onChangeText={(text)=>{
                if(text!=undefined)
                    setsignPassword(text);
            }}
            onEndEditing={(textIn)=>{
                //textIn.nativeEvent.text;
                if(textIn!=undefined){
                    setsignPassword(textIn.nativeEvent.text);
                    setcheckuser(true);
                    setcheckpass(true);
                    // signinProfile();
                    
                }
            }
        }
        value={signPassword}
        style={[styles.inputtext,{width:'92%',height:'100%'},signPassword.length>0?{}:{fontFamily:'Cairo-Regular'}]}
        textContentType='password'
        placeholder="Password"
        keyboardType='default'
        // autoFocus={true}
        secureTextEntry={!showPass}
        returnKeyType='done'/></View>
        
        <View style={[styles.passwordButView,Tools.stringIsContains(i18n.locale,"en")?{alignSelf:'flex-end',paddingEnd:10,}:{paddingStart:10,alignSelf:'flex-start'}]}>
        <Text  allowFontScaling ={false} style={styles.passwordBut}
        onPress={()=>
            togglePassword()
        }>{(!showPass)?i18n.t('show'):i18n.t('hide')}</Text></View>
        </View>
        </View> 
        {checkPassword()}
        </View>
    );
}
const signinProfile=()=>{
    if(!_isMounted)
        return;
    if(signPassword.length>0){
        setIsloading(true);
        // closeStack();
        let handleToUpdate  =  assignProfile;
        let handleonDismiss  = onDismiss;
        if(handleToUpdate!=null){
            // console.log("Signing")
            handleToUpdate(profileID,signPassword,signinMethod,handleonDismiss);
        }
    }
}

const signinProfilewithBio=()=>{
    if(props.bioKey.length>0){
        setIsloading(true);
        // closeStack();
        let handleToUpdate  =  assignProfile;
        let handleonDismiss  =  onDismiss;
        if(handleToUpdate!=null){
            // console.log("Signing")
            handleToUpdate("biometric",props.bioKey,signinMethod,handleonDismiss);
        }
    }
}
const changeState=(statename,valueMethod)=>{
    if(!_isMounted)
        return;
    if(valueMethod!=undefined){
        if(Tools.stringIsContains(statename,'email')){
            setemail(valueMethod);
        }else if(Tools.stringIsContains(statename,'mobile')){
            setmobileNo(valueMethod);
        }
    }
}

const setLoading=(_loadState)=>{
    setIsloading(_loadState);
}
const signinwithOTP=()=>{
    if(!_isMounted)
        return;
    setotpModal(true);
    return;
    if(state.profileID.length>0){
        var sendOTP = props.sendOTP;
        sendOTP(state.profileID);
        setState({isLoading:true})
        loadin=1;
        // setState({otpModal:true});
    }else{
        setState({isLoading:false, checkuser:true})
        loadin=0;
    }
    // setState({otpModal:true});
}
const OnDismissPass=(closestack)=>{
    if(!_isMounted)
        return;
    if(closestack){
        loadin=0;
        setIsloading(false);
        closeStack();
    }
}
const sendOtpSU=(_mobileNo)=>{
    if(sendOTP!=null)
        sendOTP(_mobileNo);
    setIsloading(true);
}
const getFinalPhone=(text)=>{
    // console.log("Final "+text);
    checkMemberAvail(text);
    changeState('mobileNo',text);
}
const styles = StyleSheet.create({
    textLogin:{
        includeFontPadding: false ,
        fontFamily:'Cairo-Regular',
        fontSize:widthPercentageToDP(4),
        alignSelf:'center',
        color:Colors.black
    },  
    buttonB:{
        width:widthPercentageToDP(70),
        height:heightPercentageToDP(5),
        alignSelf:'center',
        backgroundColor:Colors.blueColor,
        borderRadius:widthPercentageToDP(5),
        borderColor:Colors.whiteColor,
        justifyContent:'center'
    },buttontxt:{
        includeFontPadding: false ,
        alignSelf:'center',
        color:Colors.whiteColor,
        // paddingTop:15,
        textAlignVertical:'center',
        fontWeight:'100',
        fontFamily:'Cairo-Regular',
        fontSize: widthPercentageToDP(4),
        // lineHeight: widthPercentageToDP(4) * 1.6,
        // height: AdaptiveWidth(18)* 1.3,
    },
    alttxt:{
        includeFontPadding: false ,
        alignSelf:'center',
        color:Colors.inputfontColor,
        fontWeight:'400',
        fontFamily:'Cairo-Regular',
        fontSize: widthPercentageToDP(3),
    },
    cenceltxt:{
        includeFontPadding: false ,
        alignSelf:'flex-end',
        color:Colors.inputfontColor,
        fontFamily:'Cairo-Regular',
        fontSize: widthPercentageToDP(5),
    },
    inputTextView:{
        alignContent:'center',
        alignItems:'center',
        width:widthPercentageToDP(70),
        height:heightPercentageToDP(5),
        alignSelf:'center',
        backgroundColor:Colors.whiteColor,
        borderRadius:heightPercentageToDP(5),
    },
    shadow:{
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
        shadowOpacity: 0.12,
    },
    
    warning:{
        includeFontPadding: false ,
        // flex:1,\
        overflow:'hidden',
        backgroundColor:Colors.warningColor,
        borderRadius:15,
        color:Colors.whiteColor,
        marginTop:5,
        // width:300,
        alignSelf:'center',
        textAlign:'left',
        // paddingBottom:15,
        // marginStart:-80,
        fontFamily:'Cairo-Bold',
        fontSize: 15,
        padding:1.5,
        paddingHorizontal:widthPercentageToDP(3)
        // borderWidth:1,
        
    },
    
    passwordBut:{
        includeFontPadding: false ,
        // textAlign:'left',
        alignSelf:'center',
        textAlign:'center',
        textAlignVertical:'center',
        fontWeight: '100',
        zIndex:1,
        fontFamily:'Cairo-SemiBold',
        color:Colors.blueColor,
        fontSize: 13, 
        height:'100%',
        textTransform:'uppercase'
    },passwordButView:{
        top:heightPercentageToDP(5)/4.5,
        position:'absolute',
        flex:1,
        justifyContent:'center',
        flexDirection:'row',
        // height:35,
        alignSelf:'center',
        // width:50,
    },
    
    buttonSign:{
        padding:10,
        // flex:1,
        width:120,
        height:35,
        alignSelf:'center',
        alignItems:'center',
        borderRadius:10,
        justifyContent:'center'
    },
    
    inputValue: {
        fontSize: 14,
        textAlign:'left',
        fontWeight:'200',
        color: Colors.inputfontColor,
        width:'100%',
        includeFontPadding: false ,
        // borderWidth:1,
        // backgroundColor:Colors.inputboxColor,
        // borderRadius:10,
        // borderWidth:2,
        // borderColor:Colors.whiteColor,
        // marginStart:10,
        // marginBottom:10,
        // paddingTop:10,
        marginTop:2,
        height:'100%',
        padding:10,
        paddingTop:5,
        fontFamily:'Cairo-Regular',
    },
    
    
    rowView:{
        flexDirection:'row',
    },
    inputtext:{
        includeFontPadding:false,
        fontSize: 17,
        alignSelf:'center',
        textAlign:'left',
        color: Colors.inputfontColor,
        padding:5,
        textAlignVertical:'center',
        paddingStart:15,
        paddingEnd:10,
    },
    heading: {
        fontSize: 30,
        fontFamily:'Cairo-Bold',
        paddingBottom:15,
        alignSelf:'center'
    },
    
    subheading: {
        textAlign:'center',
        paddingBottom:15,
        color:Colors.darkfontColor,
        
        fontFamily:'Cairo-Bold',
        fontSize: AdaptiveWidth(16),
        lineHeight: AdaptiveWidth(16) * 1.6,
        // height: AdaptiveWidth(16)* 1.3, 
    },bgImage:{
        position:'absolute',
        alignSelf:'center',
        width:'100%',
        height:heightPercentageToDP(100)+(Platform.OS=='ios'?0: heightPercentageToDP('9.5%')),
        width:widthPercentageToDP(100),
        // height:heightPercentageToDP('100%')+(Platform.OS=='ios'?0: heightPercentageToDP('7.2%')),
        resizeMode:'cover'
    },backIcon:{
        alignSelf:'center',
        marginTop:20,
        width:30,
        height:30,
        
    }
});

const closeStack = (param1=null,param2=null) =>{
    // console.log('closeStack'+_isMounted)
    if(_isMounted)
        {
        setvisible(false);
        var dismiss=onDismiss;
        if(dismiss!==undefined)
            {
            // console.log('dismiss')
            dismiss();
        }
        if((props.profile===undefined||
            props.profile.FirstName===undefined))
            {
                props.navigation.navigate('Homescreen',{})
            }
        }
    }
    
    const OnVerifyDone=(otp,mobileno,Vstate,_token=null)=>{
        // console.log(otp+"//"+Vstate+"//"+mobileno);
        if(otp.length>0&&Vstate){
            // handleSend().then((_token)=>{
                verifyOTP(mobileno,otp,closeStack,_token);
                setotpModal(false);
            // });
           
            // closeStack();
        }else{
            // return
            var closeOTP=props.closeOtpModal;
            closeOTP();
            setTimeout(() => {
                setotpModal(false)
            }, 10);
            
        }
    }
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
    return (checkLoading(
        // <View style={{flex:1}}>
        <KeyboardAvoidingView style={{flex:1,backgroundColor:Colors.bgColor}} behavior={(Platform.OS === 'ios' ? 'padding' : 'undefined')} enabled>
        <BackgroundWall/>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        
        <SafeAreaView style={{marginTop:heightPercentageToDP(3)}}> 
        <GoogleRecaptcha
        ref={(ref)=>{recaptchaRef=ref}}
        size={GoogleRecaptchaSize.INVISIBLE}
        // baseUrl="http://localhost:3000"
        baseUrl={WebServices.googleRecaptchaSiteURL}
        siteKey={WebServices.googleRecaptchaSiteKey}
        />
        {UIElements.drawGap(heightPercentageToDP(1))} 
        <TouchableOpacity onPress={()=>{
            closeStack();
        }} style={{width:widthPercentageToDP(20),
            marginEnd:widthPercentageToDP(4),alignSelf:'flex-end',}}>
            <Text allowFontScaling ={false} style={[styles.cenceltxt,{}]}>{i18n.t('cancel')}</Text>
            </TouchableOpacity>
            {/* <ImageBackground source={homebg} style={styles.bgImage}/> */}
            {UIElements.drawGap(heightPercentageToDP(5))} 
            <View style={[{backgroundColor:Colors.whiteColor,width:widthPercentageToDP(20),height:widthPercentageToDP(20)
                ,justifyContent:'center',alignSelf:'center'
                ,borderRadius:widthPercentageToDP(20)},styles.shadow]}>
                <Image resizeMode='contain' style={{alignSelf:'center', width:widthPercentageToDP(12),height:widthPercentageToDP(12),tintColor:Colors.bluelightShadeColor}} source={signingIcon}/>
                </View>
                {/* <HeaderLogo headerTitle={i18n.t('register')} border={true}/> */}
                {UIElements.drawGap(heightPercentageToDP(2))}
                <View style={{flexDirection:'column', width:width,padding:10}}>
                {props.showsignin==1&&<View style={styles.scrolltab}>
                {UIElements.drawGap(15)} 
                
                <PhoneDropDownInput
                defaultValue="+974"
                viewStyle={[(checkuser&&mobileNo.length<=0)?{borderWidth:2,borderColor:Colors.warningColor}:{},{backgroundColor:Colors.whiteColor}]}
                inputValue={(text) => {
                    getFinalPhone(text)}}
                    />
                    
                    {/* <View style={[styles.rowView,{ width:'100%', justifyContent:'center'}]}>
                        </View> */}
                        {checkNumber()}
                        {UIElements.drawGap(heightPercentageToDP(3.5))}
                        {passCodeEnter()}
                        
                        {UIElements.drawGap(heightPercentageToDP(1.75))}
                        <TouchableOpacity onPress={()=>{
                            setcheckuser(true);
                            if(!Tools.IsNull(mobileNo)&&mobileNo.length>0){
                                var forgetPassReq=props.forgetPassRequest;
                                handleSend().then((_token)=>{
                                forgetPassReq(null,null,null,mobileNo,_token)
                                });
                            }
                        }}>
                        <View style={{width:widthPercentageToDP(70),alignSelf:'center'}}>
                        <Text allowFontScaling ={false} style={[styles.alttxt,{alignSelf:'flex-end'}]}>{i18n.t('forgetpass')}</Text></View>
                        </TouchableOpacity>{UIElements.drawGap(heightPercentageToDP(1.75))}
                        <TouchableOpacity style={[styles.buttonB,styles.shadow]}
                        onPress={()=>{
                            Keyboard.dismiss();
                            // if(_isMounted)
                            {
                                setcheckuser(true);
                                setcheckpass(true);
                                signinProfile();
                            }
                        }}>
                        
                        {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                        <Text  allowFontScaling ={false} style={styles.buttontxt}>{i18n.t('signin')}</Text>
                        {/* </Gradient> */}
                        </TouchableOpacity>
                        {UIElements.drawGap(10)}
                        <Text  allowFontScaling ={false} style={styles.alttxt}>{i18n.t('or')}</Text>
                        {UIElements.drawGap(10)}
                        <TouchableOpacity style={[styles.buttonB,styles.shadow]}
                        onPress={()=>{
                            Keyboard.dismiss();
                            
                            signinwithOTP()}}>
                            <Text  allowFontScaling ={false} style={styles.buttontxt}>{i18n.t('signotp')}</Text>
                            </TouchableOpacity>
                            {UIElements.drawGap(heightPercentageToDP(3))}
                            <View style={{flexDirection:'row',alignSelf:'center',height:30,justifyContent:'center'}}>
                            <Text allowFontScaling ={false} style={styles.alttxt}>{i18n.t('newuser')}</Text>
                            {UIElements.drawRGap(10)}
                            
                            {/* <Text  allowFontScaling ={false} style={styles.alttxt}>{i18n.t('or')}</Text> */}
                            <TouchableOpacity
                            style={{justifyContent:'center'}}
                            onPress={()=>{
                                Keyboard.dismiss();
                                setshowRegister(true);}}>
                                {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                                <Text  allowFontScaling ={false} style={{color:Colors.blueColor,fontFamily:'Cairo-Bold',textDecorationLine:'underline',textAlignVertical:'bottom',fontFamily:'Cairo-Regular', includeFontPadding: false ,fontSize:widthPercentageToDP(3)}}>{i18n.t('newregister')}</Text>
                                {/* </Gradient> */}
                                </TouchableOpacity></View>
                                
                                {UIElements.drawGap(10)}
                                {otpModal&&(<Verfication valueIn={profileID} showOtpError={props.showOtpError} showOtpprop={showOtpprop} visible={otpModal}
                                    title={i18n.t('otpverification')}  onDone={OnVerifyDone} sendOTP = {props.sendOTP}/>)}
                                    </View>}
                                    
                                    {props.showsignin==2&& <View style={styles.scrolltab}>
                                    {/* <Text  allowFontScaling ={false} style={styles.subheading}>{i18n.t('enteremail')}</Text>  */}
                                    {UIElements.drawGap(15)} 
                                    <View style={ [styles.rowView,{justifyContent:'center'}]}>
                                    <View style={[styles.inputTextView,{flex:0.71}]} >
                                    <TextInput allowFontScaling ={false} 
                                    placeholderTextColor='#676667'
                                    onChangeText={(text)=>{checkOnContinue(text)
                                        checkMemberAvail(text)
                                        changeState('email',text)}}
                                        style={[styles.inputtext,{flex:1}]}
                                        placeholder="Email"
                                        keyboardType='email-address'
                                        textContentType='emailAddress'
                                        returnKeyType='done'></TextInput></View>
                                        </View>
                                        {checkEmail()}
                                        {UIElements.drawGap(10)}
                                        {passCodeEnter()}
                                        {/* {pagetoCome()} */}
                                        {UIElements.drawGap('15%')}
                                        <TouchableOpacity style={styles.buttonB}
                                        onPress={()=>{
                                            if(_isMounted){
                                                setcheckpass(true);
                                                setcheckuser(true);
                                                signinProfile()}
                                            }}>
                                            {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                                            <Text  allowFontScaling ={false} style={styles.buttontxt}>{i18n.t('signin')}</Text>
                                            {/* </Gradient> */}
                                            </TouchableOpacity>
                                            </View>
                                        }
                                        {UIElements.drawGap(heightPercentageToDP(5))}
                                        </View>
                                        {bioAvailable!=undefined&&bioAvailable&&props.useBiometric&&<TouchableOpacity
                                            onPress={()=>{
                                                rnBiometrics.simplePrompt({promptMessage: 'Confirm BioMetric'})
                                                .then((resultObject) => {
                                                    const { success } = resultObject
                                                    
                                                    if (success) {
                                                        signinProfilewithBio();
                                                        // console.log('successful biometrics provided')
                                                    } else {
                                                        // console.log('user cancelled biometric prompt')
                                                    }
                                                    
                                                })
                                            }}
                                            style={{paddingTop:widthPercentageToDP(4),
                                                paddingBottom:widthPercentageToDP(2),backgroundColor:Colors.transparentColor,
                                                justifyContent:'center', alignSelf:'center',borderRadius:widthPercentageToDP(3)}}>
                                                <Image
                                                resizeMode='contain'
                                                source={Platform.OS=='android'?touchidIcon:((biometryType==BiometryTypes.FaceID)?faceidIcon:touchidIcon)}
                                                style={{width:widthPercentageToDP(18),height:widthPercentageToDP(18),alignSelf:'center'}}
                                                />
                                                {UIElements.drawGap(heightPercentageToDP(1))}
                                                <View style={{flexDirection:'row',paddingHorizontal:widthPercentageToDP(4)}}>
                                                <Text style={styles.textLogin} numberOfLines={1} allowFontScaling={false} >{i18n.t('loginwith')}</Text>
                                                <Text style={styles.textLogin} numberOfLines={1} allowFontScaling={false} >{i18n.t(Platform.OS== 'android'?'touch':
                                                    biometryType==BiometryTypes.FaceID?'face':'touch')}</Text>
                                                    </View> 
                                                    </TouchableOpacity>
                                                }
                                                {/* {UIElements.drawGap(heightPercentageToDP(5))} */}
                                                {/* <TouchableOpacity
                                                    onPress={()=>closeStack()}
                                                    style={[styles.buttonSign]}>
                                                    <Image source={backIcon} style={[styles.backIcon,{transform:[{rotateZ:'-90deg'}]}]}/>
                                                    </TouchableOpacity> */}
                                                    </SafeAreaView>
                                                    
                                                    </TouchableWithoutFeedback>
                                                    {showRegister&&(<ProfileData pagetogo='register' pagefrom='login' navigation={props.navigation} onDismiss={()=>setshowRegister(false)} />)}
                                                    {showForgetPass&&(<ChangePassword sendOTP={props.forgetPassRequest} mobileNo={mobileNo} onDismiss={()=>{
                                                        let onChangePassDismiss=props.onChangePassDismiss;
                                                        if(onChangePassDismiss!=null){
                                                            onChangePassDismiss();
                                                        }
                                                        setshowForgetPass(false)
                                                    }}/>)}
                                                    </KeyboardAvoidingView>
                                                    // </View>
                                                )
                                            )
                                        }
                                        
                                        
                                        