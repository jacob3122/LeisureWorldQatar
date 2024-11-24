import React, { Component, useEffect, useRef } from 'react'
import {View,ScrollView,StyleSheet,Text,Platform,TextInput,TouchableOpacity,RefreshControl,Image,PixelRatio, SafeAreaView, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import moment from'moment'
import * as UiElements from '../../Tools/Components/UIElements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP} from 'react-native-responsive-screen';
// import bgred from '../../assets/card/blue.png';
import camerabarIcon from '../../assets/Icons/camerabar.png'

import {I18n} from 'i18n-js';
import translations from '../../assets/Localization/Localize.json'
const i18n = new I18n(translations);
import BarcodeScan from '../../Tools/Components/BarcodeScan';

import * as Tools  from '../../Tools/Components/Tools';


import {Dimensions } from "react-native";
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
import LoadingLine from '../../Tools/Components/LoadingLine';
import { useTheme } from '../../Tools/context/ThemeProvider';
import BackgroundWall from '../../Tools/Components/BackgroundWall';
import CardTopBar from '../../Tools/Components/CardTopBar';
import { logScreenViewEvent } from '../../Tools/Analytics/AppAnalytics';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { useAppContext } from '../../src/js/reducers/AppReducer';

export default function ClaimsHandlePop(props){
    const Colors=useTheme();
    let _myScroll=ScrollView;
    ScrollRefs=React.createRef();
    const { state, dispatch } = useAppContext();
    i18n.translations = state.i18ntranslation;
    const [loading, setLoading] = useState(true);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [cameraView, setCameraView] = useState(false);
    const [claimNo, setClaimNo] = useState('');
    const [claimCheck,setClaimCheck] = useState(props.claimCheck);
    const [showDate, setShowDate] = useState(false);
    const [refreshing, setRefreshing] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    
    const textInputClaimNo = useRef(undefined);
    
    const onNavigatorEvent=()=>{
        // console.info(props.profile.FirstName);
        if(Tools.IsNull(props.profile)){
            props.navigation.navigate('Home',{pagetodivert:undefined});
        }
    }
    
    useEffect(()=>{
        // console.log(claimCheck+"//"+props.claimCheck)
        setClaimCheck(props.claimCheck);
    },[props.claimCheck])
    
    useEffect(()=>{
        logScreenViewEvent("ClaimsHandle","Claims");
        if(global.selectedPage===undefined)
        global.selectedPage=0;
        setShowHistory((global.selectedPage!=0?true:false))
        Tools.updateRatePoints(1);
        let claimUpdate=props.claimprofile;
        claimUpdate();
        // setTimeout(()=>{refs.scrollview.scrollTo({x: selectedPage*(width-20), y: 0, animated: false})},1000);
    },[])
    
    
    
    useFocusEffect(
        React.useCallback(() => {
            onNavigatorEvent();
        }, [])
        );
        
        const handler=(someValue)=>{
            // console.log(ScrollRefs);
            global.selectedPage=someValue;
            ScrollRefs.current.scrollTo({x: someValue*(width-20), y: 0, animated: true});
        }
        
        const _contentViewScroll = (e) => {
            const scrolled =(e.nativeEvent.contentOffset.x);
            const position = (scrolled > 0) ? scrolled / width : 0;
            global.selectedPage=Math.round(position);
            
        }
        
        const setLoadingState=(stateP)=>{
            setLoading(stateP);
        }
        
        const performActionWithTime=(callback,params,timeTaken)=>{
            setTimeout(() => {callback(params)},timeTaken);
        }
        
        const getDate=()=>{
            return(
                <View>
                <View style={[styles.inputView,{flexDirection:'column',justifyContent:'center'}]}>
                <Text allowFontScaling={false} style={[styles.dateValue,{color:(showDate?'grey':'black')}]} onPress={()=>{
                    setShowDate(true);
                }}>{chosenDate.getDate()}/{chosenDate.getMonth()+1}/{chosenDate.getFullYear()}</Text></View>
                </View>
                )
            }
            
            const updateInvoice=(value)=>{
                if(!Tools.stringIsEmpty(value))
                setClaimNo(value);
                setCameraView(false);            
            }
            
            
            const checkCamera=()=>{
                if(cameraView){
                    return(
                        <BarcodeScan navigation={props.navigation} onScanDone={updateInvoice}/>
                        );
                    }else{
                        return(
                            <View style={{flex:1}}>
                            {updateClaimPage()}
                            </View>
                            )
                        }
                    }
                    
                    const updateClaimPage=()=>{
                        return(<View style={{height:'100%',width:'100%'}}>
                        <View style={styles.fullPart}>
                        <View style={[styles.bottompart,{justifyContent:'center'}]}>
                        <View style={{alignSelf:'center'}}>
                        <View style={{backgroundColor:Colors.bgColor,borderRadius:widthPercentageToDP(4),width:widthPercentageToDP(82),justifyContent:'center',padding:widthPercentageToDP(4)}}>
                        <View style={[styles.shadow,{ height:heightPercentageToDP(4.75), flexDirection:'row'
                        ,borderColor:Colors.whiteColor,backgroundColor:Colors.whiteColor,alignContent:'center',
                        borderRadius:heightPercentageToDP(4.75),alignSelf:'center',width:widthPercentageToDP(70),justifyContent:'center'}]}>
                        <TextInput allowFontScaling={false} style ={[styles.inputValue,{textAlign:'center',alignSelf:'flex-end',textAlignVertical:'center',
                    }]}
                    ref={textInputClaimNo}
                    placeholderTextColor={Colors.placeholdertext}
                    editable={true}
                    // onEndEditing={(text)=>{ClaimPoints()}}
                    value={claimNo}
                    onChangeText={(text) => {
                        setClaimNo(text);
                    }}
                    keyboardType='default'
                    returnKeyType='done'
                    placeholder={i18n.t('typeinvoiceno')}>
                    </TextInput>
                    </View>
                    <Text style={{color:Colors.blueColor,alignSelf:'center',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(4)}}>{i18n.t('or')}</Text>
                    
                    <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{
                        setCameraView(!cameraView);
                        // setState({cameraView:!cameraView})
                    }}><Image style={{tintColor:Colors.black,width:widthPercentageToDP(11),height:widthPercentageToDP(11)}} resizeMode='contain' source={camerabarIcon}/></TouchableOpacity>
                    <View style={{position:'absolute',alignSelf:'center',bottom:0,height:heightPercentageToDP(1),width:'100%'}}>
                    {claimCheck&&<LoadingLine visibleText={false} loadBar={{backgroundColor:Colors.bluedarkShadeColor}} />}</View>
                    <Text style={{color:Colors.black,alignSelf:'center',fontFamily:'Cairo-Regular',fontSize:widthPercentageToDP(3.5),includeFontPadding:false,lineHeight:widthPercentageToDP(3.5)*1.45}}>{i18n.t('scaninvoicebarcode').toUpperCase()}</Text>
                    {/* {!props.claimCheck&&UiElements.drawGap(hp(4.75))} */}
                    <TouchableOpacity disabled={claimNo.length<5} style={{opacity:claimNo.length<5?0.5:1, flexDirection:'row',justifyContent:'center',
                    marginTop:heightPercentageToDP(0.5),
                    backgroundColor:Colors.blueColor,height:heightPercentageToDP(4.5),borderRadius:heightPercentageToDP(4.5)
                    ,alignSelf:'center'}} onPress={()=>{ClaimPoints()}} >
                    <Text allowFontScaling={false} numberOfLines={1} style={styles.buttontxt}>{i18n.t('submit')}</Text>
                    </TouchableOpacity>
                    </View></View>
                    </View>
                    <View style={{height:heightPercentageToDP(34)}}>
                    {UiElements.drawGap(heightPercentageToDP(1))}
                    {/* <View style={{flexDirection:'row'}} >  */}
                    {/* <Image source ={historyB} style={styles.history}></Image> */}
                    {/* <Text  allowFontScaling={false} numberOfLines={1} style={styles.historytxt}>{i18n.t('claimshistory')}</Text></View> */}
                    {/* <TouchableOpacity onPressIn={()=>{props.navigation.goBack();}}>
                    <Image source={proceedB} style={styles.backbut} ></Image>
                </TouchableOpacity> */}
                
                
                <ScrollView style={styles.viewTransfer}
                showsVerticalScrollIndicator={false}
                refreshControl={refreshControl()}
                >
                {getTransfers()}
                
                </ScrollView>
                </View>
                </View>
                {/* <TouchableOpacity onPressIn={()=>{setState({showHistory:false})
                global.selectedPage=0}}>
                <Image source={proceedB} style={styles.backbut} ></Image>
            </TouchableOpacity> */}
            </View>
            );
        }
        
        const ClaimPoints=()=>{
            setClaimCheck(true);
            let claimReq=props.claimpoint;
            claimReq(claimNo);
            textInputClaimNo.current.clear();
        }
        
        const refreshControl=()=>{
            return (
                <RefreshControl
                tintColor={Colors.bluedarkShadeColor}
                refreshing={refreshing&&props.claims==undefined}
                onRefresh={()=>refreshListView()} />
                )
            }
            
            const refreshListView= ()=> {
                let claimUpdate=props.claimprofile;
                claimUpdate();
                
                setTimeout(()=>{
                    setRefreshing(false);
                    // setState({refreshing: false});
                    // setState({selectedPage:1})
                },500);
            }
            
            const getTransfers=()=>{
                if(props.profile==undefined||(props.profile!=undefined&&(Tools.IsNull(props.claims)))){
                    return(
                        <View>
                        {UiElements.drawGap(10)}
                        <Text allowFontScaling={false} style={styles.simplelabel} >
                        {i18n.t('noclaim')}
                        </Text>
                        <TouchableOpacity style={styles.tryagain} onPress={()=>{refreshListView()}}>
                        <Text allowFontScaling={false} style={styles.tryagaintext}>{i18n.t('tryagain')}</Text>
                        </TouchableOpacity></View>);
                    }else{
                        return(
                            <View style={{}}>
                            
                            {getRedeems()}
                            </View>
                            );
                        }
                    }
                    const getRedeems=()=>{
                        transactionsArray=[];
                        if(props.claims!==undefined&&props.claims.length>0){
                            claimTransaction=(props.claims.length>1)?(props.claims.sort((a,b)=>((new Date(b.InvoiceDate)-new Date(a.InvoiceDate))))):props.claims;
                            // console.log(claimTransaction)
                            for(let t=0;t<claimTransaction.length;t++){
                                transactionsArray.push(
                                    <View key ={t} style={{}}>
                                    <View style={styles.rowTView}>
                                    <View style={{justifyContent:'center',alignSelf:'center',width:'30%'}}>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{alignSelf:'center',fontSize:widthPercentageToDP(5),lineHeight:widthPercentageToDP(5)*1.25,fontFamily:'Cairo-Bold',}]}>{claimTransaction[t].Points}</Text>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{alignSelf:'center',marginTop:-5}]}>{i18n.t('points')}</Text>
                                    </View>
                                    <View style={{width:'70%'}}>
                                    <View style={{flexDirection:'row'}}>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{i18n.t('claimedon')+" : "}</Text>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{moment(claimTransaction[t].InvoiceDate).format('DD/MM/YYYY') }</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{i18n.t('invoiceno')+" : "}</Text>
                                    <Text allowFontScaling={false} style={[styles.pointtxt]}>{claimTransaction[t].InvoiceNumber}</Text>
                                    </View>
                                    {/* <Text allowFontScaling={false} style={[styles.pointtxt,
                                    {flex:1}]}>{"Paid : "+claimTransaction[t].PaidAmount+" QAR "}</Text> */}
                                    
                                    <View style={{flexDirection:'row'}}>
                                    <Text allowFontScaling={false} style={[styles.pointtxt,{}]}>{i18n.t('expiringon')+" : " }</Text>
                                    <Text allowFontScaling={false} style={[styles.pointtxt]}>{moment(claimTransaction[t].ExpiryDate).format('DD/MM/YYYY') }</Text>
                                    </View></View>
                                    </View>
                                    {UiElements.drawLine(Colors.yellowShadeColor,'90%',heightPercentageToDP(.075),{  
                                        shadowColor:Colors.yellowShadeColor,
                                        shadowOffset: { width: 3, height: 3 },
                                        shadowRadius: 3,
                                        shadowOpacity: 0.5,})}
                                        {UiElements.drawGap(5)}
                                        </View>
                                        );
                                    }
                                    
                                    
                                    return(transactionsArray);
                                }else{
                                    return(
                                        <ActivityIndicator
                                        size='large'
                                        color={Colors.bluelightShadeColor}/>
                                        )
                                    }
                                }
                                
                                const getLoading=()=>{
                                    return(
                                        <View>
                                        {/* <Loader active pRows={3} pWidth={["100%", 200, "25%", 45]} /> */}
                                        {UiElements.drawGap(10)}
                                        {/* <Loader active pRows={2} pWidth={["100%", 200, "25%", 45]} /> */}
                                        </View>
                                        )
                                    }
                                    
                                    const styles = StyleSheet.create({
                                        viewTransfer:{
                                            alignSelf:'center',
                                            width:'90%',
                                            // height:'84%',
                                        },
                                        fullPart:{
                                            borderRadius:widthPercentageToDP(4),
                                            backgroundColor:Colors.whiteColor,
                                            width:('100%'),
                                            alignSelf:'center',
                                        },
                                        bottompart:{
                                            paddingTop:heightPercentageToDP(2),
                                            width:('100%'),
                                            alignSelf:'center',
                                        },
                                        totalView:{
                                            alignSelf:'center',
                                            justifyContent:'center',
                                            // borderRadius:widthPercentageToDP(3),
                                            // backgroundColor:Colors.bluelightShadeColor
                                        },
                                        proceedTouch:{
                                            position:'absolute',
                                            right:0,
                                            top:0,
                                            // borderWidth:2,
                                            // marginLeft:'85%',
                                            // alignSelf:'flex-end',
                                            // borderWidth:1,
                                            justifyContent:'center',
                                            height:60,
                                            width:60,
                                            flexDirection:'column'
                                        },shadow:{
                                            shadowOffset: { width: 0, height: 3 },
                                            shadowRadius: 3,
                                            shadowOpacity: 0.12,
                                        },
                                        backbut:{
                                            tintColor:Colors.blueColor,
                                            position:'absolute',
                                            alignSelf:'center',
                                            width:20,
                                            height:20,
                                            zIndex:10,
                                        },
                                        proceed:{
                                            alignSelf:'center',
                                            width:30,
                                            height:30,
                                        },
                                        scanbarB:{
                                            alignSelf:'flex-start',
                                            // marginLeft:40,
                                            marginRight:10,
                                            width:60,
                                            height:60,
                                        },
                                        history:{
                                            marginStart:10,
                                            alignSelf:'center',
                                            width:40,
                                            height:40,
                                        },
                                        historytxt:{
                                            textAlign:'left',
                                            paddingHorizontal:widthPercentageToDP(4),
                                            paddingTop:10,
                                            // alignSelf:'left',
                                            color:Colors.whiteColor,
                                            fontFamily:'Cairo-Regular',
                                            fontSize: 22,
                                            // textTransform:'uppercase',
                                            lineHeight:22*1.3
                                        },
                                        dateValue:{
                                            fontSize: 16,
                                            fontFamily:'Cairo-Bold',
                                            width:'100%',
                                            
                                            // borderWidth:2,
                                        },
                                        inputView:{
                                            flex:1,
                                            // borderWidth:1,
                                            flexDirection:'column',
                                            alignItems:'flex-start',
                                            alignContent:'flex-start',
                                        },
                                        gradStyle:{
                                            position:'absolute',
                                            width:width,
                                            height:height,
                                            zIndex:-1,
                                            // borderRadius:15,
                                        },
                                        tabItem:{
                                            flex:1,
                                            height:45,zIndex:3
                                        },
                                        
                                        rowTView:{
                                            padding:10,
                                            width:'90%',
                                            alignSelf:'center',
                                            justifyContent:'center',
                                            flexDirection: 'row',
                                            zIndex:2,
                                        },
                                        pointtxt:{
                                            zIndex:2,
                                            fontSize: 13,
                                            lineHeight:13*1.35,
                                            // fontWeight: '600',
                                            color:Colors.black,
                                            fontFamily:'Cairo-Regular',
                                            textAlign:Tools.stringIsContains(i18n.locale,'ar')?'right':'left'
                                        },
                                        inputValue: {
                                            height:heightPercentageToDP(4.75),
                                            borderRadius:heightPercentageToDP(4.75),
                                            // height:AdaptiveWidth(7.5),
                                            color: Colors.inputfontColor,
                                            fontFamily:'Cairo-Regular',
                                            fontSize:17,
                                            alignSelf:'center',
                                            padding:5,
                                            // fontSize: AdaptiveWidth(15),
                                        },
                                        homeView: {
                                            // borderWidth:2
                                        },detailstitle:{
                                            flexWrap:'wrap',
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
                                            width:widthPercentageToDP(20),
                                            backgroundColor:Colors.tealGreen,
                                            alignItems:'center',
                                            alignSelf:'center',
                                            justifyContent:'center',
                                            
                                            height:widthPercentageToDP(12),
                                            borderRadius:widthPercentageToDP(4)
                                        },
                                        claimBut:{
                                            borderRadius:6,
                                            alignSelf:'center',
                                            width:12,
                                            height:12,
                                            backgroundColor:Colors.blueColor
                                        },
                                        heading: {
                                            textAlign:'left',
                                            fontSize: 40,
                                            fontFamily:'Cairo-Bold'
                                        },
                                        
                                        subheading: {
                                            flex:0.5,
                                            textAlign:'center',
                                            fontSize: 15,
                                            fontWeight: '200',
                                            color:Colors.violetColor,
                                            fontFamily:'Cairo-Regular'
                                        },
                                        simplelabel: {
                                            includeFontPadding:false,
                                            textAlign:'center',
                                            fontSize: 15,
                                            fontWeight: '100',
                                            color:Colors.blueColor,
                                            fontFamily:'Cairo-Regular'
                                        }, buttontxt: {
                                            includeFontPadding:false,
                                            marginHorizontal:widthPercentageToDP(5),
                                            alignSelf:'center',
                                            textAlignVertical:'center',
                                            textAlign:'right',
                                            fontSize: 16,
                                            fontWeight: '100',
                                            color:Colors.whiteColor,
                                            fontFamily:'Cairo-Regular'
                                        },container: {
                                            // flex:1,
                                            // borderWidth:2
                                        },
                                        view1: {
                                            margin: 10,
                                            width: width - 40,
                                            height: height-250,
                                            borderRadius: 10,
                                            // borderWidth:1
                                        },
                                        tryagain:{
                                            margin:10,
                                            height:35,
                                            borderRadius:15,
                                            backgroundColor:Colors.blueColor,
                                            justifyContent:'center',
                                            alignSelf:'center',
                                            alignContent:'center',
                                            width:150,
                                        },
                                        tryagaintext:{
                                            includeFontPadding:false,
                                            alignSelf:'center',
                                            color:Colors.whiteColor,
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
                                            fontFamily:'Cairo-Regular'
                                        },bgImage:{
                                            position:'absolute',
                                            alignSelf:'center',
                                            width:'100%',
                                            height:height,
                                            resizeMode:'contain'
                                        },
                                        
                                    });
                                    buttonsInit = [i18n.t('submitclaim'),i18n.t('claimshistory')];
                                    return (
                                        <View style={{flex:1,width:"100%"}}>
                                        <View style={{flex:1}}>
                                        <View style={[styles.totalView,{}]}>
                                        {checkCamera()}
                                        </View>
                                        </View>
                                        </View>
                                        )
                                    }
                                    