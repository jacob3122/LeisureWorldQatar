import React, { Component, useEffect, useRef, useState } from 'react'
import {TouchableOpacity,Image,SafeAreaView, Platform,View,Text,StyleSheet, RefreshControl, ScrollView, Modal, TextInput, KeyboardAvoidingView, Alert, Keyboard} from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
// import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import deleteButton from '../../assets/Icons/delete.png'
import locationIcon from '../../assets/Icons/loca.png'

import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { PureComponent } from 'react';
import moment from'moment'
import * as Tools from '../../Tools/Components/Tools'
import * as UIElements from '../../Tools/Components/UIElements'
// import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import * as Tools from '../../Tools/Components/Tools'
import itemsButton from '../../assets/Icons/event.png'
import WebServices from '../../Tools/constants/WebServices';
// import ViewShot,{captureRef} from "react-native-view-shot";
import QRCode from 'react-native-qrcode-svg';
import LoadingLine from '../../Tools/Components/LoadingLine';
import FastImage from '@d11/react-native-fast-image';
import { string } from 'i/lib/util';
import RenderHtml,{defaultSystemFonts}from 'react-native-render-html';
const systemFonts = [...defaultSystemFonts, 'Cairo-Regular']
import Share from 'react-native-share';
import StripAboveKeyboard from '../../Tools/Components/StripAboveKeyboard';
import {useHeaderHeight} from '@react-navigation/native-stack'
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function EventPage(props){
    const Colors=useTheme();
    // let viewshotRef = React.createRef();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [isLoading,setIsLoading]=useState(false);
    const [selectedInvite, setSelectedInvite] = useState(0);
    const [inviteState, setInviteState] = useState(0);
    const [showEvent, setShowEvent] = useState(false);
    const [addInvite, setAddInvite] = useState(false);
    const [selectedItem, setSelectedItem] = useState(0);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestMessage, setGuestMessage] = useState('');
    const [loaded, setLoaded] = useState(1);
    const [accessToken] = useState(props.accessToken);
    const [profile] = useState(props.profile);
    const [refreshing, setRefreshing] = useState(false);
    const [eventObj,setEventObj] = useState(props.route.params.event);
    const [orderObj,setOrderObj]=useState(undefined);
    useEffect(()=>{
        onDataLoad();
        logScreenViewEvent("EventsPage","Event");
    },[])
    const onDataLoad=()=>{
        setLoaded(1);
    }
    const refreshControl=()=>{
        
        return (
            <RefreshControl
            tintColor={Colors.blueColor}
            refreshing={refreshing}
            onRefresh={()=>refreshListView()} />
            )
        }
        const refreshListView=()=>{
            setRefreshing(false);
        }
        
        const generateInvite=()=>{
            /*
            {
                "MemberEventId": "fcbf3bcc-6181-4712-825a-f013dd925a52",
                "InvitationTo": "sample string 2",
                "CustomDetailsEn": "sample string 3",
                "CustomDetailsAr": "sample string 4"
            }
            */
            updateLoad(true);
            data={
                "MemberEventId": eventObj.Id,
                "InvitationToName": guestName,
                "InvitationToPhone":guestPhone,
                "CustomDetailsEn": guestMessage,
                "CustomDetailsAr": guestMessage
            }
            var invite=WebServices.generateInvite;
            // console.log("Invite"+WebServices.MainURL+invite)
            // console.log("Access "+props.route.params.accessToken.access_token);

            fetch (WebServices.MainURL+invite,{
                method: 'POST',
                headers: {
                    'Authorization':'Bearer '+props.route.params.accessToken.access_token,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(data)
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                updateLoad(false);
                // console.log("Invite"+responseJson)
                var responseObj=JSON.parse(responseJson);
                if (Tools.stringIsEmpty(responseObj.Error)){
                    var _event=eventObj;
                    _event.Invitation=responseObj.Invitations;
                    _event.DeleteInvitations=responseObj.DeleteInvitations;
                    _event.DeleteInvitationsMax=responseObj.DeleteInvitationsMax;
                    for(let t=0;t<responseObj.Invitations.length;t++){
                        if(responseObj.Invitations[t].Id===responseObj.NewInvitation.Id){
                            setSelectedInvite(t);
                        }
                    }
                    setInviteState(1);
                    setEventObj(_event);
                }else{
                    Alert.alert(responseObj.Error)
                    updateLoad(false);
                }
                
                
                
            }).catch((error) =>{
                // console.log(error)
                updateLoad(false);
            });
        }
        const getItems=(_order)=>{
            for(var t=0;t<_order.length;t++){
            }
        }
        const updateLoad=(_state)=>{
            var loading=props.route.params.updateLoading;
            if(loading!=null)
            loading(_state);
            setIsLoading(_state);
        }
        
        const resetGuest=()=>{
            setGuestName('');
            setGuestMessage('');
            setGuestPhone('');
        }
        const deleteInvite=(_Invite)=>{
            
            updateLoad(true);
            var invite=WebServices.deleteInvite.replace('{InvitationId}',_Invite.Id);
            // console.log(invite);
            fetch (WebServices.MainURL+invite,{
                method: 'POST',
                headers: {
                    'Authorization':'Bearer '+props.route.params.accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                // console.log("Invite"+responseJson)
                var responseObj=JSON.parse(responseJson);
                if (Tools.stringIsEmpty(responseObj.Error)){
                    var _event=eventObj;
                    _event.Invitation=responseObj.Invitations;
                    _event.DeleteInvitations=responseObj.DeleteInvitations;
                    _event.DeleteInvitationsMax=responseObj.DeleteInvitationsMax;
                    setEventObj(_event);
                }else{
                    Alert.alert(responseObj.Error)
                }
                updateLoad(false);
                
            }).catch((error) =>{
                // console.log(error)
                updateLoad(false);
            });
        }
        const getAllInvites=()=>{
            allInvites=[
            ];
            for (let index = 0; index < eventObj.Invitation.length; index++) {
                const element = eventObj.Invitation[index];
                allInvites.push(
                    <TouchableOpacity onPress={()=>{
                        setSelectedInvite(index);
                        setInviteState(1);
                        setAddInvite(true);
                    }} style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3),marginTop:widthPercentageToDP(2),marginBottom:widthPercentageToDP(2),width:'100%',padding:10,maxHeight:heightPercentageToDP(16)}}>
                    <View style={{flexDirection:'row',width:'100%',height:'100%'}}>
                    <View style={{width:'75%',height:'100%'}}><Text allowFontScaling={false} style={styles.InviteTitle}>{element.InvitationToName}</Text>
                    <Text allowFontScaling={false} style={styles.InviteTitle}>{element.InvitationToPhone}</Text>
                    
                    <View style={{flexDirection:'row',flexWrap:'wrap',width:'100%',position:'absolute',bottom:'1%'}}><Text allowFontScaling={false} style={styles.inviteText}>{moment(element.DateCreated).format('DD-MM-YYYY hh:mm a')}</Text>
                    {/* <Text allowFontScaling={false}>-</Text>
                <Text allowFontScaling={false}>{moment(element.EndDate).format('DD-MM-YYYY hh:mm a')}</Text> */}
                </View>
                </View>
                <View style={{flexDirection:'row',position:'absolute',right:widthPercentageToDP(1),alignSelf:'center'}}>
                <View>
                <QRCode
                value={element.InvitationCode+""}
                size={heightPercentageToDP(10)}
                color={Colors.black}
                backgroundColor={Colors.backgroudColor}/>
                <Text allowFontScaling={false} style={[styles.subtitle,{fontSize:widthPercentageToDP(3),alignSelf:'center',textAlign:'center'}]}>{element.InvitationCode}</Text>
                </View>
                {eventObj.Active&&(eventObj.DeleteInvitations!=eventObj.DeleteInvitationsMax)&&<TouchableOpacity style={{zIndex:10,marginStart:widthPercentageToDP(2),alignSelf:'center'}} 
                onPress={()=>{
                    Alert.alert(i18n.t("sureremoveinvite"),"",[
                        {
                            text:i18n.t('yes'),
                            onPress:()=>{
                                deleteInvite(element);
                            }
                        },
                        {
                            text:i18n.t('no'),
                            onPress:()=>{
                            }
                        }
                    ])
                }}>
                <Image resizeMode='contain' source={deleteButton} style={{width:widthPercentageToDP(5),height:widthPercentageToDP(5),tintColor:Colors.blueColor}}/>
                </TouchableOpacity>}
                </View>
                </View>
                </TouchableOpacity>
                )
            }
            return allInvites;
            
        }
        const handleMultilineText=(_text)=>{
            let breaks=_text.split(/\r\n|\r|\n/).length;
            if(breaks>5){
                return;
            }else if(_text.length<=250){
                setGuestMessage(_text);
            }else{
                return
            }
        }

        useEffect(()=>{
                i18n.locale=global.locale;
            },[global.locale])
            
        const shareInvite=()=>{
            // captureRef(viewshotRef, {format: "png", quality: 0.8, result: "base64"}).then(base64Data => {
            //     const base64DataIn = `data:image/png;base64,` + base64Data;
            //     Share.open({ url: base64DataIn })
            // });
        }
        const styles = StyleSheet.create({
            InviteTitle:{
                textAlign:'left',
                color:Colors.black,
                fontFamily:'Cairo-Bold',
                fontSize:widthPercentageToDP(5),
            },
            buttonText:{
                fontFamily:'Cairo-Regular',
                textAlign:'center',
                color:Colors.whiteColor,
                fontSize: widthPercentageToDP(4),
                // lineHeight:15*1.5,
                // textTransform:'uppercase'
            },buttonView:{
                backgroundColor:Colors.blueColor,
                height:heightPercentageToDP(4.75),
                borderRadius:heightPercentageToDP(4.75),alignSelf:'center',
                width:widthPercentageToDP('35%'),justifyContent:'center'
            },
            inputField:{
                width:'90%',height:45,borderColor:Colors.black,alignSelf:'center',
                fontSize:widthPercentageToDP(4),paddingLeft:widthPercentageToDP(3),
                paddingRight:widthPercentageToDP(3),fontFamily:'Cairo-Regular',
                // borderWidth:1,
                color:Colors.black,
                backgroundColor:Colors.whiteColor,
                borderRadius:widthPercentageToDP(5)},
                subtitle:{
                    color:Colors.black,
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(3.5)
                    ,lineHeight:widthPercentageToDP(5.5)
                },
                title:{
                    color:Colors.black,
                    alignSelf:'center',
                    marginTop:'2%',
                    fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(5),
                    lineHeight:widthPercentageToDP(7.75)
                },
                tagline:{
                    textAlign:'left',
                    color:Colors.black,
                    fontFamily:'Cairo-Bold',
                    // fontWeight:'bold',
                    fontSize:widthPercentageToDP(7),
                    lineHeight:widthPercentageToDP(9)
                },
                homeView: {
                    flex: 1,
                },
                homeScrollView: {
                    width:'100%',
                    alignItems:'center',
                    justifyContent:'center',
                    alignSelf:'center',
                    paddingBottom:'35%'
                },storedesc:{
                    color:Colors.black,
                    
                    width:'100%',
                    textAlign:'left',
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(3.75),
                    lineHeight:widthPercentageToDP(4)*1.5,
                    flexWrap:'wrap',
                    alignSelf:'center',
                },inviteText:{
                    width:'100%',
                    textAlign:'left',
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(4),
                    lineHeight:widthPercentageToDP(4)*1.5,
                    flexWrap:'wrap',
                    alignSelf:'center',
                }
            });
            // console.log(JSON.stringify(route));
            return (
                <View>
                <View behavior={"position"} style={{backgroundColor:Colors.bgColor,width:'100%',height:'100%'}}>
                <BackgroundWall/>
                <SafeAreaView style={{width:'90%',height:'100%',alignSelf:'center',marginTop:heightPercentageToDP(3)}}>
                <TouchableOpacity style={{}} onPress={()=>{
                    setLoaded(0);
                    props.navigation.goBack()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,marginTop:heightPercentageToDP(1),transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    {UIElements.drawGap(heightPercentageToDP(2))}
                    <Text allowFontScaling={false} style={styles.tagline}>
                    {i18n.locale=='ar'?eventObj.EventNameAr:eventObj.EventNameEn}
                    
                    </Text>
                    <RenderHtml
                    defaultTextProps={{allowFontScaling:false}}
                    baseStyle={{
                        textAlign:'left',fontFamily:'Cairo-Regular',
                        fontSize:widthPercentageToDP(3.5),
                        lineHeight:widthPercentageToDP(5.5),
                        marginTop:-heightPercentageToDP(0.02),
                        marginBottom:-heightPercentageToDP(0.15),
                        color:Colors.black,
                    }}
                    GenericPressable={ (evt, href) => {
                        if(Tools.stringIsContains(href,WebServices.appurl)){
                        }else{
                            Linking.openURL(href); 
                        }}}
                        tagsStyles={{
                            p: {
                                fontSize:widthPercentageToDP(3.5)
                                ,lineHeight:widthPercentageToDP(5.5),
                                marginTop:-heightPercentageToDP(0.02),
                                marginBottom:-heightPercentageToDP(0.15),
                                color:Colors.black,
                                width:'100%',
                            },
                        }}
                        // fallbackFonts='Cairo-Regular'
                        systemFonts={systemFonts} 
                        // onLinkPress={ (evt, href) => { Linking.openURL(href); }}
                        contentWidth={widthPercentageToDP(80)}
                        source={{ html: "<p>"+(i18n.locale=='ar'?eventObj.DescriptionAr:eventObj.DescriptionEn)+"</p>"}}
                        
                        />   
                        {UIElements.drawGap(10)}
                        <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <Image resizeMode='contain' style={{width:widthPercentageToDP(5),height:widthPercentageToDP(5),tintColor:Colors.blueColor}} source={locationIcon}/>
                        <Text style={styles.storedesc} allowFontScaling={false}>{i18n.locale=='ar'? eventObj.LocationNameAr:eventObj.LocationName}</Text>
                        </View>
                        <Text allowFontScaling={false} style={[styles.storedesc,{paddingTop:'2%',fontFamily:'Cairo-Bold',}]}> {moment(eventObj.StartDate).format('DD-MM-YYYY hh:mm a')}-
                        {(moment(eventObj.StartDate).format('DD-MM-YYYY')==moment(eventObj.StartDate).format('DD-MM-YYYY'))?moment(eventObj.EndDate).format('hh:mm a'):moment(eventObj.EndDate).format('DD-MM-YYYY hh:mm a')}</Text>
                        <View style={{position:'absolute'}}>{isLoading&&<LoadingLine visibleText={false} loadBar={{backgroundColor:Colors.blueColor}} />}</View>
                        <ScrollView 
                        contentContainerStyle={styles.homeScrollView}
                        style={styles.homeView}
                        showsVerticalScrollIndicator = {false}
                        //refreshControl={refreshControl()}
                        >
                        {getAllInvites()}
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('remainInvites')} :</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{eventObj.TotalInvitations-eventObj.Invitation.length}</Text></View>
                        {eventObj.DeleteInvitationsMax!='-1'&&<View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('maxchanges')} :</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{eventObj.DeleteInvitations}/{eventObj.DeleteInvitationsMax}</Text></View>}
                        {( eventObj.Active&&eventObj.TotalInvitations-eventObj.Invitation.length>0)&&<TouchableOpacity onPress={()=>{
                            setAddInvite(true);
                            setInviteState(0);
                        }} style={{borderWidth:1,borderRadius:widthPercentageToDP(3),borderColor:Colors.blueColor,backgroundColor:Colors.whiteColor,width:'100%',height:heightPercentageToDP(5),alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                        <Text allowFontScaling={false} style={{alignSelf:'center',fontSize:heightPercentageToDP(3),color:Colors.blueColor}}>+</Text>
                        </TouchableOpacity>}
                        </ScrollView>
                        </SafeAreaView>
                        {addInvite&&<Modal>
                            <KeyboardAvoidingView behavior={Platform.OS=='ios'?'padding':'height'} style={{width:'100%',position:'absolute',height:'100%',justifyContent:'center',backgroundColor:'transparent'}}>
                            <BackgroundWall/>
                            <View style={{width:'93%',backgroundColor:Colors.bgColor,alignSelf:'center',borderRadius:widthPercentageToDP(4)}}>
                            {inviteState==0&&<View style={{padding:widthPercentageToDP(3)}}>
                            <Text allowFontScaling={false} style={styles.title}>{i18n.t('guestDetails')}</Text>
                            {UIElements.drawGap(10)}
                            <TextInput 
                            placeholderTextColor={Colors.placeholdertext} allowFontScaling={false} onChangeText={(text)=>{
                                setGuestName(text);
                            }} placeholder='*Name' style={styles.inputField}>
                            </TextInput>
                            {UIElements.drawGap(20)}
                            <TextInput 
                            keyboardType="phone-pad"
                            inputAccessoryViewID={global.inputAccessoryViewID}
                            placeholderTextColor={Colors.placeholdertext} allowFontScaling={false} onChangeText={(text)=>{
                                setGuestPhone(text);}} placeholder='Phone Number' style={[styles.inputField,{}]}>
                                </TextInput>
                                {UIElements.drawGap(20)}
                                <View style={{alignSelf:'center',width:'100%'}}><TextInput   keyboardType="default"
                                value={guestMessage}
                                // onContentSizeChange={e=>{
                                //     console.log(e.nativeEvent.contentSize.height/widthPercentageToDP(6.75))
                                // }}
                                inputAccessoryViewID={global.inputAccessoryViewID}
                                placeholderTextColor={Colors.placeholdertext}
                                underlineColorAndroid="transparent"
                                multiline numberOfLines={4}
                                ellipsizeMode={'tail'}
                                allowFontScaling={false}  onChangeText={(text)=>{handleMultilineText(text)}} placeholder='Personal Message' style={[styles.inputField,{height:100}]}>
                                </TextInput><Text allowFontScaling={false} style={{alignSelf:'center',fontFamily:'Cairo-Regular',marginTop:'1%',width:'80%',textAlign:i18n.locale=='ar'?'left':'right'}}>{guestMessage.length}/250</Text></View>
                                <StripAboveKeyboard/>
                                {UIElements.drawGap(2)}
                                <View>
                                <View style={{position:'absolute',width:'100%',alignSelf:'center'}}>{isLoading&&<LoadingLine visibleText={false} loadBar={{backgroundColor:Colors.blueColor}} />}</View>
                                {UIElements.drawGap(5)}
                                <View style={{flexDirection:'row',width:'100%',alignSelf:'center',justifyContent:'space-around'}}>
                                <TouchableOpacity onPress={()=>{
                                    generateInvite();
                                }} disabled={guestName.length<=2} style={[styles.buttonView,guestName.length==0?{opacity:0.5}:{}]}>
                                <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('submit')}</Text>
                                </TouchableOpacity>
                                {/* {UIElements.drawGap(20)} */}
                                <TouchableOpacity style={[styles.buttonView]} onPress={()=>{
                                    resetGuest();
                                    setAddInvite(false);}} >
                                    <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('close')}</Text>
                                    </TouchableOpacity></View>
                                    </View>
                                    
                                    {UIElements.drawGap(15)}
                                    </View>}
                                    
                                    {/* {inviteState==1&&<ViewShot ref={viewshotRef} style={{alignItems:'center',backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3),overflow:'hidden'}}>
                                    {!Tools.stringIsEmpty(eventObj.BannerImage)&&<FastImage source={{
                                        uri: eventObj.BannerImage,
                                        priority: FastImage.priority.normal,
                                    }}
                                    style={{width:'100%',height:heightPercentageToDP(15)}} resizeMode={'cover'}
                                    />}
                                    <View style={{paddingLeft:widthPercentageToDP(3),paddingRight:widthPercentageToDP(3),width:'100%',alignItems:'center',justifyContent:'center'}}>
                                    <Text allowFontScaling={false} style={styles.title}>{i18n.locale=='ar'?eventObj.EventNameAr:eventObj.EventNameEn}</Text>
                                    <Text allowFontScaling={false} style={[styles.storedesc,{paddingTop:'2%',textAlign:'center',fontFamily:'Cairo-Bold',}]}> {moment(eventObj.StartDate).format('DD-MM-YYYY hh:mm a')}-
                                    {(moment(eventObj.StartDate).format('DD-MM-YYYY')==moment(eventObj.StartDate).format('DD-MM-YYYY'))?moment(eventObj.EndDate).format('hh:mm a'):moment(eventObj.EndDate).format('DD-MM-YYYY hh:mm a')}</Text>
                                    {UIElements.drawGap(10)}
                                    <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}}>
                                    <Image resizeMode='contain' style={{width:widthPercentageToDP(6),height:widthPercentageToDP(6),tintColor:Colors.blueColor}} source={locationIcon}/>
                                    <Text style={[styles.subtitle,{lineHeight:widthPercentageToDP(6)}]} allowFontScaling={false}>{i18n.locale=='ar'? eventObj.LocationNameAr:eventObj.LocationName}</Text>
                                    </View>
                                    {UIElements.drawGap(10)}
                                    <QRCode
                                    value={eventObj.Invitation[selectedInvite].InvitationCode+""}
                                    size={widthPercentageToDP(35)}
                                    color={Colors.black}
                                    backgroundColor={Colors.backgroudColor}/>
                                    {UIElements.drawGap(5)}
                                    <Text numberOfLines={1} allowFontScaling={false} style={styles.subtitle}>{eventObj.Invitation[selectedInvite].InvitationCode}</Text>
                                    {UIElements.drawGap(20)}
                                    <Text allowFontScaling={false} style={[styles.subtitle,{alignSelf:'flex-start'}]}>{i18n.t('dear')} {eventObj.Invitation[selectedInvite].InvitationToName},</Text>
                                    <Text allowFontScaling={false} style={[styles.subtitle,{alignSelf:'flex-start',textAlign:'left'}]}>{i18n.t('dearnote')}</Text>
                                    
                                    <View style={{width:'100%',alignSelf:'center'}}>
                                    <RenderHtml
                                    defaultTextProps={{allowFontScaling:false}}
                                    baseStyle={{
                                        textAlign:'left',
                                        fontFamily:'Cairo-Regular',
                                        fontSize:widthPercentageToDP(3.5),
                                        lineHeight:widthPercentageToDP(5.5),
                                        marginTop:-heightPercentageToDP(0.02),
                                        marginBottom:-heightPercentageToDP(0.15),
                                        color:Colors.black,
                                        width:'100%',
                                        
                                    }}
                                    contentWidth={widthPercentageToDP(100)}
                                    GenericPressable={ (evt, href) => {
                                        if(Tools.stringIsContains(href,WebServices.appurl)){
                                        }else{
                                            Linking.openURL(href); 
                                        }}}
                                        systemFonts={systemFonts} 
                                        tagsStyles={{
                                            p: {
                                                fontSize:widthPercentageToDP(3.5)
                                                ,lineHeight:widthPercentageToDP(5.5),
                                                fontFamily:'Cairo-Regular',
                                                marginTop:-heightPercentageToDP(0.02),
                                                marginBottom:-heightPercentageToDP(0.15),
                                                color:Colors.black,
                                                width:'100%',
                                            },
                                        }}
                                        source={{ html:("<p>"+((eventObj.Invitation[selectedInvite].CustomDetailsEn.length>0)?
                                        (i18n.locale=='ar'?eventObj.Invitation[selectedInvite].CustomDetailsAr:
                                        eventObj.Invitation[selectedInvite].CustomDetailsEn):
                                        (i18n.locale=='ar'?eventObj.DescriptionAr:eventObj.DescriptionEn))+"</p>")}}
                                        /></View> 
                                       
                                            {UIElements.drawGap(10)}
                                            
                                            </View>
                                            {UIElements.drawGap(10)}
                                            </ViewShot>
                                        }
                                         */}
                                        </View>
                                        {UIElements.drawGap(15)}
                                        {addInvite&&inviteState==1&&<View style={{width:'80%',justifyContent:'space-between',flexDirection:'row',alignSelf:'center'}}>
                                        <TouchableOpacity onPress={()=>{
                                            shareInvite();
                                        }}  style={[styles.buttonView,{}]}>
                                        <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('share')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                            setAddInvite(false);
                                            setInviteState(0);
                                        }} style={[styles.buttonView,{}]}>
                                        <Text allowFontScaling={false} style={styles.buttonText}>{i18n.t('close')}</Text>
                                        </TouchableOpacity>
                                        </View>}
                                        </KeyboardAvoidingView>
                                        </Modal>}
                                        </View></View>
                                        )
                                    }
                                    
                                    
                                    
                                    