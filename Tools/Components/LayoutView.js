import { useNavigation, useRoute } from "@react-navigation/native";
import { Linking, Platform, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import AppText from "./AppText";
import AppIcon from "./AppIcon";
import { useContext, useState } from "react";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
// import Colors from "../constants/Colors";
import * as Tools from '../Components/Tools';
import * as UIElements from '../../Tools/Components/UIElements'
import OpenAuthenticate from "./OpenAuthenticate";
import { useTheme } from "../context/ThemeProvider";
import { useAppContext } from "../../src/js/reducers/AppReducer";
import { BlurView } from "@react-native-community/blur";
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
import { StateContext } from "../context/ContextState";
const i18n = new I18n(translations);
function LayoutView({item,index,settings,news,profile}) {
    
    const [imageAspect, setImageAspect] = useState(0);
    const Colors = useTheme(); // Get the current color scheme's colors
    const {openProductCode, setOpenProductCode} = useContext(StateContext);
    
    // onImageIn=(evt)=>{
        //     // setImageAspect(evt.nativeEvent.width / evt.nativeEvent.height);
    //     imageAspect[index]=evt.nativeEvent.width / evt.nativeEvent.height;
    //                 setImageAspect(imageAspect);
    //                 setReset(Math.floor(Math.random() * 100000) + 1)
    // }
    const {state,dispatch}=useAppContext();
    
    const [reset, setReset] = useState(0);
    const [showLogin,setLogin]=useState(false);
    const [showRegister,setRegister]=useState(false);
    
    const navigationIn = useNavigation();
    const route = useRoute();
    const checkValue=(valuIn)=>{
        return ((valuIn==0||valuIn==undefined)?3:valuIn);
    }
    i18n.translations = state.i18ntranslation;
    
    const getAppNames=(_code)=>{
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
    
    return(<View 
        style={{
            
        }}
        //     style={[Tools.stringIsContains(settings.orientation,'horizontal')?{marginBottom:heightPercentageToDP((index==(news.length-1))?2:0)}:
        // {}]}
        >
        
        {(profile==undefined||profile.id==undefined)&&item.Navigation.NavType=='appview'&&
            <View style={{
                
                width:widthPercentageToDP(93),
                alignSelf:'center', 
                marginHorizontal:widthPercentageToDP(4),borderRadius:widthPercentageToDP(4),
            }}>
            {UIElements.drawGap(heightPercentageToDP(1))}
            <Text style={styles.titletxt}>{i18n.t('welcome')} {i18n.t('toleisure')}</Text>
            {UIElements.drawGap(heightPercentageToDP(2))}
            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around',}}>
            <TouchableOpacity onPress={()=>{
                setLogin(true);
            }} style={styles.button}>
            <Text style={styles.buttontxt}>{i18n.t('signin')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                setRegister(true);
            }} style={styles.button}>
            <Text style={styles.buttontxt}>{i18n.t('register')}</Text>
            </TouchableOpacity></View>
            {UIElements.drawGap(heightPercentageToDP(3))}
            <OpenAuthenticate showLogin={showLogin} setLogin={setLogin} setRegister={setRegister} showRegister={showRegister} navigation={navigationIn}/>
            </View>}
            
            
            {item.Navigation.NavType!='appview'&&
                <View style={[Tools.stringIsContains(settings.orientation,'horizontal')?{
                    marginStart:widthPercentageToDP(4),marginEnd:widthPercentageToDP(index==(news.length-1)?8:0),
                }:{},{justifyContent:'center', alignSelf:'center',
                    
                    minHeight:100,maxHeight:(2*(widthPercentageToDP(90)/checkValue(imageAspect)))}]}>
                    <TouchableOpacity style={{flexDirection:'column',overflow:'hidden',
                        // alignSelf:'center',
                        // width:widthPercentageToDP(90),
                        
                        backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3)}}
                        onPress={()=>{
                            // Linking.openURL('instagram://user?username=apple');
                            if(item.Navigation.NavType=='url'){
                                Linking.openURL(item.Navigation.NavURL); 
                            }else if(item.Navigation.NavType=='view'){
                                if(item.Navigation.NavURL=='store'){
                                    // dispatch({
                                    //     type:'update_OpenProduct',
                                    //     payload:item.Navigation.NavParameter
                                    // })
                                    setOpenProductCode(item.Navigation.NavParameter);
                                    const currentScreen = route.name;
                                    // console.log('Current screen name:', currentScreen);
                                    navigationIn.navigate('Storescreen');
                                    navigationIn.popToTop();
                                    // navigationIn.reset({
                                    //     index: 0,
                                    //     routes: [{ name: 'Storescreen' }],
                                    //   });
                                }else if(item.Navigation.NavURL=='ad')
                                    {
                                    console.log(JSON.stringify(item));
                                    if(item.Navigation.NavParameter.length>0){
                                        navigationIn.navigate('Adpage',{
                                            url:item.Navigation.NavParameter
                                        })
                                    }else{
                                        navigationIn.navigate('Adpage',{
                                            info:JSON.stringify(item)
                                        })
                                    }
                                }
                                else if(item.Navigation.NavURL=='events'){
                                    navigationIn.navigate('Homescreen',{screen:'events',openEvent:item.Navigation.NavParameter})
                                }else 
                                {
                                    if(item.Navigation.NavParameter.length>0){
                                        navigationIn.navigate(getAppNames(item.Navigation.NavURL),getScreen(item.Navigation.NavParameter))
                                    }
                                }
                            }
                        }
                    }>
                    
                    <FastImage
                    onLoad={(evt)=>{
                        {
                            setImageAspect((evt.nativeEvent.width / evt.nativeEvent.height));
                            setReset(Math.floor(Math.random() * 100000) + 1)
                        }
                    }}
                    style={[{alignSelf:'flex-start',
                        width:widthPercentageToDP(settings.itemwidth/100*90),
                        backgroundColor:Colors.whiteColor,
                        height:((widthPercentageToDP(settings.itemwidth/100*90)/checkValue(imageAspect)))}]}
                        source={{
                            uri: item.Banner.MainBannerImgURL,
                            // headers: { Authorization: 'someAuthToken' },
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        // resizeMode='cover'
                        />
                        {item.ContentTypeId==4&&
                            <View style={{alignSelf:'flex-start',position:'absolute',
                                padding:widthPercentageToDP(2),
                                backgroundColor:Colors.whiteColor,bottom:0,
                                width:'100%'
                            }}>
                            <View style={{flexDirection:'row'}}>
                            <AppIcon name="event" style={{alignSelf:'center',tintColor:Colors.blueColor,width:widthPercentageToDP(10),height:widthPercentageToDP(10)}}/>
                            {UIElements.drawRGap(widthPercentageToDP(2))}
                            <View>
                            <AppText type="h2">
                            {item.Title}
                            </AppText>
                            <AppText type="p">
                            {item.SubTitle}
                            </AppText></View>
                            </View>
                            </View>}
                            {/* {item.ContentTypeId!=4&&item.ContentTypeId!=1&&!Tools.IsNull(item.Title)&&
                                <View style={{alignSelf:'flex-start',position:'absolute',
                                paddingHorizontal:widthPercentageToDP(2),
                                paddingTop:widthPercentageToDP(2),
                                backgroundColor:Colors.transparentMildWhite,bottom:0,
                                width:'100%'
                                }}>
                                <View style={{flexDirection:'row'}}>
                                <View>
                                <AppText numberOfLines={1} type="h2">
                                {item.Title}
                                </AppText>
                                </View>
                                </View>
                                </View>} */}
                                
                                
                                {item.ContentTypeId==1&&
                                    <View
                                    style={{
                                        top: -5,
                                        left: 0,
                                        right: 0,
                                    }}
                                    blurType="light"
                                    blurAmount={5}
                                    reducedTransparencyFallbackColor="white">
                                    <View style={{
                                        alignSelf:'center',
                                        marginBottom:heightPercentageToDP(0.15),
                                        marginTop:heightPercentageToDP(1),
                                        width:'95%'}}>
                                        
                                        <AppText numberOfLines={1} type="h2">
                                        {item.Title}
                                        </AppText>
                                        <AppText numberOfLines={1} type="p">
                                        {item.SubTitle}
                                        </AppText>
                                        
                                        {/* <AppText type="p">
                                            {item.ShortDescription}
                                            </AppText> */}
                                            </View></View>}
                                            </TouchableOpacity>
                                            </View>}
                                            </View>
                                        )
                                    }
                                    
                                    export default LayoutView;