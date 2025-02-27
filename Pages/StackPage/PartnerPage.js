import { StyleSheet, TouchableOpacity, View,Image,Text, SafeAreaView, FlatList, Linking, Platform, Animated, Easing } from "react-native";
import RenderHTML from "react-native-render-html";
import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
// import Colors from "../../Tools/constants/Colors";
import { useEffect, useState } from "react";
import FastImage from "react-native-fast-image";
import WebServices from "../../Tools/constants/WebServices";
import * as Tools from '../../Tools/Components/Tools'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
// import {SliderBox} from 'react-native-image-slider-box';
import directionIcon from '../../assets/Icons/direction.png'
import mobileIcon from '../../assets/Icons/mobile.png'
import webIcon from '../../assets/Icons/web.png'
import socialIcon from '../../assets/Icons/social-media.png'
import exploreIcon from '../../assets/Icons/explore.png'
import {showLocation} from 'react-native-map-link';
import ContentLoader, { Rect } from "react-content-loader/native"
import { BlurView } from "@react-native-community/blur";
import { useTheme } from "../../Tools/context/ThemeProvider";
import BackgroundWall from "../../Tools/Components/BackgroundWall";
import { StatusBar } from "react-native";
import Slider from "../../Tools/Components/Slider";
import { useAppContext } from "../../src/js/reducers/AppReducer";

export default function PartnerPage({navigation},props) {
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [animatedThis,setAnimatedThis]=useState(undefined);
    const [translateXIn,setTranslateXIn]=useState([]);
    const transitionToContent = (contentIndex) => {
        setAnimatedThis(contentIndex);
        let valIn=JSON.stringify(translateXIn[contentIndex]);
        Animated.timing(translateXIn[contentIndex], {
            toValue: Tools.stringIsContains(i18n.locale,'ar')?valIn<=0?(widthPercentageToDP(93)):0: valIn>=0?(-widthPercentageToDP(93)):0, // Adjust the width of each content view as needed
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    };
    
    const styles = StyleSheet.create({
        circlebut:{width:widthPercentageToDP(8),height:widthPercentageToDP(8),borderRadius:heightPercentageToDP(8),
            backgroundColor:Colors.bluelightShadeColor
            ,alignSelf:'center',justifyContent:'center'},
            image:{
            },labelBut:{color:Colors.black,
                includeFontPadding:false,
                textTransform:'uppercase',
                fontFamily:'Cairo-SemiBold',
                textAlign:'center',
                alignSelf:'center',
                fontSize:widthPercentageToDP(2.75)}
                ,absolute: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: -5,
                    right: 0
                }
            })
            const [isLoading,setLoading]=useState(false);
            const [partnerData,setData]=useState(undefined)
            useEffect(() => {
                fetchPartner();
            }, [""]);
            
            const fetchPartner=async()=>{
                setLoading(true);
                verifyUrl=WebServices.MainURL+(WebServices.PartnerPage.replace('{Lang}',Tools.stringIsContains(i18n.locale,'ar')?'ar':'en'));
                // console.log("F :"+verifyUrl)
                return fetch(verifyUrl)//+"?rand="+ Math.floor(Math.random() * 100000) + 1 )
                .then((response) => response.text())
                .then((findresponse)=>{
                // console.log("fetchPartner :"+findresponse)

                    setLoading(false);
                    var json = JSON.parse(findresponse);
                    setTranslateXIn(json[0].ContentItems.map(item=>new Animated.Value(0)));//.parkdetails.map(item=>new Animated.Value(0)))
                    setData(json[0].ContentItems);
                }).catch(function(error) {
                    console.warn('Request Failed: ', error);
                });
            }
            const getLoading=()=>{
                allLoad=[];
                for (let index = 0; index < 3; index++) {
                    randHeight=30;
                    allLoad.push (
                        <ContentLoader 
                        speed={0.7}
                        width={widthPercentageToDP(93)}
                        height={heightPercentageToDP(randHeight)}
                        style={{alignSelf:'center'}}
                        // viewBox="0 0 400 460"
                        backgroundColor={Colors.whiteColor}
                        foregroundColor={Colors.bgColor}
                        >
                        <Rect x="0" y={index==0?0:20} rx={widthPercentageToDP(3)} ry={widthPercentageToDP(3)} width={widthPercentageToDP(93)} height={heightPercentageToDP(randHeight)-(index==0?0:20)} />
                        </ContentLoader>
                        )
                    }
                    return allLoad;
                }
                const getSocialMedia=(socialmedia)=>{
                    // console.log("socialObj"+socialmedia.length);
                    let allSocials=[];
                 
                    socialmedia.map((item)=>
                        {allSocials.push(<View
                        style={{width:widthPercentageToDP(18)}}><TouchableOpacity
                        onPress={()=>{
                            Linking.openURL(item.url);
                        }} style={styles.circlebut}>
                        <FastImage resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={{
                                        uri: item.icon,
                                        priority: FastImage.priority.high,
                                    }}/>
                        </TouchableOpacity>
                        <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{item.name}</Text></View>)});
                        return allSocials;
                }
                const eachItem=({item,index})=>{
                    let indexIn=index;
                    let currentValue=0;
                    let itemSocial=Tools.IsNull(item.CustomContent.socialmedia)?{}:JSON.parse(item.CustomContent.socialmedia);
                    if(!Tools.IsNull(item)){
                        // console.log("translateXindex :"+indexIn);
                        // if(!Tools.IsNull(translateX[indexIn])){
                        //     currentValue =JSON.stringify(translateX[indexIn].interpolate({
                        //         inputRange: [0, 1],
                        //         outputRange: [0, 1], // Replace with your desired range
                        //     }));
                        //     currentValue=parseInt(currentValue);
                        //     console.log("C:"+currentValue);
                        // }
                        Banners=item.Banner.BannerSlider;
                        Banner=item.Banner;
                        return(
                            <View key={'v1'+indexIn} style={{marginBottom:heightPercentageToDP(2),width:'100%',borderRadius:widthPercentageToDP(3),
                            backgroundColor:Colors.bgColor,overflow:'hidden'}}>
                            {!Tools.stringIsEmpty(Banner.MainBannerImgURL)&&<FastImage
                                style={styles.image}
                                source={{
                                    uri: Banner.MainBannerImgURL,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                                />}
                                <Slider
                                dotStyle={{
                                    width:widthPercentageToDP(3.85),height:widthPercentageToDP(3.85)
                                    ,padding:widthPercentageToDP(0),borderRadius:widthPercentageToDP(3.85)}}
                                    dotColor={Colors.blueColor}
                                    inactiveDotColor={Colors.whiteColor}
                                    firstItem={0}
                                    autoplay={false}
                                    key={"sb"+indexIn}
                                    parentWidth={widthPercentageToDP(93)}
                                    circleLoop ={Banners.length>1?true:false}
                                    // autoplay={Banners.length>1?true:false}
                                    activeOpacity={0.5}
                                    images={Banners}/>
                                {/* <SliderBox
                                dotStyle={{width:widthPercentageToDP(3.85),height:widthPercentageToDP(3.85)
                                    ,marginHorizontal:-7.5,padding:widthPercentageToDP(0),borderRadius:widthPercentageToDP(3.85)}}
                                    dotColor={Colors.blueColor}
                                    inactiveDotColor={Colors.whiteColor}
                                    firstItem={0}
                                    autoplay={false}
                                    key={"sb"+indexIn}
                                    parentWidth={widthPercentageToDP(93)}
                                    circleLoop ={Banners.length>1?true:false}
                                    // autoplay={Banners.length>1?true:false}
                                    activeOpacity={0.5}
                                    images={Banners}/> */}
                                    <View style={{flexDirection:'row',bottom:5,backgroundColor:Colors.transparent,justifyContent:'center',width:'100%',paddingTop:heightPercentageToDP(1),paddingBottom:heightPercentageToDP(0.25)}}>
                                    <BlurView
                                    style={[styles.absolute,
                                    ]}
                                    blurType="light"
                                    blurAmount={5}
                                    reducedTransparencyFallbackColor="white"/>
                                    <Animated.View style={{flexDirection:'row',width:'100%',justifyContent:'flex-start',transform:[{translateX:translateXIn[index]}]}}>
                                    <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}}>
                                    {!Tools.stringIsEmpty(item.Navigation.NavParameter)&&
                                        <View
                                        style={{width:widthPercentageToDP(18)}}>
                                        <TouchableOpacity
                                        onPress={()=>{
                                            console.log(item.Navigation.NavParameter+Colors.websitebg);
                                            navigation.navigate('Adpage',{
                                                // navigation:navigationIn,
                                                url:item.Navigation.NavParameter+Colors.websitebg
                                            })
                                        }} style={styles.circlebut}>
                                        <Image resizeMode="contain" style={{width:'80%',height:'80%',alignSelf:'center'}} source={exploreIcon}/>
                                        {/* <Text>{I18n.t('explore')}</Text> */}
                                        </TouchableOpacity>
                                        <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('explore')}</Text></View>}
                                        {!Tools.stringIsEmpty(item.CustomContent.direction)&&<View
                                            style={{width:widthPercentageToDP(18)}}><TouchableOpacity
                                            onPress={()=>{
                                                allDirection= item.CustomContent.direction.split(',');
                                                if(allDirection.length>1){
                                                    showLocation({
                                                        latitude: allDirection[0],
                                                        longitude: allDirection[1],
                                                        naverCallerName:(Platform.OS=='ios'?'com.leisure.Loyalty':'com.leisureloyalty')
                                                    })
                                                }
                                            }} style={styles.circlebut}>
                                            <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={directionIcon}/>
                                            </TouchableOpacity>
                                            <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('directions')}</Text></View>}
                                            {!Tools.stringIsEmpty(item.CustomContent.contact)&&<View
                                                style={{width:widthPercentageToDP(18)}}>
                                                <TouchableOpacity onPress={()=>{
                                                    Linking.openURL('tel:'+item.CustomContent.contact)
                                                }}style={styles.circlebut}>
                                                <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={mobileIcon}/>
                                                
                                                </TouchableOpacity>
                                                <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('contact')}</Text></View>}
                                                
                                                {!Tools.stringIsEmpty(item.CustomContent.website)&&<View
                                                    style={{width:widthPercentageToDP(18)}}>
                                                    <TouchableOpacity
                                                    onPress={()=>{
                                                        Linking.openURL(item.CustomContent.website) // website
                                                    }} 
                                                    style={styles.circlebut}>
                                                    <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={webIcon}/>
                                                    
                                                    </TouchableOpacity>
                                                    <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('website')}</Text></View>}

                                                    {!Tools.stringIsEmpty(item.CustomContent.socialmedia)&&<View
                                                    style={{width:widthPercentageToDP(18)}}>
                                                    <TouchableOpacity
                                                    onPress={()=>{
                                                        transitionToContent(indexIn);
                                                    }} 
                                                    style={styles.circlebut}>
                                                    <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={socialIcon}/>
                                                    </TouchableOpacity>
                                                    <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('socialmedia')}</Text></View>}
                                                    </View>
                                                    
                                                    <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}}>
                                                    {!Tools.stringIsEmpty(item.CustomContent.socialmedia)&&
                                                        <View
                                                        style={{width:widthPercentageToDP(18)}}>
                                                        <TouchableOpacity
                                                        onPress={()=>{
                                                            transitionToContent(indexIn);
                                                        }} style={styles.circlebut}>
                                                        <Image resizeMode="contain" style={[{width:'60%',height:'60%',alignSelf:'center',tintColor:Colors.black,},
                                                    (Tools.stringIsContains(i18n.locale,'en'))?{transform:[{rotateZ:'0deg'}]}:{transform:[{rotateZ:'-180deg'}]}]} source={backButton}/>
                                                        {/* <Text>{I18n.t('explore')}</Text> */}
                                                        </TouchableOpacity>
                                                        <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{i18n.t('back')}</Text></View>}
                                                        {!Tools.stringIsEmpty(item.CustomContent.socialmedia)&&getSocialMedia(itemSocial)}
                                                        
                                                        {/* {!Tools.stringIsEmpty(item.CustomContent.direction)&&<View
                                                            style={{width:widthPercentageToDP(18)}}><TouchableOpacity
                                                            onPress={()=>{
                                                                allDirection= item.CustomContent.direction.split(',');
                                                                if(allDirection.length>1){
                                                                    showLocation({
                                                                        latitude: allDirection[0],
                                                                        longitude: allDirection[1],
                                                                        naverCallerName:(Platform.OS=='ios'?'com.leisure.Loyalty':'com.leisureloyalty')
                                                                    })
                                                                }
                                                            }} style={styles.circlebut}>
                                                            <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={directionIcon}/>
                                                            </TouchableOpacity>
                                                            <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{I18n.t('facebook')}</Text></View>}
                                                            {!Tools.stringIsEmpty(item.CustomContent.contact)&&<View
                                                                style={{width:widthPercentageToDP(18)}}>
                                                                <TouchableOpacity onPress={()=>{
                                                                    Linking.openURL('tel:'+item.CustomContent.contact)
                                                                }}style={styles.circlebut}>
                                                                <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={mobileIcon}/>
                                                                
                                                                </TouchableOpacity>
                                                                <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{I18n.t('instagram')}</Text></View>}
                                                                {!Tools.stringIsEmpty(item.CustomContent.website)&&<View
                                                                    style={{width:widthPercentageToDP(18)}}>
                                                                    <TouchableOpacity
                                                                    onPress={()=>{
                                                                        console.log("Index : "+indexIn);
                                                                        // Linking.openURL(item.CustomContent.website) // website
                                                                        // transitionToContent(indexIn);
                                                                    }} 
                                                                    style={styles.circlebut}>
                                                                    <Image resizeMode="contain" style={{width:'60%',height:'60%',alignSelf:'center'}} source={webIcon}/>
                                                                    
                                                                    </TouchableOpacity>
                                                                    <Text allowFontScaling={false} numberOfLines={1} style={styles.labelBut}>{I18n.t('tiktok')}</Text></View>} */}
                                                                    </View>
                                                                    
                                                                    
                                                                    </Animated.View>
                                                                    </View>
                                                                    </View>
                                                                    )
                                                                }
                                                            }
                                                            return(<View style={{flex:1,backgroundColor:Colors.bgColor}} >
                                                                <BackgroundWall/>
                                                                <SafeAreaView style={{flex:1,marginTop:StatusBar.currentHeight}}>
                                                                <View
                                                                style={{marginTop:heightPercentageToDP(5),width:'93%',alignSelf:'center',height:'100%'}}
                                                                >
                                                                {/* <View style={{marginTop:heightPercentageToDP(1),width:widthPercentageToDP(90),alignSelf:'center',flexDirection:'row',justifyContent:'space-between'}}>
                                                                <TouchableOpacity onPress={()=>{this.OnDone()}}>
                                                                <Image style={{tintColor:Colors.blueColor,width:25,height:25}} source={backButton}/>
                                                                </TouchableOpacity>
                                                            </View> */}
                                                            {isLoading&&<View>{getLoading()}</View> }
                                                            {!isLoading&&
                                                                <FlatList
                                                                removeClippedSubviews={false}
                                                                showsVerticalScrollIndicator={false}
                                                                style={{flex:1}}
                                                                contentContainerStyle={{paddingBottom:heightPercentageToDP(6)}}
                                                                // style={{marginTop:heightPercentageToDP(5),width:'93%',alignSelf:'center',backgroundColor:Colors.whiteColor,
                                                                // borderRadius:widthPercentageToDP(3)}}
                                                                data={Tools.IsNull(partnerData)?[]:partnerData}
                                                                renderItem={eachItem}
                                                                />}
                                                                </View>
                                                                {/* <RenderHTML/> */}
                                                                </SafeAreaView>
                                                                </View>
                                                                )
                                                            }
                                                            