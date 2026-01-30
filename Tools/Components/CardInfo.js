import React, { useEffect, useState } from 'react';
import { RefreshControl,StyleSheet, View,Text,Image,Alert,Animated,Easing, TouchableOpacity,PixelRatio,TouchableHighlight,ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import cardbg from '../../assets/card/cardde.png';
// import cardbgB from '../../assets/card/carddeb.png';
// import Barcode from 'react-native-barcode-builder';
import * as tools from '../Components/Tools';
import WebServices from '../constants/WebServices';
import moment from'moment'
import backButton from '../../assets/Icons/back.png'
import warnIcon from '../../assets/Icons/warn.png'
// import cardbg1 from '../../assets/card.png';
import SecureStore from '../../Tools/Components/SecureStore';

// import { NavigationEvents } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';

import * as UIElements from './UIElements'
// import Colors from '../constants/Colors';

import myinfoIcon from '../../assets/Icons/profileone.png'
import signoutIcon from '../../assets/Icons/signout.png'
import couponIcon from '../../assets/Icons/couponlogoun.png'
import claimIcon from '../../assets/Icons/claim.png' 
import redeemIcon from '../../assets/Icons/rewardpoint.png' 
import settingsIcon from '../../assets/Icons/settings.png' 
import passIcon from '../../assets/Icons/changePass.png' 
import MarqueeLine from './MarqueeLine';
import { useTheme } from '../context/ThemeProvider';
import FastImage from '@d11/react-native-fast-image';
import { useRef } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import Barcode from './Barcode';


// let oneView = new Animated.Value(0); // declare an animated value
// let twoView = new Animated.Value(1); // declare an animated value
export default function CardInfo(props){
    const Colors =useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [calcImgHeight, setCalcImgHeight] = useState(1);
    const [setImage, setSetImage] = useState(0);
    const [zindexTarget, setZindexTarget] = useState(1);
    const [setupT, setSetupT] = useState(1);
    const [refreshing,setRefreshing]=useState(false);

    // Use Refs for values that require animations or need to be managed by refs
    const oneView = useRef(new Animated.Value(1));
    const twoView = useRef(new Animated.Value(0));
    const nameMove = useRef(new Animated.Value(0));
    const heightMove = useRef(new Animated.Value(1));
    
    useEffect(()=>{
        keepUpdating();
        // console.log(props.cardData);
    },[]);
    const keepUpdating=()=>{
        setTimeout(()=>{
            setCurrentTime(new Date());
            keepUpdating();
        },1000)
    }
    const refreshListView=()=>{
        setRefreshing(false);
        updateprofile= props.assignProfile;
        updateprofile("user","","");
   
    }
    const refreshControl=()=>{
        return (
            <RefreshControl
            tintColor={Colors.tealGreen}
            refreshing={refreshing}
            onRefresh={()=>refreshListView()} />
            )
        }
        
        
        
        const cardFormatting=(cardNo)=>{
            let cardFormatNo='';
            let n=0;
            for(let t=0;t<cardNo.length;t++){
                if(n==4){
                    cardFormatNo+='  ';
                    n=0;
                }
                cardFormatNo+=cardNo[t];
                n=n+1;
            }
            return cardFormatNo;
        }
        
        const SignOut=()=>{
            SecureStore.setItemAsync('loginRequested','N');
            var assignSignout  =   props.assignProfile;
            assignSignout('','','');
            props.navigation.navigate('Homescreen',{
                navigation:props.navigation,
            })
        }
        
        const switchTo=(startV,endV,fromV,toV)=>{
            if(props.colorIn!=='red')
            return;
            
            Animated.timing(startV==1?oneView:twoView,{
                toValue:fromV,
                duration:250,
                easing: Easing.quad,
                useNativeDriver:false
            }).start();
            
            Animated.timing(nameMove,{
                toValue:(startV==1)?1:0,
                duration:250, easing: Easing.quad,
                useNativeDriver:false
            }).start();
            
            Animated.timing(heightMove,{
                toValue:(startV==1)?0:1,
                duration:250, easing: Easing.quad,
                useNativeDriver:false
            }).start();
            
            
            
            Animated.timing(endV==2?twoView:oneView,{
                toValue:toV,
                duration:250,easing: Easing.quad,
                useNativeDriver:false
            }).start();
            
            // console.log(startV,endV,fromV,toV);
            setZindexTarget(endV);
        }
        
        const renderOrder=(orderNo)=>{
            let titlesize=21;
            if(orderNo==1){
                // console.log(zindexTarget+" - 1 : "+orderNo);
                return(
                    <View style={{marginBottom:widthPercentageToDP(2)}}>
                    {<View style={{flexDirection:'column',justifyContent:'flex-start',width:'100%',alignSelf:'center'}}>
                    <Text style ={[styles.heading,{textTransform:'uppercase',fontSize:widthPercentageToDP(4),lineHeight:widthPercentageToDP(4)*1.5,textAlign:'left',alignSelf:'center'}]} numberOfLines={5} allowFontScaling ={false}>{i18n.t('yourbalance')}</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,]}>{props.cardData.Points} {i18n.t('points')}</Text>
                    </View>}
                    
                    </View>
                    );
                }
                else if(orderNo==2) {
                    // console.log(zindexTarget+" - 2 : "+orderNo);
                    return(
                        <View style={[styles.totalView,{
                            zIndex:zindexTarget==1?-100:999,
                            // elevation:zindexTarget==1?-100:999,
                            // position:zindexTarget==1?'relative':'absolute',
                            
                        }]}>
                        
                        
                        <Animated.View style={[styles.totalView,{
                            
                            borderTopRightRadius:30,
                            borderTopLeftRadius:30,
                            borderBottomEndRadius:0,
                            borderBottomStartRadius:0,
                            // elevation: 0,
                            backgroundColor:Colors.transparent,
                            opacity:twoView,
                        }]}>
                        
                        <View style={{flex:0.37}}>
                        
                        
                        </View>
                        
                        
                        <View style={{flex:0.6, overflow:'visible'}}>
                        {UIElements.drawGap(hp('1%'))}
                        <View style={{flexDirection:'row',overflow:'visible'}}>
                        <View style={{flex:0.33,overflow:'visible'}}>
                        <TouchableOpacity 
                        onPress={()=>{props.navigation.navigate('Accountscreen',{screen:'AccountEdit'})}}
                        style={{
                            width:wp(titlesize),height:wp(titlesize),backgroundColor:Colors.yellowColor,borderRadius:15}}>
                            <Image source={myinfoIcon} style={styles.profileIcon}/>
                            <Text  numberOfLines={2} allowFontScaling={false} style={styles.profileTxt}>{i18n.t('myinfo')}</Text>
                            </TouchableOpacity>
                            {UIElements.drawGap(hp('1%'))}
                            <TouchableOpacity
                            onPress={() =>
                                props.navigation.navigate('Accountscreen',{screen:'Redeem',
                                otherParam: 'Redeem Points',backParam: i18n.t('myaccount') ,pagefrom:'account',profile:props.cardData,redeem:props.redeem,redeemPoint:props.redeemPoint,redeemProfile:props.redeemProfile
                            })}
                            style={[{
                                width:wp(titlesize),height:wp(titlesize),backgroundColor:Colors.orangeShadeColor,borderRadius:15},
                            ]}>
                            <Image source={redeemIcon} style={styles.profileIcon}/>
                            <Text numberOfLines={2} allowFontScaling={false} style={[styles.profileTxt]}>{i18n.t('redeem')}</Text>
                            </TouchableOpacity>
                            
                            </View>
                            {UIElements.drawRGap(hp('1%'))}
                            <View style={{flex:0.66,overflow:'visible'}}>
                            <TouchableOpacity
                            onPress={() =>
                                props.navigation.navigate('Accountscreen',{screen:'claims',
                                otherParam: i18n.t('claimpoints'),backParam: i18n.t('myaccount'), pagefrom:'account'
                            })}
                            style={{
                                width:wp(45),height:wp(44),backgroundColor:Colors.orangeColor,borderRadius:15}}>
                                <Image source={claimIcon} style={[styles.profileIcon,{flex:0.85,width:60,height:60}]}/>
                                <Text allowFontScaling={false} style={[styles.profileTxt,{fontSize:16,lineHeight:16*1.3}]}>{i18n.t('claimpoint')}</Text>
                                </TouchableOpacity>
                                </View>
                                </View>
                                {UIElements.drawGap(hp('1%'))}
                                
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                
                                <TouchableOpacity style={{
                                    width:wp(titlesize),height:wp(titlesize),backgroundColor:Colors.orangeColor,borderRadius:15}}
                                    onPress={() =>{
                                        props.navigation.navigate('Accountscreen',{screen:'Settings',
                                        otherParam: (i18n.t('changepass')),backParam:i18n.t('myaccount') 
                                    })
                                    
                                }}
                                >
                                <Image source={settingsIcon} style={styles.profileIcon}/>
                                <Text allowFontScaling={false} style={styles.profileTxt}>{i18n.t('settings')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                onPress={() =>
                                    {
                                        // Linking.openURL(WebServices.resetPass);
                                        Alert.alert(i18n.t('changepasssure'),"",[
                                            {
                                                text:i18n.t('yes'),
                                                onPress:()=>{
                                                    var submitRequest=props.submitChangePassRequest;
                                                    submitRequest();
                                                }
                                            },
                                            {
                                                text:i18n.t('no'),
                                                onPress:()=>{
                                                }
                                            }
                                        ])
                                    }}
                                    style={{
                                        width:wp(titlesize),height:wp(titlesize),backgroundColor:Colors.orangeColor,borderRadius:15}}>
                                        
                                        <Image source={passIcon} style={styles.profileIcon}/>
                                        <Text numberOfLines={2} allowFontScaling={false} style={[styles.profileTxt]}>{i18n.t('changepass')}</Text>
                                        
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() =>
                                            props.navigation.navigate('Accountscreen',{screen:'Coupon'
                                            // otherParam: (i18n.t('changepass')),backParam:i18n.t('myaccount') 
                                        })} style={{
                                            width:wp(titlesize),height:wp(titlesize),backgroundColor:Colors.yellowShadeColor,borderRadius:15}}>
                                            <Image source={couponIcon} style={styles.profileIcon}/>
                                            <Text allowFontScaling={false} style={styles.profileTxt}>{i18n.t('coupon')}</Text>
                                            </TouchableOpacity>
                                            </View>
                                            
                                            </View>
                                            <TouchableOpacity style={{
                                                zIndex:100,position:'absolute',bottom:0,alignSelf:'center',
                                                marginTop:heightPercentageToDP(6),marginRight:20,marginLeft:20}} 
                                                onPress={()=>{switchTo(2,1,0,1)}}>
                                                <Image style={{tintColor:Colors.orangeShadeColor,width:35,height:35,transform:[{scaleX:tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                                                </TouchableOpacity>
                                                </Animated.View></View>
                                                );
                                            }
                                        }
                                        const getCard=()=>{
                                            // const widthVal=nameMove.interpolate({inputRange:[0,1],outputRange:[wp(55),wp(55)]});
                                            // const heightVal=heightMove.interpolate({inputRange:[0,1],outputRange:[hp(20),hp(25)]});
                                            
                                            const animVal={
                                                // width:wp((30+(nameMove.interpolate({inputRange:[0,1],outputRange:[0,1]})*25.5))),
                                                // borderWidth:2,
                                                textTransform:'uppercase',textAlign:'left',lineHeight:hp('3.5%')*1.25,fontFamily:'Cairo-Bold'
                                            }
                                            
                                            const animHeight={
                                                // height:hp(25),
                                            }
                                            
                                            
                                            return(
                                                <View style={{}}>
                                                {/* {(zindexTarget==1)&&renderOrder(2)}
                                                {(zindexTarget==1)&&renderOrder(1)}
                                                {(zindexTarget==2)&&renderOrder(1)}
                                            {(zindexTarget==2)&&renderOrder(2)} */}
                                            
                                            <View style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(7.5),overflow:'hidden'}}>
                                            <View
                                            underlayColor={Colors.whiteColor}
                                            // onPress={()=>{switchTo(2,1,0,1)}}
                                            style={[styles.bottompart,{
                                                borderRadius:40,
                                                height:wp(93)/calcImgHeight,
                                                zIndex:zindexTarget==1?-1: 999,
                                                backgroundColor:setImage==1?Colors.whiteColor:props.cardData.TierInfo.Current_TierTheme.Background
                                            }]}>
                                            <FastImage
                                            style={{width:wp(93),
                                                height:wp(93)/calcImgHeight,top:0,
                                                position:'absolute',alignSelf:'center'}}
                                                source={{uri:props.cardData.TierInfo.Current_TierTheme.Banner,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                onLoad={evt =>
                                                 {   setSetImage(1);
                                                    setCalcImgHeight(evt.nativeEvent.width / evt.nativeEvent.height);
                                                }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <View style={[{},animHeight]}>
                                                    <>
                                                    {/* {UIElements.drawGap(hp(1.65))} */}
                                                    <View style={{alignSelf:'center',alignItems:'flex-start',width:'90%'}}>
                                                    <Text allowFontScaling={false} ellipsizeMode='clip' numberOfLines={1} style ={[styles.heading,animVal,{color:Colors.blackAlways}]} allowFontScaling={false}>{props.cardData.FirstName}</Text>
                                                    {/* <Animated.Text allowFontScaling={false} ellipsizeMode='clip' numberOfLines={1} style ={[styles.heading,animVal]} allowFontScaling ={false}>{props.cardData.LastName}</Animated.Text> */}
                                                    {/* {UIElements.drawGap(hp('.5%'))} */}
                                                    {/* {UIElements.drawGap(heightPercentageToDP(1))} */}
                                                    {/* <Animated.View style={{opacity:nameMove,flexDirection:'row',alignSelf:'flex-start'}}>
                                                    <Animated.Text style ={[styles.value,{opacity:nameMove}]} allowFontScaling ={false}>{i18n.t('yourbalance')} </Animated.Text>
                                                    <Animated.Text allowFontScaling ={false} style={[styles.value,{opacity:nameMove,paddingStart:10,fontFamily:'Cairo-Bold'}]}>{props.cardData.Points}</Animated.Text>
                                                </Animated.View> */}
                                                <Text style ={styles.value} allowFontScaling ={false}>{i18n.t('membership')} </Text>
                                                <Text style ={[styles.cardNo,{fontFamily:'Cairo-Bold'}]} allowFontScaling ={false}>{cardFormatting(props.cardData.CardNo)} </Text>
                                                <View style={{width:wp(65),alignSelf:'center',bottom:'3%',paddingTop:widthPercentageToDP(2),paddingBottom:20,marginTop:widthPercentageToDP(2)}}>
                                                {/* {props.colorIn=='red'&& */}
                                                <View style={{width:'100%',backgroundColor:'white',borderRadius:15,overflow:'hidden',padding:(2)}}>
                                                <Barcode value={props.cardData.CardNo} 
                                                viewStyle={{marginTop:heightPercentageToDP(1),marginBottom:heightPercentageToDP(1)}} width={widthPercentageToDP('.32%')} height={hp('4.5%')}
                                                format="CODE128" />
                                                <Text allowFontScaling={false} style ={styles.barCodeValue}>{cardFormatting(props.cardData.CardNo)}</Text>
                                                </View>
                                                <MarqueeLine bgColor={props.colorIn=='red'?Colors.whiteColor:Colors.whiteColor} style={{width:widthPercentageToDP(65),marginTop:widthPercentageToDP(2)}}/>
                                                <Text allowFontScaling={false} style ={styles.barCodeValue}>{moment(currentTime).format('DD-MM-YYYY hh:mm:ss')}</Text>
                                                {/* } */}
                                                {/* {props.colorIn!='red'&&<View style={{position:'absolute',bottom:20,width:wp('70%'),justifyContent:'center'}} >
                                                <Barcode value={props.cardData.CardNo} 
                                                width={wp('.5%')} height={hp('4%')}
                                                format="CODE128" />
                                                <Text style ={styles.barCodeValue}>{cardFormatting(props.cardData.CardNo)}</Text>
                                            </View>} */}
                                            </View>
                                            </View></>
                                            </View>
                                            </View>
                                            {UIElements.drawGap(widthPercentageToDP(2))}
                                            {renderOrder(1)}
                                            <View style={{width:'90%',
                                            backgroundColor:props.cardData.TierInfo.Current_TierTheme!=undefined?props.cardData.TierInfo.Current_TierTheme.Foreground:Colors.bgColor,
                                            
                                            alignSelf:'center',borderRadius:widthPercentageToDP(4.5),paddingVertical:widthPercentageToDP(2)}}>
                                            {<View style={{flexDirection:'column',justifyContent:'flex-start',width:'85%',alignSelf:'center'}}>
                                            <Text style ={[styles.heading,{textTransform:'uppercase',fontSize:widthPercentageToDP(3),lineHeight:widthPercentageToDP(3)*1.3,textAlign:'left',alignSelf:'center',color:Colors.blackAlways}]} numberOfLines={1} allowFontScaling ={false}>{i18n.t('yourtier')}</Text>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,{color:Colors.blackAlways, fontFamily:'Cairo-Bold',textTransform:'uppercase'}]}>{tools.stringIsContains(i18n.locale,'ar')?props.cardData.TierInfo.Current_TierNameAr:props.cardData.TierInfo.Current_TierNameEn}</Text>
                                            {props.cardData.TierInfo!=undefined&&<><View style={{flexDirection:'row',marginTop:heightPercentageToDP(.1)}}>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,{color:Colors.blackAlways, fontSize:widthPercentageToDP(3),alignSelf:'flex-start'}]}>{i18n.t('tier')+' : '}</Text>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,{color:Colors.blackAlways, fontSize:widthPercentageToDP(3),fontFamily:'Cairo-SemiBold',alignSelf:'flex-start',textTransform:'uppercase'}]}>{tools.stringIsContains(i18n.locale,'ar')?props.cardData.TierInfo.Current_TierNameAr:props.cardData.TierInfo.Current_TierNameEn}</Text>
                                            </View>
                                            <View style={{width:'98%',alignSelf:'center',backgroundColor:props.cardData.TierInfo.Next_TierTheme!=undefined?props.cardData.TierInfo.Next_TierTheme.Background:Colors.blueColor,height:heightPercentageToDP(1.5),marginBottom:widthPercentageToDP(2)
                                            ,borderRadius:heightPercentageToDP(1.5)}}>
                                            <View style={{width:(((props.cardData.Points)/props.cardData.TierInfo.Next_TierMin)*100)+"%",backgroundColor:tools.darkenColor(props.cardData.TierInfo.Current_TierTheme.Background,0.1),height:heightPercentageToDP(1.5),alignSelf:'flex-start',
                                            borderRadius:heightPercentageToDP(1.5)}}>
                                            </View>
                                            </View>
                                            {props.cardData.TierInfo.Next_TierTheme!=undefined&&<View style={{flexDirection:'row',alignSelf:'flex-end'}}>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints,{color:Colors.blackAlways, fontFamily:'Cairo-Bold',marginEnd:widthPercentageToDP(.7)}]}>{props.cardData.TierInfo.Next_TierMin-props.cardData.Points}</Text>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints,{color:Colors.blackAlways, marginEnd:widthPercentageToDP(0.7)}]}>{i18n.t('pointsto')} </Text>
                                            <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints,{color:Colors.blackAlways, fontFamily:'Cairo-Bold'}]}>{tools.stringIsContains(i18n.locale,'ar')?props.cardData.TierInfo.Next_TierNameAr:props.cardData.TierInfo.Next_TierNameEn} {i18n.t('tier')}</Text>
                                            </View>}
                                            </>}
                                            </View>}
                                            </View>
                                            {props.cardData.ExpiringSoon!=undefined&&props.cardData.ExpiringSoon.Points>0&&
                                                <View style={{width:'100%',marginTop:heightPercentageToDP(2)}}>
                                                <Image
                                                resizeMode='contain'
                                                style={{width:widthPercentageToDP(10),height:widthPercentageToDP(10),alignSelf:'center',tintColor:Colors.blueColor}}
                                                source={warnIcon} />
                                                <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints,{fontFamily:'Cairo-Bold'}]}>{props.cardData.ExpiringSoon.Points} </Text>
                                                <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints]}>{i18n.t('points')} </Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignSelf:'center'}}>
                                                <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints,{fontFamily:'Cairo-Bold'}]}>{i18n.t('isexpiringon')} </Text>
                                                <Text numberOfLines={1} allowFontScaling={false} style ={[styles.points,styles.smallPoints]}>{props.cardData.ExpiringSoon.ExpireDate} </Text>
                                                </View>
                                                </View>
                                                
                                            }
                                            {UIElements.drawGap(widthPercentageToDP(5))}
                                            </View>
                                            </View>);
                                        }
                                        
                                        const styles = StyleSheet.create({
                                            smallPoints:{
                                                includeFontPadding:false,
                                                fontSize:widthPercentageToDP(3),lineHeight:widthPercentageToDP(3)*1.4,alignSelf:'flex-start'
                                            },
                                            barCodeValue:{
                                                includeFontPadding:false,
                                                marginTop:-widthPercentageToDP(1),
                                                textAlign:'center',
                                                fontFamily:'Cairo-Bold',
                                                fontSize:12,
                                                lineHeight:12*1.3
                                                // height: AdaptiveWidth(22)* 1.3,
                                            },
                                            bottompart:{
                                                width:wp(93),
                                                // height:wp(93)/1.5,
                                                padding: 15,
                                                // borderRadius:widthPercentageToDP(3),
                                            },
                                            totalView:{
                                                alignSelf:'center',
                                                height:'70%',///PixelRatio.get(),
                                                width:'100%',
                                                borderBottomEndRadius:30,
                                                borderBottomStartRadius:30,
                                                // borderWidth:1,
                                                
                                                // backgroundColor:'white'
                                            },
                                            
                                            bgcard:{
                                                position:'absolute',
                                                resizeMode:'contain',
                                                alignSelf:'center',
                                                // aspectRatio:1417/895,
                                                // width:wp('99%'),
                                                width:wp('70%'),
                                                // left:0,
                                                overflow:'hidden',
                                                // bottom:widthPercentageToDP(55)
                                            },
                                            heading: {
                                                includeFontPadding:false,
                                                fontFamily:'Cairo-SemiBold',
                                                fontSize:hp(2.5),
                                                lineHeight:hp(2.5)*1.35,
                                                flexWrap:'nowrap',
                                                // textAlign:'center',
                                                color:Colors.tealDark,
                                            },
                                            points: {
                                                includeFontPadding:false,
                                                color:Colors.black,
                                                fontFamily:'Cairo-Regular',
                                                fontSize: hp(2),
                                                lineHeight: hp(2)*1.5,
                                                alignSelf:'center',
                                                textAlign:'center'
                                                
                                            },
                                            value: {
                                                includeFontPadding:false,
                                                fontFamily:'Cairo-Regular',
                                                alignSelf:'flex-start',
                                                color:Colors.blackAlways,
                                                textTransform:'uppercase',
                                                fontSize: hp('1.85%'),
                                                lineHeight:  hp('1.85%')*1.45,
                                            },
                                            txtbutton:{
                                                includeFontPadding:false,
                                                fontFamily:'Cairo-Regular',
                                                textAlign:'center',
                                                paddingTop:5,
                                                color:Colors.orangeColor,
                                                // fontSize:AdaptiveWidth(25),
                                                // lineHeight: AdaptiveWidth(25) * 1.6,
                                                // height: AdaptiveWidth(25)* 1.2,
                                                fontSize: 15,
                                                lineHeight:15*1.5,
                                                textTransform:'uppercase'
                                            },
                                            cardNo: {
                                                includeFontPadding:false,
                                                fontFamily:'Cairo-Regular',
                                                // fontSize:AdaptiveWidth(11.8),
                                                fontSize: hp('2.5%'),
                                                lineHeight:  hp('2.5%')*1.35,
                                                textAlign:'left',
                                                color:Colors.blackAlways,
                                                
                                                // lineHeight: AdaptiveWidth(12) * 1.6,
                                                // height: AdaptiveWidth(12)* 1.2,
                                            }, profileTxt:{
                                                includeFontPadding:false,
                                                marginTop:-5,
                                                flex:0.4,
                                                fontFamily:'Cairo-Regular',
                                                fontWeight:'100',
                                                color:Colors.inputfontColor,
                                                fontSize:13,
                                                lineHeight:17,
                                                textAlign:'center',
                                                width:70,
                                                alignSelf:'center',
                                                flexWrap:'wrap',
                                                textTransform:'uppercase'
                                            },
                                            profileIcon:{
                                                
                                                marginTop:0,
                                                flex:0.6,
                                                alignSelf:'center',
                                                resizeMode:'center',
                                                overflow:'visible',
                                                resizeMode:'contain',
                                                width:30,
                                                height:30,
                                            },
                                        });
                                        // console.log(oneView._value+"T :"+twoView._value);
                                        return (
                                            <View style={{}}>
                                            <ScrollView
                                            style={{}}
                                            contentContainerStyle={{}}
                                            showsVerticalScrollIndicator={false} 
                                            // style={{height:'100%',overflow:'visible'}}
                                            refreshControl={refreshControl()}>
                                            {setupT===1&& getCard()}
                                            </ScrollView>
                                            </View>
                                            );
                                            
                                        }
                                        
                                        
                                        
                                        
                                        