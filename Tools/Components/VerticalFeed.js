import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity,Linking } from 'react-native';
import { Image as RNImage } from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import AppIcon from './AppIcon';
import * as UIElements from '../../Tools/Components/UIElements'
import LayoutView from '../Components/LayoutView'
import * as Tools from '../Components/Tools';

//ContentTypeId 1 - open content in app
//2- website
const styles = StyleSheet.create({
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
    title: {
        flexWrap: 'wrap',
        marginHorizontal: 10,
    }
});


const VerticalFeed = ({ news,settings,profile }) => {
    
    const [imageAspect, setImageAspect] = useState(1);
    
    const navigationIn = useNavigation();
    
    onImageIn=(evt)=>{
        setImageAspect(evt.nativeEvent.width / evt.nativeEvent.height);
    }
    
    return (
        <View 
        style={{marginBottom:heightPercentageToDP(2),justifyContent:'center',width:widthPercentageToDP(100),
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,elevation:3,
        shadowOpacity: 0.12, overflow:'visible'}}
        >
        {news!=undefined&&
            <FlatList 
            removeClippedSubviews={false}
            decelerationRate={0}
            initialNumToRender={2}
            maxToRenderPerBatch={1}
            onEndReachedThreshold={0.1}
            // style={{width:widthPercentageToDP(100)}}
            showsHorizontalScrollIndicator={false}
            data={news}
            horizontal={Tools.stringIsContains(settings.orientation,'horizontal')}
            snapToInterval={widthPercentageToDP((settings.itemwidth/100)*94)}
            pagingEnabled
            renderItem={({item,index})=>
            {
                return(
                    <LayoutView item={item} index={index} news={news} profile={profile} settings={settings}/>
                    // <TouchableOpacity style={{flexDirection:'column',width:widthPercentageToDP(90),marginBottom:heightPercentageToDP(1),overflow:'hidden',
                    // alignSelf:'center',
                    // backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3)}}
                    // onPress={()=>{
                    //     if(item.Navigation.NavType=='url'){
                    //         Linking.openURL(item.Navigation.NavURL); 
                    //     }else if(item.Navigation.NavType=='view'){
                    //         if(item.Navigation.NavURL=='store'){
                    //             navigationIn.navigate('Storescreen',{openProduct:item.Navigation.NavParameter})
                    //         }else if(item.Navigation.NavURL=='home')
                    //         {
                    //             if(item.Navigation.NavParameter.length>0){
                    //                 navigationIn.navigate('Adpage',{
                    //                     url:item.Navigation.NavParameter
                    //                 })
                    //             }else{
                    //                 navigationIn.navigate('Adpage',{
                    //                     info:JSON.stringify(item)
                    //                 })
                    //             }
                    //         }else if(item.Navigation.NavURL=='events'){
                    //             // console.log("openE"+item.Navigation.NavParameter)
                    //             navigationIn.navigate('Homescreen',{screen:'events',openEvent:item.Navigation.NavParameter})
                    //         }
                    //     }
                    // }}>
                    // <View>
                    // <FastImage
                    // onLoad={onImageIn}
                    // style={[{alignSelf:'flex-start',width:widthPercentageToDP(settings.itemwidth/100*90),backgroundColor:Colors.whiteColor,
                    // height:((widthPercentageToDP(settings.itemwidth/100*90)/imageAspect))}]}
                    // source={{
                    //     uri: item.Banner.MainBannerImgURL,
                    //     // headers: { Authorization: 'someAuthToken' },
                    //     priority: FastImage.priority.normal,
                    // }}
                    // />
                    // {item.ContentTypeId==4&&
                    //     <View style={{alignSelf:'flex-start',position:'absolute',
                    //     padding:widthPercentageToDP(2),
                    //     backgroundColor:Colors.whiteColor,bottom:0,
                    //     width:'100%'
                    // }}>
                    // <View style={{flexDirection:'row'}}>
                    // <AppIcon name="event" style={{alignSelf:'center',tintColor:Colors.blueColor,width:widthPercentageToDP(10),height:widthPercentageToDP(10)}}/>
                    // {UIElements.drawRGap(widthPercentageToDP(2))}
                    // <View>
                    // <AppText type="h2">
                    // {item.Title}
                    // </AppText>
                    // <AppText type="p">
                    // {item.SubTitle}
                    // </AppText></View>
                    // </View>
                    // </View>}
                    // {item.ContentTypeId==1&&
                    //     <View style={{
                    //         alignSelf:'center',
                    //         marginBottom:heightPercentageToDP(0.5),
                    //         marginTop:heightPercentageToDP(0.5),
                    //         width:'95%'}}>
                    //         <AppText numberOfLines={1} type="h2">
                    //         {item.Title}
                    //         </AppText>
                    //         <AppText numberOfLines={1} type="p">
                    //         {item.SubTitle}
                    //         </AppText>
                    //         </View>}
                    //         </View>
                    //         </TouchableOpacity>
                            )}}
                            />}
                            </View>
                            )
                        }
                        
                        export default VerticalFeed