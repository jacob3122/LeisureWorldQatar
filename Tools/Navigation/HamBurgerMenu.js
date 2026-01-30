import React, { Component, useContext, useEffect, useReducer, useState } from 'react';
import { Children } from 'react';
import { Alert, Appearance, AppState, DeviceEventEmitter, Linking, Platform, StyleSheet,View } from 'react-native';
// import Colors from '../constants/Colors';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { Text,Animated,Image,SafeAreaView } from 'react-native';
import burgerIcon from '../../assets/Icons/burger.png' 
import leisureIcon from '../../assets/Icons/greylogo.png' 
import uxpIcon from '../../assets/Icons/UXP.png' 
import signoffButton from '../../assets/Icons/signoff.png'
import { TouchableOpacity } from 'react-native';
import { Easing } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import ProfileInHam from '../Components/ProfileInHam';
import * as Tools from '../Components/Tools';
// import I18n from 'i18n-js';
import { connect } from 'react-redux';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { useTheme } from '../context/ThemeProvider';
import { StatusBar } from 'react-native';
import WebServices from '../constants/WebServices';
import OpenAuthenticate from '../Components/OpenAuthenticate';
import { StateContext } from '../context/ContextState';
import AppReducer, { initialState, useAppContext } from '../../src/js/reducers/AppReducer';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
import { BlurView } from '@react-native-community/blur';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
const i18n = new I18n(translations);
export default function HamBurgerMenu(props){
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const Colors=useTheme();
    const {referralCode, setReferralCode} = useContext(StateContext);
    //     return <HamBurgerMenuC {...props} setReferralCode={setReferralCode} Colors={colors}/>
    // }
    // class HamBurgerMenuC extends Component {
    const [appState,setAppState]=useState(AppState.currentState);
    const [alertShow,setAlertShow]=useState(false);
    const [showRegister,setShowRegister]=useState(false);
    const [showLogin,setShowLogin]=useState(false);
    const [translateXIn,setTranslateXIn]=useState(new Animated.Value(0));
    const [hamView,sethamView]=useState(0);
    const [routeNameIn,setrouteNameIn]=useState('');
    const [showHam,setshowHam]=useState(true);
    
    useEffect(()=>{
        i18n.locale=global.locale;
        closeHamBurger();
    },[global.locale])
    
    openHamBurger=()=>{
        console.log("openHamBurger");
        Animated.timing(translateXIn,{
            toValue:1,
            duration:250, easing: Easing.quad,
            useNativeDriver:true
        }).start(()=>{
            sethamView(1);
            setTimeout(() => {
                sethamView(2);
            }, 500);
        });
        
        
    }
    
    useEffect(()=>{
        // console.log(showRegister+"HamBurgerMenu :"+referralCode);

        AppState.addEventListener('change', _handleAppStateChange);
        return()=>{
            // AppState.removeEventListener('change', _handleAppStateChange);
        }
    },[])
    useEffect(()=>{
        // console.log(showRegister+"HamBurgerMenu :"+referralCode);
        if(!showRegister&&(!Tools.stringIsEmpty(referralCode))&&!global.showRegister){
            if(!Tools.stringIsEmpty(referralCode)&&Tools.IsNull(state.profile)){
                setShowRegister(true);
            }else if(alertShow&&!Tools.stringIsEmpty(referralCode)){
                // var refer=props.referralCode;
                setAlertShow(true);
                
            }
        }else if(!alertShow&&!Tools.IsNull(state.profile)&&!Tools.IsNull(state.profile.Id)&&!Tools.stringIsEmpty(referralCode)){
            setAlertShow(true);
           
        }
    },[referralCode])

    useEffect(()=>{
        if(alertShow){
            Alert.alert(i18n.t("referonlyonRegister"));
        }
    },[alertShow])
  
    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
            ) {
                if(!Tools.stringIsEmpty(referralCode)&&Tools.IsNull(state.profile.Id)){
                    showRegister(true);
                }
            }
            setAppState(nextAppState);
        };
        const menuVisible=()=>{
            console.log("menuVisible :"+hamView);
            if(hamView!=0){
                closeHamBurger();
            }else{
                openHamBurger();
            }
        }
        
        const closeHamBurger=()=>{
            console.log(i18n.locale+"Close :"+(Tools.stringIsContains(i18n.locale,"ar")?1:-1));
            Animated.timing(translateXIn,{
                toValue:(Tools.stringIsContains(i18n.locale,"en")?-2:2),
                duration:250, easing: Easing.quad,
                useNativeDriver:true
            }).start(()=>{
               sethamView(0)
            });
            
        }
        
        const OpenMenu=(menuTo)=>{
            console.log(JSON.stringify(menuTo));
            closeHamBurger();
            if(menuTo!=undefined&&menuTo.Navigation.NavType=='view'){
                props.navigation.navigate(getAppNames(menuTo.Navigation.NavURL),getScreen(menuTo.Navigation.NavParameter));
            }
        }
        getAppNames=(_code)=>{
            if(_code=='home'||_code=='events'){
                return 'Homescreen'
            }else if(_code=='wallet'){
                return 'Walletscreen'
            }else if(_code=='rewards'){
                return 'Cardscreen'
            }else if(_code=='partners'){
                return 'Parkscreen'
            }else if(_code=='store'){
                return 'Storescreen'
            }
            
        }
        getScreenName=(_code)=>{
            return _code;
            
        }
        getScreen=(_code)=>{
            if(!Tools.stringIsEmpty(_code)){
                return {screen:getScreenName(_code)}
            }else{
                return {}
            }
        }
            const styles = StyleSheet.create({
                profileIcon:{
                    marginStart:widthPercentageToDP(4),
                    tintColor:Colors.blueColor,
                    alignSelf:'flex-start',
                    overflow:'visible',
                    resizeMode:'contain',
                    width:24,
                    height:26,
                },
                textTitle:{
                    fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(5),
                    padding:heightPercentageToDP(2),
                    color:Colors.whiteColor
                },
                sideMenu:{
                    position:'absolute',
                    width:widthPercentageToDP(65),
                    height:'100%',
                    backgroundColor:Colors.blueColor,
                    borderTopRightRadius:widthPercentageToDP(9),
                    borderBottomRightRadius:widthPercentageToDP(9)
                },
                mainView:{
                    width:'100%',height:'100%'
                },
                childView:{width:'100%',height:'100%',position:'absolute',alignSelf:'center'}
            })
            const insets = useSafeAreaInsets();
            const translateXVal=translateXIn.interpolate({inputRange:[0,1],outputRange:[(Tools.stringIsContains(I18n.locale,"ar")?1:-1)* widthPercentageToDP(65),0]});
            return (
                <Animated.View style={styles.mainView}>
                <Animated.View style={[styles.childView,{
                }]}>
                {props.children}
                {hamView!=0&&Platform.OS=="ios"&&
                <BlurView
                    blurType={Appearance.getColorScheme()=="dark"? "dark":"light"}
                    blurAmount={5}
                    reducedTransparencyFallbackColor="white"
                style={{position:'absolute',width:'100%',height:'100%'}}
                // blurType="light"
                // blurAmount={10}
                // reducedTransparencyFallbackColor="white"
                // blurAmount={5}
                // reducedTransparencyFallbackColor="white"
                />}
                 {hamView!=0&&Platform.OS=="android"&&
                <View
                    // blurType={Appearance.getColorScheme()=="dark"? "dark":"light"}
                    // blurAmount={5}
                style={{position:'absolute',backgroundColor:Colors.transparentMildWhite,width:'100%',height:'100%'}}
                // blurType="light"
                // blurAmount={10}
                // reducedTransparencyFallbackColor="white"
                // blurAmount={5}
                // reducedTransparencyFallbackColor="white"
                />}
                </Animated.View>
                {global.showHamView&&
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: widthPercentageToDP(10),
                        paddingTop: insets.top,
                    }}>
                    <TouchableOpacity style={{
                        width: 40,
                        height: 40,
                        marginTop: heightPercentageToDP(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} onPress={()=>{
                            openHamBurger();
                        }}>
                        <Image source={burgerIcon} style={[styles.profileIcon,{}]}/>
                        </TouchableOpacity></View>}
                        {hamView==1&&<TouchableOpacity style={{position:'absolute',width:'100%',height:'100%'}}
                        onPress={()=>{
                            closeHamBurger();
                        }}>
                        <View></View></TouchableOpacity>}
                        <Animated.View style={[styles.sideMenu,
                            {transform:[
                                // {scaleX:scaleXVal},
                                // {scaleY:scaleYVal},
                                {translateX: translateXVal}
                            ]}]}>
                            <SafeAreaView style={{width:'100%',height:heightPercentageToDP(100)-StatusBar.currentHeight,marginTop:StatusBar.currentHeight}}>
                            <TouchableOpacity onPress={()=>{
                                closeHamBurger();
                            }} style={{backgroundColor:Colors.bluelightShadeColor, width:widthPercentageToDP(8),justifyContent:'center',alignSelf:'flex-end',
                            marginEnd:widthPercentageToDP(3),
                            height:widthPercentageToDP(8),borderRadius:widthPercentageToDP(8)}}>
                            <Text style={{alignSelf:'center',includeFontPadding:false,textAlignVertical:'center',color:Colors.whiteColor,fontWeight:'500',fontSize:widthPercentageToDP(5),transform:[{scaleX:1.25}]}}>X</Text>
                            </TouchableOpacity>
                            <ProfileInHam Colors={Colors} menuVisible={menuVisible} OpenMenu={OpenMenu} hamView={hamView}/>
                       
                            <Image source= {leisureIcon} resizeMode='contain'
                            style={{position:'absolute',bottom:insets.bottom+heightPercentageToDP(insets.bottom==0?2.5:1.5),tintColor:Colors.whiteColor,alignSelf:'center',
                            width:widthPercentageToDP(25),height:widthPercentageToDP(25)}}/>
                            {/* <TouchableOpacity style={{position:'absolute',bottom:StaticSafeAreaInsets.safeAreaInsetsBottom+heightPercentageToDP(StaticSafeAreaInsets.safeAreaInsetsBottom==0?1:0),alignSelf:'center'}} onPress={()=>{
                                Linking.openURL(WebServices.uxp);
                            }}>
                            <Text style={{fontFamily:'Cairo-Regular',color:Colors.whiteColor,fontSize:13,includeFontPadding:false,}}>Platform powered by UXP</Text>
                 
                        </TouchableOpacity> */}
                        </SafeAreaView>
                        </Animated.View>
                        {<OpenAuthenticate  showLogin={showLogin} setLogin={(login)=>{setShowLogin(login)}} setRegister={(login)=>{setShowRegister(login)}} showRegister={showRegister} navigation={props.navigation}/>}
                        </Animated.View>
                        );
                    }
                    
                
                