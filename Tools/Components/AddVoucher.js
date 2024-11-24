import React, { Component, useEffect } from 'react';
import {Image, ScrollView,View,Modal,StyleSheet,Dimensions,Text,Platform,TextInput,TouchableOpacity, Alert, Keyboard} from 'react-native';
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
// import QRCode from 'react-native-qrcode-svg';
import OverlayLoad from './OverlayLoad'
import WebServices from '../constants/WebServices';
import ImagePicker,{launchCamera, launchImageLibrary} from 'react-native-image-picker';
import cameraIcon from '../../assets/Icons/camera.png'
import imageIcon from '../../assets/Icons/image.png'
import proceedB from '../../assets/Icons/back.png'
import LoadingLine from './LoadingLine';
import { useTheme } from '../context/ThemeProvider';
import BackgroundWall from './BackgroundWall';
import { useState } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
export default function AddVoucher(props){
    const Colors=useTheme();
    let actionFindRequirement=undefined;
    let actionAddCoupon=undefined;
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    
    const [val, setVal] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [showError, setShowError] = useState(false);
    const [visible, setVisible] = useState(true);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState('');
    const [data, setData] = useState('');
    const [loadData, setLoadData] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [canFill, setCanFill] = useState(false);
    const [allConditions, setAllConditions] = useState(undefined);
    const [currentImage, setCurrentImage] = useState(undefined);
    const [actionInvoke, setActionInvoke] = useState(undefined);
    const [profile, setProfile] = useState({});
    const [isLoading,setIsLoading]=useState(false);
    const checkLoading=(elements)=>{
        if(loadData&&actionAddCoupon!=undefined){
            if(actionAddCoupon!=undefined){
                // console.log("checkLoading");
                actionAddCoupon(()=>OnDone(true));
                setLoadData(false);
                actionAddCoupon=undefined;
            }
        }
        if(loadData&&actionFindRequirement!=undefined){
            if(actionFindRequirement!=undefined){
                // console.log("checkLoading");
                actionFindRequirement(couponCode);
                setLoadData(false);
                actionFindRequirement=undefined;
            }
        }
        return(<Modal  statusBarTranslucent={true} animationType={'fade'}
        transparent = {true} visible={visible}>
        <View style={{flex:1}} >
        {elements}
        {/* {isLoading&&<OverlayLoad size='small' color={Colors.whiteColor} isopen={isLoading}/>} */}
        </View></Modal>);
        
    }
    
    useEffect(()=>{
        setLoadData(false);
        setProfile(props.profile);
        Tools.updateRatePoints(1);
    },[])

    useEffect(()=>{
        if(allConditions!=undefined)
        if(allConditions.length<=0){
            addCouponToProfile(()=>OnDone(true));
        }
    },[allConditions])
    
    useEffect(()=>{
        if(props.profile!=profile){
            setLoadData(true);
        }
    },[props])
    
    const getErrorMessage=(responseData)=>{
        // console.log("Error : "+JSON.stringify(responseData));
        if((Tools.stringIsContains(responseData.ErrorMessage,'redeemed'))){
            return i18n.t('couponredeemed');
        }
        else if((Tools.stringIsContains(responseData.ErrorMessage,'registered'))){
            return i18n.t('couponregistered');
        }
        else if(Tools.stringIsContains(responseData.ErrorMessage,'notexist')){
            return i18n.t('couponnotexist');
        }else if(Tools.stringIsContains(responseData.ErrorMessage,'notvalidyet')){
            return i18n.t('couponacceptfrom')+responseData.ErrorMessage.substring(responseData.ErrorMessage.indexOf('-') + 1);
        }else if(Tools.stringIsContains(responseData.ErrorMessage,'exceedvalidity')){
            return i18n.t('couponexpiredon')+responseData.ErrorMessage.substring(responseData.ErrorMessage.indexOf('-') + 1);
        }
    }
    
    const FindRequirementsCoupon=(couponCode)=>{
        console.log("C : "+couponCode);
        setIsLoading(true);
        setCouponCode(couponCode);
        Addurl=WebServices.FindCouponRequirements.replace('{MemberID}',props.accessToken.MemberID).replace('{CouponCode}',couponCode);
        console.log(WebServices.MainURL+Addurl);
        return fetch (WebServices.MainURL+Addurl,{
            method: 'POST',headers: {
                'Authorization':'Bearer '+props.accessToken.access_token,
                'Content-Type': 'application/json',
            },
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
        console.log("C : "+responseJson);
            setIsLoading(false);
            // if(!Tools.stringIsContains(responseJson,'error')){
            if(Tools.stringIsContains(responseJson,'denied')){
                setLoadData(false);
                actionFindRequirement=FindRequirementsCoupon;
                if(props.assignProfile!=null)
                props.assignProfile("user",'','')
                return;
            }else{
                console.log(responseJson);
                var responseData=JSON.parse(responseJson);
                if(responseData.Valid){
                    setAllConditions(responseData.RegistrationData);
                    setCanFill(true);
                       
                }else{
                    Alert.alert(getErrorMessage(responseData),"");
                }
            }
        })
        .catch((error) =>{
            setIsLoading(false);
            console.error(error);
        });
    }
    
    const checkAdd=(dataIn)=>{
        var add=true;
        for(let t=0;t<dataIn.length;t++){
            // console.log("Check "+dataIn[t].Value);
            if(dataIn[t].Required&&(dataIn[t].Value==''||dataIn[t].Value==undefined))
            add=false;
        }
        setCanAdd(add);
        setCanFill(!add?true:false);
        setAllConditions(dataIn);
    }
    
    const CameraAccess=(accessCode)=>{
        var cameraOptions={
            mediaType:'photo',
            includeBase64:true,
        };
        if(accessCode==0){
            launchCamera(cameraOptions,(resp)=>{
                if(resp.didCancel)
                return;
            setCurrentImage(resp.assets[0].base64);
            (()=>{
                    var dataSend=allConditions;
                    for(let t=0;t<dataSend.length;t++){
                        if(dataSend[t].Type==5)
                        dataSend[t].Value="data:"+resp.assets[0].type+";base64"+resp.assets[0].base64;//"data:image/jpeg;base64"+
                    }
                    checkAdd(dataSend);
                })
            });
        } else{       
            launchImageLibrary(cameraOptions,(resp)=>{
                if(resp.didCancel)
                return;
                setCurrentImage(resp.assets[0].base64);

                (()=>{
                    var dataSend=allConditions;
                    // console.log(JSON.stringify(dataSend));
                    for(let t=0;t<dataSend.length;t++){
                        if(dataSend[t].Type==5)
                        dataSend[t].Value="data:"+resp.assets[0].type+";base64"+resp.assets[0].base64;//"data:image/jpeg;base64"+
                    }
                    checkAdd(dataSend);
                })
            });
        }
        
    }
    const addCouponToProfile=(callback)=>{
        actionAddCoupon=undefined;
        var dataSend=allConditions;
        setIsLoading(true);
        Addurl=WebServices.AddCoupon.replace('{MemberID}',props.accessToken.MemberID).replace('{CouponCode}',couponCode);
        return fetch (WebServices.MainURL+Addurl,{
            method: 'POST',headers: {
                'Authorization':'Bearer '+props.accessToken.access_token,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(dataSend)
        },5000)
        .then((response) => response.text())
        .then((responseJson) => {
            console.log('Coupon : '+responseJson);
            setIsLoading(false);
            if(!Tools.stringIsContains(responseJson,'error')){
                if(Tools.stringIsContains(responseJson,'denied')){
                    setLoadData(false);
                    actionAddCoupon=addCouponToProfile;
                    if(props.assignProfile!=null)
                    props.assignProfile("user",'','');
                    return;
                }else if(Tools.stringIsContains(responseJson,'already')){
                    if(callback!=null){
                        callback();
                    }
                    Alert.alert(i18n.t('couponredeemed'),'');
                }else{
                    if(callback!=null){
                        callback();
                    }
                    if(props.assignProfile!=null)
                    props.assignProfile("user",'','');
                    Alert.alert(i18n.t('couponaddedtoprofile'),'');
                }
            }else{
                setAllConditions(undefined);
            }
        })
        .catch((error) =>{
            setIsLoading(false);
            console.error(error);
        });
    }
    const getallInputs=()=>{
        var allLines=[];
        if(allConditions!=undefined){
            for(let t=0;t<allConditions.length;t++){
                
                if(allConditions[t].Type==5){//image
                    allLines.push(
                        <View style={[styles.inputnumber,{marginTop:10,paddingLeft:0,justifyContent:'center'}]} key={t+'vi'}>
                        <View style={{ width:widthPercentageToDP(75),flexDirection:'row',alignSelf:'center'}}>
                        <Text allowFontScaling={false} style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.warningColor}}>{allConditions[t].Required?'*':''}</Text>
                        <Text allowFontScaling={false} style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.black}}>{Tools.stringIsContains(i18n.locale,"en")?allConditions[t].TitleEn:allConditions[t].TitleAr}</Text>
                        </View>
                        
                        {UIElements.drawGap(10)}
                        
                        <View style={{flexDirection:'row',justifyContent:'space-around'}}> 
                        <TouchableOpacity onPress={()=>{
                            CameraAccess(0);
                        }}><Image style={{tintColor:Colors.blueColor}} source={cameraIcon}/></TouchableOpacity>
                        
                        <TouchableOpacity onPress={()=>{
                            CameraAccess(1);
                        }}><Image style={{tintColor:Colors.blueColor}} source={imageIcon}/></TouchableOpacity></View>
                        {(allConditions[t].Value.length>0)&&(
                            <View style={{ width:widthPercentageToDP(75),flexDirection:'row',alignSelf:'center',justifyContent:'left',alignContent:'space-between'}}>
                            <View style={{flexDirection:'row'}}>
                            {/* <Text style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.orangeColor}}>*</Text> */}
                            <Text allowFontScaling={false} style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.warningColor}}>{i18n.t('imageadded')}</Text>
                            </View>
                            <TouchableOpacity style={{position:'absolute',right:0}} onPress={()=>{
                                var dataDelete=allConditions;
                                dataDelete[t].Value="";
                                setAllConditions(dataDelete);
                                checkAdd(dataDelete);
                            }}>
                            <Text allowFontScaling={false} style={{textAlign:'right',fontSize:17,fontFamily:'Cairo-Regular',color:Colors.blueColor}}>X</Text>
                            </TouchableOpacity>
                            </View>
                            )}
                            </View>
                            )
                        }else {
                            allLines.push(
                                <View style={[{backgroundColor:Colors.bgColor,marginBottom:10,marginTop:0,paddingLeft:0,justifyContent:'center'}]} key={t+'vi'}>
                                <View style={{ width:widthPercentageToDP(75),flexDirection:'row',alignSelf:'center'}}>
                                <Text allowFontScaling={false} style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.warningColor}}>{allConditions[t].Required?'*':''}</Text>
                                <Text allowFontScaling={false} style={{textAlign:'center', fontSize:17,fontFamily:'Cairo-Regular',color:Colors.black}}>{Tools.stringIsContains(i18n.locale,"en")?allConditions[t].TitleEn:allConditions[t].TitleAr}</Text>
                                </View>
                                <TextInput 
                                allowFontScaling={false}
                                onEndEditing={(textIn)=>{
                                    var dataIn=allConditions;
                                    dataIn[t].Value=textIn.nativeEvent.text;
                                    checkAdd(dataIn);
                                    
                                }} style={[styles.inputnumber,{ marginTop:0,
                                    marginBottom:0,}]}
                                    placeholderTextColor={Colors.placeholdertext}
                                    placeholder={Tools.stringIsContains(i18n.locale,"en")?allConditions[t].TitleEn:allConditions[t].TitleAr}
                                    >
                                    </TextInput>
                                    </View>
                                    );
                                }
                            }
                        }
                        return allLines;
                        
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
                            alignSelf:'center',
                            borderRadius:20,
                            width:widthPercentageToDP(93),
                            backgroundColor:Colors.bgColor
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
                        inputnumber:{
                            fontSize:18,
                            marginTop:20,
                            marginBottom:20,
                            width:widthPercentageToDP(80),
                            borderRadius:15,
                            padding:5,
                            paddingLeft:20,
                            color:Colors.inputfontColor,
                            backgroundColor:Colors.whiteColor,
                            fontFamily:'Cairo-Regular',
                            alignSelf:'center'
                        },
                        buttontext:{
                            fontSize:20,
                            color:Colors.whiteColor,
                            fontFamily:'Cairo-Regular',
                            alignSelf:'center'
                        },
                        voucherDetail:{
                            alignSelf:'center',
                            marginTop:10,
                            width:60*4,
                            height:60,
                            fontSize:14,
                            fontWeight:'300',
                            justifyContent:'center',
                            alignItems:'center',textAlign:'center'
                        },
                        voucherNo:{
                            alignSelf:'center',
                            color:Colors.blueColor,
                            marginTop:10,
                            width:60*4,
                            height:60,
                            fontSize:14,
                            fontFamily:'Cairo-Bold',
                            justifyContent:'center',
                            alignItems:'center',textAlign:'center'
                        },
                        voucherTitle:{
                            paddingTop:25,
                            textAlign:'center',
                            fontWeight:'400',
                            fontFamily:'Cairo-Regular',
                            fontSize: 23,
                            lineHeight:30,
                            textTransform:'uppercase',
                            color:Colors.black,
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
                        backbut:{
                            tintColor:Colors.blueColor,
                            alignSelf:'center',
                            width:35,
                            height:35,
                            transform:[{translateX:0}, {rotateZ:'180deg'}],
                            zIndex:10,
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
                            // paddingTop:5,
                            color:Colors.whiteColor,
                            
                            fontSize: widthPercentageToDP(4.5),
                            // lineHeight:15*1.5,
                            
                            // lineHeight:15*1.5,
                            // textTransform:'uppercase'
                        },buttonView:{
                            backgroundColor:Colors.blueColor,
                            marginBottom:20,height:heightPercentageToDP(4.75),
                            borderRadius:heightPercentageToDP(4.75),
                            alignSelf:'center',
                            width:widthPercentageToDP('35%'),
                            justifyContent:'center'
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
                        
                        const OnDone=(_state)=>{
                            var isdone=props.onDone;
                            isdone(_state);
                        }
                        return (
                            checkLoading(
                                <View style={{height:'100%',width:'100%',justifyContent:'center'}}>
                                <BackgroundWall blur={true} opacity={0.8}/>
                                <View style={styles.modalView}>
                                <Text allowFontScaling={false} style={styles.voucherTitle}>{i18n.t('addcoupon')}</Text>
                                
                                <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <TextInput allowFontScaling={false}
                                style={[styles.inputnumber,((allConditions!=undefined&&allConditions.length>0)?{marginBottom:0}:{})]}
                                // onEndEditing={(couponCode)=>FindRequirementsCoupon(couponCode.nativeEvent.text)}
                                onChangeText={(couponCode) => {
                                    setCouponCode(couponCode);
                                    setAllConditions(undefined);
                                    setCanAdd(false);
                                }}
                                value={couponCode}
                                placeholder={i18n.t('couponcode')}
                                placeholderTextColor={Colors.placeholdertext}
                                />
                                {/* {couponCode.length>2&&<TouchableOpacity style={{width:25,height:42,end:45,alignSelf:'center',justifyContent:'center',position:'absolute'}} onPress={()=>FindRequirementsCoupon(couponCode)}><Image source={proceedB} style={styles.backbut} ></Image></TouchableOpacity>} */}
                                </View>
                                <View style={{position:'absolute',width:'100%',alignSelf:'center',top:heightPercentageToDP(6.5)}}>{isLoading&&<LoadingLine visibleText={false}/>}</View>
                                
                                {/* {getallInputs()} */}
                                <ScrollView style={{maxHeight:heightPercentageToDP(50)}}>{
                                    getallInputs()}
                                    </ScrollView>
                                    <View style={{flexDirection:'row',width:'93%',justifyContent:'space-around',alignSelf:'center'}}>
                                    {!canAdd&&!canFill&& <TouchableOpacity disabled={couponCode.length<=2} style={[styles.buttonView,{opacity:couponCode.length>2?1:0.2}]} 
                                    onPress={()=>{
                                        Keyboard.dismiss();
                                        FindRequirementsCoupon(couponCode)}}>
                                        <Text allowFontScaling={false} style={styles.buttonText} >{i18n.t('add')}</Text>
                                        </TouchableOpacity>}
                                        {(canFill||canAdd)&&<TouchableOpacity style={[styles.buttonView,!canAdd?{opacity:0.2}:{}]} onPress={()=>{
                                            addCouponToProfile(()=>OnDone(true))
                                            
                                        }}>
                                        <Text allowFontScaling={false} style={styles.buttonText} >{i18n.t('addcoupon')}</Text>
                                        </TouchableOpacity>}
                                        <TouchableOpacity style={styles.buttonView} onPress={()=>{OnDone(false)}}>
                                        <Text allowFontScaling={false} style={styles.buttonText} >{i18n.t('close')}</Text>
                                        </TouchableOpacity></View>
                                        </View></View>)
                                        )
                                    }
                                    
                                    
                                    
                                    