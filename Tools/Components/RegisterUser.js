import React, { Component, useContext, useEffect, useState } from 'react';
import  { Button,View,Modal,Text,StyleSheet,Dimensions,TextInput,Image, TouchableOpacity,Alert,Keyboard,KeyboardAvoidingView,ScrollView,TouchableWithoutFeedback,Platform,ImageBackground, SafeAreaView  } from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from './UIElements'
import * as Tools from './Tools'
import homebg from'../../assets/bg/bg-01.jpg'
import regLogo from'../../assets/Icons/register0.png'
import backIcon from'../../assets/Icons/back.png'
import regIcon from'../../assets/Icons/reg.png'

import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
// import PhoneInput from "react-native-phone-number-input";
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import GoogleRecaptcha, {
    GoogleRecaptchaSize,
    GoogleRecaptchaToken,
    GoogleRecaptchaRefAttributes
} from 'react-native-google-recaptcha'
// import DatePicker from 'react-native-datepicker';
// import RNPickerSelect from 'react-native-picker-select';
import Colors from '../constants/Colors';
// import Gradient from 'react-native-css-gradient';
import OtpVerify from './OtpVerify';

import WebServices from '../../Tools/constants/WebServices'
import OverlayLoad from './OverlayLoad'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

import {AdaptiveWidth,AdaptiveHeight,AdaptiveOffsetHeight} from '../Components/AdaptiveSize';
import HeaderLogo from './HeaderLogo';
import PhoneDropDownInput from './PhoneDropDownInput';
import { StackActions,NavigationAction } from '@react-navigation/native';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';

import { logScreenViewEvent, logSignUpEvent } from '../Analytics/AppAnalytics';
import { StateContext } from '../context/ContextState';
import moment from 'moment';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const {referralCode, setReferralCode} = useContext(StateContext);
    //     return <RegisterUser {...props} referralCode={referralCode} setReferralCode={setReferralCode} Colors={Colors}/>
    // }
    
    // class RegisterUser extends Component {
    const [firstName,setfirstName]=useState('');
    const [lastname,setlastname]=useState('');
    const [email,setemail]=useState('');
    const [dob,setdob]=useState(new Date());
    const [password,setpassword]=useState('');
    const [confirmpassword,setconfirmpassword]=useState('');
    const [mobile,setmobile]=useState('');
    const [filled,setfilled]=useState(false);
    const [gender,setgendere]=useState('');
    const [memberid,setmemberid]=useState('');
    const [allowFaceID,setallowFaceID]=useState(false);
    const [disableRegister,setdisableRegister]=useState(true);
    const [showPass,setshowPass]=useState(false);
    const [showConfirmPass,setshowConfirmPass]=useState(false);
    const [referralCodeIn,setreferralCode]=useState(global.referralCode==undefined?'':global.referralCode);
    const [showDate,setshowDate]=useState(false);
    const [checked,setchecked]=useState(false);
    const [passwordCreate,setpasswordCreate]=useState(false);
    const [passfilled,setpassfilled]=useState(false);
    const [isLoading,setisLoading]=useState(false);
    const [passsame,setpasssame]=useState(false);
    const [alreadyExist,setalreadyExist]=useState(0);
    const [namecheck,setNamecheck]=useState(0);
    const [phonecheck,setphonecheck]=useState(0);
    const [emailcheck,setemailcheck]=useState(0);
    const [otpModal,setotpModal]=useState(false);
    const [googleToken,setgoogleToken]=useState('');
    const [visible,setvisible]=useState(true);
    const [otpCodeIn,setOtpCode]=useState('');
    let recaptchaRef=React.createRef();
    useEffect(()=>{
        global.showRegister=true;
        logScreenViewEvent("RegisterUser","Register");
        setReferralCode(global.referralCode==undefined?'':global.referralCode);
        return()=>{
            global.showRegister=false;
        }
        
    },[]);
    
    const ValidateProfile=async (_token)=>{
        setisLoading(true);
        datatIn=JSON.stringify({
            FullName: firstName,
            Email: email,
            Mobile:mobile,
            JoinFrom:Platform.OS,
            RefCode:global.referralCode,
            SendOTP:true,
            RecToken:(Tools.IsNull(_token)?googleToken:_token)
        });
        console.log(datatIn);
        try {
            const response = await fetch(WebServices.MainURL + WebServices.ValidateProfile, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datatIn,
            }, 5000);
            const responseJson = await response.text();
            dateGot = responseJson.replace('"', '').replace('"', '');
            setisLoading(false);
            console.log("CreateProfile R :"+dateGot);
            if (dateGot == '-1' || dateGot == '-2') {
                Alert.alert(dateGot == -1 ? i18n.t('mobileexist') : i18n.t('emailexist'));
                setalreadyExist(dateGot);
            } else if (dateGot == '-4') {
                Alert.alert(i18n.t('invalidmobile'));
            } else if (dateGot == '-5') {
                Alert.alert(i18n.t('invalidreferralcode'));
            } else if (!Tools.stringIsContains(dateGot, 'error')) {
                // logSignUpEvent("leisureApp");
                // setmemberid(dateGot);
                setotpModal(true);
            } else {
                Alert.alert('Error Sign Up');
            }
            
        } catch (error) {
            setisLoading(false);
            console.error(error);
            Alert.alert('Error Sign Up');
        }
    }
    
    const CreateProfile=async (_token,_otpcode)=>{
        setisLoading(true);
        datatIn=JSON.stringify({
            // FirstName: firstname,
            FullName: firstName,
            // LastName: '.',
            Email: email,
            Mobile:mobile,
            JoinFrom:Platform.OS,
            RefCode:global.referralCode,
            RecToken:(Tools.IsNull(_token)?googleToken:_token),
            OTPcode:(Tools.IsNull(_otpcode)?otpCodeIn:_otpcode)
        });
        // console.log(datatIn);
        try {
            const response = await fetch(WebServices.MainURL + WebServices.CreateProfile, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: datatIn,
            }, 5000);
            const responseJson = await response.text();
            dateGot = responseJson.replace('"', '').replace('"', '');
            setisLoading(false);
            
            // console.log("CreateProfile R :"+dateGot);
            if (dateGot == '-1' || dateGot == '-2') {
                Alert.alert(dateGot == -1 ? i18n.t('mobileexist') : i18n.t('emailexist'));
                setalreadyExist(dateGot);
            } else if (dateGot == '-4') {
                Alert.alert(i18n.t('invalidmobile'));
            } else if (dateGot == '-5') {
                Alert.alert(i18n.t('invalidreferralcode'));
            } else if (!Tools.stringIsContains(dateGot, 'error')) {
                setmemberid(dateGot);
                // setotpModal(true);
                setpasswordCreate(true);
                // console.log("ISL "+isLoading);
            } else {
                Alert.alert('Error Sign Up');
            }
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error Sign Up');
        }
    }
    useEffect(()=>{
        if (props.referralCode !== referralCode) {
            setreferralCode(props.referralCode);
        }
    },[props])
    
    // componentDidUpdate(prevProps,prevState){
    
    //     if (global.referralCode!==undefined&&state.referralCode !== global.referralCode) 
    //         setState({referralCode:global.referralCode==undefined?'':global.referralCode});
    // }
    
    const VerifyOtpWS=(otpcode,_token=null)=>{
        // console.log("VerifyOtpWS"+otpcode);
        setOtpCode(otpcode);
        setisLoading(true);
        verifyurl=WebServices.VerifyMemberOTPMobile.replace('{Mobile}',mobile).replace('{OTPCode}',otpcode)
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'GET',
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            // console.log(responseJson);
            dateGot=responseJson.replace('"','').replace('"','');
            // console.log("J R :"+dateGot);
            setisLoading(false);
            if(!Tools.stringIsContains(dateGot,'error')){
                if(Tools.stringIsContains(dateGot,"success")){
                    // setpasswordCreate(true);
                    signUp(_token,otpcode,);
                    setotpModal(false);
                }else{
                    setTimeout(()=>Alert.alert('Otp Failed','Please enter the correct OTP'),500);
                    setotpModal(true);
                }
            }else{
                // setTimeout(()=>Alert.alert('Error Sign Up',dateGot),500);
                // this.setState({otpModal:true})
            }
            
        })
        .catch((error) =>{
            setisLoading(false);
            console.error(error);
        });
    }
    
    const CreatePassword=()=>{
        setisLoading(true);
        verifyurl=WebServices.CreatePass.replace('{MemberID}',memberid).replace('{Password}',password)
        return fetch (WebServices.MainURL+verifyurl,{
            method: 'POST',
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            console.log(responseJson);
            dateGot=responseJson.replace('"','').replace('"','');
            console.log("J R :"+dateGot);
            
            if(!Tools.stringIsContains(dateGot,'error')){
                if(dateGot=="Success"){
                    var loginProfile=props.assignProfile;
                    loginProfile(mobile,password,1);
                    closeStack();
                    logSignUpEvent(mobile,memberid);
                }else{
                    Alert.alert('Sigup Failed','');
                }
                setisLoading(false);
            }else{
                setisLoading(false);
                Alert.alert('Error Sign Up',dateGot);
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    const onloadEnd=()=>{
    }
    
    const checkLoading=(elements)=>{
        return(<Modal  statusBarTranslucent={true}  animationType={'slide'}
            onRequestClose={closeStack}
            // onBackButtonPress={() => 
                //     {
            //    closeStack();
            // }}
            transparent = {false} visible={visible}>
            <View style={{flex:1}} >
            {elements}
            {<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} onDismiss={onloadEnd} />}
            </View></Modal>);
            
        }
        
        const toggleSwitch=(stateName)=>{
            switch(stateName){
                case 'f':{
                    setallowFaceID(!allowFaceID);
                    return;
                }
            }
            // setState(stateName==='p'?({pushNotify:!pushNotify}):stateName==="e"?({emailNotify:!emailNotify}):({smsNotify:!smsNotify}))
        }
        
        const changeHappened=(datatIn)=>{
            if(datatIn=="email"){
                if(emailcheck!=0)
                    setemailcheck(0);
            }
            if(datatIn=="mobile"){
                if(phonecheck!=0)
                    setphonecheck(0);
                
                if(alreadyExist!=0)
                    setalreadyExist(0);
            }
            // if(!Tools.stringIsEmpty(firstname)&&!Tools.stringIsEmpty(email)&&!Tools.stringIsEmpty(mobile)&&!Tools.stringIsEmpty(lastname)){
            //     setState({filled:true});
            // }
        }
        
        
        
        
        const togglePassword=()=>{
            setshowPass(!showPass);
            // setState({showPass:!showPass});
        }
        
        const checkemail=()=>{
            if((email).length==0)
                return true;
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            if(reg.test(email) === false)
                return true;
            return false;
        }
        const checkmobile=(_stateIn)=>{
            let numbers = '+0123456789.';
            
            for (var i=0; i < mobile.length; i++) {
                if(numbers.indexOf(mobile[i]) > -1 ) {
                    if(mobile[i]=="."){
                        numbers = '+0123456789'
                    }
                }
                else {
                    return true;
                }
            }
            const checkValid = _stateIn;
            // console.log(checkValid+"//"+mobile)
            if(!checkValid)
                return true;
            return false;
        }
        const checkAllInputs=(_stateIn=false)=>{
            let stateIn=false;
            let stateName=false;
            // if(stateIn==false){
            //     stateIn=checkemail();
            //     setState({emailcheck:stateIn?1:0});
            // }
            // if(stateIn==false){
            stateName= (Tools.IsNull(firstName));
            setNamecheck(stateName?1:0)
            stateIn=checkmobile(_stateIn);
            setphonecheck(stateIn?1:0);
            setdisableRegister(stateName||stateIn);        
        }
        
        const handleSend=async()=>{
            try {
                if(recaptchaRef!=undefined){
                    // console.log('Recaptcha Token:',JSON.stringify(recaptchaRef));

                    const token = await recaptchaRef.getToken();
                    setgoogleToken(token);
                    console.log('Recaptcha Token:', token);
                    return token;
                }else{
                    // console.error('Recaptcha Error')
                }
            } catch (e) {
                // console.error('Recaptcha Error:', e)
            }
        }
        const RequestOTP=async (callback=null,_token=null)=>{
                try {
                    // const token = await handleSend();
               
                    let datatIn=JSON.stringify({
                    });
                    let url=WebServices.MainURL + WebServices.requestOTPMobile.replace('{Mobile}', mobile);
                    // console.log(url);
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'RecToken':_token
                        },
                        body: datatIn,
                    }, 5000);
                    const responseJson = await response.text();
                    // console.log(responseJson);
                    if(callback!=null){
                        const remain=moment(new Date()).add(180,"seconds");
                        callback(remain)
                    }
                } catch (error) {
                    console.error(error);
                }
        }
        const styles = StyleSheet.create({
            buttonB:{
                // flex:1,
                width:widthPercentageToDP(70),
                height:heightPercentageToDP(5),
                alignSelf:'center',
                alignItems:'center',
                backgroundColor:Colors.blueColor,
                borderRadius:heightPercentageToDP(5),
                justifyContent:'center'
            },buttontxt:{
                includeFontPadding:false,
                alignSelf:'center',
                color:Colors.whiteColor,
                fontWeight:'100',
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(4),
            },
            warning:{
                includeFontPadding:false,
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
            
            genderview: {
                flexDirection:'column',
                flex:1,
                // borderWidth:2,
                alignContent:'center',
                justifyContent:'center',
            }
            ,passwordBut:{
                includeFontPadding: false ,
                // textAlign:'left',
                alignSelf:'center',
                textAlign:'center',
                textAlignVertical:'center',
                justifyContent:'center',
                zIndex:1,
                fontFamily:'Cairo-SemiBold',
                color:Colors.blueColor,
                fontSize: 13, 
                textTransform:'uppercase'
            },passwordButView:{
                position:'absolute',
                justifyContent:'center',
                alignContent:'center',
                alignItems:'center',
                flexDirection:'row',
                height:'100%',
            },
            switchview:{
                // flex:(Platform.OS==='ios'?(0.5):1),
                flex:0.5,
                // borderWidth:1,
                justifyContent:'center',
            },switch:{
                alignSelf:'flex-end',
            },
            buttonSign:{
                // flex:1,
                // width:widthPercentageToDP(60),
                backgroundColor:Colors.blueColor,
                height:heightPercentageToDP(4.75),
                alignSelf:'center',
                alignItems:'center',
                borderRadius:heightPercentageToDP(4.75),
                justifyContent:'center'
            },
            buttontext:{
                fontSize: widthPercentageToDP(4),
                
                color:'white',
                fontFamily:'Cairo-Regular',
            },
            buttonReg:{
                includeFontPadding:false,
                paddingHorizontal:widthPercentageToDP(5),
                fontSize: widthPercentageToDP(4),
                fontFamily:'Cairo-Regular',
                color:Colors.whiteColor
            },dateValue:{
                fontSize: 16,
                fontFamily:'Cairo-Bold',
                width:'100%',
                // borderWidth:2,
            },
            inputView:{
                alignSelf:'center',
                width:widthPercentageToDP(70),
                // borderWidth:1,
                height:heightPercentageToDP(5),
                borderRadius:heightPercentageToDP(5),
                marginBottom:10,
                backgroundColor:Colors.whiteColor
                // alignItems:'flex-start',
                // alignContent:'flex-start',
            },inputIOS: {
                fontSize: 14,
                alignSelf:'flex-start',
                // textAlign:'left',
                fontFamily:'Cairo-Bold',
                color: 'black',
            }, alttxt:{
                includeFontPadding:false,
                alignSelf:'center',
                color:Colors.inputfontColor,
                fontWeight:'400',
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(3),
            },
            inputAndroid: {
                fontSize: 14,
                alignSelf:'flex-start',
                // textAlign:'left',
                fontFamily:'Cairo-Bold',
                color: 'black',
            },
            formInput:{
                justifyContent:'center',
                alignContent:'center',
            }, shadow:{
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 3,
                shadowOpacity: 0.12,
            },
            inputValue: {
                includeFontPadding:false,
                fontSize: widthPercentageToDP(4.25),
                textAlign:'left',
                color: Colors.inputfontColor,
                width:'100%',
                padding:1,
                paddingHorizontal:15,
                flex:1,
                fontFamily:'Cairo-Regular',
            },
            inputValueNo: {
                fontSize: 14,
                textAlign:'left',
                fontWeight:'200',
                // height:50,
                color: Colors.inputfontColor,
                width:'100%',
                marginTop:2,
                height:'100%',
                padding:10,
                paddingTop:5,
                padding:10,
                fontFamily:'Cairo-Regular',
            },
            
            inputConst: {
                alignSelf:'center',
                textAlign:'center',
                textAlignVertical:'center',
                fontWeight: '100',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Regular',
                fontSize: 15,
            },
            Ctitle:{
                // width:150,
                // fontSize: 18,
                textAlign:'center',
                marginTop:15,
                marginBottom:15,
                flex:1,
                color:Colors.darkfontColor,
                // height:  AdaptiveWidth(10), 
                fontFamily:'Cairo-Bold',
                fontSize: AdaptiveWidth(16),
                lineHeight: AdaptiveWidth(16) * 1.4,
                height: AdaptiveWidth(16)* 1.2, 
            },
            detailstitle:{
                // width:150,
                // fontSize: 18,
                textAlign:'left',
                marginTop:15,
                marginBottom:15,
                flex:0.5,
                color:Colors.darkfontColor,
                // height:  AdaptiveWidth(10), 
                fontFamily:'Cairo-Bold',
                fontSize: AdaptiveWidth(21),
                lineHeight: AdaptiveWidth(21) * 1.4,
                height: AdaptiveWidth(21)* 1.2, 
            },
            rowView:{
                // // flex:1,
                // marginLeft:10,
                // marginRight:10,
                width:'90%',
                justifyContent:'center',
                alignSelf:'center',
                flexDirection:'row',
            },cancelB:{
                padding:10,
                color:'#1d78cb',
                fontSize:20,
                fontWeight:'300',
                textAlign:'left',
                // borderWidth:1,
                alignSelf:'flex-start',
                fontFamily:'Cairo-Bold',
                fontSize: AdaptiveWidth(18),
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3, 
            },
            inputtext:{
                includeFontPadding:false,
                fontSize: widthPercentageToDP(4.25),
                textAlign:'left',
                color: Colors.inputfontColor,
                width:'100%',
                padding:1,
                paddingStart:15,
                flex:1,
                // fontFamily:'Cairo-Regular',
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
            },cenceltxt:{
                alignSelf:'flex-end',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(5),
            },
            boxcontainer: {
                // backgroundColor: 'white',
                // padding:10,
                borderRadius:10,
                borderWidth:1
            },
            homeScrollView: {
                // padding:15,
                
            },homeView: {
                // flex:1,
            },bgImage:{
                position:'absolute',
                alignSelf:'center',
                width:'100%',
                height:heightPercentageToDP(100)+(Platform.OS=='ios'?0: heightPercentageToDP('9.5%')),
                width:widthPercentageToDP(100),
                // height:heightPercentageToDP('100%')+(Platform.OS=='ios'?0: heightPercentageToDP('7.2%')),
                resizeMode:'cover'
            },logoImg:{
                alignSelf:'flex-start',
                marginLeft:15,
                width:70.2*(AdaptiveWidth(280)),
                height:65.3*AdaptiveWidth(280),
                // maxWidth:220,
            },regImg:{
                alignSelf:'center',
                marginTop:20,
                width:90,
                height:90,
                // maxWidth:220,
            },backIcon:{
                alignSelf:'center',
                marginTop:20,
                width:30,
                height:30,
                
            }
        });
        
        
        
        const closeStack = (_stateIn=false) =>{
            {
                var dismiss=props.onDismiss;
                dismiss(_stateIn)
                setvisible(false);
                // setState({visible:false})
            }
        }
        const checkUserMobile=()=>{
            if(alreadyExist==-1){
                return(
                    <Text allowFontScaling={false} style={[styles.warning,{marginTop:15}]}>{i18n.t('mobileexist')}</Text>);
                }else if(alreadyExist==-2){
                    return(
                        <Text allowFontScaling={false} style={[styles.warning,{marginTop:15}]}>{i18n.t('emailexist')}</Text>);
                    }
                }
                
                const checkSamePass=()=>{
                    if(passfilled){
                        if(!passsame){
                            return(
                                <Text allowFontScaling={false} style={[styles.warning,{marginTop:15}]}>{i18n.t('confirmpassnotsame')}</Text>);
                            }
                        }
                        
                    }
                    const checkPassword=(text)=>{
                        setpassword(text);
                        checkConfirmPassword();
                    }
                    const checkConfirmPassword=(text=null)=>{
                        if(text!=null){
                            setconfirmpassword(text);
                            if(!Tools.stringIsEmpty(password)&&(!Tools.stringIsEmpty(text)))//password===confirmpassword)
                            setpassfilled(true);
                            else
                            setpassfilled(false);
                            if(passfilled&&!Tools.stringIsEmpty(text)&&password===text){
                                setpasssame(true);
                            }else{
                                setpasssame(false);
                            }
                            
                        }else{
                            if(!Tools.stringIsEmpty(password)&&(!Tools.stringIsEmpty(confirmpassword)))//password===confirmpassword)
                            setpassfilled(true);
                            else
                            setpassfilled(false);
                            if(passfilled&&!Tools.stringIsEmpty(confirmpassword)&&password===confirmpassword){
                                setpasssame(true);
                            }else{
                                setpasssame(false);
                            }
                        }
                    }
                    const setPassword=()=>{
                        handleSend().then((tokenIn)=>CreatePassword());
                    }
                    const signUp=(token,otpcode)=>{
                        CreateProfile(token,otpcode);
                        //firstname,lastname,email,mobile,googleToken);
                        // setState({passwordCreate:true})
                    }
                    const OnVerifyDone=(otpvalue,Vstate,_token=null)=>{
                        setotpModal(false);
                        
                        if(Vstate){
                            VerifyOtpWS(otpvalue,_token);
                        }
                    }
                    const checkOnNumberContinue=(text)=>{
                        let newText = '';
                        let numbers = '+0123456789.';
                        
                        for (var i=0; i < text.length; i++) {
                            if(numbers.indexOf(text[i]) > -1 ) {
                                newText = newText + text[i];
                                if(text[i]=="."){
                                    numbers = '+0123456789'
                                }
                            }
                            else {
                                // your call back function
                                alert("Please enter numbers only");
                            }
                        }
                        setmobile(text);
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
                    const checkFormFilled=()=>{
                        if(filled){
                            return(
                                // <Gradient gradient={Colors.gradientBut} style={styles.buttonSign}>
                                <Text allowFontScaling={false} style={styles.buttonReg}>{i18n.t('register')}</Text>
                                // </Gradient>
                            );
                        }else{
                            return(
                                <Text allowFontScaling={false} style={styles.buttonReg}>{i18n.t('register')}</Text>
                            );
                        }
                    }
                    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
                    return (checkLoading(
                        <KeyboardAvoidingView style={{flex:1,backgroundColor:Colors.bgColor}} behavior={(Platform.OS === 'ios' ? 'padding' : 'undefined')} enabled>
                        
                        <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss}}>
                        <View >
                        <BackgroundWall />
                        {/* <SVGbg preserveAspectRatio="xMinYMin meet" width="540" height={heightPercentageToDP(100)} style={{position:'absolute',backgroundColor:Colors.bgColor}} 
                            viewBox="0 0 540 663"></SVGbg> */}
                            {/* <Gradient gradient={Colors.gradient} style={styles.gradStyle}/> */}
                            
                            <SafeAreaView style={{marginTop:heightPercentageToDP(3)}}> 
                            {UIElements.drawGap(heightPercentageToDP(1))} 
                            {!passwordCreate&&<TouchableOpacity onPress={()=>{
                                setReferralCode('');
                                global.referralCode='';
                                closeStack();
                            }} style={{width:widthPercentageToDP(20),
                                marginEnd:widthPercentageToDP(4),alignSelf:'flex-end',}}>
                                <Text allowFontScaling ={false} style={[styles.cenceltxt,{}]}>{i18n.t('cancel')}</Text>
                                </TouchableOpacity>}
                                {UIElements.drawGap(heightPercentageToDP(5))} 
                                <View style={[{backgroundColor:Colors.whiteColor,width:widthPercentageToDP(20),height:widthPercentageToDP(20)
                                    ,justifyContent:'center',alignSelf:'center'
                                    ,borderRadius:widthPercentageToDP(20)},styles.shadow]}>
                                    <Image resizeMode='contain' style={{alignSelf:'center', width:widthPercentageToDP(12),height:widthPercentageToDP(12),tintColor:Colors.bluelightShadeColor}} source={regIcon}/>
                                    </View>
                                    {UIElements.drawGap(heightPercentageToDP('5%'))}
                                    
                                    {!passwordCreate&&(
                                        
                                        <View style={styles.formInput}>
                                        
                                        
                                        <View style={styles.rowView}>
                                        {/* <Text allowFontScaling={false} style={styles.detailstitle}>First Name</Text> */}
                                        <View style ={[styles.inputView,styles.shadow,namecheck!=0?{borderWidth:2,borderColor:Colors.warningColor}:{}]}>
                                        <TextInput allowFontScaling={false} 
                                        scrollEnabled={false}
                                        style ={styles.inputValue}
                                        placeholderTextColor='#676667'
                                        // value={firstname}
                                        onChangeText={(text) => {
                                            setfirstName(text);
                                            setNamecheck(0);
                                            checkAllInputs(true);
                                        }}
                                        
                                        onEndEditing={(textIn)=>{
                                            var TextInp=textIn.nativeEvent.text;
                                            setfirstName(TextInp);
                                            setNamecheck(0);
                                            checkAllInputs(true);
                                        }}
                                        returnKeyType='done'
                                        keyboardType='default'
                                        textContentType='name'
                                        placeholder='Name'></TextInput>
                                        </View>
                                        </View>
                                        {UIElements.drawGap(10)}
                                        {/*<View style={styles.rowView}>
                                            <View style ={[styles.inputView,styles.shadow]}>
                                            <TextInput allowFontScaling={false} style ={styles.inputValue}
                                            placeholderTextColor='#676667'
                                            editable={true}
                                            onChangeText={(text) => {setState({lastname:text});
                                            changeHappened("lname");}}
                                            returnKeyType='done'
                                            placeholder='Last Name'></TextInput>
                                            </View>
                                            </View>
                                            {UIElements.drawGap(10)} */}
                                            
                                            <View style={styles.rowView}>
                                            {/* <Text allowFontScaling={false} style={styles.detailstitle}>{i18n.t('email')}</Text> */}
                                            <View style ={[styles.inputView,styles.shadow,emailcheck==1?{borderWidth:2,borderColor:Colors.warningColor}:{}]}>
                                            <TextInput allowFontScaling={false} style ={[styles.inputValue]}
                                            placeholderTextColor='#676667'
                                            textContentType='emailAddress'
                                            editable={true}
                                            // value={email}
                                            onEndEditing={(text) => {
                                                // setemailcheck(checkemail()?1:0)
                                                // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                                                // if(reg.test(text.nativeEvent.text) === false)
                                                // Alert.alert("Invalid Email","Please check the email");
                                                // checkAllInputs();
                                            }}
                                            onChangeText={(text) => {
                                                setemail(text);
                                                changeHappened("email");
                                            }}
                                            keyboardType='email-address'
                                            returnKeyType='done'
                                            placeholder='Email'></TextInput>
                                            </View>
                                            </View>
                                            
                                            {UIElements.drawGap(10)}
                                            <PhoneDropDownInput
                                            viewStyle={[{width:widthPercentageToDP(70),justifyContent:'center'},phonecheck!=0?{borderWidth:2,borderColor:Colors.warningColor}:{}]}
                                            defaultValue="+974"
                                            inputValueCheck={(_ValueIn) => {
                                                setphonecheck(_ValueIn?0:1);
                                                checkAllInputs(_ValueIn);
                                            }}
                                            // inputValue={() => {
                                                //     // setState({phonecheck:1});
                                            // }
                                            // }
                                            inputChange={(text) => {
                                                checkOnNumberContinue(text);
                                                changeHappened("mobile");
                                                // checkOnNumberContinue(text)
                                            }}
                                            />
                                            {UIElements.drawGap(20)}
                                            
                                            <View style ={[styles.inputView,styles.shadow]}>
                                            <TextInput allowFontScaling={false} 
                                            scrollEnabled={false}
                                            value={referralCode.toUpperCase()}
                                            style ={styles.inputValue}
                                            placeholderTextColor='#676667'
                                            // value={firstname}
                                            onChangeText={(text) => {
                                                setreferralCode(text);
                                                setReferralCode(text);
                                            }}
                                            onEndEditing={(text) => {
                                                global.referralCode=referralCode;
                                            }}
                                            returnKeyType='done'
                                            keyboardType='default'
                                            placeholder='Referral code'></TextInput>
                                            {!Tools.IsNull(referralCode)&&<TouchableOpacity onPress={()=>{
                                                setreferralCode('');
                                                setReferralCode('');
                                                global.referralCode='';
                                            }} style={{backgroundColor:Colors.bluelightShadeColor, position:'absolute',
                                                width:widthPercentageToDP(8),justifyContent:'center',
                                                end:widthPercentageToDP(2), top:widthPercentageToDP(1.5),
                                                height:widthPercentageToDP(8),borderRadius:widthPercentageToDP(8)}}>
                                                <Text style={{alignSelf:'center',includeFontPadding:false,textAlignVertical:'center',color:Colors.whiteColor,fontWeight:'500',fontSize:widthPercentageToDP(5),transform:[{scaleX:1.25}]}}>X</Text>
                                                </TouchableOpacity>}
                                                </View>
                                                {UIElements.drawGap(30)}
                                                {/* {!disableRegister&& */}
                                                <>
                                                <GoogleRecaptcha
                                                ref={(ref)=>{recaptchaRef=ref}}
                                                size={GoogleRecaptchaSize.INVISIBLE}
                                                // baseUrl="http://localhost:3000"
                                                baseUrl={WebServices.googleRecaptchaSiteURL}
                                                siteKey={WebServices.googleRecaptchaSiteKey}
                                                />
                                                {/* <Button title="Send" onPress={()=>{this.handleSend().then()}} /> */}
                                                </>
                                                {/* } */}
                                                <TouchableOpacity style={[styles.buttonB,styles.shadow,{}]}
                                                // disabled={disableRegister}
                                                onPress={()=>{
                                                    if(disableRegister){
                                                        checkAllInputs();
                                                        return;
                                                    }
                                                    
                                                    datatIn=JSON.stringify({
                                                        // FirstName: firstname,
                                                        FullName: firstName,
                                                        // LastName: '.',
                                                        Email: email,
                                                        Mobile:mobile,
                                                        JoinFrom:Platform.OS,
                                                        RefCode:global.referralCode,
                                                    });
                                                    // console.log(datatIn);
                                                    
                                                    
                                                    // check phone number before the register with otp
                                                    handleSend().then((token)=> ValidateProfile(token));
                                                    // handleSend().then((token)=>signUp(token));
                                                }}>
                                                {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                                                <Text  allowFontScaling ={false} style={[styles.buttontxt,{color:Colors.whiteColor}]}>{i18n.t('newregister')}</Text>
                                                {/* </Gradient> */}
                                                </TouchableOpacity>
                                                {UIElements.drawGap(10)}
                                                
                                                {/* {(emailcheck!=0&&checkemail())&& <Text allowFontScaling ={false} style={styles.warning}>{i18n.t('pleaseenteremail')}</Text>}
                                                    {(phonecheck!=0&&checkmobile())&& <Text allowFontScaling ={false} style={styles.warning}>{i18n.t('pleaseentermobilenumber')}</Text>} */}
                                                    
                                                    {UIElements.drawGap(45)}
                                                    
                                                    <View style={{flexDirection:'row',alignSelf:'center',height:30,justifyContent:'center'}}>
                                                    <Text allowFontScaling ={false} style={styles.alttxt}>{i18n.t('alreadyregistered')}</Text>
                                                    {UIElements.drawRGap(10)}
                                                    
                                                    {/* <Text  allowFontScaling ={false} style={styles.alttxt}>{i18n.t('or')}</Text> */}
                                                    <TouchableOpacity
                                                    style={{justifyContent:'center'}}
                                                    onPress={()=>{
                                                        Keyboard.dismiss();closeStack(true);}}>
                                                        {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
                                                        <Text  allowFontScaling ={false} style={{includeFontPadding:false,fontFamily:'Cairo-Bold',color:Colors.blueColor,textDecorationLine:'underline',textAlignVertical:'bottom',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3)}}>{i18n.t('signin')}</Text>
                                                        {/* </Gradient> */}
                                                        </TouchableOpacity></View>
                                                        
                                                        {otpModal&&(<OtpVerify sendOTP={RequestOTP} title={i18n.t('wesentyouotptomobile')} details='Verify your mobile number' onDone={OnVerifyDone}/>)}
                                                        {/* {checkUserMobile()} */}
                                                        {UIElements.drawGap(15)}
                                                        <View >
                                                        </View>
                                                        </View>)}
                                                        {passwordCreate&&(
                                                            <View style={styles.formInput} >
                                                            {UIElements.drawGap(30)}
                                                            <View style={styles.rowView}>
                                                            <View style ={[styles.inputView,styles.shadow]}>
                                                            <TextInput allowFontScaling={false} style ={[styles.inputtext,password.length>0?{}:{fontFamily:'Cairo-Regular'}]}
                                                            placeholderTextColor='#676667'
                                                            editable={true}
                                                            value={password}
                                                            secureTextEntry={!showPass}
                                                            onChangeText={(text) => {checkPassword(text)}}
                                                            returnKeyType='done'
                                                            placeholder='Password'></TextInput>
                                                            <View style={[styles.passwordButView,Tools.stringIsContains(i18n.locale,"en")?{alignSelf:'flex-end',paddingEnd:10,}:{paddingStart:10,alignSelf:'flex-start'}]}>
                                                            <Text allowFontScaling={false} style={[styles.passwordBut,]}
                                                            onPress={()=>
                                                                togglePassword()
                                                            }>{(!showPass)?i18n.t('show'):i18n.t('hide')}</Text></View>
                                                            </View>
                                                            </View>
                                                            {UIElements.drawGap(10)}
                                                            {UIElements.drawGap(10)}
                                                            <View style={styles.rowView}>
                                                            <View style ={[styles.inputView,styles.shadow]}>
                                                            <TextInput allowFontScaling={false} style ={[styles.inputtext,confirmpassword.length>0?{}:{fontFamily:'Cairo-Regular'}]}
                                                            placeholderTextColor='#676667'
                                                            editable={true}
                                                            value={confirmpassword}
                                                            secureTextEntry={!showConfirmPass}
                                                            onChangeText={(text) => {checkConfirmPassword(text)}}
                                                            returnKeyType='done'
                                                            placeholder='Confirm Password'></TextInput>
                                                            <View style={[styles.passwordButView,Tools.stringIsContains(i18n.locale,"en")?{alignSelf:'flex-end',paddingEnd:10,}:{paddingStart:10,alignSelf:'flex-start'}]}>
                                                            
                                                            <Text allowFontScaling={false} style={[styles.passwordBut,]}
                                                            onPress={()=>
                                                                setshowConfirmPass(!showConfirmPass)
                                                            }>{(!showConfirmPass)?i18n.t('show'):i18n.t('hide')}</Text></View>
                                                            </View>
                                                            </View>
                                                            
                                                            {UIElements.drawGap(30)}
                                                            
                                                            
                                                            <TouchableOpacity
                                                            onPress={()=>setPassword()}
                                                            style={[styles.buttonSign,styles.shadow,(!passsame||passfilled==false)?{opacity:0.6}:{opacity:1}]}
                                                            disabled={(!passsame||passfilled===false)?true:false}>
                                                            {/* <Image source={regLogo} style={[styles.regImg,passfilled==false?{tintColor:Colors.inputboxColor}:{tintColor:Colors.whiteColor}]}/> */}
                                                            <Text allowFontScaling={false} style={[styles.buttonReg]}>{i18n.t('setpass')}</Text>
                                                            </TouchableOpacity>
                                                            
                                                            
                                                            {UIElements.drawGap(65)}
                                                            {checkSamePass()}
                                                            </View>
                                                        )}
                                                        </SafeAreaView>
                                                        </View>
                                                        
                                                        </TouchableWithoutFeedback>
                                                        </KeyboardAvoidingView>)
                                                    )
                                                }
                                                
                                                
                                                
                                                
                                                
                                                