import React, { Component, useEffect, useState } from 'react'
import {RefreshControl,StyleSheet,View,Text,Image,TouchableOpacity,ImageBackground,Dimensions, SafeAreaView, ScrollView, Alert} from 'react-native'
import * as UiElements from './UIElements'
import QuestionAnswer from './QuestionAnswer';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../constants/Colors';
// import bgred from '../../assets/card/red.png';
// import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import WebServices from '../../Tools/constants/WebServices'
import backButton from '../../assets/Icons/back.png'

// import HeaderLogo from './HeaderLogo';
import OverlayLoad from './OverlayLoad';
import BackButton from './BackButton';
import * as Tools from './Tools'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import voucherData from '../../Tools/constants/voucherData.js';
// import {  } from 'react-navigation';
import EachVoucher from './EachVoucher';
import AddVoucher from './AddVoucher';

import fCoupon from '../../assets/Icons/coup-1.png';
import bCoupon from '../../assets/Icons/coup-2.png';
import ProfileData from './ProfileData';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { logScreenViewEvent } from '../Analytics/AppAnalytics';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';
import { BlurView } from '@react-native-community/blur';
import PopUpModal from './PopUpModal.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
export default function VoucherPage(props){
    
    const COUPON_LIMIT = 2;
    const VIEW_DURATION = 3000;//3600000; 
    
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [data,setData]=useState(undefined);
    const [showLogin,setshowLogin]=useState(false);
    const [addVoucher,setAddVoucher]=useState(false);
    const [refreshing,setrefreshing]=useState(false);
    // const [nearCounter,setNearCounter]=useState(false);
    const [couponVisible,setCouponVisible]=useState(false);
    const [canViewCoupon,setcanViewCoupon]=useState(false);
    const [timeLeft,setTimeLeft]=useState(VIEW_DURATION / 1000);
    const [profileCoupons,setProfileCoupons]=useState(Tools.IsNull(props.profile)?[]:props.profile.Coupons);
    
    const [curCouponCode,setCurrentCouponData]=useState(undefined);
    
    useEffect(()=>{
        if(curCouponCode)
            console.log(JSON.stringify(curCouponCode))
    },[curCouponCode])
    useEffect(()=>{
        if(!Tools.IsNull(props.profile)){
            setshowLogin(false);
            const sortedCoupons = [...props.profile.Coupons].sort((a, b) => {
                return a.Redeemed === b.Redeemed ? 0 : a.Redeemed ? 1 : -1;
            });
            setProfileCoupons(sortedCoupons);
        }
    },[props])
    
    useEffect(() => {
        let timer;
        if (couponVisible && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft <= 0) {
            setCouponVisible(false);
            lockCoupon();
        }
        return () => clearInterval(timer);
    }, [couponVisible, timeLeft]);
    
    const lockCoupon = async () => {
        await AsyncStorage.setItem(data.CouponCode+'couponLocked', JSON.stringify(true));
    };
    
    useEffect(()=>{
        logScreenViewEvent("VoucherPage","Vocuher");
        Tools.updateRatePoints(1);
        // AsyncStorage.removeItem('couponsData');
        // AsyncStorage.removeItem('couponData');
    },[]);
    useFocusEffect(
        React.useCallback(() => {
            onNavigatorEvent();
        }, [])
    );
    
    const onNavigatorEvent=()=> {
        if((Tools.IsNull(props.profile))){
            setshowLogin(true);
            // props.navigation.goBack();
        }
    }
    
    const refreshListView =()=> {
        setrefreshing(false);
        updateprofile= props.assignProfile;
        updateprofile("user","","");
        // fetchData().then(() => {
            //   setState({refreshing: false});
        // });
    }
    const refreshControl=()=>{
        
        return (
            <RefreshControl
            tintColor={Colors.blueColor}
            refreshing={refreshing}
            onRefresh={()=>refreshListView()} />
        )
    }
    
    
    
    const getallVouchers=()=>{
        alllines=[];
        // var profileCoupons=props.profile.Coupons;
        if(profileCoupons!=undefined&& profileCoupons.length>0){
            for(let t=0;t<profileCoupons.length;t++){
                var validFrom = UiElements.formatDate(profileCoupons[t].ValidFrom );
                var validTo = UiElements.formatDate(profileCoupons[t].ValidTo );
                var redeemDate = UiElements.formatDate(profileCoupons[t].RedeemDate );
                var redeemedIn=Tools.IsNull(profileCoupons[t].Redeemed)?false:profileCoupons[t].Redeemed;
                alllines.push(
                    <TouchableOpacity 
                    // disabled={redeemedIn}
                    onPress={()=>{
                        var tmpt=t;
                        var tempprofileCoupon=profileCoupons[tmpt];
                        onCouponClicked(tempprofileCoupon);
                    }}
                    style={[styles.voucherView,{ flexDirection:'row',justifyContent:'center',overflow:'visible'}]} key={t+'voucher'}>
                    {!Tools.stringIsContains(i18n.locale,"en")?  <View style={{flex:0.2}}>
                    <Image resizeMethod={'resize'} resizeMode={'stretch'} source={bCoupon} style={{tintColor:Colors.blueColor,width:widthPercentageToDP('18.25'),height:'100%',overflow:'visible',resizeMode:'stretch'}}/>
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.voucherCodeVertical}>{profileCoupons[t].CouponCode}</Text></View>:<></>}
                    <View style={{flex:0.8,borderWidth:0}}>
                    {/* <View style={{position:'absolute',justifyContent:'center',width:widthPercentageToDP('90'),height:heightPercentageToDP('13'),marginTop:10,marginRight:10,marginLeft:(!Tools.stringIsContains(i18n.locale,"en")? widthPercentageToDP('6'):0),flexDirection:'row'}}> */}
                    <Image source={fCoupon} style={{ tintColor:Colors.whiteColor, width:widthPercentageToDP('74'),height:'100%',overflow:'visible',resizeMode:'stretch'}}/>
                    <View style={{position:'absolute', flex:1,flexDirection:'row',marginTop:5,marginStart:0}}>
                    <View style={{height:'100%',alignSelf:'center'}}>
                    <View style={{justifyContent:'space-between',flexDirection:'row',borderWidth:0}}>
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.voucherViewtitle}>
                    {Tools.stringIsContains(i18n.locale,"en")?profileCoupons[t].TitleEn:profileCoupons[t].TitleAr}
                    </Text>
                    </View>
                    {!redeemedIn&&<View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={styles.voucherViewdata}>
                    {validFrom}
                    </Text>
                    
                    </View>}
                    {!redeemedIn&&<View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.voucherViewexpire]}>
                    {i18n.t('expires')}
                    </Text><Text allowFontScaling={false} style={[styles.voucherViewdata,{paddingStart:5}]}>
                    {validTo}
                    </Text></View> }
                    {redeemedIn&&<View>
                        <Text allowFontScaling={false} style={[styles.voucherViewexpire,{color:Colors.orangeColor}]}>{i18n.t('couponredeemed')}</Text>
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.voucherViewexpire]}>
                        
                        {i18n.t('redeemdate')}
                        </Text><Text allowFontScaling={false} style={[styles.voucherViewdata,{paddingStart:5}]}>
                        {redeemDate}
                        </Text></View></View> }
                        
                        </View></View>
                        </View>
                        {Tools.stringIsContains(i18n.locale,"en")? <View style={{flex:0.2}}>
                        <Image source={bCoupon} style={{tintColor:Colors.blueColor,marginLeft:'1%',width:widthPercentageToDP('18.25'),height:'100%',zIndex:-1,overflow:'visible',resizeMode:'stretch'}}/>
                        <Text allowFontScaling={false} numberOfLines={1} style={styles.voucherCodeVertical}>{profileCoupons[t].SystemCode}</Text>
                        {/* <BlurView
                            style={{position:'absolute',alignSelf:'center',bottom:0,width:'65%',height:'100%'}}
                            blurType="light"
                            blurAmount={4}
                            reducedTransparencyFallbackColor={Colors.transparent}/> */}
                            </View>:<></>}
                            
                            
                            </TouchableOpacity>
                        )
                    }
                }else{
                    alllines.push(<View>
                        <Text allowFontScaling={false} style={styles.simplelabel} >
                        {i18n.t('nocoupon')}
                        </Text>
                        </View>)
                    }
                    return alllines;
                }
                
                const styles = StyleSheet.create({
                    simplelabel: {
                        textAlign:'center',
                        fontSize: 15,
                        fontFamily:'Cairo-Bold',
                        color:Colors.inputfontColor,
                        fontFamily:'Cairo-Regular'
                    },
                    voucherView:{
                        opacity:0.9,
                        marginTop:5,
                        marginBottom:5,
                        marginStart:15,marginEnd:15,
                        height:130,
                    },
                    voucherViewtitle:{
                        paddingStart:25,
                        textAlign:'left',
                        color:Colors.inputfontColor,
                        fontFamily:'Cairo-Bold',
                        fontSize:18,
                        // lineHeight:25,
                        width:widthPercentageToDP('70')
                    },voucherViewdata:{
                        marginTop:'4%',
                        paddingStart:25,
                        textAlign:'left',
                        alignSelf:'flex-start',
                        fontWeight: '300',
                        color:Colors.inputfontColor,
                        fontFamily:'Cairo-Regular',
                        fontSize:widthPercentageToDP(4.5),
                        lineHeight:widthPercentageToDP(4.5)*1.5,
                    },voucherViewexpire:{
                        marginTop:'4%',
                        paddingStart:25,
                        textAlign:'left',
                        alignSelf:'flex-start',
                        color:Colors.inputfontColor,
                        fontFamily:'Cairo-Bold',
                        fontSize:widthPercentageToDP(4.5),
                        lineHeight:widthPercentageToDP(4.5)*1.5,
                        
                    },voucherCodeVertical:{
                        borderColor:Colors.whiteColor,
                        textAlign:'center',
                        alignSelf:'center',
                        borderRadius:10,
                        fontFamily:'Cairo-Bold',
                        color:Colors.whiteColor,
                        justifyContent:'center',textAlignVertical:'center',
                        fontSize:widthPercentageToDP(5),
                        transform: [
                            { rotate: '-90deg'},
                            {translateX:-(85/2)}
                        ],
                        width:130,
                        // height:heightPercentageToDP(4.5),
                        position:'absolute',overflow:'visible',
                    },detailstitle:{
                        textAlign:'center',
                        fontWeight: '200',
                        // marginTop:15,
                        marginBottom:15,
                        color:Colors.inputfontColor,
                        width:60,
                        fontFamily:'Cairo-Regular',
                        fontSize:widthPercentageToDP(4),
                        lineHeight:widthPercentageToDP(4)*1.5,
                        textTransform:'uppercase',
                    },
                    totalView:{
                        
                        marginTop:-1*heightPercentageToDP(3),
                        alignSelf:'center',
                        justifyContent:'center',
                        // shadowColor: "#000",
                        // shadowOffset: {
                        //     width: 2,
                        //     height: 4,
                        // },
                        // shadowOpacity: .6,
                        // shadowRadius: 10,
                        // elevation: 20,
                        height:heightPercentageToDP(72),
                        width:widthPercentageToDP(70),
                        borderRadius:30,
                        backgroundColor:'white'
                    },
                    backIcon:{
                        alignSelf:'center',
                        marginTop:20,
                        width:40,
                        height:40
                    },
                    
                    bgImage:{
                        position:'absolute',
                        alignSelf:'center',
                        width:'100%',
                        height:height,
                    },
                    homeView:{
                        margin:10,
                        justifyContent:'center',
                        height:height
                    },
                    
                    answers: {
                        fontSize: 20,
                        fontWeight: '700',
                        paddingBottom:5,
                        color:Colors.whiteColor,
                        fontFamily:'Cairo-Regular'
                    },claimBut:{
                        borderRadius:6,
                        alignSelf:'center',
                        width:12,
                        height:12,backgroundColor:Colors.blueColor
                    },
                    buttonText:{
                        fontFamily:'Cairo-Regular',
                        textAlign:'center',
                        color:Colors.whiteColor,
                        fontSize: widthPercentageToDP(4),
                        // lineHeight:15*1.5,
                        // textTransform:'uppercase'
                    },buttonView:{
                        position:'absolute',
                        bottom:'4%',
                        backgroundColor:Colors.blueColor,
                        borderRadius:heightPercentageToDP(4.75),alignSelf:'center',
                        width:widthPercentageToDP('35%'),justifyContent:'center'
                        ,height:heightPercentageToDP(4.75)
                    }, tagline:{
                        fontFamily:'Cairo-Bold',
                        // fontWeight:'bold',
                        fontSize:widthPercentageToDP(7),
                        alignSelf:'flex-start',
                        color:Colors.black,
                        
                    },storedesc:{
                        width:'90%',
                        textAlign:'left',
                        fontFamily:'Cairo-Regular',
                        fontSize:widthPercentageToDP(4),
                        lineHeight:widthPercentageToDP(4)*1.5,
                        flexWrap:'wrap',
                        alignSelf:'center',
                        marginBottom:'2%',
                        color:Colors.black,
                    }
                    
                });
                
                
                const getTodayDate = () => {
                    const today = new Date();
                    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
                };
                
                const OnDone=()=>{
                    setData(undefined);
                    // setNearCounter(false);
                    setcanViewCoupon(false);
                }
                
                const checkCouponLimit = async (eachVoucher) => {
                    try {
                        const today = getTodayDate();
                        const Cdata = await AsyncStorage.getItem('couponsData');
                        const currentCoupondata = await AsyncStorage.getItem(eachVoucher.CouponCode+'couponData');
                        if(!Cdata){
                            await AsyncStorage.setItem('couponsData', JSON.stringify({ date: today, count: 0 }));
                        }   
                        var couponData = Cdata ? JSON.parse(Cdata) : { date: today, count: 0 };
                        
                        if (couponData.date === today) {
                            if (couponData.count >= COUPON_LIMIT) {
                                Alert.alert("Limit Reached", "You have reached your daily coupon limit.");
                                return false;
                            } else {
                                var dataIn={};
                                dataIn.currentCoupondata=currentCoupondata;
                                dataIn.couponData=couponData;
                                dataIn.eachVoucher=eachVoucher;
                                setCurrentCouponData(dataIn);
                                // if(!currentCoupondata){
                                //     console.log("Adding "+currentCoupondata);
                                //     // Increment count and save it
                                //     couponData.count += 1;
                                //     await AsyncStorage.setItem('couponsData', JSON.stringify(couponData));
                                //     await AsyncStorage.setItem(eachVoucher.CouponCode+'couponData', "in");
                                // }
                                return true;
                            }
                        } else {
                            // Reset count for a new day
                            await AsyncStorage.setItem('couponsData', JSON.stringify({ date: today, count: 1 }));
                            return true;
                        }
                    } catch (error) {
                        console.error("Failed to check coupon limit", error);
                        return false;
                    }
                };
                
                const openCoupon = async (eachVoucher) => {
                    // AsyncStorage.removeItem(eachVoucher.CouponCode+'couponLocked');
                    const canView = await checkCouponLimit(eachVoucher);
                    if(Tools.IsNull(eachVoucher)){
                        return false;
                    }
                    const couponLocked = JSON.parse(await AsyncStorage.getItem(eachVoucher.CouponCode+'couponLocked'));
                    
                    if (canView && !couponLocked) {
                        setCouponVisible(true);
                        setTimeLeft(VIEW_DURATION / 1000); // Reset timer
                        return true;
                    } else if (couponLocked) {
                        Alert.alert("Coupon Locked", "This coupon is locked. Please try again later.");
                        return false;
                    }
                };
                
                const OnDone_AddVoucher=(_State)=>{
                    setAddVoucher(false);
                    if(_State){
                        setTimeout(()=>{
                            updateprofile= props.assignProfile;
                            updateprofile("user","","");
                        },1000);
                    }
                }
                const OnCounterDone=async(_code,_state)=>{
                    console.log('OnCounterDone'+_state);
                    // setNearCounter(false);
                    if(!_state){
                        setData(undefined);
                    }else{
                        const Cdata = await AsyncStorage.getItem('couponsData');
                        console.log("couponsData :"+JSON.stringify(Cdata));
                        // Increment count and save it
                        Cdata.count += 1;
                        await AsyncStorage.setItem('couponsData', JSON.stringify(Cdata));
                        await AsyncStorage.setItem(curCouponCode.eachVoucher.CouponCode+'couponData', "in");
                        setcanViewCoupon(true);
                    }
                    // else{
                    //     const canView = await openCoupon();
                    //     setcanViewCoupon(canView);
                    // }
                }
                
                const onCouponClicked=(t)=>{
                    var eachVoucher=t;
                    // console.log(JSON.stringify(eachVoucher));
                    setData(eachVoucher);
                    setcanViewCoupon(true);
                    // const canView = await openCoupon(eachVoucher);
                    // console.log('canView'+canView);
                    // if(canView){
                    //     setData(eachVoucher);
                    //     setcanViewCoupon(true);
                    //     // setNearCounter(true);
                    // }
                }
                
                const handleDismiss= (_memeberID) =>{
                    // console.log("is done "+_memeberID);
                    if(!_memeberID)
                        props.navigation.goBack();
                    setshowLogin(false);
                }
                return (
                    <View style={{flex:1,backgroundColor:Colors.bgColor}}>
                    <BackgroundWall/>
                    <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
                    <TouchableOpacity style={{ marginTop:heightPercentageToDP(1),marginRight:20,marginLeft:20}} onPress={()=>{props.navigation.goBack()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    <View style={{width:'90%',alignSelf:'center'}}>
                    <Text allowFontScaling={false} style={[styles.tagline,{}]}>
                    {i18n.t('voucher')}
                    </Text></View>
                    {/* <HeaderLogo logo={1} /> */}
                    {UiElements.drawGap(5)}
                    
                    {/* <Image source={bgred} style={{transform: [
                        { scaleX: Tools.stringIsContains(i18n.locale,'ar')? -1:1 }
                        ],position:'absolute',top:heightPercentageToDP('50%'),opacity:1}}/> */}
                        <View style={{height:'84%',width:width}}>
                        <View style={{height:'100%',overflow:'hidden'}}>
                        <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("couponshortdesc")}</Text>
                        <Text allowFontScaling={false}  style={styles.storedesc}>{i18n.t("coupondesc")}</Text>
                        <ScrollView style={{flex:1}} 
                        contentContainerStyle={{paddingBottom:'10%'}}
                        refreshControl={refreshControl()}>
                        {getallVouchers()}
                        </ScrollView> 
                        {/* <NavigationEvents onDidFocus={onNavigatorEvent}/> */}
                        {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}  onDismiss={handleDismiss} />)}
                        </View>
                        {UiElements.drawGap(10)}
                        
                        <TouchableOpacity style={styles.buttonView}
                        onPress={()=>{
                            setAddVoucher(true);
                        }} >
                        <Text style ={styles.buttonText} allowFontScaling ={false}>{i18n.t('addcoupon')} </Text></TouchableOpacity>
                        
                        </View>
                        {data!==undefined&&(<EachVoucher assignProfile={props.assignProfile} onDone={OnDone} dataIn={data} accessToken={props.accessToken}/>)}
                        {addVoucher&&(<AddVoucher assignProfile={props.assignProfile}  accessToken={props.accessToken} profile={props.profile} onDone={OnDone_AddVoucher}/>)}
                        {/* {nearCounter&&(<PopUpModal title={i18n.t('areyounearcounter')} onDone={OnCounterDone}/>)} */}
                        </SafeAreaView>
                        </View>
                    )
                }
                