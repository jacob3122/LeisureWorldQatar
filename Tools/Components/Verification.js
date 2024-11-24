import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
import TabBarIcon from './TabBarIcon';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from '../Components/AdaptiveSize';
// import i18n, { toHumanSize } from 'i18n-js';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import PhoneDropDownInput from './PhoneDropDownInput';
import { Alert } from 'react-native';
import moment from'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PureComponent } from 'react';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import OverlayLoad from './OverlayLoad'
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import OTP from './OTP';
import GoogleRecaptcha, {
    GoogleRecaptchaSize,
    GoogleRecaptchaToken,
    GoogleRecaptchaRefAttributes
} from 'react-native-google-recaptcha'
import WebServices from '../constants/WebServices';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function Verfication(props){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [isLoading,setisLoading]=useState(false);
    const [val,setval]=useState('');
    const [mobileNo,setmobileNo]=useState('');
    const [updateTime,setupdateTime]=useState(false);
    const [showTime,setshowTime]=useState(false);
    const [showError,setshowError]=useState(false);
    const [showWait,setshowWait]=useState(false);
    const [localWait,setlocalWait]=useState(false);
    const [visible,setvisible]=useState(props.visible);
    const [showVerification,setshowVerification]=useState(false);
    const [timeRemain,settimeRemain]=useState('');
    const [remain,setremain]=useState(false);
    const [interval,setintervalIn]=useState(false);
    const [showOtpError,setshowOtpError]=useState(false);
    const [showOtpprop,setshowOtpprop]=useState(false);
    let timeInterval=null;
    let timeIntervalAnother=null;
    
    const [googleToken,setgoogleToken]=useState('');
    let recaptchaRef=React.createRef();
    
    useEffect(()=>{
        isMounted=true;
        {
            const _getData = async () => {
                try {
                    const userData = await AsyncStorage.getItem('remaintime')
                    // console.log("RemainData In-"+JSON.stringify(userData));
                    const dateVal=parseInt(JSON.stringify(userData).replace('"',''));
                    // setState({timeRemain:moment(dateVal)})
                    settimeRemain(moment(dateVal));
                    let remain= moment(dateVal).diff(moment(new Date()),"seconds")
                    setremain(remain);
                    // console.log(remain);
                    const mobileData = await AsyncStorage.getItem('mobileno');
                    // console.log("mobileData In-"+JSON.stringify(mobileData));
                    
                    const dataVal=parseInt(JSON.stringify(mobileData).replace('"',''));
                    setmobileNo(dataVal);
                    //   console.log("RemainData-"+JSON.stringify(userData));
                    if(remain>0){
                        setlocalWait(true);
                        setupdateTime(false);
                        setshowTime(true);
                        stopInterval();
                        timeInterval= setInterval(() => {
                            let remain= moment(dateVal).diff(moment(new Date()),"seconds")
                            setremain(remain);
                            if(remain<=0){
                                setshowTime(false);
                                stopInterval();
                            }
                            // console.log("Sec"+remain);
                        }, 1000);
                    }else{
                        setlocalWait(false);
                        setupdateTime(false);
                    }
                } catch (error) {
                    // console.log(error); 
                }
            };
            _getData();
        }
        return()=>{
            // console.log('useEffect');
            isMounted=false;
            stopInterval();
            setintervalIn(false);
        }
    },[])
    
    const stopInterval=()=>{
        if(timeInterval!=null||timeInterval!=undefined){
            clearInterval(timeInterval)
        }
        
        if(timeIntervalAnother!=null||timeIntervalAnother!=undefined){
            clearInterval(timeIntervalAnother)
        }
    }
    
    
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
                console.error('Recaptcha Error')
            }
        } catch (e) {
            console.error('Recaptcha Error:', e)
        }
    }
    const updateTimeFn=()=>{
        let dateVal=0;
        
        return(
            <View style={{flexDirection:'row',alignSelf:'center',marginTop:'4%'}}>
            {((showTime||localWait)&&remain>0)&&<Text style ={styles.duration} allowFontScaling={false}>{i18n.t('pleasewait')} {moment(remain*1000).format('mm:ss')} {i18n.t('to')}</Text>}
            <TouchableOpacity disabled={(showTime)} onPress={()=>{
                setshowWait(false);
                setlocalWait(false);
            }} style={{opacity:showTime?0.5:1, borderWidth:2,marginLeft:'2%',paddingLeft:'2%',paddingRight:'2%',marginRight:'2%',borderRadius:20,borderColor:Colors.blueColor}}>
            <Text style ={styles.duration}>{i18n.t('sendagain')}</Text>
            </TouchableOpacity>
            </View>
        )
    }
    const changeHappened=()=>{
        
    }
    const getFinalPhone=(text)=>{
        // console.log("Final "+text);
        setmobileNo(text)
    }
    useEffect(()=>{
        if(props.showOtpError!=showOtpError){
            if(props.showOtpError)
                setisLoading(false);
            setshowOtpError(props.showOtpError)
        }
        //check for update in props
        if(props.showOtpprop !== showOtpprop){
            setshowOtpprop(props.showOtpprop);
            //call the parent function
            if(props.showOtpprop){
                setshowWait(props.showOtpprop);
                setisLoading(false);
                const _getData = async () => {
                    try {
                        const userData = await AsyncStorage.getItem('remaintime');
                        // console.log("RemainData In-"+JSON.stringify(userData));
                        dateVal=parseInt(JSON.stringify(userData).replace('"',''));
                        settimeRemain(moment(dateVal));
                        setremain(moment(dateVal).diff(moment(new Date()),"seconds"))
                        setshowTime(true);
                        
                        
                        timeIntervalAnother= setInterval(() => {
                            // console.log(moment(dateVal));
                            let remain= moment(moment(dateVal)).diff(moment(new Date()),"seconds")
                            setremain(remain)
                            if(remain<=0){
                                setshowTime(false)
                                stopInterval();
                            }
                            // console.log("Sec"+remain);
                        }, 1000);
                    } catch (error) {
                        console.log(error); 
                    }
                };
                stopInterval();
                _getData();
                
            }
        }
    },[props]);
    // static getDerivedStateFromProps(props, cstate) {
    //     if(props.showOtpprop!==cstate.showWait){
    //         return {
    //             showWait: props.showOtpprop
    //         };
    //     }
    //     return null;
    // }
    
    
    const styles = StyleSheet.create({
        inputView:{
            width:widthPercentageToDP('55%'),
            height:35,
            backgroundColor:Colors.inputboxColor,
            borderRadius:15,
            justifyContent:'center',
            alignSelf:'center',
        },
        warning:{
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
            lineHeight: 15* 1.6,
            padding:3,
            // borderWidth:1,
            
        },
        modalView:{
            alignContent:'center',
            justifyContent:'center',
            alignItems:'center',
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
            alignSelf:'center',
            color:Colors.whiteColor,
            // paddingTop:15,
            fontWeight:'100',
            fontFamily:'Cairo-Regular',
            fontSize: widthPercentageToDP(4),
            // lineHeight: AdaptiveWidth(18) * 1.6,
            // height: AdaptiveWidth(18)* 1.3,
        },
        inputNo:{
            alignSelf:'center',
            color:Colors.inputfontColor,
            fontSize:widthPercentageToDP(4),
            marginTop:5,
            fontWeight:'100',
            fontFamily:'Cairo-Regular',
            textAlign:'center'
        },
        image:{
            flex:1,
            width: width -40,
            height: height/4,
            resizeMode:'contain',
            borderRadius: 10,
            // position:'absolute'
            // transform:[{translateY:-width/4.8}]
        },
        title:{
            padding:15,
            fontSize:widthPercentageToDP(5),
            textAlign:'center',
            fontWeight:'100',
            color:Colors.blueColor,
            
            fontFamily:'Cairo-Regular',
            // lineHeight: AdaptiveWidth(15) * 1.6,
            // height: AdaptiveWidth(15)* 1.3, 
        },
        duration:{
            fontSize:widthPercentageToDP(4),
            textAlign:'center',
            color:Colors.blueColor,
            fontWeight:'400',
            fontFamily:'Cairo-Regular',
        },
        view: {
            // margin: 5,
            // marginTop: 10,
            backgroundColor: 'lightblue',
            width: width -40,
            height: height/4,
            borderRadius: 10,
            alignSelf:'center',
            alignItems:'center',
            justifyContent:'center',
            flex:1,
            // borderWidth:2,
        }, shadow:{
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 3,
            shadowOpacity: 0.12,
        },
        rowView:{
            // flex:1,
            flexDirection:'row',
            width:'100%',
            height:60,
            // borderWidth:2,
            justifyContent:'space-around'
        },inputTextView:{
            width:widthPercentageToDP(70),
            height:heightPercentageToDP(5),
            alignSelf:'center',
            backgroundColor:Colors.whiteColor,
            borderRadius:heightPercentageToDP(5),
        },
    });
    const checkInput=()=>{
        // Alert.alert(i18n.t('pleaseentertheotp'));
        if(showError){
            return(
                <View style={{width:'100%'}} >
                <Text allowFontScaling={false} style={styles.warning}>*{i18n.t('pleaseentertheotp')}</Text></View>
            );
        }
    }
    const OnSubmit=()=>{
        stopInterval();
        if(Tools.stringIsEmpty(val)){
            setshowError(true);
            return;
        }
        setisLoading(true);
        //check OTP
        // setState({visible:false},OnDone(true));
        OnDone(true);
    }
    const OnDone=(donestate)=>{
        stopInterval();
        otpcode=val;
        var isdone=props.onDone;
        if(donestate){
            // handleSend().then((_token)=>{
                isdone(otpcode,mobileNo,donestate);
            // })
        }
        else{
            isdone('','',donestate);
        }
    }      
    return (
        <Modal  statusBarTranslucent={true} animationType = {"slide"} transparent = {true}>
        <View style={{height:'100%',width:'100%',justifyContent:'center'}}>
        <BackgroundWall blur/>
        <GoogleRecaptcha
        ref={(ref)=>{recaptchaRef=ref}}
        size={GoogleRecaptchaSize.INVISIBLE}
        // baseUrl="http://localhost:3000"
        baseUrl={WebServices.googleRecaptchaSiteURL}
        siteKey={WebServices.googleRecaptchaSiteKey}
        />
        {/* <View style={{backgroundColor:Colors.bgColor,opacity:0.8,height:'100%',width:'100%',position:'absolute'}}>
            <SVGbg preserveAspectRatio="xMinYMin meet" width="540" height={heightPercentageToDP(100)} style={{position:'absolute'}} 
            viewBox="0 0 540 663"></SVGbg>
            </View> */}
            <View style={styles.modalView}>
            <View style={{backgroundColor:Colors.bgColor,borderRadius:20,width:width*0.9,justifyContent:'center'}} >
            
            <Text style ={styles.title} allowFontScaling={false}>{props.title}</Text>
            {/* <Text style ={styles.duration} allowFontScaling={false}>{.props.details}</Text> */}
            
            
            {(showWait||localWait)&&
                <OTP title={true} onChangeText={(text) => {
                    setval(text);
                    setshowError(false);
                    changeHappened();  
                }}
                onEndText={(text) => {
                    setval(text);
                    OnSubmit(); 
                }}/>
            }
            {!(showWait||localWait)&&<View style={styles.inputView}> 
            <PhoneDropDownInput
            editable={!showWait}
            defaultValue="+974"
            inputChange={getFinalPhone}
            inputValue={getFinalPhone}
            />
            </View>}
            {checkInput()}
            {UIElements.drawGap(10)}
            {(showWait||localWait)&&<Text allowFontScaling={false} style={[styles.duration,{}]} >{i18n.t('otpsentto')} {(Tools.stringIsContains(JSON.stringify(mobileNo),'+')?"":"+")+mobileNo}</Text>}
            {UIElements.drawGap(10)}
            {!(showWait||localWait)&&<TouchableOpacity disabled={showWait} style={[styles.buttonB,styles.shadow]} onPress={()=>{
                if(mobileNo.length>6){
                    var sendOTP=props.sendOTP;
                    handleSend().then((token)=>{
                        setisLoading(true);
                        sendOTP(mobileNo,token);
                    })
                    
                }else{
                    Alert.alert(i18n.t("pleaseentermobilenumber"));
                }
            }}>
            <Text allowFontScaling={false} style={styles.buttontxt} >{i18n.t('sendOtp')}</Text>
            </TouchableOpacity>}
            {(showWait||localWait)&&<TouchableOpacity style={styles.buttonB} onPress={()=>{OnSubmit()}}>
            <Text allowFontScaling={false} style={styles.buttontxt} >{i18n.t('verify')}</Text>
            </TouchableOpacity>}
            
            {(showWait||localWait)&&updateTimeFn()}
            {UIElements.drawGap(20)}
            <TouchableOpacity style={{alignSelf:'center'}}  onPress={()=>{
                OnDone(false)
            }}>
            <TabBarIcon selectedColor={ Colors.blueColor }
            width={25}
            height={25}
            focused={true}
            name={'close'}/>
            </TouchableOpacity>
            {UIElements.drawGap(20)}
            </View>
            </View>
            {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading} onDismiss={undefined} />}
            </View></Modal>
        )
    }
    
    