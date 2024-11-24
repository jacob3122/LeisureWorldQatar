import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,SafeAreaView,TextInput,TouchableOpacity, DeviceEventEmitter} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
import TabBarIcon from './TabBarIcon';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from '../Components/AdaptiveSize';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import TopBackBar from './TopBackBar';
import mobileverifyIcon from'../../assets/Icons/mobileverify.png'
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
import WebServices from '../constants/WebServices';
import { useAppContext } from '../../src/js/reducers/AppReducer';



export default function OtpVerify(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [val,setVal]=useState('');
    const [showError,setshowError]=useState(false);
    const [visible,setvisible]=useState(true);
    const [timeRemain,settimeRemain]=useState('');
    const [remain,setremain]=useState('');
    const [showTime,setshowTime]=useState(false);

   
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
            console.error('Recaptcha Error')
          }
        } catch (e) {
          console.error('Recaptcha Error:', e)
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
    
    const updateTimeRemain=(_timeRemain)=>{
        // console.log("updateTimeRemain"+_timeRemain);
        settimeRemain(_timeRemain);
    }
    const  getRemainingTime=()=>{
        // console.log("getRemainingTime");
        const _getData = async () => {
            try {
                const userData = await AsyncStorage.getItem('remaintimevp');
                if(!Tools.IsNull(userData)){
                    // console.log("RemainDataVP In-"+JSON.stringify(userData));
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
                console.log(error); 
            }
        };
        _getData();
    }
   
        
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
                width:widthPercentageToDP('55%'),
                height:heightPercentageToDP(4.75),
                alignSelf:'center',
                backgroundColor:Colors.blueColor,
                borderRadius:heightPercentageToDP(4.75),
                borderColor:Colors.whiteColor,
                justifyContent:'center'
            },buttontxt:{
                alignSelf:'center',
                color:Colors.whiteColor,
                // paddingTop:15,
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(4),
                // lineHeight: AdaptiveWidth(18) * 1.6,
                // height: AdaptiveWidth(18)* 1.3,
            },
            inputNo:{
                alignSelf:'center',
                color:Colors.inputfontColor,
                height:40,
                fontSize:15,
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
                width:'80%',alignSelf:'center',
                textAlign:'center',
                color:Colors.inputfontColor,
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(4.5),
                lineHeight: widthPercentageToDP(4.5) * 1.5,
                // height: AdaptiveWidth(15)* 1.3, 
            },
            duration:{
                marginLeft: 10,
                fontSize:20,
                textAlign:'center',
                color:Colors.whiteColor,
                fontWeight:'400',
                
                fontFamily:'Cairo-Regular',
                fontSize: AdaptiveWidth(18),
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
            },
            rowView:{
                // flex:1,
                flexDirection:'row',
                width:'100%',
                height:60,
                // borderWidth:2,
                justifyContent:'space-around'
            },alttxt:{
                alignSelf:'center',
                color:Colors.inputfontColor,
                fontWeight:'400',
                fontFamily:'Cairo-Regular',
                fontSize: widthPercentageToDP(3.5),
            },
        });

        const checkInput=()=>{
            if(showError){
                return(
                    <View style={{width:'100%'}} >
                    <Text allowFontScaling={false} style={styles.warning}>*{i18n.t('pleaseentertheotp')}</Text></View>
                    );
                }
            }
            const OnSubmit=()=>{
                if(Tools.stringIsEmpty(val)){
                    setshowError(true);
                    return;
                }
                //check OTP
                // setState({visible:false},OnDone(true));
                OnDone(true);
            }
            const OnDone=(donestate)=>{
                // handleSend().then((tokenIn)=>{
                    otpcode=val;
                    var isdone=props.onDone;
                    isdone(otpcode,donestate);
                // })
               
            }

        return (
            <Modal  statusBarTranslucent={true} animationType = {"none"} transparent = {false} visible={visible} onRequestClose={()=>setvisible(false)}>
            <BackgroundWall/>
            <View style={{height:'100%',width:'100%',backgroundColor:Colors.bgColor}}>
            <SafeAreaView>
            <GoogleRecaptcha
          ref={(ref)=>{recaptchaRef=ref}}
          size={GoogleRecaptchaSize.INVISIBLE}
          // baseUrl="http://localhost:3000"
          baseUrl={WebServices.googleRecaptchaSiteURL}
          siteKey={WebServices.googleRecaptchaSiteKey}
          />
            <TopBackBar onDone={()=>{OnDone(false)}} navigation= {props.navigation}/>
            <View style={styles.modalView}>
            <View style={{borderColor:Colors.whiteColor,borderRadius:20,width:width*0.9,justifyContent:'center'}} >
            <View style={[{backgroundColor:Colors.whiteColor,width:widthPercentageToDP(20),height:widthPercentageToDP(20)
                ,justifyContent:'center',alignSelf:'center'
                ,borderRadius:widthPercentageToDP(20)},styles.shadow]}>
                <Image resizeMode='contain' style={{alignSelf:'center', tintColor:Colors.blueColor,width:widthPercentageToDP(15),height:widthPercentageToDP(15)}} source={mobileverifyIcon}/>
                </View>
                {UIElements.drawGap(30)}
                <Text numberOfLines={3} style ={styles.title} allowFontScaling={false}>{props.title}</Text>
                {/* <Text style ={styles.duration} allowFontScaling={false}>{props.details}</Text> */}
                <OTP title={true} onChangeText={(text) => {
                    setVal(text);
                    setshowError(false);
                    // changeHappened();  
                }}/>
                
                {/* <View style={styles.inputView}> 
                <TextInput style={styles.inputNo}
                placeholderTextColor='#676667'
                allowFontScaling={false}
                editable={true}
                value={val}
                onChangeText={(text) => {
                    setState({val:text,showError:false});
                    changeHappened();  
                }}
                keyboardType='number-pad'
                returnKeyType='done'
                maxLength={4}
                placeholder={i18n.t('pleaseentertheotp')}/>
            </View> */}
            {checkInput()}
            {UIElements.drawGap(40)}
            
            
            <TouchableOpacity style={styles.buttonB} onPress={()=>{OnSubmit()}}>
            <Text allowFontScaling={false} style={styles.buttontxt} >{i18n.t('verify')}</Text>
            </TouchableOpacity>
            {UIElements.drawGap(45)}
            
            <View style={{flexDirection:'row',alignSelf:'center'}}>
            <Text allowFontScaling ={false} style={styles.alttxt}>{i18n.t('didntreceivecode')}</Text>
            {UIElements.drawRGap(7)}
            {((showTime)&&remain>0)&&<Text style ={styles.alttxt} allowFontScaling={false}>{i18n.t('pleasewait')} {moment(remain*1000).format('mm:ss')} {i18n.t('to')} </Text>}
            {/* <Text  allowFontScaling ={false} style={styles.alttxt}>{i18n.t('or')}</Text> */}
            <TouchableOpacity
            disabled={showTime}
            onPress={()=>{
                handleSend().then((_token)=>{
                    var sendOTP=props.sendOTP;
                    sendOTP((_timeR,_token)=>{
                        updateTimeRemain(_timeR)
                    });
                })
             
                
            }}>
            {/* <Gradient gradient={colors.gradientBut} style={styles.buttonB}> */}
            <Text  allowFontScaling ={false} style={{opacity:showTime?0.6:1, color:Colors.inputfontColor,fontFamily:'Cairo-Bold',textDecorationLine:'underline',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5)}}>{i18n.t('requestagain')}</Text>
            {/* </Gradient> */}
            </TouchableOpacity></View>
            {/* <TouchableOpacity style={{alignSelf:'center'}}  onPress={()=>{OnDone(false)}}>
            <TabBarIcon selectedColor={ Colors.whiteColor }
            width={25}
            height={25}
            focused={true}
            name={'close'}/>
        </TouchableOpacity> */}
        {/* {UIElements.drawGap(20)} */}
        </View>
        </View></SafeAreaView></View></Modal>
        )
   
    }
    