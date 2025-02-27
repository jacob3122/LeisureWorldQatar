import React, { Component, useEffect, useState } from 'react'
import {TouchableOpacity,Image,SafeAreaView, TouchableWithoutFeedback,View,Text,StyleSheet, RefreshControl, ScrollView, Modal, StatusBar} from 'react-native'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Colors from '../../Tools/constants/Colors';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'

import backButton from '../../assets/Icons/back.png'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { PureComponent } from 'react';
import moment from'moment'
import * as Tools from '../../Tools/Components/Tools'
import locationIcon from '../../assets/Icons/loca.png'
import * as UIElements from '../../Tools/Components/UIElements'

// import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import * as Tools from '../../Tools/Components/Tools'
import itemsButton from '../../assets/Icons/event.png'
import WebServices from '../../Tools/constants/WebServices';
import EventsData from '../../Data/Events.json';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function EventsPage(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [showEvent, setShowEvent] = useState(false);
    const [selectedItem, setSelectedItem] = useState(0);
    const [loaded, setLoaded] = useState(1);
    const [accessToken] = useState(state.accessToken === undefined ? props.route.params.accessToken : state.accessToken);
    const [profile] = useState(state.profile);
    const [refreshing, setRefreshing] = useState(false);
    const [eventObjs, setEventObjs] = useState({});
    const [eventObj, setEventObj] = useState({});
    const [orderObj,setorderObj]=useState(undefined);
    useEffect(()=>{
        logScreenViewEvent("EventPage","Events");
        onDataLoad();
        fetchEvents();
    },[]);
    
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
            fetchEvents();
        }
        const fetchEvent=(_eventID)=>{
            updateLoad(true);
            var orders=WebServices.getEvents.replace("{MemberID}",accessToken.MemberID).replace("{PNR}",_pnr)
            fetch (WebServices.MainURL+orders,{
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                updateLoad(false);
                // console.log("Order"+responseJson)
                var responseObj=JSON.parse(responseJson);
                setorderObj(responseObj);
                setShowEvent(true);
                
            }).catch((error) =>{
                // console.log(error)
                updateLoad(false);
            });
        }
        const fetchEvents=()=>{
            var loading=props.updateLoading;
            loading(true);
            var orders=WebServices.getEvents.replace("{MemberID}",accessToken.MemberID)
            // console.log(WebServices.MainURL+orders);
            fetch (WebServices.MainURL+orders,{
                method: 'GET',
                headers: {
                    'Authorization':'Bearer '+accessToken.access_token,
                    'Content-Type': 'application/json',
                },
            },5000)
            .then((response) => response.text())
            .then((responseJson) => {
                loading(false);
                var openEvent=undefined;
                // console.log(responseJson)
                var responseObj=JSON.parse(responseJson);
                if(Tools.stringIsEmpty(responseObj.Error)){
                    setEventObjs(responseObj);
                        // console.log("OPen :"+props.OpenEvent);
                        // console.log("All"+JSON.stringify(eventObjs));
                        
                        openEvent= responseObj.filter((item)=>(item.Id==props.OpenEvent));
                        if(openEvent!=undefined&&openEvent.length>0){
                            props.navigation.navigate('event',{event:openEvent[0],updateLoading:props.updateLoading,updateData:updateData,accessToken:accessToken});
                        }
                    
                }else{
                    loading(false);
                }
                
            }).catch((error) =>{
                // console.log(error)
                loading(false);
            });
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
        }
        const getItems=(_order)=>{
            for(var t=0;t<_order.length;t++){
            }
        }
        const updateLoad=(_state)=>{
            var loading=props.updateLoading;
            loading(_state);
        }
        const updateData=(_eventData)=>
        {
            setEventObj(_eventData);
        }
        useEffect(()=>{
                i18n.locale=global.locale;
            },[global.locale])
        const getEvents=()=>{
            events=[];
            if(eventObjs!==undefined){
                for(var t=0;t<eventObjs.length;t++){
                    const dataIn=eventObjs[t];
                    events.push(
                        <TouchableOpacity style={{backgroundColor:Colors.whiteColor,borderRadius:15,padding:15,marginTop:15,width:'100%',opacity:dataIn.Active?1:0.5}}
                        onPress={()=>{
                            const _t=t;
                            const _dataIn=dataIn;
                            props.navigation.navigate('event',{event:_dataIn,updateLoading:props.updateLoading,updateData:updateData,accessToken:props.accessToken});
                            
                        }}>
                        <View style={{flexDirection:'row'}}>
                        <Image style={{width:heightPercentageToDP(6),height:heightPercentageToDP(6),alignSelf:'center',tintColor:Colors.blueColor,marginEnd:10}} source={itemsButton}/>
                        <View style={{flex:1,alignSelf:'center'}}>
                        <Text numberOfLines={2} allowFontScaling={false} style={[styles.title]}>{i18n.locale=='ar'?eventObjs[t].EventNameAr:eventObjs[t].EventNameEn}</Text>
                        
                        {/* {getItems(orderObjs[t])} */}
                        </View>
                        </View>
                        {UIElements.drawGap(5)}
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('date')}:</Text>
                        <Text allowFontScaling={false} style={styles.subtitle}>{moment(eventObjs[t].StartDate).format('DD-MM-YYYY hh:mm a')}</Text></View>
                        <View style={{flexDirection:'row'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('totalInvites')}:</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{eventObjs[t].TotalInvitations}</Text></View>
                        <View style={{flexDirection:'row',width:'100%'}}><Text allowFontScaling={false} style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('remainInvites')}:</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{eventObjs[t].TotalInvitations-eventObjs[t].Invitation.length}</Text>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignSelf:'flex-end',flex:1}}>
                        <Image resizeMode='contain' style={{width:widthPercentageToDP(5),height:widthPercentageToDP(5),tintColor:Colors.blueColor}} source={locationIcon}/>
                        <Text style={styles.subtitle} allowFontScaling={false}>{i18n.locale=='ar'? eventObjs[t].LocationNameAr:eventObjs[t].LocationName}</Text>
                        </View></View>
                        </TouchableOpacity>
                        )
                    }
                }
                return events;
            }
            const getAllOrderItems=()=>{
                order=[]
                if(!Tools.stringIsEmpty(orderObj.ItemList)){
                    for(let t=0;t<orderObj.ItemList.length;t++){
                        var currenItem=orderObj.ItemList[t];
                        order.push(<View style={{borderBottomColor:Colors.black,borderBottomWidth:2,marginTop:'1%',marginBottom:'1%'}}>
                        <Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',fontSize:widthPercentageToDP('4%'),alignSelf:'flex-end'}]}>{"Item "+(t+1)}</Text>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('productid')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.ProductCode}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('productname')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.ProductName}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('quantity')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.Quantity}</Text></View>
                        <View style={{flexDirection:'row'}}><Text style={[styles.subtitle,{fontFamily:'Cairo-Bold',marginEnd:'2%'}]}>{i18n.t('amount')}</Text>
                        <Text allowFontScaling={false} style={[styles.subtitle]}>{currenItem.TotalAmount}</Text></View>
                        </View>)
                    }
                }
                return order;
            }
            const styles = StyleSheet.create({
                subtitle:{
                    color:Colors.black,
                    
                    fontFamily:'Cairo-Regular',
                    fontSize:widthPercentageToDP(3.5),
                },
                title:{
                    color:Colors.black,
                    textAlign:'left',
                    marginTop:'2%',
                    fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(5),
                    lineHeight:widthPercentageToDP(7.75)
                },
                tagline:{
                    color:Colors.black,
                    textAlign:'left',
                    
                    fontFamily:'Cairo-Bold',
                    // fontFamily:'Cairo-Bold',
                    fontSize:widthPercentageToDP(7),
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
                    fontSize:widthPercentageToDP(4),
                    lineHeight:widthPercentageToDP(4)*1.5,
                    flexWrap:'wrap',
                    alignSelf:'center',
                }
            });
            
            return (
                <View style={{flex:1,backgroundColor:Colors.bgColor}}>
                <BackgroundWall/>
                <SafeAreaView style={{width:'90%',height:'100%',alignSelf:'center',marginTop:StatusBar.currentHeight}}>
                <TouchableOpacity style={{}} onPress={()=>{
                    setLoaded(0);
                    props.navigation.popToTop()}}>
                    <Image style={{tintColor:Colors.blueColor,width:25,height:25,marginTop:heightPercentageToDP(1),transform:[{scaleX:Tools.stringIsContains(i18n.locale,'en')?1:-1}]}} source={backButton}/>
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.tagline}>
                    {i18n.t('myevents')}
                    </Text>
                    <Text allowFontScaling={false} style={[styles.storedesc,{paddingTop:'2%'}]}>{i18n.t("eventsdesc")}</Text>
                    <ScrollView 
                    contentContainerStyle={styles.homeScrollView}
                    style={styles.homeView}
                    showsVerticalScrollIndicator = {false}
                    refreshControl={refreshControl()}>
                    {getEvents()}
                    </ScrollView>
                    </SafeAreaView>
                    </View>
                    )
                }
                
                
                