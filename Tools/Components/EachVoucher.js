import React, { Component, useEffect, useState } from 'react';
import {Image, View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity,ScrollView, Alert} from 'react-native';
import Colors from '../constants/Colors';
import * as UIElements from './UIElements';
import * as Tools from './Tools';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import {AdaptiveWidth,AdaptiveHeight} from './AdaptiveSize';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
// import Barcode from 'react-native-barcode-builder';
import RenderHtml,{defaultSystemFonts}from 'react-native-render-html';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useTheme } from '../context/ThemeProvider';
import LoadingLine from './LoadingLine';
import WebServices from '../constants/WebServices';
import { BlurView } from '@react-native-community/blur';
import PopUpModal from './PopUpModal';
const systemFonts = [...defaultSystemFonts, 'Cairo-Regular']

export default function EachVoucher(props) {
    const Colors=useTheme();
    const [val,setVal]=useState('');
    const [visible,setvisible]=useState(true);
    const [isloading,setLoading]=useState(false);
    const [sureModel,setsureModel]=useState(false);
    const { state, dispatch } = useAppContext();
    const [redeemSuccess,setRedeemSuccess]=useState((Tools.IsNull(props.dataIn)||Tools.IsNull(props.dataIn.Redeemed))?false:props.dataIn.Redeemed);
    const [redeemIn,setRedeemIn]=useState((Tools.IsNull(props.dataIn)||Tools.IsNull(props.dataIn.Redeemed))?false:props.dataIn.Redeemed);
    i18n.translations = state.i18ntranslation;
    useEffect(()=>{
        Tools.updateRatePoints(1);
        console.log(JSON.stringify(props.dataIn));
    },[])
    
    const removeTag=(content)=>{
        content = content.replace("<p>", "")
        content = content.replace("</p>", "")
        return content;
    }
    
    const OnSubmit=()=>{
        //check OTP
        setvisible(false);
        this.OnDone(true);
        
    }
    const OnDone=(donestate)=>{
        otpcode=val;
        var isdone=props.onDone;
        isdone(otpcode,donestate);
    }

    const redeemCoupon = async (_couponCodeIn) => {
        setLoading(true);
        const redeemurl = WebServices.redeemCoupon
            .replace('{MemberID}', props.accessToken.MemberID)
            .replace('{CouponCode}', _couponCodeIn);
        
        try {
            const response = await fetch(WebServices.MainURL + redeemurl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + props.accessToken.access_token,
                }
            });
    
            const responseText = await response.text();
            console.log('redeemCoupon response:', responseText);
    
            setLoading(false); // Stop loading here after fetching the response
    
            // Check response status
            if (!response.ok) { // Response status not in the 200-299 range
                console.error(`Error: Status ${response.status}`);
                Alert.alert(i18n.t('error'), `Error: Status ${response.status}`);
                return;
            }
    
            // Check for specific response contents
            if (!Tools.stringIsContains(responseText, 'error')) {
                if(Tools.stringIsContains(responseText,'success')){
                    setRedeemSuccess(true);
                }
                if (Tools.stringIsContains(responseText, 'denied')) {
                    if (props.assignProfile != null) {
                        props.assignProfile("user", '', '');
                    }
                    return;
                }else {
                    if (props.assignProfile != null) {
                        props.assignProfile("user", '', '');
                    }
                    Alert.alert(responseText, '');
                }
            }
        } catch (error) {
            setLoading(false);
            console.error('Fetch error:', error);
            Alert.alert(i18n.t('couponError'), 'An error occurred while redeeming the coupon.');
        }
    };
    const handleRedeem=()=>{
       redeemCoupon(props.dataIn.SystemCode)
    }
    
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
            // maxHeight:'80%',
            alignSelf:'center',
            borderRadius:20,
            width:widthPercentageToDP(90),
            height:heightPercentageToDP(80),
            backgroundColor:Colors.bgColor,
            // borderWidth:2,
            // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
        },
        Button:{
            // flex:1,
            position:'absolute',
            width:200,
            height:35,
            alignSelf:'center',
            alignItems:'center',
            backgroundColor:Colors.blueColor,
            borderRadius:15,bottom:25,
            justifyContent:'center'
        },
        buttontext:{
            fontSize:20,
            // lineHeight:24,
            // height:25,
            color:Colors.whiteColor,
            fontFamily:'Cairo-Regular',
            alignSelf:'center'
            // lineHeight: AdaptiveWidth(18) * 1.6,
            // height: AdaptiveWidth(18)* 1.3, 
        },
        voucherDetail:{
            alignSelf:'center',
            marginTop:10,
            width:'80%',
            fontSize:16,fontFamily:'Cairo-Regular',
            fontWeight:'300',
            justifyContent:'center',
            alignItems:'center',textAlign:'center'
        },
        voucherDetailExpire:{
            marginTop:heightPercentageToDP(1),
            alignSelf:'center',
            width:60*4,
            fontSize:18,fontFamily:'Cairo-Bold',
            justifyContent:'center',
            alignItems:'center',textAlign:'center'
        },
        voucherNo:{
            alignSelf:'center',
            color:Colors.inputfontColor,
            marginTop:10,
            fontSize:18,
            fontFamily:'Cairo-Bold',
            justifyContent:'center',
            // alignItems:'center',
            textAlign:'center'
        },
        voucherTitle:{
            padding:25,
            textAlign:'center',
            fontWeight:'bold',
            fontFamily:'Cairo-Regular',
            fontSize: 20,
            lineHeight:25,
            color:Colors.black,
            textTransform:'uppercase'
            // lineHeight: AdaptiveWidth(15) * 1.6,
            // height: AdaptiveWidth(15)* 1.3*3, 
        },
        duration:{
            marginLeft: 10,
            fontSize:20,
            textAlign:'center',
            color:Colors.whiteColor,
            fontWeight:'400',
            
            fontFamily:'Cairo-Regular',
            fontSize: AdaptiveWidth(18),
            lineHeight: AdaptiveWidth(18) * 1.6,
            height: AdaptiveWidth(18)* 1.3, 
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
        },buttonText:{
            fontFamily:'Cairo-Regular',
            textAlign:'center',
            textAlignVertical:'center',
            color:Colors.whiteColor,
            fontSize: 18,
            // lineHeight:15*1.5,
            // textTransform:'uppercase'
        },buttonView:{
            borderRadius:heightPercentageToDP(4.75),
            alignSelf:'center',width:widthPercentageToDP('35%'),backgroundColor:Colors.blueColor,
            height:heightPercentageToDP(4.75),
            justifyContent:'center',
        }
    });
    const OnVerifyDone =()=>{
        handleRedeem();
    }
    
    return (
        <Modal style={{width:'100%',height:'100%'}}  statusBarTranslucent={true} transparent={true} animationType = {"fade"} visible={visible}>
        <View style={{backgroundColor:Colors.transparentMildWhite,height:'100%',width:'100%',justifyContent:'center'}}>
        <View style={styles.modalView}>
        <Text allowFontScaling={false} style={styles.voucherTitle}>{Tools.stringIsContains(i18n.locale,"en")?props.dataIn.TitleEn:props.dataIn.TitleAr}</Text>
        
        <View style={{alignSelf:'center',marginTop:-15,minHeight:widthPercentageToDP(40)}}>
        <QRCode
        value={props.dataIn.CouponCode+""}
        size={widthPercentageToDP(40)}
        color={Colors.black}
        backgroundColor={Colors.backgroudColor}/>
        </View>
        <Text allowFontScaling={false} style={styles.voucherNo}>{props.dataIn.CouponCode}</Text>
        {!redeemSuccess&&<BlurView style={{position:'absolute',alignSelf:'center',width:widthPercentageToDP(80),height:widthPercentageToDP(60),top:heightPercentageToDP(5)}}
                                    blurType="light"
                                    blurAmount={5}
                                    reducedTransparencyFallbackColor="white"/>}
        {!redeemIn&&<Text allowFontScaling={false} style={styles.voucherDetailExpire}>{i18n.t('expires')+' '+UIElements.formatDate(props.dataIn.ValidTo)}</Text>}
        {redeemIn&&<Text allowFontScaling={false} style={[styles.voucherDetailExpire,{color:Colors.orangeColor,textTransform:'uppercase'}]}>{i18n.t('couponredeemed')}</Text>}
        <ScrollView style={{height:'50%'}} contentContainerStyle={{paddingLeft:widthPercentageToDP(4),paddingRight:widthPercentageToDP(4)}} horizontal={false}>
        <RenderHtml
        defaultTextProps={{allowFontScaling:false}}
        baseStyle={{
            textAlign:'left',fontFamily:'Cairo-Regular',
            fontSize:widthPercentageToDP(3.5),
            color:Colors.black,
        }}
        GenericPressable={ (evt, href) => {
            if(Tools.stringIsContains(href,WebServices.appurl)){
            }else{
                Linking.openURL(href); 
            }}}
            tagsStyles={{
                p: {
                    fontSize:widthPercentageToDP(4),
                    color:Colors.black,
                    width:'100%',
                },
            }}
            systemFonts={systemFonts} 
            contentWidth={widthPercentageToDP(80)}
            source={{ html: (Tools.stringIsContains(i18n.locale,"en")?props.dataIn.DescriptionEn:props.dataIn.DescriptionAr)}}
            />
            </ScrollView>
            {!isloading&&UIElements.drawGap(20)}
            {isloading&&<LoadingLine visibleText ={false}/>}

            <View style={{flexDirection:'row',justifyContent:'center',alignSelf:'center',width:widthPercentageToDP(80)}}>
            {!redeemSuccess&&   <TouchableOpacity style={[styles.buttonView,{marginRight:widthPercentageToDP(5)}]} onPress={()=>{setsureModel(true)}}>
            <Text allowFontScaling={false} style={styles.buttonText} >{i18n.t('redeem')}</Text>
            </TouchableOpacity>}
            <TouchableOpacity style={styles.buttonView} onPress={()=>{OnDone(false)}}>
            <Text allowFontScaling={false} style={styles.buttonText} >{i18n.t('close')}</Text>
            </TouchableOpacity></View>
            {UIElements.drawGap(20)}
            </View></View>
            {sureModel&&(<PopUpModal title={i18n.t('areyousuretoredeem')+" "+i18n.t('coupon')+
            (i18n.t('questionmark'))} onDone={OnVerifyDone}/>)}
            </Modal>
            )
        }
        