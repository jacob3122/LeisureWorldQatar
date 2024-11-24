import { SafeAreaView, Text } from 'react-native';
import { RefreshControl,ScrollView,Image,Dimensions,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
// import { NavigationEvents } from 'react-navigation';
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

// import Barcode from 'react-native-barcode-builder';
// import { NavigationEvents } from 'react-navigation';

// import { Barcode, Formats } from 'react-native-1d-barcodes';
import GetStarted from './GetStarted';
import {AdaptiveHeight,AdaptiveWidth,AdaptiveOffsetHeight,AdaptiveOffsetWidth,} from './AdaptiveSize'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';

import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../constants/Colors';


import { logScreenViewEvent } from '../Analytics/AppAnalytics';

import claimb from '../../assets/Icons/rewards.png'
// import rewardbox from '../../assets/card/reward.png'

import redeemb from '../../assets/Icons/redeem.png'

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
// i18n.fallbacks = true;

import * as UIElements from '../Components/UIElements'
import HeaderLogo from './HeaderLogo';
import rulesIcon from '../../assets/Icons/rules.png'
import * as Tools from '../Components/Tools';
import TejoryInfo from './TejoryInfo';
import PixelRatio from 'react-native/Libraries/Utilities/PixelRatio';
import ProfileData from './ProfileData';
import CardInfo from './CardInfo';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import CardTopBar from './CardTopBar';
import { StatusBar } from 'react-native';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { useFocusEffect } from '@react-navigation/native';

// i18n.translations = { en,ar };
export default function CardHandle(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const[refreshing,setRefreshing]=useState(false);
    const[showPage,setshowPageg]=useState('');
    const[showLogin,setshowLogin]=useState(false);
    useEffect(()=>{
        Tools.updateRatePoints(1);
        // willFocus=props.navigation.addListener('focus',()=>{
        //     onNavigatorEvent();
        // })
        // if(!Tools.IsNull(state.profile)&&state.profile.CardNo!=null){
        //     logScreenViewEvent("CardHandle","MyTejory");
        // }
        // else{
        //     logScreenViewEvent("CardHandle","TejoryInfo");
        // }
    },[])
  
    useFocusEffect(
        ()=>{
        // React.useCallback(() => {
            onNavigatorEvent();
        // }, [])
        }
      );
    const onNavigatorEvent=()=> {
        let profileIn=Tools.IsNull(state.profile);
        // console.log("onNavigatorEvent"+profileIn)
        if(profileIn){
            setshowLogin(true);
        }else{
            setshowLogin(false);

        }
 
    }
 
    
    const refreshListView =()=> {
        setRefreshing(false);
        updateprofile= props.assignProfile;
        updateprofile("user","","");
        // fetchData().then(() => {
        //   this.setState({refreshing: false});
        // });
    }
    const refreshControl=()=>{
        return (
            <RefreshControl
            tintColor={Colors.bluedarkShadeColor}
            refreshing={refreshing}
            onRefresh={()=>refreshListView()} />
            )
        }
        
        const movetoclaim=()=>{
            props.navigation.navigate('claims',{
                otherParam: i18n.t('claimpoints'),backParam: i18n.t('mycard'),pagefrom:'card'
            });
        }
        const addCardDetails=()=>{
            if(!Tools.IsNull(state.profile)&&state.profile.CardNo!=null){
                if(props.profile.CardNo!=null){
                    return(
                        <View style={{width:widthPercentageToDP(93),height:'96%',alignSelf:'center'}}>
                        <CardInfo submitChangePassRequest={props.submitChangePassRequest} colorIn='blue' cardData={state.profile} pagefrom='card'/>
                        </View>
                        );
                    }
                }else{
                    return(
                        <SafeAreaView style={{height:(height-(heightPercentageToDP('20%')+heightPercentageToDP('7.2%'))),marginTop:heightPercentageToDP(3)}}>
                        <TejoryInfo  navigation={props.navigation} assignProfile={props.assignProfile} pagefrom='card'/>
                        </SafeAreaView>
                        );
                    }
                }
                
                
                drawLine=(colorstr)=>{
                    return(
                        <View
                        style={{
                            borderBottomColor: colorstr,
                            borderBottomWidth: 1,
                        }}
                        />
                        );
                    }
                    
                    const transferPage=()=>{
                        // console.log(this.props.pagetodivert);
                        
                        // this.setState({showPage:this.props.pagetodivert});
                        if(props.pagetodivert=="rules"){
                            props.navigation.navigate('rules',{
                                navigation:props.navigation,pagefrom:props.pagefrom,
                            })
                        }
                        if(props.pagetodivert=="Claims"){
                            props.navigation.navigate('claims',{
                                otherParam: i18n.t('claimpoints'),backParam: i18n.t('mycard'),pagefrom:'card',redeem:props.redeem,redeemPoint:props.redeemPoint,redeemProfile:props.redeemProfile
                            })
                            
                        }
                        if(props.pagetodivert=="Redeem"){
                            
                            var redeemprofile=props.redeemProfile;
                            redeemprofile();
                            props.navigation.navigate('redeem',{assignProfile:props.assignProfile,isLoading:props.isLoading,
                                otherParam: 'Redeem Points',backParam: i18n.t('mycard') ,pagefrom:'card',profile:state.profile,redeem:props.redeem,redeemPoint:props.redeemPoint,redeemProfile:props.redeemProfile
                            })
                        }
                        
                    }
                    
                    
                        const styles = StyleSheet.create({
                            rewardTitle:{
                                alignSelf:'center',
                                // marginTop:heightPercentageToDP(1.75)*-1,
                                // marginBottom:heightPercentageToDP(2.5),
                                // fontSize:25,
                                fontFamily:'Cairo-Bold'
                            },
                            titleView:{
                                position:'absolute',
                                borderWidth:2,
                                borderRadius:10,
                                alignSelf:'flex-end',
                                transform:[{translateX:width/4.5},{translateY:50}],
                                borderColor:Colors.whiteColor,
                            },
                            titleTxt:{
                                color:Colors.whiteColor,
                                fontFamily:'Cairo-Regular',
                                fontSize: AdaptiveWidth(15),
                                paddingLeft:10,
                                paddingRight:100,
                            },
                            logoImg:{
                                alignSelf:'flex-start',
                                // marginLeft:20,
                                width:70.2*(AdaptiveWidth(280)),
                                height:65.3*AdaptiveWidth(280),
                                // maxWidth:220,
                            },
                            container: {
                                width:wp('95%'),
                                backgroundColor: 'white',
                                // shadowColor: "#000",
                                // shadowOffset: {
                                //     width: 0,
                                //     height: 2,
                                // },
                                // shadowOpacity: .45,
                                // shadowRadius: 3.84,
                                // elevation: 5,
                                
                                marginTop:15,
                                marginBottom:15,
                                
                                justifyContent:'center',
                                alignSelf:'center',
                                borderWidth:2,
                                borderRadius:15,
                                borderColor:Colors.whiteColor,
                                // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
                            },
                            barCodeValue:{
                                textAlign:'center',
                                fontSize:12,
                                
                                fontFamily:'Cairo-Bold',
                                fontSize:22,
                                lineHeight:22* 1.6,
                                // height: AdaptiveWidth(22)* 1.3,
                            },homeScrollView: {
                                alignContent:'center',
                                justifyContent:'center',
                                height:'98%',
                                // padding:15,
                                // backgroundColor:'#fff',
                            },
                            homeView: {
                                alignSelf:'center',
                                alignContent:'center',
                                width:width,
                                height:'100%',
                                overflow:'visible',
                                borderRadius:heightPercentageToDP(4)
                                // backgroundColor:'#fff',
                            },
                            detailstitle:{
                                // paddingVertical:widthPercentageToDP(2),
                                textAlign:'center',
                                alignSelf:'center',
                                // marginTop:15,
                                color:Colors.inputfontColor,
                                fontFamily:'Cairo-SemiBold',
                                fontSize:14,
                                // lineHeight:14*1.5,
                                paddingHorizontal:widthPercentageToDP(2.5)
                                // width:'90%',
                                // lineHeight: AdaptiveWidth(18) * 1.6,
                                // height: AdaptiveWidth(18)* 1.3,
                            },
                            bottomBar:
                            {
                                height:heightPercentageToDP(4),
                                // width:widthPercentageToDP(30),
                                // paddingHorizontal:widthPercentageToDP(3),
                                backgroundColor:Colors.tealGreen,
                                // alignSelf:'center',
                                justifyContent:'center',
                                overflow:'hidden',
                                // height:widthPercentageToDP(9),
                                borderRadius:heightPercentageToDP(4)
                            },
                            claimBut:{
                                borderRadius:6,
                                alignSelf:'center',
                                width:12,
                                height:12,
                                backgroundColor:Colors.blueColor
                            }
                            
                        });     
                        return (
                            <SafeAreaView
                            style={{ backgroundColor:Colors.bgColor,height:'100%'}}>
                            <BackgroundWall/>
                            <SafeAreaView style={{marginTop:StatusBar.currentHeight+heightPercentageToDP(5)}}>
                                <CardTopBar navigation={props.navigation} assignProfile={props.assignProfile} isLoading={props.isLoading} profile={state.profile} redeem={props.redeem} redeemPoint={props.redeemPoint} redeemProfile={props.redeemProfile}/>
                          
                                    <ScrollView 
                                    contentContainerStyle={styles.homeScrollView}
                                    style={styles.homeView}
                                    showsVerticalScrollIndicator = {false}
                                    refreshControl={refreshControl()}>
                                    
                                    {addCardDetails()}
                                    
                                    </ScrollView>
                                    </SafeAreaView>
                                    {showLogin&&(<ProfileData pagetogo='signinuser' showsignin='1' navigation={props.navigation}  onDismiss={()=>{
                                        props.navigation.navigate('Homescreen');
                                        setshowLogin(false);
                                    }}/>)}
                                    </SafeAreaView>
                                    );
                                }
                            