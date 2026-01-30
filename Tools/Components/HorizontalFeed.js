import React, { useState, memo } from 'react'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity,Linking } from 'react-native';
import { Image as RNImage } from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import FastImage from '@d11/react-native-fast-image';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import * as UIElements from '../Components/UIElements'
import OpenAuthenticate from './OpenAuthenticate';
import { useAppContext } from '../../src/js/reducers/AppReducer';

//ContentTypeId 1 - open content in app
//2- website
const styles = StyleSheet.create({
    button:{
        width:'30%',justifyContent:'center',
        backgroundColor:Colors.blueColor,
        height:heightPercentageToDP(4.75),
        borderRadius:heightPercentageToDP(4.75)
    },
    buttontxt:{
        includeFontPadding: false,
        alignSelf:'center',
        fontFamily:'Cairo-Regular',
        fontSize:widthPercentageToDP(4.5),
        paddingHorizontal:widthPercentageToDP(3),
        color:Colors.whiteColor
    },
    container: {
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.26,
        elevation: 8,
        backgroundColor: 'white',
        borderRadius: widthPercentageToDP(3),
        flexDirection: 'row',
        alignSelf:'center',
        overflow:'hidden'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titletxt:{
        includeFontPadding: false,
        alignSelf:'center',
        fontFamily:'Cairo-Bold',
        fontSize:widthPercentageToDP(6),
        paddingHorizontal:widthPercentageToDP(3),
        color:Colors.inputfontColor
    },
    title: {
        flexWrap: 'wrap',
        marginHorizontal: 10,
    }
});


const HorizontalFeed = ({ news,settings,profile}) => {
    const imageIn=[];
    for (let index = 0; index < news.length; index++) {
        const element = 1;
        imageIn.push(element);
    }
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [imageAspect, setImageAspect] = useState(imageIn);
    const [showLogin,setLogin]=useState(false);
    const [showRegister,setRegister]=useState(false);
    
    const navigationIn = useNavigation();
    
    const checkValue=(valuIn)=>{
        return ((valuIn==0||valuIn==undefined)?1:valuIn);
    }
    
    return (
        <View>
        {news!=undefined&&
            <FlatList 
            removeClippedSubviews={false}
            decelerationRate={0}
            // style={{width:widthPercentageToDP(100)}}
            showsHorizontalScrollIndicator={false}
            data={news}
            snapToInterval={widthPercentageToDP((settings.itemwidth/100)*94)}
            horizontal
            pagingEnabled
            renderItem={({item,index})=>
            {
                return(<View style={{marginBottom:heightPercentageToDP((index==(news.length-1))?2:0)}}>
                {profile.id==undefined&&item.Navigation.NavType=='appview'&&
                <View style={{
                    width:widthPercentageToDP(93),
                    alignSelf:'center', marginHorizontal:widthPercentageToDP(4),borderRadius:widthPercentageToDP(4),
                    backgroundColor:Colors.whiteColor}}>
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
                    <View style={{minHeight:100,maxHeight:(2*(widthPercentageToDP(90)/checkValue(imageAspect[index])))}}>
                    <TouchableOpacity style={{flexDirection:'column',overflow:'hidden',
                    marginStart:widthPercentageToDP(4),marginEnd:widthPercentageToDP(index==(news.length-1)?8:0),
                    backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3)}}
                    onPress={()=>{
                        if(item.Navigation.NavType=='url'){
                            Linking.openURL(item.Navigation.NavURL); 
                        }else if(item.Navigation.NavType=='view'){
                            if(item.Navigation.NavURL=='store'){
                                // console.log("S : "+item.Navigation.NavParameter);
                                navigationIn.navigate('Storescreen',{openProduct:item.Navigation.NavParameter})
                            }else if(item.Navigation.NavURL=='home')
                            {
                                if(item.Navigation.NavParameter.length>0){
                                    navigationIn.navigate('Adpage',{
                                        url:item.Navigation.NavParameter
                                    })
                                }else{
                                    navigationIn.navigate('Adpage',{
                                        info:JSON.stringify(item)
                                    })
                                }
                            }else if(item.Navigation.NavURL=='events'){
                                // console.log("openE"+item.Navigation.NavParameter)
                                navigationIn.navigate('Homescreen',{screen:'events',openEvent:item.Navigation.NavParameter})
                            }
                        }
                    }
                }>
                <FastImage
                onLoad={(evt)=>{
                    const newAspect = evt.nativeEvent.width / evt.nativeEvent.height;
                    if (Math.abs(newAspect - (imageAspect[index] || 1)) > 0.01) {
                        setImageAspect(prevAspects => {
                            const newAspects = [...prevAspects];
                            newAspects[index] = newAspect;
                            return newAspects;
                        });
                    }
                }}
                style={[{alignSelf:'center',width:widthPercentageToDP(settings.itemwidth/100*90),backgroundColor:Colors.whiteColor,height:((widthPercentageToDP(settings.itemwidth/100*90)/checkValue(imageAspect[0])))}]}
                source={{
                    uri: item.Banner.MainBannerImgURL,
                    // headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}
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
                {item.ContentTypeId==1&&
                    <View style={{
                        alignSelf:'center',
                        marginBottom:heightPercentageToDP(0.5),
                        marginTop:heightPercentageToDP(0.5),
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
                    </View>}
                    </TouchableOpacity>
                    </View>}
                    </View>
                    )
                }
            }
            />}
            </View>
            )
        }
        
        export default memo(HorizontalFeed);
        