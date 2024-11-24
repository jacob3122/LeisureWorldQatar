import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity} from 'react-native';
// import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function PopUpModal(props){
    const Colors=useTheme();
    const [val,setVal]=useState('');
    const [showError,setshowError]=useState(false);
    const [visible,setVisible]=useState(true);
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    useEffect(()=>{
        Tools.updateRatePoints(1);
    },[]);
    const styles = StyleSheet.create({
        warning:{
            color:'#ed4f3b',
            paddingTop:15,
            // paddingBottom:15,
            fontWeight:'500',

            fontFamily:'Cairo-Regular',
            fontSize: AdaptiveWidth(20),
            lineHeight: AdaptiveWidth(20) * 1.6,
            height: AdaptiveWidth(20)* 1.3, 
        },
        modalView:{
            alignContent:'center',
            justifyContent:'center',
            alignItems:'center',
            // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
        },
        Button:{
            // flex:1,
            width:'40%',
            height:heightPercentageToDP(4.75),
            alignSelf:'center',
            alignItems:'center',
            backgroundColor:Colors.blueColor,
            borderRadius:heightPercentageToDP(4.75),
            justifyContent:'center'
        },
        buttontext:{
            fontSize:17,
            // lineHeight:24,
            // height:25,
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            alignSelf:'center',includeFontPadding:false
            // lineHeight: AdaptiveWidth(18) * 1.6,
            // height: AdaptiveWidth(18)* 1.3, 
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
            textAlign:'center',
            fontWeight:'100',
            color:Colors.inputfontColor,

            fontFamily:'Cairo-Regular',
            fontSize: 20,
            // lineHeight:30,
            // lineHeight: AdaptiveWidth(15) * 1.6,
            // height: AdaptiveWidth(15)* 1.3*3, 
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
        }
    });
    const checkInput=()=>{
        if(showError){
        return(
            <View>
            <Text allowFontScaling={false} style={styles.warning}>{i18n.t('pleaseentertheotp')}</Text></View>
        );
        }
    }
    const OnSubmit=()=>{
        //check OTP
        setVisible(false);OnDone(true);
        
    }
    const OnDone=(donestate)=>{
        otpcode=val;
        let isdone=props.onDone;
        isdone(otpcode,donestate);
    }
        return (
            <Modal  statusBarTranslucent={true} animationType = {"fade"} transparent = {true} visible={visible}>
                <BackgroundWall blur opacity={0.8}/>
            <View style={{height:'100%',width:'100%',justifyContent:'center'}}>
            <View style={styles.modalView}>
            <View style={{backgroundColor:Colors.whiteColor,borderRadius:20,width:'90%',justifyContent:'center'}} >
                {/* <Image source= ></Image> */}
            {UIElements.drawGap(10)}

            <Text style ={styles.title} allowFontScaling={false}>{props.title}</Text>
            {UIElements.drawGap(15)}
            <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <TouchableOpacity style={styles.Button} onPress={()=>{OnSubmit()}}>
            <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t('yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={()=>{OnDone(false)}}>
            <Text allowFontScaling={false} style={styles.buttontext} >{i18n.t('no')}</Text>
            </TouchableOpacity>
            </View>
            {UIElements.drawGap(25)}
            </View>
            </View></View></Modal>
            )
        }
        
    
    