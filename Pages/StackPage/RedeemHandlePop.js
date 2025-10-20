import React, { Component, useEffect, useState } from 'react'
import {View,ScrollView,StyleSheet,Text,RefreshControl,TouchableOpacity,Image,FlatList, PixelRatio,SafeAreaView, ActivityIndicator} from 'react-native';
// import Loader from 'react-native-easy-content-loader';
import * as UiElements from '../../Tools/Components/UIElements'
import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
// import Gradient from 'react-native-css-gradient';
// import Colors from '../../Tools/constants/Colors';
// import Voucher from '../../Tools/Components/Voucher';
// import ButtonGroup from '../../Tools/Components/ButtonGroup';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import moment from'moment'
// import bgred from '../../assets/card/blue.png';
import SVGbg from'../../assets/bg/Circles-Pattern.svg'
import backButton from '../../assets/Icons/back.png'

import RedeemVenue from './RedeemVenue';

// import cardbgB from '../../assets/card/carddeb.png';

import StatusTracker from '../../Tools/Components/StatusTracker';
import HeaderLogo from '../../Tools/Components/HeaderLogo';
// import BackButton from '../../Tools/Components/BackButton';
import * as Tools from '../../Tools/Components/Tools.js'
import historyB from '../../assets/Icons/history.png'
import OverlayLoad from '../../Tools/Components/OverlayLoad.js';

import {Dimensions } from "react-native";
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import { useTheme } from '../../Tools/context/ThemeProvider';
import RedeemVoucherPop from './RedeemVoucherPop';
import RedeemVenuPop from './RedeemVenuPop';
const { height } = Dimensions.get('window');
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useFocusEffect } from '@react-navigation/native';
import { useAppContext } from '../../src/js/reducers/AppReducer.js';
const { width } = Dimensions.get('window');
// import { NavigationEvents } from 'react-navigation';

export default function RedeemHandlePop(props){
    const Colors=useTheme();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    let loaded=false;
    let _myScroll=ScrollView;
    const [loading, setLoading] = useState(true);
    const [redeemStage, setRedeemStage] = useState(0);
    const [refreshing, setRefreshing] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [redeemVoc, setRedeemVoc] = useState({});
    const [voucherInfo, setVoucherInfo] = useState(undefined);
    const [selectedVenue, setSelectedVenue] = useState(undefined);
    const [redeemState, setRedeemState] = useState({
        title: i18n.t('choosevenue'),
        stage: 0,
    });
    
    // useFocusEffect(()=>{
    //     // onNavigatorEvent();
    // })
    useFocusEffect(
        React.useCallback(() => {
            onNavigatorEvent();
        }, [])
      );
    
    onNavigatorEvent=()=> {
        // console.info(props.profile.FirstName);
        if(Tools.IsNull(props.profile)){
            props.navigation.navigate('Home',{pagetodivert:undefined});
        }else{
            resetPage();
        }
    }
    
    
    useEffect(()=>{
        logScreenViewEvent("RedeemHandle","Redeem")
        
        refreshListView();
        
        if(global.selectedRedeemPage===undefined)
        global.selectedRedeemPage=0;
        
        Tools.updateRatePoints(1);
        
        // setShowHistory(global.selectedRedeemPage!=0?true:false)
        // console.log("RE"+props.profile);
        // resetPage();
    },[])
    
    
    
    const performActionWithTime=(callback,params,timeTaken)=>{
        setTimeout(() => {callback(params)},timeTaken);
    }
    
    
    const handler=(someValue)=> {
        // setSelectedPage(someValue);
        refs.scrollview.scrollTo({x: someValue*(width-20), y: 0, animated: true});
    }
    const _contentViewScroll = (e) => {
        const scrolled =(e.nativeEvent.contentOffset.x);
        const position = (scrolled > 0) ? scrolled / width : 0;
        // setSelectedPage(Math.round(position))
    }
    const getTransfers=()=>{
        if(props.profile==undefined||(props.profile!=undefined&&(props.redeem==undefined||props.redeem.RedeemHistory==undefined||props.redeem.RedeemHistory.length==0))){
            return(
                <View>
                {UiElements.drawGap(10)}
                <Text allowFontScaling={false} style={styles.simplelabel} >
                {i18n.t('noredeem')}
                </Text>
                {UiElements.drawGap(10)}
                
                <TouchableOpacity style={styles.tryagain} onPress={()=>{refreshListView()}}>
                <Text allowFontScaling={false}  style={styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                </TouchableOpacity></View>);
            }else{
                
                return(
                    <View style={{borderWidth:0}}>
                    {getRedeems()}
                    </View>
                    );
                }
            }
            
            const refreshControl=()=>{
                return (
                    <RefreshControl
                    tintColor={Colors.bluedarkShadeColor}
                    refreshing={refreshing}
                    onRefresh={()=>refreshListView()} 
                    />
                    )
                }
                
                const refreshListView =()=> {
                    setLoading(true)
                    var redeemProfile=props.redeemProfile;
                    redeemProfile(()=>{
                        setRefreshing(false);
                        // setSelectedPage(1);
                    });
                    // setTimeout(()=>{
                    //     setState({refreshing: false});
                    //     setState({selectedPage:1})
                    // },500);
                }
                
                const getRedeems=()=>{
                    transactionsArray=[];
                    redeemTransaction=[];
                    redeemTransaction=props.redeem.RedeemHistory;//.filter(redeemD=>((new Date(redeemD.RedeemDate)-new Date())>0));
                    // console.log("L :"+redeemTransaction.length);
                    redeemTransaction=redeemTransaction.sort((a,b)=>((new Date(b.RedeemDate)-new Date(a.RedeemDate))));
                    // console.log("L :"+redeemTransaction.length);
                    
                    // dates.filter(d => new Date(d) - new Date() > 0);
                    for(let t=0;t<redeemTransaction.length;t++){
                        // console.log(new Date(redeemTransaction[t].RedeemDate));
                        transactionsArray.push(
                            <View key ={t} >
                            <View style={styles.rowTView}>
                            <View style={{width:'35%',justifyContent:'center'}}>
                            <Text allowFontScaling={false}  style={[styles.pointtxt,{textAlign:'center',fontFamily:'Cairo-Bold',lineHeight:16*1.24,fontSize:16}]}>{(Tools.stringIsContains(i18n.locale,"en")?redeemTransaction[t].VoucherTitleEn:redeemTransaction[t].VoucherTitleAr)}</Text>
                            </View>
                            <View style={{width:'65%',marginStart:'5%'}}>
                            <View style={{flexDirection:'row'}}>
                            <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{i18n.t('date')+' : '}</Text>
                            <Text allowFontScaling={false} style={[styles.pointtxt]}>{moment(redeemTransaction[t].RedeemDate).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                            
                            <Text allowFontScaling={false} style={[styles.pointtxt,{}
                            ]}>{i18n.t('voucherno')+' : '}</Text>
                            <Text allowFontScaling={false} style={[styles.pointtxt
                            ]}>{redeemTransaction[t].Code}</Text>
                            {/* </View>
                        <View style={styles.rowTView}> */}
                        </View>
                        {/* <View style={{flexDirection:'row'}}>
                        
                        <Text allowFontScaling={false}  style={[styles.pointtxt,{fontWeight:'bold'}]}>{i18n.t('name')+' : '}</Text>
                        <Text allowFontScaling={false}  style={[styles.pointtxt]}>{(Tools.stringIsContains(i18n.locale,"en")?redeemTransaction[t].VoucherTitleEn:redeemTransaction[t].VoucherTitleAr)}</Text>
                    </View> */}
                    <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false}  style={[styles.pointtxt,{}
                    ]}>{i18n.t('venue')+' : '}</Text>
                    <Text allowFontScaling={false}  style={[styles.pointtxt
                    ]}>{redeemTransaction[t].Venue}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{i18n.t('points')+' : '}</Text>
                    <Text allowFontScaling={false} style={[styles.pointtxt]}>{redeemTransaction[t].Points}</Text>
                    </View>
                    </View>
                    </View>
                    </View>
                    );
                }
                return(transactionsArray);
            }
            const onVenueSelected=(selectedVenue)=>{
                setRedeemState({stage:1,title:i18n.t('choosevoucher')});
                setSelectedVenue(selectedVenue);
            }
            const onConfirmVoucher=(_voucher)=>{
                setRedeemState({stage:2,title:i18n.t('venuepasscode')});
                setVoucherInfo(_voucher);
            }
            const resetPage=()=>{
                // console.log("ResetPage");
                setVoucherInfo(undefined);
                setSelectedVenue(undefined);
                setRedeemState({
                    title:i18n.t('choosevenue'),
                    stage:0
                });
                    assignprofile= props.assignProfile;
                    assignprofile("user","","");
            }
            
            const getRedeemVenues=()=>{
                if(selectedVenue==undefined){
                    alllines=[];
                    inCount=3;
                    colorsIn=[Colors.abColor,Colors.sdColor,Colors.vcColor];
                    redeemDetails=props.redeem;
                    if(redeemDetails!=null||redeemDetails!=undefined){
                        if(redeemVoc!=redeemDetails.Venues_Vouchers)
                        setRedeemVoc(redeemDetails.Venues_Vouchers);
                    }else{
                        alllines.push(<ActivityIndicator
                            size='large'
                            color={Colors.bluedarkShadeColor}/>)
                        }
                        
                        if(redeemVoc!=undefined){
                            alllines.push(
                                <FlatList 
                                removeClippedSubviews={false}
                                style={[styles.homeScrollView,{}]}
                                refreshControl={refreshControl()}
                                contentContainerStyle={{width:'100%',justifyContent:'center',alignContent:'center'}}
                                data={redeemVoc}
                                numColumns={1}
                                renderItem={({item,index}) => {
                                    return(
                                        <View style={{width:widthPercentageToDP(30),height:widthPercentageToDP(30),margin:widthPercentageToDP(2),alignSelf:'center',flexDirection: 'column'}} key={"v"+index}>    
                                        <RedeemVenue selectedVenue={onVenueSelected} venueColor={colorsIn[index]} key={"R"+index} venueInfo={redeemDetails.Venues_Vouchers[index]} navigation={props.navigation} assignProfile={props.assignProfile} 
                                        pagefrom={''} redeemPoint={props.redeemPoint}/>
                                        </View>
                                        );
                                    }}
                                    keyExtractor={(item) => item.Id.toString()}
                                    />)
                                }else{
                                    
                                }
                                return alllines;
                            }else if(voucherInfo==undefined){
                                return(<RedeemVoucherPop onConfirmVoucher={onConfirmVoucher} voucherInfo={selectedVenue} profile={props.profile} redeemPoint={props.redeemPoint} assignProfile={props.assignProfile}/>)
                            }else if(voucherInfo!=undefined){
                                return(<RedeemVenuPop redeemPoint={props.redeemPoint} resetPage={resetPage} selectedVoucher={voucherInfo}/>)
                            }
                        }
                        const updateRedeemPage=()=>{
                            return(
                                <View style={styles.redeemView}>
                                <View style={{backgroundColor:Colors.whiteColor,borderRadius:widthPercentageToDP(3),height:'90%',
                                overflow:'hidden'}}>
                                {!showHistory&&<StatusTracker selected={redeemState.stage}/>}
                                {!showHistory&&<Text allowFontScaling={false} style={[styles.RedeemTitle]}>{redeemState.title}</Text>}
                                <View
                                style={{}}>
                                {!showHistory&&getRedeemVenues()}
                                {showHistory&&<>
                                    <View style={{flexDirection:'row',justifyContent:'center'}} > 
                                    <Text  allowFontScaling={false} numberOfLines={2} style={styles.RedeemTitle}>{i18n.t('redeemhistory')}</Text></View>
                                    <ScrollView style={styles.view2}
                                    contentContainerStyle={{paddingBottom:heightPercentageToDP(6)}}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={refreshControl()}
                                    >
                                    {getTransfers()}
                                    </ScrollView>
                                    </>
                                }
                                </View>
                                </View>
                                <View style={{marginTop:heightPercentageToDP(1)}}>
                                
                                <TouchableOpacity 
                                onPress={()=>{
                                    if(voucherInfo==undefined){
                                        if(selectedVenue==undefined){
                                            
                                            if(!showHistory){
                                                setShowHistory(true);
                                                // setState({showHistory:true})
                                                global.selectedPage=1
                                            }else{
                                                setShowHistory(false);
                                                // setState({showHistory:false})
                                                global.selectedPage=0
                                                
                                            }}else{
                                                setSelectedVenue(undefined);
                                                setRedeemState({
                                                    title:i18n.t('choosevenue'),
                                                    stage:0
                                                })
                                            }
                                        }else{
                                            setVoucherInfo(undefined);
                                            setRedeemState({
                                                title:i18n.t('choosevoucher'),
                                                stage:12021
                                            })
                                        }
                                    }
                                }
                                style={{
                                    alignSelf:'center', paddingHorizontal:widthPercentageToDP(3),
                                    backgroundColor:Colors.blueColor,borderRadius:heightPercentageToDP(4.75),
                                    position:'absolute',top:heightPercentageToDP(-1),
                                    justifyContent:'center',height:heightPercentageToDP(4)}}>
                                    <Text allowFontScaling={false} lineBreakMode='head' numberOfLines={2} style={styles.redeemhis}>{showHistory?i18n.t('venues'):selectedVenue==undefined?i18n.t('redeemhistory'):i18n.t('back')}</Text>
                                    </TouchableOpacity>
                                    </View>
                                    
                                    </View>
                                    );
                                }
                                
                                const styles = StyleSheet.create({
                                    detailstitle:{
                                        textAlign:'center',
                                        alignSelf:'center',
                                        // marginTop:15,
                                        color:Colors.whiteColor,
                                        fontFamily:'Cairo-Bold',
                                        fontSize:14,
                                        lineHeight:14*1.5,
                                        textTransform:'uppercase',
                                        // lineHeight: AdaptiveWidth(18) * 1.6,
                                        // height: AdaptiveWidth(18)* 1.3,
                                    },
                                    bottomBar:
                                    {
                                        width:wp(20),
                                        backgroundColor:Colors.blueColor,
                                        alignItems:'center',
                                        alignSelf:'center',
                                        justifyContent:'center',
                                        height:wp(12),
                                        borderRadius:wp(4)
                                    },
                                    claimBut:{
                                        borderRadius:6,
                                        alignSelf:'center',
                                        width:12,
                                        height:12,
                                        backgroundColor:Colors.blueColor
                                    },
                                    view2:{
                                        width:'100%',
                                        height:'100%'
                                    },
                                    totalView:{
                                        alignSelf:'center',
                                        justifyContent:'center',
                                        height:'95%',
                                        width:'93%',
                                    },
                                    history:{
                                        tintColor:Colors.bluedarkShadeColor,
                                        alignSelf:'center',
                                        width:35,
                                        height:35,
                                        marginRight:10,
                                    },
                                    historytxt:{
                                        textAlign:'left',
                                        includeFontPadding:false,
                                        textTransform:'uppercase',
                                        alignSelf:'center',
                                        color:Colors.inputfontColor,
                                        fontFamily:'Cairo-Regular',
                                        fontSize: 15,
                                        lineHeight:15*1.35,
                                        marginTop:8
                                    },
                                    homeView:{
                                        flexDirection:'column',
                                        height:'100%',width:'100%',
                                    },
                                    redeemView:{
                                        flexDirection:'column',
                                        height:"100%",
                                        width:'100%',
                                        // transform:[{scaleX:1*AdaptiveHeight(810)},{scaleY:1*AdaptiveHeight(810)}],
                                    },
                                    backbut:{
                                        position:'absolute',
                                        alignSelf:'center',
                                        width:50,
                                        height:50,
                                        // bottom:hp('36%'),
                                        bottom:hp('3%'),
                                        zIndex:2,
                                    },
                                    bgcard:{
                                        position:'absolute',
                                        resizeMode:'contain',
                                        alignSelf:'center',
                                        // aspectRatio:1417/895,
                                        // width:wp('99%'),
                                        width:wp(93),
                                        // left:0,
                                        top:'4%',
                                    },
                                    bgImage:{
                                        position:'absolute',
                                        alignSelf:'center',
                                        width:'100%',
                                        height:height,
                                        resizeMode:'contain'
                                    },
                                    scrollstyle:{
                                        height:height/5,
                                        // minHeight:height/3,
                                    },
                                    homeScrollView: {
                                        width:'100%',height:'100%'
                                    },
                                    RedeemTitle:{
                                        includeFontPadding:false,
                                        // marginLeft:25,
                                        fontSize:20,
                                        // lineHeight:20*1.4,
                                        fontFamily:'Cairo-Regular',
                                        color:Colors.inputfontColor,
                                        textAlign:'center',
                                        alignSelf:'center',
                                        // width:100,
                                        // lineHeight:26,
                                        // height:widthPercentageToDP(6),
                                        textAlignVertical:'center'
                                    },
                                    RedeemPoint:{
                                        includeFontPadding:false,
                                        fontWeight:'100',
                                        fontSize:18,
                                        fontFamily:'Cairo-Regular',
                                        color:Colors.whiteColor,
                                        textAlign:'center',
                                    },
                                    view1: {
                                        // width: width - 40,
                                        // height:height-500
                                        // borderRadius: 10,
                                        // borderWidth:2,
                                        flex:1,justifyContent:'center'
                                    },
                                    
                                    rowTView:{
                                        width:'90%', 
                                        flexDirection: 'row',
                                        paddingVertical:10,
                                        // backgroundColor:Colors.blueColor,
                                        borderBottomWidth:1,
                                        borderColor:Colors.blueColor,
                                        alignSelf:'center',
                                        // borderRadius:15,
                                        overflow:'visible',
                                        justifyContent:'center'
                                    },  
                                    inputValue: {
                                        textAlign:'left',
                                        alignItems:'center',
                                        alignContent:'center',
                                        fontSize: 20,
                                        flex:1,
                                        height:50,
                                        fontFamily:'Cairo-Bold'
                                        
                                    }, 
                                    heading: {
                                        textAlign:'left',
                                        paddingLeft:20,
                                        fontFamily:'Cairo-Regular',color:Colors.blueColor
                                    },
                                    subheading: {
                                        flex:0.5,
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '200',
                                        color:Colors.violetColor,
                                        fontFamily:'Cairo-Regular'
                                    },
                                    redeemhis: {
                                        includeFontPadding:false,
                                        textAlign:'center',
                                        fontSize: widthPercentageToDP(4),
                                        // lineHeight:19,
                                        // paddingTop:5,
                                        color:Colors.whiteColor,
                                        paddingHorizontal:widthPercentageToDP(5),
                                        fontFamily:'Cairo-Regular'
                                    },
                                    points: {
                                        // position:'absolute',
                                        alignSelf:'flex-start',
                                        paddingLeft:10,
                                        textAlign:'left',
                                        color:Colors.inputfontColor,
                                        fontFamily:'Cairo-Bold',
                                        fontSize: 35,
                                        lineHeight:35*1.4
                                    },
                                    pointtxt:{
                                        fontSize: 13,
                                        lineHeight:13*1.35,
                                        // fontWeight: 'bold',
                                        color:Colors.black,
                                        fontFamily:'Cairo-Regular',
                                        textAlign:Tools.stringIsContains(i18n.locale,'ar')?'right':'left'
                                    },
                                    simplelabel: {
                                        includeFontPadding:false,
                                        textAlign:'center',
                                        fontSize: 15,
                                        fontWeight: '100',
                                        color:Colors.inputfontColor,
                                        fontFamily:'Cairo-Regular'
                                    },container: {},
                                    tryagain:{
                                        backgroundColor:Colors.whiteColor,
                                        borderRadius:15,
                                        borderWidth:2,
                                        borderColor:Colors.bluedarkShadeColor,
                                        height:35,
                                        justifyContent:'center',
                                        alignSelf:'center',
                                        alignContent:'center',
                                    },
                                    tryagaintext:{
                                        includeFontPadding:false,
                                        paddingLeft:10,
                                        paddingRight:10,
                                        alignSelf:'center',
                                        color:Colors.bluedarkShadeColor,
                                        fontSize:15,
                                        fontWeight:'100',
                                        fontFamily:'Cairo-Regular'
                                    },claimButton:{
                                        margin:10,
                                        backgroundColor:'#1d78cb',
                                        borderRadius:10,
                                        height:60,
                                        justifyContent:'center',
                                        alignSelf:'center',
                                        alignContent:'center',
                                        width:width/1.15,
                                    },
                                    claimButtontext:{
                                        includeFontPadding:false,
                                        alignSelf:'center',
                                        color:'white',
                                        fontSize:20,
                                        fontWeight:'400',
                                        fontFamily:'Cairo-Bold'
                                    }
                                    
                                });
                                
                                return (
                                    <View style={styles.homeView}>
                                    
                                    
                                    <View style={{width:'100%',marginTop:heightPercentageToDP(1)}}>
                                    <View style={styles.totalView}>
                                    
                                    {updateRedeemPage()}
                                    </View>
                                    
                                    </View>
                                    </View>
                                    )
                                }
                                
                                
                                
                                