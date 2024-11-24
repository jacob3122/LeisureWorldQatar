import React, { Component, useEffect, useState } from 'react';
import { View,Modal,StyleSheet,Dimensions,Linking,TouchableOpacity,TouchableHighlight,Text,Image, Platform} from 'react-native';
import Colors from '../constants/Colors';
import * as Tools from './Tools';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import WebServices from '../constants/WebServices';
import TabBarIcon from './TabBarIcon';
import { SliderBox } from "react-native-image-slider-box";
import WebView from 'react-native-webview';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import {connect} from 'react-redux';
import { updateBannerInfo } from '../../src/js/actions/profileActions';
import imageIn from '../../assets/sd.jpg'
import { useTheme } from '../context/ThemeProvider';
// import dataIn from '../../Data/banner.json';
// import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { useAppContext } from '../../src/js/reducers/AppReducer';
import { logBannerEvent, logScreenViewEvent } from '../Analytics/AppAnalytics';

// import { NavigationEvents } from 'react-navigation';
export default function Banner(props){
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const Colors =useTheme();
    data={}
    const [canShow,setcanShow]=useState(true);
    const [showError,setshowError]=useState(false);
    const [visible,setvisible]=useState(true);
    const [language,setlanguage]=useState('');
    const [bannerData,setbannerData]=useState(undefined);
    const [loading,setloading]=useState(false);
    // constructor(props){
    //     super(props);
    //     this.state={
    //         showError:false,
    //         visible:false,
    //         language:'',
    //         bannerData:undefined,
    //         loading:false,visible:true,canShow:true
    //     }
    //     this.BannerCame=this.BannerCame.bind(this);
    //     this.onNavigatorEvent=this.onNavigatorEvent.bind(this);
        
    // }
    // useEffect(()=>{
    //    if(!Tools.IsNull(bannerData)&&!Tools.IsNull(bannerData.bannerType)){
    //     logScreenViewEvent("Banner",bannerData.bannerType);
    //    }
    // },[bannerData])
    useEffect(()=>{
        willFocus=props.navigation.addListener('focus',()=>{
            onNavigatorEvent();
        })
    },[])
    const onNavigatorEvent=()=> {
        if(global.AdVisible==undefined &&(bannerData==undefined||(bannerData!=undefined&&!bannerData.isDone)))
        checkAdVisible();
    }
    
    const closeBanner=()=>{
        dataIn=bannerData;
        dataIn.isDone=true;
        setvisible(false);
        setbannerData(dataIn);
        global.AdVisible=false;
        // this.setState({visible:false,bannerData:dataIn},()=>{
        //     global.AdVisible=false;
        // });
        // updateBannerInfo(dataIn);
        dispatch({
            type: 'update_BannerInfo',
            payload: dataIn
        });
        logBannerEvent(bannerData);
        // console.log("AD close : "+JSON.stringify(dataIn));
    }
    const getBannerData=async()=>{
        //image
        // setbannerData({
        //             bannerType:"ad",
        //             bannerImg:[imageIn,imageIn],
        //             canclose:true,
        //             isDone:false
        //         })
        //         return;

        //weburl
        // setbannerData({
        //         bannerType:"webad",
        //         bannerWebUrl:"https://www.leisure.qa/",
        //         canclose:true,
        //         isDone:false
        //     })
        //         return;
   
        // setloading(false);
        // // updatecheck
        // setbannerData({
        //         bannerType:"update",
        //         bannerWebUrl:"https://www.leisure.qa/",
        //         canclose:false,
        //         isDone:false
        //     });
        //     return;
        
        // return;
        // this.setState({
        //     data:dataIn,loading:false,visible:true,canShow:true
        // });
        // return;
        // console.log("B W "+WebServices.bannerData);
        return fetch(WebServices.MainURL+WebServices.bannerData.replace('{Localize}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'))//+"?rand="+ Math.floor(Math.random() * 100000) + 1)
        .then(response  => response.text())
        .then((findresponse)=>{
            var json = JSON.parse(findresponse);
            // console.log("banner "+JSON.stringify(json.banner));
            // setbannerData(json.banner);
              setbannerData({
                bannerType:"update",
                bannerWebUrl:"https://www.leisure.qa/",
                canclose:false,
                isDone:false
            });
            //  setbannerData({
            //     bannerType:"webad",
            //     bannerWebUrl:"https://www.leisure.qa/",
            //     canclose:true,
            //     isDone:false
            // })
            //    setbannerData({
            //         bannerType:"ad",
            //         bannerImg:[imageIn,imageIn],
            //         canclose:true,
            //         isDone:false
            //     })
            setloading(false);
            setvisible(true);
            setcanShow(true);
        }).catch(function(error) {
            console.warn(' Request Failed: ', error);
            setbannerData(undefined);
            setloading(false);
           
        });
    }
    
    const checkAdVisible=()=>{
        // if(global.AdVisible===undefined)
            getBannerData();
            // global.AdVisible=true;
    }

    
    reDirect=(url)=>{
        Linking.openURL(url);
    }
    
    
    checkads=()=>{
        if(bannerData.bannerType=="webad"&&bannerData.bannerWebUrl){
            // const runFirst=`setTimeout(function(){this.closeBanner()},3000);
            // true;`;
            return(
                <View style={{height:'100%',width:'100%',backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                <View style={{flex:1,top:'9%'}}>
                <WebView
                source={{uri:bannerData.bannerWebUrl}}
                /></View>
        
                </View>
                );
            }else if(bannerData.bannerType=="ad")
            {
                return(
                    <View style={{height:'100%',width:'100%',backgroundColor:Colors.transparentMildWhite,justifyContent:'center'}}>
                    <SliderBox
                    resizeMode={'contain'}
                    dotStyle={{position:'absolute',bottom:heightPercentageToDP(10),width:widthPercentageToDP(3.85),height:widthPercentageToDP(3.85)
                    ,marginHorizontal:-7.5,padding:widthPercentageToDP(0),borderRadius:widthPercentageToDP(3.85)}}
                    dotColor={Colors.blueColor}
                    inactiveDotColor={Colors.placeholdertext}
                    onCurrentImagePressed={index=>()=>{
                        if(bannerData.url!=null&&bannerData.url.length>index){
                            reDirect(bannerData.url[index]);
                            logScreenViewEvent("Banner",bannerData.url[index]);
                            logBannerEvent(bannerData,index);
                        }

                    }}
                    circleLoop ={bannerData.bannerImg.length>1?true:false}
                    autoplay={bannerData.bannerImg.length>1?true:false}
                    sliderBoxHeight={height}
                    activeOpacity={0.5}
                    ImageComponentStyle={{borderRadius: 15, width: '100%', alignSelf:'center'}}
                    imageLoadingColor={Colors.blueColor}
                    images={bannerData.bannerImg}/>
                    
                    </View>
                    );
                }else if(bannerData.bannerType=="update"&&state.needUpdate)
                {
                    return(
                        <View style={{height:'100%',width:'100%',backgroundColor:Colors.whiteColor,justifyContent:'center'}}>
                    <View style={{paddingTop:'15%',paddingBottom:'15%',alignSelf:'center',justifyContent:'center'}}>
                    <Text allowFontScaling={false} style={styles.updateTxt}>{i18n.t('newupdate')}</Text>
                    <Text allowFontScaling={false} style={styles.updateTxtNo}>{Platform.OS=='android'?bannerData.updatePopupandroid:bannerData.updatePopupios}</Text>
                    <TouchableOpacity onPress={()=>openUpdate()}
                    style={styles.updateBut}><Text allowFontScaling={false} style={styles.updateText}>{i18n.t('update')}</Text></TouchableOpacity>
                    </View>
                    </View>
                    );
                }
                
                
            }
            openUpdate=()=>{
                logBannerEvent(bannerData);
                if(Platform.OS==='ios'){
                    Linking.openURL(WebServices.iosApp);
                }else{
                    Linking.openURL(WebServices.androidApp);
                }
            }
                const styles = StyleSheet.create({
                    closeIcon:{
                        position:'absolute',
                        top:40,
                        left:width-(widthPercentageToDP(8)*1.25),
                        width:widthPercentageToDP(7),
                        height:widthPercentageToDP(7),
                        borderRadius:widthPercentageToDP(8),
                        color:Colors.yellowColor,
                        backgroundColor:Colors.yellowColor
                    },
                    backView:{
                        position:'absolute',
                        bottom:hp('0%'),
                        alignSelf:'center',
                        justifyContent:'center',
                        width:50,
                        height:50,
                        // borderWidth:1,
                    },
                    
                    updateTxt:{alignSelf:'center',fontSize:widthPercentageToDP(7),fontWeight:'200',fontFamily:'Cairo-Regular',color:Colors.inputfontColor},
                    updateTxtNo:{alignSelf:'center',fontSize:widthPercentageToDP(10),fontFamily:'Cairo-Bold',color:Colors.inputfontColor},
                    imageIcon:{
                        flex:1,
                        alignSelf:'center',
                        width: wp('95%'),
                        height: hp('90%'),
                        resizeMode:'contain',
                        // borderWidth:2,
                    },
                    imageBG:{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    },  updateBut:{
                        backgroundColor: Colors.blueColor,
                        borderRadius:widthPercentageToDP(4),
                        paddingVertical:5,
                        paddingHorizontal:10,
                        alignSelf:'center',
                        justifyContent:'center',
                    },
                    updateText: { 
                        color: Colors.whiteColor,
                        fontFamily:'Cairo-Regular',
                        justifyContent:'center',
                        alignSelf:'center',
                        fontSize:widthPercentageToDP(4),
                    },
                    
                    
                });
                // console.log("AD R : "+JSON.stringify(this.state.bannerData));
                
                if(bannerData!=undefined&&bannerData.isDone){
                    // console.log("AD : "+bannerData);
                    return <></>;
                }
                // console.log("S :"+this.state.canShow);
                if(visible&&canShow&&bannerData!=undefined&&bannerData.bannerType!=''){
                    return (
                        <Modal  statusBarTranslucent={true} animationType = {"none"} transparent = {true} visible={visible&&((bannerData.bannerType!='update')||(bannerData.bannerType=='update'&&state.needUpdate))}>
                        <View style={{height:'100%',width:'100%',flexDirection:'column'}}>
                        {checkads()}
                        {bannerData.canclose&&
                            <TouchableOpacity onPress={()=>closeBanner()}
                            style={styles.closeIcon}>
                            <TabBarIcon
                            style={{alignSelf:'center'}}
                            width={30}
                            height={30}
                            focused={true}
                            name={'close'}/>
                            </TouchableOpacity>}
                            </View></Modal>
                            )
                        }
                    else{
                        return(
                            <View>
                        </View>);
                    }
                }
                
                